import { Order, OrderStatus } from "src/domain/entities/order";
import { OrdersRepository } from "src/domain/repositories/orders-repository";
import { MapsUtils } from "src/domain/utils/maps-utils";
import { InMemoryRecipientsRepository } from "./in-memory-recipients-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
    public items: Order[] = [];
    constructor(private recipientsRepository: InMemoryRecipientsRepository) { }
    async create(order: Order): Promise<Order> {
        this.items.push(order);
        return order;
    }
    async findById(id: string): Promise<Order | null> {
        const order = this.items.find(item => item.id === id);
        return order ?? null;
    }
    async update(order: Order): Promise<void> {
        const index = this.items.findIndex(o => o.id === order.id);
        this.items[index].status = order.status
    }
    async delete(id: string): Promise<void> {
        const index = this.items.findIndex(o => o.id === id)
        this.items[index].deletedAt = new Date()
    }
    async fetchDeliveriesByTransporterId(page: number, top: number, transporterId: string): Promise<Order[]> {
        const deliveries = this.items
            .filter(order => order.status === OrderStatus.DELIVERED && order.transporterId === transporterId)
            .slice((page - 1) * top, page * top)
        return deliveries
    }
    async fetchOrdersNearToTransporter(page: number, top: number, transporterId: string, longitude: number, latitude: number): Promise<Order[]> {
        const orders = this.items.filter(order =>
            order.status !== OrderStatus.DELIVERED
            && (order.transporterId === transporterId || !order.transporterId)
        )
            .sort((a, b) => {
                const recipient_A = this.recipientsRepository.items.find(item => item.id === a.recipientId)
                const latitudeA = recipient_A.latitude
                const longitudeA = recipient_A.longitude
                const distanceA = MapsUtils.getDifferenceBetweenCoordinates({
                    latitude: latitudeA,
                    longitude: longitudeA
                }, {
                    latitude,
                    longitude
                })

                const recipient_B = this.recipientsRepository.items.find(item => item.id === b.recipientId)
                const latitudeB = recipient_B.latitude
                const longitudeB = recipient_B.longitude
                const distanceB = MapsUtils.getDifferenceBetweenCoordinates({
                    latitude: latitudeB,
                    longitude: longitudeB
                }, {
                    latitude,
                    longitude
                })

                return distanceA - distanceB
            })
            .slice((page - 1) * top, page * top)

        return orders
    }
}