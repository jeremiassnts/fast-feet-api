import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/domain/entities/user';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientFactory } from 'test/factories/make-recipient';

describe('Get order by id (E2E)', () => {
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
        }).compile();
        app = moduleRef.createNestApplication();
        userFactory = moduleRef.get(UserFactory);
        orderFactory = moduleRef.get(OrderFactory);
        recipientFactory = moduleRef.get(RecipientFactory);
        jwt = moduleRef.get(JwtService);
        prismaService = moduleRef.get(PrismaService);

        await app.init();
    });

    test('GET /order/:orderId', async () => {
        const user = await userFactory.makePrismaUser();
        const accessToken = jwt.sign({
            sub: user.id,
        });

        const recipient = await recipientFactory.makePrismaRecipient();

        const order = await orderFactory.makePrismaOrder({
            title: 'order 01',
            recipientId: recipient.id,
        })
        const response = await request(app.getHttpServer())
            .get('/order/' + order.id)
            .set('Authorization', `Bearer ${accessToken}`)
        expect(response.body.order).toEqual(expect.objectContaining({
            id: order.id,
            title: 'order 01',
            recipient: expect.objectContaining({
                id: recipient.id
            })
        }));
        expect(response.status).toEqual(200);
    });
});
