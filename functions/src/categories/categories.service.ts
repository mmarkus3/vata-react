import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Category } from './category.interface';

@Injectable()
export class CategoriesService {

  async getCategoriesByCompany(companyId: string) {
    const docs = await firestore().collection('categories').where('company', '==', companyId).get();
    const categories = docs.docs.map((document) => {
      const category = document.data() as Category;
      category.id = document.id;
      return {
        id: category.id,
        name: category.name,
        description: category.description,
      };
    });
    return categories;
  }
}
