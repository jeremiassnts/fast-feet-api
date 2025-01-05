import { User } from "../entities/user";

export abstract class UsersRepository {
    abstract findByCpf(cpf: string): Promise<User | null>
    abstract findById(id: string): Promise<User | null>
    abstract create(user: User): Promise<User>
}