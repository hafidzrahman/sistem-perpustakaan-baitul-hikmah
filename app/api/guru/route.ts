import { NextResponse } from "next/server";
import { guru } from "@/app/class/guru";

export async function GET() {
    try {
        const dataGuru = await guru.cariAnggota(); 

        return NextResponse.json(dataGuru, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Data guru tidak ditemukan", details : error}, {status : 504})
    }
}

export async function POST(req : Request) {

    try {
        const body = await req.json();

        const dataGuru = await guru.tambahAnggota(body);

    return NextResponse.json(dataGuru, {status : 200})
    } catch (error) {
        return NextResponse.json(
            {message : "Gagal menambahkan data Guru", details : error},
            {status : 503}
        )
    }
}