import {
    BadRequestException,
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { z } from 'zod';
import { FetchTransporterUseCase } from 'src/domain/use-cases/fetch-transporters';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UserPresenter } from '../presenters/user-presenter';

const fetchTransportersQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .default('1')
        .transform(Number)
        .pipe(z.number().min(1)),
    top: z
        .string()
        .optional()
        .default('1')
        .transform(Number)
        .pipe(z.number().min(1)),
});
type FetchTransportersQuerySchema = z.infer<typeof fetchTransportersQuerySchema>
const fetchTransportersValidationPipe = new ZodValidationPipe(fetchTransportersQuerySchema)

@Controller('/transporter')
export class FetchTransportersController {
    constructor(private fetchTransporters: FetchTransporterUseCase) { }
    @Get()
    async handler(
        @Query(fetchTransportersValidationPipe) query: FetchTransportersQuerySchema
    ) {
        const { page, top } = query
        try {
            const { transporters } = await this.fetchTransporters.execute({
                page,
                top
            });

            return { transporters: transporters.map(UserPresenter.toHTTP) }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
