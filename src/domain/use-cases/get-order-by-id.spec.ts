import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderFactory } from 'test/factories/make-order';
import { GetOrderUseCase } from './get-order-by-id';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: GetOrderUseCase;

describe('Get order by id', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository);
    sut = new GetOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to get order by id', async () => {
    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);

    const result = await sut.execute({ id: order.id });

    expect(result.order).toEqual(
      expect.objectContaining({
        id: order.id,
      }),
    );
  });
});
