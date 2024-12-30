import { Penulis } from "@/app/class/penulis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataPenulis = await Penulis.findAllWriter();

    return NextResponse.json(dataPenulis, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mendapatkan data penulis", details: error },
      { status: 405 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dataPenulis = await Penulis.addWriter(body);

    return NextResponse.json(dataPenulis, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menambahkan data guru", details: error },
      { status: 500 }
    );
  }
}
