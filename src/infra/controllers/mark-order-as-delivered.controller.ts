import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user-decorator';
import { UserPayload } from '../auth/jwt.strategy';
import { NotFoundError } from 'src/domain/use-cases/errors/not-found-error';
import { MarkOrderAsDeliveredUseCase } from 'src/domain/use-cases/mark-order-as-delivered';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/order/:id/delivered')
export class MarkOrderAsDeliveredController {
  constructor(private markOrderAsDelivered: MarkOrderAsDeliveredUseCase) {}
  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async handler(
    @Param('id') orderId: string,
    @CurrentUser() user: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), //5mb
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      await this.markOrderAsDelivered.execute({
        body: file.buffer,
        fileName: file.originalname,
        fileType: file.mimetype,
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
