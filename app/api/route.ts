import { NextResponse } from "next/server";
import {Buku, bukuType, Guru, guruType, Kelas, kelasType, Keterangan, keteranganType, Murid, muridType, Peminjaman, peminjamanType} from "@/lib";
import {seeds} from "@/seeds";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const {
    buku: dataBuku,
    kelas: dataKelas,
    murid: dataMurid,
    guru: dataGuru,
    keterangan: dataKeterangan,
    peminjaman: dataPeminjaman,
  } = seeds;
    const buku = new Buku();
    const kelas = new Kelas();
    const murid = new Murid();
    const guru = new Guru();
    const keterangan = new Keterangan();
    const peminjaman = new Peminjaman();
    
    await buku.hapusSemuaBuku();
    await prisma.riwayatKelas.deleteMany({})
    await kelas.hapusSemuaKelas();
    await murid.hapusSemuaAnggota();
    await guru.hapusSemuaAnggota();
    await keterangan.hapusSemuaKeterangan();

    await buku.tambahBanyakBuku(dataBuku);
    await kelas.tambahBanyakKelas(dataKelas);
    await murid.tambahBanyakAnggota(dataMurid);
    await guru.tambahBanyakAnggota(dataGuru);
    await keterangan.tambahBanyakKeterangan(dataKeterangan);

    await peminjaman.tambahBanyakPeminjaman(dataPeminjaman);
    
    let arrayBuku: bukuType[] = (await buku.cariBuku()) as bukuType[];
    let arrayKelas: kelasType[] = (await kelas.cariKelas()) as kelasType[];
    let arrayMurid : muridType[] = (await murid.cariAnggota()) as muridType[];
    let arrayKeterangan : keteranganType[] = (await keterangan.cariKeterangan()) as keteranganType[];
    let arrayGuru : guruType[] = (await guru.cariAnggota()) as guruType[];
    let arrayPeminjaman : peminjamanType[] = (await peminjaman.cariPeminjaman()) as peminjamanType[]

    return NextResponse.json({arrayBuku, arrayKelas, arrayMurid, arrayKeterangan, arrayGuru, arrayPeminjaman})
}

