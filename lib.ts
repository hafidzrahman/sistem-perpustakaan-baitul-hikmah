import {PrismaClient} from '@prisma/client';
import { JenisKelamin } from "@prisma/client";
import {Penulis} from '@/app/class/penulis'
import {Penerbit} from '@/app/class/penerbit'
import {GenreClass} from '@/app/class/genre'

export interface Hash<T,> {
    [indexer : string] : T
}

export type guruType = {
    nip : string,
    nama : string,
    jenisKelamin : JenisKelamin,
    kontak : string,
    alamat? : string | null
}

export type muridType = {
    nis : string,
    idKelas? : number,
    nama : string,
    jenisKelamin : JenisKelamin,
    kontak : string,
    alamat? : string | null,
}

export type perbaruiAnggotaType = {
    nama? : string,
    jenisKelamin? : JenisKelamin,
    kontak? : string,
    alamat? : string | null,
    idKelas? : number
}

export type perbaruiPeminjaman = Omit<peminjamanType, "id" | "tanggalPinjam">;

export type ambilSemuaDataPeminjamanType = peminjamanType & {bukuPinjaman : (bukuPinjamanType & {eksemplarBuku : eksemplarBukuType})[]}

export type perbaruiKelasType = {
    nama? : string,
    tingkat? : number
}

export type kelasType = {
    id : number,
    nama : string,
    tingkat : number
}

export type riwayatKelasType = {
    muridNIS : string
    idKelas : number,
    tahunAjaran : string,
    nomorPresensi? : number
}

// id dan bukuISBN jadi opsional (!)
// sumbangan belum ditambahkan

export type eksemplarBukuType = {
    bukuISBN?: string;
    id?: number;
    tanggalMasuk? : Date | null;
    tanggalRusak? : Date | null;
    tanggalHilang? : Date | null;
    posisi? : string | null;
    idSumbangan? : number | null;
    idSumbanganBantuan? : number | null;
} | null


export type bukuType = {
    judul : string,
    penulis? : string[] | number[] | penulisType[],
    genre : string[] | number[] | genreType[],
    isbn : string,
    linkGambar? : string | null,
    sinopsis? : string | null,
    penerbit? : string | number | null,
    penerbitDetails? : penerbitType | null, 
    halaman? : number | null, 
    tanggalMasuk? : Date | null,
    tanggalRusak?: Date | null,  
    tanggalHilang? : Date | null, 
    posisi? : string  | null
}

export type tambahBukuType = bukuType & eksemplarBukuType

export type eksemplarDenganBukuType = eksemplarBukuType & {buku : bukuType}

export type penerbitType = {
    id: number;
    nama: string;
}

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
    isbn? : string, // berisiko jika diperbarui? kalau bukan autoincrement() harusnya aman? setiap eksemplar buku yang terkait dengan isbn yang mau diubah pasti akan error
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
    jumlahBuku? : number | null,
    totalNominal? : number | null,
    nominalPerHari? : number | null
}

export type perbaruiKeteranganType = {
    keterangan? : string | null,
    jumlahBuku? : number | null,
    totalNominal? : number | null,
    nominalPerHari? : number | null
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
    daftarBukuPinjaman : {isbn : string, tenggatWaktu : Date}[]
}

export type bukuPinjamanType = {
    bukuISBN : string,
    id? : number,
    tenggatWaktu : Date,
    tanggalKembali? : Date | null
}

export type formBuktiType = {
    id? : number,
    bukuISBN : string,
    muridNIS : string,
    tanggal : Date,
    intisari : string,
    halamanAwal : number,
    halamanAkhir : number,
    status : boolean;
}

export type perbaruiFormBuktiType = {
    bukuISBN? : string,
    muridNIS? : string,
    tanggal? : Date,
    intisari? : string,
    halamanAwal? : number,
    halamanAkhir? : number,
    status? : boolean;
}

export interface Anggota<T,> {
    nama? : string;
    jenisKelamin? : JenisKelamin;
    kontak? : string;
    alamat? : string | null;
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
            let dataPenulis = await Penulis.cariPenulis({nama})

            if (!dataPenulis) {
                dataPenulis = await Penulis.tambahPenulis(nama)
            }
            arrayId.push(dataPenulis.id)
        }
        return arrayId;
    } else if (tableName === "genre") {
        for await (const nama of data as string[]) {
            let dataGenre = await GenreClass.cariGenre({nama})

            if (!dataGenre) {
                dataGenre = await GenreClass.tambahGenre(nama);
            }
            arrayId.push(dataGenre.id)
        }
        return arrayId;
}  
    

    let dataPenerbit = await Penerbit.cariPenerbit({nama : data as string})

    if (!dataPenerbit) {
        dataPenerbit = await Penerbit.tambahPenerbit(data as string);
    }
    
    
    return dataPenerbit.id;

}