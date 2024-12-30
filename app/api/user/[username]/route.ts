import { User } from "@/app/class/user";
import { NextResponse } from "next/server";


type paramsType = {
    params : Promise<{username : string}>
}

export async function PUT(req : Request, {params} : paramsType) {
    try {
        const body = await req.json()
        const {username} = await params;

        await User.updtUser(username, body);
        return NextResponse.json({message : "Berhasil memperbarui data user"}, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal memperbarui data user"}, {status : 500})
    }
}