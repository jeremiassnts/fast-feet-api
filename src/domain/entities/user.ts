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
}

export class User {
    private _id: string;
    private _name: string;
    private _password: string;
    private _cpf: string;
    private _role: UserRoles;

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

    constructor({ id, name, password, cpf, role }: UserProps) {
        this._id = id ?? randomUUID()
        this._name = name
        this._password = password
        this._cpf = cpf
        this._role = role
    }
}