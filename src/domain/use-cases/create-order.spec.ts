import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { UserFactory } from "test/factories/make-user"
import { CreateOrderUseCase } from "./create-order"
import { UserRoles } from "../entities/user"
import { NotFoundError } from "./errors/not-found-error"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { RecipientFactory } from "test/factories/make-recipient"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: CreateOrderUseCase

describe('Create order', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
        inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new CreateOrderUseCase(inMemoryUsersRepository, inMemoryOrdersRepository, inMemoryRecipientsRepository)
    })

    it('should be able to create an order', async () => {
        const admin = UserFactory.makeUser({
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        const recipient = RecipientFactory.makeRecipient()
        inMemoryRecipientsRepository.items.push(recipient)

        const result = await sut.execute({
            adminId: admin.id,
            recipientId: recipient.id,
            title: 'order 01',
            description: 'description 01'
        })

        expect(inMemoryOrdersRepository.items[0]).toEqual(expect.objectContaining({
            id: result.order.id,
        }))
    })
    it('should not be able to create a order by transporter', async () => {
        const transporter = UserFactory.makeUser({
            role: UserRoles.TRANSPORTER
        })
        inMemoryUsersRepository.items.push(transporter)

        const recipient = RecipientFactory.makeRecipient()
        inMemoryRecipientsRepository.items.push(recipient)

        await expect(() =>
            sut.execute({
                adminId: transporter.id,
                recipientId: recipient.id,
                title: 'order 01',
                description: 'description 01'
            })
        ).rejects.toBeInstanceOf(NotFoundError)
        expect(inMemoryOrdersRepository.items.length).toBe(0)
    })
    it('should not be able to create a order with invalid recipient', async () => {
        const admin = UserFactory.makeUser({
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        await expect(() =>
            sut.execute({
                adminId: admin.id,
                recipientId: '123456',
                title: 'order 01',
                description: 'description 01'
            })
        ).rejects.toBeInstanceOf(NotFoundError)
        expect(inMemoryOrdersRepository.items.length).toBe(0)
    })
})