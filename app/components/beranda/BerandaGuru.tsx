"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PeminjamanCalendar from "@/app/components/CalendarPeminjaman";
import {
  BookOpen01Icon,
  Calendar01Icon,
  MapPinIcon,
  UserAccountIcon,
  HijabIcon,
  MuslimIcon,
} from "hugeicons-react";
import { useSession } from "next-auth/react";
import TablePeminjaman from "../TablePeminjaman";
import TablePeminjamanMurid from "../TablePeminjamanMurid";
import LineChartPeminjamanMurid from "../charts/LineChartPeminjamanMurid";
import { guruType } from "@/lib";
import LineChartPeminjamanGuru from "../charts/LineChartPeminjamanGuru";
import TablePeminjamanGuru from "../TablePeminjamanGuru";

interface ReadingHistory {
  intisari: string;
  tanggal: string;
  halamanAwal: number;
  halamanAkhir: number;
  status: boolean;
  buku: {
    judul: string;
  };
}

const BerandaGuru = () => {
  const [detailGuru, setDetailGuru] = useState<guruType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const nip = session?.user?.username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student details, book data, and reading history concurrently
        const [guruResponse, bookResponse] = await Promise.all([
          fetch(`/api/guru/${nip}`),
          fetch("/api/buku"),
        ]);

        if (!guruResponse.ok || !bookResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [guruData, bookData] = await Promise.all([
          guruResponse.json(),
          bookResponse.json(),
        ]);

        setDetailGuru({
          ...guruData,
          buku: bookData,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    if (nip) {
      fetchData();
    }
  }, [nip]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <div className="flex">
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!detailGuru) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Data guru tidak ditemukan</p>
      </div>
    );
  }

  console.log(detailGuru);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
      {/* Profile Card */}
      <div className="col-span-1 sm:col-span-2 lg:row-span-2 bg-white rounded-lg border-2 border-dark-gray">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-primary font-bold font-source-sans flex items-center gap-2">
              Profil Siswa
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:px-2">
            <div className="relative flex-shrink-0 flex w-24 h-24 rounded-full overflow-hidden border-2 border-black-custom">
              <Image
                src="/img/boy.jpeg"
                alt={`Foto ${detailGuru.nama}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex w-full flex-col">
              <p className="text-base sm:text-xl lg:text-sm font-bold text-black-custom -mb-1">
                {detailGuru.nip}
              </p>
              <div className="flex  justify-between w-full items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-xl text-black-custom font-source-serif font-bold">
                  {detailGuru.nama}
                </h1>
                {detailGuru.jenisKelamin === "PEREMPUAN" ? (
                  <HijabIcon
                    className="text-jewel-red"
                    width={24}
                    height={24}
                  />
                ) : (
                  <MuslimIcon
                    className="text-jewel-blue"
                    width={24}
                    height={24}
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 -mt-1">{detailGuru.alamat}</p>
              <div className="flex flex-col items-start mt-2">
                <h3 className="text-xs -mb-1">Kontak:</h3>
                <p className="font-bold">{detailGuru.kontak}</p>
              </div>
            </div>
          </div>
          <LineChartPeminjamanGuru data={detailGuru?.peminjaman} nip={nip} />
        </div>
      </div>

      {/* Calendar Card */}
      <div className="col-span-1 sm:col-span-2 lg:row-span-2 bg-white rounded-lg border-2 border-dark-gray">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl text-primary font-bold font-source-sans">
              Kalender Peminjaman
            </h2>
          </div>
          <PeminjamanCalendar loans={detailGuru.peminjaman} />
        </div>
      </div>

      {/* Book List Card */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 lg:row-span-2 bg-white rounded-lg border-2 border-dark-gray">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen01Icon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl text-primary font-bold font-source-sans">
              Riwayat Peminjaman
            </h2>
          </div>
          <TablePeminjamanGuru
            data={detailGuru?.peminjaman || []}
            bukuList={detailGuru?.buku || []}
            nip={session?.user?.username}
          />
        </div>
      </div>
    </div>
  );
};

export default BerandaGuru;
