import {PrismaClient} from '@prisma/client';
import { JenisKelamin } from "@prisma/client";

export interface Hash<T,> {
    [indexer : string] : T
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

// id dan bukuISBN jadi opsional (!)
// sumbangan belum ditambahkan

export type eksemplarBukuType = {
    bukuISBN?: string;
    id?: number;
    tanggalMasuk : Date | null;
    tanggalRusak: Date | null;
    tanggalHilang: Date | null;
    posisi: string | null;
} | null


export type bukuType = {
    judul : string,
    penulis? : string[] | number[] | penulisType[],
    genre : string[] | number[] | genreType[],
    isbn : string,
    linkGambar? : string,
    sinopsis? : string,
    penerbit? : string | number,
    penerbitDetails? : penerbitType 
    halaman? : number, 
    tanggalMasuk? : Date,
    tanggalRusak?: Date, 
    tanggalHilang? : Date, 
    posisi? : string 
}

export type penerbitType = {
    id: number;
    nama: string;
} | null

export type genreType = {
    id : number,
    nama : string
}


export type cariBukuType = ({
    genre: genreType[];
    _count: {
        eksemplarBuku: number;
    };
} & {
    penulis : penulisType[]
} & {
    isbn: string;
    judul: string;
    halaman: number | null;
    linkGambar: string | null;
    sinopsis: string | null;
    penerbit: number | penerbitType | null;
    penerbitDetails? : penerbitType
}) | null


export type penulisType = {
    id : number,
    nama : string
}

export type perbaruiBukuType = {
    judul? : string,
    penulis? : string[] | number[] | penulisType[],
    genre? : string[] | number[],
    isbn? : string, // berisiko jika diperbarui?
    linkGambar? : string,
    sinopsis? : string,
    penerbit? : string | number,
    penerbitDetails? : penerbitType, 
    halaman? : number, 
    tanggalMasuk? : Date,
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

export enum Genre {
  FANTASY = "FANTASY",
  SCIFI = "SCI-FI",
  MYSTERY = "MYSTERY",
  BIOGRAPHY = "BIOGRAPHY",
  HISTORY = "HISTORY",
  ROMANCE = "ROMANCE",
}

export enum StatusCodes {
    success = 200
}

export const prisma = new PrismaClient();

export async function konversiDataKeId(tableName : string, data : string | string[]) : Promise<number | number[]> {
    
        const arrayId : number[] = [];

        // jika data penulis atau genre yang dimasukkan adalah array string, pasti data belum ada di drop down menu
        if (tableName === "penulis") {
        for await (const nama of data as string[]) {
            let dataPenulis = await prisma.penulis.findFirst({
                where : {
                    nama
                }
            })

            if (!dataPenulis) {
                dataPenulis = await prisma.penulis.create({
                    data : {
                        nama
                    }
                })
            }
            arrayId.push(dataPenulis.id)
        }
        return arrayId;
    } else if (tableName === "genre") {
        for await (const nama of data as string[]) {
            let dataGenre = await prisma.genre.findFirst({
                where : {
                    nama
                }
            })

            if (!dataGenre) {
                dataGenre = await prisma.genre.create({
                    data : {
                        nama
                    }
                })
            }
            arrayId.push(dataGenre.id)
        }
        return arrayId;
}  
    

    let dataPenerbit = await prisma.penerbit.findFirst({
        where : {
            nama : data as string
        }
    })
    if (!dataPenerbit) {
        dataPenerbit = await prisma.penerbit.create({
            data : {
                nama : data as string
            }
        })
    }
    
    
    return dataPenerbit.id;

}