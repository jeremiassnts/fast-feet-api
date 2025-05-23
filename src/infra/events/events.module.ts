import { Module } from '@nestjs/common';
import { OnOrderStatusChanged } from 'src/domain/events/on-order-status-changed';
import { DatabaseModule } from '../database/database.module';
import { NotificationSender } from 'src/domain/services/notification-sender';
import { NodemailerNotificator } from '../services/nodemailer-notificator';
import { EnvModule } from '../env/env.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [DatabaseModule, EnvModule, CacheModule],
  providers: [
    OnOrderStatusChanged,
    {
      provide: NotificationSender,
      useClass: NodemailerNotificator,
    },
  ],
})
export class EventsModule { }
