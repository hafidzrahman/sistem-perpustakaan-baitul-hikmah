import {Penulis} from '@/app/class/penulis';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const dataPenulis = Penulis.ambilSemuaDataPenulis();

        return NextResponse.json(dataPenulis, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data penulis", details : error}, {status : 405})
    }
}