import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';

interface FetchTransporterUseCaseRequest {
  page: number;
  top: number;
}

@Injectable()
export class FetchTransporterUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({ page, top }: FetchTransporterUseCaseRequest) {
    const transporters = await this.usersRepository.fetchActiveTransporters(
      page,
      top,
    );
    return { transporters };
  }
}
