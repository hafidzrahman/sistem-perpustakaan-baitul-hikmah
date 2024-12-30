import {infType, prisma} from '@/lib'
import { NextResponse } from 'next/server';

export class Keterangan{
    id : number;
    keterangan : string;
    jumlahBuku? : number | null;
    totalNominal? : number | null;
    nominalPerHari? : number | null;

    constructor(data : infType) {
            this.id = data.id;
            this.keterangan = data.keterangan;
            this.jumlahBuku = data.jumlahBuku;
            this.totalNominal = data.totalNominal;
            this.nominalPerHari = data.nominalPerHari;
    }

    static async addInf(dataKeterangan : Omit<infType, 'id'>) : Promise<infType> {
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

    static async addManyInf(dataKeterangan : Omit<infType, 'id'>[]) : Promise<infType[]> {
        const result = await prisma.keterangan.createManyAndReturn({
            data : dataKeterangan
        })

        return result;
    }

    static async findInf (id : number) : Promise<infType | undefined | null> {
 
            const keterangan = await prisma.keterangan.findUnique({
                where : {
                    id
                }
            }) as infType
    
            if (!keterangan?.id) {
                throw ({message : "Data keterangan tidak ditemukan"})
            }

            return keterangan;

}
    static async findAllInf() : Promise<infType[]> {
        const keterangan = await prisma.keterangan.findMany({}) as infType[]

        return keterangan;
    }

    static async findAllInfDenda() : Promise<infType[]> {
        const keterangan = await prisma.keterangan.findMany({
            where : {
                denda : true
            }
        }) as infType[]

        return keterangan;
    }

    static async updtInf(id : number, dataKeterangan : Omit<infType, 'id'>) :Promise<infType> {
        const {keterangan : deskripsi, jumlahBuku, totalNominal, nominalPerHari} = dataKeterangan;

        const keterangan = await Keterangan.findInf(id) as infType;

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

    static async dltInf(id : number) : Promise<void> {
        const keterangan = await prisma.keterangan.delete({
            where : {
                id
            }
        })

        if (!keterangan?.id) {
            throw NextResponse.json({message : "Data keterangan tidak ditemukan"}, {status : 502})
        }
    }

    static async dltAllInf() : Promise<void> {
        await prisma.keterangan.deleteMany({}) 
    }
    
}