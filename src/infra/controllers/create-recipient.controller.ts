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
import { CreateRecipientUseCase } from 'src/domain/use-cases/create-recipient';

const createRecipientBodySchema = z.object({
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  email: z.string().email(),
});

@Controller('/recipient')
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}
  @Post()
  @HttpCode(201)
  async handler(
    @Body() body: z.infer<typeof createRecipientBodySchema>,
    @CurrentUser() user: UserPayload,
  ) {
    const { address, email, latitude, longitude, name } = body;
    try {
      await this.createRecipient.execute({
        name,
        address,
        adminId: user.sub,
        email,
        latitude,
        longitude,
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
