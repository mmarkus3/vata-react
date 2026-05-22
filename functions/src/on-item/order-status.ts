import { firestore } from 'firebase-admin';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { Options } from '../options/options.interface';
import { Order } from '../orders/order.interface';

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
