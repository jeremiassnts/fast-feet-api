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
import { CreateOrderUseCase } from 'src/domain/use-cases/create-order';

const createOrderBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  recipientId: z.string(),
});

@Controller('/order')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}
  @Post()
  @HttpCode(201)
  async handler(
    @Body() body: z.infer<typeof createOrderBodySchema>,
    @CurrentUser() user: UserPayload,
  ) {
    const { recipientId, description, title } = body;
    try {
      await this.createOrder.execute({
        adminId: user.sub,
        recipientId,
        description,
        title,
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
