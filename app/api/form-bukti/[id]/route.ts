import { FormBukti } from "@/app/class/formbukti";
import { NextResponse } from "next/server";

type paramsType = {
    params : Promise<{id : string}>
}


export async function GET(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;

        const dataFormBukti = await FormBukti.cariDataFormBukti(Number(id));

        return NextResponse.json(dataFormBukti, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data form bukti", details : error}, {status : 500})
    }
}

export async function POST(req : Request, {params} : paramsType) {
    try {
        const body = await req.json()
        const {id} = await params;

        const dataFormBukti = await FormBukti.perbaruiDataFormBukti(Number(id), body);

        return NextResponse.json(dataFormBukti, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal memperbarui data form bukti", details : error}, {status : 500})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;

        await FormBukti.hapusDataFormBukti(Number(id));

        return NextResponse.json({message : "Berhasil menghapus data form bukti"}, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal menghapus data form bukti", details : error}, {status : 500})
    }
}