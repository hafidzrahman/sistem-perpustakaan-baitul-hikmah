"use client";

import BtnSecondary from "@/app/components/BtnSecondary";
import ModalTambahGuru from "@/app/components/modal/ModalTambahGuru";
import TableGuru from "@/app/components/TableGuru";
import { AddCircleHalfDotIcon } from "hugeicons-react";
import { useEffect, useState } from "react";

interface GuruPageProps {
  onclick: () => void;
}

const GuruPage = ({ onclick }: GuruPageProps) => {
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
      <ModalTambahGuru handle={handleTambahGuru} status={tambahGuru} />
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Selamat datang di Halaman Guru
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="flex flex-col gap-4 order-last col-span-1 row-span-3 p-6 bg-white rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4">
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
