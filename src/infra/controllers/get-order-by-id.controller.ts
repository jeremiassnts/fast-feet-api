import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import { GetOrderUseCase } from 'src/domain/use-cases/get-order-by-id';
import { z } from 'zod';
import { UserPresenter } from '../presenters/user-presenter';
import { OrderDetailsPresenter } from '../presenters/order-details-presenter';

@Controller('/order/:orderId')
export class GetOrderByIdController {
    constructor(private getOrderById: GetOrderUseCase) { }
    @Get()
    async handler(
        @Param('orderId') orderId: string
    ) {
        try {
            const { order } = await this.getOrderById.execute({
                id: orderId
            });
            return {
                order: OrderDetailsPresenter.toHTTP(order)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
