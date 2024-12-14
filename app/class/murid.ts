import { Anggota, kelasType, muridType, perbaruiAnggotaType, prisma } from "@/lib";
import { JenisKelamin } from "@prisma/client";
import { NextResponse } from "next/server";
import { kelas } from "./kelas";

export class Murid implements Anggota<muridType>{
    nis? : string;
    nama? : string;
    idKelas? : number;
    jenisKelamin? : JenisKelamin;
    kontak? : string;
    alamat? : string | null;

    constructor(req? : Request) 
        {
        req?.json().then((data : muridType) => {
        this.nis = data.nis;
        this.nama = data.nama;
        this.jenisKelamin = data.jenisKelamin;
        this.idKelas = data.idKelas;
        this.kontak = data.kontak;
        this.alamat = data.alamat;
        })
    }

    async tambahAnggota(dataMurid : muridType) : Promise<muridType> {
        const {nis, nama, jenisKelamin, idKelas, kontak, alamat} = dataMurid;

        if (!nis || !nama || !jenisKelamin || !idKelas || !kontak) {
            throw new Error("Harus mengisi field yang wajib")
        }

        const cariMurid = await this.cariAnggota(nis) as muridType;
        
        if (cariMurid.nis) {
            throw new Error("NIS sudah terdaftar!")
        }

        const dataKelas = await kelas.cariKelas(idKelas) as kelasType;

        if (!dataKelas?.id) {
            throw new Error("Data kelas tidak ditemukan")
        }

        const result = await prisma.murid.create({
            data: {
              nis,
              nama,
              jenisKelamin,
              kontak,
              alamat,
            },
          });
      
          const date = new Date();
          const month = date.getMonth();
          const year = date.getFullYear();
      
          await prisma.riwayatKelas.create({
            data : {
              idKelas,
              muridNIS : nis,
              tahunAjaran : (month > 6 ? `${year}/${year+1}` : `${year-1}/${year}`)
            }
          })
          
          return result;
        
    }

    async tambahBanyakAnggota(dataMurid : muridType[]) : Promise<muridType[]> {
          const date = new Date();
          const month = date.getMonth();
          const year = date.getFullYear();

        //   await prisma.riwayatKelas.deleteMany({});
        //   await prisma.kelas.deleteMany({});
        //   await prisma.murid.deleteMany({})
        
          const data : Omit<muridType, 'idKelas'>[] = dataMurid.map(pemformatDataMurid)

        const result = await prisma.murid.createManyAndReturn({
            data : data as Omit<muridType, 'idKelas'>[]
        })

        for await (const data of dataMurid) {
            await connectToRiwayatKelas(data);
          }

          function pemformatDataMurid(m : Omit<muridType, 'idKelas'>) {
            
            if (!m.nis || !m.nama || !m.jenisKelamin || !m.kontak) {
                throw new Error("Harus mengisi field yang wajib")
            }
            
            
            return ({
            nis : m.nis,
            nama : m.nama,
            jenisKelamin : m.jenisKelamin,
            kontak : m.kontak,
            alamat : m.alamat
          })}

          async function connectToRiwayatKelas(m : muridType) {
            
            if (!m.idKelas) {
                throw new Error("Harus mengisi field yang wajib")
            }
            
            await prisma.riwayatKelas.create({
                data : {
                  idKelas : m.idKelas,
                  muridNIS : m.nis,
                  tahunAjaran : (month > 6 ? `${year}/${year+1}` : `${year-1}/${year}`),
                },
              })

              
          }

        return result;
    }

    async cariAnggota (nis? : string) : Promise<muridType | muridType[]> {
        let murid : muridType | muridType[] = []; 

        if (nis) {    
            murid = await prisma.murid.findUnique({
                where : {
                    nis
                }, 
                include : {
                    riwayatKelas : {
                        select : {
                            kelas : true,
                        }, orderBy : {
                            kelas : {
                                tingkat : 'desc'
                            }
                        }, 
                        take : 1
                    }
                }
            }) as muridType;
    
            if (!murid?.nis) {
                throw new Error("Data murid tidak ditemukan")
            }

            return murid;
    } 

        murid = await prisma.murid.findMany({
            include : {
                riwayatKelas : {
                    select : {
                        kelas : true,
                    }, orderBy : {
                        kelas : {
                            tingkat : 'desc'
                        }
                    }, 
                    take : 1
                }
            }
        }) as muridType[];

        return murid;

}

    async perbaruiAnggota(nis : string, data : perbaruiAnggotaType) :Promise<muridType> {
        const {nama, jenisKelamin, kontak, alamat, idKelas} = data;

        let murid = await this.cariAnggota(nis) as muridType

        if (!murid?.nis) {
            throw ({message : "Data kelas tidak ditemukan"})
        }

        const result = await prisma.murid.update({
            data : {
                nis,
                nama : nama || murid.nama,
                jenisKelamin : jenisKelamin || murid.jenisKelamin,
                kontak : kontak || murid.kontak,
                alamat : alamat || murid.alamat,
            },
            where : {
                nis
            }
        }) as muridType

        const date = new Date();
        const month = date.getMonth();
        const year = date.getFullYear();

        // kelas sebelumnya tetap ada untuk jadi riwayat
        // id kelas harus undefined jika tidak ingin mengupdate kelas, 
        if (idKelas)
        await prisma.riwayatKelas.create({
            data : {
                muridNIS : nis,
                idKelas : idKelas,
                tahunAjaran : (month > 6 ? `${year}/${year+1}` : `${year-1}/${year}`)
            }
        })

        return result;

    }

    async hapusAnggota(nis : string) : Promise<void> {
        await prisma.riwayatKelas.deleteMany({
            where : {
                muridNIS : nis
            }
        })
        const murid = await prisma.murid.delete({
            where : {
                nis
            }
        }) as muridType;

        if (!murid?.nis) {
            throw NextResponse.json({message : "Data murid tidak ditemukan"}, {status : 502})
        }
    }

    async hapusSemuaAnggota() : Promise<void> {
        await prisma.riwayatKelas.deleteMany({})
        await prisma.murid.deleteMany({})
    }
    
}

export const murid = new Murid()