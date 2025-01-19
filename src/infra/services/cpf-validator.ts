import { CpfValidator } from 'src/domain/services/cpfValidator';
import { cpf } from 'cpf-cnpj-validator';

export class CvCpfValidator implements CpfValidator {
  async validate(plain: string): Promise<boolean> {
    return cpf.isValid(plain);
  }
}
