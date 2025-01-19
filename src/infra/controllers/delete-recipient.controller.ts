import { BadRequestException, Controller, Delete, Param, UnauthorizedException } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user-decorator";
import { UserPayload } from "../auth/jwt.strategy";
import { NotFoundError } from "src/domain/use-cases/errors/not-found-error";
import { DeleteRecipientUseCase } from "src/domain/use-cases/delete-recipient";

@Controller('/recipient/:id')
export class DeleteRecipientController {
    constructor(private deleteRecipient: DeleteRecipientUseCase) { }
    @Delete()
    async handler(@Param('id') recipientId: string, @CurrentUser() user: UserPayload) {
        try {
            await this.deleteRecipient.execute({
                adminId: user.sub,
                recipientId
            })
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new UnauthorizedException(error.message)
            } else {
                throw new BadRequestException(error.message)
            }
        }
    }
}