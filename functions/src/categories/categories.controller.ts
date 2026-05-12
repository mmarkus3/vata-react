import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get('company/:company')
  getProducts(@Param('company') companyId: string) {
    return this.categoriesService.getCategoriesByCompany(companyId);
  }
}
