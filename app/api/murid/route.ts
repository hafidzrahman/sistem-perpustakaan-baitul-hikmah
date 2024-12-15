import { Murid } from "@/app/class/murid";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataMurid = await Murid.ambilSemuDataMurid();

    return NextResponse.json(dataMurid, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Data murid tidak ditemukan", details : error },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dataMurid = await Murid.tambahAnggota(body);
    
    return NextResponse.json(dataMurid, {status : 200});
  } catch (error) {
    return NextResponse.json(
      {
        message: "Gagal menambahkan data murid",
        details: error,
      },
      { status: 500 }
    );
  }
}
