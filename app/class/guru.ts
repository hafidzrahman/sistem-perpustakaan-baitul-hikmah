import { Anggota, guruType, perbaruiAnggotaType, prisma } from "@/lib";
import { JenisKelamin } from "@prisma/client";
import { NextResponse } from "next/server";

export class Guru implements Anggota<guruType>{
    nip? : string;
    nama? : string;
    jenisKelamin? : JenisKelamin;
    kontak? : string;
    alamat? : string;

    constructor(req? : Request) 
        {
        req?.json().then((data : guruType) => {
            this.nip = data.nip;
            this.nama = data.nama;
            this.jenisKelamin = data.jenisKelamin;
            this.kontak = data.kontak;
            this.alamat = data.alamat;
        })
    }

    async tambahAnggota(dataGuru : guruType) : Promise<void> {
        const {nip, nama, jenisKelamin, kontak, alamat} = dataGuru;

        if (!nip || !nama || !jenisKelamin || kontak) {
            throw new Error("Harus mengisi field yang wajib")
        }

        await prisma.guru.create({
            data: {
              nip,
              nama,
              jenisKelamin,
              kontak,
              alamat,
            },
          });
      
        
    }


    async tambahBanyakAnggota(dataGuru : guruType[]) : Promise<void> {
        await prisma.guru.createMany({
            data : dataGuru
        })
    }

    async cariAnggota (nip? : string) : Promise<guruType | guruType[]> {
        let guru : guruType | guruType[] = []; 

        if (nip) {    
            guru = await prisma.guru.findUnique({
                where : {
                    nip
                }
            }) as guruType
    
            if (!guru?.nip) {
                throw ({message : "Data guru tidak ditemukan"})
            }

            return guru;
    } 

        guru = await prisma.guru.findMany({}) as guruType[]

        return guru;

}

    async perbaruiAnggota(nip : string, data : perbaruiAnggotaType) :Promise<void> {
        const {nama, jenisKelamin, kontak, alamat} = data;

        let guru = await this.cariAnggota(nip) as guruType;

        if (!guru?.nip) {
            throw ({message : "Data kelas tidak ditemukan"})
        }

        await prisma.guru.update({
            data : {
                nama : nama || guru.nama,
                jenisKelamin : jenisKelamin || guru.jenisKelamin,
                kontak : kontak || guru.kontak,
                alamat : alamat || guru.alamat,
            },
            where : {
                nip
            }
        })


    }

    async hapusAnggota(nip : string) : Promise<void> {
        const guru = await prisma.guru.delete({
            where : {
                nip
            }
        })

        if (!guru?.nip) {
            throw NextResponse.json({message : "Data guru tidak ditemukan"}, {status : 502})
        }
    }

    async hapusSemuaAnggota() : Promise<void> {
        await prisma.guru.deleteMany({})
    }
    
}

export const guru = new Guru();
