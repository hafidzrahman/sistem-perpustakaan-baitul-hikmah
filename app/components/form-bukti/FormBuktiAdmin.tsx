"use client";
import DoughnutChartGenreBuku from "@/app/components/charts/DoughnutChartGenreBuku";
import LineChartPeminjaman from "@/app/components/charts/LineChartPeminjaman";
import TablePeminjaman from "@/app/components/TablePeminjaman";
import { bookType, muridType, guruType } from "@/lib";

import {
  Mortarboard01Icon,
  TeacherIcon,
  BookOpen02Icon,
} from "hugeicons-react";
import { useEffect, useState } from "react";
import DoughnutChartFormBukti from "../charts/DoughnutChartFormBukti";
import LineChartFormBukti from "../charts/LineChartFormBukti";
import TableFormBukti from "../TableFormBukti";

interface FormBuktiAdminProps {}

const FormBuktiAdmin = ({}: FormBuktiAdminProps) => {
  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Assalamu'alaikum wr wb., Ustadzah Fulanah, S. Pd., M. Pd. ,
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="order-1 col-span-1 p-6 bg-white-custom  rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-2 dark-gray sm:col-span-2 lg:col-span-2 xl:col-span-3">
          <LineChartFormBukti />
        </div>

        <div className="relative order-4 col-span-1 p-6 bg-white border-2  rounded-lg border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none xl:col-span-1 lg:col-span-2">
          <h1 className="font-source-sans md:text-2xl text-xl text-primary font-bold text-center">
            Status Form Bukti
          </h1>
          <DoughnutChartFormBukti />
        </div>
        <div className="flex flex-col max-h-[380px] order-last col-span-1 row-span-2 p-6 overflow-y-auto bg-white  rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-2 xl:col-span-4 lg:row-span-2 dark-gray">
          <h1 className="font-source-sans md:text-2xl text-xl text-primary font-bold mb-4">
            Riwayat Ajuan Form Bukti
          </h1>
          <TableFormBukti />
        </div>
      </div>
    </>
  );
};

export default FormBuktiAdmin;
