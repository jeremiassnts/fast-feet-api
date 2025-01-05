import { User, UserProps, UserRoles } from "src/domain/entities/user";
import { faker } from '@faker-js/faker'

export class UserFactory {
    constructor() { }
    static makeUser(override: Partial<UserProps> = {}) {
        const user = new User({
            name: faker.person.fullName(),
            cpf: '00000000000',
            password: faker.internet.password(),
            role: UserRoles.ADMIN,
            ...override
        })
        return user
    }
}