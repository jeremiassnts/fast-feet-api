import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { FakeEncrypter } from 'test/services/fake-encrypter';
import { FakePasswordHasher } from 'test/services/fake-password-hasher';
import { UserFactory } from 'test/factories/make-user';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let encrypter: FakeEncrypter;
let hasher: FakePasswordHasher;
let sut: AuthenticateUseCase;

describe('Authenticate user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    encrypter = new FakeEncrypter();
    hasher = new FakePasswordHasher();
    sut = new AuthenticateUseCase(inMemoryUsersRepository, hasher, encrypter);
  });

  it('should be able to authenticate a valid user', async () => {
    const user = UserFactory.makeUser({
      password: await hasher.hash('123456'),
    });
    inMemoryUsersRepository.items.push(user);
    const result = await sut.execute({
      cpf: user.cpf,
      password: '123456',
    });

    expect(result.accessToken).toEqual(expect.any(String));
  });
  it('should not be able to authenticate a invalid password', async () => {
    const user = UserFactory.makeUser({
      password: await hasher.hash('123456'),
    });
    inMemoryUsersRepository.items.push(user);

    await expect(() =>
      sut.execute({
        cpf: user.cpf,
        password: '1234567890',
      }),
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });
  it('should not be able to authenticate a invalid cpf', async () => {
    const user = UserFactory.makeUser({
      cpf: '000000000',
      password: await hasher.hash('123456'),
    });
    inMemoryUsersRepository.items.push(user);

    await expect(() =>
      sut.execute({
        cpf: '999999999',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });
});
