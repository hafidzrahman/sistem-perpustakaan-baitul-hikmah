import { Denda } from "@/app/class/denda";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const dataDenda = await Denda.fineFindMany();

        return NextResponse.json(dataDenda, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data denda", details : error}, {status : 200})
    }
}

export async function POST(req : Request) {
    try {
        const body = await req.json();
        const imposeFine = await Denda.imposeFine(body);

        return NextResponse.json(imposeFine, {status : 200})
    } catch (error){
        return NextResponse.json({message : "Gagal mengenakan denda", details : error}, {status : 200})
    }
}