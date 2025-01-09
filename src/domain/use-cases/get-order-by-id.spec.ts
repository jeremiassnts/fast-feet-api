import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { OrderFactory } from "test/factories/make-order"
import { GetOrderUseCase } from "./get-order-by-id"

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: GetOrderUseCase

describe('Get order by id', () => {
    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new GetOrderUseCase(inMemoryOrdersRepository)
    })

    it('should be able to get order by id', async () => {
        const order = OrderFactory.makeOrder()
        inMemoryOrdersRepository.items.push(order)

        const result = await sut.execute({ id: order.id })

        expect(result.order).toEqual(expect.objectContaining({
            id: order.id
        }))
    })
})