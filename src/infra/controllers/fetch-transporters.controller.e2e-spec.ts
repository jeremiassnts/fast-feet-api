import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/domain/entities/user';

describe('Fetch transporters (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('GET /transporter', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: user.id,
    });

    await userFactory.makePrismaUser({
      cpf: '0000000000',
      role: UserRoles.TRANSPORTER,
    });
    await userFactory.makePrismaUser({
      cpf: '111111111',
      role: UserRoles.TRANSPORTER,
    });
    const response = await request(app.getHttpServer())
      .get(`/transporter?page=1&top=10`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toEqual(200);
    expect(response.body.transporters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          cpf: '0000000000',
        }),
        expect.objectContaining({
          cpf: '111111111',
        }),
      ]),
    );
  });
});
