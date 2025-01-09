import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { NotFoundError } from "./errors/not-found-error";
import { RecipientsRepository } from "../repositories/recipient-repository";

interface DeleteRecipientUseCaseRequest {
    recipientId: string
    adminId: string
}

@Injectable()
export class DeleteRecipientUseCase {
    constructor(private usersRepository: UsersRepository, private recipientsRepository: RecipientsRepository) { }
    async execute({ adminId, recipientId }: DeleteRecipientUseCaseRequest) {
        const recipient = await this.recipientsRepository.findById(recipientId)
        if (!recipient) {
            throw new NotFoundError(recipientId)
        }

        const admin = await this.usersRepository.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            throw new NotFoundError(adminId)
        }

        await this.recipientsRepository.delete(recipient.id)
    }
}