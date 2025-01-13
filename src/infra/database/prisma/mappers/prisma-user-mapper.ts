import { User as PrismaUser } from "@prisma/client";
import { User, UserRoles } from "src/domain/entities/user";

export class PrismaUserMapper {
    public static ToDomain(data: PrismaUser): User {
        return new User({
            id: data.id,
            name: data.name,
            password: data.password,
            cpf: data.cpf,
            role: data.role === 'ADMIN' ? UserRoles.ADMIN : UserRoles.TRANSPORTER,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt
        })
    }
}