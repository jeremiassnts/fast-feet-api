import { User, UserProps, UserRoles } from 'src/domain/entities/user';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { PrismaUserMapper } from 'src/infra/database/prisma/mappers/prisma-user-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) { }
  static makeUser(override: Partial<UserProps> = {}) {
    const user = new User({
      name: faker.person.fullName(),
      cpf: '00000000000',
      password: faker.internet.password(),
      role: UserRoles.ADMIN,
      createdAt: faker.date.past(),
      updatedAt: null,
      ...override,
    });
    return user;
  }
  async makePrismaUser(override: Partial<UserProps> = {}) {
    const user = UserFactory.makeUser(override);
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
    return user;
  }
}
