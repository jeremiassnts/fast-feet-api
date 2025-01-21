import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { OrderFactory } from 'test/factories/make-order';
import { UserRoles } from 'src/domain/entities/user';
import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderStatus } from 'src/domain/entities/order';

describe('Fetch orders near to transporter (E2E)', () => {
    let app: INestApplication;
    let userFactory: UserFactory;
    let ordersFactory: OrderFactory;
    let recipientsFactory: RecipientFactory;
    let jwt: JwtService;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [UserFactory, OrderFactory, RecipientFactory],
        }).compile();
        app = moduleRef.createNestApplication();
        userFactory = moduleRef.get(UserFactory);
        ordersFactory = moduleRef.get(OrderFactory);
        recipientsFactory = moduleRef.get(RecipientFactory);
        jwt = moduleRef.get(JwtService);
        prismaService = moduleRef.get(PrismaService);

        await app.init();
    });

    test('GET /transporter-near-orders', async () => {
        const transporter1 = await userFactory.makePrismaUser({
            role: UserRoles.TRANSPORTER,
            cpf: '111111'
        });
        const accessToken = jwt.sign({
            sub: transporter1.id,
        });

        const transporter2 = await userFactory.makePrismaUser({
            role: UserRoles.TRANSPORTER,
            cpf: '000000'
        });

        const recipientId1 = await recipientsFactory.makePrismaRecipient({
            email: 'test@example.com',
            latitude: -10.956988,
            longitude: -37.082933,
        });
        const recipientId2 = await recipientsFactory.makePrismaRecipient({
            email: 'test2@example.com',
            latitude: -10.976905,
            longitude: -37.053563,
        });

        await ordersFactory.makePrismaOrder({
            title: 'order 01',
            status: OrderStatus.WAITING,
            recipientId: recipientId1.id,
        });
        await ordersFactory.makePrismaOrder({
            title: 'order 02',
            status: OrderStatus.PICKEDUP,
            transporterId: transporter1.id,
            recipientId: recipientId2.id,
        });
        await ordersFactory.makePrismaOrder({
            title: 'order 03',
            status: OrderStatus.DELIVERED,
            transporterId: transporter1.id,
            recipientId: recipientId1.id,
        });
        await ordersFactory.makePrismaOrder({
            title: 'order 04',
            status: OrderStatus.PICKEDUP,
            transporterId: transporter2.id,
            recipientId: recipientId2.id,
        });

        const response = await request(app.getHttpServer())
            .get('/transporter-near-orders')
            .query({
                page: 1,
                top: 10,
                latitude: -10.970477,
                longitude: -37.05451,
            })
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.status).toEqual(200);
        expect(response.body.orders).toEqual([
            expect.objectContaining({
                title: 'order 02'
            }),
            expect.objectContaining({
                title: 'order 01'
            }),
        ]);
    });
});
