import { Penerbit } from "@/app/class/penerbit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataPenerbit = await Penerbit.findAllPublisher();

    return NextResponse.json(dataPenerbit, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mendapatkan data penerbit", details: error },
      { status: 405 }
    );
  }
}
