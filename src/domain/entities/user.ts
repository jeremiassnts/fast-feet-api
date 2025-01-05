import { randomUUID } from "node:crypto";

export enum UserRoles {
    ADMIN = 'admin',
    TRANSPORTER = 'transporter',
}
export interface UserProps {
    id?: string;
    name: string;
    password: string;
    cpf: string;
    role: UserRoles;
    createdBy?: string | null
    createdAt: Date
    updatedAt?: Date | null
}

export class User {
    private _id: string;
    private _name: string;
    private _password: string;
    private _cpf: string;
    private _role: UserRoles;
    private _createdBy: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get password() {
        return this._password;
    }
    get cpf() {
        return this._cpf;
    }
    get role() {
        return this._role;
    }
    get createdBy() {
        return this._createdBy;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }

    constructor({ id, name, password, cpf, role, createdAt, createdBy, updatedAt }: UserProps) {
        this._id = id ?? randomUUID()
        this._name = name
        this._password = password
        this._cpf = cpf
        this._role = role
        this._createdBy = createdBy
        this._createdAt = createdAt
        this._updatedAt = updatedAt ?? null
    }
}