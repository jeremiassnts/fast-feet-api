import { Injectable } from '@nestjs/common';
import { NotFoundError } from './errors/not-found-error';
import { OrdersRepository } from '../repositories/orders-repository';
import { OrderStatus } from '../entities/order';

interface MarkOrderAsReturnedUseCaseRequest {
  orderId: string;
}

@Injectable()
export class MarkOrderAsReturnedUseCase {
  constructor(private ordersRepository: OrdersRepository) { }
  async execute({ orderId }: MarkOrderAsReturnedUseCaseRequest) {
    const orderDetails = await this.ordersRepository.findById(orderId);
    if (!orderDetails) {
      throw new NotFoundError(orderId, 'order');
    }

    const { order } = orderDetails
    order.status = OrderStatus.RETURNED;

    await this.ordersRepository.update(order);
  }
}
