export class InvalidCpfError extends Error {
    constructor(cpf: string) {
        super(`The CPF ${cpf} is not valid`)
    }
}