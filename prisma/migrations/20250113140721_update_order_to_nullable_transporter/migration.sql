-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_transporter_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "transporter_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_transporter_id_fkey" FOREIGN KEY ("transporter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
