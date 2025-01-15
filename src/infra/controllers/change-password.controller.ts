import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import { z } from "zod";
import { ChangePasswordUseCase } from "src/domain/use-cases/change-password";
import { CurrentUser } from "../auth/current-user-decorator";
import { UserPayload } from "../auth/jwt.strategy";
import { NotFoundError } from "src/domain/use-cases/errors/not-found-error";

const changePasswordBodySchema = z.object({
    userId: z.string(),
    newPassword: z.string()
})

@Controller('/change-password')
export class ChangePasswordController {
    constructor(private changePassword: ChangePasswordUseCase) { }
    @Post()
    @HttpCode(200)
    async handler(@Body() body: z.infer<typeof changePasswordBodySchema>, @CurrentUser() user: UserPayload) {
        const { userId, newPassword } = body

        try {
            await this.changePassword.execute({
                userId,
                password: newPassword,
                adminId: user.sub
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