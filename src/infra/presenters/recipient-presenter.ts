import { Recipient } from "src/domain/entities/recipient";

export class RecipientPresenter {
    public static toHTTP(recipient: Recipient) {
        return {
            id: recipient.id,
            name: recipient.name,
            email: recipient.email,
            address: recipient.address,
            latitude: recipient.latitude,
            longitude: recipient.longitude,
        }
    }
}