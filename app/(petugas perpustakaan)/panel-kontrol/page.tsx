"use client";
import BukuGenreDoughnutChart from "@/app/components/BukuGenreDoughnutChart";
import PeminjamanLineChart from "@/app/components/PeminjamanLineChart";
import {
  Mortarboard01Icon,
  TeacherIcon,
  BookOpen02Icon,
} from "hugeicons-react";
interface PageProps {}

const Page = ({}: PageProps) => {
  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Assalamu'alaikum wr wb., Ustadzah Fulanah, S. Pd., M. Pd. ,
        </h2>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="border-jewel-blue flex items-center w-full px-8 py-6 border-2 justify-between bg-pastel-blue rounded-lg">
          <div className="flex flex-col">
            <h2 className="font-medium -mb-2">Murid</h2>
            <h1 className="font-black font-source-serif text-5xl">338</h1>
          </div>
          <Mortarboard01Icon className="text-jewel-blue w-16 h-16" />
        </div>
        <div className="border-jewel-red flex items-center w-full px-8 py-6 border-2 justify-between bg-pastel-red rounded-lg">
          <div className="flex flex-col">
            <h2 className="font-medium -mb-2">Guru</h2>
            <h1 className="font-black font-source-serif text-5xl">048</h1>
          </div>
          <TeacherIcon className="text-jewel-red w-16 h-16" />
        </div>
        <div className="border-jewel-purple flex items-center w-full px-8 py-6 border-2 justify-between bg-pastel-purple rounded-lg">
          <div className="flex flex-col">
            <h2 className="font-medium -mb-2">Buku</h2>
            <h1 className="font-black font-source-serif text-5xl">794</h1>
          </div>
          <BookOpen02Icon className="text-jewel-purple w-16 h-16" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="order-1 col-span-1 p-6 bg-white-custom  rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-2 dark-gray sm:col-span-2 lg:col-span-3">
          <PeminjamanLineChart />
        </div>

        <div className="relative order-4 col-span-1 p-6 bg-white border-2  rounded-lg border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none lg:col-span-1">
          <h1 className="font-source-sans text-2xl text-center text-primary font-bold">
            Status Buku
          </h1>
          <BukuGenreDoughnutChart />
        </div>
        <div className="flex flex-col max-h-[380px] order-last col-span-1 row-span-2 p-6 overflow-y-auto bg-white  rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 dark-gray">
          <h1 className="font-source-sans text-2xl text-primary font-bold">
            Riwayat Peminjaman
          </h1>
        </div>
      </div>
    </>
  );
};

export default Page;
