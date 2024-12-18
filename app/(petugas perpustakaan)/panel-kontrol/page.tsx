"use client";
import DoughnutChartGenreBuku from "@/app/components/charts/DoughnutChartGenreBuku";
import LineChartPeminjaman from "@/app/components/charts/LineChartPeminjaman";
import TablePeminjaman from "@/app/components/TablePeminjaman";
import { bukuType, muridType, guruType } from "@/lib";

import {
  Mortarboard01Icon,
  TeacherIcon,
  BookOpen02Icon,
} from "hugeicons-react";
import { useEffect, useState } from "react";
interface BerandaPageProps {}

const BerandaPage = ({}: BerandaPageProps) => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [data, setData] = useState<{
    buku: bukuType[];
    guru: guruType[];
    murid: muridType[];
  }>();

  useEffect(() => {
    const fetchPeminjaman = async () => {
      const response = await fetch("/api/peminjaman");
      const data = await response.json();
      setPeminjaman(data);
    };
    fetchPeminjaman();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch("http://localhost:3000/api/buku");

        const dataBuku = await response.json();
        if (!dataBuku) {
          throw new Error("Data buku ga ada");
        }

        response = await fetch("http://localhost:3000/api/guru");
        const dataGuru = await response.json();
        if (!dataGuru) {
          throw new Error("Data guru ga ada");
        }

        response = await fetch("http://localhost:3000/api/murid");
        const dataMurid = await response.json();
        if (!dataMurid) {
          throw new Error("Data murid ga ada");
        }
        setData({
          buku: dataBuku as bukuType[],
          guru: dataGuru as guruType[],
          murid: dataMurid as muridType[],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Assalamu'alaikum wr wb., Ustadzah Fulanah, S. Pd., M. Pd. ,
        </h2>
      </div>
      <div className="flex flex-col md:flex-col lg:flex-row gap-4 mb-4">
        <div className="border-jewel-blue flex items-center w-full px-8 py-6 border-2 justify-between bg-pastel-blue rounded-lg">
          <div className="flex flex-col">
            <h2 className="font-medium -mb-2">Murid</h2>
            <h1 className="font-black font-source-serif text-5xl">
              {data?.murid.length.toString().padStart(3, "0")}
            </h1>
          </div>
          <Mortarboard01Icon className="text-jewel-blue w-16 h-16" />
        </div>
        <div className="border-jewel-red flex items-center w-full px-8 py-6 border-2 justify-between bg-pastel-red rounded-lg">
          <div className="flex flex-col">
            <h2 className="font-medium -mb-2">Guru</h2>
            <h1 className="font-black font-source-serif text-5xl">
              {data?.guru.length.toString().padStart(3, "0")}
            </h1>
          </div>
          <TeacherIcon className="text-jewel-red w-16 h-16" />
        </div>
        <div className="border-jewel-purple flex items-center w-full px-8 py-6 border-2 justify-between bg-pastel-purple rounded-lg">
          <div className="flex flex-col">
            <h2 className="font-medium -mb-2">Buku</h2>
            <h1 className="font-black font-source-serif text-5xl">
              {data?.buku.length.toString().padStart(3, "0")}
            </h1>
          </div>
          <BookOpen02Icon className="text-jewel-purple w-16 h-16" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="order-1 col-span-1 p-6 bg-white-custom  rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-2 dark-gray sm:col-span-2 lg:col-span-2 xl:col-span-3">
          <LineChartPeminjaman />
        </div>

        <div className="relative order-4 col-span-1 p-6 bg-white border-2  rounded-lg border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none xl:col-span-1 lg:col-span-2">
          <h1 className="font-source-sans md:text-2xl text-xl text-primary font-bold text-center">
            Genre Buku
          </h1>
          <DoughnutChartGenreBuku />
        </div>
        <div className="flex flex-col max-h-[380px] order-last col-span-1 row-span-2 p-6 overflow-y-auto bg-white  rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-2 xl:col-span-4 lg:row-span-2 dark-gray">
          <h1 className="font-source-sans md:text-2xl text-xl text-primary font-bold mb-4">
            Riwayat Peminjaman
          </h1>
          <TablePeminjaman data={peminjaman} />
        </div>
      </div>
    </>
  );
};

export default BerandaPage;
