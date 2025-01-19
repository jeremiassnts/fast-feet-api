import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user-decorator';
import { UserPayload } from '../auth/jwt.strategy';
import { NotFoundError } from 'src/domain/use-cases/errors/not-found-error';
import { DeleteTransporterUseCase } from 'src/domain/use-cases/delete-transporter';

@Controller('/transporter/:id')
export class DeleteTransporterController {
  constructor(private deleteTransporter: DeleteTransporterUseCase) {}
  @Delete()
  async handler(
    @Param('id') transporterId: string,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      await this.deleteTransporter.execute({
        adminId: user.sub,
        transporterId,
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
