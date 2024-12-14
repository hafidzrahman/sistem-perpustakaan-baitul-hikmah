import { kelasType, perbaruiKelasType, prisma } from "@/lib";

export class Kelas{
    nama? : string;
    tingkat? : number;

    constructor(req? : Request) 
        {
        req?.json().then((data : kelasType) => {
            this.nama = data.nama;
            this.tingkat = data.tingkat;
        })
    }

    async tambahKelas(dataKelas : Omit<kelasType, 'id'>) : Promise<kelasType> {
        const {nama, tingkat} = dataKelas;

        if (!nama || !tingkat) {
            throw new Error("Harus mengisi field yang wajib")
        }

        const result = await prisma.kelas.create({
            data: {
              nama,
              tingkat
            },
          });

          return result;
    }
    
    async tambahBanyakKelas(dataKelas : Omit<kelasType, 'id'>[]) : Promise<kelasType[]> {
        const result = await prisma.kelas.createManyAndReturn({
            data : dataKelas
        })
        return result;
    }

    async cariKelas (id? : number) : Promise<kelasType | kelasType[]> {
        let kelas : kelasType | kelasType[] = []; 

        if (id) {    
            kelas = await prisma.kelas.findUnique({
                where : {
                    id
                }
            }) as kelasType
    
            if (!kelas?.id) {
                throw ({message : "Data kelas tidak ditemukan"})
            }

            return kelas;
    } 

        kelas = await prisma.kelas.findMany({}) as kelasType[]

        return kelas;

}

    async perbaruiKelas(id : number, data : perbaruiKelasType) :Promise<kelasType> {
        const {nama, tingkat} = data;

        let kelas = await this.cariKelas(id) as kelasType;

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

    async hapusKelas(id : number) : Promise<void> {
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

    async hapusSemuaKelas() {
        // await prisma.riwayatKelas.deleteMany({})
        await prisma.kelas.deleteMany({})
    }
    
}

export const kelas = new Kelas();
