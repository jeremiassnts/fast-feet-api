import { User } from "../entities/user";

export abstract class UsersRepository {
    abstract findByCpf(cpf: string): Promise<User | null>
    abstract findById(id: string): Promise<User | null>
    abstract create(user: User): Promise<User>
    abstract update(user: User): Promise<User>
    abstract delete(userId: string): Promise<void>
    abstract fetchActive(page: number, top: number): Promise<User[]>
}