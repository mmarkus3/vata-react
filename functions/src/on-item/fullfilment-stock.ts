import { firestore } from 'firebase-admin';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { Fullfilment } from '../fullfilments/fullfilment.interface';
import { buildStockUpdatesByDelta, type StockLineAmount, type StockSnapshot } from '../stock/stock-adjust';


function toLines(fullfilment: Fullfilment | undefined): StockLineAmount[] {
  const products = Array.isArray(fullfilment?.products) ? fullfilment.products : [];
  return products
    .map((line) => ({
      id: (line?.product?.guid ?? ''),
      amount: (line?.amount ?? 0),
    }))
    .filter((line) => line.id.length > 0);
}

export function buildFullfilmentDelta(
  beforeLines: StockLineAmount[],
  afterLines: StockLineAmount[],
): Map<string, number> {
  const delta = new Map<string, number>();
  for (const line of afterLines) {
    delta.set(line.id, (delta.get(line.id) ?? 0) + line.amount);
  }
  for (const line of beforeLines) {
    delta.set(line.id, (delta.get(line.id) ?? 0) - line.amount);
  }
  return delta;
}

export const onFullfilmentWritten = onDocumentWritten({ document: '/fullfilments/{fullfilmentId}', region: 'europe-north1' }, async (event) => {
  const before = event.data?.before.data() as Fullfilment | undefined;
  const after = event.data?.after.data() as Fullfilment | undefined;

  const beforeLines = toLines(before);
  const afterLines = toLines(after);
  const deltaById = buildFullfilmentDelta(beforeLines, afterLines);
  const affectedIds = Array.from(deltaById.entries()).filter(([, delta]) => delta !== 0).map(([id]) => id);
  if (affectedIds.length === 0) {
    return;
  }

  await firestore().runTransaction(async (transaction) => {
    const snapshots: StockSnapshot[] = [];
    for (const productId of affectedIds) {
      const ref = firestore().doc(`products/${productId}`);
      const doc = await transaction.get(ref);
      if (!doc.exists) {
        throw new Error(`Product not found: ${productId}`);
      }
      snapshots.push({
        id: productId,
        amount: Number((doc.data() as { amount?: unknown })?.amount),
      });
    }

    const updates = buildStockUpdatesByDelta(deltaById, snapshots);
    for (const update of updates) {
      const ref = firestore().doc(`products/${update.id}`);
      transaction.update(ref, { amount: update.nextAmount });
    }
  });
});
