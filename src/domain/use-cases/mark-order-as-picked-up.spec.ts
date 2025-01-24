import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/make-user';
import { MarkOrderAsPickedUpUseCase } from './mark-order-as-picked-up';
import { UserRoles } from '../entities/user';
import { NotFoundError } from './errors/not-found-error';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderFactory } from 'test/factories/make-order';
import { OrderStatus } from '../entities/order';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: MarkOrderAsPickedUpUseCase;

describe('Mark an order as pickedup', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository,
    );
    sut = new MarkOrderAsPickedUpUseCase(
      inMemoryUsersRepository,
      inMemoryOrdersRepository,
    );
  });

  it('should be able to mark an order as pickedup', async () => {
    const transporter = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);
    const oldStatus = order.status;

    await sut.execute({
      transporterId: transporter.id,
      orderId: order.id,
    });

    const updatedOrder = inMemoryOrdersRepository.items.find(
      (o) => o.id === order.id,
    );
    expect(oldStatus).toEqual(OrderStatus.CREATED);
    expect(updatedOrder).toEqual(
      expect.objectContaining({
        status: OrderStatus.PICKEDUP,
        transporterId: transporter.id,
      }),
    );
  });

  it('should not be able to mark an order as pickedup by a admin', async () => {
    const admin = UserFactory.makeUser({
      role: UserRoles.ADMIN,
    });
    inMemoryUsersRepository.items.push(admin);

    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);
    const oldStatus = order.status;

    await expect(() =>
      sut.execute({
        transporterId: admin.id,
        orderId: order.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    const updatedOrder = inMemoryOrdersRepository.items.find(
      (o) => o.id === order.id,
    );
    expect(oldStatus).toEqual(OrderStatus.CREATED);
    expect(updatedOrder.status).toEqual(OrderStatus.CREATED);
  });
});
