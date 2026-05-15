import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('company/:company')
  getProducts(@Param('company') companyId: string) {
    return this.productsService.getProductsByCompany(companyId);
  }

  @Get('company/:company/:id')
  getProduct(@Param('company') companyId: string, @Param('id') productId: string) {
    return this.productsService.getProductByIdAndCompany(companyId, productId);
  }
}
