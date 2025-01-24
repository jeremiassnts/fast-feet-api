import { OrderDetails } from 'src/domain/entities/value-objects/order-details';

export class OrderDetailsPresenter {
  public static toHTTP(orderDetails: OrderDetails) {
    return {
      id: orderDetails.order.id,
      status: orderDetails.order.status,
      title: orderDetails.order.title,
      description: orderDetails.order.description,
      deliveryPhoto: orderDetails.order.deliveryPhoto,
      active: !!orderDetails.order.deletedAt,
      recipient: {
        id: orderDetails.recipient.id,
        name: orderDetails.recipient.name,
        address: orderDetails.recipient.address,
        email: orderDetails.recipient.email,
        latitude: orderDetails.recipient.latitude,
        longitude: orderDetails.recipient.longitude,
      },
      transporter: orderDetails.transporter
        ? {
            id: orderDetails.transporter.id,
            name: orderDetails.transporter.name,
            cpf: orderDetails.transporter.cpf,
          }
        : null,
    };
  }
}
