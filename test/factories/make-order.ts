import { Order, OrderProps, OrderStatus } from "src/domain/entities/order";
import { randomUUID } from "node:crypto";

export class OrderFactory {
    constructor() { }
    static makeOrder(override: Partial<OrderProps> = {}) {
        const order = new Order({
            status: OrderStatus.CREATED,
            createdAt: new Date(),
            recipientId: randomUUID(),
            ...override
        })
        return order
    }
}