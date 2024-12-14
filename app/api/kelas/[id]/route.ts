import {kelas} from '@/app/class/kelas';
import {kelasType} from '@/lib';
import { NextResponse } from 'next/server';

type paramsType = {
    params : Promise<{id : string}>
}

export async function GET(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        const dataKelas = await kelas.cariKelas(Number(id)) as kelasType;

        if (!dataKelas?.id) {
            return new Error("Data kelas tidak ditemukan");
        }

        return NextResponse.json(dataKelas, {status : 200})

    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data kelas", details : error}, {status : 501})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        const body = await req.json();
        // const dataKelas = await kelas.cariKelas(Number(id)) as kelasType;

        // if (!dataKelas?.id) {
        //     return NextResponse.json({message : "Data kelas tidak ditemukan"}, {status : 502})
        // }

        const dataKelas = await kelas.perbaruiKelas(Number(id), body);

        return NextResponse.json(dataKelas, {status : 200})


    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data kelas", details : error}, {status : 501})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {id} = await params;
        
        // const dataKelas = await kelas.cariKelas(Number(id)) as kelasType;

        // if (!dataKelas?.id) {
        //     return NextResponse.json({message : "Data kelas tidak ditemukan"}, {status : 502})
        // }

        await kelas.hapusKelas(Number(id));

        return NextResponse.json({message : "Berhasil menghapus data kelas"}, {status : 200})

    } catch (error) { 
        return NextResponse.json({message : "Gagal menghapus data kelas", details : error}, {status : 501})
    }
}