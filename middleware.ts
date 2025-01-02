import { NextRequest, NextResponse } from "next/server";
import {getToken} from 'next-auth/jwt';
import {hariKeMiliDetik} from '@/lib'

let intervalTrigger : any = 0;
const secret = process.env.NEXTAUTH_SECRET;
export async function middleware(req : NextRequest) {
    const token = await getToken({
        req : req,
        secret : secret,
    });

    if (intervalTrigger === 0) {
        intervalTrigger = setInterval(async () => {
            fetch("http://localhost:3000/api/set-interval").then(() => console.log("test"))
        }, hariKeMiliDetik)
    } 
    if (!token?.role) {
        return NextResponse.redirect(new URL('/login', req.url));
    } 
    return NextResponse.next();
}

export const config = {
    matcher : ['/panel-kontrol', '/buku', '/murid', '/guru', '/form-bukti','/laporan']
}