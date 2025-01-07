import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { NotFoundError } from "./errors/not-found-error";
import { OrdersRepository } from "../repositories/orders-repository";

interface EditOrderUseCaseRequest {
    orderId: string
    adminId: string
    deliveryAddress: string
    deliveryCoordinates: string
    recipientEmail: string
}

@Injectable()
export class EditOrderUseCase {
    constructor(private usersRepository: UsersRepository, private ordersRepository: OrdersRepository) { }
    async execute({ adminId, orderId, deliveryAddress, deliveryCoordinates, recipientEmail }: EditOrderUseCaseRequest) {
        const order = await this.ordersRepository.findById(orderId)
        if (!order) {
            throw new NotFoundError(orderId)
        }

        const admin = await this.usersRepository.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            throw new NotFoundError(adminId)
        }

        order.deliveryAddress = deliveryAddress
        order.deliveryCoordinates = deliveryCoordinates
        order.recipientEmail = recipientEmail

        await this.ordersRepository.update(order)
    }
}