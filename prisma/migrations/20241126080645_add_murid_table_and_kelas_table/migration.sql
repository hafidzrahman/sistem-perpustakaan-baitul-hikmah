/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `Buku` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI', 'PEREMPUAN');

-- AlterTable
ALTER TABLE "Buku" ADD COLUMN     "halaman" TEXT,
ADD COLUMN     "penerbit" TEXT;

-- CreateTable
CREATE TABLE "Murid" (
    "nisn" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "kelasId" INTEGER NOT NULL,
    "alamat" TEXT NOT NULL,
    "kontak_ortu" TEXT NOT NULL,

    CONSTRAINT "Murid_pkey" PRIMARY KEY ("nisn")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "id" SERIAL NOT NULL,
    "tingkat" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Buku_isbn_key" ON "Buku"("isbn");

-- AddForeignKey
ALTER TABLE "Murid" ADD CONSTRAINT "Murid_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
