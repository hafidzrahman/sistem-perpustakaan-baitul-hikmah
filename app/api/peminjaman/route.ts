// app/api/peminjaman/route.ts
import { Peminjaman } from "@/app/class/peminjaman";
// import {BukuPinjaman} from "@/app/class/bukupinjaman";
// import { prisma } from "@/lib";
import { NextRequest, NextResponse } from "next/server";
import {getToken} from 'next-auth/jwt';

export async function GET(req : NextRequest) {
  try {
    const token = await getToken({
      req,
      secret : process.env.NEXTAUTH_SECRET
    })


    let dataPeminjaman = []

    if (token?.role === "admin") {
      dataPeminjaman = await Peminjaman.ambilSemuaDataPeminjaman();
    } else if (token?.role === "guru" || token?.role === "murid") {
      dataPeminjaman = await Peminjaman.cariPeminjamanAnggota(token?.role as "murid" | "guru", token?.username as string)
    } else {
      throw new Error("Terjadi kesalahan pada pengkondisian role")
    }

    // await BukuPinjaman.perbaruiTenggatWaktuPeminjaman(
    //   dataPeminjaman[0].id,
    //   { isbn: "978-602-06-5192-9", id: 1 },
    //   new Date(Date.now() + 10000)
    // );

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

    const message = await Peminjaman.tambahPeminjaman(body);
    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menambahkan data peminjaman", details: error },
      { status: 500 }
    );
  }
}
