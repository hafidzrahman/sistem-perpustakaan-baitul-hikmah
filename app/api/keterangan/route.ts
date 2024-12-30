import {Keterangan} from "@/app/class/keterangan";
import {NextResponse} from "next/server"


export async function GET() {
    try {
        const dataKeterangan = await Keterangan.findAllInf();

        return NextResponse.json(dataKeterangan, {status:200})
    }
    catch (error) {
        return NextResponse.json({message : "Data keterangan tidak ditemukan", details : error}, {status : 506})
    }
}

export async function POST(req : Request) {
    try {
        const body = await req.json();

        const dataKeterangan = await Keterangan.addInf(body);

        return NextResponse.json(dataKeterangan, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal menambahkan data keterangan", details : error}, {status : 502})
    }
}