import {buku} from '@/app/class/buku';
import { NextResponse } from "next/server";

type paramsType = {
    params : Promise<{isbn : string}>
}


export async function GET(req: Request, {params} : paramsType) {
  
  const {isbn} = await params;

  const dataBuku = await buku.cariBuku(isbn)

  if (!dataBuku) {
    return NextResponse.json({ message: "Buku Tidak ditemukan", status: 404 });
  }

  return NextResponse.json(dataBuku);
}

function titleToUrlParser(title : string) : string {
    return title.split(' ').map(s => s.toLowerCase).join('-')
}