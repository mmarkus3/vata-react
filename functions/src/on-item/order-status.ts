import { firestore } from 'firebase-admin';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { Options } from '../options/options.interface';
import { Order, OrderProduct } from '../orders/order.interface';
import { buildStockUpdatesFromLines, StockLineAmount, StockSnapshot, StockUpdate } from '../stock/stock-adjust';

export function shouldCreateSentMail(before: Order, after: Order): boolean {
  const beforeStatus = (before as { status?: string } | undefined)?.status;
  const afterStatus = (after as { status?: string } | undefined)?.status;
  return beforeStatus !== 'sent' && afterStatus === 'sent';
}

export function shouldCreatePaidOrderNotification(before: Order | undefined, after: Order | undefined): boolean {
  const beforeStatus = before?.status;
  const afterStatus = after?.status;
  return beforeStatus !== 'paid' && afterStatus === 'paid';
}

export function getNotificationReceiverEmail(options: Options | undefined): string | null {
  const email = options?.email?.trim();
  return email ?? null;
}

function aggregateOrderProductAmounts(orderProducts: OrderProduct[]): Map<string, number> {
  const aggregated = new Map<string, number>();
  for (const line of orderProducts) {
    if (!line?.id) {
      throw new Error('Order contains invalid product reference');
    }
    const requested = line.amount;
    if (!Number.isFinite(requested) || requested <= 0) {
      throw new Error(`Invalid order amount for product ${line.id}`);
    }
    aggregated.set(line.id, (aggregated.get(line.id) ?? 0) + requested);
  }
  return aggregated;
}

export function buildPaidOrderStockUpdates(orderProducts: OrderProduct[], products: StockSnapshot[]): StockUpdate[] {
  const aggregated = aggregateOrderProductAmounts(orderProducts);
  const lines: StockLineAmount[] = Array.from(aggregated.entries()).map(([id, amount]) => ({ id, amount }));
  return buildStockUpdatesFromLines(lines, products);
}

export const onOrderUpdated = onDocumentUpdated({ document: '/orders/{orderId}', region: 'europe-north1' }, async (event) => {
  const before = event.data?.before.data() as Order | undefined;
  const after = event.data?.after.data() as Order | undefined;
  const orderId = event.params.orderId;

  if (shouldCreateSentMail(before, after)) {
    const customerEmail = after?.customer?.email?.trim();
    if (!customerEmail) {
      console.log(`Skipping sent mail for order ${orderId}: missing customer email`);
    } else {
      await firestore().collection('mail').add({
        email: customerEmail,
        order: orderId,
        created: firestore.Timestamp.now(),
      });
    }
  }

  if (!shouldCreatePaidOrderNotification(before, after)) {
    return;
  }

  const orderProducts = Array.isArray(after?.products) ? after.products : [];
  if (orderProducts.length > 0) {
    await firestore().runTransaction(async (transaction) => {
      const uniqueProductIds = Array.from(new Set(orderProducts.map((line) => line.id).filter(Boolean)));
      const productSnapshots = await Promise.all(uniqueProductIds.map(async (productId) => {
        const ref = firestore().doc(`products/${productId}`);
        const doc = await transaction.get(ref);
        if (!doc.exists) {
          throw new Error(`Product not found: ${productId}`);
        }
        const amountValue = Number((doc.data() as { amount?: unknown })?.amount);
        return {
          id: productId,
          amount: amountValue,
        };
      }));

      const updates = buildPaidOrderStockUpdates(orderProducts, productSnapshots);
      for (const update of updates) {
        const ref = firestore().doc(`products/${update.id}`);
        transaction.update(ref, { amount: update.nextAmount });
      }
    });
  }

  const companyId = after?.company?.trim();
  if (!companyId) {
    console.log(`Skipping paid-order notification for order ${orderId}: missing company`);
    return;
  }

  const optionsDoc = await firestore().doc(`options/${companyId}`).get();
  const receiverEmail = getNotificationReceiverEmail(optionsDoc.data() as Options);
  if (!receiverEmail) {
    console.log(`Skipping paid-order notification for order ${orderId}: missing options email`);
    return;
  }

  await firestore().collection('mail').add({
    email: receiverEmail,
    order: orderId,
    recieveNotification: true,
    created: firestore.Timestamp.now(),
  });
});
