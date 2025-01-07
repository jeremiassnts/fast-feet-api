import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users-repository";
import { NotFoundError } from "./errors/not-found-error";
import { OrdersRepository } from "../repositories/orders-repository";
import { OrderStatus } from "../entities/order";
import { PhotoUploader } from "../services/photo-uploader";
import { PhotoMissingError } from "./errors/photo-missing-error";
import { InvalidPhotoTypeError } from "./errors/invalid-photo-type-error";

interface MarkOrderAsDeliveredUseCaseRequest {
    orderId: string
    transporterId: string
    fileName: string
    fileType: string
    body: Buffer
}

@Injectable()
export class MarkOrderAsDeliveredUseCase {
    constructor(private usersRepository: UsersRepository, private ordersRepository: OrdersRepository, private photoUploader: PhotoUploader) { }
    async execute({ transporterId, orderId, fileName, body, fileType }: MarkOrderAsDeliveredUseCaseRequest) {
        if (!/^(image\/(jpg|jpeg|png))$|^application\/pdf$/.test(fileType)) {
            throw new InvalidPhotoTypeError()
        }

        const order = await this.ordersRepository.findById(orderId)
        if (!order) {
            throw new NotFoundError(orderId)
        }

        const transporter = await this.usersRepository.findById(transporterId)
        if (transporter.id !== order.transporterId) {
            throw new NotFoundError(transporterId)
        }

        if (!fileName || !body || !fileType) {
            throw new PhotoMissingError()
        }

        const url = await this.photoUploader.upload({
            fileName,
            body,
            fileType
        })
        order.status = OrderStatus.DELIVERED
        order.deliveryPhoto = url

        await this.ordersRepository.update(order)
    }
}