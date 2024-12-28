import { Sumbangan } from "@/app/class/sumbangan";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const dataSumbangan = await Sumbangan.ambilSemuaDataSumbangan();

        return NextResponse.json(dataSumbangan, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data sumbangan", details : error}, {status : 500})
    }
}

export async function POST(req : Request) {
    try {
       const body = await req.json();
       await Sumbangan.tambahSumbangan(body);

       return NextResponse.json({message : "Berhasil menambahkan data sumbangan"}, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal menambahkan data sumbangan", details : error}, {status : 500})
    }
}