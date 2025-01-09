export class AlreadyExistsError extends Error {
    constructor(cpf: string) {
        super(`An user with CPF ${cpf} already exists`)
    }
}