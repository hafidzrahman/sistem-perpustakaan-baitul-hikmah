import {fineType, imposeFineType, prisma} from "@/lib";
import { Sumbangan } from "./sumbangan";
import { Peminjaman } from "./peminjaman";

export class Denda {
    id? : number;
    idSumbangan : number;
    idPeminjaman? : number | null;
    bukuISBN? : string | null;
    bukuId? : number | null;
    tanggal? : Date | null;

    constructor (data : fineType) {
        this.id = data.id;
        this.idSumbangan = data.idSumbangan;
        this.tanggal = data.tanggal;
        this.idPeminjaman = data.idPeminjaman;
        this.bukuISBN = data.bukuISBN;
        this.bukuId = data.bukuId;
    }

    static async addFine(data : fineType) : Promise<fineType> {
        const {idSumbangan, idPeminjaman, bukuISBN, bukuId} = data;
        if (!idSumbangan) {
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

    static async imposeFine(data : imposeFineType) : Promise<fineType> {
      const {idSumbangan, idKeterangan, nis, nip} = data;
      if (!idSumbangan || !idKeterangan || !(nip || nis)) {
        throw new Error("Harus mengisi field yang wajib");
      }

      const dataSumbangan = await Sumbangan.tambahSumbangan({
        id : idSumbangan,
        idKeterangan,
        nis : nis,
        nip : nip 
      })

      if (idKeterangan === 3 || idKeterangan === 5) {
      const {bukuISBN, bukuId, idPeminjaman} = data;

      if (!bukuISBN || !bukuId || !idPeminjaman) {
        throw new Error("Harus mengisi field yang wajib")
      }
      
      const dataDenda = await prisma.denda.create({
                data: {
                  idSumbangan : dataSumbangan.id!,
                  bukuISBN,
                  bukuId,
                  idPeminjaman,
                  tanggal : new Date()
                },
              });
              return dataDenda
      }

      const dataDenda = await prisma.denda.create({
        data: {
          idSumbangan : dataSumbangan.id!,
          tanggal : new Date()
        },
      });

      return dataDenda;
  }

    static async findFine(id : number) : Promise<fineType> {
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

    static async fineFindMany() :Promise<fineType[]> {
      const dataDenda = await prisma.denda.findMany({
        include : {
          sumbangan : true
        }
      })

      return dataDenda;
    }
}