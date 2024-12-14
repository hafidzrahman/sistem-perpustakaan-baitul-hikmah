import {bukuType, cariBukuType, Hash, eksemplarBukuType, perbaruiBukuType, prisma, konversiDataKeId, penulisType, genreType, penerbitType, tambahBukuType, eksemplarDenganBukuType} from '@/lib'
import { NextResponse } from 'next/server';


export class Buku{
    judul? : string;
    penulis? : string[] | number[] | penulisType[];
    genre? : string[] | number[] | genreType[];
    isbn? : string | null;
    linkGambar? : string | null;
    sinopsis? : string | null;
    penerbit? : string | number | penerbitType | null; 
    halaman? : number | null;
    tanggalMasuk? : Date | null;
    tanggalRusak?: Date | null; 
    tanggalHilang? : Date | null; 
    posisi? : string | null;

    constructor(req? : Request) {
        req?.json().then((data : bukuType) => {
            this.judul = data.judul;
            this.penulis = data.penulis;
            this.genre = data.genre;
            this.isbn = data.isbn;
            this.linkGambar = data.linkGambar;
            this.sinopsis = data.sinopsis;
            this.penerbit = data.penerbit; 
            this.halaman = data.halaman; 
            this.tanggalMasuk = data.tanggalMasuk;
            this.tanggalRusak =  data.tanggalRusak; 
            this.tanggalHilang =  data.tanggalHilang; 
            this.posisi =  data.posisi;
        })
    }

    async tambahBuku(dataBuku: tambahBukuType) : Promise<eksemplarDenganBukuType> {
        const { judul, isbn, linkGambar, sinopsis, halaman, tanggalMasuk, tanggalRusak, tanggalHilang, posisi } = dataBuku;
        let {penulis, penerbit, genre} = dataBuku;
        
        if (!isbn || !judul  || !genre ) {
            throw new Error("Harus mengisi field yang wajib")
        }

        // jika data penulis yang dimasukkan adalah array number, pasti data sudah ada di drop down menu,
        if (penulis && typeof penulis[0] !== "number") {
            penulis = (await konversiDataKeId("penulis", penulis as string[])) as number[];
        }

        // jika data penerbit yang dimasukkan adalah number, pasti data sudah ada di drop down menu,
        if (penerbit && typeof penerbit !== "number") {
            penerbit = (await konversiDataKeId("penerbit", penerbit as string)) as number;
        }

        if (genre && typeof genre[0] !== "number") {
            genre = (await konversiDataKeId("genre", genre as string[])) as number[];
        }

        // Hitung jumlah ISBN yang sama, id buku baru = jumlah ISBN yang sama + 1 
        const count = await prisma.eksemplarBuku.count({
            where : {
                bukuISBN : isbn
            }
            },
        )
        if (count === 0) {
        await prisma.buku.create({
            data: {
              isbn,
              judul,
              halaman,
              sinopsis,
              linkGambar,
              penerbit : penerbit as number,
              penulis : {
                connect : (penulis as number[]).map(id => ({id}))
              },
              genre : {
                connect : (genre as number[]).map(id => ({id}))
              }
            },

          });
        }

        const result =  await prisma.eksemplarBuku.create({
            data : {
                id : count + 1,
                tanggalMasuk,
                tanggalRusak,
                tanggalHilang,
                posisi,
                bukuISBN : isbn
            },
            include : {
                buku : {
                    include : {
                        penulis : true,
                        genre : true,
                    }
                }
            }
          })
      
        return result;
    }

    async tambahBanyakBuku(dataBuku : (bukuType & eksemplarBukuType)[]) : Promise<void> {
        const map : Hash<number> = {}

        // await Promise.all(dataBuku.map(isbnCounter))

        for await (const d of dataBuku) {
            await isbnCounter(d)
        }

        // Hitung jumlah ISBN yang sama
        // id buku baru = jumlah ISBN yang sama + 1 
        async function isbnCounter(data : bukuType) : Promise<void> {
            const { judul, isbn, linkGambar, sinopsis, halaman, tanggalMasuk, tanggalRusak, tanggalHilang, posisi } = data;
            let {penulis, penerbit, genre} = data;

            if (!isbn || !judul || !genre ) {
                throw new Error("Harus mengisi field yang wajib")
            }


            if (penulis && typeof penulis[0] !== "number") {
                penulis = (await konversiDataKeId("penulis", penulis as string[])) as number[];
            }

            if (penerbit && typeof penerbit !== "number") {
                penerbit = (await konversiDataKeId("penerbit", penerbit as string)) as number;
            }

            if (genre && typeof genre[0] !== "number") {
                genre = (await konversiDataKeId("genre", genre as string[])) as number[];
            }

            let result = 0;
            
            if (!map[isbn]) {
            result = await prisma.eksemplarBuku.count({
                where : {
                    bukuISBN : isbn
                }
            });
            if (result === 0) {
                await prisma.buku.create({
                    data : {
                        isbn,
                        judul,
                        linkGambar,
                        sinopsis,
                        halaman,
                        penerbit : penerbit as number,
                        penulis : {
                            connect : (penulis as number[]).map(id => ({id}))
                        },
                        genre: {
                            connect : (genre as number[]).map(id => ({id}))
                        }
                    }
                })
            }
        }

            map[isbn] = Math.max(map[isbn] || 0, result);
            ++map[isbn];

            await prisma.eksemplarBuku.create({
                data : {
                    id : map[isbn],
                    tanggalMasuk,
                    tanggalRusak,
                    tanggalHilang,
                    posisi,
                    buku : {
                        connect :  {
                            isbn : isbn
                        }
                    },
                }
            })

        

    }

}

