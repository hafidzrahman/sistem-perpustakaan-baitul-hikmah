import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const murid = await prisma.murid.findMany({
      include: {
        kelas: true,
      },
    });

    return NextResponse.json(murid, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nis, nama, jenisKelamin, kontakOrtu, alamat, idKelas } = body;

    const murid = await prisma.murid.create({
      data: {
        nis,
        nama,
        jenisKelamin,
        kontakOrtu,
        alamat,
        idKelas,
      },
    });

    return NextResponse.json({
      message: "Data berhasil ditambahkan",
      id: murid.nis,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Gagal menambahkan murid",
        details: error,
      },
      { status: 500 }
    );
  }
}
