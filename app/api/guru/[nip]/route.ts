import { guru } from '@/app/class/guru';
import {guruType} from '@/lib';
import { NextResponse } from 'next/server';

type paramsType = {
    params : Promise<{nip : string}>
}

export async function GET(req : Request, {params} : paramsType) {
    try {
        const {nip} = await params;
        
        const dataGuru = await guru.cariAnggota(nip) as guruType;

        if (!dataGuru?.nip) {
            return NextResponse.json({message : "Data Guru tidak ditemukan"}, {status : 502})
        }

        return NextResponse.json({guru}, {status : 200})

    } catch (e) {
        return NextResponse.json({message : "Gagal mendapatkan data Guru"}, {status : 501})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const {nip} = await params;
        const body = await req.json();

        const dataGuru = await guru.cariAnggota(nip) as guruType;

        if (!dataGuru?.nip) {
            return NextResponse.json({message : "Data Guru tidak ditemukan"}, {status : 502})
        }

        await guru.perbaruiAnggota(nip, body);

        return NextResponse.json({guru}, {status : 200})


    } catch (e) {
        return NextResponse.json({message : "Gagal mendapatkan data Guru"}, {status : 501})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {nip} = await params;
        
        const dataGuru = await guru.cariAnggota(nip) as guruType

        if (!dataGuru?.nip) {
            return NextResponse.json({message : "Data Guru tidak ditemukan"}, {status : 502})
        }

        await guru.hapusAnggota(nip);

        return NextResponse.json({message : "Berhasil menghapus data Guru"}, {status : 200})

    } catch (e) { 
        return NextResponse.json({message : "Gagal menghapus data Guru"}, {status : 501})
    }
}