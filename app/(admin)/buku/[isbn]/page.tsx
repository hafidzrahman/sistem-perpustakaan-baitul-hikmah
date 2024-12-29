"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { detailsBukuType, eksemplarBukuType } from "@/lib";
import { useSession } from "next-auth/react";
import ButtonPinjam from "@/app/components/ButtonPinjam";

const PageDetailBuku = ({ params }: { params: Promise<{ isbn: string }> }) => {
  const [detailBuku, setDetailBuku] = useState<detailsBukuType>();
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [peminjamanData, setPeminjamanData] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const { isbn } = await params;
      try {
        const responseBook = await fetch(`/api/buku/${isbn}`);
        const dataBook = await responseBook.json();
        setDetailBuku(dataBook);

        const responsePeminjaman = await fetch("/api/peminjaman");
        const dataPeminjaman = await responsePeminjaman.json();
        setPeminjamanData(dataPeminjaman);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, [params]);

  const bgColor = ["bg-jewel-blue"];

  const getBookStatus = (isbn: string) => {
    if (!detailBuku) return { dipinjam: 0, tersedia: 0, total: 0 };

    const totalEksemplar = detailBuku._count.eksemplarBuku;

    // Tambahkan pengecekan array
    if (!Array.isArray(peminjamanData)) {
      return {
        dipinjam: 0,
        tersedia: totalEksemplar,
        total: totalEksemplar,
      };
    }

    const dipinjam = peminjamanData.reduce((count, peminjaman) => {
      return (
        count +
        (peminjaman.bukuPinjaman?.filter(
          (bp: any) => bp.bukuISBN === isbn && bp.tanggalKembali === null
        ).length || 0)
      );
    }, 0);

    return {
      dipinjam,
      tersedia: totalEksemplar - dipinjam,
      total: totalEksemplar,
    };
  };

  const getBorrowButtonStatus = () => {
    if (!detailBuku || !session?.user?.username)
      return {
        text: "Pinjam",
        disabled: true,
      };

    // Tambahkan pengecekan array
    if (!Array.isArray(peminjamanData)) {
      return {
        text: "Pinjam",
        disabled: false,
      };
    }

    const userHasBorrowed = peminjamanData.some(
      (peminjaman) =>
        peminjaman.nisUser === session.user.username &&
        peminjaman.bukuPinjaman?.some(
          (bp: any) =>
            bp.bukuISBN === detailBuku.isbn && bp.tanggalKembali === null
        )
    );

    if (userHasBorrowed) {
      return {
        text: "Sudah dipinjam",
        disabled: true,
      };
    }

    const status = getBookStatus(detailBuku.isbn);

    if (status.tersedia === 0) {
      return {
        text: "Sedang dipinjam",
        disabled: true,
      };
    }

    return {
      text: "Pinjam",
      disabled: false,
    };
  };

  const getEksemplarStatus = (eksemplar: eksemplarBukuType) => {
    // Tambahkan pengecekan array
    if (!Array.isArray(peminjamanData)) {
      return { text: "Tersedia", color: "text-jewel-green" };
    }

    const isBorrowed = peminjamanData.some((peminjaman) =>
      peminjaman.bukuPinjaman?.some(
        (bp: any) =>
          bp.bukuISBN === detailBuku?.isbn &&
          bp.eksemplarId === eksemplar?.id &&
          bp.tanggalKembali === null
      )
    );

    if (isBorrowed)
      return { text: "Sedang Dipinjam", color: "text-yellow-500" };
    if (eksemplar?.tanggalHilang)
      return { text: "Hilang", color: "text-jewel-red" };
    return { text: "Tersedia", color: "text-jewel-green" };
  };

  if (!detailBuku) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="aspect-[2/3] bg-gray-200 rounded"></div>
            </div>
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bookStatus = getBookStatus(detailBuku.isbn);

  const shelfPositions = [
    ["A1", "A2", "", "", ""],
    ["", "", "", "", ""],
    ["C1", "C2", "", "C4", "C5"],
    ["", "", "", "", ""],
    ["E1", "E2", "E3", "E4", "E5"],
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-6">
          {/* Book Image */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-4">
              <div className="rounded-lg border-black-custom border-2 overflow-hidden shadow-md">
                <Image
                  alt={`Cover buku ${detailBuku.judul}`}
                  src={detailBuku.linkGambar || "/img/book-2.png"}
                  width={400}
                  height={600}
                  className="w-full"
                />
              </div>

              {/* Quick Info Card */}
              <div className="p-4 bg-white-custom rounded-lg border-jewel-green border-2 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-gray-600 text-sm">Sisa</div>
                    <div className="text-gray-800 text-lg">
                      {bookStatus.total}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-gray-600 text-sm">Status</div>
                    <div className="flex flex-col gap-1 items-center">
                      {bookStatus.dipinjam > 0 && (
                        <div className="px-2 py-0.5 bg-pastel-red text-jewel-red rounded-full text-xs">
                          {bookStatus.dipinjam} Dipinjam
                        </div>
                      )}
                      {bookStatus.tersedia > 0 && (
                        <div className="px-2 py-0.5 bg-pastel-green text-jewel-green rounded-full text-xs">
                          {bookStatus.tersedia} Tersedia
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {session?.user?.role === "admin" ? (
                  ""
                ) : (
                  <ButtonPinjam
                    isbn={detailBuku.isbn}
                    judul={detailBuku.judul}
                    session={session}
                    peminjamanData={peminjamanData}
                    eksemplarCount={detailBuku._count.eksemplarBuku}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-source-serif leading-none font-black text-jewel-green">
                {detailBuku.judul}
              </h1>
              <div className="flex gap-2 items-center">
                <div className="h-2 w-8 bg-primary rounded-full"></div>
                <h2 className="text-2xl text-black-custom font-bold leading-none">
                  {detailBuku.penulis.map((p) => p.nama).join(", ")}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {detailBuku.genre.map((item, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1"
                  >
                    {item.nama}
                  </span>
                ))}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-pastel-green rounded-lg border-jewel-green border-2 ">
                <h3 className="text-primary font-bold mb-1">ISBN</h3>
                <p className="text-black-custom font-source-serif">
                  {detailBuku.isbn}
                </p>
              </div>
              <div className="p-4 bg-pastel-green rounded-lg border-jewel-green border-2 ">
                <h3 className="text-primary font-bold mb-1">Penerbit</h3>
                <p className="text-black-custom">
                  {detailBuku.penerbitDetails.nama}
                </p>
              </div>
            </div>

            {/* Synopsis */}
            <div className="rounded-lg p-4">
              <h2 className="text-xl font-bold text-primary mb-2">Sinopsis</h2>
              <div
                className={
                  !showFullSynopsis
                    ? "max-h-[6.5rem] overflow-hidden relative"
                    : ""
                }
              >
                <p className="text-black-custom font-source-serif tracking-tight leading-relaxed">
                  {detailBuku.sinopsis}
                </p>
                {!showFullSynopsis && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F5F5DC] to-transparent"></div>
                )}
              </div>
              <button
                onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                className="text-primary font-bold underline hover:text-dark-primary mt-2"
              >
                {showFullSynopsis ? "Tutup" : "Baca Selengkapnya"}
              </button>
            </div>
            <div className="p-4 bg-white-custom rounded-lg border-jewel-green border-2">
              <h2 className="text-xl text-primary font-bold mb-4">
                Posisi di Rak
              </h2>
              <div className="border-jewel-green ">
                <div className="grid grid-rows-5 gap-3">
                  {shelfPositions.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-5 gap-2">
                      {row.map((position, colIndex) => (
                        <div key={`${rowIndex}-${colIndex}`}>
                          {position && (
                            <div
                              className={`
                                text-sm p-4 font-medium rounded-lg border w-full text-center
                                transition-colors duration-200
                                ${
                                  detailBuku.eksemplarBuku.some(
                                    (ex) => ex?.posisi === position
                                  )
                                    ? "bg-jewel-green text-white-custom border-pastel-green border-2"
                                    : "bg-pastel-green text-black-custom border-jewel-green"
                                }
                              `}
                            >
                              {position}
                            </div>
                          )}
                          {!position && (
                            <div className="w-full aspect-square md:aspect-auto"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specimen Details */}
            <div className="p-4 bg-white-custom rounded-lg border-jewel-green border-2">
              <h2 className="text-xl text-primary font-bold mb-4">
                Detail Eksemplar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailBuku.eksemplarBuku.map((eksemplar) => {
                  const status = getEksemplarStatus(eksemplar);
                  return (
                    <div key={eksemplar?.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-black-custom font-source-serif">
                            Eksemplar #{eksemplar?.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {eksemplar?.tanggalRusak
                              ? "Kondisi: Rusak"
                              : "Kondisi: Baik"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${status.color}`}
                          >
                            {status.text}
                          </p>
                          <p className="text-xs text-black-custom font-bold">
                            {eksemplar?.posisi || "Belum ditempatkan"}
                          </p>
                        </div>
                      </div>
                      {eksemplar?.tanggalMasuk && (
                        <div className="mt-2 text-xs text-gray-500">
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

export default PageDetailBuku;
