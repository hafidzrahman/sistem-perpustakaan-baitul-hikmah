import { genreType, prisma } from "@/lib";

export class GenreClass {
    id : number;
    nama : string

    constructor (data : genreType) {
        this.id = data.id;
        this.nama = data.nama;
    }

    static async tambahGenre(nama : string) : Promise<genreType> {
        if (!nama) {
            throw new Error("Harus mengisi field yang wajib")
        }
        const dataGenre = await prisma.genre.create({
            data : {
                nama
            }
        })

        return dataGenre;
    }

    static async cariGenre(data : {id? : number, nama? : string}) : Promise<genreType | undefined | null> {
            const dataGenre = await prisma.genre.findFirst({
                where : {
                    nama : data.nama
                }
            })
            return dataGenre;
        }
        
    static async ambilSemuaDataGenre() : Promise<genreType[]> {
            const dataGenre = await prisma.genre.findMany({});
    
            return dataGenre;
        }
}