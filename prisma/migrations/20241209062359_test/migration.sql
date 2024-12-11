-- DropForeignKey
ALTER TABLE "Buku" DROP CONSTRAINT "Buku_idPenerbit_fkey";

-- AlterTable
ALTER TABLE "Buku" ALTER COLUMN "idPenerbit" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Buku" ADD CONSTRAINT "Buku_idPenerbit_fkey" FOREIGN KEY ("idPenerbit") REFERENCES "Penerbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
