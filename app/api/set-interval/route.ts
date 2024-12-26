import { NextResponse } from "next/server";
import {prisma, hariKeMiliDetik} from "@/lib"
import { Denda } from "@/app/class/denda";
import { Sumbangan } from "@/app/class/sumbangan";
import { Kelas } from "@/app/class/kelas";
import { RiwayatKelas } from "@/app/class/riwayatkelas";


export async function GET() {
    const tanggal = new Date(Date.now());
    const hari = tanggal.getDate();
    const bulan = tanggal.getMonth();

    try {
        if (hari === 1 && bulan === 6) {
            // periksa form bukti semua murid utk semester genap
            const bulanPertamaTahun = new Date(new Date().getFullYear(), 0, 1);
            const bulanPertengahanTahun = new Date(new Date().getFullYear(), 6, 1);
            const arrayFormBukti = await prisma.murid.findMany({
                select : {
                    nis : true,
                    _count : {
                        select : {
                            FormBukti : {
                                where : {
                                    tanggal : {
                                        gte : bulanPertamaTahun,
                                        lte : bulanPertengahanTahun
                                    }
                                }
                            }
                        }
                    }
                }
            })
            for await (const dataFormBukti of arrayFormBukti) {
                if (dataFormBukti._count.FormBukti < 20) {
                    const dataSumbangan = await Sumbangan.tambahSumbangan({
                        idKeterangan : 2,
                        nis : dataFormBukti.nis,
                    });
                    await Denda.tambahDenda({
                        idSumbangan : dataSumbangan.id!,
                    });
                }
            }

            // increment semua kelas murid dan masukkan semua murid ke kelas yang sudah di increment
            const tahunAjaranSebelumnya = `${tanggal.getFullYear()-1}/${tanggal.getFullYear()}`
            const tahunAjaranSekarang = `${tanggal.getFullYear()}/${tanggal.getFullYear()+1}`

            const arrayDataKelas = await prisma.kelas.findMany({
                where : {
                    RiwayatKelas : {
                        every : {
                            tahunAjaran : tahunAjaranSebelumnya
                        }
                    }
                },
                include : {
                    RiwayatKelas : true
                }
            })

            for await (const dataKelas of arrayDataKelas) {
                const kelas = await Kelas.tambahKelas({
                    nama : dataKelas.nama,
                    tingkat : dataKelas.tingkat+1,
                    JKMurid : dataKelas.JKMurid
                });

                for await (const murid of dataKelas.RiwayatKelas) {
                    await RiwayatKelas.tambahRiwayatKelas({
                        idKelas : kelas.id,
                        muridNIS : murid.muridNIS,
                        tahunAjaran : tahunAjaranSekarang
                    })
                }

            }

            // buat table sumbangan persyaratan lulus untuk semua kelas 9
            const arrayKelas = await prisma.kelas.findMany({
                where : {
                    tingkat : {
                        equals : 9
                    }
                }, select : {
                    RiwayatKelas : {
                        select : {
                            murid : {
                                select : {
                                    nis : true
                                }
                            }
                        }
                    }
                }
            }); 
            
            for await (const dataKelas of arrayKelas) {
                    for await (const dataMurid of dataKelas.RiwayatKelas) {
                        await Sumbangan.tambahSumbangan({
                            idKeterangan : 4,
                            nis : dataMurid.murid.nis
                        });
                    }
                }

        } else if (hari === 1 && bulan === 0) {
            // periksa form bukti semua murid utk semester genap
            const bulanPertamaTahun = new Date(new Date().getFullYear(), 0, 1);
            const bulanPertengahanTahun = new Date(new Date().getFullYear()-1, 6, 1);
            const arrayFormBukti = await prisma.murid.findMany({
                select : {
                    nis : true,
                    _count : {
                        select : {
                            FormBukti : {
                                where : {
                                    tanggal : {
                                        gte : bulanPertengahanTahun,
                                        lte : bulanPertamaTahun
                                    }
                                }
                            }
                        }
                    }
                }
            })
            for await (const dataFormBukti of arrayFormBukti) {
                if (dataFormBukti._count.FormBukti < 20) {
                    const dataSumbangan = await Sumbangan.tambahSumbangan({
                        idKeterangan : 2,
                        nis : dataFormBukti.nis,
                    });
                    await Denda.tambahDenda({
                        idSumbangan : dataSumbangan.id!,
                    });
                }
            }


        } 

    return NextResponse.json({message : "Set Interval Berhasil"}, {status : 200})
} catch (error) {
    return NextResponse.json({message : "Gagal menjalankan interval"}, {status: 500})
    }
}