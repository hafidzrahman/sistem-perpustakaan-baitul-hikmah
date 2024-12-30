import { prisma, hstryClassType } from "@/lib";

export class RiwayatKelas {
    muridNIS : string;
    idKelas : number;
    tahunAjaran : string;
    nomorPresensi? : number;

    constructor (data : hstryClassType) {
        this.muridNIS = data.muridNIS,
        this.idKelas = data.idKelas,
        this.tahunAjaran = data.tahunAjaran,
        this.nomorPresensi = data.nomorPresensi
    }

    static async addHstryClass(data : hstryClassType) : Promise<hstryClassType> {
        const dataRiwayatKelas = await prisma.riwayatKelas.create({
            data
        })

        return dataRiwayatKelas;
    }

    static async dltAllHstryType() : Promise<void> {
        await prisma.riwayatKelas.deleteMany({})
    }
}