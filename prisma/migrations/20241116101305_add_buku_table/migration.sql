-- CreateTable
CREATE TABLE "Buku" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "penulis" TEXT[],
    "genre" TEXT[],
    "isbn" TEXT NOT NULL,

    CONSTRAINT "Buku_pkey" PRIMARY KEY ("id")
);
