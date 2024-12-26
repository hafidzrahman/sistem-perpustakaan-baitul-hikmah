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

const Page = ({ params }: { params: Promise<{ nis: string }> }) => {
  const [detailMurid, setDetailMurid] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetailMurid = async () => {
      try {
        const { nis } = await params;
        const response = await fetch(`/api/murid/${nis}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setDetailMurid(data);
      } catch (error) {
        console.error("Failed to fetch student details:", error);
        setError("Gagal memuat data siswa. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailMurid();
  }, [params]);

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
      {/* Profile Card */}
      <div className="col-span-1 sm:col-span-2 lg:row-span-2 bg-white rounded-lg border-2 border-dark-gray">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-primary font-bold font-source-sans flex items-center gap-2">
              <UserAccountIcon className="h-6 w-6" />
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
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nomor Induk Siswa</p>
                <p className="text-lg font-medium">{detailMurid.nis}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nama Lengkap</p>
                <h1 className="text-2xl font-bold">{detailMurid.nama}</h1>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
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
            <Calendar01Icon className="h-6 w-6 text-primary" />
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
              Daftar Bukti Bacaan
            </h2>
          </div>

          {detailMurid.Peminjaman.length > 0 ? (
            <div className="space-y-4">
              {detailMurid.Peminjaman.map((pinjam, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{pinjam.bookTitle}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(pinjam.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Belum ada riwayat peminjaman buku
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
