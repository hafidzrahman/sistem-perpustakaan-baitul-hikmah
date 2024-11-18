import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { fromSlug } from "@/app/utils/slug";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);

  const judul = url.pathname.split("/").pop(); // Mendapatkan nilai 'judul'
  console.log("ini judul" + judul);

  if (!judul) {
    return NextResponse.json({ message: "Judul tidak ditemukan", status: 400 });
  }

  const buku = await prisma.buku.findFirst({
    where: { judul: fromSlug(judul) },
  });

  if (!buku) {
    return NextResponse.json({ message: "Buku Tidak ditemukan", status: 404 });
  }

  return NextResponse.json(buku);
}
