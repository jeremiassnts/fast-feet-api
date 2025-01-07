import { Order, OrderProps, OrderStatus } from "src/domain/entities/order";
import { faker } from '@faker-js/faker'

export class OrderFactory {
    constructor() { }
    static makeOrder(override: Partial<OrderProps> = {}) {
        const order = new Order({
            status: OrderStatus.WAITING,
            createdAt: new Date(),
            deliveryAddress: faker.location.streetAddress(),
            deliveryCoordinates: faker.location.latitude() + ':' + faker.location.longitude(),
            recipientEmail: faker.internet.email(),
            ...override
        })
        return order
    }
}