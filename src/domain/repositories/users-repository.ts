import { User } from "../entities/user";

export abstract class UsersRepository {
    abstract findByCpf(cpf: string): Promise<User | null>
}