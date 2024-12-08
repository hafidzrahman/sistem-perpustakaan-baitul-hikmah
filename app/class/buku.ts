import {bukuType, cariBukuType, Hash, eksemplarBukuType, perbaruiBukuType, prisma, konversiDataKeId, penulisType} from '@/lib'
import { Genre, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';


export class Buku{
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

    async tambahBuku(dataBuku : bukuType) : Promise<void> {
        const { judul, genre, isbn, linkGambar, sinopsis, halaman, tanggalRusak, tanggalHilang, posisi } = dataBuku;
        let {penulis, penerbit} = dataBuku;
        
        if (!isbn || !judul  || !genre ) {
            throw new Error("Harus mengisi field yang wajib")
        }

        // jika data penulis yang dimasukkan adalah array string, pasti data belum ada di drop down menu
        // jika data penulis yang dimasukkan adalah array number, pasti data sudah ada di drop down menu,
        if (penulis && typeof penulis[0] !== "number") {
            penulis = (await konversiDataKeId(penulis as string[])) as number[];
        }


        // jika data penerbit yang dimasukkan adalah string, pasti data belum ada di drop down menu
        // jika data penerbit yang dimasukkan adalah number, pasti data sudah ada di drop down menu,
        if (penerbit && typeof penerbit !== "number") {
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
        
        await prisma.buku.create({
            data: {
              isbn,
              idPenerbit : penerbit as number,
              judul,
              genre,
              halaman,
              sinopsis,
              linkGambar,
              penulis : {
                connect : (penulis as number[]).map(id => ({id})) as {id : number}[]
              }
            },

          });

          await prisma.eksemplarBuku.create({
            data : {
                id : count + 1,
                bukuISBN : isbn
            }
          })
      
        
    }

    async tambahBanyakBuku(dataBuku : bukuType[]) {
        const map : Hash = {}

        // await Promise.all(dataBuku.map(isbnCounter))

        for await (const d of dataBuku) {
            await isbnCounter(d)
        }

        // Hitung jumlah ISBN yang sama
        // id buku baru = jumlah ISBN yang sama + 1 
        async function isbnCounter(data : bukuType) : Promise<void> {
            const { judul, genre, isbn, linkGambar, sinopsis, halaman } = data;
            let {penulis, penerbit} = data;

            if (!isbn || !judul || !genre ) {
                throw new Error("Harus mengisi field yang wajib")
            }


            if (penulis && typeof penulis[0] !== "number") {
                penulis = (await konversiDataKeId(penulis as string[])) as number[];
            }

            if (penerbit && typeof penerbit !== "number") {
                penerbit = (await konversiDataKeId(penerbit as string)) as number;
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
                        idPenerbit : penerbit as number,
                        sinopsis,
                        genre,
                        halaman,
                        penulis : {
                            connect : (penulis as number[]).map(id => ({id}))
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
                    buku : {
                        connect :  {
                            isbn : isbn
                        }
                    },
                }
            })

        

    }

}

    async cariBuku (isbn? : string) : Promise<bukuType | bukuType[]> {
        let buku : cariBukuType | cariBukuType[] = []; 

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
                        }
                    }
            }) as bukuType

            if (!buku?.isbn) {
                throw ({message : "Data buku tidak ditemukan"})
            }
            return buku;
    } 

        buku = await prisma.buku.findMany({
            include : {
                _count : {
                    select : {
                        eksemplarBuku : {
                            where : {
                                bukuPinjaman : {
                                    every : {
                                        tanggalKembali : {
                                            not : undefined
                                        }
                                    }
                                    }
                            }
                        }
                    }
                },
                penulis : true
            }
        }) as cariBukuType[]

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
        })
        if (!dataBuku?.bukuISBN) {
            throw new Error("Data buku tidak ditemukan")
        }

        return dataBuku;
    }

    async perbaruiBuku(isbn : string, id : number, dataBuku : perbaruiBukuType) :Promise<void> {
        const { judul, genre, isbn : bukuISBN, linkGambar, sinopsis, halaman, tanggalRusak, tanggalHilang, posisi } = dataBuku;
        let {penulis, penerbit} = dataBuku;

        let buku = await this.cariBuku(isbn) as Prisma.BukuCreateManyInput;

        if (!buku?.isbn) {
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
            },
            where : {
                isbn
            }
        })


    }

    async hapusBuku(isbn : string, id : number) : Promise<void> {
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