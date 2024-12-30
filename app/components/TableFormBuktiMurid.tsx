"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { Search01Icon } from "hugeicons-react";
import { FBType } from "@/lib";

interface TableFormBuktiMuridProps {
  data: FBType[];
}

const TableFormBuktiMurid = ({ data = [] }: TableFormBuktiMuridProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = React.useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      if (!searchQuery) return true;

      const searchLower = searchQuery.toLowerCase();
      return (
        item.buku?.judul?.toLowerCase().includes(searchLower) ||
        item.intisari?.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchQuery]);

  if (!data) {
    return <div className="w-full p-4 text-center">Data tidak tersedia</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari berdasarkan judul buku atau nama peminjam..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-1 pl-10 border-2 border-primary rounded-lg focus:outline-none placeholder:text-xs focus:border-dark-primary"
        />
        <Search01Icon
          className="absolute left-3 top-[30%] transform -translate-y-1/2 text-gray-400"
          width={12}
          height={12}
        />
      </div>

      {/* Mobile and Tablet View */}
      <div className="lg:hidden space-y-4">
        {filteredData.map((record, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border-2 border-primary"
          >
            <div className="space-y-3">
              <div>
                <h3 className="font-source-serif font-semibold text-lg">
                  {record.buku.judul}
                </h3>
                <p className="text-sm text-gray-500">
                  ISBN: {record.buku.isbn}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Tanggal:</span>{" "}
                  {format(new Date(record.tanggal), "dd MMMM yyyy")}
                </p>
                <p>
                  <span className="font-semibold">Halaman:</span>{" "}
                  {record.halamanAwal} - {record.halamanAkhir}
                </p>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status
                        ? "bg-pastel-green text-jewel-green"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.status ? "Terverifikasi" : "Menunggu"}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-1">Intisari:</p>
                <p className="text-sm text-gray-600">{record.intisari}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block border border-primary rounded-lg max-h-80 overflow-y-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-light-primary text-white sticky top-0 z-10">
              <th className="px-4 py-2 text-left w-1/12">Tanggal</th>
              <th className="px-4 py-2 text-left w-3/12">Buku</th>
              <th className="px-4 py-2 text-center w-1/12">Halaman</th>
              <th className="px-4 py-2 text-center w-1/12">Status</th>
              <th className="px-4 py-2 text-left w-6/12">Intisari</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => (
              <tr
                key={index}
                className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
              >
                <td className="px-4 py-2 text-xs">
                  {format(new Date(record.tanggal), "dd MMM yyyy")}
                </td>
                <td className="px-4 py-2">
                  <div className="text-sm font-source-serif font-semibold">
                    {record.buku.judul}
                  </div>
                  <div className="text-xs text-gray-500">
                    {record.buku.isbn}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-center">
                  {record.halamanAwal} - {record.halamanAkhir}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center">
                    <span
                      className={`px-2 py-0.5 text-xs leading-5 font-semibold rounded-full ${
                        record.status
                          ? "bg-pastel-green text-jewel-green"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.status ? "Terverifikasi" : "Menunggu"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <div>
                    <p className="line-clamp-1 transition-all duration-300">
                      {record.intisari}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Belum ada riwayat bacaan buku
        </div>
      )}
    </div>
  );
};

export default TableFormBuktiMurid;
