import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';
import { ControllersModule } from './controllers/controllers.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.SENDING_EMAIL_HOST,
        secure: false,
        port: parseInt(process.env.SENDING_EMAIL_PORT),
        auth: {
          user: process.env.SENDING_EMAIL_USERNAME,
          pass: process.env.SENDING_EMAIL_PASSWORD,
        },
        ignoreTLS: true,
      },
    }),
    EnvModule,
    ControllersModule,
    AuthModule,
    EventsModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
