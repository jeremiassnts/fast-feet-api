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

@Module({
    imports: [DatabaseModule],
    controllers: [
        AuthenticateController
    ],
    providers: [
        JwtService,
        EnvService,
        AuthenticateUseCase,
        {
            provide: PasswordHasher,
            useClass: Bcrypthasher
        },
        {
            provide: Encrypter,
            useClass: JwtEncrypter
        }
    ],
})
export class ControllersModule { }