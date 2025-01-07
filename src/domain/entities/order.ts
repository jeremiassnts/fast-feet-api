import { randomUUID } from "node:crypto";

export enum OrderStatus {
    CREATED = 'created',
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
    deletedAt?: Date | null
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
    private _deletedAt: Date;
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
    get deletedAt() {
        return this._deletedAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    set status(status: OrderStatus) {
        this._status = status
        this.touch()
    }
    set deliveryAddress(address: string) {
        this._deliveryAddress = address
        this.touch()
    }
    set deliveryCoordinates(coordinates: string) {
        this._deliveryCoordinates = coordinates
        this.touch()
    }
    set recipientEmail(email: string) {
        this._recipientEmail = email
        this.touch()
    }
    set deletedAt(deletedAt: Date) {
        this._deletedAt = deletedAt
    }
    private touch() {
        this._updatedAt = new Date()
    }

    constructor({ id, status, createdAt, deliveryAddress, deliveryCoordinates, deliveryPhoto, recipientEmail, transporterId, updatedAt, deletedAt }: OrderProps) {
        this._id = id ?? randomUUID()
        this._status = status ?? OrderStatus.CREATED
        this._transporterId = transporterId ?? null
        this._deliveryPhoto = deliveryPhoto ?? null
        this._recipientEmail = recipientEmail
        this._deliveryAddress = deliveryAddress
        this._deliveryCoordinates = deliveryCoordinates
        this._createdAt = createdAt ?? new Date()
        this._updatedAt = updatedAt ?? null
        this._deletedAt = deletedAt ?? null
    }
}