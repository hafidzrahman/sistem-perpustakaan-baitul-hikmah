"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { detailsBukuType, eksemplarBukuType } from "@/lib";

const Page = ({ params }: { params: Promise<{ isbn: string }> }) => {
  const [detailBuku, setDetailBuku] = useState<detailsBukuType>();
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

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
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="aspect-[2/3] bg-white/20 rounded-xl"></div>
            </div>
            <div className="md:col-span-8 lg:col-span-9 space-y-6">
              <div className="h-8 bg-white/20 rounded w-3/4"></div>
              <div className="h-6 bg-white/20 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-white/20 rounded w-20"></div>
                <div className="h-6 bg-white/20 rounded w-20"></div>
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

  const shelfPositions = [
    ["A1", "A2", "", "", ""],
    ["", "", "", "", ""],
    ["C1", "C2", "", "C4", "C5"],
    ["", "", "", "", ""],
    ["E1", "E2", "E3", "E4", "E5"],
  ];

  const getBookStatus = (eksemplar: eksemplarBukuType) => {
    if (eksemplar?.tanggalHilang)
      return { text: "Hilang", color: "text-red-500" };
    if (eksemplar?.tanggalRusak)
      return { text: "Rusak", color: "text-orange-500" };
    return { text: "Tersedia", color: "text-emerald-500" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-dark-primary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          {/* Gambar Buku */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-8">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-custom via-primary to-dark-primary rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    alt={`Cover buku ${detailBuku.judul}`}
                    src={detailBuku.linkGambar || "/img/book-2.png"}
                    width={400}
                    height={600}
                    className="w-full object-cover transform transition duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-yellow-custom text-sm font-medium">
                      Halaman
                    </div>
                    <div className="text-white-custom text-lg">
                      {detailBuku.halaman}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-yellow-custom text-sm font-medium">
                      Stok
                    </div>
                    <div className="text-white-custom text-lg">
                      {detailBuku._count.eksemplarBuku}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Konten */}
          <div className="md:col-span-8 lg:col-span-9 space-y-8">
            {/* Header dengan efek gradient */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold font-source-serif bg-gradient-to-r from-yellow-custom to-white-custom bg-clip-text text-transparent">
                {detailBuku.judul}
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-1 bg-yellow-custom rounded"></div>
                <h2 className="text-xl text-yellow-custom font-medium">
                  {detailBuku.penulis.map((p) => p.nama).join(", ")}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {detailBuku.genre.map((item, index) => (
                  <div
                    key={index}
                    className={`${bg[index]} ${border[index]} font-medium text-white-custom border-2 text-sm rounded-full py-2 px-6 transform hover:scale-105 transition-transform duration-200`}
                  >
                    {item.nama}
                  </div>
                ))}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
                <h3 className="text-yellow-custom font-medium mb-2">ISBN</h3>
                <p className="text-lg text-white-custom font-mono">
                  {detailBuku.isbn}
                </p>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
                <h3 className="text-yellow-custom font-medium mb-2">
                  Penerbit
                </h3>
                <p className="text-lg text-white-custom">
                  {detailBuku.penerbitDetails.nama}
                </p>
              </div>
            </div>

            {/* Posisi Rak dengan Visual Enhancement */}
            <div className="space-y-4">
              <h2 className="text-2xl font-source-serif font-bold text-yellow-custom flex items-center">
                <span className="mr-2">📚</span> Posisi di Rak
              </h2>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-custom to-primary rounded-xl blur opacity-30"></div>
                <div className="relative border-2 border-white/20 p-6 rounded-xl bg-white/10 backdrop-blur-md">
                  <div className="absolute top-8 -left-3 w-3 h-12 bg-gradient-to-br from-yellow-custom to-primary rounded-r-full"></div>
                  <div className="grid grid-rows-5 gap-3">
                    {shelfPositions.map((row, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-5 gap-2">
                        {row.map((position, colIndex) => (
                          <div key={`${rowIndex}-${colIndex}`}>
                            {position && (
                              <div
                                className={`
                                  text-sm p-4 font-medium rounded-lg border-2 w-full text-center
                                  transform transition-all duration-300
                                  ${
                                    detailBuku.eksemplarBuku.some(
                                      (ex) => ex?.posisi === position
                                    )
                                      ? "bg-primary text-white border-yellow-custom shadow-lg hover:scale-105"
                                      : "bg-white/5 text-white/50 border-white/20 hover:bg-white/10"
                                  }
                                `}
                              >
                                {position}
                              </div>
                            )}
                            {!position && (
                              <div className="w-full aspect-square"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sinopsis dengan Read More */}
            <div className="space-y-3">
              <h2 className="text-2xl font-source-serif font-bold text-yellow-custom flex items-center">
                <span className="mr-2">📖</span> Sinopsis
              </h2>
              <div
                className={`relative text-white-custom/90 text-justify leading-relaxed overflow-hidden
                  ${!showFullSynopsis && "max-h-32"}`}
              >
                <p className="indent-8">{detailBuku.sinopsis}</p>
                {!showFullSynopsis && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary to-transparent"></div>
                )}
              </div>
              <button
                onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                className="text-yellow-custom hover:text-yellow-300 transition duration-300"
              >
                {showFullSynopsis ? "Tutup" : "Baca Selengkapnya"}
              </button>
            </div>

            {/* Detail Eksemplar dengan Animasi */}
            <div className="space-y-4">
              <h2 className="text-2xl font-source-serif font-bold text-yellow-custom flex items-center">
                <span className="mr-2">📚</span> Detail Eksemplar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailBuku.eksemplarBuku.map((eksemplar, index) => {
                  const status = getBookStatus(eksemplar);
                  return (
                    <div
                      key={eksemplar?.id}
                      className="group p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white-custom font-medium group-hover:text-yellow-custom transition-colors duration-300">
                            Eksemplar #{eksemplar?.id}
                          </p>
                          <p className="text-sm text-yellow-custom/80">
                            {eksemplar?.tanggalRusak
                              ? "Kondisi: Rusak"
                              : "Kondisi: Baik"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${status.color}`}>
                            {status.text}
                          </p>
                          <p className="text-xs text-yellow-custom">
                            {eksemplar?.posisi || "Belum ditempatkan"}
                          </p>
                        </div>
                      </div>
                      {eksemplar?.tanggalMasuk && (
                        <div className="mt-2 text-xs text-white-custom/60">
                          Masuk:{" "}
                          {new Date(eksemplar?.tanggalMasuk).toLocaleDateString(
                            "id-ID"
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
