import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const buku = await prisma.buku.findMany({});
    return NextResponse.json(buku, { status: 201, statusText: "Success" });
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { judul, penulis, genre, isbn, linkGambar } = body;

    if (!judul || !penulis || !genre || !isbn || !linkGambar) {
      return NextResponse.json({
        error: "Harus mengisi semua input",
        status: 500,
      });
    }

    const buku = await prisma.buku.create({
      data: {
        judul,
        penulis,
        genre,
        isbn,
        linkGambar,
      },
    });

    return NextResponse.json({
      message: "Data berhasil ditambahkan",
      id: buku.id,
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
