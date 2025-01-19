import { Recipient } from "src/domain/entities/recipient";
import { RecipientsRepository } from "src/domain/repositories/recipient-repository";
import { PrismaService } from "../prisma.service";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";
import { Injectable } from "@nestjs/common";
@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
    constructor(private prisma: PrismaService) { }
    async update(recipient: Recipient): Promise<void> {
        await this.prisma.recipient.update({
            where: {
                id: recipient.id
            },
            data: {
                name: recipient.name,
                latitude: recipient.latitude,
                longitude: recipient.longitude,
                address: recipient.address,
            }
        })
    }
    async findByEmail(email: string): Promise<Recipient | null> {
        const recipient = await this.prisma.recipient.findFirst({
            where: {
                email
            }
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
            }
        })

        return PrismaRecipientMapper.ToDomain(newRecipient)
    }
    async findById(id: string): Promise<Recipient | null> {
        const recipient = await this.prisma.recipient.findFirst({
            where: {
                id
            }
        });
        return recipient ? PrismaRecipientMapper.ToDomain(recipient) : null;
    }
    async delete(recipientId: string): Promise<void> {
        await this.prisma.recipient.delete({
            where: {
                id: recipientId,
            }
        })
    }
    async fetchAll(page: number, top: number): Promise<Recipient[]> {
        const recipients = await this.prisma.recipient.findMany({
            take: top,
            skip: (page - 1) * top
        })
        return recipients.map(PrismaRecipientMapper.ToDomain)
    }
}