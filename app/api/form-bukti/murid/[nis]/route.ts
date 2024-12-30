import {FormBukti} from "@/app/class/formbukti";
import { NextResponse } from "next/server";

type paramsType = {
    params : Promise<{nis : string}>
}

export async function GET(req : Request, {params} : paramsType) {
    try {
        const {nis} = await params;

        const dataFormBukti = await FormBukti.findFBStudent(nis);

        return NextResponse.json(dataFormBukti, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data form bukti", details : error}, {status : 405})
    }
}