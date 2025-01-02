import { BukuPinjaman } from "@/app/class/bukupinjaman";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    await BukuPinjaman.konfirmasiPengembalian(body);

    return NextResponse.json(
      { message: "Pengembalian buku telah dikonfirmasi!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mendata pengembalian buku", details: error },
      { status: 405 }
    );
  }
}
