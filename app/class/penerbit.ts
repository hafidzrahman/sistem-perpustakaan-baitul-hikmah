import { publisherType, prisma } from "@/lib";

export class Penerbit {
    id : number;
    nama : string

    constructor (data : publisherType) {
        this.id = data.id;
        this.nama = data.nama;
    }

    static async addPublisher(nama : string) : Promise<publisherType> {
        if (!nama) {
            throw new Error("Harus mengisi field yang wajib")
        }
        const dataPenerbit = await prisma.penerbit.create({
            data : {
                nama
            }
        })

        return dataPenerbit;
    }

    static async findPublisher(data : {id? : number, nama? : string}) : Promise<publisherType | undefined | null> {
            const dataPenerbit = await prisma.penerbit.findFirst({
                where : {
                    nama : data.nama
                }
            })
            return dataPenerbit;
        }
    static async findAllPublisher() : Promise<publisherType[]> {
        const dataPenerbit = await prisma.penerbit.findMany({});

        return dataPenerbit;
    }
}