import { randomUUID } from 'node:crypto';

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
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class User {
  private _id: string;
  private _name: string;
  private _password: string;
  private _cpf: string;
  private _role: UserRoles;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date;

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
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get deletedAt() {
    return this._deletedAt;
  }
  set cpf(cpf: string) {
    this._cpf = cpf;
    this.touch();
  }
  set name(name: string) {
    this._name = name;
    this.touch();
  }
  set deletedAt(deletedAt: Date) {
    this._deletedAt = deletedAt;
  }
  set password(password: string) {
    this._password = password;
    this.touch();
  }
  private touch() {
    this._updatedAt = new Date();
  }

  constructor({
    id,
    name,
    password,
    cpf,
    role,
    createdAt,
    updatedAt,
    deletedAt,
  }: UserProps) {
    this._id = id ?? randomUUID();
    this._name = name;
    this._password = password;
    this._cpf = cpf;
    this._role = role;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? null;
    this._deletedAt = deletedAt ?? null;
  }
}
