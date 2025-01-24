import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { NotificationSender } from 'src/domain/services/notification-sender';
import { EnvService } from '../env/env.service';

@Injectable()
export class NodemailerNotificator implements NotificationSender {
  constructor(
    private mailerService: MailerService,
    private envService: EnvService,
  ) {}
  async send(title: string, recipient: string, content: string): Promise<void> {
    await this.mailerService.sendMail({
      to: recipient,
      from: this.envService.get('SENDING_EMAIL_FROM'),
      subject: title,
      html: `<h2>${title}</h2><br><p>${content}</p>`,
    });
  }
}
