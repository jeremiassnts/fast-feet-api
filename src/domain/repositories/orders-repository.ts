import { Order } from "../entities/order";

export abstract class OrdersRepository {
    abstract create(order: Order): Promise<Order>
    abstract update(order: Order): Promise<void>
    abstract findById(id: string): Promise<Order | null>
    abstract delete(id: string): Promise<void>
    abstract fetchDeliveriesByTransporterId(page: number, top: number, transporterId: string): Promise<Order[]>
}