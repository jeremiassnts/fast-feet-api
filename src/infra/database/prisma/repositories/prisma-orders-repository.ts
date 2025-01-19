import { Order } from "src/domain/entities/order";
import { OrdersRepository } from "src/domain/repositories/orders-repository";
import { PrismaService } from "../prisma.service";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { OrderStatus } from "@prisma/client";
import { MapsUtils } from "src/domain/utils/maps-utils";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
    constructor(private prisma: PrismaService) { }
    async create(order: Order): Promise<Order> {
        const newOrder = await this.prisma.order.create({
            data: {
                recipientId: order.recipientId,
                title: order.title,
                description: order.description,
                createdAt: new Date(),
                status: PrismaOrderMapper.toPrismaStatus(order.status),
                transporterId: null
            }
        })
        return PrismaOrderMapper.toDomain(newOrder)
    }
    async update(order: Order): Promise<void> {
        await this.prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                status: PrismaOrderMapper.toPrismaStatus(order.status),
            }
        })
    }
    async findById(id: string): Promise<Order | null> {
        const order = await this.prisma.order.findUnique({
            where: {
                id
            }
        })
        return order ? PrismaOrderMapper.toDomain(order) : null
    }
    async delete(id: string): Promise<void> {
        await this.prisma.order.update({
            data: {
                deletedAt: new Date()
            },
            where: {
                id
            }
        })
    }
    async fetchDeliveriesByTransporterId(page: number, top: number, transporterId: string): Promise<Order[]> {
        const orders = await this.prisma.order.findMany({
            where: {
                status: OrderStatus.DELIVERED,
                transporterId: transporterId
            },
            take: top,
            skip: (page - 1) * top
        })
        return orders.map(PrismaOrderMapper.toDomain)
    }
    async fetchOrdersNearToTransporter(page: number, top: number, transporterId: string, longitude: number, latitude: number): Promise<Order[]> {
        const orders = await this.prisma.order.findMany({
            where: {
                AND: [
                    { status: { not: OrderStatus.DELIVERED } },
                    {
                        OR: [
                            { transporterId: null },
                            { transporterId }
                        ]
                    }
                ]
            }
        })
        const recipients = await this.prisma.recipient.findMany({
            where: {
                id: {
                    in: orders.map(order => order.recipientId)
                }
            }
        })
        return orders
            .sort((a, b) => {
                const recipient_A = recipients.find(recipient => recipient.id === a.recipientId)
                const latitudeA = recipient_A.latitude
                const longitudeA = recipient_A.longitude
                const distanceA = MapsUtils.getDifferenceBetweenCoordinates({
                    latitude: latitudeA,
                    longitude: longitudeA
                }, {
                    latitude,
                    longitude
                })

                const recipient_B = recipients.find(recipient => recipient.id === b.recipientId)
                const latitudeB = recipient_B.latitude
                const longitudeB = recipient_B.longitude
                const distanceB = MapsUtils.getDifferenceBetweenCoordinates({
                    latitude: latitudeB,
                    longitude: longitudeB
                }, {
                    latitude,
                    longitude
                })

                return distanceA - distanceB
            })
            .slice((page - 1) * top, page * top)
            .map(PrismaOrderMapper.toDomain)
    }
}