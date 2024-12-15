import { Anggota, guruType, perbaruiAnggotaType, prisma } from "@/lib";
import { JenisKelamin } from "@prisma/client";
import { NextResponse } from "next/server";

export class Guru implements Anggota<guruType>{
    nip : string;
    nama : string;
    jenisKelamin : JenisKelamin;
    kontak : string;
    alamat? : string | null;

    constructor(data : guruType) {
            this.nip = data.nip;
            this.nama = data.nama;
            this.jenisKelamin = data.jenisKelamin;
            this.kontak = data.kontak;
            this.alamat = data.alamat;
    }

    static async tambahAnggota(dataGuru : guruType) : Promise<guruType> {
        const {nip, nama, jenisKelamin, kontak, alamat} = dataGuru;

        if (!nip || !nama || !jenisKelamin || !kontak) {
            throw new Error("Harus mengisi field yang wajib")
        }

        // const cariGuru = await Guru.cariAnggota(nip) as guruType;

        // if (cariGuru.nip) {
        //     throw new Error("NIP sudah terdaftar!")
        // }

        const result = await prisma.guru.create({
            data: {
              nip,
              nama,
              jenisKelamin,
              kontak,
              alamat,
            },
          });

          return result;
      
        
    }


    static async tambahBanyakAnggota(dataGuru : guruType[]) : Promise<guruType[]> {
        const result = await prisma.guru.createManyAndReturn({
            data : dataGuru
        })
        return result;
    }

    static async cariAnggota (nip : string) : Promise<guruType | undefined | null> {
 
            const guru = await prisma.guru.findUnique({
                where : {
                    nip
                }
            }) as guruType
    
            if (!guru?.nip) {
                throw ({message : "Data guru tidak ditemukan"})
            }

            return guru;

}
    static async ambilSemuaDataGuru () : Promise<guruType[]> {
        const guru = await prisma.guru.findMany({}) as guruType[]

        return guru;
    }

    static async perbaruiAnggota(nip : string, data : perbaruiAnggotaType) :Promise<guruType> {
        const {nama, jenisKelamin, kontak, alamat} = data;

        let guru = await Guru.cariAnggota(nip) as guruType;

        if (!guru?.nip) {
            throw new Error("Data kelas tidak ditemukan")
        }

        const result = await prisma.guru.update({
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

        return result;


    }

    static async hapusAnggota(nip : string) : Promise<void> {
        const guru = await prisma.guru.delete({
            where : {
                nip
            }
        })

        if (!guru?.nip) {
            throw NextResponse.json({message : "Data guru tidak ditemukan"}, {status : 502})
        }
    }

    static async hapusSemuaAnggota() : Promise<void> {
        await prisma.guru.deleteMany({})
    }
    
}
