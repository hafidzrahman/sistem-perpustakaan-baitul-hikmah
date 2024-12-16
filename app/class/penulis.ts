import { penulisType, prisma } from "@/lib";

export class Penulis {
    id : number;
    nama : string

    constructor (data : penulisType) {
        this.id = data.id;
        this.nama = data.nama;
    }

    static async tambahPenulis(nama : string) : Promise<penulisType> {
        if (!nama) {
            throw new Error("Harus mengisi field yang wajib")
        }
        const dataPenulis = await prisma.penulis.create({
            data : {
                nama
            }
        })

        return dataPenulis;
    }

    static async cariPenulis(data : {id? : number, nama? : string}) : Promise<penulisType | undefined | null> {
        const dataPenulis = await prisma.penulis.findFirst({
            where : {
                nama : data.nama
            }
        })
        return dataPenulis;
    }

    static async ambilSemuaDataPenulis() : Promise<penulisType[]> {
            const dataPenulis = await prisma.penulis.findMany({});
    
            return dataPenulis;
        }
}