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

interface StudentData {
  nis: string;
  nama: string;
  alamat: string;
  jenisKelamin: "LAKI" | "PEREMPUAN";
  riwayatKelas: Array<{
    kelas: {
      tingkat: string;
      nama: string;
    };
  }>;
  Peminjaman: Array<{
    date: string;
    bookTitle: string;
  }>;
}

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

const BerandaMurid = () => {
  const [detailMurid, setDetailMurid] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);

  const nis = session?.user?.username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student details, book data, and reading history concurrently
        const [studentResponse, bookResponse, readingResponse] =
          await Promise.all([
            fetch(`/api/murid/${nis}`),
            fetch("/api/buku"),
            fetch(`/api/form-bukti/murid/${nis}`),
          ]);

        if (!studentResponse.ok || !bookResponse.ok || !readingResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [studentData, bookData, readingData] = await Promise.all([
          studentResponse.json(),
          bookResponse.json(),
          readingResponse.json(),
        ]);

        setDetailMurid({
          ...studentData,
          buku: bookData,
        });
        setReadingHistory(readingData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    if (nis) {
      fetchData();
    }
  }, [nis]);

  const calculateProgress = (history: ReadingHistory[]) => {
    // Only count approved submissions (status === true)
    const approvedReadings = history.filter((item) => item.status === true);
    return (approvedReadings.length / 20) * 100;
  };

  const getClassColor = (kelas: string) => {
    const colors = {
      "7": { bg: "bg-jewel-purple", border: "border-pastel-purple" },
      "8": { bg: "bg-jewel-red", border: "border-pastel-red" },
      "9": { bg: "bg-jewel-blue", border: "border-pastel-blue" },
    };

    const grade = Object.keys(colors).find((grade) => kelas.includes(grade));
    return grade ? colors[grade as keyof typeof colors] : colors["9"];
  };

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

  if (!detailMurid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Data siswa tidak ditemukan</p>
      </div>
    );
  }

  const kelas = detailMurid.riwayatKelas[0]?.kelas.tingkat
    ? `${detailMurid.riwayatKelas[0].kelas.tingkat} ${detailMurid.riwayatKelas[0].kelas.nama}`
    : "Tidak Diketahui";

  const classColors = getClassColor(kelas);
  const approvedReadings = readingHistory.filter(
    (item) => item.status === true
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
      {/* Profile Card */}
      <div className="col-span-1 sm:col-span-2 lg:row-span-2 bg-white rounded-lg border-2 border-dark-gray">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-primary font-bold font-source-sans flex items-center gap-2">
              Profil Siswa
            </h2>
            <span
              className={`${classColors.bg} ${classColors.border} px-4 py-2 rounded-full text-white-custom text-sm font-medium border-2`}
            >
              {kelas}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:px-2">
            <div className="relative flex-shrink-0 flex w-24 h-24 rounded-full overflow-hidden border-2 border-black-custom">
              <Image
                src="/img/boy.jpeg"
                alt={`Foto ${detailMurid.nama}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex w-full flex-col">
              <p className="text-base sm:text-xl lg:text-sm font-bold text-black-custom -mb-1">
                {detailMurid.nis}
              </p>
              <div className="flex  justify-between w-full items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-xl text-black-custom font-source-serif font-bold">
                  {detailMurid.nama}
                </h1>
                {detailMurid.jenisKelamin === "PEREMPUAN" ? (
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
              <p className="text-sm text-gray-600 -mt-1">
                {detailMurid.alamat}
              </p>
              <div className="flex flex-col items-start mt-2">
                <h3 className="text-xs -mb-1">Kontak Orang Tua:</h3>
                <p className="font-bold">{detailMurid.kontak}</p>
              </div>
            </div>
          </div>
          <LineChartPeminjamanMurid data={detailMurid?.Peminjaman} nis={nis} />
          <div className="mt-6">
            <h3 className="text-lg font-bold">
              Perkembangan Membaca Semester Ini
            </h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-primary">
                    {approvedReadings.length}/20 Buku
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary">
                    {calculateProgress(readingHistory).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex h-2 mb-4 overflow-hidden rounded bg-gray-100">
                <div
                  style={{
                    width: `${calculateProgress(readingHistory)}%`,
                  }}
                  className="flex flex-col justify-center rounded bg-primary transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>
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
          <PeminjamanCalendar loans={detailMurid.Peminjaman} />
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
          <TablePeminjamanMurid
            data={detailMurid?.Peminjaman || []}
            bukuList={detailMurid?.buku || []}
            nis={session?.user?.username}
          />
        </div>
      </div>
    </div>
  );
};

export default BerandaMurid;
