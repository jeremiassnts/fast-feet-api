import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { NotFoundError } from "./errors/not-found-error";
import { OrdersRepository } from "../repositories/orders-repository";
import { OrderStatus } from "../entities/order";

interface MarkOrderAsWaitingUseCaseRequest {
    orderId: string
    adminId: string
}

@Injectable()
export class MarkOrderAsWaitingUseCase {
    constructor(private usersRepository: UsersRepository, private ordersRepository: OrdersRepository) { }
    async execute({ adminId, orderId }: MarkOrderAsWaitingUseCaseRequest) {
        const order = await this.ordersRepository.findById(orderId)
        if (!order) {
            throw new NotFoundError(orderId)
        }

        const admin = await this.usersRepository.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            throw new NotFoundError(adminId)
        }

        order.status = OrderStatus.WAITING

        await this.ordersRepository.update(order)
    }
}