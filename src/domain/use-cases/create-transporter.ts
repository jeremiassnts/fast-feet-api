import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { PasswordHasher } from "../services/password-hasher";
import { Encrypter } from "../services/encrypter";
import { AlreadyExistsError } from "./errors/already-exists-error";
import { CpfValidator } from "../services/cpfValidator";
import { InvalidCpfError } from "./errors/invalid-cpf-error";
import { User, UserRoles } from "../entities/user";

interface CreateTransporterUseCaseRequest {
    name: string
    cpf: string
    password: string
    adminId: string
}

@Injectable()
export class CreateTransporterUseCase {
    constructor(private usersRepository: UsersRepository, private passwordHasher: PasswordHasher, private cpfValidator: CpfValidator) { }
    async execute({ cpf, password, name, adminId }: CreateTransporterUseCaseRequest) {
        const user = await this.usersRepository.findByCpf(cpf)
        if (user) {
            throw new AlreadyExistsError(cpf)
        }

        const admin = await this.usersRepository.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            throw new WrongCredentialsError()
        }

        const isCpfValid = await this.cpfValidator.validate(cpf)
        if (!isCpfValid) {
            throw new InvalidCpfError(cpf)
        }

        const hashedPassword = await this.passwordHasher.hash(password)
        const newUser = await this.usersRepository.create(new User({
            name,
            cpf,
            password: hashedPassword,
            role: UserRoles.TRANSPORTER,
            createdAt: new Date(),
            createdBy: adminId
        }))

        return {
            user: newUser
        }
    }
}