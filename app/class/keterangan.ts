import {keteranganType, prisma} from '@/lib'
import { NextResponse } from 'next/server';

export class Keterangan{
    id : number;
    keterangan : string;
    jumlahBuku? : number | null;
    totalNominal? : number | null;
    nominalPerHari? : number | null;

    constructor(data : keteranganType) {
            this.id = data.id;
            this.keterangan = data.keterangan;
            this.jumlahBuku = data.jumlahBuku;
            this.totalNominal = data.totalNominal;
            this.nominalPerHari = data.nominalPerHari;
    }

    static async tambahKeterangan(dataKeterangan : Omit<keteranganType, 'id'>) : Promise<keteranganType> {
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

    static async tambahBanyakKeterangan(dataKeterangan : Omit<keteranganType, 'id'>[]) : Promise<keteranganType[]> {
        const result = await prisma.keterangan.createManyAndReturn({
            data : dataKeterangan
        })

        return result;
    }

    static async cariKeterangan (id : number) : Promise<keteranganType | undefined | null> {
 
            const keterangan = await prisma.keterangan.findUnique({
                where : {
                    id
                }
            }) as keteranganType
    
            if (!keterangan?.id) {
                throw ({message : "Data keterangan tidak ditemukan"})
            }

            return keterangan;

}
    static async ambilSemuaDataKeterangan() : Promise<keteranganType[]> {
        const keterangan = await prisma.keterangan.findMany({}) as keteranganType[]

        return keterangan;
    }

    static async ambilSemuaDataKeteranganDenda() : Promise<keteranganType[]> {
        const keterangan = await prisma.keterangan.findMany({
            where : {
                denda : true
            }
        }) as keteranganType[]

        return keterangan;
    }

    static async perbaruiKeterangan(id : number, dataKeterangan : Omit<keteranganType, 'id'>) :Promise<keteranganType> {
        const {keterangan : deskripsi, jumlahBuku, totalNominal, nominalPerHari} = dataKeterangan;

        const keterangan = await Keterangan.cariKeterangan(id) as keteranganType;

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

    static async hapusKeterangan(id : number) : Promise<void> {
        const keterangan = await prisma.keterangan.delete({
            where : {
                id
            }
        })

        if (!keterangan?.id) {
            throw NextResponse.json({message : "Data keterangan tidak ditemukan"}, {status : 502})
        }
    }

    static async hapusSemuaKeterangan() : Promise<void> {
        await prisma.keterangan.deleteMany({}) 
    }
    
}