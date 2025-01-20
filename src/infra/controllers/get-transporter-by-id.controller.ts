import {
    BadRequestException,
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { GetTransporterUseCase } from 'src/domain/use-cases/get-transporter-by-id';
import { UserPresenter } from '../presenters/user-presenter';

@Controller('/transporter/:transporterId')
export class GetTransporterByIdController {
    constructor(private getTransporterById: GetTransporterUseCase) { }
    @Get()
    async handler(
        @Param('transporterId') transporterId: string
    ) {
        try {
            const { transporter } = await this.getTransporterById.execute({
                id: transporterId
            });
            return {
                transporter: UserPresenter.toHTTP(transporter)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
