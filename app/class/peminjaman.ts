import { ambilSemuaDataPeminjamanType, bukuPinjamanType, peminjamanType, peminjamType, perbaruiPeminjaman, prisma } from "@/lib";
import { NextResponse } from "next/server";
import { Buku } from "@/app/class/buku";
import { EksemplarBuku } from "./eksemplarbuku";

export class Peminjaman {
  id: number;
  nis?: string;
  nip?: string;
  tanggalPinjam: Date;
  keterangan?: string;

  constructor(data: peminjamanType) {
      this.id = data.id;
      this.nis = data.nis;
      this.nip = data.nip;
      this.tanggalPinjam = data.tanggalPinjam;
      this.keterangan = data.keterangan;
  }

  static async tambahPeminjaman(dataPeminjam: peminjamType) : Promise<void> {
    const { nis, nip, keterangan, daftarBukuPinjaman } = dataPeminjam;

    if (!nis && !nip) {
      throw new Error("Harus mengisi field yang wajib");
    }

    const peminjaman = await prisma.peminjaman.create({
      data: {
        nis,
        nip,
        keterangan,
      },
    });

    for await (const data of daftarBukuPinjaman) {
      await setDataPeminjaman(data);
    }


    async function setDataPeminjaman(bukuPinjaman : {isbn : string, tenggatWaktu : Date}) {
    
    const {isbn, tenggatWaktu} = bukuPinjaman;

    const dataEksemplarBuku = await EksemplarBuku.ketersediaanEksemplarBuku(isbn);

    if (dataEksemplarBuku) {
    // 31536000000 --> satu tahun ke ms
    // 604800000 --> satu minggu ke ms
    // default peminjaman seminggu, bisa diatur sesuai dengan keinginan petugas perpustakaan
    const date = new Date();
    const deadline = tenggatWaktu || new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    const result = deadline.getTime() - date.getTime();

    const dataBukuPinjaman = await prisma.bukuPinjaman.create({
      data: {
        idPeminjaman: peminjaman.id,
        bukuISBN: dataEksemplarBuku.bukuISBN!,
        bukuId: dataEksemplarBuku.id!,
        tenggatWaktu: deadline,
      },
    });

    let timer = setTimeout(setDenda, result);

    async function setDenda() {
      console.log("test")
      const bukuPinjaman = await prisma.bukuPinjaman.findUnique({
        where: {
          idPeminjaman_bukuISBN_bukuId: {
            idPeminjaman: peminjaman.id,
            bukuISBN: dataBukuPinjaman.bukuISBN,
            bukuId: dataBukuPinjaman.bukuId,
          },
        },
      });

      if (!bukuPinjaman?.bukuISBN) {
        throw new Error("Data buku tidak ditemukan");
      }

      if (Date.now() >= bukuPinjaman.tenggatWaktu.getTime() && !bukuPinjaman?.tanggalKembali) {
        clearTimeout(timer)
        const dataSumbangan = await prisma.sumbangan.create({
          data: {
            idKeterangan: 1,
            nis,
            nip,
            berlebih: false,
          },
        });

        await prisma.denda.create({
          data: {
            idSumbangan: dataSumbangan.id,
            bukuISBN: dataBukuPinjaman.bukuISBN,
            idPeminjaman: dataBukuPinjaman.idPeminjaman,
            bukuId: dataBukuPinjaman.bukuId,
          },
        });
      } else if (Date.now() < bukuPinjaman.tenggatWaktu.getTime()) {
        const result = bukuPinjaman.tenggatWaktu.getTime() - Date.now()
        // clearTimeout(timer);
        timer = setTimeout(setDenda, result);
      }
    }}
  }
}

  static async konfirmasiPengembalian(
    idPeminjaman: number,
    idBuku: { isbn: string; id: number }
  ) {

    const dataEksemplarBuku = await EksemplarBuku.cariEksemplarBuku(idBuku);

    if (!dataEksemplarBuku?.bukuISBN || !dataEksemplarBuku?.id) {
      throw new Error("Data buku tidak ditemukan.");
    }

    const dataPeminjaman = await Peminjaman.cariPeminjaman(idPeminjaman);

    if (!dataPeminjaman?.id) {
      throw new Error("Data peminjaman tidak ditemukan.");
    }

    await prisma.bukuPinjaman.update({
      data: {
        tanggalKembali: new Date(),
      },
      where: {
        idPeminjaman_bukuISBN_bukuId: {
          idPeminjaman: dataPeminjaman.id,
          bukuISBN: dataEksemplarBuku.bukuISBN,
          bukuId: dataEksemplarBuku.id,
        },
      },
    });
  }

  static async cariPeminjaman(id: number) : Promise<peminjamanType> {
      const peminjaman = (await prisma.peminjaman.findUnique({
        where: {
          id,
        },
        include : {
          bukuPinjaman : true
        }
      })) as peminjamanType;

      if (!peminjaman?.id) {
        throw { message: "Data peminjaman tidak ditemukan" };
      }

      return peminjaman;
  }

  static async ambilSemuaDataPeminjaman() : Promise<ambilSemuaDataPeminjamanType[]> {
    const peminjaman = (await prisma.peminjaman.findMany({
      include: {
        bukuPinjaman: { include: { eksemplarBuku: true } },
      },
    })) as ambilSemuaDataPeminjamanType[]

    return peminjaman;
  }

  static async perbaruiPeminjaman(id: number, dataPeminjaman: perbaruiPeminjaman
  ) : Promise<void> {
    // tanggal pinjam boleh diperbarui?
    const { nis, nip, keterangan } = dataPeminjaman;

    let peminjaman = (await this.cariPeminjaman(id)) as peminjamanType;

    if (!peminjaman?.id) {
      throw { message: "Data peminjaman tidak ditemukan" };
    }

    await prisma.peminjaman.update({
      data: {
        nis: nis || peminjaman.nis,
        nip: nip || peminjaman.nip,
        tanggalPinjam: peminjaman.tanggalPinjam,
        keterangan: keterangan || peminjaman.keterangan,
      },
      where: {
        id,
      },
    });
  }

  static async perbaruiTenggatWaktuPeminjaman(
    idPeminjaman: number,
    idBuku: { isbn: string; id: number },
    tenggatWaktu: Date
  ) {
    await prisma.bukuPinjaman.update({
      data: {
        tenggatWaktu,
      },
      where: {
        idPeminjaman_bukuISBN_bukuId: {
          idPeminjaman,
          bukuISBN: idBuku.isbn,
          bukuId: idBuku.id,
        },
      },
    });
  }

  static async hapusPeminjaman(id: number): Promise<void> {
    await prisma.bukuPinjaman.deleteMany({
      where : {
        idPeminjaman : id
      }
    })
    const peminjaman = await prisma.peminjaman.delete({
      where: {
        id,
      },
    });

    if (!peminjaman?.id) {
      throw NextResponse.json(
        { message: "Data peminjaman tidak ditemukan" },
        { status: 502 }
      );
    }
  }

  static async hapusSemuaPeminjaman(): Promise<void> {
    await prisma.denda.deleteMany({})
    await prisma.sumbangan.deleteMany({})
    await prisma.bukuPinjaman.deleteMany({})
    await prisma.peminjaman.deleteMany({});
  }
}
