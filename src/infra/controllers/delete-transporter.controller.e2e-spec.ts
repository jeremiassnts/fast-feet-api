import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/domain/entities/user';

describe('Delete Transporter (E2E)', () => {
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

  test('DELETE /transporter', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: user.id,
    });

    const transporter = await userFactory.makePrismaUser({
      cpf: '1234567890',
      role: UserRoles.TRANSPORTER,
    });
    const response = await request(app.getHttpServer())
      .delete('/transporter/' + transporter.id)
      .set('Authorization', `Bearer ${accessToken}`);

    const deletedTransporter = await prismaService.user.findFirst({
      where: {
        cpf: '1234567890',
      },
    });
    expect(response.status).toEqual(200);
    expect(deletedTransporter.deletedAt).not.toBeNull();
  });
});
