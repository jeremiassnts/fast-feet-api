import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { NotFoundError } from './errors/not-found-error';

interface DeleteTransporterUseCaseRequest {
  transporterId: string;
  adminId: string;
}

@Injectable()
export class DeleteTransporterUseCase {
  constructor(private usersRepository: UsersRepository) { }
  async execute({ adminId, transporterId }: DeleteTransporterUseCaseRequest) {
    const transporter = await this.usersRepository.findById(transporterId);
    if (!transporter) {
      throw new NotFoundError(transporterId, 'transporter');
    }

    const admin = await this.usersRepository.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new NotFoundError(adminId, 'user');
    }

    await this.usersRepository.delete(transporter.id);
  }
}
