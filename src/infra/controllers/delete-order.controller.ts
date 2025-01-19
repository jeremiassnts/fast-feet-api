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
import { DeleteOrderUseCase } from 'src/domain/use-cases/delete-order';

@Controller('/order/:id')
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}
  @Delete()
  async handler(
    @Param('id') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      await this.deleteOrder.execute({
        adminId: user.sub,
        orderId,
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
