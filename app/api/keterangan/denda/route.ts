import {Keterangan} from "@/app/class/keterangan";
import {NextResponse} from "next/server"

export async function GET() {
    try {
        const dataKeterangan = await Keterangan.ambilSemuaDataKeterangan();

        return NextResponse.json(dataKeterangan, {status:200})
    }
    catch (error) {
        return NextResponse.json({message : "Data keterangan tidak ditemukan", details : error}, {status : 506})
    }
}