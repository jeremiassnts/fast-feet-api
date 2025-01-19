import { OrderStatus as DomainStatus, Order } from "src/domain/entities/order";
import { OrderStatus as PrismaStatus, Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderMapper {
    public static toPrismaStatus(status: DomainStatus) {
        switch (status) {
            case DomainStatus.CREATED:
                return PrismaStatus.CREATED;
            case DomainStatus.DELIVERED:
                return PrismaStatus.DELIVERED;
            case DomainStatus.WAITING:
                return PrismaStatus.WAITING;
            case DomainStatus.PICKEDUP:
                return PrismaStatus.PICKEDUP;
            case DomainStatus.RETURNED:
                return PrismaStatus.RETURNED;
            default:
                return PrismaStatus.CREATED;
        }
    }
    public static toDomainStatus(status: PrismaStatus) {
        switch (status) {
            case PrismaStatus.CREATED:
                return DomainStatus.CREATED;
            case PrismaStatus.DELIVERED:
                return DomainStatus.DELIVERED;
            case PrismaStatus.WAITING:
                return DomainStatus.WAITING;
            case PrismaStatus.PICKEDUP:
                return DomainStatus.PICKEDUP;
            case PrismaStatus.RETURNED:
                return DomainStatus.RETURNED;
            default:
                return DomainStatus.CREATED;
        }
    }
    public static toDomain(order: PrismaOrder) {
        return new Order({
            id: order.id,
            status: PrismaOrderMapper.toDomainStatus(order.status),
            title: order.title,
            description: order.description,
            transporterId: order.transporterId,
            recipientId: order.recipientId,
            deliveryPhoto: order.deliveryPhoto,
            createdAt: order.createdAt,
            deletedAt: order.deletedAt,
            updatedAt: order.updatedAt,
        })
    }
    public static toPrisma(data: Order): PrismaOrder {
        return {
            id: data.id,
            deliveryPhoto: data.deliveryPhoto,
            description: data.description,
            recipientId: data.recipientId,
            status: PrismaOrderMapper.toPrismaStatus(data.status),
            title: data.title,
            transporterId: data.transporterId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt
        }
    }
}