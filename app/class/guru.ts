import { Anggota, guruType, updtMemberType, prisma } from "@/lib";
import { JenisKelamin } from "@prisma/client";
import { NextResponse } from "next/server";

export class Guru implements Anggota<guruType> {
  nip: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  kontak: string;
  alamat?: string | null;

  constructor(data: guruType) {
    this.nip = data.nip;
    this.nama = data.nama;
    this.jenisKelamin = data.jenisKelamin;
    this.kontak = data.kontak;
    this.alamat = data.alamat;
  }

  static async addMember(dataGuru: guruType): Promise<guruType> {
    const { nip, nama, jenisKelamin, kontak, alamat } = dataGuru;

    if (!nip || !nama || !jenisKelamin || !kontak) {
      throw new Error("Harus mengisi field yang wajib");
    }

    // const cariGuru = await Guru.findMember(nip) as guruType;

    // if (cariGuru.nip) {
    //     throw new Error("NIP sudah terdaftar!")
    // }

    const result = await prisma.guru.create({
      data: {
        nip,
        nama,
        jenisKelamin,
        kontak,
        alamat,
      },
    });

    return result;
  }

  static async addManyMember(dataGuru: guruType[]): Promise<guruType[]> {
    const result = await prisma.guru.createManyAndReturn({
      data: dataGuru,
    });
    return result;
  }

  static async findMember(nip: string): Promise<guruType | undefined | null> {
    const guru = (await prisma.guru.findUnique({
      where: {
        nip,
      },
      include: {
        peminjaman: {
          include: {
            bukuPinjaman: true,
          },
        },
      },
    })) as guruType;

    if (!guru?.nip) {
      throw { message: "Data guru tidak ditemukan" };
    }

    return guru;
  }
  static async findAllTcr(): Promise<guruType[]> {
    const guru = (await prisma.guru.findMany({})) as guruType[];

    return guru;
  }

  static async updtMember(
    nip: string,
    data: updtMemberType
  ): Promise<guruType> {
    const { nama, jenisKelamin, kontak, alamat } = data;

    let guru = (await Guru.findMember(nip)) as guruType;

    if (!guru?.nip) {
      throw new Error("Data kelas tidak ditemukan");
    }

    const result = await prisma.guru.update({
      data: {
        nama: nama || guru.nama,
        jenisKelamin: jenisKelamin || guru.jenisKelamin,
        kontak: kontak || guru.kontak,
        alamat: alamat || guru.alamat,
      },
      where: {
        nip,
      },
    });

    return result;
  }

  static async dltMember(nip: string): Promise<void> {
    const guru = await prisma.guru.delete({
      where: {
        nip,
      },
    });

    if (!guru?.nip) {
      throw NextResponse.json(
        { message: "Data guru tidak ditemukan" },
        { status: 502 }
      );
    }
  }

  static async dltAllMember(): Promise<void> {
    await prisma.guru.deleteMany({});
  }
}
