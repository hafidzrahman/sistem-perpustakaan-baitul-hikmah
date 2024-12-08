import { peminjamanType, peminjamType, prisma } from "@/lib";
import { NextResponse } from "next/server";
import {Buku} from "@/app/class/buku"

export class Peminjaman {
    id? : number;
    nis? : string;
    nip? : string;
    tanggalPinjam? : Date;
    keterangan? : string;

    constructor(req? : Request) {
        req?.json().then((data : peminjamanType) => {
            this.id = data.id;
            this.nis = data.nis;
            this.nip = data.nip;
            this.tanggalPinjam = data.tanggalPinjam;
            this.keterangan = data.keterangan;
        })
    }


    async tambahPeminjaman(dataPeminjam : peminjamType, idBuku : {isbn : string, id : number}) : Promise<void> {
        const buku = new Buku();
        const {nis, nip, keterangan, tenggatWaktu} = dataPeminjam;

        if (!nis || !nip) {
            throw new Error("Harus mengisi field yang wajib")
        }

        const dataBuku = await buku.cariEksemplarBuku(idBuku); 

        if (!dataBuku?.bukuISBN) {
            throw new Error("Gagal mendapatkan data buku")
        }

        const peminjaman = await prisma.peminjaman.create({
            data: {
                nis,
                nip,
                keterangan,
            }
          });

        // default peminjaman seminggu, bisa diatur sesuai dengan keinginan petugas perpustakaan
        const date = new Date();
        const deadline = tenggatWaktu || new Date(date.getTime() + 8 * 24 * 60 * 60 * 1000);

        const dataBukuPinjaman = await prisma.bukuPinjaman.create({
            data : {
                idPeminjaman : peminjaman.id,
                bukuISBN : dataBuku.bukuISBN,
                bukuId : dataBuku.id,
                tenggatWaktu : deadline
            }
        })

        setTimeout(setDenda, deadline.getTime())


        async function setDenda() {
            const bukuPinjaman = await prisma.bukuPinjaman.findUnique({
                where : {
                    idPeminjaman_bukuISBN_bukuId : {
                        idPeminjaman : peminjaman.id,
                        bukuISBN : dataBuku!.bukuISBN,
                        bukuId : dataBuku!.id,
                    }
                }
            })

            if (!bukuPinjaman?.tanggalKembali) {

            const dataSumbangan = await prisma.sumbangan.create({
                data : {
                    idKeterangan : 1,
                    nis,
                    nip,
                    berlebih : false
                }
            })
            await prisma.denda.create({
                data : {
                idSumbangan : dataSumbangan.id,
                bukuISBN : dataBukuPinjaman.bukuISBN,
                idPeminjaman : dataBukuPinjaman.idPeminjaman,
                bukuId : dataBukuPinjaman.bukuId,
            }
            })
        }
        }

    }

    async konfirmasiPengembalian(idPeminjaman : number, idBuku : {isbn : string, id : number}) {
        const buku = new Buku();
        const dataBuku = await buku.cariEksemplarBuku(idBuku)

        if (!dataBuku?.bukuISBN) {
            throw new Error("Data buku tidak ditemukan.");
        }

        const dataPeminjaman = await prisma.peminjaman.findUnique({
            where : {
                id : idPeminjaman
            }
        });

        if (!dataPeminjaman?.id) {
            throw new Error("Data peminjaman tidak ditemukan.");
        }
        
        await prisma.bukuPinjaman.update({
            data : {
                tanggalKembali : new Date()
            },
            where : {
                idPeminjaman_bukuISBN_bukuId : {
                    idPeminjaman : idPeminjaman,
                    bukuId : idBuku.id,
                    bukuISBN : idBuku.isbn
                }
            }
        })
    }

    async tambahBanyakPeminjaman(datapeminjaman : Omit<peminjamanType, 'id'>[]) : Promise<void> {
        await prisma.peminjaman.createMany({
            data : datapeminjaman
        })
    }

    async cariPeminjaman (id? : number) : Promise<peminjamanType | peminjamanType[]> {
        let peminjaman : peminjamanType | peminjamanType[] = []; 

        if (id) {    
            peminjaman = await prisma.peminjaman.findUnique({
                where : {
                    id
                }
            }) as peminjamanType
    
            if (!peminjaman?.id) {
                throw ({message : "Data peminjaman tidak ditemukan"})
            }

            return peminjaman;
    } 

        peminjaman = await prisma.peminjaman.findMany({}) as peminjamanType[]

        return peminjaman;

}

    async perbaruiPeminjaman(id : number, dataPeminjaman : Omit<peminjamanType, 'id' | 'tanggalPinjam'>) :Promise<void> {

        // tanggal pinjam boleh diperbarui?
        const {nis, nip, keterangan} = dataPeminjaman;

        let peminjaman = await this.cariPeminjaman(id) as peminjamanType;

        if (!peminjaman?.id) {
            throw ({message : "Data peminjaman tidak ditemukan"})
        }

        await prisma.peminjaman.update({
            data : {
                nis : nis || peminjaman.nis,
                nip : nip || peminjaman.nip,
                tanggalPinjam : peminjaman.tanggalPinjam,
                keterangan : keterangan || peminjaman.keterangan
            },
            where : {
                id
            }
        })


    }

    async perbaruiTenggatWaktuPeminjaman(idPeminjaman : number, idBuku : {isbn : string, id : number}, tenggatWaktu : Date) {
        await prisma.bukuPinjaman.update({
            data : {
               tenggatWaktu 
            }, where : {
                idPeminjaman_bukuISBN_bukuId : {
                    idPeminjaman,
                    bukuISBN : idBuku.isbn,
                    bukuId : idBuku.id
                }
            }
        })
    }

    async hapusPeminjaman(id : number) : Promise<void> {
        const peminjaman = await prisma.peminjaman.delete({
            where : {
                id
            }
        })

        if (!peminjaman?.id) {
            throw NextResponse.json({message : "Data peminjaman tidak ditemukan"}, {status : 502})
        }
    }

    async hapusSemuaPeminjaman() : Promise<void> {
        await prisma.peminjaman.deleteMany({}) 
    }

}

export const peminjaman = new Peminjaman();