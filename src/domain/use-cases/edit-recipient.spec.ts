import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/make-user';
import { EditRecipientUseCase } from './edit-recipient';
import { UserRoles } from '../entities/user';
import { NotFoundError } from './errors/not-found-error';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { RecipientFactory } from 'test/factories/make-recipient';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: EditRecipientUseCase;

describe('Edit recipient', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new EditRecipientUseCase(
      inMemoryUsersRepository,
      inMemoryRecipientsRepository,
    );
  });

  it('should be able to edit an recipient', async () => {
    const admin = UserFactory.makeUser({
      role: UserRoles.ADMIN,
    });
    inMemoryUsersRepository.items.push(admin);

    const recipient = RecipientFactory.makeRecipient({
      name: 'John',
      address: '123 Main Street',
      latitude: -90,
      longitude: 90,
    });
    inMemoryRecipientsRepository.items.push(recipient);

    await sut.execute({
      adminId: admin.id,
      recipientId: recipient.id,
      address: 'New Address',
      latitude: -50,
      longitude: 50,
      name: 'John Doe',
    });

    const updatedRecipient = inMemoryRecipientsRepository.items.find(
      (o) => o.id === recipient.id,
    );
    expect(updatedRecipient).toEqual(
      expect.objectContaining({
        address: 'New Address',
        latitude: -50,
        longitude: 50,
        name: 'John Doe',
      }),
    );
  });

  it('should not be able to edit an recipient with a transporter', async () => {
    const transporter = UserFactory.makeUser({
      role: UserRoles.TRANSPORTER,
    });
    inMemoryUsersRepository.items.push(transporter);

    const recipient = RecipientFactory.makeRecipient({
      name: 'John',
      address: '123 Main Street',
      latitude: -90,
      longitude: 90,
    });
    inMemoryRecipientsRepository.items.push(recipient);

    await expect(() =>
      sut.execute({
        adminId: transporter.id,
        recipientId: recipient.id,
        address: 'New Address',
        latitude: -50,
        longitude: 50,
        name: 'John Doe',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    const updatedRecipient = inMemoryRecipientsRepository.items.find(
      (o) => o.id === recipient.id,
    );
    expect(updatedRecipient).toEqual(
      expect.objectContaining({
        name: 'John',
        address: '123 Main Street',
        latitude: -90,
        longitude: 90,
      }),
    );
  });
});
