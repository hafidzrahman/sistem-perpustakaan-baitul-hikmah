import { eksemplarBukuType, prisma } from "@/lib";

export type constructorEksemplarBukuType = {
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

    constructor (data : constructorEksemplarBukuType) {
        this.bukuISBN = data.bukuISBN;
        this.id = data.id;
        this.tanggalMasuk = data.tanggalMasuk;
        this.tanggalRusak = data.tanggalRusak;
        this.tanggalHilang = data.tanggalHilang;
        this.posisi = data.posisi;
        this.idSumbangan = data.idSumbangan;
    }

    static async tambahEksemplarBuku(data : constructorEksemplarBukuType) : Promise<constructorEksemplarBukuType> {
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

    static async eksemplarCounter(isbn : string) : Promise<number> {
        const counter = await prisma.eksemplarBuku.count({
            where : {
            bukuISBN : isbn
                    }
            })
        return counter;
    }

    static async cariEksemplarBuku(idBuku : {isbn : string, id : number}) : Promise<eksemplarBukuType> {
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
    
        static async perbaruiEksemplarBuku(idBuku : {bukuISBN : string, id : number}, data : eksemplarBukuType) : Promise<void> {
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

    static async hapusSemuaEksemplarBuku(isbn? : string) : Promise<void> {
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

    static async ketersediaanEksemplarBuku(isbn : string) : Promise<eksemplarBukuType> {
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