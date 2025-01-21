import { Order } from 'src/domain/entities/order';
import { OrdersRepository } from 'src/domain/repositories/orders-repository';
import { PrismaService } from '../prisma.service';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';
import { OrderStatus } from '@prisma/client';
import { MapsUtils } from 'src/domain/utils/maps-utils';
import { Injectable } from '@nestjs/common';
import { PrismaOrderDetailsMapper } from '../mappers/prisma-order-details-mapper';
import { OrderDetails } from 'src/domain/entities/value-objects/order-details';

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
        transporterId: null,
      },
    });
    return PrismaOrderMapper.toDomain(newOrder);
  }
  async update(order: Order): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: PrismaOrderMapper.toPrismaStatus(order.status),
        deliveryPhoto: order.deliveryPhoto,
        transporterId: order.transporterId
      },
    });
  }
  async findById(id: string): Promise<OrderDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        recipient: true,
        transporter: true,
      }
    });
    return order ? PrismaOrderDetailsMapper.toDomain(order) : null;
  }
  async delete(id: string): Promise<void> {
    await this.prisma.order.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }
  async fetchDeliveriesByTransporterId(
    page: number,
    top: number,
    transporterId: string,
  ): Promise<OrderDetails[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.DELIVERED,
        transporterId: transporterId,
      },
      include: {
        recipient: true,
        transporter: true
      },
      take: top,
      skip: (page - 1) * top,
    });
    return orders.map(PrismaOrderDetailsMapper.toDomain);
  }
  async fetchOrdersNearToTransporter(
    page: number,
    top: number,
    transporterId: string,
    longitude: number,
    latitude: number,
  ): Promise<OrderDetails[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        AND: [
          { status: { not: OrderStatus.DELIVERED } },
          {
            OR: [{ transporterId: null }, { transporterId }],
          },
        ],
      },
      include: {
        recipient: true,
        transporter: true,
      }
    });
    return orders
      .sort((a, b) => {
        const latitudeA = a.recipient.latitude;
        const longitudeA = a.recipient.longitude;
        const distanceA = MapsUtils.getDifferenceBetweenCoordinates(
          {
            latitude: latitudeA,
            longitude: longitudeA,
          },
          {
            latitude,
            longitude,
          },
        );

        const latitudeB = b.recipient.latitude;
        const longitudeB = b.recipient.longitude;
        const distanceB = MapsUtils.getDifferenceBetweenCoordinates(
          {
            latitude: latitudeB,
            longitude: longitudeB,
          },
          {
            latitude,
            longitude,
          },
        );

        return distanceA - distanceB;
      })
      .slice((page - 1) * top, page * top)
      .map(PrismaOrderDetailsMapper.toDomain);
  }
}
