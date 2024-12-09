import { buku } from "@/app/class/buku";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    const dataBuku = await buku.cariBuku();
    return NextResponse.json(dataBuku);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await buku.tambahBuku(body)

    return NextResponse.json({
      message: "Data berhasil ditambahkan",
    });
  } catch (error) {

    return NextResponse.json({ error });
  }
}
