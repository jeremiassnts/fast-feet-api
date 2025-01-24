import { Recipient } from 'src/domain/entities/recipient';
import { RecipientsRepository } from 'src/domain/repositories/recipient-repository';
import { PrismaService } from '../prisma.service';
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';
import { Injectable } from '@nestjs/common';
import { CacheRepository } from 'src/infra/cache/cache-repository';
@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService, private cacheRepository: CacheRepository) { }
  async update(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.update({
      where: {
        id: recipient.id,
      },
      data: {
        name: recipient.name,
        latitude: recipient.latitude,
        longitude: recipient.longitude,
        address: recipient.address,
      },
    });
    await this.cacheRepository.delete(`recipient:${recipient.id}`)
  }
  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findFirst({
      where: {
        email,
      },
    });
    return recipient ? PrismaRecipientMapper.ToDomain(recipient) : null;
  }
  async create(recipient: Recipient): Promise<Recipient> {
    const newRecipient = await this.prisma.recipient.create({
      data: {
        address: recipient.address,
        email: recipient.email,
        latitude: recipient.latitude,
        longitude: recipient.longitude,
        name: recipient.name,
        createdAt: new Date(),
      },
    });

    return PrismaRecipientMapper.ToDomain(newRecipient);
  }
  async findById(id: string): Promise<Recipient | null> {
    const cached = await this.cacheRepository.get(`recipient:${id}`)
    if (cached) {
      const recipient = JSON.parse(cached)
      return PrismaRecipientMapper.ToDomain(recipient)
    }
    const recipient = await this.prisma.recipient.findFirst({
      where: {
        id,
      },
    });
    await this.cacheRepository.set(`recipient:${id}`, JSON.stringify(recipient))
    return recipient ? PrismaRecipientMapper.ToDomain(recipient) : null;
  }
  async delete(recipientId: string): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id: recipientId,
      },
    });
    await this.cacheRepository.delete(`recipient:${recipientId}`)
  }
  async fetchAll(page: number, top: number): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany({
      take: top,
      skip: (page - 1) * top,
    });
    return recipients.map(PrismaRecipientMapper.ToDomain);
  }
}
