import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { NotFoundError } from './errors/not-found-error';
import { OrdersRepository } from '../repositories/orders-repository';
import { OrderStatus } from '../entities/order';

interface MarkOrderAsWaitingUseCaseRequest {
  orderId: string;
  adminId: string;
}

@Injectable()
export class MarkOrderAsWaitingUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private ordersRepository: OrdersRepository,
  ) {}
  async execute({ adminId, orderId }: MarkOrderAsWaitingUseCaseRequest) {
    const orderDetails = await this.ordersRepository.findById(orderId);
    if (!orderDetails) {
      throw new NotFoundError(orderId, 'order');
    }

    const admin = await this.usersRepository.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new NotFoundError(adminId, 'user');
    }

    const { order } = orderDetails;
    order.status = OrderStatus.WAITING;

    await this.ordersRepository.update(order);
  }
}
