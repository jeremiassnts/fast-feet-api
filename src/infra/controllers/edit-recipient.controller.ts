import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user-decorator';
import { UserPayload } from '../auth/jwt.strategy';
import { NotFoundError } from 'src/domain/use-cases/errors/not-found-error';
import { EditRecipientUseCase } from 'src/domain/use-cases/edit-recipient';
import { z } from 'zod';

const editRecipientBodySchema = z.object({
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  name: z.string(),
});

@Controller('/recipient/:id')
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}
  @Put()
  async handler(
    @Param('id') recipientId: string,
    @CurrentUser() user: UserPayload,
    @Body() body: z.infer<typeof editRecipientBodySchema>,
  ) {
    const { address, latitude, longitude, name } = body;
    try {
      await this.editRecipient.execute({
        adminId: user.sub,
        address,
        latitude,
        longitude,
        name,
        recipientId,
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
