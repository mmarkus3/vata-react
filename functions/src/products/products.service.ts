import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Campaign } from '../campaigns/campaign.interface';
import { getRate } from '../currency/currency';
import { Options } from '../options/options.interface';
import { Product } from './product.interface';

@Injectable()
export class ProductsService {
  private static readonly THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
  private static readonly MAX_PERCENTAGE = 100;

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

  private resolveCampaignLinePrice(campaign: Campaign, productId: string, retailPrice: number | null | undefined): number | null {
    const line = Array.isArray(campaign?.products)
      ? campaign.products.find((entry) => entry?.id === productId)
      : null;

    if (!line) return null;

    if (campaign?.discountType === 'fixed') {
      const fixed = typeof line.discountFixed === 'number' ? line.discountFixed : Number(line.discountFixed);
      if (!Number.isFinite(fixed) || fixed <= 0) return null;
      return fixed;
    }

    if (campaign?.discountType === 'percentage') {
      if (typeof retailPrice !== 'number' || !Number.isFinite(retailPrice) || retailPrice <= 0) return null;
      const percentageRaw =
        typeof line.discountPercentage === 'number' ? line.discountPercentage : Number(line.discountPercentage);
      if (!Number.isFinite(percentageRaw) || percentageRaw <= 0 || percentageRaw > ProductsService.MAX_PERCENTAGE) {
        return null;
      }
      const result = retailPrice * (1 - (percentageRaw / 100));
      return Number.isFinite(result) && result > 0 ? result : null;
    }

    return null;
  }

  private resolveDiscountPrice(product: Product, campaigns: Campaign[], now: Date = new Date()): number | null {
    const candidates: number[] = [];

    for (const campaign of campaigns) {
      const code = typeof campaign?.code === 'string' ? campaign.code.trim() : '';
      if (code.length > 0) continue;

      const startDate = campaign?.start.toDate();
      const endDate = campaign?.end.toDate();
      if (!startDate || !endDate) continue;
      if (now.getTime() < startDate.getTime() || now.getTime() > endDate.getTime()) continue;

      const candidate = this.resolveCampaignLinePrice(campaign, product.id, product.retailPrice);
      if (candidate != null) {
        candidates.push(candidate);
      }
    }

    if (candidates.length === 0) return null;
    return Math.min(...candidates);
  }

  private convertPrice(value: number | null | undefined, rate: number | null): number | null {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return value ?? null;
    }
    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
      return value;
    }
    return value * rate;
  }

  private buildProduct(
    id: string,
    tax: number,
    product: Product,
    campaigns: Campaign[],
    conversionRate: number | null,
  ) {
    const retailPriceHistory = this.sanitizeRetailPriceHistory(product.retailPriceHistory);
    const lowestRetailPriceLast30Days = this.getLowestRetailPriceLast30Days(product.retailPrice, retailPriceHistory);
    const discountPrice = this.resolveDiscountPrice({ ...product, id }, campaigns);

    return {
      id,
      name: product.name,
      amount: product.amount,
      description_fi: product.description_fi,
      description_sv: product.description_sv,
      description_en: product.description_en,
      retailPrice: this.convertPrice(product.retailPrice, conversionRate),
      discountPrice: this.convertPrice(discountPrice, conversionRate),
      unitPrice: this.convertPrice(product.unitPrice, conversionRate),
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
      lowestRetailPriceLast30Days: this.convertPrice(lowestRetailPriceLast30Days, conversionRate),
      tax,
    };
  }

  private async getConversionRate(companyId: string, country: string): Promise<number | null> {
    if (country !== 'SE') return null;
    try {
      const currency = await getRate(companyId);
      return typeof currency?.rate === 'number' && Number.isFinite(currency.rate) && currency.rate > 0
        ? currency.rate
        : null;
    } catch {
      return null;
    }
  }

  async getProductsByCompany(companyId: string, country: string) {
    const options = await firestore().doc(`options/${companyId}`).get();
    const optionsData = options.data() as Options;
    const conversionRate = await this.getConversionRate(companyId, country);
    const campaignDocs = await firestore().collection('campaigns').where('company', '==', companyId).get();
    const campaigns = campaignDocs.docs.map((document) => ({ ...document.data(), id: document.id } as Campaign));
    const docs = await firestore().collection('products').where('company', '==', companyId).get();
    const products = docs.docs.map((document) => {
      const product = document.data() as Product;
      if (product.showInWebshop === true) {
        return this.buildProduct(document.id, optionsData.vat, product, campaigns, conversionRate);
      }
    });
    return products.filter((p) => p != null);
  }

  async getProductByIdAndCompany(companyId: string, id: string, country: string) {
    const options = await firestore().doc(`options/${companyId}`).get();
    const optionsData = options.data() as Options;
    const conversionRate = await this.getConversionRate(companyId, country);
    const campaignDocs = await firestore().collection('campaigns').where('company', '==', companyId).get();
    const campaigns = campaignDocs.docs.map((document) => ({ ...document.data(), id: document.id } as Campaign));
    const doc = await firestore().doc(`products/${id}`).get();
    const product = doc.data() as Product;
    if (product.company !== companyId) {
      throw new BadRequestException('Company mismatch');
    }
    if (product.showInWebshop !== true) {
      throw new NotFoundException('Product not found');
    }
    return this.buildProduct(id, optionsData.vat, product, campaigns, conversionRate);
  }
}
