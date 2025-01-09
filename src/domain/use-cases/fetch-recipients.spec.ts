import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { FakePasswordHasher } from "test/services/fake-password-hasher"
import { RecipientFactory } from "test/factories/make-recipient"
import { FetchRecipientUseCase } from "./fetch-recipients"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: FetchRecipientUseCase

describe('Fetch recipients', () => {
    beforeEach(() => {
        inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
        sut = new FetchRecipientUseCase(inMemoryRecipientsRepository)
    })

    it('should be able to fetch all recipients', async () => {
        const recipient1 = RecipientFactory.makeRecipient()
        const recipient2 = RecipientFactory.makeRecipient()
        const recipient3 = RecipientFactory.makeRecipient()
        inMemoryRecipientsRepository.items.push(recipient1, recipient2, recipient3)

        const result = await sut.execute({
            page: 1,
            top: 10
        })

        expect(result.recipients).toHaveLength(3)
        expect(result.recipients).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: recipient1.id,
            }),
            expect.objectContaining({
                id: recipient2.id,
            }),
            expect.objectContaining({
                id: recipient3.id,
            }),
        ]))
    })

    it('should be able to fetch all recipients of second page', async () => {
        for (let i = 0; i < 5; i++) {
            const recipient = RecipientFactory.makeRecipient({
                name: 'Recipient ' + (i + 1),
            })
            inMemoryRecipientsRepository.items.push(recipient)
        }
        const result = await sut.execute({
            page: 2,
            top: 4
        })

        expect(result.recipients).toHaveLength(1)
        expect(result.recipients).toEqual([
            expect.objectContaining({
                name: 'Recipient 5'
            }),
        ])
    })
})