import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakePasswordHasher } from 'test/services/fake-password-hasher';
import { UserFactory } from 'test/factories/make-user';
import { FakeCpfValidator } from 'test/services/fake-cpf-validator';
import { EditTransporterUseCase } from './edit-transporter';
import { UserRoles } from '../entities/user';
import { NotFoundError } from './errors/not-found-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let hasher: FakePasswordHasher;
let cpfValidator: FakeCpfValidator;
let sut: EditTransporterUseCase;

describe('Edit transporter', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    cpfValidator = new FakeCpfValidator();
    hasher = new FakePasswordHasher();
    sut = new EditTransporterUseCase(inMemoryUsersRepository, cpfValidator);
  });

  it('should be able to edit a transporter', async () => {
    const admin = UserFactory.makeUser({
      password: await hasher.hash('123456'),
      role: UserRoles.ADMIN,
    });
    inMemoryUsersRepository.items.push(admin);

    const transporter = UserFactory.makeUser({
      name: 'John Doe',
      cpf: '1234567890',
      password: await hasher.hash('123456'),
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    await sut.execute({
      name: 'John Smith',
      adminId: admin.id,
      transporterId: transporter.id,
    });

    const updatedTransporter = inMemoryUsersRepository.items.find(
      (user) => user.id === transporter.id,
    );
    expect(updatedTransporter).toEqual(
      expect.objectContaining({
        name: 'John Smith',
      }),
    );
  });

  it('should not be able to edit a transporter with a transporter', async () => {
    const transporter = UserFactory.makeUser({
      name: 'John Doe',
      password: await hasher.hash('123456'),
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    await expect(() =>
      sut.execute({
        name: 'John Smith',
        adminId: transporter.id,
        transporterId: transporter.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      }),
    );
  });
});
