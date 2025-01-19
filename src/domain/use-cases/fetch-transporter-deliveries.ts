import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders-repository';

interface FetchTransporterDeliveriesUseCaseRequest {
  page: number;
  top: number;
  transporterId: string;
}

@Injectable()
export class FetchTransporterDeliveriesUseCase {
  constructor(private ordersRepository: OrdersRepository) {}
  async execute({
    page,
    top,
    transporterId,
  }: FetchTransporterDeliveriesUseCaseRequest) {
    const deliveries =
      await this.ordersRepository.fetchDeliveriesByTransporterId(
        page,
        top,
        transporterId,
      );
    return { deliveries };
  }
}
