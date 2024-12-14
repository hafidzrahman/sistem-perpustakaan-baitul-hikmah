import { kelas } from "@/app/class/kelas";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataKelas = await kelas.cariKelas();
    return NextResponse.json(dataKelas, {status : 200});
  } catch (error) {
    return NextResponse.json({message : "Data murid tidak ditemukan", details : error }, {status : 500});
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dataKelas = await kelas.tambahKelas(body); 
    
    return NextResponse.json(dataKelas, {status : 200});
  } catch (error) {
    return NextResponse.json({ message : "Gagal menambahkan data murid", details : error }, {status : 500});
  }
}
