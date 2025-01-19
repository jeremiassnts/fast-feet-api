import { Recipient, RecipientProps } from "src/domain/entities/recipient";
import { faker } from '@faker-js/faker'
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { PrismaRecipientMapper } from "src/infra/database/prisma/mappers/prisma-recipient-mapper";
import { Injectable } from "@nestjs/common";
@Injectable()
export class RecipientFactory {
    constructor(private prisma: PrismaService) { }
    static makeRecipient(override: Partial<RecipientProps> = {}) {
        const recipient = new Recipient({
            address: faker.location.streetAddress(),
            createdAt: new Date(),
            email: faker.internet.email(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            name: faker.person.fullName(),
            ...override
        })
        return recipient
    }
    async makePrismaRecipient(override: Partial<RecipientProps> = {}) {
        const recipient = RecipientFactory.makeRecipient(override)
        await this.prisma.recipient.create({
            data: PrismaRecipientMapper.toPrisma(recipient)
        })
        return recipient
    }
}