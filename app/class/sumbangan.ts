import { ambilSemuaDataPeminjamanType, ambilSemuaDataSumbanganType, beriSumbanganType, cariSumbanganType, hariKeMiliDetik, prisma, sumbanganType } from "@/lib";
import { RiwayatBantuan } from "./riwayatbantuan";
import { PembayaranTunai } from "./pembayarantunai";
import { Denda } from "./denda";
import { Buku } from "./buku";


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

    static async ambilSemuaDataSumbangan() : Promise<ambilSemuaDataSumbanganType[]> {
        const dataSumbangan = await prisma.sumbangan.findMany({
            include : {
                pembayaranTunai : {
                    include : {
                        riwayatBantuan : true
                    },
                },
                murid : true,
                guru : true,
                riwayatBantuan : true,
                sumbanganBuku : true,
                keterangan : true,
                denda : true
            }
        });

        return dataSumbangan;
    }

    static async beriSumbangan(data : beriSumbanganType) {

        if (!data?.nip || !data?.nis) {
            throw new Error("Harus mengisi field yang wajib")
        }

        const {nip, nis, nominalTotal, buku} = data;

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
                const jumlahBuku = (dataSumbangan._count.sumbanganBuku || 0) + (dataSumbangan._count.sumbanganBukuBantuan || 0);
                const totalPembayaranTunai = await PembayaranTunai.totalkanPembayaranTunai(dataSumbangan.id);
                const totalRiwayatBantuan = await RiwayatBantuan.totalkanRiwayatBantuan(dataSumbangan.id);
                const totalTunai = (totalPembayaranTunai || 0) + (totalRiwayatBantuan || 0) + (nominalTotal || 0);

                if ((jumlahBuku + data.buku.length) === targetBuku) {
                    // jika jumlah buku sudah terpenuhi dan uang lebih dari 0, maka status murid berlebih
                    if (totalTunai > 0) {
                        await prisma.sumbangan.update({
                            where : {
                                id : dataSumbangan.id
                            },
                            data : {
                                tanggalSelesai : new Date(Date.now()),
                                berlebih : true
                            }
                        })
                    } else {
                        await prisma.sumbangan.update({
                            where : {
                                id : dataSumbangan.id
                            },
                            data : {
                                tanggalSelesai : new Date(Date.now()),
                                berlebih : false
                            }
                        })
                    }

                    for await (const dataBuku of buku) {
                    await Buku.tambahBuku(dataBuku)
                    }

                } else if ((jumlahBuku + data.buku.length) > targetBuku!) {
                    await prisma.sumbangan.update({
                        where : {
                            id : dataSumbangan.id
                        },
                        data : {
                            tanggalSelesai : new Date(Date.now()),
                            berlebih : true
                        }
                    })

                    for await (const dataBuku of buku) {
                        await Buku.tambahBuku(dataBuku)
                        }

                } else if ((jumlahBuku + data.buku.length) < targetBuku!) {
                    for await (const dataBuku of buku) {
                        await Buku.tambahBuku(dataBuku)
                        }
                } else if (totalTunai === targetTunai) {
                    await PembayaranTunai.tambahPembayaranTunai({
                        idSumbangan : dataSumbangan.id,
                        tanggal : new Date(),
                        jumlah : (nominalTotal || 0)
                    })
                    await prisma.sumbangan.update({
                        where : {
                            id : dataSumbangan.id
                        },
                        data : {
                            tanggalSelesai : new Date(Date.now()),
                            berlebih : false
                        }
                    })

                } else if (totalTunai > targetTunai!) {

                    await PembayaranTunai.tambahPembayaranTunai({
                        idSumbangan : dataSumbangan.id,
                        tanggal : new Date(),
                        jumlah : (nominalTotal || 0)
                    })

                    await prisma.sumbangan.update({
                        where : {
                            id : dataSumbangan.id
                        },
                        data : {
                            tanggalSelesai : new Date(Date.now()),
                            berlebih : true
                        }
                    })

                } else if (totalTunai < targetTunai!) {
                    await PembayaranTunai.tambahPembayaranTunai({
                        idSumbangan : dataSumbangan.id,
                        tanggal : new Date(),
                        jumlah : (nominalTotal || 0)
                    })

                    const kekurangan = dataSumbangan.keterangan.totalNominal! - totalTunai;

                    const arraySumbangan = await prisma.sumbangan.findMany({
                        where : {
                            berlebih : true
                        },
                        include : {
                            pembayaranTunai : true,
                            keterangan : true
                        }
                    });

                    for await (const data of arraySumbangan) {
                        const jumlahBuku = await prisma.eksemplarBuku.count({
                            where : {
                                idSumbangan : dataSumbangan.id
                            }
                        });

                        let jumlah = jumlahBuku * (data.keterangan.totalNominal! / data.keterangan.jumlahBuku!) - data.keterangan.totalNominal!;

                        for (const tunai of data.pembayaranTunai) {

                            jumlah += tunai.jumlah

                            if (jumlah >= kekurangan) {
                                await prisma.riwayatBantuan.create({
                                    data : {
                                        idPembayaranTunai : tunai.id,
                                        idSumbangan : dataSumbangan.id,
                                        jumlah : kekurangan
                                    }
                                })
                                await prisma.sumbangan.update({
                                    where : {
                                        id : dataSumbangan.id
                                    }, data : {
                                        tanggalSelesai : new Date(),
                                        berlebih : false
                                    }
                                })
                                break;
                            }
                        }

                        

                    }

                }


            }
        }
    }
}