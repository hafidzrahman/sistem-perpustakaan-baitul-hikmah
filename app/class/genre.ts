import { genreType, prisma } from "@/lib";

export class GenreClass {
  id: number;
  nama: string;

  constructor(data: genreType) {
    this.id = data.id;
    this.nama = data.nama;
  }

  static async addGenre(nama: string): Promise<genreType> {
    if (!nama) {
      throw new Error("Harus mengisi field yang wajib");
    }
    const dataGenre = await prisma.genre.create({
      data: {
        nama,
      },
    });

    return dataGenre;
  }

  static async findGenre(data: {
    id?: number;
    nama?: string;
  }): Promise<genreType | undefined | null> {
    const dataGenre = await prisma.genre.findFirst({
      where: {
        nama: data.nama,
      },
    });
    return dataGenre;
  }

  static async findAllGenre(): Promise<genreType[]> {
    const dataGenre = await prisma.genre.findMany({
      select: {
        id: true, // Include id here
        nama: true,
        _count: {
          select: {
            buku: true,
          },
        },
      },
    });

    return dataGenre;
  }
}
