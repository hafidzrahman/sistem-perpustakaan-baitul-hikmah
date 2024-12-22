"use client";

import BtnSecondary from "@/app/components/BtnSecondary";
import CardLeaderboardMurid from "@/app/components/CardLeaderboardMurid";
import BarChartMurid from "@/app/components/charts/BarChartMurid";
import TableMurid from "@/app/components/TableMurid";
import { AddCircleHalfDotIcon } from "hugeicons-react";
import { useEffect, useState } from "react";
import ModalTambahKelas from "@/app/components/modal/ModalTambahKelas";
import ModalTambahMurid from "@/app/components/modal/ModalTambahMurid";

interface MuridPageProps {
  onclick: () => void;
}

const MuridPage = ({}: MuridPageProps) => {
  const [murid, setMurid] = useState();
  const [tambahKelas, setTambahKelas] = useState(false);
  const [tambahMurid, setTambahMurid] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data berdasarkan pencarian

  const handleTambahKelas = () => {
    setTambahKelas(!tambahKelas);
  };
  const handleTambahMurid = () => {
    setTambahMurid(!tambahMurid);
  };

  useEffect(() => {
    const fetchMurid = async () => {
      const respon = await fetch("/api/murid");
      const data = await respon.json();
      console.log(data);
      setMurid(data);
    };
    fetchMurid();
  }, [tambahMurid]);

  useEffect(() => {
    const fetchKelas = async () => {
      const respon = await fetch("/api/murid");
      const data = await respon.json();
      setMurid(data);
    };
    fetchKelas();
  }, [tambahKelas]);

  return (
    <>
      <ModalTambahKelas status={tambahKelas} handle={handleTambahKelas} />
      <ModalTambahMurid status={tambahMurid} handle={handleTambahMurid} />
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Assalamu'alaikum wr wb., Ustadzah Fulanah, S. Pd., M. Pd.,
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="order-1 col-span-1 p-6 bg-white-custom rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-2 sm:col-span-2 lg:col-span-3">
          <h1 className="font-source-sans text-2xl text-primary font-bold">
            Statistik Kelas
          </h1>
          <BarChartMurid />
        </div>

        <div className="relative order-4 col-span-1 p-6 bg-white border-2 rounded-lg overflow-hidden border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none lg:col-span-1">
          <h1 className="font-source-sans text-2xl text-center text-primary font-bold">
            Papan Peringkat
          </h1>
          <div className="flex flex-col max-h-96 my-4 gap-2 overflow-y-auto">
            <CardLeaderboardMurid
              name="Muhammad Faruq"
              kelas="7 Al-fatih"
              booksRead={20}
              totalBooksToRead={20}
            />
            <CardLeaderboardMurid
              name="Muhammad Aditya Rinaldi"
              kelas="8 Al-fatih"
              booksRead={16}
              totalBooksToRead={20}
            />
            <CardLeaderboardMurid
              name="Hafidz Alhadid Rahman"
              kelas="9 Al-fatih"
              booksRead={12}
              totalBooksToRead={20}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 order-last col-span-1 row-span-2 p-6 bg-white  rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 dark-gray">
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between sm:items-center mb-4">
            <h2 className="font-source-sans md:text-2xl text-xl text-primary font-bold">
              Daftar Murid
            </h2>

            <div className="flex gap-2">
              <BtnSecondary
                label="Tambah Kelas"
                icon={AddCircleHalfDotIcon}
                onClick={handleTambahKelas}
              />
              <BtnSecondary
                label="Tambah Murid"
                icon={AddCircleHalfDotIcon}
                onClick={handleTambahMurid}
              />
            </div>
          </div>
          {/* <div className="rounded-lg overflow-hidden md:border-black-custom border"> */}
          <TableMurid data={murid} />
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default MuridPage;
