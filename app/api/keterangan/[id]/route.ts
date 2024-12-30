import {Keterangan} from '@/app/class/keterangan';
import {infType} from '@/lib'
import { NextResponse } from 'next/server';

type paramsType = {
    params : Promise<{id : string}>
}


export async function GET(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        const dataKeterangan = await Keterangan.findInf(Number(id)) as infType;

        return NextResponse.json(dataKeterangan, {status : 200})

    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data keterangan", details : error}, {status : 501})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        const body = await req.json();

        const dataKeterangan = await Keterangan.updtInf(Number(id), body);

        return NextResponse.json(dataKeterangan, {status : 200})


    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data keterangan", details : error}, {status : 501})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        await Keterangan.dltInf(Number(id));

        return NextResponse.json({message : "Berhasil menghapus data keterangan"}, {status : 200})

    } catch (error) { 
        return NextResponse.json({message : "Gagal menghapus data keterangan", details : error}, {status : 501})
    }
}