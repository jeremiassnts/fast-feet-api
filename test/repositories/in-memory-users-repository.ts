import { User, UserRoles } from 'src/domain/entities/user';
import { UsersRepository } from 'src/domain/repositories/users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];
  async findById(id: string): Promise<User | null> {
    const user = this.items.find((user) => user.id === id);
    return user ?? null;
  }
  async create(user: User): Promise<User> {
    this.items.push(user);
    return user;
  }
  async findByCpf(cpf: string) {
    const user = this.items.find((user) => user.cpf === cpf);
    return user ?? null;
  }
  async update(user: User): Promise<User> {
    const index = this.items.findIndex((u) => user.id === u.id);
    this.items[index].name = user.name;
    return user;
  }
  async delete(userId: string): Promise<void> {
    const index = this.items.findIndex((u) => userId === u.id);
    this.items[index].deletedAt = new Date();
  }
  async fetchActiveTransporters(page: number, top: number): Promise<User[]> {
    const transporters = this.items.filter((user) => !user.deletedAt && user.role == UserRoles.TRANSPORTER);
    return transporters.slice((page - 1) * top, page * top);
  }
}
