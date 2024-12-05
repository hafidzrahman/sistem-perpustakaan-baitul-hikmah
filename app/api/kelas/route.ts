import { kelas } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataKelas = await kelas.cariKelas();
    return NextResponse.json(dataKelas, {status : 200});
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await kelas.tambahKelas(body); 
    
    return NextResponse.json({
      message: "Data berhasil ditambahkan"}, {status : 200});
  } catch (error) {
    return NextResponse.json({ error });
  }
}
