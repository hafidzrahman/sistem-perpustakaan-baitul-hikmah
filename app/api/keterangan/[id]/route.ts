import {Keterangan} from '@/app/class/keterangan';
import {keteranganType} from '@/lib'
import { NextResponse } from 'next/server';

type paramsType = {
    params : Promise<{id : string}>
}


export async function GET(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        const dataKeterangan = await Keterangan.cariKeterangan(Number(id)) as keteranganType;

        if (!dataKeterangan?.id) {
            return new Error("Data keterangan tidak ditemukan");
        }

        return NextResponse.json(dataKeterangan, {status : 200})

    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data keterangan", details : error}, {status : 501})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        const body = await req.json();

        const dataKeterangan = await Keterangan.perbaruiKeterangan(Number(id), body);

        return NextResponse.json(dataKeterangan, {status : 200})


    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data keterangan", details : error}, {status : 501})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        await Keterangan.hapusKeterangan(Number(id));

        return NextResponse.json({message : "Berhasil menghapus data keterangan"}, {status : 200})

    } catch (error) { 
        return NextResponse.json({message : "Gagal menghapus data keterangan", details : error}, {status : 501})
    }
}