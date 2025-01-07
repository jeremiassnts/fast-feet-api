import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { FakePasswordHasher } from "test/services/fake-password-hasher"
import { UserFactory } from "test/factories/make-user"
import { UserRoles } from "../entities/user"
import { NotFoundError } from "./errors/not-found-error"
import { DeleteOrderUseCase } from "./delete-order"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { OrderFactory } from "test/factories/make-order"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: DeleteOrderUseCase

describe('Delete order', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new DeleteOrderUseCase(inMemoryUsersRepository, inMemoryOrdersRepository)
    })

    it('should be able to delete an order', async () => {
        const admin = UserFactory.makeUser({
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        const order = OrderFactory.makeOrder()
        inMemoryOrdersRepository.items.push(order)
        const oldDeletedDate = order.deletedAt

        await sut.execute({
            adminId: admin.id,
            orderId: order.id
        })

        const deletedOrder = inMemoryOrdersRepository.items.find(o => o.id === order.id)
        expect(deletedOrder).toEqual(expect.objectContaining({
            deletedAt: expect.any(Date)
        }))
        expect(oldDeletedDate).toBeNull()
    })

    it('should not be able to edit an order with a transporter', async () => {
        const order = OrderFactory.makeOrder()
        inMemoryOrdersRepository.items.push(order)

        await expect(() => sut.execute({
            adminId: order.id,
            orderId: order.id
        })).rejects.toBeInstanceOf(NotFoundError)

        expect(inMemoryOrdersRepository.items[0].deletedAt).toBeNull()
    })
})