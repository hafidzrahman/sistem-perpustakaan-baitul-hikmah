import { prisma, hstryAidType } from "@/lib";

export class RiwayatBantuan {
    idPembayaranTunai : number;
    idSumbangan : number;
    jumlah : number;

    constructor(data : hstryAidType) {
        this.idPembayaranTunai = data.idPembayaranTunai;
        this.idSumbangan = data.idSumbangan;
        this.jumlah = data.jumlah;
    }

    static async addHstryAid(data : hstryAidType) : Promise<void> {
        const test = await prisma.riwayatBantuan.create({
            data : {
                idSumbangan : data.idSumbangan,
                idPembayaranTunai : data.idPembayaranTunai,
                jumlah : data.jumlah
            }
        })
        console.log("test11")
        console.log(test)
    }

    static async calcHtryAid(idSumbangan? : number) {
        if (!idSumbangan) {
            throw new Error("Id sumbangan tidak diinputkan");
        }
        const total = await prisma.riwayatBantuan.aggregate({
                    where : {
                        idSumbangan
                    },
                    _sum : {
                        jumlah : true
                    }
                })
        
                if (!total?._sum?.jumlah === null || !total?._sum?.jumlah === undefined) {
                    throw new Error("Gagal menghitung total pembayaran");
                }
        
                return total._sum.jumlah
    }
}