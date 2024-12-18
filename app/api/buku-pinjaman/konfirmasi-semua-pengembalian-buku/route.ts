import {BukuPinjaman} from '@/app/class/bukupinjaman';
import { NextResponse } from 'next/server';

export async function POST(req : Request) {
    try {
        const {idPeminjaman} = await req.json();

        await BukuPinjaman.konfirmasiSemuaPengembalianBuku(Number(idPeminjaman));

        return NextResponse.json({message : "Pengembalian buku berhasil dikonfirmasi"}, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mengkonfirmasi pengembalian buku", details : error}, {status : 405})
    }
}