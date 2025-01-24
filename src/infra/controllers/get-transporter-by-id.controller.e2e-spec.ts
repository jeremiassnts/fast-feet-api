import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/domain/entities/user';

describe('Get transporter by id (E2E)', () => {
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

  test('GET /transporter/:transporterId', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: user.id,
    });

    const transporter = await userFactory.makePrismaUser({
      cpf: '1234567890',
      role: UserRoles.TRANSPORTER,
    });
    const response = await request(app.getHttpServer())
      .get('/transporter/' + transporter.id)
      .set('Authorization', `Bearer ${accessToken}`);
    console.log(response.body);

    expect(response.body.transporter).toEqual(
      expect.objectContaining({
        cpf: '1234567890',
      }),
    );
    expect(response.status).toEqual(200);
  });
});
