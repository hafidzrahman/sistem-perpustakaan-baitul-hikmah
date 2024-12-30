import { EksemplarBuku } from "@/app/class/eksemplarbuku";
import { NextResponse } from "next/server";


// type paramsType = {
//     params : Promise<{id : string[]}>
// }

export async function PUT(req : Request, {params} : any) {
    try {
 
        const body = await req.json();
        const {id} = await params;

        await EksemplarBuku.updtCopyBook({bukuISBN : id[0], id : Number(id[1])}, body);

        return NextResponse.json({message : "success"}, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal memperbarui data eksemplar buku", details : error}, {status : 500})
    }
}