import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { FakePasswordHasher } from "test/services/fake-password-hasher"
import { UserFactory } from "test/factories/make-user"
import { FakeCpfValidator } from "test/services/fake-cpf-validator"
import { UserRoles } from "../entities/user"
import { NotFoundError } from "./errors/not-found-error"
import { ChangePasswordUseCase } from "./change-password"

let inMemoryUsersRepository: InMemoryUsersRepository
let hasher: FakePasswordHasher
let sut: ChangePasswordUseCase

describe('Change password', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        hasher = new FakePasswordHasher()
        sut = new ChangePasswordUseCase(inMemoryUsersRepository, hasher)
    })

    it('should be able to change a password', async () => {
        const admin = UserFactory.makeUser({
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        const user = UserFactory.makeUser({
            password: await hasher.hash('123456')
        })
        inMemoryUsersRepository.items.push(user)

        await sut.execute({
            adminId: admin.id,
            userId: user.id,
            password: '654321'
        })

        const updatedUser = inMemoryUsersRepository.items.find(u => u.id === user.id)
        expect(updatedUser).toEqual(expect.objectContaining({
            password: await hasher.hash('654321')
        }))
    })

    it('should not be able to a transporter change a password', async () => {
        const transporter = UserFactory.makeUser({
            password: await hasher.hash('123456'),
            role: UserRoles.TRANSPORTER
        })
        inMemoryUsersRepository.items.push(transporter)

        await expect(() => sut.execute({
            adminId: transporter.id,
            userId: transporter.id,
            password: '654321'
        })).rejects.toBeInstanceOf(NotFoundError)

        expect(inMemoryUsersRepository.items[0]).toEqual(expect.objectContaining({
            password: await hasher.hash('123456')
        }))
    })
})