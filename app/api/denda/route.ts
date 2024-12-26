import { Denda } from "@/app/class/denda";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const dataDenda = await Denda.ambilSemuaDataDenda();

        return NextResponse.json(dataDenda, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data denda"}, {status : 200})
    }
}