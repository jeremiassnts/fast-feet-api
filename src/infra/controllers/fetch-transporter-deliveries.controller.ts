import {
    BadRequestException,
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { z } from 'zod';
import { FetchTransporterDeliveriesUseCase } from 'src/domain/use-cases/fetch-transporter-deliveries';
import { UserPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/current-user-decorator';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { OrderDetailsPresenter } from '../presenters/order-details-presenter';

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

@Controller('/transporter-orders')
export class FetchTransporterDeliveriesController {
    constructor(private fetchTransporterDeliveries: FetchTransporterDeliveriesUseCase) { }
    @Get()
    async handler(
        @Query(fetchTransportersValidationPipe) query: FetchTransportersQuerySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const { page, top } = query
        try {
            const { deliveries } = await this.fetchTransporterDeliveries.execute({
                page,
                top,
                transporterId: user.sub
            });

            return { deliveries: deliveries.map(OrderDetailsPresenter.toHTTP) }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
