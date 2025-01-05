export abstract class CpfValidator {
    abstract validate(cpf: string): Promise<boolean>;
    abstract getTestingCpf(): Promise<string>;
}