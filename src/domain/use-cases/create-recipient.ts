import { Injectable } from '@nestjs/common';
import { Recipient } from '../entities/recipient';
import { NotFoundError } from './errors/not-found-error';
import { RecipientsRepository } from '../repositories/recipient-repository';
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error';
import { UsersRepository } from '../repositories/users-repository';

interface CreateRecipientUseCaseRequest {
  name: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  adminId: string;
}

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private usersRepository: UsersRepository,
  ) {}
  async execute({
    address,
    adminId,
    latitude,
    longitude,
    name,
    email,
  }: CreateRecipientUseCaseRequest) {
    const recipient = await this.recipientsRepository.findByEmail(email);
    if (recipient) {
      throw new RecipientAlreadyExistsError(email);
    }

    const admin = await this.usersRepository.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new NotFoundError(adminId, 'user');
    }

    const newRecipient = await this.recipientsRepository.create(
      new Recipient({
        name,
        email,
        address,
        latitude,
        longitude,
        createdAt: new Date(),
      }),
    );

    return {
      recipient: newRecipient,
    };
  }
}
