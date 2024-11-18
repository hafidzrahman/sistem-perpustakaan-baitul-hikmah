/*
  Warnings:

  - Added the required column `link_gambar` to the `Buku` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Buku" ADD COLUMN     "link_gambar" TEXT NOT NULL;
