-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI', 'PEREMPUAN');

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
    "isbn" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "halaman" INTEGER,
    "link_gambar" TEXT,
    "sinopsis" TEXT,
    "penerbit" INTEGER,

    CONSTRAINT "Buku_pkey" PRIMARY KEY ("isbn")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EksemplarBuku" (
    "id" SERIAL NOT NULL,
    "tanggalMasuk" TIMESTAMP(3),
    "tanggalRusak" TIMESTAMP(3),
    "tanggalHilang" TIMESTAMP(3),
    "posisi" TEXT,
    "bukuISBN" TEXT NOT NULL,
    "idSumbangan" INTEGER,
    "idSumbanganBantuan" INTEGER,

    CONSTRAINT "EksemplarBuku_pkey" PRIMARY KEY ("bukuISBN","id")
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

-- CreateTable
CREATE TABLE "Murid" (
    "nis" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "kontak" TEXT NOT NULL,
    "alamat" TEXT,

    CONSTRAINT "Murid_pkey" PRIMARY KEY ("nis")
);

-- CreateTable
CREATE TABLE "Guru" (
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "kontak" TEXT NOT NULL,
    "alamat" TEXT,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "RiwayatKelas" (
    "tahunAjaran" TEXT NOT NULL,
    "nomorPresensi" SERIAL,
    "muridNIS" TEXT NOT NULL,
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
    "muridNIS" TEXT NOT NULL,
    "bukuISBN" TEXT NOT NULL,

    CONSTRAINT "FormBukti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peminjaman" (
    "id" SERIAL NOT NULL,
    "tanggalPinjam" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keterangan" TEXT,
    "murid_nis" TEXT,
    "guru_nip" TEXT,

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
    "nis" TEXT,
    "nip" TEXT,

    CONSTRAINT "Sumbangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "muridNIS" TEXT,
    "guruNIP" TEXT,
    "petugasPerpustakaanId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "_BukuToGenre" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BukuToGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BukuToPenulis" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BukuToPenulis_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Buku_isbn_idx" ON "Buku"("isbn");

-- CreateIndex
CREATE INDEX "Genre_id_idx" ON "Genre"("id");

-- CreateIndex
CREATE INDEX "EksemplarBuku_bukuISBN_id_idx" ON "EksemplarBuku"("bukuISBN", "id");

-- CreateIndex
CREATE INDEX "Penulis_id_idx" ON "Penulis"("id");

-- CreateIndex
CREATE INDEX "Penerbit_id_idx" ON "Penerbit"("id");

-- CreateIndex
CREATE INDEX "Murid_nis_idx" ON "Murid"("nis");

-- CreateIndex
CREATE INDEX "Guru_nip_idx" ON "Guru"("nip");

-- CreateIndex
CREATE INDEX "RiwayatKelas_muridNIS_idKelas_idx" ON "RiwayatKelas"("muridNIS", "idKelas");

-- CreateIndex
CREATE INDEX "Kelas_id_idx" ON "Kelas"("id");

-- CreateIndex
CREATE INDEX "FormBukti_id_idx" ON "FormBukti"("id");

-- CreateIndex
CREATE INDEX "Peminjaman_id_idx" ON "Peminjaman"("id");

-- CreateIndex
CREATE INDEX "BukuPinjaman_idPeminjaman_bukuISBN_bukuId_idx" ON "BukuPinjaman"("idPeminjaman", "bukuISBN", "bukuId");

-- CreateIndex
CREATE INDEX "Keterangan_id_idx" ON "Keterangan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Denda_idSumbangan_key" ON "Denda"("idSumbangan");

-- CreateIndex
CREATE INDEX "Denda_idPeminjaman_bukuISBN_bukuId_idx" ON "Denda"("idPeminjaman", "bukuISBN", "bukuId");

-- CreateIndex
CREATE UNIQUE INDEX "Denda_idPeminjaman_bukuISBN_bukuId_key" ON "Denda"("idPeminjaman", "bukuISBN", "bukuId");

-- CreateIndex
CREATE INDEX "Sumbangan_id_idx" ON "Sumbangan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_muridNIS_key" ON "User"("muridNIS");

-- CreateIndex
CREATE UNIQUE INDEX "User_guruNIP_key" ON "User"("guruNIP");

-- CreateIndex
CREATE UNIQUE INDEX "User_petugasPerpustakaanId_key" ON "User"("petugasPerpustakaanId");

-- CreateIndex
CREATE INDEX "PembayaranTunai_id_idx" ON "PembayaranTunai"("id");

-- CreateIndex
CREATE INDEX "RiwayatBantuan_idPembayaranTunai_idSumbangan_idx" ON "RiwayatBantuan"("idPembayaranTunai", "idSumbangan");

-- CreateIndex
CREATE INDEX "_BukuToGenre_B_index" ON "_BukuToGenre"("B");

-- CreateIndex
CREATE INDEX "_BukuToPenulis_B_index" ON "_BukuToPenulis"("B");

-- AddForeignKey
ALTER TABLE "Buku" ADD CONSTRAINT "Buku_penerbit_fkey" FOREIGN KEY ("penerbit") REFERENCES "Penerbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EksemplarBuku" ADD CONSTRAINT "EksemplarBuku_bukuISBN_fkey" FOREIGN KEY ("bukuISBN") REFERENCES "Buku"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EksemplarBuku" ADD CONSTRAINT "EksemplarBuku_idSumbangan_fkey" FOREIGN KEY ("idSumbangan") REFERENCES "Sumbangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EksemplarBuku" ADD CONSTRAINT "EksemplarBuku_idSumbanganBantuan_fkey" FOREIGN KEY ("idSumbanganBantuan") REFERENCES "Sumbangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatKelas" ADD CONSTRAINT "RiwayatKelas_muridNIS_fkey" FOREIGN KEY ("muridNIS") REFERENCES "Murid"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatKelas" ADD CONSTRAINT "RiwayatKelas_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormBukti" ADD CONSTRAINT "FormBukti_muridNIS_fkey" FOREIGN KEY ("muridNIS") REFERENCES "Murid"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormBukti" ADD CONSTRAINT "FormBukti_bukuISBN_fkey" FOREIGN KEY ("bukuISBN") REFERENCES "Buku"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_murid_nis_fkey" FOREIGN KEY ("murid_nis") REFERENCES "Murid"("nis") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_guru_nip_fkey" FOREIGN KEY ("guru_nip") REFERENCES "Guru"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BukuPinjaman" ADD CONSTRAINT "BukuPinjaman_idPeminjaman_fkey" FOREIGN KEY ("idPeminjaman") REFERENCES "Peminjaman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BukuPinjaman" ADD CONSTRAINT "BukuPinjaman_bukuISBN_bukuId_fkey" FOREIGN KEY ("bukuISBN", "bukuId") REFERENCES "EksemplarBuku"("bukuISBN", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "User" ADD CONSTRAINT "User_muridNIS_fkey" FOREIGN KEY ("muridNIS") REFERENCES "Murid"("nis") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_guruNIP_fkey" FOREIGN KEY ("guruNIP") REFERENCES "Guru"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_petugasPerpustakaanId_fkey" FOREIGN KEY ("petugasPerpustakaanId") REFERENCES "PetugasPerpustakaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembayaranTunai" ADD CONSTRAINT "PembayaranTunai_idSumbangan_fkey" FOREIGN KEY ("idSumbangan") REFERENCES "Sumbangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatBantuan" ADD CONSTRAINT "RiwayatBantuan_idPembayaranTunai_fkey" FOREIGN KEY ("idPembayaranTunai") REFERENCES "PembayaranTunai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatBantuan" ADD CONSTRAINT "RiwayatBantuan_idSumbangan_fkey" FOREIGN KEY ("idSumbangan") REFERENCES "Sumbangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BukuToGenre" ADD CONSTRAINT "_BukuToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Buku"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BukuToGenre" ADD CONSTRAINT "_BukuToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BukuToPenulis" ADD CONSTRAINT "_BukuToPenulis_A_fkey" FOREIGN KEY ("A") REFERENCES "Buku"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BukuToPenulis" ADD CONSTRAINT "_BukuToPenulis_B_fkey" FOREIGN KEY ("B") REFERENCES "Penulis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
