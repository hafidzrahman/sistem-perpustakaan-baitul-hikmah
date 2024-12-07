import {Prisma, PrismaClient} from '@prisma/client';
import { JenisKelamin, Genre } from "@prisma/client";
import { NextResponse } from 'next/server';

interface Hash {
    [indexer : string] : number
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
    idKelas : number,
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


export type bukuType = {
    id : number,
    judul : string,
    penulis? : string[] | number[],
    genre : Genre[],
    isbn : string,
    linkGambar? : string,
    sinopsis? : string,
    penerbit? : string | number, 
    halaman? : number, 
    tanggalRusak?: Date, 
    tanggalHilang? : Date, 
    posisi? : string 
}

export type penulisType = {
    id : number,
    nama : string
}

export type perbaruiBukuType = {
    judul? : string,
    penulis? : string[] | number[],
    genre? : Genre[],
    isbn? : string,
    linkGambar? : string,
    sinopsis? : string,
    penerbit? : string | number, 
    halaman? : number, 
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

interface Anggota<T,> {
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

const prisma = new PrismaClient();

export class Murid implements Anggota<muridType>{
    nis? : string;
    nama? : string;
    idKelas? : number;
    jenisKelamin? : JenisKelamin;
    kontak? : string;
    alamat? : string;

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

    async tambahAnggota(dataMurid : muridType) : Promise<void> {
        const {nis, nama, jenisKelamin, idKelas, kontak, alamat} = dataMurid;

        if (!nis || !nama || !jenisKelamin || !idKelas || !kontak) {
            throw new Error("Harus mengisi field yang wajib")
        }

        await prisma.murid.create({
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
        
    }

    async tambahBanyakAnggota(dataMurid : muridType[]) : Promise<void> {
          const date = new Date();
          const month = date.getMonth();
          const year = date.getFullYear();

          await prisma.riwayatKelas.deleteMany({});
        //   await prisma.kelas.deleteMany({});
          await prisma.murid.deleteMany({})
        
          const data : Omit<muridType, 'idKelas'>[] = dataMurid.map(m => {
            
            if (!m.nis || !m.nama || !m.jenisKelamin || !m.kontak) {
                throw new Error("Harus mengisi field yang wajib")
            }
            
            
            return ({
            nis : m.nis,
            nama : m.nama,
            jenisKelamin : m.jenisKelamin,
            kontak : m.kontak,
            alamat : m.alamat
          })})

        await prisma.murid.createMany({
            data : data as Omit<muridType, 'idKelas'>[]
        })

          async function connectToRiwayatKelas(m : muridType) {
            
            if (!m.idKelas) {
                throw new Error("Harus mengisi field yang wajib")
            }
            await prisma.riwayatKelas.create({
                data : {
                  idKelas : m.idKelas,
                  muridNIS : m.nis,
                  tahunAjaran : (month > 6 ? `${year}/${year+1}` : `${year-1}/${year}`)
                },
              })
          }

          for await (const data of dataMurid) {
            await connectToRiwayatKelas(data);
          }
    }

    async cariAnggota (nis? : string) : Promise<muridType | muridType[]> {
        let murid : muridType | muridType[] = []; 

        if (nis) {    
            murid = await prisma.murid.findUnique({
                where : {
                    nis
                }
            }) as muridType;
    
            if (!murid?.nis) {
                throw new Error("Data murid tidak ditemukan")
            }

            return murid;
    } 

        murid = await prisma.murid.findMany({}) as muridType[];

        return murid;

}

    async perbaruiAnggota(nis : string, data : perbaruiAnggotaType) :Promise<void> {
        const {nama, jenisKelamin, kontak, alamat, idKelas} = data;

        let murid = await this.cariAnggota(nis) as muridType

        if (!murid?.nis) {
            throw ({message : "Data kelas tidak ditemukan"})
        }

        await prisma.murid.update({
            data : {
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


        await prisma.riwayatKelas.create({
            data : {
                muridNIS : nis,
                idKelas : idKelas,
                tahunAjaran : (month > 6 ? `${year}/${year+1}` : `${year-1}/${year}`)
            }
        })

    }

    async hapusAnggota(nis : string) : Promise<void> {
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

export class Keterangan{
    id? : number;
    keterangan? : string;
    jumlahBuku? : number;
    totalNominal? : number;
    nominalPerHari? : number

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

    async tambahKeterangan(dataKeterangan : Omit<keteranganType, 'id'>) : Promise<void> {
        const {keterangan, jumlahBuku, totalNominal, nominalPerHari} = dataKeterangan;
        

        if (!keterangan) {
            throw new Error("Harus mengisi field yang wajib")
        }

        await prisma.keterangan.create({
            data: {
              keterangan,
              jumlahBuku,
              totalNominal,
              nominalPerHari
            },
          });
    }

    async tambahBanyakKeterangan(dataKeterangan : Omit<keteranganType, 'id'>[]) : Promise<void> {
        await prisma.keterangan.createMany({
            data : dataKeterangan
        })
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

    async perbaruiKeterangan(id : number, dataKeterangan : Omit<keteranganType, 'id'>) :Promise<void> {
        const {keterangan : deskripsi, jumlahBuku, totalNominal, nominalPerHari} = dataKeterangan;

        const keterangan = await this.cariKeterangan(id) as keteranganType;

        if (!keterangan?.id) {
            throw new Error("Data keterangan tidak ditemukan")
        }

        await prisma.keterangan.update({
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

export class Buku{
    id? : number;
    judul? : string;
    penulis? : string[] | number[];
    genre? : Genre[];
    isbn? : string;
    linkGambar? : string;
    sinopsis? : string;
    penerbit? : string | number; 
    halaman? : number; 
    tanggalRusak?: Date; 
    tanggalHilang? : Date; 
    posisi? : string;

    constructor(req? : Request) {
        req?.json().then((data : bukuType) => {
            this.id = data.id;
            this.judul = data.judul;
            this.penulis = data.penulis;
            this.genre = data.genre;
            this.isbn = data.isbn;
            this.linkGambar = data.linkGambar;
            this.sinopsis = data.sinopsis;
            this.penerbit = data.penerbit; 
            this.halaman = data.halaman; 
            this.tanggalRusak =  data.tanggalRusak; 
            this.tanggalHilang =  data.tanggalHilang; 
            this.posisi =  data.posisi;
        })
    }

    async tambahBuku(dataBuku : Omit<bukuType, 'id'>) : Promise<void> {
        const { judul, genre, isbn, linkGambar, sinopsis, halaman, tanggalRusak, tanggalHilang, posisi } = dataBuku;
        let {penulis, penerbit} = dataBuku;
        
        if (!isbn || !judul || !penulis || !genre || !penerbit ) {
            throw new Error("Harus mengisi field yang wajib")
        }

        // jika data penulis yang dimasukkan adalah array string, pasti data belum ada di drop down menu
        // jika data penulis yang dimasukkan adalah array number, pasti data sudah ada di drop down menu,
        if (typeof penulis[0] !== "number") {
            penulis = (await konversiDataKeId(penulis as string[])) as number[];
        }


        // jika data penerbit yang dimasukkan adalah string, pasti data belum ada di drop down menu
        // jika data penerbit yang dimasukkan adalah number, pasti data sudah ada di drop down menu,
        if (typeof penerbit !== "number") {
            penerbit = (await konversiDataKeId(penerbit as string)) as number;
        }

        // Hitung jumlah ISBN yang sama, id buku baru = jumlah ISBN yang sama + 1 
        const count = await prisma.buku.count({
            where : {
                isbn : {
                    equals : isbn,                
                }
            },
        })
        
        const dataBukuBaru = await prisma.buku.create({
            data: {
              id : count + 1,
              isbn,
              idPenerbit : penerbit as number,
              judul,
              genre,
              halaman,
              sinopsis,
              tanggalHilang,
              tanggalRusak,
              linkGambar,
              posisi
            },
          });

          // array number yang berisi id penulis diolah dengan "map" agar array berisi objek "Penulis Buku"
          await prisma.penulisBuku.createMany({
            data : (penulis as number[]).map((id) => ({
                idPenulis : id,
                bukuISBN : dataBukuBaru.isbn,
                bukuId : dataBukuBaru.id
            }))
          })
      
        
    }

    async tambahBanyakBuku(dataBuku : Omit<bukuType, 'id'>[]) {
        const map : Hash = {}

        const data  = await Promise.all(dataBuku.map(isbnCounter))

        await prisma.buku.createMany({
            data : data
        })

        // Hitung jumlah ISBN yang sama, id buku baru = jumlah ISBN yang sama + 1 
        async function isbnCounter(data : Omit<bukuType, 'id'>) : Promise<Prisma.BukuCreateManyInput> {
            const { judul, genre, isbn, linkGambar, sinopsis, halaman, tanggalRusak, tanggalHilang, posisi } = data;
            let {penulis, penerbit} = data;

            if (!isbn || !judul || !penulis || !genre || !penerbit ) {
                throw new Error("Harus mengisi field yang wajib")
            }


            if (typeof penulis[0] !== "number") {
                penulis = (await konversiDataKeId(penulis as string[])) as number[];
            }

            if (typeof penerbit !== "number") {
                penerbit = (await konversiDataKeId(penerbit as string)) as number;
            }

            let result = 0;
            
            if (!map[isbn]) {
            result = await prisma.buku.count({
                where : {
                    isbn : {
                        equals : isbn
                    }
                }
            });
        }

            map[isbn] = Math.max(map[isbn] || 0, result);
            ++map[isbn];

            return {
                id : map[isbn],
                isbn,
                judul,
                linkGambar,
                idPenerbit : penerbit as number,
                sinopsis,
                genre,
                halaman,
                tanggalRusak,
                tanggalHilang,
                posisi
            }
        }

    }

    async cariBuku (isbn? : string, id? : number) : Promise<bukuType | bukuType[]> {
        let buku : bukuType | bukuType[] = []; 

        if (isbn && id) {    
            buku = await prisma.buku.findUnique({
                where : {
                    isbn_id : {
                        isbn,
                        id
                    }
                }
            }) as bukuType

            if (!buku?.isbn || !buku?.id) {
                throw ({message : "Data buku tidak ditemukan"})
            }
            return buku;
    } 
        buku = await prisma.buku.findMany({}) as bukuType[]

        return buku;

}

    async perbaruiBuku(isbn : string, id : number, dataBuku : perbaruiBukuType) :Promise<void> {
        const { judul, genre, isbn : bukuISBN, linkGambar, sinopsis, halaman, tanggalRusak, tanggalHilang, posisi } = dataBuku;
        let {penulis, penerbit} = dataBuku;

        let buku = await this.cariBuku(isbn, id) as Prisma.BukuCreateManyInput;

        if (!buku?.id) {
            throw new Error("Data buku tidak ditemukan");
        }

        if (penulis && typeof penulis[0] !== "number") {
            penulis = (await konversiDataKeId(penulis as string[])) as number[];
        }

        if (penerbit && typeof penerbit !== "number") {
            penerbit = (await konversiDataKeId(penerbit as string)) as number;
        }



        await prisma.buku.update({
            data : {
                judul : judul || buku.judul, 
                genre : genre || buku.genre, 
                isbn : bukuISBN || buku.isbn, 
                linkGambar : linkGambar || buku.linkGambar, 
                sinopsis : sinopsis || buku.sinopsis, 
                idPenerbit : penerbit as number || buku.idPenerbit, 
                halaman : halaman || buku.halaman, 
                tanggalRusak : tanggalRusak || buku.tanggalRusak, 
                tanggalHilang : tanggalHilang || buku.tanggalHilang, 
                posisi : posisi || buku.posisi
            },
            where : {
                isbn_id : {
                    isbn,
                    id
                }
            }
        })


    }

    async hapusBuku(isbn : string, id : number) : Promise<void> {
        const buku = await prisma.buku.delete({
            where : {
                isbn_id : {
                    isbn,
                    id
                }
            }
        })

        if (!buku?.isbn || !buku?.id) {
            throw NextResponse.json({message : "Data buku tidak ditemukan"}, {status : 502})
        }
    }

    async hapusSemuaBuku() : Promise<void> {
        await prisma.buku.deleteMany({})
    }
    
}


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

        const dataBuku = await buku.cariBuku(idBuku.isbn, idBuku.id) as bukuType;

        if (!dataBuku?.isbn || !dataBuku?.id) {
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
                bukuISBN : dataBuku.isbn,
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
                        bukuISBN : dataBuku.isbn,
                        bukuId : dataBuku.id
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
        const dataBuku = await buku.cariBuku(idBuku.isbn, idBuku.id) as bukuType;

        if (!dataBuku?.isbn || !dataBuku?.id) {
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

async function konversiDataKeId(data : string | string[]) : Promise<number | number[]> {

    // jika data penulis yang dimasukkan adalah array string, pasti data belum ada di drop down menu
    if ((typeof (data as string[])) === "object") {
        return (await prisma.penulis.createManyAndReturn({
            data : (data as string[]).map((nama) => ({nama}))
        })).map(({id}) => id) as number[];
} 

    // jika data penerbit yang dimasukkan adalah string, pasti data belum ada di drop down menu
    return (await prisma.penerbit.create({
        data : {
            nama : (data as string)
        }
    })).id
}

export const buku = new Buku()
export const guru = new Guru();
export const kelas = new Kelas();
export const murid = new Murid();
export const keterangan = new Keterangan();




// export class MasterTable<T,> {
//     tableName : string;
//     static prisma = new PrismaClient();
    
//     public constructor(tableName : string) {
//         this.tableName = tableName;

//     }

//     public async create(newData : T) : Promise<T | string> {
//         const {tableName} = this;
//         let data : T | string = `Gagal menambahkan data ${tableName}`
//         try {
            
//         if (tableName === "kelas") {
//             data = await MasterTable.prisma[tableName].create({
//             data : newData as kelasType
//         }) as T;
//     }
//         else if (tableName === "buku") {
//             data = await MasterTable.prisma.buku.create({
//                 data : newData as bukuType
//             }) as T;  
//         }
//         else if (tableName === "murid") {
//             data = await MasterTable.prisma.murid.create({
//                 data : newData as muridType
//             }) as T;  
//         }
//         else if (tableName === "guru") {
//             data = await MasterTable.prisma.guru.create({
//                 data : newData as guruType
//             }) as T;  
//         }
//     }

//     catch (e) {
//         throw Error("Something went Wrong")
//     }

        
//         return data;
//     }

//     // read

//     public async put(newData : T, id : string, isbn? : string) : Promise <T | string> {
//         const {tableName} = this;
//         let data : T | string = `Gagal mengubah data ${tableName}`
//         try {
//         if (tableName === "kelas") {
//             data = await MasterTable.prisma.kelas.update({
//             data : newData as kelasType,
//             where : {
//                 id
//             }
//         }) as T;
//     }
//         else if (tableName === "buku") {
//             data = await MasterTable.prisma.buku.update({
//                 data : newData as bukuType,
//                 where : {
//                     isbn_id : {
//                         isbn : isbn!,
//                         id : parseInt(id)
//                     }
//                 }
//             }) as T;  
//         }
//         else if (tableName === "murid") {
//             data = await MasterTable.prisma.murid.update({
//                 data : newData as muridType,
//                 where : {
//                     nis : id
//                 }
//             }) as T;  
//         }
//         else if (tableName === "guru") {
//             data = await MasterTable.prisma.guru.update({
//                 data : newData as guruType,
//                 where : {
//                     nip : id
//                 }
//             }) as T;  
//         }
//     }

//     catch (e) {
//         throw Error("Something went Wrong")
//     }

        
//         return data;
//     }

//     public async delete(id : string, isbn? : string) : Promise <T | string>  {
//         const {tableName} = this;
//         let data : T | string = `Gagal mengubah data ${tableName}`
//         try {
//         if (tableName === "kelas") {
//             data = await MasterTable.prisma.kelas.delete({
//             where : {
//                 id
//             }
//         }) as T;
//     }
//         else if (tableName === "buku") {
//             data = await MasterTable.prisma.buku.delete({
//                 where : {
//                     isbn_id : {
//                         isbn : isbn!,
//                         id : parseInt(id)
//                     }
//                 }
//             }) as T;  
//         }
//         else if (tableName === "murid") {
//             data = await MasterTable.prisma.murid.delete({
//                 where : {
//                     nis : id
//                 }
//             }) as T;  
//         }
//         else if (tableName === "guru") {
//             data = await MasterTable.prisma.guru.delete({
//                 where : {
//                     nip : id
//                 }
//             }) as T;  
//         }
//     }

//     catch (e) {
//         throw Error("Something went Wrong")
//     }

        
//         return data;
//     }

//     public async createMany(newData : T[]) : Promise <T[] | string>  {
//         const {tableName} = this;
//         let data : T | string = `Sukses menambahkan data pada ${tableName}`
//         try {
//         if (tableName === "kelas") {
//             await MasterTable.prisma.kelas.createMany({
//             data : newData as kelasType[]
//         }) as T;
//     }
//         else if (tableName === "buku") {
//             await MasterTable.prisma.buku.createMany({
//                 data : newData as bukuType[]
//             }) as T;  
//         }
//         else if (tableName === "murid") {
//             await MasterTable.prisma.murid.createMany({
//                 data : newData as muridType[]
//             }) as T;  
//         }
//         else if (tableName === "guru") {
//             await MasterTable.prisma.guru.createMany({
//                 data : newData as guruType[]
//             }) as T;  
//         }
//     }

//     catch (e) {
//         throw Error(`Gagal menambahkan data ${tableName}`)
//     }

        
//         return data;
//     }

// }
