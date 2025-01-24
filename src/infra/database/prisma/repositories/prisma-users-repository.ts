import { User, UserRoles } from 'src/domain/entities/user';
import { UsersRepository } from 'src/domain/repositories/users-repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { CacheRepository } from 'src/infra/cache/cache-repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService, private cacheRepository: CacheRepository) { }
  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        cpf,
      },
    });
    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }
  async findById(id: string): Promise<User | null> {
    const cached = await this.cacheRepository.get(`user:${id}`)
    if (cached) {
      const user = JSON.parse(cached)
      return PrismaUserMapper.toDomain(user)
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) return null;

    await this.cacheRepository.set(`user:${id}`, JSON.stringify(user))
    return PrismaUserMapper.toDomain(user);
  }
  async create(user: User): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        name: user.name,
        password: user.password,
        cpf: user.cpf,
        role: user.role === UserRoles.ADMIN ? 'ADMIN' : 'TRANSPORTER',
        createdAt: new Date(),
      },
    });
    return PrismaUserMapper.toDomain(newUser);
  }
  async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      data: {
        name: user.name,
        password: user.password,
      },
      where: {
        id: user.id,
      },
    });

    await this.cacheRepository.delete(`user:${user.id}`)
    return PrismaUserMapper.toDomain(updatedUser);
  }
  async delete(userId: string): Promise<void> {
    await this.prisma.user.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: userId,
      },
    });
    await this.cacheRepository.delete(`user:${userId}`)
  }
  async fetchActiveTransporters(page: number, top: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
        role: 'TRANSPORTER',
      },
      take: top,
      skip: (page - 1) * top,
    });
    return users.map(PrismaUserMapper.toDomain);
  }
}
