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
import { OrderStatus } from 'src/domain/entities/order';
import { RecipientFactory } from 'test/factories/make-recipient';

describe('Fetch transporter deliveries (E2E)', () => {
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

    test('GET /transporter/orders', async () => {
        const transporter = await userFactory.makePrismaUser({
            role: UserRoles.TRANSPORTER
        });
        const accessToken = jwt.sign({
            sub: transporter.id,
        });

        const recipient = await recipientFactory.makePrismaRecipient()

        await orderFactory.makePrismaOrder({
            title: 'order 01',
            status: OrderStatus.DELIVERED,
            transporterId: transporter.id,
            recipientId: recipient.id
        })
        await orderFactory.makePrismaOrder({
            title: 'order 02',
            status: OrderStatus.DELIVERED,
            transporterId: transporter.id,
            recipientId: recipient.id
        })
        await orderFactory.makePrismaOrder({
            title: 'order 03',
            status: OrderStatus.WAITING,
            transporterId: transporter.id,
            recipientId: recipient.id
        })
        const response = await request(app.getHttpServer())
            .get('/transporter-orders/?page=1&top=10')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.status).toEqual(200);
        expect(response.body.deliveries).toHaveLength(2)
        expect(response.body.deliveries).toEqual(expect.arrayContaining([
            expect.objectContaining({
                title: 'order 01'
            }),
            expect.objectContaining({
                title: 'order 02'
            })
        ]));
    });
});
