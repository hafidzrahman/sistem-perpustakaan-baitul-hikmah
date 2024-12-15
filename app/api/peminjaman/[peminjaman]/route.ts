import { Peminjaman } from "@/app/class/peminjaman";
import { NextResponse } from "next/server";


type paramsType = {
    params : Promise<{peminjaman : number}>
}

export async function GET(req : Request, {params} : paramsType) {
    try {
        const idPeminjaman = await params;

        const dataPeminjaman = await Peminjaman.cariPeminjaman(Number(idPeminjaman));

        return NextResponse.json(dataPeminjaman, {status : 200});
    }
    catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data peminjaman", details : error}, {status : 500})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const body = await req.json();
        const idPeminjaman = await params;

        const dataPeminjaman = await Peminjaman.perbaruiPeminjaman(Number(idPeminjaman), body)

        return NextResponse.json(dataPeminjaman, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal memperbarui data peminjaman", details : error}, {status : 500})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const idPeminjaman = await params;

        await Peminjaman.hapusPeminjaman(Number(idPeminjaman));

        return NextResponse.json({message : "Data peminjaman berhasil dihapus"}, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal menghapus data peminjaman", details : error}, {status : 500})
    }
}