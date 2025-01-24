import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { NotificationSender } from 'src/domain/services/notification-sender';
import { FakeMailer } from 'test/services/fake-mailer';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderStatus } from 'src/domain/entities/order';
import { PrismaOrdersRepository } from '../database/prisma/repositories/prisma-orders-repository';
import { OrdersRepository } from 'src/domain/repositories/orders-repository';
import { MockInstance, vi } from 'vitest';
import { OnOrderStatusChanged } from 'src/domain/events/on-order-status-changed';

describe('On order status changed event (E2E)', () => {
  let app: INestApplication;
  let orderFactory: OrderFactory;
  let recipientFactory: RecipientFactory;
  let orderRepository: PrismaOrdersRepository;
  let spy: MockInstance;
  let subscriber: OnOrderStatusChanged;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, RecipientFactory],
    })
      .overrideProvider(NotificationSender)
      .useClass(FakeMailer)
      .compile();
    app = moduleRef.createNestApplication();
    orderRepository = moduleRef.get(OrdersRepository);
    orderFactory = moduleRef.get(OrderFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    subscriber = moduleRef.get(OnOrderStatusChanged);

    await app.init();
  });

  test('UPDATE order', async () => {
    spy = vi.spyOn(subscriber, 'handle');

    const recipient = await recipientFactory.makePrismaRecipient();
    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      status: OrderStatus.CREATED,
    });

    order.status = OrderStatus.DELIVERED;
    await orderRepository.update(order);

    expect(spy).toHaveBeenCalledWith({
      orderId: order.id,
      status: OrderStatus.DELIVERED,
    });
  });
});
