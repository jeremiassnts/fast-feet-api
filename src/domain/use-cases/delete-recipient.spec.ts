import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { UserFactory } from "test/factories/make-user"
import { UserRoles } from "../entities/user"
import { NotFoundError } from "./errors/not-found-error"
import { DeleteRecipientUseCase } from "./delete-recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { RecipientFactory } from "test/factories/make-recipient"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe('Delete recipient', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
        sut = new DeleteRecipientUseCase(inMemoryUsersRepository, inMemoryRecipientsRepository)
    })

    it('should be able to delete a recipient', async () => {
        const admin = UserFactory.makeUser({
            role: UserRoles.ADMIN
        })
        inMemoryUsersRepository.items.push(admin)

        const recipient = RecipientFactory.makeRecipient()
        inMemoryRecipientsRepository.items.push(recipient)

        await sut.execute({
            adminId: admin.id,
            recipientId: recipient.id
        })

        expect(inMemoryRecipientsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a recipient with a transporter', async () => {
        const transporter = UserFactory.makeUser({
            role: UserRoles.TRANSPORTER
        })
        inMemoryUsersRepository.items.push(transporter)

        const recipient = RecipientFactory.makeRecipient()
        inMemoryRecipientsRepository.items.push(recipient)

        await expect(() => sut.execute({
            adminId: transporter.id,
            recipientId: recipient.id
        })).rejects.toBeInstanceOf(NotFoundError)

        expect(inMemoryRecipientsRepository.items).toHaveLength(1)
    })
})