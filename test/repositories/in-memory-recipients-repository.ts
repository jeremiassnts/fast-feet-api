import { Recipient } from "src/domain/entities/recipient";
import { RecipientsRepository } from "src/domain/repositories/recipient-repository";

export class InMemoryRecipientsRepository extends RecipientsRepository {
    public items: Recipient[] = [];
    async findByEmail(email: string): Promise<Recipient | null> {
        const recipient = this.items.find(recipient => recipient.email === email);
        return recipient ?? null;
    }
    async create(recipient: Recipient): Promise<Recipient> {
        this.items.push(recipient);
        return recipient;
    }
}