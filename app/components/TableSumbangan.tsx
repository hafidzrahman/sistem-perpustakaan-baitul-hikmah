import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Delete02Icon,
  HijabIcon,
  MuslimIcon,
  PencilEdit01Icon,
  Search01Icon,
} from "hugeicons-react";
import {ambilSemuaDataSumbanganType } from "@/lib";
import ModalDetailSumbangan from "@/app/components/modal/ModalDetailBayarSumbangan"

const TableSumbangan = ({ data }: { data: ambilSemuaDataSumbanganType[] }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sumbanganId, setSumbanganId] = useState<number | null | undefined>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Filter data berdasarkan pencarian

  function handleOnClick(id : number) {
      setSumbanganId(id)
      setIsOpen(true)
  }


  return <>
  <ModalDetailSumbangan key={sumbanganId} isOpen={isOpen} onClose={() => setIsOpen(prev => !prev)} sumbanganId={sumbanganId} />
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
      <div className="lg:hidden space-y-4">
        {data?.filter(data => data.murid?.nama.includes(searchQuery) 
            || data.guru?.nama.includes(searchQuery)
            || data.id?.toString().includes(searchQuery)
          ).map((item, index: number) => {
          return (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border-2 border-primary"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-source-serif font-semibold text-lg">
                      {item.id}
                    </h3>
                    <p className="text-sm font-source-sans">NIS: {item.guru?.nama || item.murid?.nama}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Delete02Icon className="w-5 h-5 text-jewel-red" />
                    <PencilEdit01Icon className="w-5 h-5 text-jewel-blue" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-white-custom text-sm`}
                  >
                    {item.keterangan.keterangan}
                  </div>
                </div>

                <p className="text-sm font-semibold">
                  <span >Jenis: </span> {item.denda ? "Denda" : "Sumbangan"}
                </p>

                <p className="text-sm font-semibold">
                  <span >Tanggal Selesai: </span> {item.tanggalSelesai?.toLocaleString() || '-'}
                </p>

                <button
                  onClick={() =>
                    router.push(`http://localhost:3000/murid/${item.nis}`)
                  }
                  className="w-full bg-dark-primary text-white-custom font-source-sans py-2 px-4 rounded-lg border-2 border-black text-sm hover:shadow-sm transition-all duration-300"
                >
                  Detail
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View (Table Layout) */}
      <div className="hidden lg:block border border-primary rounded-lg max-h-80 overflow-y-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-light-primary text-white sticky top-0 z-10">
              <th className="px-4 py-2 text-left w-1/12">ID</th>
              <th className="px-4 py-2 text-left w-3/12">Nama</th>
              <th className="px-4 py-2 text-center w-2/12">Keterangan</th>
              <th className="px-4 py-2 text-left w-3/12">Jenis</th>
              <th className="px-4 py-2 text-center w-1/12">Tanggal Selesai</th>
              <th className="px-2 py-2 text-center w-1/12"></th>
              <th className="px-2 py-2 text-center w-1/12">Detail</th>
            </tr>
          </thead>
          <tbody>
            {data?.filter(data => data.murid?.nama.includes(searchQuery) 
            || data.guru?.nama.includes(searchQuery)
            || data.id?.toString().includes(searchQuery)
          ).map((item, index: number) => {

              return (
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
                  <td className="px-4 py-2 font-source-sans text-center">
                    <div
                      className={`flex justify-center items-center gap-2 border-2 font-source-sans leading-none text-xs rounded-full py-2 px-3`}
                    >
                      {item.keterangan.keterangan}
                    </div>
                  </td>
                  <td className="px-4 py-2">{item.denda?.id ? "Denda" : "Sumbangan"}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center">
                    {item.tanggalSelesai?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleOnClick(item.id!)
                      }
                      type="submit"
                      className="bg-dark-primary text-white-custom font-source-sans py-1 px-2 w-full rounded-lg border-2 border-black text-xs hover:shadow-sm transition-all duration-300"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </>;
};

export default TableSumbangan;
