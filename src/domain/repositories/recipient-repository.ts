import { Recipient } from "../entities/recipient";

export abstract class RecipientsRepository {
    abstract create(recipient: Recipient): Promise<Recipient>
    abstract findByEmail(email: string): Promise<Recipient | null>
    abstract findById(id: string): Promise<Recipient | null>
    abstract update(recipient: Recipient): Promise<void>
    abstract delete(recipientId: string): Promise<void>
}