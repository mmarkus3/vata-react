import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Product } from './product.interface';

@Injectable()
export class ProductsService {

  async getProductsByCompany(companyId: string) {
    const docs = await firestore().collection('products').where('company', '==', companyId).get();
    const products = docs.docs.map((document) => {
      const product = document.data() as Product;
      product.id = document.id;
      return {
        id: product.id,
        name: product.name,
        amount: product.amount,
        description_fi: product.description_fi,
        description_sv: product.description_sv,
        description_en: product.description_en,
        retailPrice: product.retailPrice,
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
      };
    });
    return products;
  }
}
