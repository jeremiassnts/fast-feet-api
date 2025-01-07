import { randomUUID } from "node:crypto";

export enum OrderStatus {
    WAITING = 'waiting',
    PICKEDUP = 'pickedup',
    DELIVERED = 'delivered',
    RETURNED = 'returned'
}
export interface OrderProps {
    id?: string;
    status: OrderStatus;
    transporterId?: string | null;
    deliveryAddress: string;
    deliveryCoordinates: string;
    recipientEmail: string;
    deliveryPhoto?: string | null;
    createdAt: Date
    updatedAt?: Date | null
}

export class Order {
    private _id: string;
    private _status: OrderStatus;
    private _transporterId: string;
    private _deliveryAddress: string;
    private _deliveryCoordinates: string;
    private _recipientEmail: string;
    private _deliveryPhoto: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    get id() {
        return this._id;
    }
    get status() {
        return this._status;
    }
    get transporterId() {
        return this._transporterId;
    }
    get deliveryAddress() {
        return this._deliveryAddress;
    }
    get deliveryCoordinates() {
        return this._deliveryCoordinates;
    }
    get recipientEmail() {
        return this._recipientEmail;
    }
    get deliveryPhoto() {
        return this._deliveryPhoto;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }

    constructor({ id, status, createdAt, deliveryAddress, deliveryCoordinates, deliveryPhoto, recipientEmail, transporterId, updatedAt }: OrderProps) {
        this._id = id ?? randomUUID()
        this._status = status ?? OrderStatus.WAITING
        this._transporterId = transporterId ?? null
        this._deliveryPhoto = deliveryPhoto ?? null
        this._recipientEmail = recipientEmail
        this._deliveryAddress = deliveryAddress
        this._deliveryCoordinates = deliveryCoordinates
        this._createdAt = createdAt ?? new Date()
        this._updatedAt = updatedAt ?? null
    }
}