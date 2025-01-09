import { Recipient, RecipientProps } from "src/domain/entities/recipient";
import { faker } from '@faker-js/faker'

export class RecipientFactory {
    constructor() { }
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
}