/*
  Warnings:

  - Changed the type of `kontak` on the `Guru` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `kontak` on the `Murid` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Guru" DROP COLUMN "kontak",
ADD COLUMN     "kontak" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Murid" DROP COLUMN "kontak",
ADD COLUMN     "kontak" BIGINT NOT NULL;
