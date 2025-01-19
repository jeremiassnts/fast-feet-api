import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/make-user';
import { UserRoles } from '../entities/user';
import { GetTransporterUseCase } from './get-transporter-by-id';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetTransporterUseCase;

describe('Get transporter by id', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetTransporterUseCase(inMemoryUsersRepository);
  });

  it('should be able to get transporter by id', async () => {
    const transporter = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    const result = await sut.execute({ id: transporter.id });

    expect(result.transporter).toEqual(
      expect.objectContaining({
        id: transporter.id,
      }),
    );
  });
});
