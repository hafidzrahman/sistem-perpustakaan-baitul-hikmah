import { ambilSemuaDataKelasType, kelasType, perbaruiKelasType, prisma } from "@/lib";

export class Kelas{
    id : number;
    nama : string;
    tingkat : number;

    constructor(data : kelasType) {
            this.id = data.id;
            this.nama = data.nama;
            this.tingkat = data.tingkat;
    }

    static async tambahKelas(dataKelas : Omit<kelasType, 'id'>) : Promise<kelasType> {
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
    
    static async tambahBanyakKelas(dataKelas : Omit<kelasType, 'id'>[]) : Promise<kelasType[]> {
        const result = await prisma.kelas.createManyAndReturn({
            data : dataKelas
        })
        return result;
    }

    static async cariKelas (id : number) : Promise<kelasType | undefined | null> {
  
            const kelas = await prisma.kelas.findUnique({
                where : {
                    id
                }
            }) as kelasType
    
            if (!kelas?.id) {
                throw ({message : "Data kelas tidak ditemukan"})
            }

            return kelas;

}
    static async ambilSemuaDataKelas() : Promise<ambilSemuaDataKelasType[]> {
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

    static async perbaruiKelas(id : number, data : perbaruiKelasType) :Promise<kelasType> {
        const {nama, tingkat} = data;

        let kelas = await Kelas.cariKelas(id) as kelasType;

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

    static async hapusKelas(id : number) : Promise<void> {
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

    static async hapusSemuaKelas() {
        await prisma.riwayatKelas.deleteMany({})
        await prisma.kelas.deleteMany({})
    }
    
}
