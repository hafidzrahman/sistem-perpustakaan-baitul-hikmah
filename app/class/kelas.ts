import { kelasType, perbaruiKelasType, prisma } from "@/lib";
import { NextResponse } from "next/server";

export class Kelas{
    nama? : string;
    tingkat? : number;

    constructor(req? : Request) 
        {
        req?.json().then((data : kelasType) => {
            this.nama = data.nama;
            this.tingkat = data.tingkat;
        })
    }

    async tambahKelas(dataKelas : Omit<kelasType, 'id'>) : Promise<void> {
        const {nama, tingkat} = dataKelas;

        if (!nama || !tingkat) {
            throw new Error("Harus mengisi field yang wajib")
        }

        await prisma.kelas.create({
            data: {
              nama,
              tingkat
            },
          });
    }
    
    async tambahBanyakKelas(dataKelas : Omit<kelasType, 'id'>[]) {
        await prisma.kelas.createMany({
            data : dataKelas
        })
    }

    async cariKelas (id? : number) : Promise<kelasType | kelasType[]> {
        let kelas : kelasType | kelasType[] = []; 

        if (id) {    
            kelas = await prisma.kelas.findUnique({
                where : {
                    id
                }
            }) as kelasType
    
            if (!kelas?.id) {
                throw ({message : "Data kelas tidak ditemukan"})
            }

            return kelas;
    } 

        kelas = await prisma.kelas.findMany({}) as kelasType[]

        return kelas;

}

    async perbaruiKelas(id : number, data : perbaruiKelasType) :Promise<void> {
        const {nama, tingkat} = data;

        let kelas = await this.cariKelas(id) as kelasType;

        if (!kelas?.id) {
            throw ({message : "Data kelas tidak ditemukan"})
        }

        await prisma.kelas.update({
            data : {
                nama : nama || kelas.nama,
                tingkat : tingkat || kelas.tingkat,
            },
            where : {
                id
            }
        })


    }

    async hapusKelas(id : number) : Promise<void> {
        const kelas = await prisma.kelas.delete({
            where : {
                id
            }
        })

        if (!kelas?.id) {
            throw NextResponse.json({message : "Data kelas tidak ditemukan"}, {status : 502})
        }
    }

    async hapusSemuaKelas() {
        // await prisma.riwayatKelas.deleteMany({})
        await prisma.kelas.deleteMany({})
    }
    
}

export const kelas = new Kelas();
