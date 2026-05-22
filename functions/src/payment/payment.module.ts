import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [OrdersModule],
})
export class PaymentModule { }
