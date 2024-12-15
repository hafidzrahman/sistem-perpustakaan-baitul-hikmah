import { prisma, riwayatKelasType } from "@/lib";

export class RiwayatKelas {
    muridNIS : string;
    idKelas : number;
    tahunAjaran : string;
    nomorPresensi? : number;

    constructor (data : riwayatKelasType) {
        this.muridNIS = data.muridNIS,
        this.idKelas = data.idKelas,
        this.tahunAjaran = data.tahunAjaran,
        this.nomorPresensi = data.nomorPresensi
    }

    static async tambahRiwayatKelas(data : riwayatKelasType) : Promise<riwayatKelasType> {
        const dataRiwayatKelas = await prisma.riwayatKelas.create({
            data
        })

        return dataRiwayatKelas;
    }

    static async hapusSemuaRiwayatKelas() : Promise<void> {
        await prisma.riwayatKelas.deleteMany({})
    }
}