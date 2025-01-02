import { Buku } from "@/app/class/buku";
import { NextResponse } from "next/server";

type paramsType = {
  params: Promise<{ isbn: string }>;
};

export async function GET(req: Request, { params }: paramsType) {
  try {
    const { isbn } = await params;

    const dataBuku = await Buku.cariBuku(isbn);

    if (!dataBuku) {
      throw new Error("Data buku tidak ditemukan");
    }

    return NextResponse.json(dataBuku, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mendapatkan data buku", details: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: paramsType) {
  try {
    const body = await req.json();
    const { isbn } = await params;
    const dataBuku = await Buku.perbaruiBuku(isbn, body);

    console.log(isbn, body);

    return NextResponse.json(dataBuku, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal memperbarui data buku", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: paramsType) {
  try {
    const { isbn } = await params;

    await Buku.hapusBuku(isbn);

    return NextResponse.json(
      { message: "Berhasil menghapus data buku" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menghapus data buku", details: error },
      { status: 500 }
    );
  }
}
