import { Sumbangan } from "@/app/class/sumbangan";
import { NextResponse } from "next/server";


export async function POST(req : Request) {
    try {
        const body = await req.json();
        await Sumbangan.beriSumbangan(body);

        return NextResponse.json({message : "Berhasil menyimpan data sumbangan"}, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal menyimpan data sumbangan", details : error}, {status : 500})
    }
}