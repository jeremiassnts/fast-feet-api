import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders-repository';

interface GetOrderUseCaseRequest {
  id: string;
}

@Injectable()
export class GetOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}
  async execute({ id }: GetOrderUseCaseRequest) {
    const order = await this.ordersRepository.findById(id);
    return { order };
  }
}
