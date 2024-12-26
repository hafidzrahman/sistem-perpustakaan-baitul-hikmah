import { beriSumbanganType, cariSumbanganType, hariKeMiliDetik, prisma, sumbanganType } from "@/lib";
import { RiwayatBantuan } from "./riwayatbantuan";
import { PembayaranTunai } from "./pembayarantunai";
import { Denda } from "./denda";


export class Sumbangan {
    id? : number;
    idKeterangan : number;
    nis? : string | null;
    nip? : string | null;
    tanggalSelesai? : Date | null;
    berlebih? : boolean | null

    constructor(data : sumbanganType) {
        this.id = data.id;
        this.idKeterangan = data.idKeterangan;
        this.nis = data.nis;
        this.nip = data.nip;
        this.tanggalSelesai = data.tanggalSelesai
        this.berlebih = data.berlebih;
    }

    static async tambahSumbangan(data : sumbanganType) : Promise<sumbanganType> {
        const {idKeterangan, nis, nip} = data;
        if (!idKeterangan || ((!nis && !nip) || (nis && nip))) {
            throw new Error("Harus mengisi field yang sesuai")
        }

        const dataSumbangan = await prisma.sumbangan.create({
            data : {
                idKeterangan,
                nis,
                nip 
            }
        });

        return dataSumbangan;

    }

    static async cariSumbangan(data : {nis? : string, nip? : string}) : Promise<cariSumbanganType[]> {
        const {nis, nip} = data;
        if (!nis && !nip) {
            throw new Error("Harus mengisi field yang wajib");
        }

        const dataSumbangan = await prisma.sumbangan.findMany({
            where : {
                nis,
                nip,
                tanggalSelesai : undefined,
                berlebih : false
            },
            include : {
                _count : {
                    select : {
                        sumbanganBuku : true,
                        sumbanganBukuBantuan : true,
                    }
                },
                denda : true,
                keterangan : true,
                pembayaranTunai : true,
                riwayatBantuan : true
            }
        });

        return dataSumbangan as unknown as cariSumbanganType[];
    }

    static async ambilSemuaDataSumbangan() : Promise<sumbanganType[]> {
        const dataSumbangan = await prisma.sumbangan.findMany({});

        return dataSumbangan;
    }

    static async beriSumbangan(data : beriSumbanganType) {

        if (!data?.nip || !data?.nis) {
            throw new Error("Harus mengisi field yang wajib")
        }

        const {nip, nis, pilihan} = data;

        if (data?.idSumbangan) {
            const arrayDataSumbangan = await Sumbangan.cariSumbangan({nip, nis});

            for (const dataSumbangan of arrayDataSumbangan) {
                if (!dataSumbangan?.id) { 
                    throw new Error("Id sumbangan tidak ada")
                }
                const targetBuku = dataSumbangan.keterangan.jumlahBuku;
                let targetTunai = dataSumbangan.keterangan.totalNominal;
                if (dataSumbangan.keterangan.nominalPerHari) {
                    targetTunai = ((Date.now() - dataSumbangan.denda.tanggal!.getTime()) / hariKeMiliDetik) * dataSumbangan.keterangan.nominalPerHari
                }
                const jumlahBuku = dataSumbangan._count.sumbanganBuku + dataSumbangan._count.sumbanganBukuBantuan;
                const totalPembayaranTunai = await PembayaranTunai.totalkanPembayaranTunai(dataSumbangan.id);
                const totalRiwayatBantuan = await RiwayatBantuan.totalkanRiwayatBantuan(dataSumbangan.id);
                const totalTunai = totalPembayaranTunai + totalRiwayatBantuan;

                if ((jumlahBuku + data.buku.length) === targetBuku) {
                    if (totalTunai > 0) {
                        if (data.pilihan === 'Hibah' || data.pilihan === 'Sesuaikan') {
                        await prisma.sumbangan.update({
                            where : {
                                id : dataSumbangan.id
                            },
                            data : {
                                tanggalSelesai : new Date(Date.now()),
                                berlebih : false
                            }
                        })
                        if (data.pilihan === 'Sesuaikan') {
                            console.log(`Kembalikan kepada murid Rp.${totalPembayaranTunai}`)
                            await prisma.pembayaranTunai.deleteMany({
                                where : {
                                    idSumbangan : dataSumbangan.id
                                }
                            });
                            const arrayDataRiwayatBantuan = await prisma.riwayatBantuan.findMany({
                                where : {
                                    idSumbangan : dataSumbangan.id
                                },
                                include : {
                                    pembayaranTunai : {
                                        include : {
                                            sumbangan : true
                                        }
                                    }
                                }
                            });
                            for await (const dataRiwayatBantuan of arrayDataRiwayatBantuan) {
                                if (dataRiwayatBantuan.pembayaranTunai?.idSumbangan){
                                await prisma.sumbangan.update({
                                    where : {
                                        id : dataRiwayatBantuan.pembayaranTunai?.idSumbangan
                                    }, data : {
                                        berlebih : true
                                    }
                                })}
                            }
                        }
                    } else if (data.pilihan === 'Bantuan') {
                        await prisma.sumbangan.update({
                            where : {
                                id : dataSumbangan.id
                            },
                            data : {
                                tanggalSelesai : new Date(Date.now()),
                                berlebih : true
                            }
                        })
                    }
                    }
                }


            }
        }
    }
}