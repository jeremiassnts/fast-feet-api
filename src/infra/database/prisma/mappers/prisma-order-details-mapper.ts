import {
  Order as PrismaOrder,
  Recipient as PrismaRecipient,
  User as PrismaTransporter,
} from '@prisma/client';
import { OrderDetails } from 'src/domain/entities/value-objects/order-details';
import { PrismaOrderMapper } from './prisma-order-mapper';
import { PrismaRecipientMapper } from './prisma-recipient-mapper';
import { PrismaUserMapper } from './prisma-user-mapper';

type PrismaOrderDetails = PrismaOrder & {
  recipient: PrismaRecipient;
  transporter: PrismaTransporter;
};

export class PrismaOrderDetailsMapper {
  public static toDomain(order: PrismaOrderDetails) {
    return new OrderDetails({
      order: PrismaOrderMapper.toDomain(order),
      recipient: PrismaRecipientMapper.ToDomain(order.recipient),
      transporter: PrismaUserMapper.toDomain(order.transporter),
    });
  }
}
