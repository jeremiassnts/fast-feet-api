import { PasswordHasher } from "src/domain/services/password-hasher";

export class FakePasswordHasher extends PasswordHasher {
    async compare(plain: string, hash: string): Promise<boolean> {
        return `${plain}--hashed` === hash
    }
    async hash(password: string): Promise<string> {
        return `${password}--hashed`
    }
}