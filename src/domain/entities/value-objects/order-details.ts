import { Order } from '../order';
import { User } from '../user';
import { Recipient } from '../recipient';

export interface OrderDetailsProps {
  order: Order
  transporter: User
  recipient: Recipient
}

export class OrderDetails {
  private _order: Order;
  private _transporter: User;
  private _recipient: Recipient;

  get order() {
    return this._order;
  }
  get transporter() {
    return this._transporter;
  }
  get recipient() {
    return this._recipient;
  }
  constructor({
    order,
    recipient,
    transporter
  }: OrderDetailsProps) {
    this._order = order;
    this._recipient = recipient;
    this._transporter = transporter;
  }
}
