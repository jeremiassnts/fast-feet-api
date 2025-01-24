import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/make-user';
import { MarkOrderAsWaitingUseCase } from './mark-order-as-waiting';
import { UserRoles } from '../entities/user';
import { NotFoundError } from './errors/not-found-error';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderFactory } from 'test/factories/make-order';
import { OrderStatus } from '../entities/order';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: MarkOrderAsWaitingUseCase;

describe('Mark an order as waiting', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository,
    );
    sut = new MarkOrderAsWaitingUseCase(
      inMemoryUsersRepository,
      inMemoryOrdersRepository,
    );
  });

  it('should be able to mark an order as waiting', async () => {
    const admin = UserFactory.makeUser({
      role: UserRoles.ADMIN,
    });
    inMemoryUsersRepository.items.push(admin);

    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);
    const oldStatus = order.status;

    await sut.execute({
      adminId: admin.id,
      orderId: order.id,
    });

    const updatedOrder = inMemoryOrdersRepository.items.find(
      (o) => o.id === order.id,
    );
    expect(oldStatus).toEqual(OrderStatus.CREATED);
    expect(updatedOrder.status).toEqual(OrderStatus.WAITING);
  });

  it('should not be able to mark an order as waiting by a transporter', async () => {
    const transporter = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);
    const oldStatus = order.status;

    await expect(() =>
      sut.execute({
        adminId: transporter.id,
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
