/*
  Warnings:

  - You are about to drop the `EksamplerBuku` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BukuPinjaman" DROP CONSTRAINT "BukuPinjaman_bukuISBN_bukuId_fkey";

-- DropForeignKey
ALTER TABLE "EksamplerBuku" DROP CONSTRAINT "EksamplerBuku_bukuISBN_fkey";

-- DropForeignKey
ALTER TABLE "SumbanganBuku" DROP CONSTRAINT "SumbanganBuku_bukuISBN_bukuId_fkey";

-- DropTable
DROP TABLE "EksamplerBuku";

-- CreateTable
CREATE TABLE "EksemplarBuku" (
    "id" SERIAL NOT NULL,
    "tanggalRusak" TIMESTAMP(3),
    "tanggalHilang" TIMESTAMP(3),
    "posisi" TEXT,
    "bukuISBN" TEXT NOT NULL,

    CONSTRAINT "EksemplarBuku_pkey" PRIMARY KEY ("bukuISBN","id")
);

-- CreateIndex
CREATE INDEX "EksemplarBuku_bukuISBN_id_idx" ON "EksemplarBuku"("bukuISBN", "id");

-- AddForeignKey
ALTER TABLE "EksemplarBuku" ADD CONSTRAINT "EksemplarBuku_bukuISBN_fkey" FOREIGN KEY ("bukuISBN") REFERENCES "Buku"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BukuPinjaman" ADD CONSTRAINT "BukuPinjaman_bukuISBN_bukuId_fkey" FOREIGN KEY ("bukuISBN", "bukuId") REFERENCES "EksemplarBuku"("bukuISBN", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SumbanganBuku" ADD CONSTRAINT "SumbanganBuku_bukuISBN_bukuId_fkey" FOREIGN KEY ("bukuISBN", "bukuId") REFERENCES "EksemplarBuku"("bukuISBN", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
