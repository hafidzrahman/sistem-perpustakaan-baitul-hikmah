import { GenreClass } from "@/app/class/genre";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataGenre = await GenreClass.findAllGenre();

    return NextResponse.json(dataGenre, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mendapatkan data Genre", details: error },
      { status: 405 }
    );
  }
}
