/*
  Warnings:

  - The primary key for the `Guru` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Murid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RiwayatKelas` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "FormBukti" DROP CONSTRAINT "FormBukti_muridNIS_fkey";

-- DropForeignKey
ALTER TABLE "Peminjaman" DROP CONSTRAINT "Peminjaman_guru_nip_fkey";

-- DropForeignKey
ALTER TABLE "Peminjaman" DROP CONSTRAINT "Peminjaman_murid_nis_fkey";

-- DropForeignKey
ALTER TABLE "RiwayatKelas" DROP CONSTRAINT "RiwayatKelas_muridNIS_fkey";

-- DropForeignKey
ALTER TABLE "Sumbangan" DROP CONSTRAINT "Sumbangan_nip_fkey";

-- DropForeignKey
ALTER TABLE "Sumbangan" DROP CONSTRAINT "Sumbangan_nis_fkey";

-- AlterTable
ALTER TABLE "FormBukti" ALTER COLUMN "muridNIS" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Guru" DROP CONSTRAINT "Guru_pkey",
ALTER COLUMN "nip" SET DATA TYPE TEXT,
ADD CONSTRAINT "Guru_pkey" PRIMARY KEY ("nip");

-- AlterTable
ALTER TABLE "Murid" DROP CONSTRAINT "Murid_pkey",
ALTER COLUMN "nis" SET DATA TYPE TEXT,
ADD CONSTRAINT "Murid_pkey" PRIMARY KEY ("nis");

-- AlterTable
ALTER TABLE "Peminjaman" ALTER COLUMN "murid_nis" SET DATA TYPE TEXT,
ALTER COLUMN "guru_nip" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RiwayatKelas" DROP CONSTRAINT "RiwayatKelas_pkey",
ALTER COLUMN "muridNIS" SET DATA TYPE TEXT,
ADD CONSTRAINT "RiwayatKelas_pkey" PRIMARY KEY ("muridNIS", "idKelas");

-- AlterTable
ALTER TABLE "Sumbangan" ALTER COLUMN "nis" SET DATA TYPE TEXT,
ALTER COLUMN "nip" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "RiwayatKelas" ADD CONSTRAINT "RiwayatKelas_muridNIS_fkey" FOREIGN KEY ("muridNIS") REFERENCES "Murid"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormBukti" ADD CONSTRAINT "FormBukti_muridNIS_fkey" FOREIGN KEY ("muridNIS") REFERENCES "Murid"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_murid_nis_fkey" FOREIGN KEY ("murid_nis") REFERENCES "Murid"("nis") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_guru_nip_fkey" FOREIGN KEY ("guru_nip") REFERENCES "Guru"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sumbangan" ADD CONSTRAINT "Sumbangan_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Murid"("nis") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sumbangan" ADD CONSTRAINT "Sumbangan_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE SET NULL ON UPDATE CASCADE;
