import {murid} from '@/app/class/murid';
import {muridType} from '@/lib';
import { NextResponse } from 'next/server';

type paramsType = {
    params : Promise<{nis : string}>
}

export async function GET(req : Request, {params} : paramsType) {
    try {
        const {nis} = await params;
        
        const dataMurid = await murid.cariAnggota(nis) as muridType;

        if (!dataMurid?.nis) {
            return NextResponse.json({message : "Data murid tidak ditemukan"}, {status : 502})
        }

        return NextResponse.json({murid}, {status : 200})

    } catch (e) {
        return NextResponse.json({message : "Gagal mendapatkan data murid"}, {status : 501})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const {nis} = await params;
        const body = await req.json();

        const dataMurid = await murid.cariAnggota(nis) as muridType;

        if (!dataMurid?.nis) {
            return NextResponse.json({message : "Data murid tidak ditemukan"}, {status : 502})
        }

        murid.perbaruiAnggota(nis, body);

        return NextResponse.json({murid}, {status : 200})


    } catch (e) {
        return NextResponse.json({message : "Gagal mendapatkan data murid"}, {status : 501})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {nis} = await params;
        
        const dataMurid = await murid.cariAnggota(nis) as muridType;

        if (!dataMurid?.nis) {
            return NextResponse.json({message : "Data murid tidak ditemukan"}, {status : 502})
        }

        await murid.hapusAnggota(nis);

        return NextResponse.json({message : "Berhasil menghapus data murid"}, {status : 200})

    } catch (e) { 
        return NextResponse.json({message : "Gagal menghapus data murid"}, {status : 501})
    }
}