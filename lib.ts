import { PrismaClient } from "@prisma/client";
import { JenisKelamin } from "@prisma/client";
import { Penulis } from "@/app/class/penulis";
import { Penerbit } from "@/app/class/penerbit";
import { GenreClass } from "@/app/class/genre";

export interface Hash<T> {
  [indexer: string]: T;
}

export type guruType = {
  nip: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  kontak: string;
  alamat?: string | null;
};

export type muridType = {
  nis: string;
  idKelas?: number;
  nama: string;
  jenisKelamin: JenisKelamin;
  kontak: string;
  alamat?: string | null;
};

export type updtMemberType = {
  nama?: string;
  jenisKelamin?: JenisKelamin;
  kontak?: string;
  alamat?: string | null;
  idKelas?: number;
};

export type perbaruiPeminjaman = Omit<peminjamanType, "id" | "tanggalPinjam">;

export type ambilSemuaDataPeminjamanType = peminjamanType & {
  bukuPinjaman: (bookBrwType & { eksemplarBuku: copyBookType })[];
};

export type dtlsBookType = bookType & {
  _count: {
    eksemplarBuku: number;
  };
  eksemplarBuku: copyBookType[];
  penulis: writerType[];
  penerbitDetails: publisherType;
  genre: genreType[];
};

export type updtClassType = {
  nama?: string;
  tingkat?: number;
};

export type findAllClassType = classType & {
  _count: {
    RiwayatKelas: number;
  };
};

export type classType = {
  id: number;
  nama: string;
  tingkat: number;
  JKMurid?: string | null;
};

export type hstryClassType = {
  muridNIS: string;
  idKelas: number;
  tahunAjaran: string;
  nomorPresensi?: number;
};

// id dan bukuISBN jadi opsional (!)
// sumbangan belum ditambahkan

export type copyBookType = {
  bukuISBN?: string;
  id?: number;
  tanggalMasuk?: Date | null;
  tanggalRusak?: Date | null;
  tanggalHilang?: Date | null;
  posisi?: string | null;
  idSumbangan?: number | null;
} | null;

export type bookType = {
  judul: string;
  penulis?: string[] | number[] | writerType[];
  genre: string[] | number[] | genreType[];
  isbn: string;
  linkGambar?: string | null;
  sinopsis?: string | null;
  penerbit?: string | number | null;
  penerbitDetails?: publisherType | null;
  halaman?: number | null;
  tanggalMasuk?: Date | null;
  tanggalRusak?: Date | null;
  tanggalHilang?: Date | null;
  posisi?: string | null;
};

export type addBookType = bookType & copyBookType;

export type eksemplarDenganBukuType = copyBookType & { buku: bookType };

export type publisherType = {
  id: number;
  nama: string;
};

export type genreType = {
  id: number;
  nama: string;
};

export type findBookType =
  | ({
      genre: genreType[];
      _count: {
        eksemplarBuku: number;
      };
    } & {
      penulis: writerType[];
    } & {
      isbn: string;
      judul: string;
      halaman: number | null;
      linkGambar: string | null;
      sinopsis: string | null;
      penerbit: number | publisherType | null;
      penerbitDetails?: publisherType;
    })
  | null;

export type writerType = {
  id: number;
  nama: string;
};

export type updateBookType = {
  judul?: string;
  penulis?: string[] | number[] | writerType[];
  genre?: string[] | number[];
  isbn?: string; // berisiko jika diperbarui? kalau bukan autoincrement() harusnya aman? setiap eksemplar buku yang terkait dengan isbn yang mau diubah pasti akan error
  linkGambar?: string;
  sinopsis?: string;
  penerbit?: string | number;
  penerbitDetails?: publisherType;
  halaman?: number;
  tanggalMasuk?: Date;
  tanggalRusak?: Date;
  tanggalHilang?: Date;
  posisi?: string;
};

export type infType = {
  id: number;
  keterangan: string;
  jumlahBuku?: number | null;
  totalNominal?: number | null;
  nominalPerHari?: number | null;
};

export type updtInfType = {
  keterangan?: string | null;
  jumlahBuku?: number | null;
  totalNominal?: number | null;
  nominalPerHari?: number | null;
};

export type peminjamanType = {
  id: number;
  nis?: string;
  nip?: string;
  tanggalPinjam?: Date | null;
  keterangan?: string;
  bukuPinjaman: bookBrwType[];
};

// untuk user yang ingin meminjam buku
export type peminjamType = {
  nis?: string;
  nip?: string;
  keterangan?: string;
  daftarBukuPinjaman: { isbn: string; tenggatWaktu?: Date | null }[];
};

export type bookBrwType = {
  idPeminjaman: number;
  bukuISBN: string;
  bukuId?: number;
  tenggatWaktu?: Date | null;
  tanggalKembali?: Date | null;
};

export type FBType = {
  id?: number;
  bukuISBN: string;
  muridNIS: string;
  tanggal: Date;
  intisari: string;
  halamanAwal: number;
  halamanAkhir: number;
  status: boolean;
};

