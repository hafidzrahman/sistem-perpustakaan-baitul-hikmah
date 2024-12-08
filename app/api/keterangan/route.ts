import {keterangan} from "@/app/class/keterangan";
import {NextResponse} from "next/server"


export async function GET() {
    try {
        const dataKeterangan = await keterangan.cariKeterangan();

        return NextResponse.json(dataKeterangan, {status:200})
    }
    catch (e) {
        return NextResponse.json({message : "Gagal mendapatkan data keterangan"}, {status : 506})
    }
}

export async function POST(req : Request) {
    try {
        const body = await req.json();

        await keterangan.tambahKeterangan(body);

        return NextResponse.json({message : "Data berhasil ditambahkan"}, {status : 200})
    } catch (e) {
        return NextResponse.json({message : "Gagal menambahkan data keterangan"}, {status : 502})
    }
}