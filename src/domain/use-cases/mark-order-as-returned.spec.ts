import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { UserFactory } from "test/factories/make-user"
import { MarkOrderAsReturnedUseCase } from "./mark-order-as-returned"
import { UserRoles } from "../entities/user"
import { NotFoundError } from "./errors/not-found-error"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { OrderFactory } from "test/factories/make-order"
import { OrderStatus } from "../entities/order"

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: MarkOrderAsReturnedUseCase

describe('Mark an order as returned', () => {
    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new MarkOrderAsReturnedUseCase(inMemoryOrdersRepository)
    })

    it('should be able to mark an order as returned', async () => {
        const order = OrderFactory.makeOrder()
        inMemoryOrdersRepository.items.push(order)
        const oldStatus = order.status

        await sut.execute({
            orderId: order.id
        })

        const updatedOrder = inMemoryOrdersRepository.items.find(o => o.id === order.id)
        expect(oldStatus).toEqual(OrderStatus.CREATED)
        expect(updatedOrder.status).toEqual(OrderStatus.RETURNED)
    })
})