import {
    BadRequestException,
    Controller,
    Param,
    Put,
    UnauthorizedException,
} from '@nestjs/common';
import { NotFoundError } from 'src/domain/use-cases/errors/not-found-error';
import { MarkOrderAsWaitingUseCase } from 'src/domain/use-cases/mark-order-as-waiting';
import { UserPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/current-user-decorator';

@Controller('/order/:id/waiting')
export class MarkOrderAsWaitingController {
    constructor(private markOrderAsWaiting: MarkOrderAsWaitingUseCase) { }
    @Put()
    async handler(
        @Param('id') orderId: string,
        @CurrentUser() user: UserPayload
    ) {
        try {
            await this.markOrderAsWaiting.execute({
                orderId,
                adminId: user.sub
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