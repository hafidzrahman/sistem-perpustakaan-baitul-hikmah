import { NextResponse } from "next/server";

import {bukuType, kelasType, keteranganType, guruType, muridType, peminjamanType, perbaruiAnggotaType, perbaruiKelasType, Genre} from '@/lib'

import {Buku} from '@/app/class/buku';
import {Keterangan} from '@/app/class/keterangan';
import {Kelas} from '@/app/class/kelas';
import {Guru} from '@/app/class/guru';
import {Murid} from '@/app/class/murid';
import {Peminjaman} from '@/app/class/peminjaman';
import {seeds} from "@/seeds";
import { prisma } from "@/lib";
import { JenisKelamin } from "@prisma/client";
import { RiwayatKelas } from "../class/riwayatkelas";

export async function GET() {
  const {
    buku: dataBuku,
    kelas: dataKelas,
    murid: dataMurid,
    guru: dataGuru,
    keterangan: dataKeterangan,
    peminjaman: dataPeminjaman,
  } = seeds;
  
  await RiwayatKelas.hapusSemuaRiwayatKelas();
  await prisma.denda.deleteMany({})
  await prisma.sumbangan.deleteMany({})
  await Kelas.hapusSemuaKelas();
  await Murid.hapusSemuaAnggota();
  await Guru.hapusSemuaAnggota();
  await Keterangan.hapusSemuaKeterangan();
  // await prisma.penulis.deleteMany({})
  // await prisma.penerbit.deleteMany({})
  await Peminjaman.hapusSemuaPeminjaman();
  await Buku.hapusSemuaBuku();
    
    await Buku.tambahBanyakBuku(dataBuku);
    await Kelas.tambahBanyakKelas(dataKelas);
    await Murid.tambahBanyakAnggota(dataMurid);
    await Guru.tambahBanyakAnggota(dataGuru);
    await Keterangan.tambahBanyakKeterangan(dataKeterangan);
    

    await Peminjaman.tambahPeminjaman(dataPeminjaman[0]);
    
    let arrayBuku: bukuType[] = (await Buku.ambilSemuaDataBuku()) as bukuType[];
    let arrayKelas: kelasType[] = (await Kelas.ambilSemuaDataKelas()) as kelasType[];
    let arrayMurid : muridType[] = (await Murid.ambilSemuDataMurid()) as muridType[];
    let arrayKeterangan : keteranganType[] = (await Keterangan.ambilSemuaDataKeterangan()) as keteranganType[];
    let arrayGuru : guruType[] = (await Guru.ambilSemuaDataGuru()) as guruType[];
    let arrayPeminjaman : peminjamanType[] = (await Peminjaman.ambilSemuaDataPeminjaman()) as peminjamanType[]
    let arrayPenulis = await prisma.penulis.findMany({})
    let arrayPenerbit = await prisma.penerbit.findMany({})
    let arrayBukuPinjaman = await prisma.bukuPinjaman.findMany({})
    let arrayDenda = await prisma.denda.findMany({});

    return NextResponse.json({arrayDenda, arrayPeminjaman, arrayBukuPinjaman, arrayBuku})
}

