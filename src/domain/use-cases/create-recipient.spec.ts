import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { FakePasswordHasher } from "test/services/fake-password-hasher"
import { UserFactory } from "test/factories/make-user"
import { FakeCpfValidator } from "test/services/fake-cpf-validator"
import { CreateRecipientUseCase } from "./create-recipient"
import { UserRoles } from "../entities/user"
import { NotFoundError } from "./errors/not-found-error"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { RecipientFactory } from "test/factories/make-recipient"
import { RecipientAlreadyExistsError } from "./errors/recipient-already-exists-error"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: CreateRecipientUseCase

describe('Create recipient', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
        sut = new CreateRecipientUseCase(inMemoryRecipientsRepository, inMemoryUsersRepository)
    })

    it('should be able to create a recipient', async () => {
        const admin = UserFactory.makeUser({
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        const result = await sut.execute({
            name: 'John Doe',
            address: 'Street C, 123',
            email: 'john@example.com',
            latitude: -23.550520,
            longitude: -46.633309,
            adminId: admin.id
        })

        expect(inMemoryRecipientsRepository.items[0]).toEqual(expect.objectContaining({
            id: result.recipient.id,
        }))
    })
    it('should not be able to create a recipient by a transporter', async () => {
        const transporter = UserFactory.makeUser({
            role: UserRoles.TRANSPORTER
        })
        inMemoryUsersRepository.items.push(transporter)

        await expect(() =>
            sut.execute({
                name: 'John Doe',
                address: 'Street C, 123',
                email: 'john@example.com',
                latitude: -23.550520,
                longitude: -46.633309,
                adminId: transporter.id
            })
        ).rejects.toBeInstanceOf(NotFoundError)
        expect(inMemoryRecipientsRepository.items.length).toBe(0)
    })
    it('should not be able to create a recipient that already exists', async () => {
        const admin = UserFactory.makeUser({
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        const recipient = RecipientFactory.makeRecipient({
            email: 'john@example.com'
        })
        inMemoryRecipientsRepository.items.push(recipient)

        await expect(() =>
            sut.execute({
                name: 'John Doe',
                address: 'Street C, 123',
                email: 'john@example.com',
                latitude: -23.550520,
                longitude: -46.633309,
                adminId: admin.id
            })
        ).rejects.toBeInstanceOf(RecipientAlreadyExistsError)
        expect(inMemoryRecipientsRepository.items.length).toBe(1)
    })
})