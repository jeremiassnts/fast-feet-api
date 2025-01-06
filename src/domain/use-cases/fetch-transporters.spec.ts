import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { FakePasswordHasher } from "test/services/fake-password-hasher"
import { UserFactory } from "test/factories/make-user"
import { UserRoles } from "../entities/user"
import { NotFoundError } from "./errors/not-found-error"
import { FetchTransporterUseCase } from "./fetch-transporters"

let inMemoryUsersRepository: InMemoryUsersRepository
let hasher: FakePasswordHasher
let sut: FetchTransporterUseCase

describe('Fetch transporters', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        hasher = new FakePasswordHasher()
        sut = new FetchTransporterUseCase(inMemoryUsersRepository)
    })

    it('should be able to fetch all actives transporters', async () => {
        const transporter1 = UserFactory.makeUser({
            role: UserRoles.TRANSPORTER
        })
        const transporter2 = UserFactory.makeUser({
            role: UserRoles.TRANSPORTER
        })
        const transporter3 = UserFactory.makeUser({
            role: UserRoles.TRANSPORTER,
            deletedAt: new Date()
        })
        inMemoryUsersRepository.items.push(transporter1, transporter2, transporter3)

        const result = await sut.execute({
            page: 1,
            top: 10
        })

        expect(result.transporters).toHaveLength(2)
        expect(result.transporters).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: transporter1.id,
            }),
            expect.objectContaining({
                id: transporter2.id,
            }),
        ]))
    })

    it('should be able to fetch all actives transporters of second page', async () => {
        for (let i = 0; i < 5; i++) {
            const transporter = UserFactory.makeUser({
                name: 'Transporter ' + (i + 1),
                role: UserRoles.TRANSPORTER
            })
            inMemoryUsersRepository.items.push(transporter)
        }
        const result = await sut.execute({
            page: 2,
            top: 4
        })

        expect(result.transporters).toHaveLength(1)
        expect(result.transporters).toEqual([
            expect.objectContaining({
                name: 'Transporter 5'
            }),
        ])
    })
})