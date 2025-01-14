import { User, UserRoles } from "src/domain/entities/user";
import { UsersRepository } from "src/domain/repositories/users-repository";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
    constructor(private prisma: PrismaService) { }
    async findByCpf(cpf: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                cpf
            }
        })
        if (!user) return null

        return PrismaUserMapper.toDomain(user)
    }
    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                id
            }
        })
        if (!user) return null
        return PrismaUserMapper.toDomain(user)
    }
    async create(user: User): Promise<User> {
        const newUser = await this.prisma.user.create({
            data: {
                name: user.name,
                password: user.password,
                cpf: user.cpf,
                role: user.role === UserRoles.ADMIN ? 'ADMIN' : 'TRANSPORTER',
                createdAt: new Date(),
            }
        })
        return PrismaUserMapper.toDomain(newUser)
    }
    async update(user: User): Promise<User> {
        const updatedUser = await this.prisma.user.update({
            data: {
                name: user.name,
            },
            where: {
                id: user.id,
            },
        })

        return PrismaUserMapper.toDomain(updatedUser)
    }
    async delete(userId: string): Promise<void> {
        await this.prisma.user.update({
            data: {
                deletedAt: new Date(),
            },
            where: {
                id: userId,
            },
        })
    }
    async fetchActive(page: number, top: number): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: {
                deletedAt: null,
            },
            take: top,
            skip: (page - 1) * top
        })
        return users.map(PrismaUserMapper.toDomain)
    }

}