import { CpfValidator } from 'src/domain/services/cpfValidator';

export class FakeCpfValidator extends CpfValidator {
  async validate(): Promise<boolean> {
    return true;
  }
}
