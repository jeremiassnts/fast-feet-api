import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderFactory } from 'test/factories/make-order';
import { OrderStatus } from '../entities/order';
import { UserFactory } from 'test/factories/make-user';
import { UserRoles } from '../entities/user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FetchOrdersNearToTransporterUseCase } from './fetch-orders-near-to-transporter';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { RecipientFactory } from 'test/factories/make-recipient';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: FetchOrdersNearToTransporterUseCase;

describe('Fetch orders near to transporter', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository
    );
    sut = new FetchOrdersNearToTransporterUseCase(inMemoryOrdersRepository);
  });

  it('should be able to fetch all the orders near to the transporter', async () => {
    const transporter1 = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    const transporter2 = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter1, transporter2);

    const recipientId1 = RecipientFactory.makeRecipient({
      latitude: -10.956988,
      longitude: -37.082933,
    });
    const recipientId2 = RecipientFactory.makeRecipient({
      latitude: -10.976905,
      longitude: -37.053563,
    });
    inMemoryRecipientsRepository.items.push(recipientId1, recipientId2);

    const order1 = OrderFactory.makeOrder({
      status: OrderStatus.WAITING,
      recipientId: recipientId1.id,
    });
    const order2 = OrderFactory.makeOrder({
      status: OrderStatus.PICKEDUP,
      transporterId: transporter1.id,
      recipientId: recipientId2.id,
    });
    const order3 = OrderFactory.makeOrder({
      status: OrderStatus.DELIVERED,
      transporterId: transporter1.id,
    });
    const order4 = OrderFactory.makeOrder({
      status: OrderStatus.PICKEDUP,
      transporterId: transporter2.id,
    });
    inMemoryOrdersRepository.items.push(order1, order2, order3, order4);

    const result = await sut.execute({
      page: 1,
      top: 10,
      transporterId: transporter1.id,
      latitude: -10.970477,
      longitude: -37.05451,
    });

    expect(result.orders).toHaveLength(2);
    expect(result.orders).toEqual([
      expect.objectContaining({
        order: expect.objectContaining({
          id: order2.id,
        }),
      }),
      expect.objectContaining({
        order: expect.objectContaining({
          id: order1.id,
        }),
      }),
    ]);
  });
});
