import { User } from "src/domain/entities/user";
import { UsersRepository } from "src/domain/repositories/users-repository";

export class InMemoryUsersRepository extends UsersRepository {
    public items: User[] = [];
    async findByCpf(cpf: string) {
        const user = this.items.find(user => user.cpf === cpf)
        return user ?? null
    }
}