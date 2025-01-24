import { Order } from 'src/domain/entities/order';

export class OrderPresenter {
  public static toHTTP(order: Order) {
    return {
      id: order.id,
      status: order.status,
      title: order.title,
      description: order.description,
      transporterId: order.transporterId,
      deliveryPhoto: order.deliveryPhoto,
      active: !!order.deletedAt,
      recipientId: order.recipientId,
    };
  }
}
