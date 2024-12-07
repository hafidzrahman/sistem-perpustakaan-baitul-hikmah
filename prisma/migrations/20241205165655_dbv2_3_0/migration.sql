-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI', 'PEREMPUAN');

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

-- CreateTable
CREATE TABLE "PetugasPerpustakaan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "PetugasPerpustakaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buku" (
    "id" SERIAL NOT NULL,
    "isbn" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "penulis" TEXT[],
    "genre" "Genre"[],
    "penerbit" TEXT,
    "halaman" INTEGER,
    "link_gambar" TEXT,
    "sinopsis" TEXT,
    "posisi" TEXT,
    "tanggal_rusak" TIMESTAMP(3),
    "tanggal_hilang" TIMESTAMP(3),

    CONSTRAINT "Buku_pkey" PRIMARY KEY ("isbn","id")
);

-- CreateTable
CREATE TABLE "Murid" (
    "nis" BIGINT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "kontak" TEXT NOT NULL,
    "alamat" TEXT,

    CONSTRAINT "Murid_pkey" PRIMARY KEY ("nis")
);

-- CreateTable
CREATE TABLE "Guru" (
    "nip" BIGINT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "kontak" TEXT NOT NULL,
    "alamat" TEXT,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "RiwayatKelas" (
    "tahunAjaran" TEXT NOT NULL,
    "muridNIS" BIGINT NOT NULL,
    "idKelas" INTEGER NOT NULL,

    CONSTRAINT "RiwayatKelas_pkey" PRIMARY KEY ("muridNIS","idKelas")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tingkat" INTEGER NOT NULL,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormBukti" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "halamanAwal" INTEGER NOT NULL,
    "halamanAkhir" INTEGER NOT NULL,
    "intisari" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "muridNIS" BIGINT NOT NULL,
    "bukuId" INTEGER NOT NULL,
    "bukuISBN" TEXT NOT NULL,

    CONSTRAINT "FormBukti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peminjaman" (
    "id" SERIAL NOT NULL,
    "tanggalPinjam" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keterangan" TEXT,
    "murid_nis" BIGINT,
    "guru_nip" BIGINT,

    CONSTRAINT "Peminjaman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BukuPinjaman" (
    "tanggalKembali" TIMESTAMP(3),
    "tenggatWaktu" TIMESTAMP(3) NOT NULL,
    "idPeminjaman" INTEGER NOT NULL,
    "bukuISBN" TEXT NOT NULL,
    "bukuId" INTEGER NOT NULL,

    CONSTRAINT "BukuPinjaman_pkey" PRIMARY KEY ("idPeminjaman","bukuISBN","bukuId")
);

-- CreateTable
CREATE TABLE "Keterangan" (
    "id" SERIAL NOT NULL,
    "keterangan" TEXT NOT NULL,
    "jumlahBuku" INTEGER,
    "totalNominal" INTEGER,
    "nominalPerHari" INTEGER,

    CONSTRAINT "Keterangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Denda" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bukuId" INTEGER,
    "bukuISBN" TEXT,
    "idPeminjaman" INTEGER,
    "idSumbangan" INTEGER NOT NULL,

    CONSTRAINT "Denda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sumbangan" (
    "id" SERIAL NOT NULL,
    "tanggalSelesai" TIMESTAMP(3),
    "berlebih" BOOLEAN NOT NULL,
    "idKeterangan" INTEGER NOT NULL,
    "nis" BIGINT,
    "nip" BIGINT,

    CONSTRAINT "Sumbangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SumbanganBuku" (
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idSumbangan" INTEGER NOT NULL,
    "idSumbanganBantuan" INTEGER,
    "bukuId" INTEGER NOT NULL,
    "bukuISBN" TEXT NOT NULL,

    CONSTRAINT "SumbanganBuku_pkey" PRIMARY KEY ("idSumbangan","bukuISBN","bukuId")
);

-- CreateTable
CREATE TABLE "PembayaranTunai" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlah" INTEGER NOT NULL,
    "idSumbangan" INTEGER NOT NULL,

    CONSTRAINT "PembayaranTunai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatBantuan" (
    "jumlah" INTEGER NOT NULL,
    "idPembayaranTunai" INTEGER NOT NULL,
    "idSumbangan" INTEGER NOT NULL,

    CONSTRAINT "RiwayatBantuan_pkey" PRIMARY KEY ("idPembayaranTunai","idSumbangan")
);

-- CreateIndex
CREATE UNIQUE INDEX "Denda_idSumbangan_key" ON "Denda"("idSumbangan");

-- CreateIndex
CREATE UNIQUE INDEX "Denda_idPeminjaman_bukuISBN_bukuId_key" ON "Denda"("idPeminjaman", "bukuISBN", "bukuId");

-- AddForeignKey
ALTER TABLE "RiwayatKelas" ADD CONSTRAINT "RiwayatKelas_muridNIS_fkey" FOREIGN KEY ("muridNIS") REFERENCES "Murid"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatKelas" ADD CONSTRAINT "RiwayatKelas_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormBukti" ADD CONSTRAINT "FormBukti_muridNIS_fkey" FOREIGN KEY ("muridNIS") REFERENCES "Murid"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormBukti" ADD CONSTRAINT "FormBukti_bukuISBN_bukuId_fkey" FOREIGN KEY ("bukuISBN", "bukuId") REFERENCES "Buku"("isbn", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_murid_nis_fkey" FOREIGN KEY ("murid_nis") REFERENCES "Murid"("nis") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_guru_nip_fkey" FOREIGN KEY ("guru_nip") REFERENCES "Guru"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BukuPinjaman" ADD CONSTRAINT "BukuPinjaman_idPeminjaman_fkey" FOREIGN KEY ("idPeminjaman") REFERENCES "Peminjaman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BukuPinjaman" ADD CONSTRAINT "BukuPinjaman_bukuISBN_bukuId_fkey" FOREIGN KEY ("bukuISBN", "bukuId") REFERENCES "Buku"("isbn", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Denda" ADD CONSTRAINT "Denda_idPeminjaman_bukuISBN_bukuId_fkey" FOREIGN KEY ("idPeminjaman", "bukuISBN", "bukuId") REFERENCES "BukuPinjaman"("idPeminjaman", "bukuISBN", "bukuId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Denda" ADD CONSTRAINT "Denda_idSumbangan_fkey" FOREIGN KEY ("idSumbangan") REFERENCES "Sumbangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sumbangan" ADD CONSTRAINT "Sumbangan_idKeterangan_fkey" FOREIGN KEY ("idKeterangan") REFERENCES "Keterangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sumbangan" ADD CONSTRAINT "Sumbangan_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Murid"("nis") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sumbangan" ADD CONSTRAINT "Sumbangan_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SumbanganBuku" ADD CONSTRAINT "SumbanganBuku_idSumbangan_fkey" FOREIGN KEY ("idSumbangan") REFERENCES "Sumbangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SumbanganBuku" ADD CONSTRAINT "SumbanganBuku_idSumbanganBantuan_fkey" FOREIGN KEY ("idSumbanganBantuan") REFERENCES "Sumbangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SumbanganBuku" ADD CONSTRAINT "SumbanganBuku_bukuISBN_bukuId_fkey" FOREIGN KEY ("bukuISBN", "bukuId") REFERENCES "Buku"("isbn", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembayaranTunai" ADD CONSTRAINT "PembayaranTunai_idSumbangan_fkey" FOREIGN KEY ("idSumbangan") REFERENCES "Sumbangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatBantuan" ADD CONSTRAINT "RiwayatBantuan_idPembayaranTunai_fkey" FOREIGN KEY ("idPembayaranTunai") REFERENCES "PembayaranTunai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatBantuan" ADD CONSTRAINT "RiwayatBantuan_idSumbangan_fkey" FOREIGN KEY ("idSumbangan") REFERENCES "Sumbangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
