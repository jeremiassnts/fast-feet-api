import { Order, OrderStatus } from "src/domain/entities/order";
import { OrdersRepository } from "src/domain/repositories/orders-repository";

export class InMemoryOrdersRepository extends OrdersRepository {
    public items: Order[] = [];
    async create(order: Order): Promise<Order> {
        this.items.push(order);
        return order;
    }
    async findById(id: string): Promise<Order | null> {
        const order = this.items.find(item => item.id === id);
        return order ?? null;
    }
    async update(order: Order): Promise<void> {
        const index = this.items.findIndex(o => o.id === order.id);
        this.items[index].deliveryAddress = order.deliveryAddress
        this.items[index].deliveryCoordinates = order.deliveryCoordinates
        this.items[index].recipientEmail = order.recipientEmail
    }
    async delete(id: string): Promise<void> {
        const index = this.items.findIndex(o => o.id === id)
        this.items[index].deletedAt = new Date()
    }
    async fetchDeliveriesByTransporterId(page: number, top: number, transporterId: string): Promise<Order[]> {
        const deliveries = this.items.filter(order => order.status === OrderStatus.DELIVERED && order.transporterId === transporterId)
        return deliveries
    }
}