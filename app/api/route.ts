import { NextResponse } from "next/server";

import {bukuType, kelasType, keteranganType, guruType, muridType, peminjamanType} from '@/lib'

import {Buku} from '@/app/class/buku';
import {Keterangan} from '@/app/class/keterangan';
import {Kelas} from '@/app/class/kelas';
import {Guru} from '@/app/class/guru';
import {Murid} from '@/app/class/murid';
import {Peminjaman} from '@/app/class/peminjaman';
import {seeds} from "@/seeds";
import { prisma } from "@/lib";

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

    await prisma.riwayatKelas.deleteMany({})
    await buku.hapusSemuaBuku();
    await kelas.hapusSemuaKelas();
    await murid.hapusSemuaAnggota();
    await guru.hapusSemuaAnggota();
    await keterangan.hapusSemuaKeterangan();
    // await prisma.penulis.deleteMany({})
    // await prisma.penerbit.deleteMany({})
    await prisma.peminjaman.deleteMany({})

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
    let arrayPenulis = await prisma.penulis.findMany({})
    let arrayPenerbit = await prisma.penerbit.findMany({})

    return NextResponse.json({arrayPenerbit, arrayPenulis, arrayBuku, arrayKelas, arrayMurid, arrayKeterangan, arrayGuru, arrayPeminjaman})
}

