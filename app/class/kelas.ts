import { findAllClassType, classType, updtClassType, prisma } from "@/lib";

export class Kelas{
    id : number;
    nama : string;
    tingkat : number;

    constructor(data : classType) {
            this.id = data.id;
            this.nama = data.nama;
            this.tingkat = data.tingkat;
    }

    static async addClass(dataKelas : Omit<classType, 'id'>) : Promise<classType> {
        const {nama, tingkat, JKMurid} = dataKelas;

        if (!nama || !tingkat) {
            throw new Error("Harus mengisi field yang wajib")
        }

        const result = await prisma.kelas.create({
            data: {
              nama,
              tingkat,
              JKMurid
            },
          });

          return result;
    }
    
    static async addManyClass(dataKelas : Omit<classType, 'id'>[]) : Promise<classType[]> {
        const result = await prisma.kelas.createManyAndReturn({
            data : dataKelas
        })
        return result;
    }

    static async findClass (id : number) : Promise<classType | undefined | null> {
  
            const kelas = await prisma.kelas.findUnique({
                where : {
                    id
                }
            }) as classType
    
            if (!kelas?.id) {
                throw ({message : "Data kelas tidak ditemukan"})
            }

            return kelas;

}
    static async findAllClass() : Promise<findAllClassType[]> {
        const result = await prisma.kelas.findMany({
            include : {
                _count : {
                    select : {
                        RiwayatKelas : true
                    }
                }
            }
        });

        return result;
    }

    static async updtClass(id : number, data : updtClassType) :Promise<classType> {
        const {nama, tingkat} = data;

        let kelas = await Kelas.findClass(id) as classType;

        if (!kelas?.id) {
            throw ({message : "Data kelas tidak ditemukan"})
        }

        const result = await prisma.kelas.update({
            data : {
                nama : nama || kelas.nama,
                tingkat : tingkat || kelas.tingkat,
            },
            where : {
                id
            }
        })

        return result;


    }

    static async dltClass(id : number) : Promise<void> {
        await prisma.riwayatKelas.deleteMany({
            where : {
                idKelas : id
            }
        })
        const kelas = await prisma.kelas.delete({
            where : {
                id
            }
        })

        if (!kelas?.id) {
            throw new Error("Data kelas tidak ditemukan")
        }
    }

    static async dltAllClass() {
        await prisma.riwayatKelas.deleteMany({})
        await prisma.kelas.deleteMany({})
    }
    
}
