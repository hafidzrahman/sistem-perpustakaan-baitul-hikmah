import { NextRequest, NextResponse } from "next/server";
import {getToken} from 'next-auth/jwt';


const secret = process.env.NEXTAUTH_SECRET;
export async function middleware(req : NextRequest) {
    const token = await getToken({
        req : req,
        secret : secret,
    });
    console.log(token?.role);

    if (!token?.role) {
        return NextResponse.redirect(new URL('/login', req.url));
    } 
    return NextResponse.next();
}

export const config = {
    matcher : ['/panel-control', '/buku', '/murid', '/guru','/laporan']
}