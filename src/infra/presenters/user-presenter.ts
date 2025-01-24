import { User } from 'src/domain/entities/user';

export class UserPresenter {
  public static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      role: user.role,
      active: !!user.deletedAt,
    };
  }
}
