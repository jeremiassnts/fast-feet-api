import { PasswordHasher } from "src/domain/services/password-hasher";
import { compare, hash } from 'bcryptjs'

export class Bcrypthasher implements PasswordHasher {
    async compare(plain: string, hash: string): Promise<boolean> {
        return compare(plain, hash)
    }
    async hash(password: string): Promise<string> {
        return hash(password, 8)
    }
}