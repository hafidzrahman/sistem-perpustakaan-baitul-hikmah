import {PrismaClient} from '@prisma/client';
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
    idKelas : string,
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
    idKelas : string
}

export type perbaruiKelasType = {
    nama? : string,
    tingkat? : number
}

export type kelasType = {
    id : string,
    nama : string,
    tingkat : number
}


export type bukuType = {
    id : number,
    judul : string,
    penulis : string[],
    genre : Genre[],
    isbn : string,
    linkGambar? : string,
    sinopsis? : string,
    penerbit? : string, 
    halaman? : number, 
    tanggalRusak?: Date, 
    tanggalHilang? : Date, 
    posisi? : string 
}

export type perbaruiBukuType = {
    judul? : string,
    penulis? : string[],
    genre? : Genre[],
    isbn? : string,
    linkGambar? : string,
    sinopsis? : string,
    penerbit? : string, 
    halaman? : number, 
    tanggalRusak?: Date, 
    tanggalHilang? : Date, 
    posisi? : string 
}

export type keteranganType = {
    id : string,
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
    id : string,
    nis? : string,
    nip? : string,
    tanggalPinjam : Date,
    keterangan? : string
}

export type peminjamType = {
    nis? : string,
    nip? : string,
    keterangan? : string
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
    idKelas? : string;
    jenisKelamin? : JenisKelamin;
    kontak? : string;
    alamat? : string;

    constructor(
        nis? : string,
        nama? : string,
        jenisKelamin? : JenisKelamin,
        idKelas? : string,
        kontak? : string,
        alamat? : string) 
        {
        this.nis = nis;
        this.nama = nama;
        this.jenisKelamin = jenisKelamin;
        this.idKelas = idKelas;
        this.kontak = kontak;
        this.alamat = alamat;
    }

    async tambahAnggota(dataMurid : muridType) : Promise<void> {
        const {nis, nama, jenisKelamin, idKelas, kontak, alamat} = dataMurid;

        if (!nis || !nama || jenisKelamin || idKelas || kontak) {
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
            }) as muridType
    
            if (!murid?.nis) {
                throw new Error("Data murid tidak ditemukan")
            }

            return murid;
    } 

        murid = await prisma.murid.findMany({}) as muridType[]

        return murid;

}

    async perbaruiAnggota(nis : string, data : perbaruiAnggotaType) :Promise<void> {
        const {nama, jenisKelamin, kontak, alamat, idKelas} = data;

        let murid = await prisma.murid.findUnique({
            where : {
                nis
            }
        })

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
        })

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
        })

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
    nis? : string;
    nama? : string;
    jenisKelamin? : JenisKelamin;
    kontak? : string;
    alamat? : string;

    constructor(
        nis? : string,
        nama? : string,
        jenisKelamin? : JenisKelamin,
        kontak? : string,
        alamat? : string) 
        {
        this.nis = nis;
        this.nama = nama;
        this.jenisKelamin = jenisKelamin;
        this.kontak = kontak;
        this.alamat = alamat;
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

        let guru = await prisma.guru.findUnique({
            where : {
                nip
            }
        })

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
    tingkat? : string;

    constructor(
        nama? : string,
        tingkat? : string
    ) 
        {
        this.nama = nama;
        this.tingkat = tingkat;
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

    async cariKelas (id? : string) : Promise<kelasType | kelasType[]> {
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

    async perbaruiKelas(id : string, data : perbaruiKelasType) :Promise<void> {
        const {nama, tingkat} = data;

        let kelas = await prisma.kelas.findUnique({
            where : {
                id
            }
        })

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

    async hapusKelas(id : string) : Promise<void> {
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
    keterangan? : string;
    jumlahBuku? : number;
    totalNominal? : number;
    nominalPerHari? : number

    constructor(
        keterangan? : string,
        jumlahBuku? : number,
        totalNominal? : number,
        nominalPerHari? : number
    ) 
        {
        this.keterangan = keterangan;
        this.jumlahBuku  = jumlahBuku;
        this.totalNominal =  totalNominal;
        this.nominalPerHari = nominalPerHari;
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

    async cariKeterangan (id? : string) : Promise<keteranganType | keteranganType[]> {
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

    async perbaruiKeterangan(id : string, dataKeterangan : Omit<keteranganType, 'id'>) :Promise<void> {
        const {keterangan : deskripsi, jumlahBuku, totalNominal, nominalPerHari} = dataKeterangan;

        if (!deskripsi) {
            throw new Error("Harus mengisi field yang wajib")
        }

        const keterangan = await this.cariKeterangan(id) as keteranganType;

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

    async hapusKeterangan(id : string) : Promise<void> {
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
    nama? : string;
    tingkat? : string;

    constructor(
        nama? : string,
        tingkat? : string
    ) 
        {
        this.nama = nama;
        this.tingkat = tingkat;
    }

    async tambahBuku(dataBuku : Omit<bukuType, 'id'>) : Promise<void> {
        const { judul, penulis, genre, isbn, linkGambar, sinopsis, penerbit, halaman, tanggalRusak, tanggalHilang, posisi } = dataBuku;
        
        if (!isbn || !judul || penulis || genre || penerbit ) {
            throw new Error("Harus mengisi field yang wajib")
        }

        const count = await prisma.buku.count({
            where : {
                isbn : {
                    equals : isbn,                
                }
            },
        })
        
        await prisma.buku.create({
            data: {
              id : count + 1,
              isbn,
              judul, 
              penulis,
              genre,
              penerbit,
              halaman,
              sinopsis,
              tanggalHilang,
              tanggalRusak,
              linkGambar,
              posisi
            },
          });
      
        
    }

    async tambahBanyakBuku(dataBuku : Omit<bukuType, 'id'>[]) {
        const map : Hash = {}

        // Hitung jumlah ISBN yang sama, id buku baru = jumlah ISBN yang sama + 1 
        async function isbnCounter(data : Omit<bukuType, 'id'>) {
            const result = await prisma.buku.count({
                where : {
                    isbn : {
                        equals : data.isbn
                    }
                }
            });

            map[data.isbn] = Math.max(map[data.isbn] || 0, result);
            ++map[data.isbn];

            return {
                id : map[data.isbn],
                ...data
            }
        }

        const data : bukuType[] = await Promise.all(dataBuku.map(isbnCounter))


        await prisma.buku.createMany({
            data : data
        })
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
        const { judul, penulis, genre, isbn : bukuISBN, linkGambar, sinopsis, penerbit, halaman, tanggalRusak, tanggalHilang, posisi } = dataBuku;
        

        let buku = await prisma.buku.findUnique({
            where : {
                isbn_id : {
                    isbn,
                    id
                }
            }
        })

        if (!buku?.isbn || !buku?.id) {
            throw ({message : "Data buku tidak ditemukan"})
        }

        await prisma.buku.update({
            data : {
                judul : judul || buku.judul, 
                penulis : penulis || buku.penulis, 
                genre : genre || buku.genre, 
                isbn : bukuISBN || buku.isbn, 
                linkGambar : linkGambar || buku.linkGambar, 
                sinopsis : sinopsis || buku.sinopsis, 
                penerbit : penerbit || buku.penerbit, 
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
    id? : string;
    nis? : string;
    nip? : string;
    tanggalPinjam? : Date;
    keterangan? : string;

    constructor(
        id? : string,
        nis? : string,
        nip? : string,
        tanggalPinjam? : Date,
        keterangan? : string
    ) {
        this.id = id;
        this.nis = nis;
        this.nip = nip;
        this.tanggalPinjam = tanggalPinjam;
        this.keterangan = keterangan;
    }


    async tambahPeminjaman(dataPeminjam : peminjamType, idBuku : {isbn : string, id : number}) : Promise<void> {
        const buku = new Buku();
        const {nis, nip, keterangan} = dataPeminjam;

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
        const deadLine = new Date(date.getTime() + 8 * 24 * 60 * 60 * 1000);

        const dataBukuPinjaman = await prisma.bukuPinjaman.create({
            data : {
                idPeminjaman : peminjaman.id,
                bukuISBN : dataBuku.isbn,
                bukuId : dataBuku.id,
                tenggatWaktu : deadLine
            }
        })


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
                    idKeterangan : "K1",
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


    
        setTimeout(setDenda, deadLine.getTime() / 1000)
    }


    async konfirmasiPengembalian(idPeminjaman : string, idBuku : {isbn : string, id : number}) {
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

    async cariPeminjaman (id? : string) : Promise<peminjamanType | peminjamanType[]> {
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

    async perbaruiPeminjaman(id : string, dataPeminjaman : Omit<peminjamanType, 'id' | 'tanggalPinjam'>) :Promise<void> {

        // tanggal pinjam boleh diperbarui?
        const {nis, nip, keterangan} = dataPeminjaman;

        let peminjaman = await prisma.peminjaman.findUnique({
            where : {
                id
            }
        })

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

    async hapusPeminjaman(id : string) : Promise<void> {
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
