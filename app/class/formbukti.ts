import { ambilSemuaFormBuktiType, formBuktiMuridType, formBuktiType, perbaruiFormBuktiType, prisma } from "@/lib";

export class FormBukti {
    id? : number;
    bukuISBN : string;
    muridNIS : string;
    intisari : string;
    tanggal : Date;
    halamanAwal : number;
    halamanAkhir : number;
    status : boolean

    constructor(data : formBuktiType) {
        this.id = data.id;
        this.bukuISBN = data.bukuISBN;
        this.muridNIS = data.muridNIS;
        this.intisari = data.intisari;
        this.tanggal = data.tanggal;
        this.halamanAwal = data.halamanAwal;
        this.halamanAkhir = data.halamanAkhir;
        this.status = data.status;
    }

    static async tambahDataFormBukti(data : formBuktiType) : Promise<formBuktiType> {
        const {bukuISBN, muridNIS, intisari, tanggal, halamanAwal, halamanAkhir, status} = data;    

        // status harus bernilai false ketika baru mengisi data form bukti
        if (!bukuISBN || !muridNIS || !intisari || !tanggal || !halamanAwal || !halamanAkhir) {
            throw new Error("Harus mengisi field yang wajib");
        }
        const dataFormBukti = await prisma.formBukti.create({
            data : {
                bukuISBN : bukuISBN,
                muridNIS : muridNIS,
                intisari : intisari,
                tanggal : new Date(tanggal),
                halamanAwal : Number(halamanAwal),
                halamanAkhir : Number(halamanAkhir),
                status : status
            }
        })

        return dataFormBukti;
    }

    static async ambilSemuaDataFormBukti() : Promise<ambilSemuaFormBuktiType[]> {
        const dataFormBukti = await prisma.formBukti.findMany({
            select : {
                id: true,
                intisari : true,
                halamanAwal : true,
                halamanAkhir : true,
                tanggal : true,
                status : true,
                buku : {
                    select : {
                        judul : true
                    }
                },
                murid : {
                    select : {
                        nis : true,
                        nama : true,
                        riwayatKelas : {
                            select : {
                                tahunAjaran : true
                            }
                        }
                    }
                }
            }
        }) as ambilSemuaFormBuktiType[];
        let counter = 0;
        for await (const data of dataFormBukti) {
            const tahun = data.tanggal.getFullYear().toString();
            const bulan = data.tanggal.getMonth();
            const dataRiwayatKelas = await prisma.riwayatKelas.findMany({
                where : {
                    muridNIS : data.murid.nis
                },
                select : {
                    tahunAjaran : true,
                    kelas : {
                        select : {
                            nama : true,
                            tingkat : true,
                        }
                    }
                }
            })
            for (let i = 0; i < dataRiwayatKelas.length; i++) {
                const tahunAjaran = dataRiwayatKelas[i].tahunAjaran.split("/")
                if ((bulan >= 1 && bulan <= 6 && tahunAjaran[1] === tahun) && (bulan >= 7 && bulan <= 12 && tahunAjaran[0] === tahun)) {
                    dataFormBukti[counter].kelas = dataRiwayatKelas[i].kelas;
                    break;
                } 
            }
            ++counter;
            
        }
        return dataFormBukti;
    }

    static async cariDataFormBukti(id : number) : Promise<formBuktiType | null | undefined> {
        const dataFormBukti = await prisma.formBukti.findUnique({
            where : {
                id
            },
            include : {
                buku : true,
                murid : true
            }
        })

        if (!dataFormBukti?.id) {
            throw new Error("Data form bukti tidak ditemukan");
        } 

        return dataFormBukti;
    }

    static async cariDataFormBuktiDariMurid(muridNIS : string) : Promise<formBuktiMuridType[]> {
        const dataFormBukti = await prisma.formBukti.findMany({
            where : {
                muridNIS
            },
            select : {
                intisari : true,
                tanggal : true,
                halamanAwal : true,
                halamanAkhir : true,
                status : true,
                buku : {
                    select : {
                        judul : true
                    }
                },
            }, 
        })

        return dataFormBukti;
    }

    static async perbaruiDataFormBukti(id : number, data : perbaruiFormBuktiType) : Promise<formBuktiType> {
        const {bukuISBN, muridNIS, intisari, tanggal, halamanAwal, halamanAkhir, status} = data;

        const dataFormBuktiLama = await FormBukti.cariDataFormBukti(id);

        if (!dataFormBuktiLama?.id) {
            throw new Error("Data form bukti tidak ditemukan");
        }

        const dataFormBukti = await prisma.formBukti.update({
            data : {
                bukuISBN : bukuISBN || dataFormBuktiLama.bukuISBN,
                muridNIS : muridNIS || dataFormBuktiLama.muridNIS,
                intisari : intisari || dataFormBuktiLama.intisari,
                tanggal : tanggal || dataFormBuktiLama.tanggal,
                halamanAwal : halamanAwal || dataFormBuktiLama.halamanAwal,
                halamanAkhir : halamanAkhir || dataFormBuktiLama.halamanAkhir,
                status : status || dataFormBuktiLama.status
            },
            where : {
                id
            }
        })

        return dataFormBukti;
    }

    static async hapusDataFormBukti(id : number) : Promise<void> {
        const dataFormBukti = await prisma.formBukti.delete({
            where : {
                id
            }
        })

        if (!dataFormBukti?.id) {
            throw new Error("Data form bukti tidak ditemukan")
        }

    }

    static async hapusSemuaDataFormBukti() : Promise<void> {
        await prisma.formBukti.deleteMany({});
    }

}