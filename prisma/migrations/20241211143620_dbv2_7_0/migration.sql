/*
  Warnings:

  - You are about to drop the column `genre` on the `Buku` table. All the data in the column will be lost.
  - You are about to drop the `SumbanganBuku` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SumbanganBuku" DROP CONSTRAINT "SumbanganBuku_bukuISBN_bukuId_fkey";

-- DropForeignKey
ALTER TABLE "SumbanganBuku" DROP CONSTRAINT "SumbanganBuku_idSumbanganBantuan_fkey";

-- DropForeignKey
ALTER TABLE "SumbanganBuku" DROP CONSTRAINT "SumbanganBuku_idSumbangan_fkey";

-- AlterTable
ALTER TABLE "Buku" DROP COLUMN "genre";

-- AlterTable
ALTER TABLE "EksemplarBuku" ADD COLUMN     "idSumbangan" INTEGER,
ADD COLUMN     "idSumbanganBantuan" INTEGER,
ADD COLUMN     "tanggalMasuk" TIMESTAMP(3);

-- DropTable
DROP TABLE "SumbanganBuku";

-- DropEnum
DROP TYPE "Genre";

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BukuToGenre" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BukuToGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Genre_id_idx" ON "Genre"("id");

-- CreateIndex
CREATE INDEX "_BukuToGenre_B_index" ON "_BukuToGenre"("B");

-- AddForeignKey
ALTER TABLE "EksemplarBuku" ADD CONSTRAINT "EksemplarBuku_idSumbangan_fkey" FOREIGN KEY ("idSumbangan") REFERENCES "Sumbangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EksemplarBuku" ADD CONSTRAINT "EksemplarBuku_idSumbanganBantuan_fkey" FOREIGN KEY ("idSumbanganBantuan") REFERENCES "Sumbangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BukuToGenre" ADD CONSTRAINT "_BukuToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Buku"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BukuToGenre" ADD CONSTRAINT "_BukuToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
