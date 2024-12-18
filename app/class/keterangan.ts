import {keteranganType, prisma} from '@/lib'
import { NextResponse } from 'next/server';

export class Keterangan{
    id? : number;
    keterangan? : string;
    jumlahBuku? : number | null;
    totalNominal? : number | null;
    nominalPerHari? : number | null;

    constructor(req? : Request) {
        req?.json().then(({id, keterangan, jumlahBuku, totalNominal, nominalPerHari} : keteranganType) => 
            {
            this.id = id;
            this.keterangan = keterangan;
            this.jumlahBuku = jumlahBuku;
            this.totalNominal = totalNominal;
            this.nominalPerHari = nominalPerHari;
        }).catch(() => {
            throw new Error("Gagal mendapatkan data")
        })
    }

    async tambahKeterangan(dataKeterangan : Omit<keteranganType, 'id'>) : Promise<keteranganType> {
        const {keterangan, jumlahBuku, totalNominal, nominalPerHari} = dataKeterangan;
        

        if (!keterangan) {
            throw new Error("Harus mengisi field yang wajib")
        }

        const result = await prisma.keterangan.create({
            data: {
              keterangan,
              jumlahBuku,
              totalNominal,
              nominalPerHari
            },
          });

          return result;
    }

    async tambahBanyakKeterangan(dataKeterangan : Omit<keteranganType, 'id'>[]) : Promise<keteranganType[]> {
        const result = await prisma.keterangan.createManyAndReturn({
            data : dataKeterangan
        })

        return result;
    }

    async cariKeterangan (id? : number) : Promise<keteranganType | keteranganType[]> {
        let keterangan : keteranganType | keteranganType[] = []; 

        if (id) {    
            keterangan = await prisma.keterangan.findUnique({
                where : {
                    id
                }
            }) as keteranganType
    
            if (!keterangan?.id) {
                throw ({message : "Data keterangan tidak ditemukan"})
            }

            return keterangan;
    } 

        keterangan = await prisma.keterangan.findMany({}) as keteranganType[]

        return keterangan;

}

    async perbaruiKeterangan(id : number, dataKeterangan : Omit<keteranganType, 'id'>) :Promise<keteranganType> {
        const {keterangan : deskripsi, jumlahBuku, totalNominal, nominalPerHari} = dataKeterangan;

        const keterangan = await this.cariKeterangan(id) as keteranganType;

        if (!keterangan?.id) {
            throw new Error("Data keterangan tidak ditemukan")
        }

        const result = await prisma.keterangan.update({
            data : {
                keterangan : deskripsi || keterangan.keterangan,
                jumlahBuku : jumlahBuku || keterangan.jumlahBuku,
                totalNominal : totalNominal || keterangan.totalNominal,
                nominalPerHari : nominalPerHari || keterangan.nominalPerHari
            },
            where : {
                id
            }
        })

        return result;
    }

    async hapusKeterangan(id : number) : Promise<void> {
        const keterangan = await prisma.keterangan.delete({
            where : {
                id
            }
        })

        if (!keterangan?.id) {
            throw NextResponse.json({message : "Data keterangan tidak ditemukan"}, {status : 502})
        }
    }

    async hapusSemuaKeterangan() : Promise<void> {
        await prisma.keterangan.deleteMany({}) 
    }
    
}

export const keterangan = new Keterangan();