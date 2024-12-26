// app/class/peminjaman.ts

import {
  ambilSemuaDataPeminjamanType,
  peminjamanType,
  peminjamType,
  perbaruiPeminjaman,
  prisma,
} from "@/lib";
import { NextResponse } from "next/server";
import { EksemplarBuku } from "./eksemplarbuku";
import { BukuPinjaman } from "./bukupinjaman";
import { Denda } from "./denda";

export class Peminjaman {
  id: number;
  nis?: string;
  nip?: string;
  tanggalPinjam?: Date | null;
  keterangan?: string;

  constructor(data: peminjamanType) {
    this.id = data.id;
    this.nis = data.nis;
    this.nip = data.nip;
    this.tanggalPinjam = data.tanggalPinjam;
    this.keterangan = data.keterangan;
  }

  static async tambahPeminjaman(dataPeminjam: peminjamType): Promise<void> {
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

    async function setDataPeminjaman(bukuPinjaman: {
      isbn: string;
      tenggatWaktu?: Date | null;
    }) {
      const { isbn, tenggatWaktu } = bukuPinjaman;

      const dataEksemplarBuku = await EksemplarBuku.ketersediaanEksemplarBuku(isbn);
      if (dataEksemplarBuku) {
        // 31536000000 --> satu tahun ke ms
        // 604800000 --> satu minggu ke ms
        // default peminjaman seminggu, bisa diatur sesuai dengan keinginan petugas perpustakaan
        const date = new Date();
        const deadline = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        const result = deadline.getTime() - date.getTime();
        const objectBukuPinjaman = new BukuPinjaman({
          idPeminjaman: peminjaman.id,
          bukuISBN: dataEksemplarBuku.bukuISBN!,
          bukuId: dataEksemplarBuku.id!,
          tenggatWaktu: deadline,
        });
        const dataBukuPinjaman = await BukuPinjaman.tambahBukuPinjaman(objectBukuPinjaman);

        let timer = setTimeout(
          () =>
            setDenda(
              peminjaman.id,
              dataBukuPinjaman.bukuISBN,
              dataBukuPinjaman.bukuId
            ),
          result
        );


        async function setDenda(
          idPeminjaman: number,
          bukuISBN: string,
          bukuId: number
        ) {
          // jika timer sedang berjalan, sementara kita pergi ke /api yang menyebabkan terdeletenya semua data peminjaman
          // maka ketika timer sudah habis, fungsi setDenda dijalankan, dan ketika bukuPinjaman.findUnique({}) dijalankan,
          // idPeminjaman tidak ditemukan karena sudah di delete, yang hal ini juga dikarenakan id Peminjaman menggunakan autoincrement()
          // sementara data bukuISBN dan bukuId aman karena tidak menggunakan autoincrement() tapi input isbn & id secara manual
          const bukuPinjaman = await prisma.bukuPinjaman.findUnique({
            where: {
              idPeminjaman_bukuISBN_bukuId: {
                idPeminjaman,
                bukuISBN,
                bukuId,
              },
            },
          });
          if (!bukuPinjaman?.bukuISBN) {
            throw new Error("Data buku tidak ditemukan");
          }

          if (
            bukuPinjaman.tenggatWaktu &&
            Date.now() >= bukuPinjaman.tenggatWaktu.getTime() &&
            !bukuPinjaman?.tanggalKembali
          ) {
            clearTimeout(timer);
            const dataSumbangan = await prisma.sumbangan.create({
              data: {
                idKeterangan: 1,
                nis,
                nip,
              },
            });

            const objectDenda = new Denda({
              idSumbangan: dataSumbangan.id,
              bukuISBN: dataBukuPinjaman.bukuISBN,
              idPeminjaman: dataBukuPinjaman.idPeminjaman,
              bukuId: dataBukuPinjaman.bukuId,
            });

            await Denda.tambahDenda(objectDenda);
          } else if (
            bukuPinjaman.tenggatWaktu &&
            Date.now() < bukuPinjaman.tenggatWaktu.getTime()
          ) {
            const result = bukuPinjaman.tenggatWaktu.getTime() - Date.now();
            // clearTimeout(timer);
            timer = setTimeout(
              () =>
                setDenda(
                  peminjaman.id,
                  dataBukuPinjaman.bukuISBN,
                  dataBukuPinjaman.bukuId
                ),
              result
            );
          }
        }
      }
    }
  }

  static async cariPeminjaman(id: number): Promise<peminjamanType> {
    const peminjaman = (await prisma.peminjaman.findUnique({
      where: {
        id,
      },
      include: {
        bukuPinjaman: true,
      },
    })) as peminjamanType;

    if (!peminjaman?.id) {
      throw { message: "Data peminjaman tidak ditemukan" };
    }

    return peminjaman;
  }

  static async cariPeminjamanAnggota(anggota : "guru" | "murid", userId : string) : Promise<peminjamanType[]> {
    const peminjaman = (await prisma.peminjaman.findMany({
      where: {
        nip : anggota === "guru" ? userId : undefined,
        nis : anggota === "murid" ? userId : undefined
      },
      include: {
        bukuPinjaman: true,
      },
    })) as peminjamanType[];

    if (!peminjaman?.length || peminjaman.length === 0) {
      throw { message: "Data peminjaman tidak ditemukan" };
    }

    return peminjaman;
  }

  static async ambilSemuaDataPeminjaman(): Promise<
    ambilSemuaDataPeminjamanType[]
  > {
    const peminjaman = (await prisma.peminjaman.findMany({
      include: {
        bukuPinjaman: { include: { eksemplarBuku: true } },
      },
    })) as ambilSemuaDataPeminjamanType[];

    return peminjaman;
  }

  static async perbaruiPeminjaman(
    id: number,
    dataPeminjaman: perbaruiPeminjaman
  ): Promise<void> {
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
        tanggalPinjam: peminjaman.tanggalPinjam!,
        keterangan: keterangan || peminjaman.keterangan,
      },
      where: {
        id,
      },
    });
  }

  static async hapusPeminjaman(idPeminjaman: number): Promise<void> {
    await BukuPinjaman.hapusSemuaBukuPinjaman(idPeminjaman);
    const peminjaman = await prisma.peminjaman.delete({
      where: {
        id: idPeminjaman,
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
    await prisma.denda.deleteMany({});
    // await prisma.sumbangan.deleteMany({})
    await prisma.bukuPinjaman.deleteMany({});
    await prisma.peminjaman.deleteMany({});
  }
}
