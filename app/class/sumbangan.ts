import { ambilSemuaDataPeminjamanType, ambilSemuaDataSumbanganType, beriSumbanganType, cariSumbanganAnggotaType, detailSumbanganType, hariKeMiliDetik, prisma, sumbanganType } from "@/lib";
import { RiwayatBantuan } from "./riwayatbantuan";
import { PembayaranTunai } from "./pembayarantunai";
import { Denda } from "./denda";
import { Buku } from "./buku";


export class Sumbangan {
    id? : number;
    idKeterangan : number;
    nis? : string | null;
    nip? : string | null;
    tanggalSelesai? : Date | null;
    berlebih? : boolean | null

    constructor(data : sumbanganType) {
        this.id = data.id;
        this.idKeterangan = data.idKeterangan;
        this.nis = data.nis;
        this.nip = data.nip;
        this.tanggalSelesai = data.tanggalSelesai
        this.berlebih = data.berlebih;
    }

    static async tambahSumbangan(data : sumbanganType) : Promise<sumbanganType> {
        const {idKeterangan, nis, nip} = data;
        if (!idKeterangan || ((!nis && !nip) || (nis && nip))) {
            throw new Error("Harus mengisi field yang sesuai")
        }

        const dataSumbangan = await prisma.sumbangan.create({
            data : {
                idKeterangan,
                nis,
                nip 
            }
        });

        return dataSumbangan;

    }

