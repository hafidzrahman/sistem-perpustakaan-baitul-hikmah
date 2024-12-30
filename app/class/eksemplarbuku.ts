import { copyBookType, prisma } from "@/lib";

export type cstrCopyBookType = {
    bukuISBN : string;
    id : number;
    tanggalMasuk? : Date | null;
    tanggalRusak? : Date | null;
    tanggalHilang? : Date | null;
    posisi? : string | null;
    idSumbangan? : number | null;
}

export class EksemplarBuku {
    bukuISBN : string;
    id : number;
    tanggalMasuk? : Date | null;
    tanggalRusak? : Date | null
    tanggalHilang? :  Date | null
    posisi? : string | null;
    idSumbangan? : number | null

    constructor (data : cstrCopyBookType) {
        this.bukuISBN = data.bukuISBN;
        this.id = data.id;
        this.tanggalMasuk = data.tanggalMasuk;
        this.tanggalRusak = data.tanggalRusak;
        this.tanggalHilang = data.tanggalHilang;
        this.posisi = data.posisi;
        this.idSumbangan = data.idSumbangan;
    }

    static async addCopyBook(data : cstrCopyBookType) : Promise<cstrCopyBookType> {
        const dataEksemplarBuku =  await prisma.eksemplarBuku.create({
            data : {
                id : data.id,
                tanggalMasuk : data.tanggalMasuk,
                tanggalRusak : data.tanggalRusak,
                tanggalHilang : data.tanggalHilang,
                posisi : data.posisi,
                idSumbangan : data.idSumbangan || null,
                bukuISBN : data.bukuISBN
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

          return dataEksemplarBuku;
    }

    static async copyBookCtr(isbn : string) : Promise<number> {
        const counter = await prisma.eksemplarBuku.count({
            where : {
            bukuISBN : isbn
                    }
            })
        return counter;
    }

    static async findCopyBook(idBuku : {isbn : string, id : number}) : Promise<copyBookType> {
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
    
        static async updtCopyBook(idBuku : {bukuISBN : string, id : number}, data : copyBookType) : Promise<void> {
            const {bukuISBN, id} = idBuku;
            const dataEksemplarBuku = await prisma.eksemplarBuku.findUnique({
                where : {
                    bukuISBN_id : {
                        bukuISBN,
                        id
                    }
                },
            });

            if (!dataEksemplarBuku?.id) {
                throw new Error("Data eksemplar buku tidak ditemukan");
            }

            await prisma.eksemplarBuku.update({
                where : {
                    bukuISBN_id : {
                        bukuISBN,
                        id
                    }
                },
                data : {
                    posisi : data?.posisi || dataEksemplarBuku?.posisi,
                    tanggalHilang : data?.tanggalHilang || dataEksemplarBuku?.tanggalHilang,
                    tanggalMasuk : data?.tanggalMasuk || dataEksemplarBuku?.tanggalMasuk,
                    tanggalRusak : data?.tanggalRusak || dataEksemplarBuku?.tanggalRusak,
                }
            })
        }

    static async dltAllCopyBook(isbn? : string) : Promise<void> {
        if (isbn) {
            await prisma.eksemplarBuku.deleteMany({
                where : {
                    bukuISBN : isbn
                }
            })
        } else {
        await prisma.eksemplarBuku.deleteMany({});
        }
    }

    static async availCopyBook(isbn : string) : Promise<copyBookType> {
        const dataEksemplarBuku = await prisma.eksemplarBuku.findFirst({
            where : {
                AND : [
                    {bukuISBN : isbn},
                    {OR : [
                    {bukuPinjaman : undefined},
                    {bukuPinjaman : {
                        none : {
                            tanggalKembali : undefined
                        }
                    }}
                ]}
            ]
            }
        })
        return dataEksemplarBuku
    }
}