import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('company/:company')
  getProducts(@Param('company') companyId: string, @Query('country') country = 'FI') {
    return this.productsService.getProductsByCompany(companyId, country);
  }

  @Get('company/:company/:id')
  getProduct(@Param('company') companyId: string, @Param('id') productId: string, @Query('country') country = 'FI') {
    return this.productsService.getProductByIdAndCompany(companyId, productId, country);
  }
}
