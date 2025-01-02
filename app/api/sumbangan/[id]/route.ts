import { Sumbangan } from "@/app/class/sumbangan";
import { NextResponse } from "next/server"


type paramsType = {
    params : Promise<{id : string}>
}

export async function GET(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        const dataSumbangan = await Sumbangan.cariSumbangan(Number(id));

        return NextResponse.json(dataSumbangan, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data sumbangan", details : error}, {status : 500})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
      const body = await req.json();
      const {id} = await params;

      const dataSumbangan = await Sumbangan.perbaruiSumbangan(Number(id), body)

      return NextResponse.json(dataSumbangan, {status : 200})
    } catch (error) { 
        return NextResponse.json({message : "Gagal memperbarui data sumbangan", details : error}, {status : 500})
    }
}