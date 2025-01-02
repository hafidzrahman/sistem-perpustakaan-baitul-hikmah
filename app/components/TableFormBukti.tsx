"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search01Icon } from "hugeicons-react";
import ModalDetailFormBukti from "./modal/ModalDetailFormBukti";

interface FormBuktiType {
  intisari: string;
  halamanAwal: number;
  halamanAkhir: number;
  tanggal: string;
  status: boolean;
  buku: {
    judul: string;
  };
  murid: {
    nis: string;
    nama: string;
    riwayatKelas: {
      tahunAjaran: string;
    }[];
  };
}

const TableFormBukti = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<FormBuktiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Add this function to handle opening the detail modal
  const handleOpenDetail = (formId: number) => {
    setSelectedFormId(formId);
    setIsDetailModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/form-bukti");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      if (!searchQuery) return true;

      const searchLower = searchQuery.toLowerCase();
      return (
        item.buku.judul.toLowerCase().includes(searchLower) ||
        item.murid.nama.toLowerCase().includes(searchLower) ||
        item.murid.nis.toLowerCase().includes(searchLower) ||
        item.intisari.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchQuery]);

  if (loading) {
    return <div className="w-full p-4 text-center">Loading...</div>;
  }

  if (!data) {
    return <div className="w-full p-4 text-center">Data tidak tersedia</div>;
  }

  return (
    <>
      <ModalDetailFormBukti
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        formBuktiId={selectedFormId}
      />
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
                    {record.murid.nama}
                  </h3>
                  <p className="text-sm text-gray-500">
                    NIS: {record.murid.nis}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tahun Ajaran: {record.murid.riwayatKelas[0].tahunAjaran}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Buku: {record.buku.judul}</h4>
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
                <button
                  onClick={() => handleOpenDetail(record.id)}
                  className="px-3 py-1 text-sm bg-light-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-300"
                >
                  Detail
                </button>
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
                <th className="px-4 py-2 text-left w-2/12">Siswa</th>
                <th className="px-4 py-2 text-left w-2/12">Buku</th>
                <th className="px-4 py-2 text-center w-1/12">Halaman</th>
                <th className="px-4 py-2 text-center w-1/12">Status</th>
                <th className="px-4 py-2 text-left w-4/12">Intisari</th>
                <th className="px-4 py-2 text-center w-1/12">Aksi</th>
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
                      {record.murid.nama}
                    </div>
                    <div className="text-xs text-gray-500">
                      NIS: {record.murid.nis}
                    </div>
                    <div className="text-xs text-gray-500">
                      TA: {record.murid.riwayatKelas[0].tahunAjaran}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm font-source-serif font-semibold">
                      {record.buku.judul}
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
                    {record.intisari}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleOpenDetail(record.id)}
                      className="bg-primary w-full text-white-custom font-source-sans leading-none text-xs rounded-md border-2 border-black-custom py-2 font-normal transition-all duration-300 hover:font-bold hover:shadow-sm hover:transition-all hover:duration-300"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada form bukti yang ditemukan
          </div>
        )}
      </div>
    </>
  );
};

export default TableFormBukti;
