import {
  BadRequestException,
  Controller,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user-decorator';
import { UserPayload } from '../auth/jwt.strategy';
import { NotFoundError } from 'src/domain/use-cases/errors/not-found-error';
import { MarkOrderAsPickedUpUseCase } from 'src/domain/use-cases/mark-order-as-picked-up';

@Controller('/order/:id/pickedup')
export class MarkOrderAsPickedUpController {
  constructor(private markOrderAsPickedUp: MarkOrderAsPickedUpUseCase) {}
  @Put()
  async handler(
    @Param('id') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      await this.markOrderAsPickedUp.execute({
        orderId,
        transporterId: user.sub,
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
