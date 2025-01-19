import { INestApplication } from "@nestjs/common"
import { Test } from '@nestjs/testing'
import { AppModule } from "../app.module"
import { DatabaseModule } from "../database/database.module"
import { UserFactory } from "test/factories/make-user"
import request from 'supertest'
import { PrismaService } from "../database/prisma/prisma.service"
import { JwtService } from "@nestjs/jwt"
import { UserRoles } from "src/domain/entities/user"
import { RecipientFactory } from "test/factories/make-recipient"
import { faker } from "@faker-js/faker"

describe('Edit Recipient (E2E)', () => {
    let app: INestApplication
    let userFactory: UserFactory
    let recipientFactory: RecipientFactory
    let jwt: JwtService
    let prismaService: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [UserFactory, RecipientFactory]
        }).compile()
        app = moduleRef.createNestApplication()
        userFactory = moduleRef.get(UserFactory)
        recipientFactory = moduleRef.get(RecipientFactory)
        jwt = moduleRef.get(JwtService)
        prismaService = moduleRef.get(PrismaService)

        await app.init()
    })

    test('PUT /recipient', async () => {
        const user = await userFactory.makePrismaUser()
        const accessToken = jwt.sign({
            sub: user.id
        })

        const recipient = await recipientFactory.makePrismaRecipient({
            email: 'johndoe@email.com',
            address: faker.location.streetAddress(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            name: faker.person.fullName(),
        })
        await request(app.getHttpServer())
            .put('/recipient/' + recipient.id)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                address: 'new street address',
                latitude: 123,
                longitude: -123,
                name: 'new person name',
            })

        const editedRecipient = await prismaService.recipient.findFirst({
            where: {
                email: 'johndoe@email.com',
            }
        })
        expect(editedRecipient).toEqual(expect.objectContaining({
            address: 'new street address',
            latitude: 123,
            longitude: -123,
            name: 'new person name',
        }))
    })
})