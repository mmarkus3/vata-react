import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Product } from './product.interface';

@Injectable()
export class ProductsService {
  private static readonly THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

  private toValidDate(value: string): Date | null {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private sanitizeRetailPriceHistory(history: unknown): { price: number; changedAt: string }[] {
    if (!Array.isArray(history)) {
      return [];
    }

    return history
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }

        const rawPrice = (entry as { price?: unknown }).price;
        const rawChangedAt = (entry as { changedAt?: unknown }).changedAt;
        const price = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice);
        if (!Number.isFinite(price) || typeof rawChangedAt !== 'string') {
          return null;
        }

        const date = this.toValidDate(rawChangedAt);
        if (!date) {
          return null;
        }

        return {
          price,
          changedAt: date.toISOString(),
        };
      })
      .filter((entry): entry is { price: number; changedAt: string } => entry !== null)
      .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());
  }

  private getLowestRetailPriceLast30Days(
    retailPrice: number | null | undefined,
    retailPriceHistory: { price: number; changedAt: string }[],
    now: Date = new Date()
  ): number | null {
    const threshold = now.getTime() - ProductsService.THIRTY_DAYS_IN_MS;
    const candidates: number[] = [];

    if (typeof retailPrice === 'number' && Number.isFinite(retailPrice)) {
      candidates.push(retailPrice);
    }

    for (const entry of retailPriceHistory) {
      const date = this.toValidDate(entry.changedAt);
      if (date && date.getTime() >= threshold) {
        candidates.push(entry.price);
      }
    }

    if (candidates.length === 0) {
      return null;
    }

    return Math.min(...candidates);
  }

  private buildProduct(id: string, tax: number, product: Product) {
    const retailPriceHistory = this.sanitizeRetailPriceHistory(product.retailPriceHistory);
    const lowestRetailPriceLast30Days = this.getLowestRetailPriceLast30Days(product.retailPrice, retailPriceHistory);

    return {
      id,
      name: product.name,
      amount: product.amount,
      description_fi: product.description_fi,
      description_sv: product.description_sv,
      description_en: product.description_en,
      retailPrice: product.retailPrice,
      discountPrice: null,
      unitPrice: product.unitPrice,
      images: product.images,
      category: product.category,
      energyJoule: product.energyJoule,
      energyCalory: product.energyCalory,
      fat: product.fat,
      saturatedFat: product.saturatedFat,
      carbohydrate: product.carbohydrate,
      saturatedCarbohydrate: product.saturatedCarbohydrate,
      protein: product.protein,
      salt: product.salt,
      fiber: product.fiber,
      countryOfOrigin: product.countryOfOrigin,
      ingredients_fi: product.ingredients_fi,
      ingredients_sv: product.ingredients_sv,
      ingredients_en: product.ingredients_en,
      lowestRetailPriceLast30Days,
      tax,
    };
  }

  async getProductsByCompany(companyId: string) {
    const taxDoc = await firestore().doc(`options/${companyId}`).get();
    const docs = await firestore().collection('products').where('company', '==', companyId).get();
    const products = docs.docs.map((document) => {
      const product = document.data() as Product;
      if (product.showInWebshop === true) {
        return this.buildProduct(document.id, taxDoc.data().vat, product);
      }
    });
    return products.filter((p) => p != null);
  }

  async getProductByIdAndCompany(companyId: string, id: string) {
    const taxDoc = await firestore().doc(`options/${companyId}`).get();
    const doc = await firestore().doc(`products/${id}`).get();
    const product = doc.data() as Product;
    if (product.company !== companyId) {
      throw new BadRequestException('Company mismatch');
    }
    if (product.showInWebshop !== true) {
      throw new NotFoundException('Product not found');
    }
    return this.buildProduct(id, taxDoc.data().vat, product);
  }
}
