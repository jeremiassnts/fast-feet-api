import { Recipient as PrismaRecipient } from '@prisma/client';
import { Recipient } from 'src/domain/entities/recipient';

export class PrismaRecipientMapper {
  public static ToDomain(data: PrismaRecipient): Recipient {
    return new Recipient({
      id: data.id,
      name: data.name,
      email: data.email,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
  public static toPrisma(data: Recipient): PrismaRecipient {
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      email: data.email,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
