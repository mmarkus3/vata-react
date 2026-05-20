import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
  imports: [ProductsModule, CategoriesModule, OrdersModule, CampaignsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
