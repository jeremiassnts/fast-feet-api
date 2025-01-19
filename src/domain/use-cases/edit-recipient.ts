import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { NotFoundError } from './errors/not-found-error';
import { RecipientsRepository } from '../repositories/recipient-repository';

interface EditRecipientUseCaseRequest {
  recipientId: string;
  adminId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

@Injectable()
export class EditRecipientUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}
  async execute({
    adminId,
    recipientId,
    address,
    latitude,
    longitude,
    name,
  }: EditRecipientUseCaseRequest) {
    const recipient = await this.recipientsRepository.findById(recipientId);
    if (!recipient) {
      throw new NotFoundError(recipientId, 'recipient');
    }

    const admin = await this.usersRepository.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new NotFoundError(adminId, 'user');
    }

    recipient.name = name;
    recipient.address = address;
    recipient.latitude = latitude;
    recipient.longitude = longitude;

    await this.recipientsRepository.update(recipient);
  }
}
