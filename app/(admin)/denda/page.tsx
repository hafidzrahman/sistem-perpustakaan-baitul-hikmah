"use client";

import TableSumbangan from "@/app/components/TableSumbangan";
import ModalTambahDenda from "@/app/components/modal/ModalTambahDenda";
import BtnSecondary from "@/app/components/BtnSecondary";
import { AddCircleHalfDotIcon } from "hugeicons-react";
import { useState, useEffect } from "react";
import { ambilSemuaDataSumbanganType } from "@/lib";

export default function Home() {
  const [dataSumbangan, setDataSumbangan] = useState<
    ambilSemuaDataSumbanganType[]
  >([]);
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState({});

  function handle() {
    setOpenModal((prev) => !prev);
  }

  function handleDetails(data: any) {
    setDataModal(data);
    setOpenModal((prev) => !prev);
  }

  useEffect(() => {
    async function fetching() {
      const response = await fetch("/api/sumbangan");
      const responseData = await response.json();
      setDataSumbangan(responseData);
    }

    fetching();
  }, [openModal]);

  return (
    <>
      <ModalTambahDenda status={openModal} handle={handle} />
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Selamat datang di Halaman Sumbangan
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="flex flex-col gap-4 order-last col-span-1 row-span-3 p-6 bg-white rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4">
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between sm:items-center mb-4">
            <h2 className="font-source-sans md:text-2xl text-xl text-primary font-bold">
              Daftar Sumbangan
            </h2>

            <div className="flex gap-2">
              <BtnSecondary
                label="Tambah Denda"
                icon={AddCircleHalfDotIcon}
                onClick={handle}
              />
            </div>
          </div>
          <TableSumbangan data={dataSumbangan} />
        </div>
      </div>
    </>
  );
}
