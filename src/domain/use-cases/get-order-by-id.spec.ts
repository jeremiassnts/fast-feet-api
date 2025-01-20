import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderFactory } from 'test/factories/make-order';
import { GetOrderUseCase } from './get-order-by-id';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetOrderUseCase;

describe('Get order by id', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository, inMemoryUsersRepository);
    sut = new GetOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to get order by id', async () => {
    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);

    const result = await sut.execute({ id: order.id });

    expect(result.order).toEqual(expect.objectContaining({
      order: expect.objectContaining({
        id: order.id,
      })
    }));
  });
});
