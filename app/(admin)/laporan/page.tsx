"use client";

import DoughnutChartGenreBuku from "@/app/components/charts/DoughnutChartGenreBuku";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Buku {
  isbn: string;
  judul: string;
  genre: { id: number; nama: string }[];
}

interface Peminjaman {
  id: number;
  nis: string | null;
  nip: string | null;
}

interface Stats {
  totalKunjungan: number;
  totalPeminjaman: number;
  totalFormBukti: number;
  totalBuku: number;
  totalMurid: number;
  totalGuru: number;
  bukuPerGenre: Record<string, number>;
}

const LaporanPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [topPeminjam, setTopPeminjam] = useState<[string, number][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bukuRes, muridRes, guruRes, peminjamanRes, formBuktiRes] =
          await Promise.all([
            fetch("/api/buku"),
            fetch("/api/murid"),
            fetch("/api/guru"),
            fetch("/api/peminjaman"),
            fetch("/api/form-bukti"),
          ]);

        const [buku, murid, guru, peminjaman, formBukti] = await Promise.all([
          bukuRes.json(),
          muridRes.json(),
          guruRes.json(),
          peminjamanRes.json(),
          formBuktiRes.json(),
        ]);

        // Calculate genre distribution
        const bukuPerGenre: Record<string, number> = {};
        buku.forEach((b: Buku) => {
          b.genre.forEach((g) => {
            bukuPerGenre[g.nama] = (bukuPerGenre[g.nama] || 0) + 1;
          });
        });

        // Calculate top borrowers
        const borrowerCounts: Record<string, number> = {};
        peminjaman.forEach((p: Peminjaman) => {
          const key = p.nis || p.nip;
          if (key) {
            borrowerCounts[key] = (borrowerCounts[key] || 0) + 1;
          }
        });

        const sortedBorrowers = Object.entries(borrowerCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);

        setTopPeminjam(sortedBorrowers);

        setStats({
          totalKunjungan: peminjaman.length + formBukti.length,
          totalPeminjaman: peminjaman.length,
          totalFormBukti: formBukti.length,
          totalBuku: buku.length,
          totalMurid: murid.length,
          totalGuru: guru.length,
          bukuPerGenre,
        });
      } catch (err) {
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Assalamu'alaikum wr wb.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        {/* Stats Cards - Spanning 3 columns */}
        <div className="order-1 col-span-1 p-6 bg-white rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-1 sm:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Total Kunjungan
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalKunjungan}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                <p>Peminjaman: {stats.totalPeminjaman}</p>
                <p>Form Bukti: {stats.totalFormBukti}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Total Koleksi
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalBuku}
              </p>
              <p className="mt-2 text-sm text-gray-600">Judul Buku</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Total Anggota
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.totalMurid + stats.totalGuru}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                <p>Murid: {stats.totalMurid}</p>
                <p>Guru: {stats.totalGuru}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Charts Section - Full width */}
        <div className="flex flex-col gap-4 order-last col-span-1 row-span-2 p-6 bg-white rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2">
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between sm:items-center mb-4">
            <h2 className="font-source-sans md:text-2xl text-xl text-primary font-bold">
              Statistik Buku
            </h2>
            <button
              onClick={handleExportPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Status Buku
              </h3>
              {/* <div className="h-64">
                {stats && stats.bukuStatus && (
                  <BookStatusChart data={stats.bukuStatus} />
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanPage;
