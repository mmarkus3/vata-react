export interface StockLineAmount {
  id: string;
  amount: number;
}

export interface StockSnapshot {
  id: string;
  amount: number;
}

export interface StockUpdate {
  id: string;
  nextAmount: number;
}

export function aggregateLineAmounts(lines: StockLineAmount[]): Map<string, number> {
  const aggregated = new Map<string, number>();
  for (const line of lines) {
    if (!line?.id) {
      throw new Error('Invalid product reference');
    }
    const amount = line.amount;
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error(`Invalid amount for product ${line.id}`);
    }
    aggregated.set(line.id, (aggregated.get(line.id) ?? 0) + amount);
  }
  return aggregated;
}

export function buildStockUpdatesByDelta(deltaByProductId: Map<string, number>, products: StockSnapshot[]): StockUpdate[] {
  const currentById = new Map(products.map((item) => [item.id, item.amount] as const));

  return Array.from(deltaByProductId.entries())
    .filter(([, delta]) => delta !== 0)
    .map(([productId, delta]) => {
      if (!currentById.has(productId)) {
        throw new Error(`Product not found: ${productId}`);
      }
      const currentAmount = Number(currentById.get(productId));
      if (!Number.isFinite(currentAmount)) {
        throw new Error(`Invalid stock amount for product ${productId}`);
      }
      const nextAmount = currentAmount - delta;
      if (!Number.isFinite(nextAmount) || nextAmount < 0) {
        throw new Error(`Insufficient stock for product ${productId}`);
      }
      return {
        id: productId,
        nextAmount,
      };
    });
}

export function buildStockUpdatesFromLines(lines: StockLineAmount[], products: StockSnapshot[]): StockUpdate[] {
  const aggregated = aggregateLineAmounts(lines);
  return buildStockUpdatesByDelta(aggregated, products);
}
