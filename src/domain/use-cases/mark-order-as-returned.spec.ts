import { MarkOrderAsReturnedUseCase } from './mark-order-as-returned';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderFactory } from 'test/factories/make-order';
import { OrderStatus } from '../entities/order';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: MarkOrderAsReturnedUseCase;

describe('Mark an order as returned', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository, inMemoryUsersRepository);
    sut = new MarkOrderAsReturnedUseCase(inMemoryOrdersRepository);
  });

  it('should be able to mark an order as returned', async () => {
    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);
    const oldStatus = order.status;

    await sut.execute({
      orderId: order.id,
    });

    const updatedOrder = inMemoryOrdersRepository.items.find(
      (o) => o.id === order.id,
    );
    expect(oldStatus).toEqual(OrderStatus.CREATED);
    expect(updatedOrder.status).toEqual(OrderStatus.RETURNED);
  });
});
