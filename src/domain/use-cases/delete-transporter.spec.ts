import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakePasswordHasher } from 'test/services/fake-password-hasher';
import { UserFactory } from 'test/factories/make-user';
import { UserRoles } from '../entities/user';
import { NotFoundError } from './errors/not-found-error';
import { DeleteTransporterUseCase } from './delete-transporter';

let inMemoryUsersRepository: InMemoryUsersRepository;
let hasher: FakePasswordHasher;
let sut: DeleteTransporterUseCase;

describe('Delete transporter', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    hasher = new FakePasswordHasher();
    sut = new DeleteTransporterUseCase(inMemoryUsersRepository);
  });

  it('should be able to delete a transporter', async () => {
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
    const oldDeletedDate = transporter.deletedAt;

    await sut.execute({
      adminId: admin.id,
      transporterId: transporter.id,
    });

    const deletedTransporter = inMemoryUsersRepository.items.find(
      (user) => user.id === transporter.id,
    );
    expect(deletedTransporter).toEqual(
      expect.objectContaining({
        deletedAt: expect.any(Date),
      }),
    );
    expect(oldDeletedDate).toBeNull();
  });

  it('should not be able to edit a transporter with a transporter', async () => {
    const transporter = UserFactory.makeUser({
      name: 'John Doe',
      cpf: '1234567890',
      password: await hasher.hash('123456'),
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    await expect(() =>
      sut.execute({
        adminId: transporter.id,
        transporterId: transporter.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        cpf: '1234567890',
      }),
    );
  });
});
