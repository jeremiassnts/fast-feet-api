import {
    BadRequestException,
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { z } from 'zod';
import { FetchOrdersNearToTransporterUseCase } from 'src/domain/use-cases/fetch-orders-near-to-transporter';
import { UserPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/current-user-decorator';
import { OrderDetailsPresenter } from '../presenters/order-details-presenter';

const fetchOrdersNearToTransporterQuerySchema = z.object({
    page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
    top: z.string().optional().default('10').transform(Number).pipe(z.number().min(10)),
    latitude: z.coerce.number(),
    longitude: z.coerce.number()
});

@Controller('/transporter-near-orders')
export class FetchOrdersNearToTransporterController {
    constructor(private fetchOrdersNearToTransporter: FetchOrdersNearToTransporterUseCase) { }
    @Get()
    async handler(
        @Query() query: z.infer<typeof fetchOrdersNearToTransporterQuerySchema>,
        @CurrentUser() user: UserPayload
    ) {
        const { page, top, latitude, longitude } = query
        try {
            const { orders } = await this.fetchOrdersNearToTransporter.execute({
                page,
                top,
                latitude,
                longitude,
                transporterId: user.sub
            });
            return { orders: orders.map(OrderDetailsPresenter.toHTTP) }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
