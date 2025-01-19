import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./authenticate.controller";
import { AuthenticateUseCase } from "src/domain/use-cases/authenticate";
import { PasswordHasher } from "src/domain/services/password-hasher";
import { Bcrypthasher } from "../services/bcrypt-hasher";
import { Encrypter } from "src/domain/services/encrypter";
import { JwtEncrypter } from "../services/jwt-encrypter";
import { JwtService } from "@nestjs/jwt";
import { EnvService } from "../env/env.service";
import { ChangePasswordController } from "./change-password.controller";
import { ChangePasswordUseCase } from "src/domain/use-cases/change-password";
import { CreateOrderController } from "./create-order.controller";
import { CreateOrderUseCase } from "src/domain/use-cases/create-order";
import { CreateRecipientController } from "./create-recipient.controller";
import { CreateRecipientUseCase } from "src/domain/use-cases/create-recipient";
import { CreateTransporterController } from "./create-transporter.controller";
import { CreateTransporterUseCase } from "src/domain/use-cases/create-transporter";
import { CpfValidator } from "src/domain/services/cpfValidator";
import { CvCpfValidator } from "../services/cpf-validator";

@Module({
    imports: [DatabaseModule],
    controllers: [
        AuthenticateController,
        ChangePasswordController,
        CreateOrderController,
        CreateRecipientController,
        CreateTransporterController
    ],
    providers: [
        JwtService,
        EnvService,
        AuthenticateUseCase,
        ChangePasswordUseCase,
        CreateOrderUseCase,
        CreateRecipientUseCase,
        CreateTransporterUseCase,
        {
            provide: PasswordHasher,
            useClass: Bcrypthasher
        },
        {
            provide: Encrypter,
            useClass: JwtEncrypter
        },
        {
            provide: CpfValidator,
            useClass: CvCpfValidator
        }
    ],
})
export class ControllersModule { }