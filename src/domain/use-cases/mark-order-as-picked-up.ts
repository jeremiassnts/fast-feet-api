import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { NotFoundError } from "./errors/not-found-error";
import { OrdersRepository } from "../repositories/orders-repository";
import { OrderStatus } from "../entities/order";

interface MarkOrderAsPickedUpUseCaseRequest {
    orderId: string
    transporterId: string
}

@Injectable()
export class MarkOrderAsPickedUpUseCase {
    constructor(private usersRepository: UsersRepository, private ordersRepository: OrdersRepository) { }
    async execute({ transporterId, orderId }: MarkOrderAsPickedUpUseCaseRequest) {
        const order = await this.ordersRepository.findById(orderId)
        if (!order) {
            throw new NotFoundError(orderId)
        }

        const transporter = await this.usersRepository.findById(transporterId)
        if (!transporter || transporter.role !== 'transporter') {
            throw new NotFoundError(transporterId)
        }

        order.status = OrderStatus.PICKEDUP
        order.transporterId = transporterId

        await this.ordersRepository.update(order)
    }
}