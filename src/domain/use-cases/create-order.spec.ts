import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { UserFactory } from "test/factories/make-user"
import { CreateOrderUseCase } from "./create-order"
import { UserRoles } from "../entities/user"
import { NotFoundError } from "./errors/not-found-error"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe('Create order', () => {
    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new CreateOrderUseCase(inMemoryUsersRepository, inMemoryOrdersRepository)
    })

    it('should be able to create an order', async () => {
        const admin = UserFactory.makeUser({
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        const result = await sut.execute({
            adminId: admin.id,
            deliveryAddress: 'test address',
            deliveryCoordinates: '123:321',
            recipientEmail: 'johndoe@email.com'
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

        await expect(() =>
            sut.execute({
                adminId: transporter.id,
                deliveryAddress: 'test address',
                deliveryCoordinates: '123:321',
                recipientEmail: 'johndoe@email.com'
            })
        ).rejects.toBeInstanceOf(NotFoundError)
        expect(inMemoryOrdersRepository.items.length).toBe(0)
    })
})