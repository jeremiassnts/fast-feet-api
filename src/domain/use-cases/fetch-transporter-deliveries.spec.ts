import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderFactory } from 'test/factories/make-order';
import { FetchTransporterDeliveriesUseCase } from './fetch-transporter-deliveries';
import { OrderStatus } from '../entities/order';
import { UserFactory } from 'test/factories/make-user';
import { UserRoles } from '../entities/user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: FetchTransporterDeliveriesUseCase;

describe('Fetch deliveries by transporter', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository);
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new FetchTransporterDeliveriesUseCase(inMemoryOrdersRepository);
  });

  it('should be able to fetch all deliveries from a transporter', async () => {
    const transporter1 = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    const transporter2 = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter1, transporter2);

    const order1 = OrderFactory.makeOrder({
      status: OrderStatus.DELIVERED,
      transporterId: transporter1.id,
    });
    const order2 = OrderFactory.makeOrder({
      status: OrderStatus.DELIVERED,
      transporterId: transporter1.id,
    });
    const order3 = OrderFactory.makeOrder({
      status: OrderStatus.WAITING,
      transporterId: transporter1.id,
    });
    const order4 = OrderFactory.makeOrder({
      status: OrderStatus.DELIVERED,
      transporterId: transporter2.id,
    });
    inMemoryOrdersRepository.items.push(order1, order2, order3, order4);

    const result = await sut.execute({
      page: 1,
      top: 10,
      transporterId: transporter1.id,
    });

    expect(result.deliveries).toHaveLength(2);
    expect(result.deliveries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: order1.id,
        }),
        expect.objectContaining({
          id: order2.id,
        }),
      ]),
    );
  });
});
