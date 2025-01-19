import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';

interface GetTransporterUseCaseRequest {
  id: string;
}

@Injectable()
export class GetTransporterUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({ id }: GetTransporterUseCaseRequest) {
    const transporter = await this.usersRepository.findById(id);
    return { transporter };
  }
}
