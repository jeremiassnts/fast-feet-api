import { INestApplication } from "@nestjs/common"
import { Test } from '@nestjs/testing'
import { AppModule } from "../app.module"
import { DatabaseModule } from "../database/database.module"
import { UserFactory } from "test/factories/make-user"
import request from 'supertest'
import { compare, hash } from "bcryptjs"
import { PrismaService } from "../database/prisma/prisma.service"
import { JwtService } from "@nestjs/jwt"
import { RecipientFactory } from "test/factories/make-recipient"

describe('Create Order (E2E)', () => {
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

    test('POST /order', async () => {
        const user = await userFactory.makePrismaUser({
            cpf: process.env.E2E_VALID_CPF,
            password: await hash('123456', 8)
        })
        const accessToken = jwt.sign({
            sub: user.id
        })

        const recipient = await recipientFactory.makePrismaRecipient()

        const response = await request(app.getHttpServer())
            .post('/order')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: 'order 01',
                description: 'description 01',
                recipientId: recipient.id
            })

        expect(response.statusCode).toBe(201)
        const createdOrder = await prismaService.order.findFirst()
        expect(createdOrder).toEqual(expect.objectContaining({
            title: 'order 01',
            description: 'description 01',
            recipientId: recipient.id
        }))
    })
})