-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CREATED', 'WAITING', 'PICKEDUP', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'CREATED',
    "deliveryPhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "transporter_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_transporter_id_fkey" FOREIGN KEY ("transporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
