import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Delete02Icon,
  HijabIcon,
  MuslimIcon,
  PencilEdit01Icon,
  Search01Icon,
  SmartPhone01Icon,
} from "hugeicons-react";

const TableGuru = ({ data }: { data: any }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data berdasarkan pencarian
  const filteredData = data?.filter(
    (item: any) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau NIP..."
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
        {filteredData?.map((item: any, index: number) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border-2 border-primary"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-source-serif font-semibold text-lg">
                    {item.nama}
                  </h3>
                  <p className="text-sm font-source-sans">NIP: {item.nip}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Delete02Icon className="w-5 h-5 text-jewel-red" />
                  <PencilEdit01Icon className="w-5 h-5 text-jewel-blue" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">{item.kontak}</span>
                {item.jenisKelamin === "PEREMPUAN" ? (
                  <HijabIcon
                    className="text-jewel-red"
                    width={24}
                    height={24}
                  />
                ) : (
                  <MuslimIcon
                    className="text-jewel-blue"
                    width={24}
                    height={24}
                  />
                )}
              </div>

              <p className="text-sm">
                <span className="font-semibold">Alamat:</span> {item.alamat}
              </p>

              <button
                onClick={() =>
                  router.push(`http://localhost:3000/guru/${item.nip}`)
                }
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
              <th className="px-4 py-2 text-left w-1/12">NIP</th>
              <th className="px-4 py-2 text-left w-3/12">Nama</th>
              <th className="px-4 py-2 text-left w-2/12">Kontak</th>
              <th className="px-4 py-2 text-left w-3/12">Alamat</th>
              <th className="px-4 py-2 text-center w-1/12">Jenis Kelamin</th>
              <th className="px-4 py-2 text-center w-1/12">Aksi</th>
              <th className="px-2 py-2 text-center w-1/12">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item: any, index: number) => (
              <tr
                key={index}
                className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
              >
                <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                  {item.nip}
                </td>
                <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                  {item.nama}
                </td>
                <td className="px-4 py-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.kontak}</span>
                  </div>
                </td>
                <td className="px-4 py-2">{item.alamat}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center">
                    {item.jenisKelamin === "PEREMPUAN" ? (
                      <HijabIcon
                        className="text-jewel-red"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <MuslimIcon
                        className="text-jewel-blue"
                        width={24}
                        height={24}
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Delete02Icon className="w-5 h-5 text-jewel-red" />
                    <PencilEdit01Icon className="w-5 h-5 text-jewel-blue" />
                  </div>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() =>
                      router.push(`http://localhost:3000/guru/${item.nip}`)
                    }
                    type="submit"
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
  );
};

export default TableGuru;
