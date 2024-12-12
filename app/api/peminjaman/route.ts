import { peminjaman } from "@/app/class/peminjaman";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataPeminjaman = await peminjaman.cariPeminjaman();

    return NextResponse.json(dataPeminjaman, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mendapatkan data peminjaman" },
      { status: 503 }
    );
  }
}
