import { Injectable } from '@nestjs/common';
import { NotificationSender } from 'src/domain/services/notification-sender';

@Injectable()
export class FakeMailer implements NotificationSender {
  async send(title: string, recipient: string, content: string): Promise<void> {
    console.log(
      `Fake - Email sent to ${recipient} with title ${title} and content ${content}`,
    );
  }
}
