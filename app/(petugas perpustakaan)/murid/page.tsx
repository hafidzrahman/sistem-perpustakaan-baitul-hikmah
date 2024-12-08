"use client";

import BtnSecondary from "@/app/components/BtnSecondary";
import CardData from "@/app/components/CardData";
import CardTambahKelas from "@/app/components/CardTambahKelas";
import CardTambahMurid from "@/app/components/CardTambahMurid";
import MuridBarChart from "@/app/components/MuridBarChart";
import PeminjamanCalendar from "@/app/components/PeminjamanCalendar";
import TableMurid from "@/app/components/TableMurid";
import {
  Mortarboard01Icon,
  TeacherIcon,
  BookOpen02Icon,
  Agreement02Icon,
  AddCircleHalfDotIcon,
} from "hugeicons-react";
import { useEffect, useState } from "react";

interface MuridPageProps {
  onclick: () => void;
}

const MuridPage = ({}: MuridPageProps) => {
  const totalMurid = 791;
  const jumlahMuridPerKelas = {
    "Kelas 1": 100,
    "Kelas 2": 110,
    "Kelas 3": 105,
    "Kelas 4": 120,
    "Kelas 5": 130,
    "Kelas 6": 126,
  };

  const [murid, setMurid] = useState();
  const [tambahKelas, setTambahKelas] = useState(false);
  const [tambahMurid, setTambahMurid] = useState(false);

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
      <CardTambahKelas status={tambahKelas} handle={handleTambahKelas} />
      <CardTambahMurid status={tambahMurid} handle={handleTambahMurid} />
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Assalamu'alaikum wr wb., Ustadzah Fulanah, S. Pd., M. Pd.,
        </h2>
      </div>
      <div className="flex justify-between gap-4 mb-4">
        <CardData
          number={totalMurid.toString()}
          label="Murid"
          icon={Mortarboard01Icon}
        />
        <CardData number="048" label="Guru" icon={TeacherIcon} />
        <CardData number="794" label="Buku" icon={BookOpen02Icon} />
        <CardData number="303" label="Peminjaman" icon={Agreement02Icon} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="order-1 col-span-1 p-6 bg-white-custom rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-2 sm:col-span-2 lg:col-span-3">
          <h1 className="font-source-sans text-2xl text-primary font-bold">
            Jumlah Murid per Kelas
          </h1>
          <MuridBarChart />
        </div>

        <div className="relative order-4 col-span-1 p-6 bg-white border-2 rounded-lg border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none lg:col-span-1">
          <h1 className="font-source-sans text-2xl text-center text-primary font-bold">
            Statistik Murid
          </h1>
          <PeminjamanCalendar />
        </div>
        <div className="flex flex-col gap-4 order-last col-span-1 row-span-2 p-6 bg-white  rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 dark-gray">
          <div className="w-full flex px-2 justify-between items-center">
            <h1 className="font-source-sans text-2xl text-primary font-bold">
              Daftar Murid
            </h1>
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
          <div className="rounded-lg overflow-hidden border-black-custom border">
            <TableMurid data={murid} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MuridPage;
