import { OnEvent } from "@nestjs/event-emitter";
import { OrderStatus } from "../entities/order";
import { NotificationSender } from "../services/notification-sender";
import { OrdersRepository } from "../repositories/orders-repository";
import { Injectable } from "@nestjs/common";

export interface OrderStatusChanged {
    orderId: string
    status: OrderStatus
}

@Injectable()
export class OnOrderStatusChanged {
    constructor(private mailer: NotificationSender,
        private orderRepository: OrdersRepository) { }
    @OnEvent('order.changed')
    async handle({ orderId, status }: OrderStatusChanged) {
        const { order, recipient } = await this.orderRepository.findById(orderId)

        const title = `Update on your order '${order.title}'`
        const content = `Hi ${recipient.name}, congratulations!! Your order '${order.title}' has changed the status to ${status}`

        await this.mailer.send(
            content,
            recipient.email,
            title
        )
    }
}