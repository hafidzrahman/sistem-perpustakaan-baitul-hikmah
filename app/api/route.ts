import { NextResponse } from "next/server";

import {bukuType, kelasType, keteranganType, guruType, muridType, peminjamanType, perbaruiAnggotaType, perbaruiKelasType, Genre} from '@/lib'

import {Buku} from '@/app/class/buku';
import {Keterangan} from '@/app/class/keterangan';
import {Kelas} from '@/app/class/kelas';
import {Guru} from '@/app/class/guru';
import {FormBukti} from '@/app/class/formbukti';
import {Murid} from '@/app/class/murid';
import {Peminjaman} from '@/app/class/peminjaman';
import {seeds} from "@/seeds";
import { prisma } from "@/lib";
import { JenisKelamin } from "@prisma/client";
import { RiwayatKelas } from "../class/riwayatkelas";
import { Penulis } from "../class/penulis";
import { Penerbit } from "../class/penerbit";

export async function GET() {
  const {
    buku: dataBuku,
    kelas: dataKelas,
    murid: dataMurid,
    guru: dataGuru,
    keterangan: dataKeterangan,
    peminjaman: dataPeminjaman,
    formBukti : dataFormBukti
  } = seeds;
  
  await RiwayatKelas.hapusSemuaRiwayatKelas();
  await prisma.denda.deleteMany({})
  await prisma.sumbangan.deleteMany({})
  await Kelas.hapusSemuaKelas();
  await FormBukti.hapusSemuaDataFormBukti();
  await Murid.hapusSemuaAnggota();
  await Guru.hapusSemuaAnggota();
  await Keterangan.hapusSemuaKeterangan();
  // await prisma.penulis.deleteMany({})
  // await prisma.penerbit.deleteMany({})
  await Peminjaman.hapusSemuaPeminjaman();
  await Buku.hapusSemuaBuku()
    
    await Buku.tambahBanyakBuku(dataBuku);
    await Kelas.tambahBanyakKelas(dataKelas);
    await Murid.tambahBanyakAnggota(dataMurid);
    await Guru.tambahBanyakAnggota(dataGuru);
    await Keterangan.tambahBanyakKeterangan(dataKeterangan);
    
    await FormBukti.tambahDataFormBukti(dataFormBukti[0]);
    await FormBukti.tambahDataFormBukti(dataFormBukti[1]);
    await FormBukti.tambahDataFormBukti(dataFormBukti[2]);

    await Peminjaman.tambahPeminjaman(dataPeminjaman[0]);
    
    const arrayBuku: bukuType[] = (await Buku.ambilSemuaDataBuku()) as bukuType[];
    const arrayKelas: kelasType[] = (await Kelas.ambilSemuaDataKelas()) as kelasType[];
    const arrayMurid : muridType[] = (await Murid.ambilSemuDataMurid()) as muridType[];
    const arrayKeterangan : keteranganType[] = (await Keterangan.ambilSemuaDataKeterangan()) as keteranganType[];
    const arrayGuru : guruType[] = (await Guru.ambilSemuaDataGuru()) as guruType[];
    const arrayPeminjaman : peminjamanType[] = (await Peminjaman.ambilSemuaDataPeminjaman()) as peminjamanType[]
    const arrayPenulis = await Penulis.ambilSemuaDataPenulis()
    const arrayPenerbit = await Penerbit.ambilSemuaDataPenerbit()
    const arrayBukuPinjaman = await prisma.bukuPinjaman.findMany({})
    const arrayDenda = await prisma.denda.findMany({});
    const arrayDataFormBukti = await FormBukti.ambilSemuaDataFormBukti();

    return NextResponse.json({
      arrayDataFormBukti, 
      arrayBuku, 
      arrayKelas, 
      arrayMurid, 
      arrayKeterangan, 
      arrayGuru, 
      arrayPeminjaman,
      arrayPenulis,
      arrayPenerbit,
      arrayBukuPinjaman,
      arrayDenda
    })
}

