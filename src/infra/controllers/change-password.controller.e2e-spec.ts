import { INestApplication } from "@nestjs/common"
import { Test } from '@nestjs/testing'
import { AppModule } from "../app.module"
import { DatabaseModule } from "../database/database.module"
import { UserFactory } from "test/factories/make-user"
import request from 'supertest'
import { compare, hash } from "bcryptjs"
import { PrismaService } from "../database/prisma/prisma.service"
import { JwtService } from "@nestjs/jwt"

describe('Change password (E2E)', () => {
    let app: INestApplication
    let userFactory: UserFactory
    let jwt: JwtService
    let prismaService: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [UserFactory]
        }).compile()
        app = moduleRef.createNestApplication()
        userFactory = moduleRef.get(UserFactory)
        jwt = moduleRef.get(JwtService)
        prismaService = moduleRef.get(PrismaService)

        await app.init()
    })

    test('POST /change-password', async () => {
        const user = await userFactory.makePrismaUser({
            cpf: process.env.E2E_VALID_CPF,
            password: await hash('123456', 8)
        })
        const accessToken = jwt.sign({
            sub: user.id
        })

        const response = await request(app.getHttpServer())
            .post('/change-password')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                userId: user.id,
                newPassword: '654321'
            })

        expect(response.statusCode).toBe(200)
        const updatedUser = await prismaService.user.findFirst({ where: { id: user.id } })
        expect(compare('654321', updatedUser.password)).toBeTruthy()
    })
})