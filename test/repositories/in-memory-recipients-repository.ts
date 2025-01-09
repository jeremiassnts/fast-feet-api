import { Recipient } from "src/domain/entities/recipient";
import { RecipientsRepository } from "src/domain/repositories/recipient-repository";

export class InMemoryRecipientsRepository extends RecipientsRepository {
    async update(recipient: Recipient): Promise<void> {
        const index = this.items.findIndex(o => o.id === recipient.id);
        this.items[index].name = recipient.name
        this.items[index].latitude = recipient.latitude
        this.items[index].longitude = recipient.longitude
        this.items[index].address = recipient.address
    }
    public items: Recipient[] = [];
    async findByEmail(email: string): Promise<Recipient | null> {
        const recipient = this.items.find(recipient => recipient.email === email);
        return recipient ?? null;
    }
    async create(recipient: Recipient): Promise<Recipient> {
        this.items.push(recipient);
        return recipient;
    }
    async findById(id: string): Promise<Recipient | null> {
        const recipient = this.items.find(r => r.id === id)
        return recipient ?? null
    }
}