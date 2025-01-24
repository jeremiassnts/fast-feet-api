import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientFactory } from 'test/factories/make-recipient';
import { vi } from 'vitest';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('Mark order as waiting (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let orderFactory: OrderFactory;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, OrderFactory, RecipientFactory],
    })
      .overrideProvider(EventEmitter2)
      .useValue({
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
      })
      .compile();
    app = moduleRef.createNestApplication();
    orderFactory = moduleRef.get(OrderFactory);
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    jwt = moduleRef.get(JwtService);
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  test('PUT /order/waiting', async () => {
    const admin = await userFactory.makePrismaUser({});
    const accessToken = jwt.sign({
      sub: admin.id,
    });

    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });
    const response = await request(app.getHttpServer())
      .put(`/order/${order.id}/waiting`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toEqual(200);

    const waitingOrder = await prismaService.order.findFirst();
    expect(waitingOrder.status).toEqual('WAITING');
  });
});