export type formBuktiMuridType = {
  intisari: string;
  halamanAwal: number;
  halamanAkhir: number;
  tanggal: Date;
  status: boolean;
  buku: {
    judul: string;
  };
};

export type takeAllFBType = formBuktiMuridType & {
  kelas?: { nama: string; tingkat: number } | undefined;
  murid: { nis: string; nama: string; riwayatKelas: { tahunAjaran: string }[] };
};

export type perbaruiFBType = {
  bukuISBN?: string;
  muridNIS?: string;
  tanggal?: Date;
  intisari?: string;
  halamanAwal?: number;
  halamanAkhir?: number;
  status?: boolean;
};

export type fineType = {
  id?: number;
  idSumbangan: number;
  tanggal?: Date | null;
  idPeminjaman?: number | null;
  bukuISBN?: string | null;
  bukuId?: number | null;
};

export type imposeFineType = {
  id?: number;
  idKeterangan: number;
  idSumbangan: number;
  nis : string,
  nip : string,
  tanggal?: Date | null;
  idPeminjaman?: number | null;
  bukuISBN?: string | null;
  bukuId?: number | null;
};

export type userType = {

  id? : string,
  username : string,
  password : string,
  role : string,
  muridNIS? : string | null,
  guruNIP? : string | null,
  petugasPerpustakaanId? : string | null

};

export type updtUserType = {
  password? : string,
  role : string,
}

export type detailSumbanganType = {
    id?: number;
    idKeterangan: number;
    nis?: string | null;
    nip?: string | null;
    tanggalSelesai?: Date | null;
    berlebih?: boolean | null;
    riwayatBantuan : {
      idPembayaranTunai: number;
      idSumbangan: number;
      jumlah: number;
      pembayaranTunai : {
        sumbangan : { murid: { nama: string; } | null; } | null
      } 
    }[]
    pembayaranTunai : moneyPymtType[];
    murid? : muridType | null;
    guru? : guruType | null;
    keterangan : infType;
    denda? : fineType | null;
    sumbanganBuku : {
      bukuISBN : string,
      tanggalMasuk? : Date | null
    }[]
}


export type ambilSemuaDataSumbanganType = sumbanganType & 
{keterangan : {keterangan : string}, 
murid? : {nama : string} | null,
guru? : {nama : string} | null,
denda? : {id : number} | null
}

export type petugasPerpustakaanType = {
  id : number,
  nama : string
}

export type sumbanganType = {
  id?: number;
  idKeterangan: number;
  nis?: string | null;
  nip?: string | null;
  tanggalSelesai?: Date | null;
  berlebih?: boolean | null;
};

export type cariSumbanganAnggotaType = sumbanganType & {
  keterangan: infType;
  pembayaranTunai: moneyPymtType;
  _count: {
    sumbanganBuku: number;
  };
  denda: fineType;
};

export type hstryAidType = {
  idPembayaranTunai: number;
  idSumbangan: number;
  jumlah: number;
};

export type moneyPymtType = {
  id?: number;
  idSumbangan?: number | null;
  tanggal: Date;
  jumlah: number;
};

export type beriSumbanganType = {
  idSumbangan?: number;
  nominalTotal?: number;
  buku: addBookType[];
};

export const hariKeMiliDetik = 1000 * 60 * 60 * 24;

export interface Anggota<T> {
  nama?: string;
  jenisKelamin?: JenisKelamin;
  kontak?: string;
  alamat?: string | null;
}

export enum Genre {
  PENDIDIKAN = "Pendidikan",
  FIKSI = "Novel",
  NONFIKSI = "Non-Fiksi",
  BIOGRAFI = "Biografi",
  SEJARAH = "Sejarah",
  KOMIK = "Komik",
  ISLAMI = "Islami",
  PENGEMBANGAN = "Pengembangan Diri",
  TEKNOLOGI = "Teknologi",
}

export enum StatusCodes {
  success = 200,
}

export const prisma = new PrismaClient();

export async function konversiDataKeId(
  tableName: string,
  data: string | string[]
): Promise<number | number[]> {
  const arrayId: number[] = [];

  // jika data penulis atau genre yang dimasukkan adalah array string, pasti data belum ada di drop down menu
  if (tableName === "penulis") {
    for await (const nama of data as string[]) {
      let dataPenulis = await Penulis.findWriter({ nama });

      if (!dataPenulis) {
        dataPenulis = await Penulis.addWriter(nama);
      }
      arrayId.push(dataPenulis.id);
    }
    return arrayId;
  } else if (tableName === "genre") {
    for await (const nama of data as string[]) {
      let dataGenre = await GenreClass.findGenre({ nama });

      if (!dataGenre) {
        dataGenre = await GenreClass.addGenre(nama);
      }
      arrayId.push(dataGenre.id);
    }
    return arrayId;
  }

  let dataPenerbit = await Penerbit.findPublisher({ nama: data as string });

  if (!dataPenerbit) {
    dataPenerbit = await Penerbit.addPublisher(data as string);
  }

  return dataPenerbit.id;
}
