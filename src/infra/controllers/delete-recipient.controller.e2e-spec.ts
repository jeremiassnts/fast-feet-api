import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RecipientFactory } from 'test/factories/make-recipient';

describe('Delete Recipient (E2E)', () => {
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

  test('DELETE /recipient', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: user.id,
    });

    const recipient = await recipientFactory.makePrismaRecipient();
    const response = await request(app.getHttpServer())
      .delete('/recipient/' + recipient.id)
      .set('Authorization', `Bearer ${accessToken}`);

    const deletedRecipient = await prismaService.recipient.findFirst();
    expect(response.status).toEqual(200);
    expect(deletedRecipient).toBeNull();
  });
});
