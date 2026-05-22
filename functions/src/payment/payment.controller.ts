import { Controller, Get, Query } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { PaymentService } from './payment.service';

@Controller('e-payment-notify')
export class PaymentController {

  constructor(
    private ordersService: OrdersService,
    private paymentService: PaymentService
  ) { }

  @Get()
  recieveNotification(@Query('AUTHCODE') AUTHCODE: string,
    @Query('RETURN_CODE') RETURN_CODE: string,
    @Query('ORDER_NUMBER') ORDER_NUMBER: string,
    @Query('SETTLED') SETTLED: string,
    @Query('CONTACT_ID') CONTACT_ID: string,
    @Query('INCIDENT_ID') INCIDENT_ID: string,
    @Query('companyId') companyId: string) {
    this.paymentService.checkResult(companyId, { AUTHCODE, RETURN_CODE, ORDER_NUMBER, SETTLED, CONTACT_ID, INCIDENT_ID }).then((result) => {
      if (result) {
        this.ordersService.updateOnlyOrder(companyId, { id: ORDER_NUMBER, status: 'paid' });
        // TODO: send email about new order
      }
    })

    return;
  }
}
