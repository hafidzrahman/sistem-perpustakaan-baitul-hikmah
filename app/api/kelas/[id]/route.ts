import {kelas, kelasType} from '@/lib';
import { NextResponse } from 'next/server';

type paramsType = {
    params : Promise<{id : string}>
}

export async function GET(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        const dataKelas = await kelas.cariKelas(id) as kelasType;

        if (!dataKelas?.id) {
            return NextResponse.json({message : "Data kelas tidak ditemukan"}, {status : 502})
        }

        return NextResponse.json({kelas}, {status : 200})

    } catch (e) {
        return NextResponse.json({message : "Gagal mendapatkan data kelas"}, {status : 501})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        const body = await req.json();
        const dataKelas = await kelas.cariKelas(id) as kelasType;

        if (!dataKelas?.id) {
            return NextResponse.json({message : "Data kelas tidak ditemukan"}, {status : 502})
        }

        kelas.perbaruiKelas(id, body);

        return NextResponse.json({kelas}, {status : 200})


    } catch (e) {
        return NextResponse.json({message : "Gagal mendapatkan data kelas"}, {status : 501})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        const dataKelas = await kelas.cariKelas(id) as kelasType;

        if (!dataKelas?.id) {
            return NextResponse.json({message : "Data kelas tidak ditemukan"}, {status : 502})
        }

        kelas.hapusKelas(id);

        return NextResponse.json({message : "Berhasil menghapus data kelas"}, {status : 200})

    } catch (e) { 
        return NextResponse.json({message : "Gagal menghapus data kelas"}, {status : 501})
    }
}