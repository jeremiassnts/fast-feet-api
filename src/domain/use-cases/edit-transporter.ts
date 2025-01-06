import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { CpfValidator } from "../services/cpfValidator";
import { InvalidCpfError } from "./errors/invalid-cpf-error";
import { NotFoundError } from "./errors/not-found-error";

interface EditTransporterUseCaseRequest {
    transporterId: string
    adminId: string
    name: string
    cpf: string
}

@Injectable()
export class EditTransporterUseCase {
    constructor(private usersRepository: UsersRepository, private cpfValidator: CpfValidator) { }
    async execute({ cpf, name, adminId, transporterId }: EditTransporterUseCaseRequest) {
        const transporter = await this.usersRepository.findById(transporterId)
        if (!transporter) {
            throw new NotFoundError(transporterId)
        }

        const admin = await this.usersRepository.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            throw new NotFoundError(adminId)
        }

        const isCpfValid = await this.cpfValidator.validate(cpf)
        if (!isCpfValid) {
            throw new InvalidCpfError(cpf)
        }

        transporter.cpf = cpf
        transporter.name = name

        await this.usersRepository.update(transporter)
    }
}