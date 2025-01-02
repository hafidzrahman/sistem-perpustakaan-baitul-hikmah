import {EksemplarBuku} from '@/app/class/eksemplarbuku'
import {Buku} from '@/app/class/buku'
import { NextResponse } from 'next/server'

export async function GET() {
    
    const dataBuku = await Buku.cariBuku("978-602-06-5192-7")

    console.log(dataBuku?.eksemplarBuku.length)
    console.log(dataBuku?._count)

    return NextResponse.json({message : "SUCCESS"}, {status : 200})

}

