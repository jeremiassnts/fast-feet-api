import { Recipient } from "../entities/recipient";

export abstract class RecipientsRepository {
    abstract create(recipient: Recipient): Promise<Recipient>
    abstract findByEmail(email: string): Promise<Recipient | null>
}