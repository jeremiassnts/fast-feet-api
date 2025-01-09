import { randomUUID } from "node:crypto";

export interface RecipientProps {
    id?: string;
    name: string;
    email: string;
    address: string;
    latitude: number;
    longitude: number;
    createdAt: Date
    updatedAt?: Date | null
}

export class Recipient {
    private _id: string;
    private _name: string;
    private _email: string;
    private _address: string;
    private _latitude: number;
    private _longitude: number;
    private _createdAt: Date;
    private _updatedAt: Date;

    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get email() {
        return this._email;
    }
    get address() {
        return this._address;
    }
    get latitude() {
        return this._latitude;
    }
    get longitude() {
        return this._longitude;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }

    constructor({ id, name, email, address, latitude, longitude, createdAt, updatedAt }: RecipientProps) {
        this._id = id ?? randomUUID()
        this._name = name
        this._email = email
        this._address = address
        this._latitude = latitude
        this._longitude = longitude
        this._createdAt = createdAt ?? new Date()
        this._updatedAt = updatedAt ?? null
    }
}