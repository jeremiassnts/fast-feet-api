import { INestApplication } from "@nestjs/common"
import { PrismaService } from "../database/prisma/prisma.service"
import { Test } from '@nestjs/testing'
import { AppModule } from "../app.module"
import { DatabaseModule } from "../database/database.module"
import { UserFactory } from "test/factories/make-user"
import request from 'supertest'
import { Bcrypthasher } from "../services/bcrypt-hasher"
import { hash } from "bcryptjs"

describe('Authenticate (E2E)', () => {
    let app: INestApplication
    let userFactory: UserFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [UserFactory]
        }).compile()
        app = moduleRef.createNestApplication()
        userFactory = moduleRef.get(UserFactory)

        await app.init()
    })

    test('POST /token', async () => {
        await userFactory.makePrismaUser({
            cpf: '06840972577',
            password: await hash('123456', 8)
        })

        const response = await request(app.getHttpServer())
            .post('/token')
            .send({
                cpf: '06840972577',
                password: '123456'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            accessToken: expect.any(String)
        })
    })
})