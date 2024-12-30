import { BukuPinjaman } from "@/app/class/bukupinjaman";
import { NextResponse } from "next/server";

export async function POST(req : Request) {
    try {
        const body = await req.json();

        await BukuPinjaman.updtdeadline(body);
        
        return NextResponse.json({message : "Berhasil memperbarui tenggat waktu peminjaman buku"}, {status : 200});
    } catch (error) {
        return NextResponse.json({message : "Gagal memperbarui tenggat waktu peminjaman buku", details : error}, {status : 405})
    }
}