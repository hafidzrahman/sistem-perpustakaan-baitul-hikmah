import { FormBukti } from "@/app/class/formbukti";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const dataFormBukti = await FormBukti.takeAllFB();

        return NextResponse.json(dataFormBukti, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data form bukti", details : error}, {status : 500})
    }
}

export async function POST(req : Request) {
    try {
        const body = await req.json();
        const dataFormBukti = await FormBukti.addFB(body);

        return NextResponse.json(dataFormBukti, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data form bukti", details : error}, {status : 500})
    }
}