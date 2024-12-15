"use client";

import { muridType } from "@/lib";

import PeminjamanCalendar from "@/app/components/PeminjamanCalendar";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PageProps {}

const Page = ({ params }: { params: Promise<{ nis: string }> }) => {
  const [detailMurid, setDetailMurid] = useState<any | null>();

  useEffect(() => {
    const fetchDetailMurid = async () => {
      const { nis } = await params;
      console.log(nis);
      try {
        const response = await fetch(`/api/murid/${nis}`);
        const data = await response.json();
        console.log(data);
        setDetailMurid(data);
      } catch (error) {
        console.error("Gagal mengambil detail buku:", error);
      }
    };

    fetchDetailMurid();
  }, []);

  if (!detailMurid) {
    return <div>bentar</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
      <div className="order-1 col-span-1 p-6 bg-white-custom rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-2 sm:col-span-2 lg:col-span-3 flex flex-col">
        <h1 className="font-source-sans text-2xl text-primary font-bold">
          Profil
        </h1>
        <div className="flex py-4 gap-4">
          <div className="w-24 relative h-full rounded-lg border-2 border-black-custom">
            <Image src={"/img/boy.webp"} alt="boy-profile" fill />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-medium font-source-serif">
              {detailMurid.nis}
            </h2>
            <h1 className="text-4xl font-bold leading-none font-source-serif">
              {detailMurid.nama}
            </h1>
          </div>
        </div>
      </div>

      <div className="relative order-4 col-span-1 p-6 bg-white gap-2 flex flex-col border-2 rounded-lg overflow-hidden border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none lg:col-span-1">
        <h1 className="font-source-sans text-2xl text-center text-primary font-bold">
          Kalender
        </h1>
        {/* <PeminjamanCalendar /> */}
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
