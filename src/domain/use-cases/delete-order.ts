import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { NotFoundError } from './errors/not-found-error';
import { OrdersRepository } from '../repositories/orders-repository';

interface DeleteOrderUseCaseRequest {
  orderId: string;
  adminId: string;
}

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private ordersRepository: OrdersRepository,
  ) {}
  async execute({ adminId, orderId }: DeleteOrderUseCaseRequest) {
    const orderDetails = await this.ordersRepository.findById(orderId);
    if (!orderDetails) {
      throw new NotFoundError(orderId, 'order');
    }

    const admin = await this.usersRepository.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new NotFoundError(adminId, 'user');
    }

    await this.ordersRepository.delete(orderDetails.order.id);
  }
}
