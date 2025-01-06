import { User, UserProps, UserRoles } from "src/domain/entities/user";
import { faker } from '@faker-js/faker'
import { randomUUID } from "node:crypto";

export class UserFactory {
    constructor() { }
    static makeUser(override: Partial<UserProps> = {}) {
        const user = new User({
            name: faker.person.fullName(),
            cpf: '00000000000',
            password: faker.internet.password(),
            role: UserRoles.ADMIN,
            createdAt: faker.date.past(),
            createdBy: randomUUID(),
            updatedAt: null,
            ...override
        })
        return user
    }
}