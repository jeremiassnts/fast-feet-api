import {
  BadRequestException,
  Controller,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { NotFoundError } from 'src/domain/use-cases/errors/not-found-error';
import { MarkOrderAsReturnedUseCase } from 'src/domain/use-cases/mark-order-as-returned';

@Controller('/order/:id/returned')
export class MarkOrderAsReturnedController {
  constructor(private markOrderAsReturned: MarkOrderAsReturnedUseCase) {}
  @Put()
  async handler(@Param('id') orderId: string) {
    try {
      await this.markOrderAsReturned.execute({
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
