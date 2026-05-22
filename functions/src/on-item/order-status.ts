import { firestore } from 'firebase-admin';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { Order } from '../orders/order.interface';

export function shouldCreateSentMail(before: Order, after: Order): boolean {
  const beforeStatus = (before as { status?: string } | undefined)?.status;
  const afterStatus = (after as { status?: string } | undefined)?.status;
  return beforeStatus !== 'sent' && afterStatus === 'sent';
}

export const onOrderUpdated = onDocumentUpdated({ document: '/orders/{orderId}', region: 'europe-north1' }, async (event) => {
  const before = event.data?.before.data() as Order | undefined;
  const after = event.data?.after.data() as Order | undefined;
  const orderId = event.params.orderId;

  if (!shouldCreateSentMail(before, after)) {
    return;
  }

  const customerEmail = after?.customer?.email?.trim();
  if (!customerEmail) {
    console.log(`Skipping sent mail for order ${orderId}: missing customer email`);
    return;
  }

  await firestore().collection('mail').add({
    email: customerEmail,
    order: orderId,
    created: firestore.Timestamp.now(),
  });
});