    async cariBuku (isbn? : string) : Promise<bukuType  | bukuType[] | undefined> {
        if (isbn) {    
            const buku = await prisma.buku.findUnique({
                where : {
                    isbn : isbn
                },
                include : {
                        _count : {
                            select : {
                                eksemplarBuku : {
                                    where : {
                                        bukuISBN : isbn
                                    }
                                }
                            }
                        },
                        penulis : true,
                        genre : true,
                        penerbitDetails : true
                    }
            })

            if (!buku?.isbn) {
                throw ({message : "Data buku tidak ditemukan"})
            }
            return buku as bukuType;
    } 

        const buku = await prisma.buku.findMany({
            include : {
                _count : {
                    select : {
                        eksemplarBuku : {
                            where : {
                                bukuPinjaman : {
                                    every : {
                                        tanggalKembali : {
                                            equals : undefined
                                        }
                                    }
                                    }
                            }
                        }
                    }
                },
                penulis : true,
                genre : true,
                penerbitDetails : true
            }
        })

        return buku as bukuType[];
        
}

    async cariEksemplarBuku(idBuku : {isbn : string, id : number}) : Promise<eksemplarBukuType> {
        const dataBuku = await prisma.eksemplarBuku.findUnique({
            where : {
                bukuISBN_id : {
                    bukuISBN : idBuku.isbn,
                    id : idBuku.id
                }
            },
            include : {
                buku : {
                    select : {
                        genre : true,
                        penulis : true,
                        penerbitDetails : true
                    }
                }
            }
        })
        if (!dataBuku?.bukuISBN) {
            throw new Error("Data buku tidak ditemukan")
        }

        return dataBuku;
    }

    async perbaruiBuku(isbn : string, dataBuku : perbaruiBukuType) :Promise<void> {
        const { judul, isbn : bukuISBN, linkGambar, sinopsis, halaman } = dataBuku;
        let {penulis, penerbit, genre} = dataBuku;

        let buku = await this.cariBuku(isbn) as bukuType;

        if (!buku?.isbn) {
            throw new Error("Data buku tidak ditemukan");
        }
        if (penulis && typeof penulis[0] !== "number") {
            penulis = (await konversiDataKeId("penulis", penulis as string[])) as number[];
        }

        if (penerbit && typeof penerbit !== "number") {
            penerbit = (await konversiDataKeId("penerbit", penerbit as string)) as number;
        }

        if (genre && typeof genre[0] !== "number") {
            genre = (await konversiDataKeId("genre", genre as string[])) as number[];
        }



        await prisma.buku.update({
            data : {
                judul : judul || buku.judul, 
                linkGambar : linkGambar || buku.linkGambar, 
                sinopsis : sinopsis || buku.sinopsis, 
                penerbit : (penerbit || buku.penerbit) as number, 
                halaman : halaman || buku.halaman,
                genre : {
                    set : (genre?.map(id => ({id})) || buku.genre.map(id => ({id}))) as {id : number}[]
                },
                penulis : {
                    set : (penulis?.map(id => ({id})) || buku.penulis?.map(id => ({id}))) as {id : number}[]
                }
            },
            where : {
                isbn
            }
        })


    }

    async hapusBuku(isbn : string) : Promise<void> {
        await prisma.eksemplarBuku.deleteMany({
            where : {
                bukuISBN : isbn
            }
        })
        const buku = await prisma.buku.delete({
            where : {
                isbn
            }
        })

        if (!buku?.isbn) {
            throw NextResponse.json({message : "Data buku tidak ditemukan"}, {status : 502})
        }
    }

    async hapusSemuaBuku() : Promise<void> {
        await prisma.eksemplarBuku.deleteMany({});
        await prisma.buku.deleteMany({});
    }
    
}

export const buku = new Buku()