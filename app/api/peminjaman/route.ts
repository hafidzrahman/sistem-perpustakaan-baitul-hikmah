import { Peminjaman } from "@/app/class/peminjaman";
import { prisma } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataPeminjaman = await Peminjaman.ambilSemuaDataPeminjaman();
    await Peminjaman.perbaruiTenggatWaktuPeminjaman(
      dataPeminjaman[0].id,
      { isbn: "978-602-06-5192-9", id: 1 },
      new Date(Date.now() + 10000)
    );

    return NextResponse.json(dataPeminjaman, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mendapatkan data peminjaman", details: error },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dataPeminjaman = await Peminjaman.tambahPeminjaman(body);

    return NextResponse.json(dataPeminjaman, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menambahkan data buku", details: error },
      { status: 500 }
    );
  }
}
