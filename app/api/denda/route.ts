import { Denda } from "@/app/class/denda";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const dataDenda = await Denda.ambilSemuaDataDenda();

        return NextResponse.json(dataDenda, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data denda", details : error}, {status : 200})
    }
}

export async function POST(req : Request) {
    try {
        const body = await req.json();
        const kenakanDenda = await Denda.kenakanDenda(body);

        return NextResponse.json(kenakanDenda, {status : 200})
    } catch (error){
        return NextResponse.json({message : "Gagal mengenakan denda", details : error}, {status : 200})
    }
}