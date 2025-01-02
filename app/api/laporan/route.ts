import { NextResponse } from "next/server";
import {prisma, hariKeMiliDetik} from '@/lib';


export async function GET(req : Request) {
    try {
        // default mengambil data dari bulan lalu sampai sekarang
        const batasTanggalAwal = new Date(Date.now() - hariKeMiliDetik * 30)
        const dataBuku = await prisma.eksemplarBuku.groupBy({
            by : ['bukuISBN'],
            where : {
                OR : [
                {   tanggalMasuk : {
                        gte : batasTanggalAwal
                    }
                },
                {tanggalRusak : {
                    gte : batasTanggalAwal,
                },
            }, {tanggalHilang : {
                    gte : batasTanggalAwal,
            }}
            ]},
            _count : {
                tanggalMasuk : true,
                tanggalRusak : true,
                tanggalHilang : true,
            }
        });

        const dataPeminjaman = await prisma.peminjaman.count({
            where : {
                tanggalPinjam : {
                    gte : batasTanggalAwal
                }
            }
        })

        const dataFormBukti = await prisma.formBukti.count({
            where : {
                tanggal : {
                    gte : batasTanggalAwal
                }
            }
        })

        const dataKelas = await prisma.kelas.findMany({
            include : {
                RiwayatKelas : {
                    select : {
                        murid : {
                            select : {
                                _count : {
                                    select : {
                                        FormBukti : {
                                            where : {
                                                status : {
                                                    equals : true
                                                },
                                                tanggal : batasTanggalAwal
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })



        return NextResponse.json({dataKelas, dataBuku, dataPeminjaman, dataFormBukti}, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data laporan", details : error}, {status : 405})
    }
}

export async function POST(req: Request) {
    try {
        const {
            batasTanggalAwal = new Date(Date.now()), 
            batasTanggalAkhir = new Date(Date.now()),
        } = await req.json();
        const dataBuku = await prisma.eksemplarBuku.groupBy({
            by : ['bukuISBN'],
            where : {
                OR : [
                {tanggalRusak : {
                    gte : batasTanggalAwal,
                    lte : batasTanggalAkhir,
                },
            }, {tanggalHilang : {
                    gte : batasTanggalAwal,
                    lte : batasTanggalAkhir
            }}
            ]},
            _count : {
                tanggalRusak : true,
                tanggalHilang : true,
            }
        });

        const dataPeminjaman = await prisma.peminjaman.count({
            where : {
                tanggalPinjam : {
                    gte : batasTanggalAwal,
                    lte : batasTanggalAkhir
                }
            }
        })

        const dataFormBukti = await prisma.formBukti.count({
            where : {
                tanggal : {
                    gte : batasTanggalAwal,
                    lte : batasTanggalAkhir
                }
            }
        })



        return NextResponse.json({dataBuku, dataPeminjaman, dataFormBukti}, {status : 200})
    } catch (error) {
        return NextResponse.json({message : "Gagal mendapatkan data laporan", details : error}, {status : 405})
    }
}