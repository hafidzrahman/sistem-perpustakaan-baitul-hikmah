import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Delete02Icon, Search01Icon, PencilEdit01Icon } from "hugeicons-react";
import { ambilSemuaDataSumbanganType } from "@/lib";
import ModalDetailSumbangan from "@/app/components/modal/ModalDetailBayarSumbangan";

const TableSumbangan = ({ data }: { data: ambilSemuaDataSumbanganType[] }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sumbanganId, setSumbanganId] = useState<number | null | undefined>(
    null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOnClick(id: number) {
    setSumbanganId(id);
    setIsOpen(true);
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const filteredData = data?.filter(
    (data) =>
      data.murid?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.guru?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.id?.toString().includes(searchQuery)
  );

  return (
    <>
      <ModalDetailSumbangan
        key={sumbanganId}
        isOpen={isOpen}
        onClose={() => setIsOpen((prev) => !prev)}
        sumbanganId={sumbanganId}
      />
      <div className="w-full space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border-2 border-primary rounded-lg focus:outline-none focus:border-dark-primary"
          />
          <Search01Icon
            className="absolute left-3 top-[30%] transform -translate-y-1/2 text-gray-400"
            width={20}
            height={20}
          />
        </div>

        {/* Mobile and Tablet View (Card Layout) */}
        <div className="lg:hidden space-y-4 h-full">
          {filteredData?.map((item, index: number) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border-2 border-primary"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-source-serif font-semibold text-lg">
                      ID: {item.id}
                    </h3>
                    <p className="text-sm font-source-sans">
                      {item.guru?.nama || item.murid?.nama}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Delete02Icon className="w-5 h-5 text-jewel-red" />
                    <PencilEdit01Icon className="w-5 h-5 text-jewel-blue" />
                  </div>
                </div>

                <div className="px-3 py-1.5 bg-light-primary text-white-custom text-sm rounded-full text-center">
                  {item.keterangan.keterangan}
                </div>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Jenis:</span>{" "}
                    {item.denda ? "Denda" : "Sumbangan"}
                  </p>
                  <p>
                    <span className="font-semibold">Tanggal Selesai:</span>{" "}
                    {formatDate(item.tanggalSelesai)}
                  </p>
                </div>

                <button
                  onClick={() => handleOnClick(item.id!)}
                  className="w-full bg-dark-primary text-white-custom font-source-sans py-2 px-4 rounded-lg border-2 border-black text-sm hover:shadow-sm transition-all duration-300"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (Table Layout) */}
        <div className="hidden lg:block border border-primary rounded-lg max-h-[28rem] overflow-y-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-light-primary text-white sticky top-0 z-10">
                <th className="px-4 py-2 text-left w-1/12">ID</th>
                <th className="px-4 py-2 text-left w-3/12">Nama</th>
                <th className="px-4 py-2 text-center w-3/12">Keterangan</th>
                <th className="px-4 py-2 text-left w-2/12">Jenis</th>
                <th className="px-4 py-2 text-center w-2/12">
                  Tanggal Selesai
                </th>
                <th className="px-2 py-2 text-center w-1/12">Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item, index: number) => (
                <tr
                  key={index}
                  className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
                >
                  <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                    {item.id}
                  </td>
                  <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                    {item.guru?.nama || item.murid?.nama}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="inline-block px-3 py-1 bg-light-primary text-white-custom text-xs rounded-full">
                      {item.keterangan.keterangan}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {item.denda ? "Denda" : "Sumbangan"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {formatDate(item.tanggalSelesai)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleOnClick(item.id!)}
                      className="bg-dark-primary text-white-custom font-source-sans py-1 px-2 w-full rounded-lg border-2 border-black text-xs hover:shadow-sm transition-all duration-300"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableSumbangan;
