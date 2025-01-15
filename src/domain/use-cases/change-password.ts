import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { NotFoundError } from "./errors/not-found-error";
import { PasswordHasher } from "../services/password-hasher";

interface ChangePasswordUseCaseRequest {
    userId: string
    adminId: string
    password: string
}

@Injectable()
export class ChangePasswordUseCase {
    constructor(private usersRepository: UsersRepository, private passwordHasher: PasswordHasher) { }
    async execute({ adminId, password, userId }: ChangePasswordUseCaseRequest) {
        const user = await this.usersRepository.findById(userId)
        if (!user) {
            throw new NotFoundError(userId)
        }

        const admin = await this.usersRepository.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            throw new NotFoundError(adminId)
        }

        const hashedPassword = await this.passwordHasher.hash(password)

        user.password = hashedPassword
        await this.usersRepository.update(user)
    }
}