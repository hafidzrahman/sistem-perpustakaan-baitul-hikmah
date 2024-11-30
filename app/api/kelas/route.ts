import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const kelas = await prisma.kelas.findMany({});
    return NextResponse.json(kelas);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, tingkat } = body;

    if (!nama || !tingkat) {
      return NextResponse.json({
        error: "Harus mengisi semua input",
        status: 500,
      });
    }

    const kelas = await prisma.kelas.create({
      data: {
        nama,
        tingkat,
      },
    });

    console.log(kelas);
    return NextResponse.json({
      message: "Data berhasil ditambahkan",
      id: kelas.id,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error });
  }
}
