import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
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

  @Post('company/:company/place')
  placeOrder(@Param('company') companyId: string, @Query('country') country = 'FI', @Body() item: { orderId: string }) {
    return this.ordersService.placeOrder(companyId, item.orderId, country);
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

  @Patch('company/:company/:orderId')
  patchOrder(@Param('company') companyId: string, @Param('orderId') orderId: string, @Body() order: Order) {
    if (['sent'].includes(order.status)) {
      throw new BadRequestException("Order can't be updated");
    }
    order.id = orderId;

    return this.ordersService.updateOnlyOrder(companyId, order);
  }

  @Get('company/:company/points')
  getDeliveryPoints(@Param('company') companyId: string, @Query('postalCode') postalCode: string, @Query('country') country = 'FI') {
    return this.ordersService.getPoints(companyId, postalCode, country);
  }

  @Get('company/:company/point/:id')
  getDeliveryPoint(@Param('company') _companyId: string, @Param('id') id: string, @Query('country') country = 'FI') {
    return this.ordersService.getPoint(id, country);
  }

  @Get('company/:company/prices')
  getPrices(@Param('company') companyId: string, @Query('country') country = 'FI') {
    return this.ordersService.getPrices(companyId, country);
  }

  @Get('company/:company/paymentMethods')
  getPaymnentMethods(@Param('company') companyId: string, @Query('country') country = 'FI') {
    const currency = country === 'SE' ? 'SEK' : 'EUR';
    return this.ordersService.getPaymentMethods(companyId, currency);
  }
}
