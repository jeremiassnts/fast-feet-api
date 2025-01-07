import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { NotFoundError } from "./errors/not-found-error";
import { Order, OrderStatus } from "../entities/order";
import { OrdersRepository } from "../repositories/orders-repository";

interface CreateOrderUseCaseRequest {
    deliveryAddress: string;
    deliveryCoordinates: string;
    recipientEmail: string;
    adminId: string;
}

@Injectable()
export class CreateOrderUseCase {
    constructor(private usersRepository: UsersRepository, private ordersRepository: OrdersRepository) { }
    async execute({ adminId, deliveryAddress, deliveryCoordinates, recipientEmail }: CreateOrderUseCaseRequest) {
        const admin = await this.usersRepository.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            throw new NotFoundError(adminId)
        }

        const newOrder = new Order({
            deliveryAddress,
            deliveryCoordinates,
            recipientEmail,
            status: OrderStatus.CREATED,
            createdAt: new Date(),
        })
        await this.ordersRepository.create(newOrder)

        return {
            order: newOrder,
        }
    }
}