"use client";

import { muridType } from "@/lib";

import PeminjamanCalendar from "@/app/components/PeminjamanCalendar";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PageProps {}

const Page = ({ params }: { params: Promise<{ nis: string }> }) => {
  const [detailMurid, setDetailMurid] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailMurid = async () => {
      const { nis } = await params;
      try {
        const response = await fetch(`/api/murid/${nis}`);
        const data = await response.json();
        setDetailMurid(data);
      } catch (error) {
        console.error("Failed to fetch student details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailMurid();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!detailMurid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Data tidak ditemukan</p>
      </div>
    );
  }
  const kelas = detailMurid.riwayatKelas[0].kelas.tingkat
    ? `${detailMurid.riwayatKelas[0].kelas.tingkat} ${detailMurid.riwayatKelas[0].kelas.nama}`
    : "Tidak Diketahui";

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

  const loans = [
    { date: "2024-12-01", bookTitle: "The Great Gatsby" },
    { date: "2024-12-05", bookTitle: "1984" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
      <div className="order-1 col-span-1 p-6 bg-white-custom rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-2 sm:col-span-2 flex flex-col">
        <div className="w-full flex justify-between">
          <h1 className="font-source-sans text-2xl text-primary font-bold">
            Profil
          </h1>
          <div
            className={`${
              kelas.includes("7")
                ? `${bg[0]} ${border[0]}`
                : kelas.includes("8")
                ? `${bg[1]} ${border[1]}`
                : `${bg[4]} ${border[4]}`
            } flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans text-xs rounded-full py-2 px-3`}
          >
            {kelas}
          </div>
        </div>
        <div className="flex py-4 gap-4 h-full">
          <div className="w-44 relative rounded-lg">
            <Image
              src={"/img/boy.jpeg"}
              alt="boy-profile"
              fill
              className="rounded-lg border-black-custom border-2"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-medium  font-source-serif">
              {detailMurid.nis}
            </h2>
            <h1 className="text-2xl font-bold leading-none font-source-serif">
              {detailMurid.nama}
            </h1>
            <p className="text-sm">{detailMurid.alamat}</p>
          </div>
        </div>
      </div>

      <div className="relative order-4 col-span-1 p-6 bg-white gap-2 flex flex-col border-2 rounded-lg overflow-hidden border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none">
        <h1 className="font-source-sans text-2xl text-primary font-bold">
          Kalender
        </h1>
        <PeminjamanCalendar loans={detailMurid.Peminjaman} />
      </div>
      <div className="flex flex-col gap-4 order-last col-span-1 row-span-2 p-6 bg-white rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 dark-gray">
        <div className="w-full flex px-2 justify-between items-center">
          <h1 className="font-source-sans text-2xl text-primary font-bold">
            Daftar Bukti Bacaan
          </h1>
        </div>
        <div className="rounded-lg overflow-hidden border-black-custom border"></div>
      </div>
    </div>
  );
};

export default Page;
