import { BadRequestException, Body, Controller, Param, Put, UnauthorizedException } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user-decorator";
import { UserPayload } from "../auth/jwt.strategy";
import { NotFoundError } from "src/domain/use-cases/errors/not-found-error";
import { EditTransporterUseCase } from "src/domain/use-cases/edit-transporter";
import { z } from "zod";

const editTransporterBodySchema = z.object({
    name: z.string()
})

@Controller('/transporter/:id')
export class EditTransporterController {
    constructor(private editTransporter: EditTransporterUseCase) { }
    @Put()
    async handler(@Param('id') transporterId: string, @CurrentUser() user: UserPayload, @Body() body: z.infer<typeof editTransporterBodySchema>) {
        const { name } = body
        try {
            await this.editTransporter.execute({
                adminId: user.sub,
                name,
                transporterId
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