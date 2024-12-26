import { Sumbangan } from "@/app/class/sumbangan";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const dataSumbangan = await Sumbangan.ambilSemuaDataSumbangan();

        return NextResponse.json(dataSumbangan, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data sumbangan"}, {status : 500})
    }
}