import { Order } from "src/domain/entities/order";
import { OrdersRepository } from "src/domain/repositories/orders-repository";

export class InMemoryOrdersRepository extends OrdersRepository {
    public items: Order[] = [];
    async create(order: Order): Promise<Order> {
        this.items.push(order);
        return order;
    }
}