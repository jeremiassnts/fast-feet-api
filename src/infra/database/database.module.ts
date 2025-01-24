import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from 'src/domain/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { RecipientsRepository } from 'src/domain/repositories/recipient-repository';
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository';
import { OrdersRepository } from 'src/domain/repositories/orders-repository';
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    RecipientsRepository,
    OrdersRepository,
  ],
})
export class DatabaseModule { }
