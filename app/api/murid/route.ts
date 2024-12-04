import { murid } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataMurid = await murid.cariAnggota();

    return NextResponse.json(dataMurid, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mendapatkan data murid" },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await murid.tambahAnggota(body);
    
    return NextResponse.json({
      message: "Data berhasil ditambahkan"
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
