"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PeminjamanCalendar from "@/app/components/PeminjamanCalendar";
import {
  BookOpen01Icon,
  Calendar01Icon,
  MapPinIcon,
  UserAccountIcon,
} from "hugeicons-react";
import { useSession } from "next-auth/react";
import TablePeminjaman from "../TablePeminjaman";
import TablePeminjamanMurid from "../TablePeminjamanMurid";
import {
  DoughnutChartFormBuktiMurid,
  LineChartPeminjamanMurid,
} from "../charts/LineChartPeminjamanMurid";

interface StudentData {
  nis: string;
  nama: string;
  alamat: string;
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

const BerandaMurid = () => {
  const [detailMurid, setDetailMurid] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const nis = session?.user?.username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student details with peminjaman
        const studentResponse = await fetch(`/api/murid/${nis}`);
        if (!studentResponse.ok) {
          throw new Error(
            `Error ${studentResponse.status}: ${studentResponse.statusText}`
          );
        }
        const studentData = await studentResponse.json();

        // Fetch book data for the student's loans
        const bookResponse = await fetch("/api/buku");
        if (!bookResponse.ok) {
          throw new Error(
            `Error ${bookResponse.status}: ${bookResponse.statusText}`
          );
        }
        const bookData = await bookResponse.json();

        // Combine the data
        const combinedData = {
          ...studentData,
          buku: bookData,
        };

        setDetailMurid(combinedData);
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

  console.log(detailMurid);
  console.log(detailMurid?.buku);

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

          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-44 h-44 rounded-lg overflow-hidden border-2 border-black-custom">
              <Image
                src="/img/boy.jpeg"
                alt={`Foto ${detailMurid.nama}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-medium text-gray-text">
                {detailMurid.nis}
              </p>
              <h1 className="text-2xl text-black-custom font-source-serif font-bold">
                {detailMurid.nama}
              </h1>
              <div className="flex items-start gap-2 my-2">
                <p className="text-sm text-gray-600">{detailMurid.alamat}</p>
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
