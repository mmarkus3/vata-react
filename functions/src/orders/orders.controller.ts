import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Order } from './order.interface';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post('company/:company')
  createOrder(@Param('company') companyId: string, @Body() order: Order) {
    order.company = companyId;
    return this.ordersService.createOrder(order);
  }

  @Put('company/:company/:orderId')
  updateOrder(@Param('company') companyId: string, @Param('orderId') orderId: string, @Body() order: Order) {
    if (orderId !== order.id) {
      throw new BadRequestException('Id mismatch');
    }
    if (['sent'].includes(order.status)) {
      throw new BadRequestException("Order can't be updated");
    }

    return this.ordersService.updateOrder(companyId, order);
  }

  @Get('company/:company/points')
  getDeliveryPoints(@Param('company') companyId: string, @Query('postalCode') postalCode: string) {
    return this.ordersService.getPoints(companyId, postalCode);
  }
}
