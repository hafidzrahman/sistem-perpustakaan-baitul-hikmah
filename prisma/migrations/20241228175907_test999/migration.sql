-- AlterTable
ALTER TABLE "Keterangan" ADD COLUMN     "denda" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RiwayatKelas" ALTER COLUMN "nomorPresensi" DROP DEFAULT;
DROP SEQUENCE "RiwayatKelas_nomorPresensi_seq";
