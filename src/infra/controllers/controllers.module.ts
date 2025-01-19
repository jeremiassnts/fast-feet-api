import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './authenticate.controller';
import { AuthenticateUseCase } from 'src/domain/use-cases/authenticate';
import { PasswordHasher } from 'src/domain/services/password-hasher';
import { Bcrypthasher } from '../services/bcrypt-hasher';
import { Encrypter } from 'src/domain/services/encrypter';
import { JwtEncrypter } from '../services/jwt-encrypter';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '../env/env.service';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordUseCase } from 'src/domain/use-cases/change-password';
import { CreateOrderController } from './create-order.controller';
import { CreateOrderUseCase } from 'src/domain/use-cases/create-order';
import { CreateRecipientController } from './create-recipient.controller';
import { CreateRecipientUseCase } from 'src/domain/use-cases/create-recipient';
import { CreateTransporterController } from './create-transporter.controller';
import { CreateTransporterUseCase } from 'src/domain/use-cases/create-transporter';
import { CpfValidator } from 'src/domain/services/cpfValidator';
import { CvCpfValidator } from '../services/cpf-validator';
import { DeleteOrderController } from './delete-order.controller';
import { DeleteOrderUseCase } from 'src/domain/use-cases/delete-order';
import { DeleteRecipientController } from './delete-recipient.controller';
import { DeleteRecipientUseCase } from 'src/domain/use-cases/delete-recipient';
import { DeleteTransporterController } from './delete-transporter.controller';
import { DeleteTransporterUseCase } from 'src/domain/use-cases/delete-transporter';
import { EditRecipientController } from './edit-recipient.controller';
import { EditRecipientUseCase } from 'src/domain/use-cases/edit-recipient';
import { EditTransporterController } from './edit-transporter.controller';
import { EditTransporterUseCase } from 'src/domain/use-cases/edit-transporter';
import { MarkOrderAsDeliveredUseCase } from 'src/domain/use-cases/mark-order-as-delivered';
import { MarkOrderAsDeliveredController } from './mark-order-as-delivered.controller';
import { PhotoUploader } from 'src/domain/services/photo-uploader';
import { R2PhotoUploader } from '../services/r2-photo-uploader';
import { MarkOrderAsPickedUpController } from './mark-order-as-picked-up.controller';
import { MarkOrderAsPickedUpUseCase } from 'src/domain/use-cases/mark-order-as-picked-up';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AuthenticateController,
    ChangePasswordController,
    CreateOrderController,
    CreateRecipientController,
    CreateTransporterController,
    DeleteOrderController,
    DeleteRecipientController,
    DeleteTransporterController,
    EditRecipientController,
    EditTransporterController,
    MarkOrderAsDeliveredController,
    MarkOrderAsPickedUpController,
  ],
  providers: [
    JwtService,
    EnvService,
    AuthenticateUseCase,
    ChangePasswordUseCase,
    CreateOrderUseCase,
    CreateRecipientUseCase,
    CreateTransporterUseCase,
    DeleteOrderUseCase,
    DeleteRecipientUseCase,
    DeleteTransporterUseCase,
    EditRecipientUseCase,
    EditTransporterUseCase,
    MarkOrderAsDeliveredUseCase,
    MarkOrderAsPickedUpUseCase,
    {
      provide: PasswordHasher,
      useClass: Bcrypthasher,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: CpfValidator,
      useClass: CvCpfValidator,
    },
    {
      provide: PhotoUploader,
      useClass: R2PhotoUploader,
    },
  ],
})
export class ControllersModule { }
