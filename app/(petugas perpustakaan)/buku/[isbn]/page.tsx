"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cariBukuType, genreType } from "@/lib";

const Page = ({ params }: { params: Promise<{ isbn: string }> }) => {
  const [detailBuku, setDetailBuku] = useState<cariBukuType | null>(null);

  useEffect(() => {
    const fetchDetailBuku = async () => {
      const { isbn } = await params;
      try {
        const response = await fetch(`/api/buku/${isbn}`);
        const data = await response.json();
        setDetailBuku(data);
      } catch (error) {
        console.error("Gagal mengambil detail buku:", error);
      }
    };

    fetchDetailBuku();
  }, [params]);

  if (!detailBuku) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-dark-primary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 animate-pulse">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="aspect-[2/3] bg-gray-300 rounded-xl"></div>
            </div>
            <div className="md:col-span-8 lg:col-span-9 space-y-6">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bg = [
    "bg-jewel-purple",
    "bg-jewel-red",
    "bg-jewel-green",
    "bg-jewel-yellow",
    "bg-jewel-blue",
  ];
  const border = [
    "border-pastel-purple",
    "border-pastel-red",
    "border-pastel-green",
    "border-pastel-yellow",
    "border-pastel-blue",
  ];

  const {
    isbn,
    linkGambar,
    judul,
    penulis,
    genre,
    sinopsis,
    halaman,
    penerbitDetails,
    _count: stock,
  } = detailBuku;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-dark-primary p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Gambar Buku */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="relative group">
              <div className="overflow-hidden rounded-xl border-4 border-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  alt={`Cover buku ${judul}`}
                  src={linkGambar || "/img/book-2.png"}
                  width={400}
                  height={600}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Konten */}
          <div className="md:col-span-8 lg:col-span-9 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold font-source-serif text-white-custom">
                {judul}
              </h1>
              <h2 className="text-xl text-yellow-custom font-medium">
                {penulis.map((e) => e.nama).join(", ")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {genre.map((item: genreType, index: number) => (
                  <div
                    key={index}
                    className={`${bg[index]} ${border[index]} font-medium text-white-custom border-2 text-sm rounded-full py-1.5 px-4`}
                  >
                    {item.nama}
                  </div>
                ))}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div>
                <h3 className="text-sm font-medium text-yellow-custom">ISBN</h3>
                <p className="text-lg text-white-custom">{isbn}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-custom">
                  Jumlah Halaman
                </h3>
                <p className="text-lg text-white-custom">{halaman}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-custom">
                  Penerbit
                </h3>
                <p className="text-lg text-white-custom">
                  {penerbitDetails?.nama}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-custom">Stok</h3>
                <p className="text-lg text-white-custom">
                  {stock.eksemplarBuku} buku
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-custom">
                  Posisi
                </h3>
                <p className="text-lg text-white-custom">Rak A-1</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-custom">
                  Status
                </h3>
                <p className="text-lg text-secondary font-medium">Tersedia</p>
              </div>
            </div>

            {/* Sinopsis */}
            <div className="space-y-3">
              <h2 className="text-2xl font-source-serif font-bold text-yellow-custom">
                Sinopsis
              </h2>
              <div className="text-white-custom/90 text-justify leading-relaxed">
                <p className="indent-8">{sinopsis}</p>
              </div>
            </div>

            {/* Detail Eksemplar */}
            <div className="space-y-4">
              <h2 className="text-2xl font-source-serif font-bold text-yellow-custom">
                Detail Eksemplar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(stock.eksemplarBuku)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    <div>
                      <p className="text-white-custom font-medium">
                        Eksemplar #{index + 1}
                      </p>
                      <p className="text-sm text-yellow-custom">
                        Kondisi: Baik
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-secondary">
                        Tersedia
                      </p>
                      <p className="text-xs text-yellow-custom">Rak A-1</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
