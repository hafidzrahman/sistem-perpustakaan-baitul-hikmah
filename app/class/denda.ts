import {dendaType, prisma} from "@/lib";

export class Denda {
    id? : number;
    idSumbangan : number;
    idPeminjaman? : number | null;
    bukuISBN? : string | null;
    bukuId? : number | null;
    tanggal? : Date | null;

    constructor (data : dendaType) {
        this.id = data.id;
        this.idSumbangan = data.idSumbangan;
        this.tanggal = data.tanggal;
        this.idPeminjaman = data.idPeminjaman;
        this.bukuISBN = data.bukuISBN;
        this.bukuId = data.bukuId;
    }

    static async tambahDenda(data : dendaType) : Promise<dendaType> {
        const {idSumbangan, idPeminjaman, bukuISBN, bukuId} = data;

        if (!idSumbangan || (!idPeminjaman && !bukuISBN && !bukuId)) {
          throw new Error("Harus mengisi field yang wajib");
        }

        const dataDenda = await prisma.denda.create({
                  data: {
                    idSumbangan,
                    bukuISBN,
                    bukuId,
                    idPeminjaman
                  },
                });
        return dataDenda;
    }

    static async cariDenda(id : number) : Promise<dendaType> {
      const dataDenda = await prisma.denda.findUnique({
        where : {
          id
        }
      });

      if (!dataDenda?.id) {
        throw new Error("Data denda tidak ditemukan")
      }

      return dataDenda;
    }
}