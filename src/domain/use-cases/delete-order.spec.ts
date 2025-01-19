import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/make-user';
import { UserRoles } from '../entities/user';
import { NotFoundError } from './errors/not-found-error';
import { DeleteOrderUseCase } from './delete-order';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderFactory } from 'test/factories/make-order';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteOrderUseCase;

describe('Delete order', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository);
    sut = new DeleteOrderUseCase(
      inMemoryUsersRepository,
      inMemoryOrdersRepository,
    );
  });

  it('should be able to delete an order', async () => {
    const admin = UserFactory.makeUser({
      role: UserRoles.ADMIN,
    });
    inMemoryUsersRepository.items.push(admin);

    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);
    const oldDeletedDate = order.deletedAt;

    await sut.execute({
      adminId: admin.id,
      orderId: order.id,
    });

    const deletedOrder = inMemoryOrdersRepository.items.find(
      (o) => o.id === order.id,
    );
    expect(deletedOrder).toEqual(
      expect.objectContaining({
        deletedAt: expect.any(Date),
      }),
    );
    expect(oldDeletedDate).toBeNull();
  });

  it('should not be able to delete an order with a transporter', async () => {
    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);

    const transporter = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    await expect(() =>
      sut.execute({
        adminId: transporter.id,
        orderId: order.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(inMemoryOrdersRepository.items[0].deletedAt).toBeNull();
  });
});
