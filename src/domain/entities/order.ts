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
    deliveryPhoto?: string | null;
    createdAt: Date
    deletedAt?: Date | null
    recipientId?: string
    updatedAt?: Date | null
}

export class Order {
    private _id: string;
    private _status: OrderStatus;
    private _transporterId: string;
    private _recipientId: string;
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
    get recipientId() {
        return this._recipientId;
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
    set recipientId(id: string) {
        this._recipientId = id
        this.touch()
    }
    set transporterId(id: string) {
        this._transporterId = id
        this.touch()
    }
    set deletedAt(deletedAt: Date) {
        this._deletedAt = deletedAt
    }
    set deliveryPhoto(url: string) {
        this._deliveryPhoto = url
    }
    private touch() {
        this._updatedAt = new Date()
    }

    constructor({ id, status, createdAt, deliveryPhoto, recipientId, transporterId, updatedAt, deletedAt }: OrderProps) {
        this._id = id ?? randomUUID()
        this._status = status ?? OrderStatus.CREATED
        this._transporterId = transporterId ?? null
        this._deliveryPhoto = deliveryPhoto ?? null
        this._recipientId = recipientId
        this._createdAt = createdAt ?? new Date()
        this._updatedAt = updatedAt ?? null
        this._deletedAt = deletedAt ?? null
    }
}