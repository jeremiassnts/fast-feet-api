import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '../auth/current-user-decorator';
import { UserPayload } from '../auth/jwt.strategy';
import { NotFoundError } from 'src/domain/use-cases/errors/not-found-error';
import { CreateTransporterUseCase } from 'src/domain/use-cases/create-transporter';

const createTransporterBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
});

@Controller('/transporter')
export class CreateTransporterController {
  constructor(private createTransporter: CreateTransporterUseCase) {}
  @Post()
  @HttpCode(201)
  async handler(
    @Body() body: z.infer<typeof createTransporterBodySchema>,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cpf, password } = body;
    try {
      await this.createTransporter.execute({
        adminId: user.sub,
        cpf,
        name,
        password,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
