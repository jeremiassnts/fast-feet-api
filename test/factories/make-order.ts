import { Order, OrderProps, OrderStatus } from "src/domain/entities/order";
import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { PrismaOrderMapper } from "src/infra/database/prisma/mappers/prisma-order-mapper";

@Injectable()
export class OrderFactory {
    constructor(private prisma: PrismaService) { }
    static makeOrder(override: Partial<OrderProps> = {}) {
        const order = new Order({
            status: OrderStatus.CREATED,
            createdAt: new Date(),
            recipientId: randomUUID(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            ...override
        })
        return order
    }
    async makePrismaOrder(override: Partial<OrderProps> = {}) {
        const order = OrderFactory.makeOrder(override)
        await this.prisma.order.create({
            data: PrismaOrderMapper.toPrisma(order)
        })
        return order
    }
}