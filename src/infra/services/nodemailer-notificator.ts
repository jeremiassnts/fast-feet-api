import { Injectable } from "@nestjs/common";
import { NotificationSender } from "src/domain/services/notification-sender";

@Injectable()
export class NodemailerNotificator implements NotificationSender {
    async send(title: string, recipient: string, content: string): Promise<void> {
        console.log(`Real - Email sent to ${recipient} with title ${title} and content ${content}`)
    }
}