    static async cariSumbangan(id : number) : Promise<detailSumbanganType> {
        if (!id) {
            throw new Error("Data Id kosong")
        }

        const dataSumbangan = await prisma.sumbangan.findUnique({
            where : {
                id
            },
            include : {
                _count : {
                    select : {
                        sumbanganBuku : true,
                        sumbanganBukuBantuan : true,
                    }
                },
                pembayaranTunai : true,
                murid : true,
                guru : true,
                riwayatBantuan : {
                    include : {
                        pembayaranTunai : {
                            select : {
                                sumbangan : {
                                    select : {
                                        murid : {
                                            select : {
                                                nama : true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                sumbanganBuku : true,
                keterangan : true,
                denda : true
            }
        });

        if (!dataSumbangan?.id) {
            throw new Error("Data sumbangan tidak ditemukan")
        }

        return dataSumbangan


    }

    static async perbaruiSumbangan(id : number, data : {tanggalSelesai : Date, berlebih : boolean}) : Promise<void> {
        const {tanggalSelesai, berlebih} = data;
        if (!id || !tanggalSelesai || !berlebih) {
            throw new Error("Harus mengisi argumen yang wajib")
        }
        
        const dataSumbangan = await prisma.sumbangan.update({
            where : {
                id
            }, data : {
                tanggalSelesai,
                berlebih
            }
        });

        if (!dataSumbangan?.id) {
            throw new Error("Data sumbangan tidak ditemukan");
        }
    }

    static async cariSumbanganAnggota(data : {nis? : string, nip? : string}) : Promise<cariSumbanganAnggotaType[]> {
        const {nis, nip} = data;
        if (!nis && !nip) {
            throw new Error("Harus mengisi field yang wajib");
        }

        const dataSumbangan = await prisma.sumbangan.findMany({
            where : {
                nis,
                nip,
                tanggalSelesai : undefined,
                berlebih : false
            },
            include : {
                _count : {
                    select : {
                        sumbanganBuku : true,
                        sumbanganBukuBantuan : true,
                    }
                },
                denda : true,
                keterangan : true,
                pembayaranTunai : true,
                riwayatBantuan : true
            }
        });

        return dataSumbangan as unknown as cariSumbanganAnggotaType[];
    }

    static async ambilSemuaDataSumbangan() : Promise<ambilSemuaDataSumbanganType[]> {
        const dataSumbangan = await prisma.sumbangan.findMany({
            include : {
                pembayaranTunai : {
                    include : {
                        riwayatBantuan : true
                    },
                },
                murid : {
                    select : {
                        nama : true
                    }
                },
                guru : {
                    select : {
                        nama : true
                    }
                },
                keterangan : {
                    select : {
                        keterangan : true
                    }
                },
                denda : {
                    select : {
                        id : true
                    }
                }
            }
        });

        return dataSumbangan;
    }

    static async beriSumbangan(data : beriSumbanganType) {

        const {idSumbangan, nominalTotal, buku} = data!;

        if (!idSumbangan || !(nominalTotal || buku)) {
            throw new Error("Harus mengisi field yang wajib")
        }

            const dataSumbangan = await Sumbangan.cariSumbangan(idSumbangan);
                if (!dataSumbangan?.id) { 
                    throw new Error("Id sumbangan tidak ada")
                }
                
                const targetBuku = dataSumbangan.keterangan.jumlahBuku;
                let targetTunai = dataSumbangan.keterangan.totalNominal;
                if (dataSumbangan.keterangan.nominalPerHari && dataSumbangan.denda?.tanggal) {
                    targetTunai = ((Date.now() - dataSumbangan.denda.tanggal!.getTime()) / hariKeMiliDetik) * dataSumbangan.keterangan.nominalPerHari
                }
                
                const jumlahBuku = (dataSumbangan._count.sumbanganBuku || 0) + (dataSumbangan._count.sumbanganBukuBantuan || 0) + data.buku.length;
                const totalPembayaranTunai = await PembayaranTunai.totalkanPembayaranTunai(dataSumbangan.id);
                const totalRiwayatBantuan = await RiwayatBantuan.totalkanRiwayatBantuan(dataSumbangan.id);
                const bukuKeTunai = jumlahBuku*((dataSumbangan.keterangan.totalNominal || 0) / (dataSumbangan.keterangan.jumlahBuku || 1));
                const totalTunai = bukuKeTunai + (totalPembayaranTunai || 0) + (totalRiwayatBantuan || 0) + (nominalTotal || 0);
                console.log("total tunai :")
                console.log(totalTunai)
                if ((jumlahBuku) >= targetBuku!) {
                    console.log("test1")
                    // jika jumlah buku sudah terpenuhi dan uang lebih dari 0, maka status murid berlebih
                    if (totalTunai > 0) {
                        await prisma.sumbangan.update({
                            where : {
                                id : dataSumbangan.id
                            },
                            data : {
                                tanggalSelesai : new Date(Date.now()),
                                berlebih : true
                            }
                        })
                    } else {
                        await prisma.sumbangan.update({
                            where : {
                                id : dataSumbangan.id
                            },
                            data : {
                                tanggalSelesai : new Date(Date.now()),
                                berlebih : false
                            }
                        })
                    }

                    for await (const dataBuku of buku) {
                    await Buku.tambahBuku(dataBuku)
                    }

                }  else if ((jumlahBuku) < targetBuku! && nominalTotal === 0) {
                    console.log("test3")
                    for await (const dataBuku of buku) {
                        await Buku.tambahBuku(dataBuku)
                        }
                } else if (totalTunai === targetTunai) {
                    console.log("test4")
                    await PembayaranTunai.tambahPembayaranTunai({
                        idSumbangan : dataSumbangan.id,
                        tanggal : new Date(),
                        jumlah : (nominalTotal || 0)
                    })
                    await prisma.sumbangan.update({
                        where : {
                            id : dataSumbangan.id
                        },
                        data : {
                            tanggalSelesai : new Date(Date.now()),
                            berlebih : false
                        }
                    })

                } else if (totalTunai > targetTunai!) {
                    console.log("test5")
                    const dataPembayaranTunai = await PembayaranTunai.tambahPembayaranTunai({
                        idSumbangan : dataSumbangan.id,
                        tanggal : new Date(),
                        jumlah : (nominalTotal || 0)
                    })

                    let berlebih = totalTunai - targetTunai!;
                    
                    await prisma.sumbangan.update({
                        where : {
                            id : dataSumbangan.id
                        },
                        data : {
                            tanggalSelesai : new Date(),
                            berlebih : false
                        }
                    })

                    const dataSumbanganKurang = await prisma.sumbangan.findMany({
                        where : {
                            AND: [
                            {OR : [
                                {tanggalSelesai : undefined,},
                                {tanggalSelesai : null}
                            ]},
                            {berlebih : false},
                            ]
                        },
                        include : {
                            keterangan : {
                                select : {
                                    totalNominal : true,
                                    nominalPerHari : true,
                                    jumlahBuku : true
                                 }
                            }, 
                            denda : {
                                select : {
                                    tanggal : true
                                }
                            },
                            _count : {
                                select : {
                                    sumbanganBuku : true,
                                    sumbanganBukuBantuan : true,
                                }
                            }
                        }
                    })

                    for await (const data of dataSumbanganKurang) {
                        const tunaiDariRiwayatBantuan = await RiwayatBantuan.totalkanRiwayatBantuan(data.id);
                        const tunaiDariPembayaran = await PembayaranTunai.totalkanPembayaranTunai(data.id);
                        const jumlahBuku = (data._count.sumbanganBuku || 0) + (data._count.sumbanganBukuBantuan || 0)
                        const totalTunai = jumlahBuku*((data.keterangan?.totalNominal || 0) / (data.keterangan?.jumlahBuku || 1)) + (tunaiDariRiwayatBantuan || 0) + (tunaiDariPembayaran || 0);
                        let kekurangan = (data.keterangan.totalNominal || 0) - totalTunai;
                        if (data.keterangan.nominalPerHari) {
                            kekurangan = (Date.now() - data.denda!.tanggal.getTime()) / hariKeMiliDetik * data.keterangan.nominalPerHari - totalTunai
                        }
                        if (berlebih === kekurangan) {
                            await RiwayatBantuan.tambahRiwayatBantuan({
                                idSumbangan : data.id,
                                idPembayaranTunai : dataPembayaranTunai.id!,
                                jumlah : berlebih
                            });
                            

                            await prisma.sumbangan.update({
                                where : {
                                    id : data.id
                                }, data : {
                                    tanggalSelesai : new Date(Date.now()),
                                    berlebih : false
                                }
                            })

                            break;
                        } else if (berlebih < kekurangan) {
                            await RiwayatBantuan.tambahRiwayatBantuan({
                                idSumbangan : data.id,
                                idPembayaranTunai : dataPembayaranTunai.id!,
                                jumlah : berlebih
                            });
                            berlebih = 0;
                            break;
                        }
                        else if (berlebih > kekurangan) {
                            await RiwayatBantuan.tambahRiwayatBantuan({
                                idSumbangan : data.id,
                                idPembayaranTunai : dataPembayaranTunai.id!,
                                jumlah : kekurangan
                            });
                            berlebih -= kekurangan;
                            if (berlebih <= 0) {
                                console.log("kena")
                                break;}
                        }

                        await prisma.sumbangan.update({
                            where : {
                                id : data.id
                            }, data : {
                                tanggalSelesai : new Date(Date.now()),
                                berlebih : false
                            }
                        })
                    }

                    if (berlebih !== 0) {
                    await prisma.sumbangan.update({
                        where : {
                            id : dataSumbangan.id
                        },
                        data : {
                            tanggalSelesai : new Date(Date.now()),
                            berlebih : true
                        }
                    })
                } else {
                    await prisma.sumbangan.update({
                        where : {
                            id : dataSumbangan.id
                        },
                        data : {
                            tanggalSelesai : new Date(Date.now()),
                            berlebih : false
                        }
                    })
                }



            } else if (totalTunai < targetTunai!) {
                    console.log("test6")
                    await PembayaranTunai.tambahPembayaranTunai({
                        idSumbangan : dataSumbangan.id,
                        tanggal : new Date(),
                        jumlah : (nominalTotal || 0)
                    })

                    let kekurangan = dataSumbangan.keterangan.totalNominal! - totalTunai;
                    console.log("kekurangan", kekurangan)

                    const arraySumbangan = await prisma.sumbangan.findMany({
                        where : {
                            berlebih : true
                        },
                        include : {
                            keterangan : true,
                            pembayaranTunai : {
                                orderBy : {
                                    tanggal : 'desc'
                                },
                                take : 1
                            }
                        }
                    });
                    for await (const data of arraySumbangan) {
                        const jumlahBuku = await prisma.eksemplarBuku.count({
                            where : {
                                idSumbangan : dataSumbangan.id
                            }
                        }) || 0;
                        const tunaiDariRiwayatBantuan = await RiwayatBantuan.totalkanRiwayatBantuan(data.id);
                        const tunaiDariPembayaran = await PembayaranTunai.totalkanPembayaranTunai(data.id);
                        let bukuKeTunai = jumlahBuku * ((data.keterangan.totalNominal || 0) / (data.keterangan.jumlahBuku || 0));
                        const totalTunaiBerlebih = bukuKeTunai + (tunaiDariPembayaran || 0) + (tunaiDariRiwayatBantuan || 0) - data.keterangan.totalNominal!;
                        if (totalTunaiBerlebih === kekurangan) {
                            await RiwayatBantuan.tambahRiwayatBantuan({
                                idSumbangan : dataSumbangan.id,
                                idPembayaranTunai : data.pembayaranTunai[0].id,
                                jumlah : kekurangan
                            });
                            
                            await prisma.sumbangan.update({
                                where : {
                                    id : dataSumbangan.id
                                }, data : {
                                    tanggalSelesai : new Date(Date.now()),
                                    berlebih : false
                                }
                            })

                            await prisma.sumbangan.update({
                                where : {
                                    id : data.id
                                }, data : {
                                    tanggalSelesai : new Date(Date.now()),
                                    berlebih : false
                                }
                            })

                            break;
                        } else if (totalTunaiBerlebih > kekurangan) {
                            await RiwayatBantuan.tambahRiwayatBantuan({
                                idSumbangan : dataSumbangan.id,
                                idPembayaranTunai : data.pembayaranTunai[0].id,
                                jumlah : kekurangan
                            });
                            
                            await prisma.sumbangan.update({
                                where : {
                                    id : dataSumbangan.id
                                }, data : {
                                    tanggalSelesai : new Date(Date.now()),
                                    berlebih : false
                                }
                            })
                            kekurangan = 0;
                            break;
                        } else if (totalTunaiBerlebih < kekurangan) {
                          
                            await RiwayatBantuan.tambahRiwayatBantuan({
                                idSumbangan : dataSumbangan.id,
                                idPembayaranTunai : data.pembayaranTunai[0].id,
                                jumlah : totalTunaiBerlebih
                            });

                            await prisma.sumbangan.update({
                                where : {
                                    id : data.id
                                }, data : {
                                    tanggalSelesai : new Date(Date.now()),
                                    berlebih : false
                                }
                            })

                            kekurangan -= totalTunaiBerlebih;
                        } 
                        
                    }

                }


            
        
    }
}