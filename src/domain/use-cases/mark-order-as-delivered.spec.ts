import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/make-user';
import { UserRoles } from '../entities/user';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { OrderFactory } from 'test/factories/make-order';
import { OrderStatus } from '../entities/order';
import { MarkOrderAsDeliveredUseCase } from './mark-order-as-delivered';
import { FakePhotoUploader } from 'test/services/fake-photo-uploader';
import { InvalidPhotoTypeError } from './errors/invalid-photo-type-error';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let fakePhotoUploader: FakePhotoUploader;
let sut: MarkOrderAsDeliveredUseCase;

describe('Mark an order as delivered', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository);
    fakePhotoUploader = new FakePhotoUploader();
    sut = new MarkOrderAsDeliveredUseCase(
      inMemoryUsersRepository,
      inMemoryOrdersRepository,
      fakePhotoUploader,
    );
  });

  it('should be able to mark an order as delivered', async () => {
    const transporter = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    const order = OrderFactory.makeOrder({
      transporterId: transporter.id,
      status: OrderStatus.WAITING,
    });
    inMemoryOrdersRepository.items.push(order);
    const oldStatus = order.status;

    await sut.execute({
      transporterId: transporter.id,
      orderId: order.id,
      body: Buffer.from(''),
      fileName: 'photo.jpg',
      fileType: 'image/jpeg',
    });

    const updatedOrder = inMemoryOrdersRepository.items.find(
      (o) => o.id === order.id,
    );
    expect(oldStatus).toEqual(OrderStatus.WAITING);
    expect(updatedOrder).toEqual(
      expect.objectContaining({
        status: OrderStatus.DELIVERED,
      }),
    );
    expect(fakePhotoUploader.uploads).toHaveLength(1);
  });

  it('should not be able to mark an order as delivered with invalid photo', async () => {
    const transporter = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    const order = OrderFactory.makeOrder();
    inMemoryOrdersRepository.items.push(order);

    await expect(() =>
      sut.execute({
        transporterId: transporter.id,
        orderId: order.id,
        body: Buffer.from(''),
        fileName: 'test.txt',
        fileType: 'text/plain',
      }),
    ).rejects.toBeInstanceOf(InvalidPhotoTypeError);

    const updatedOrder = inMemoryOrdersRepository.items.find(
      (o) => o.id === order.id,
    );
    expect(updatedOrder).toEqual(
      expect.objectContaining({
        status: OrderStatus.CREATED,
      }),
    );
    expect(fakePhotoUploader.uploads).toHaveLength(0);
  });
});
