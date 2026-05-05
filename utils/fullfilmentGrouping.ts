import type { Fullfilment } from '@/types/fullfilment';

export interface FullfilmentByMonth {
  month: string; // Format: "MMMM YYYY"
  fullfilments: Fullfilment[];
  totalAmount: number;
}

export interface FullfilmentByProduct {
  productName: string;
  months: {
    month: string; // Format: "MMMM YYYY"
    totalAmount: number;
    fullfilments: Fullfilment[];
  }[];
  totalAmount: number;
}

export function sortByDate(a: Fullfilment, b: Fullfilment) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
};

/**
 * Groups fullfilments by month in chronological order (newest first)
 */
export function groupFullfilmentsByMonth(fullfilments: Fullfilment[]): FullfilmentByMonth[] {
  const monthMap = new Map<string, Fullfilment[]>();

  fullfilments.forEach(fullfilment => {
    const date = new Date(fullfilment.date);
    const monthKey = date.toLocaleDateString('fi-FI', { month: 'long', year: 'numeric' });

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, []);
    }
    monthMap.get(monthKey)!.push(fullfilment);
  });

  return Array.from(monthMap.entries())
    .map(([month, fullfilments]) => ({
      month,
      fullfilments: fullfilments.sort(sortByDate),
      totalAmount: fullfilments.reduce((sum, f) => sum + (f.amount || 0), 0),
    }))
    .sort((a, b) => {
      // Sort by date descending (newest first)
      const dateA = new Date(a.fullfilments[0]?.date || 0);
      const dateB = new Date(b.fullfilments[0]?.date || 0);
      return dateB.getTime() - dateA.getTime();
    });
}

/**
 * Groups fullfilments by product, then by month within each product
 */
export function groupFullfilmentsByProduct(fullfilments: Fullfilment[]): FullfilmentByProduct[] {
  const productMap = new Map<string, Fullfilment[]>();

  fullfilments.forEach(fullfilment => {
    fullfilment.products.forEach(product => {
      const productName = product.product.name;
      if (!productMap.has(productName)) {
        productMap.set(productName, []);
      }
      productMap.get(productName)!.push(fullfilment);
    });
  });

  return Array.from(productMap.entries())
    .map(([productName, fullfilments]) => {
      const monthMap = new Map<string, Fullfilment[]>();

      fullfilments.forEach(fullfilment => {
        const date = new Date(fullfilment.date);
        const monthKey = date.toLocaleDateString('fi-FI', { month: 'long', year: 'numeric' });

        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, []);
        }
        monthMap.get(monthKey)!.push(fullfilment);
      });

      const months = Array.from(monthMap.entries())
        .map(([month, monthFullfilments]) => ({
          month,
          totalAmount: monthFullfilments.reduce((sum, f) => {
            // Find the amount for this specific product in this fullfilment
            const productEntry = f.products.find(p => p.product.name === productName);
            return sum + (productEntry?.amount || 0);
          }, 0),
          fullfilments: monthFullfilments.sort(sortByDate),
        }))
        .sort((a, b) => {
          const dateA = new Date(a.fullfilments[0]?.date || 0);
          const dateB = new Date(b.fullfilments[0]?.date || 0);
          return dateB.getTime() - dateA.getTime();
        });

      return {
        productName,
        months,
        totalAmount: months.reduce((sum, month) => sum + month.totalAmount, 0),
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount); // Sort products by total amount descending
}