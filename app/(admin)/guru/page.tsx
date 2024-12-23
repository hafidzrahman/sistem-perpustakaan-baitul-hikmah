"use client";

import BtnSecondary from "@/app/components/BtnSecondary";
import TableGuru from "@/app/components/TableGuru";
import { AddCircleHalfDotIcon } from "hugeicons-react";
import { useEffect, useState } from "react";

interface GuruPageProps {
  onclick: () => void;
}

const GuruPage = ({}: GuruPageProps) => {
  const [guru, setGuru] = useState();
  const [tambahGuru, setTambahGuru] = useState(false);

  const handleTambahGuru = () => {
    setTambahGuru(!tambahGuru);
  };

  useEffect(() => {
    const fetchGuru = async () => {
      const respon = await fetch("/api/guru");
      const data = await respon.json();
      console.log(data);
      setGuru(data);
    };
    fetchGuru();
  }, [tambahGuru]);

  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Selamat datang di Halaman Guru
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="order-1 col-span-1 p-6 bg-white-custom rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-2 sm:col-span-2 lg:col-span-3">
          <h1 className="font-source-sans text-2xl text-primary font-bold">
            Statistik Guru
          </h1>
        </div>

        <div className="relative order-4 col-span-1 p-6 bg-white border-2 rounded-lg overflow-hidden border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none lg:col-span-1">
          <h1 className="font-source-sans text-2xl text-center text-primary font-bold">
            Ringkasan
          </h1>
          <div className="flex flex-col gap-4 mt-4">
            <div className="p-4 rounded-lg bg-light-primary">
              <h3 className="text-white font-semibold mb-2">Total Guru</h3>
              <p className="text-2xl text-white font-bold">15</p>
            </div>
            <div className="p-4 rounded-lg bg-jewel-blue">
              <h3 className="text-white font-semibold mb-2">Guru Aktif</h3>
              <p className="text-2xl text-white font-bold">12</p>
            </div>
            <div className="p-4 rounded-lg bg-jewel-green">
              <h3 className="text-white font-semibold mb-2">Guru Baru</h3>
              <p className="text-2xl text-white font-bold">3</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 order-last col-span-1 row-span-2 p-6 bg-white rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2">
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between sm:items-center mb-4">
            <h2 className="font-source-sans md:text-2xl text-xl text-primary font-bold">
              Daftar Guru
            </h2>

            <div className="flex gap-2">
              <BtnSecondary
                label="Tambah Guru"
                icon={AddCircleHalfDotIcon}
                onClick={handleTambahGuru}
              />
            </div>
          </div>
          <TableGuru data={guru} />
        </div>
      </div>
    </>
  );
};

export default GuruPage;
