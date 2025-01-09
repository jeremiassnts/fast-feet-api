import { Injectable } from "@nestjs/common";
import { RecipientsRepository } from "../repositories/recipient-repository";

interface FetchRecipientUseCaseRequest {
    page: number;
    top: number;
}

@Injectable()
export class FetchRecipientUseCase {
    constructor(private recipientsRepository: RecipientsRepository) { }
    async execute({ page, top }: FetchRecipientUseCaseRequest) {
        const recipients = await this.recipientsRepository.fetchAll(page, top)
        return { recipients }
    }
}