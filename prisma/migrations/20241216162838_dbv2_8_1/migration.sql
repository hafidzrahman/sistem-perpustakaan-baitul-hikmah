-- AlterTable
ALTER TABLE "RiwayatKelas" ALTER COLUMN "nomorPresensi" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "PetugasPerpustakaan_id_idx" ON "PetugasPerpustakaan"("id");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");
