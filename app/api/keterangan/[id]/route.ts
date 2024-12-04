import {keterangan, keteranganType} from '@/lib';
import { NextResponse } from 'next/server';

type paramsType = {
    params : Promise<{id : string}>
}


export async function GET(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        const dataKeterangan = await keterangan.cariKeterangan(id) as keteranganType;

        if (!dataKeterangan?.id) {
            return NextResponse.json({message : "Data keterangan tidak ditemukan"}, {status : 502})
        }

        return NextResponse.json({dataKeterangan}, {status : 200})

    } catch (e) {
        return NextResponse.json({message : "Gagal mendapatkan data keterangan"}, {status : 501})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        const body = await req.json();

        await keterangan.perbaruiKeterangan(id, body);

        return NextResponse.json({keterangan}, {status : 200})


    } catch (e) {
        return NextResponse.json({message : "Gagal mendapatkan data keterangan"}, {status : 501})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        await keterangan.hapusKeterangan(id);

        return NextResponse.json({message : "Berhasil menghapus data keterangan"}, {status : 200})

    } catch (e) { 
        return NextResponse.json({message : "Gagal menghapus data keterangan"}, {status : 501})
    }
}