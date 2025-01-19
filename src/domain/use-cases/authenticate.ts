import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { PasswordHasher } from '../services/password-hasher';
import { Encrypter } from '../services/encrypter';

interface AuthenticateUseCaseRequest {
  cpf: string;
  password: string;
}

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasher,
    private encrypter: Encrypter,
  ) {}
  async execute({ cpf, password }: AuthenticateUseCaseRequest) {
    const user = await this.usersRepository.findByCpf(cpf);
    if (!user) {
      throw new WrongCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new WrongCredentialsError();
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id,
    });

    return {
      accessToken,
    };
  }
}
