import { writerType, prisma } from "@/lib";

export class Penulis {
    id : number;
    nama : string

    constructor (data : writerType) {
        this.id = data.id;
        this.nama = data.nama;
    }

    static async addWriter(nama : string) : Promise<writerType> {
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

    static async findWriter(data : {id? : number, nama? : string}) : Promise<writerType | undefined | null> {
        const dataPenulis = await prisma.penulis.findFirst({
            where : {
                nama : data.nama
            }
        })
        return dataPenulis;
    }

    static async findAllWriter() : Promise<writerType[]> {
            const dataPenulis = await prisma.penulis.findMany({});
    
            return dataPenulis;
        }
}