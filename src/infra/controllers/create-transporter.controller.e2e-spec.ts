import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Create Transporter (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  test('POST /transporter', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: user.id,
    });

    const response = await request(app.getHttpServer())
      .post('/transporter')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: process.env.E2E_VALID_CPF,
        password: '123456',
      });

    expect(response.statusCode).toBe(201);

    const createdTransporter = await prismaService.user.findFirst({
      where: {
        cpf: process.env.E2E_VALID_CPF,
      },
    });
    expect(createdTransporter).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      }),
    );
  });
});
