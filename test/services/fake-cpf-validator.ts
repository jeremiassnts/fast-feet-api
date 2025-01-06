import { CpfValidator } from "src/domain/services/cpfValidator";
import { EnvService } from "src/infra/env/env.service";

export class FakeCpfValidator extends CpfValidator {
    async validate(cpf: string): Promise<boolean> {
        return true
    }
}