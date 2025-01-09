import { Injectable } from "@nestjs/common";
import { OrdersRepository } from "../repositories/orders-repository";

interface FetchOrdersNearToTransporterUseCaseRequest {
    page: number;
    top: number;
    transporterId: string
    longitude: number
    latitude: number
}

@Injectable()
export class FetchOrdersNearToTransporterUseCase {
    constructor(private ordersRepository: OrdersRepository) { }
    async execute({ page, top, transporterId, latitude, longitude }: FetchOrdersNearToTransporterUseCaseRequest) {
        const orders = await this.ordersRepository.fetchOrdersNearToTransporter(page, top, transporterId, latitude, longitude);
        return { orders }
    }
}