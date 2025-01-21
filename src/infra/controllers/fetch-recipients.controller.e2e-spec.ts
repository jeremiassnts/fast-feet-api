import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RecipientFactory } from 'test/factories/make-recipient';
import { faker } from '@faker-js/faker';

describe('Fetch Recipients (E2E)', () => {
    let app: INestApplication;
    let userFactory: UserFactory;
    let recipientFactory: RecipientFactory;
    let jwt: JwtService;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [UserFactory, RecipientFactory],
        }).compile();
        app = moduleRef.createNestApplication();
        userFactory = moduleRef.get(UserFactory);
        recipientFactory = moduleRef.get(RecipientFactory);
        jwt = moduleRef.get(JwtService);
        prismaService = moduleRef.get(PrismaService);

        await app.init();
    });

    test('GET /recipient', async () => {
        const user = await userFactory.makePrismaUser();
        const accessToken = jwt.sign({
            sub: user.id,
        });

        await recipientFactory.makePrismaRecipient({
            email: 'johndoe@email.com'
        });
        await recipientFactory.makePrismaRecipient({
            email: 'mary@email.com'
        });
        const response = await request(app.getHttpServer())
            .get('/recipient?page=1&top=10')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.status).toEqual(200);
        expect(response.body.recipients).toEqual(expect.arrayContaining([
            expect.objectContaining({
                email: 'johndoe@email.com'
            }),
            expect.objectContaining({
                email: 'mary@email.com'
            })
        ]));
    });
});
