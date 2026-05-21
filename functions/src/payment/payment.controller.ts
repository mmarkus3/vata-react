import { Controller, Get, Query } from '@nestjs/common';

@Controller('e-payment-notify')
export class PaymentController {

  @Get()
  recieveNotification(@Query('AUTHCODE') authCode: string, @Query('RETURN_CODE') returnCode: number, @Query('ORDER_NUMBER') orderNumber: string, @Query('SETTLED') settled: number) {
    console.log(authCode, returnCode, orderNumber, settled);
    return;
  }
}
