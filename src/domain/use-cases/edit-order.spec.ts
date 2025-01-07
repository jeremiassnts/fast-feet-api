import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { UserFactory } from "test/factories/make-user"
import { EditOrderUseCase } from "./edit-order"
import { UserRoles } from "../entities/user"
import { NotFoundError } from "./errors/not-found-error"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { OrderFactory } from "test/factories/make-order"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: EditOrderUseCase

describe('Edit order', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new EditOrderUseCase(inMemoryUsersRepository, inMemoryOrdersRepository)
    })

    it('should be able to edit an order', async () => {
        const admin = UserFactory.makeUser({
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        const order = OrderFactory.makeOrder()
        inMemoryOrdersRepository.items.push(order)

        await sut.execute({
            adminId: admin.id,
            orderId: order.id,
            deliveryAddress: 'New Address',
            deliveryCoordinates: '987:654',
            recipientEmail: 'johndoe@email.com'
        })

        const updatedOrder = inMemoryOrdersRepository.items.find(o => o.id === order.id)
        expect(updatedOrder).toEqual(expect.objectContaining({
            deliveryAddress: 'New Address',
            deliveryCoordinates: '987:654',
            recipientEmail: 'johndoe@email.com'
        }))
    })

    it('should not be able to edit an order with a transporter', async () => {
        const transporter = UserFactory.makeUser({
            role: UserRoles.TRANSPORTER
        })
        inMemoryUsersRepository.items.push(transporter)

        const order = OrderFactory.makeOrder({
            deliveryAddress: 'Old Address',
            deliveryCoordinates: '123:321',
            recipientEmail: 'johndoe@email.com'
        })
        inMemoryOrdersRepository.items.push(order)

        await expect(() => sut.execute({
            adminId: transporter.id,
            orderId: order.id,
            deliveryAddress: 'New Address',
            deliveryCoordinates: '987:654',
            recipientEmail: 'johndoe@newemail.com'
        })).rejects.toBeInstanceOf(NotFoundError)

        const updatedOrder = inMemoryOrdersRepository.items.find(o => o.id === order.id)
        expect(updatedOrder).toEqual(expect.objectContaining({
            deliveryAddress: 'Old Address',
            deliveryCoordinates: '123:321',
            recipientEmail: 'johndoe@email.com'
        }))
    })
})