import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { NotFoundError } from "./errors/not-found-error";
import { Order, OrderStatus } from "../entities/order";
import { OrdersRepository } from "../repositories/orders-repository";
import { RecipientsRepository } from "../repositories/recipient-repository";

interface CreateOrderUseCaseRequest {
    title: string
    description: string
    recipientId: string
    adminId: string;
}

@Injectable()
export class CreateOrderUseCase {
    constructor(private usersRepository: UsersRepository, private ordersRepository: OrdersRepository, private recipientsRepository: RecipientsRepository) { }
    async execute({ adminId, recipientId, description, title }: CreateOrderUseCaseRequest) {
        const admin = await this.usersRepository.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            throw new NotFoundError(adminId)
        }

        const recipient = await this.recipientsRepository.findById(recipientId)
        if (!recipient) {
            throw new NotFoundError(recipientId)
        }

        const newOrder = new Order({
            status: OrderStatus.CREATED,
            createdAt: new Date(),
            recipientId,
            title,
            description
        })
        await this.ordersRepository.create(newOrder)

        return {
            order: newOrder,
        }
    }
}