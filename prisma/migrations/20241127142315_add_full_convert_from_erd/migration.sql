/*
  Warnings:

  - The `genre` column on the `Buku` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Murid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `kelasId` on the `Murid` table. All the data in the column will be lost.
  - You are about to drop the column `nisn` on the `Murid` table. All the data in the column will be lost.
  - Added the required column `id_kelas` to the `Murid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nis` to the `Murid` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('FANTASY', 'SCIFI', 'MYSTERY', 'BIOGRAPHY', 'HISTORY', 'ROMANCE');

-- CreateEnum
CREATE TYPE "Posisi" AS ENUM ('A1', 'B1');

-- CreateEnum
CREATE TYPE "StatBuku" AS ENUM ('TERSEDIA', 'HABIS');

-- CreateEnum
CREATE TYPE "KetBuku" AS ENUM ('SUMBANGAN', 'DENDA');

-- CreateEnum
CREATE TYPE "StatDenda" AS ENUM ('TERLAMBAT', 'HILANG', 'RUSAK');

-- CreateEnum
CREATE TYPE "KetDenda" AS ENUM ('DIBAYAR', 'BELUM');

-- CreateEnum
CREATE TYPE "Jumlah" AS ENUM ('RP500', 'RP110000', 'DUA_BUKU');

-- DropForeignKey
ALTER TABLE "Murid" DROP CONSTRAINT "Murid_kelasId_fkey";

-- AlterTable
ALTER TABLE "Buku" ADD COLUMN     "posisi" "Posisi",
ADD COLUMN     "stok" INTEGER,
DROP COLUMN "genre",
ADD COLUMN     "genre" "Genre"[];

-- AlterTable
ALTER TABLE "Murid" DROP CONSTRAINT "Murid_pkey",
DROP COLUMN "kelasId",
DROP COLUMN "nisn",
ADD COLUMN     "id_kelas" INTEGER NOT NULL,
ADD COLUMN     "nis" TEXT NOT NULL,
ADD CONSTRAINT "Murid_pkey" PRIMARY KEY ("nis");

-- CreateTable
CREATE TABLE "PetugasPerpustakaan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "PetugasPerpustakaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guru" (
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "kontak" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "FormBukti" (
    "id" SERIAL NOT NULL,
    "muridNIS" TEXT NOT NULL,

    CONSTRAINT "FormBukti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peminjaman" (
    "id" SERIAL NOT NULL,
    "buku_isbn" TEXT NOT NULL,
    "murid_nis" TEXT NOT NULL,
    "guru_nip" TEXT NOT NULL,
    "tanggalPinjam" TIMESTAMP(3) NOT NULL,
    "tanggalPengembalian" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "idDenda" INTEGER NOT NULL,

    CONSTRAINT "Peminjaman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Denda" (
    "id" SERIAL NOT NULL,
    "ket" "KetDenda" NOT NULL,
    "status" "StatDenda" NOT NULL,
    "jumlah" "Jumlah" NOT NULL,

    CONSTRAINT "Denda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laporan" (
    "id" SERIAL NOT NULL,
    "idPetugas" TEXT NOT NULL,
    "jumlah_peminjaman" INTEGER NOT NULL,
    "jumlah_kunjungan_murid" INTEGER NOT NULL,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Murid" ADD CONSTRAINT "Murid_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormBukti" ADD CONSTRAINT "FormBukti_muridNIS_fkey" FOREIGN KEY ("muridNIS") REFERENCES "Murid"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_buku_isbn_fkey" FOREIGN KEY ("buku_isbn") REFERENCES "Buku"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_murid_nis_fkey" FOREIGN KEY ("murid_nis") REFERENCES "Murid"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_guru_nip_fkey" FOREIGN KEY ("guru_nip") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_idDenda_fkey" FOREIGN KEY ("idDenda") REFERENCES "Denda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laporan" ADD CONSTRAINT "Laporan_idPetugas_fkey" FOREIGN KEY ("idPetugas") REFERENCES "PetugasPerpustakaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
