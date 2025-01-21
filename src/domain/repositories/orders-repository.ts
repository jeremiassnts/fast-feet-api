import { Order } from '../entities/order';
import { OrderDetails } from '../entities/value-objects/order-details';

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<Order>;
  abstract update(order: Order): Promise<void>;
  abstract findById(id: string): Promise<OrderDetails | null>;
  abstract delete(id: string): Promise<void>;
  abstract fetchDeliveriesByTransporterId(
    page: number,
    top: number,
    transporterId: string,
  ): Promise<OrderDetails[]>;
  abstract fetchOrdersNearToTransporter(
    page: number,
    top: number,
    transporterId: string,
    longitude: number,
    latitude: number,
  ): Promise<OrderDetails[]>;
}
