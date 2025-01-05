import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { FakePasswordHasher } from "test/services/fake-password-hasher"
import { UserFactory } from "test/factories/make-user"
import { FakeCpfValidator } from "test/services/fake-cpf-validator"
import { CreateTransporterUseCase } from "./create-transporter"
import { UserRoles } from "../entities/user"

let inMemoryUsersRepository: InMemoryUsersRepository
let hasher: FakePasswordHasher
let cpfValidator: FakeCpfValidator
let sut: CreateTransporterUseCase

describe('Authenticate user', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        hasher = new FakePasswordHasher()
        cpfValidator = new FakeCpfValidator()
        sut = new CreateTransporterUseCase(inMemoryUsersRepository, hasher, cpfValidator)
    })

    it('should be able to create a transporter', async () => {
        const admin = UserFactory.makeUser({
            password: await hasher.hash('123456'),
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        const result = await sut.execute({
            name: 'John Doe',
            cpf: '12345678901',
            password: '123456',
            adminId: admin.id
        })

        expect(inMemoryUsersRepository.items[1]).toEqual(expect.objectContaining({
            id: result.user.id,
            createdBy: admin.id
        }))
    })
})