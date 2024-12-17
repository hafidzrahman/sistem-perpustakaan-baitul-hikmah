-- DropForeignKey
ALTER TABLE "PembayaranTunai" DROP CONSTRAINT "PembayaranTunai_idSumbangan_fkey";

-- AlterTable
ALTER TABLE "PembayaranTunai" ALTER COLUMN "idSumbangan" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PembayaranTunai" ADD CONSTRAINT "PembayaranTunai_idSumbangan_fkey" FOREIGN KEY ("idSumbangan") REFERENCES "Sumbangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
