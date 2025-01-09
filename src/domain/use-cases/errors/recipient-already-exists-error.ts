export class RecipientAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`A recipient with email ${email} already exists`)
    }
}