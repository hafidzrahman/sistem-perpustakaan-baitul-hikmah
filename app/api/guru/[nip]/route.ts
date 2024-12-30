import { Guru } from '@/app/class/guru';
import {guruType} from '@/lib';
import { NextResponse } from 'next/server';

type paramsType = {
    params : Promise<{nip : string}>
}

export async function GET(req : Request, {params} : paramsType) {
    try {
        const {nip} = await params;
        
        const dataGuru = await Guru.findMember(nip) as guruType;

        // if (!dataGuru?.nip) {
        //     return new Error("Data Guru tidak ditemukan")
        // }

        return NextResponse.json(dataGuru, {status : 200})

    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data Guru", details : error}, {status : 501})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const {nip} = await params;
        const body = await req.json();

        // const dataGuru = await guru.findMember(nip) as guruType;

        // if (!dataGuru?.nip) {
        //     return NextResponse.json({message : "Data Guru tidak ditemukan"}, {status : 502})
        // }

        const dataGuru = await Guru.updtMember(nip, body);

        return NextResponse.json(dataGuru, {status : 200})


    } catch (error) {
        return NextResponse.json({message : "Gagal memperbarui data Guru", details : error}, {status : 501})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {nip} = await params;
        
        // const dataGuru = await guru.findMember(nip) as guruType

        // if (!dataGuru?.nip) {
        //     return NextResponse.json({message : "Data Guru tidak ditemukan"}, {status : 502})
        // }

        await Guru.dltMember(nip);

        return NextResponse.json({message : "Berhasil menghapus data Guru"}, {status : 200})

    } catch (error) { 
        return NextResponse.json({message : "Gagal menghapus data Guru", details : error}, {status : 501})
    }
}