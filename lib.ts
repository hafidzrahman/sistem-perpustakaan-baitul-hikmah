import {PrismaClient} from '@prisma/client';
import { JenisKelamin, Genre } from "@prisma/client";
import { NextResponse } from 'next/server';

export interface Hash {
    [indexer : string] : number
}

export type guruType = {
    nip : string,
    nama : string,
    jenisKelamin : JenisKelamin,
    kontak : string,
    alamat? : string
}

export type muridType = {
    nis : string,
    idKelas? : number,
    nama : string,
    jenisKelamin : JenisKelamin,
    kontak : string,
    alamat? : string,
}

export type perbaruiAnggotaType = {
    nama? : string,
    jenisKelamin? : JenisKelamin,
    kontak? : string,
    alamat? : string,
    idKelas : number
}

export type perbaruiKelasType = {
    nama? : string,
    tingkat? : number
}

export type kelasType = {
    id : number,
    nama : string,
    tingkat : number
}

export type eksemplarBukuType = {
    id: number;
    tanggalRusak: Date | null;
    tanggalHilang: Date | null;
    posisi: string | null;
    bukuISBN: string;
} | null


export type bukuType = {
    judul : string,
    penulis? : string[] | number[],
    genre : Genre[],
    isbn : string,
    linkGambar? : string,
    sinopsis? : string,
    penerbit? : string | number, 
    halaman? : number, 
    tanggalRusak?: Date, 
    tanggalHilang? : Date, 
    posisi? : string 
}

export type cariBukuType = (
    { 
        penulis: { id: number; nama: string; }[]; 
        _count: { eksemplarBuku: number; }; } & 
        ({  isbn: string; 
            judul: string; 
            genre: Genre[];
            halaman: number | null; 
            linkGambar: string | null; 
            sinopsis: string | null; 
            idPenerbit: number; } | bukuType))


export type penulisType = {
    id : number,
    nama : string
}

export type perbaruiBukuType = {
    judul? : string,
    penulis? : string[] | number[],
    genre? : Genre[],
    isbn? : string,
    linkGambar? : string,
    sinopsis? : string,
    penerbit? : string | number, 
    halaman? : number, 
    tanggalRusak?: Date, 
    tanggalHilang? : Date, 
    posisi? : string 
}

export type keteranganType = {
    id : number,
    keterangan : string,
    jumlahBuku? : number,
    totalNominal? : number,
    nominalPerHari? : number
}

export type perbaruiKeteranganType = {
    keterangan? : string,
    jumlahBuku? : number,
    totalNominal? : number,
    nominalPerHari? : number
}

export type peminjamanType = {
    id : number,
    nis? : string,
    nip? : string,
    tanggalPinjam : Date,
    keterangan? : string
}

export type peminjamType = {
    nis? : string,
    nip? : string,
    keterangan? : string,
    tenggatWaktu? : Date
}

export interface Anggota<T,> {
    nama? : string;
    jenisKelamin? : JenisKelamin;
    kontak? : string;
    alamat? : string;

    tambahAnggota : (data : T) => Promise<void>;
    tambahBanyakAnggota : (data : T[]) => Promise<void>;
    cariAnggota : (id? : string) => Promise<T | T[]>;
    perbaruiAnggota : (id : string, data : perbaruiAnggotaType) => Promise<void>;
    hapusAnggota : (id : string) => Promise<void>;
    hapusSemuaAnggota : () => Promise<void>
}

export const prisma = new PrismaClient();

export async function konversiDataKeId(data : string | string[]) : Promise<number | number[]> {

    // jika data penulis yang dimasukkan adalah array string, pasti data belum ada di drop down menu
    if ((typeof (data as string[])) === "object") {
        const arrayData : {nama : string}[] = [];
        const arrayId : {id : number, nama : string}[] = [];

        // (data as string[]).forEach(async nama => {
        //     const dataPenulis = await prisma.penulis.findFirst({
        //         where : {
        //             nama
        //         }
        //     })
        //     console.log(dataPenulis)
        //     if (!dataPenulis) arrayData.push({nama})
        //     else arrayId.push(dataPenulis)
        // })
        
        // return (await prisma.penulis.createManyAndReturn({
        //     data : arrayData
        // })).concat(arrayId).map(({id}) => id) as number[];

        return (await prisma.penulis.createManyAndReturn({
            data : (data as string[]).map(nama => ({nama}))
        })).map(({id}) => id) as number[];
}  

    // const dataPenerbit = await prisma.penerbit.findFirst({
    //     where : {
    //         nama : "Orang Ganteng"
    //     }
    // })

    // if (dataPenerbit) return dataPenerbit.id

    // jika data penerbit yang dimasukkan adalah string, pasti data belum ada di drop down menu
    return (await prisma.penerbit.create({
        data : {
            nama : (data as string)
        }
    })).id
}