/*
  Warnings:

  - You are about to drop the column `penerbit` on the `Buku` table. All the data in the column will be lost.
  - You are about to drop the column `penulis` on the `Buku` table. All the data in the column will be lost.
  - Added the required column `idPenerbit` to the `Buku` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Buku" DROP COLUMN "penerbit",
DROP COLUMN "penulis",
ADD COLUMN     "idPenerbit" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PenulisBuku" (
    "bukuISBN" TEXT NOT NULL,
    "bukuId" INTEGER NOT NULL,
    "idPenulis" INTEGER NOT NULL,

    CONSTRAINT "PenulisBuku_pkey" PRIMARY KEY ("idPenulis","bukuISBN","bukuId")
);

-- CreateTable
CREATE TABLE "Penulis" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Penulis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penerbit" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Penerbit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PenulisBuku_bukuISBN_bukuId_idPenulis_idx" ON "PenulisBuku"("bukuISBN", "bukuId", "idPenulis");

-- CreateIndex
CREATE INDEX "Penulis_id_idx" ON "Penulis"("id");

-- CreateIndex
CREATE INDEX "Penerbit_id_idx" ON "Penerbit"("id");

-- CreateIndex
CREATE INDEX "Buku_isbn_id_idx" ON "Buku"("isbn", "id");

-- CreateIndex
CREATE INDEX "BukuPinjaman_idPeminjaman_bukuISBN_bukuId_idx" ON "BukuPinjaman"("idPeminjaman", "bukuISBN", "bukuId");

-- CreateIndex
CREATE INDEX "Denda_idPeminjaman_bukuISBN_bukuId_idx" ON "Denda"("idPeminjaman", "bukuISBN", "bukuId");

-- CreateIndex
CREATE INDEX "FormBukti_id_idx" ON "FormBukti"("id");

-- CreateIndex
CREATE INDEX "Guru_nip_idx" ON "Guru"("nip");

-- CreateIndex
CREATE INDEX "Kelas_id_idx" ON "Kelas"("id");

-- CreateIndex
CREATE INDEX "Keterangan_id_idx" ON "Keterangan"("id");

-- CreateIndex
CREATE INDEX "Murid_nis_idx" ON "Murid"("nis");

-- CreateIndex
CREATE INDEX "PembayaranTunai_id_idx" ON "PembayaranTunai"("id");

-- CreateIndex
CREATE INDEX "Peminjaman_id_idx" ON "Peminjaman"("id");

-- CreateIndex
CREATE INDEX "RiwayatBantuan_idPembayaranTunai_idSumbangan_idx" ON "RiwayatBantuan"("idPembayaranTunai", "idSumbangan");

-- CreateIndex
CREATE INDEX "RiwayatKelas_muridNIS_idKelas_idx" ON "RiwayatKelas"("muridNIS", "idKelas");

-- CreateIndex
CREATE INDEX "Sumbangan_id_idx" ON "Sumbangan"("id");

-- CreateIndex
CREATE INDEX "SumbanganBuku_idSumbangan_bukuISBN_bukuId_idx" ON "SumbanganBuku"("idSumbangan", "bukuISBN", "bukuId");

-- AddForeignKey
ALTER TABLE "Buku" ADD CONSTRAINT "Buku_idPenerbit_fkey" FOREIGN KEY ("idPenerbit") REFERENCES "Penerbit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenulisBuku" ADD CONSTRAINT "PenulisBuku_bukuISBN_bukuId_fkey" FOREIGN KEY ("bukuISBN", "bukuId") REFERENCES "Buku"("isbn", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenulisBuku" ADD CONSTRAINT "PenulisBuku_idPenulis_fkey" FOREIGN KEY ("idPenulis") REFERENCES "Penulis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
