import {pembayaranTunaiType, prisma} from "@/lib";

export class PembayaranTunai {
    id? : number;
    idSumbangan? : number | null;
    tanggal : Date;
    jumlah : number

    constructor(data : pembayaranTunaiType) {
        this.id = data.id;
        this.idSumbangan = data.idSumbangan;
        this.tanggal = data.tanggal;
        this.jumlah = data.jumlah
    }

    static async tambahPembayaranTunai(data : pembayaranTunaiType) : Promise<pembayaranTunaiType> {
        const {idSumbangan, tanggal, jumlah} = data;
        if (!tanggal || !jumlah) {
            throw new Error("Harus mengisi field yang wajib");
        }

        // angka jangan lebih dari 10 digit (batas integer)
        const dataPembayaranTunai = await prisma.pembayaranTunai.create({
            data : {
                idSumbangan,
                tanggal,
                jumlah
            }
        });

        return dataPembayaranTunai;
    }

    static async totalkanPembayaranTunai(idSumbangan? : number) : Promise<number> {
        if (!idSumbangan) {
            throw new Error("Id sumbangan tidak diinputkan");
        }
        const total = await prisma.pembayaranTunai.aggregate({
            where : {
                idSumbangan
            },
            _sum : {
                jumlah : true
            }
        })

        if (!total?._sum?.jumlah === undefined || !total?._sum?.jumlah === null) {
            throw new Error("Gagal menghitung total pembayaran");
        }

        return total._sum.jumlah!
    }


}