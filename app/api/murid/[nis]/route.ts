import {Murid} from '@/app/class/murid';
import {muridType} from '@/lib';
import { NextResponse } from 'next/server';

type paramsType = {
    params : Promise<{nis : string}>
}

export async function GET(req : Request, {params} : paramsType) {
    try {
        const {nis} = await params;
        
        const dataMurid = await Murid.findMember(nis) as muridType;

        if (!dataMurid?.nis) {
            return new Error("Data murid tidak ditemukan");
        }

        return NextResponse.json(dataMurid, {status : 200})

    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data murid", details : error}, {status : 501})
    }
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const {nis} = await params;
        const body = await req.json();

        // const dataMurid = await murid.findMember(nis) as muridType;

        // if (!dataMurid?.nis) {
        //     return NextResponse.json({message : "Data murid tidak ditemukan"}, {status : 502})
        // }

        const dataMurid = await Murid.updtMember(nis, body);

        return NextResponse.json(dataMurid, {status : 200})


    } catch (error) {
        return NextResponse.json({message : "Gagal memperbarui data murid", details : error}, {status : 501})
    }
}

export async function DELETE(req : Request, {params} : paramsType) {
    try {
        const {nis} = await params;
        
        // const dataMurid = await murid.findMember(nis) as muridType;

        // if (!dataMurid?.nis) {
        //     return NextResponse.json({message : "Data murid tidak ditemukan"}, {status : 502})
        // }

        await Murid.dltMember(nis);

        return NextResponse.json({message : "Berhasil menghapus data murid"}, {status : 200})

    } catch (error) { 
        return NextResponse.json({message : "Gagal menghapus data murid", details : error}, {status : 501})
    }
}