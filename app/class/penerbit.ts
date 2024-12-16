import { penerbitType, prisma } from "@/lib";

export class Penerbit {
    id : number;
    nama : string

    constructor (data : penerbitType) {
        this.id = data.id;
        this.nama = data.nama;
    }

    static async tambahPenerbit(nama : string) : Promise<penerbitType> {
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

    static async cariPenerbit(data : {id? : number, nama? : string}) : Promise<penerbitType | undefined | null> {
            const dataPenerbit = await prisma.penerbit.findFirst({
                where : {
                    nama : data.nama
                }
            })
            return dataPenerbit;
        }
    static async ambilSemuaDataPenerbit() : Promise<penerbitType[]> {
        const dataPenerbit = await prisma.penerbit.findMany({});

        return dataPenerbit;
    }
}