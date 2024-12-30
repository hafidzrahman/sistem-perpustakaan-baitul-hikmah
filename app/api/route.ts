import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import {
  bookType,
  classType,
  infType,
  guruType,
  muridType,
  peminjamanType,
  updtMemberType,
  updtClassType,
  Genre,
  userType,
} from "@/lib";

import { Buku } from "@/app/class/buku";
import { Keterangan } from "@/app/class/keterangan";
import { Kelas } from "@/app/class/kelas";
import { Guru } from "@/app/class/guru";
import { FormBukti } from "@/app/class/formbukti";
import { Murid } from "@/app/class/murid";
import { Peminjaman } from "@/app/class/peminjaman";
import { seeds } from "@/seeds";
import { prisma } from "@/lib";
import { JenisKelamin } from "@prisma/client";
import { RiwayatKelas } from "../class/riwayatkelas";
import { Penulis } from "../class/penulis";
import { Penerbit } from "../class/penerbit";
import { Sumbangan } from "../class/sumbangan";
import { PembayaranTunai } from "../class/pembayarantunai";
import { RiwayatBantuan } from "../class/riwayatbantuan";
import { User } from "../class/user";

export async function GET() {
  const {
    buku: dataBuku,
    kelas: dataKelas,
    murid: dataMurid,
    guru: dataGuru,
    keterangan: dataKeterangan,
    peminjaman: dataPeminjaman,
    formBukti: dataFormBukti,
    eksemplarBuku: dataEksemplarBuku,
    user : dataUser,
    petugasPerpustakaan : dataPetugasPerpustakaan
  } = seeds;

  await prisma.riwayatBantuan.deleteMany({});
  await prisma.pembayaranTunai.deleteMany({});
  await prisma.denda.deleteMany({});
  await prisma.sumbangan.deleteMany({});
  await Keterangan.dltAllInf();
  await FormBukti.deleteAllFB();
  await Murid.dltAllMember();
  await Guru.dltAllMember();
  await RiwayatKelas.dltAllHstryType();
  // await prisma.sumbangan.deleteMany({})

  await Kelas.dltAllClass();
  // await prisma.penulis.deleteMany({})
  // await prisma.penerbit.deleteMany({})
  await Peminjaman.hapusSemuaPeminjaman();
  await Buku.deleteAllBook();

  await Buku.addBookMany(dataBuku);
  await Kelas.addManyClass(dataKelas);
  await Murid.addManyMember(dataMurid);
  await Guru.addManyMember(dataGuru);
  await Keterangan.addManyInf(dataKeterangan);

  await FormBukti.addFB(dataFormBukti[0]);
  await FormBukti.addFB(dataFormBukti[1]);
  await FormBukti.addFB(dataFormBukti[2]);

  for await (const data of dataPeminjaman)
  await Peminjaman.tambahPeminjaman(data);

  await prisma.petugasPerpustakaan.deleteMany({});

  await prisma.petugasPerpustakaan.createMany({
    data : dataPetugasPerpustakaan
  });

  await test(dataUser);

  await prisma.sumbangan.createMany({
    data: [
      {
        id: 1000,
        nis: "12250111794",
        idKeterangan: 2,
        tanggalSelesai: new Date(),
        berlebih : true
      },
      {
        id: 1001,
        nis: "12250111794",
        idKeterangan: 4,
      },
      {
        id: 1002,
        nis: "12250111794",
        idKeterangan: 4,
      },
      {
        id: 1003,
        nis: "12250111794",
        idKeterangan: 4,
      },
      {
        id: 1004,
        nis: "12250111794",
        idKeterangan: 4,
      },
    ],
  });

  await prisma.denda.create({
    data : {
      id : 10000,
      idSumbangan : 1000,
      tanggal : new Date(),
    }
  })

    await prisma.eksemplarBuku.createMany({
      data : dataEksemplarBuku
    })

  await prisma.pembayaranTunai.createMany({
    data: [
      {
        id: 3000,
        tanggal: new Date(Date.now()),
        jumlah: 50000,
        idSumbangan: 1000,
      },
    ],
  });

  // await prisma.riwayatBantuan.createMany({
  //   data: [
  //     { idPembayaranTunai: 3003, idSumbangan: 1000, jumlah: 50000 },
  //     { idPembayaranTunai: 3004, idSumbangan: 1000, jumlah: 50000 },
  //     { idPembayaranTunai: 3005, idSumbangan: 1000, jumlah: 50000 },
  //   ],
  // });

  await prisma.kelas.create({
    data : {
      id : 10000,
      nama : "test",
      tingkat : 8,
    }
  })

  await prisma.riwayatKelas.create({
    data : {
      tahunAjaran : "2023/2024",
      idKelas : 10000,
      muridNIS : "12250120338",
    }
  })

  // const test = await Sumbangan.cariSumbangan({nis : "12250111794"});

  // const a = await PembayaranTunai.calcMoneyPymt(test[0].id);
  //             const b = await RiwayatBantuan.calcHtryAid(test[0].id);
  //             const c = a + b;
  //             console.log(a);
  //             console.log(b);
  //             console.log(c);

  const arrayBuku: bookType[] = (await Buku.findBookMany()) as bookType[];
  const arrayKelas: classType[] =
    (await Kelas.findAllClass()) as classType[];
  const arrayMurid: muridType[] =
    (await Murid.ambilSemuDataMurid()) as muridType[];
  const arrayKeterangan: infType[] =
    (await Keterangan.findAllInf()) as infType[];
  const arrayGuru: guruType[] = (await Guru.findAllTcr()) as guruType[];
  const arrayPeminjaman: peminjamanType[] =
    (await Peminjaman.ambilSemuaDataPeminjaman()) as peminjamanType[];
  const arrayPenulis = await Penulis.findAllWriter();
  const arrayPenerbit = await Penerbit.findAllPublisher();
  const arrayBukuPinjaman = await prisma.bukuPinjaman.findMany({});
  const arrayDenda = await prisma.denda.findMany({});
  const arrayDataFormBukti = await FormBukti.takeAllFB();
  const arrayEksemplarBuku = await prisma.eksemplarBuku.findMany({});
  const arraySumbangan = await prisma.sumbangan.findMany({});

  return NextResponse.json({
    // test,
    arraySumbangan,
    arrayEksemplarBuku,
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
    arrayDenda,
  });
}

async function test(dataUser : userType[]): Promise<void> {

  await prisma.user.deleteMany({});
  
  for await (const user of dataUser) {
    const {username, password, role, muridNIS, guruNIP, petugasPerpustakaanId} = user;
    const dataUser = new User({
        username,
        password,
        role,
        muridNIS,
        guruNIP,
        petugasPerpustakaanId
    })

    await User.addUser(dataUser);

    // console.log(data);
  }
}
