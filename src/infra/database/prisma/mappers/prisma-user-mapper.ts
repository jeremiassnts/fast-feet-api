import { User as PrismaUser } from '@prisma/client';
import { User, UserRoles } from 'src/domain/entities/user';

export class PrismaUserMapper {
  public static toDomain(data: PrismaUser): User {
    if (!data) return null;
    return new User({
      id: data.id,
      name: data.name,
      password: data.password,
      cpf: data.cpf,
      role: data.role === 'ADMIN' ? UserRoles.ADMIN : UserRoles.TRANSPORTER,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }
  public static toPrisma(data: User): PrismaUser {
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      password: data.password,
      cpf: data.cpf,
      role: data.role === UserRoles.ADMIN ? 'ADMIN' : 'TRANSPORTER',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    };
  }
}
