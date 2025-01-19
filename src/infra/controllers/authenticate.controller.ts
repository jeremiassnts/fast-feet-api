import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  SetMetadata,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { AuthenticateUseCase } from 'src/domain/use-cases/authenticate';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { WrongCredentialsError } from 'src/domain/use-cases/errors/wrong-credentials-error';

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

@Controller('/token')
@SetMetadata('isPublic', true)
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}
  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @HttpCode(200)
  async handler(@Body() body: z.infer<typeof authenticateBodySchema>) {
    const { cpf, password } = body;

    try {
      const result = await this.authenticateUseCase.execute({
        cpf,
        password,
      });

      return {
        accessToken: result.accessToken,
      };
    } catch (error) {
      if (error instanceof WrongCredentialsError) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
