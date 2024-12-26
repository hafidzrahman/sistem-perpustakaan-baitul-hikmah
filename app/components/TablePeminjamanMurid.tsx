// TablePeminjamanMurid.tsx
import React from "react";
import { BookOpen01Icon, Search01Icon } from "hugeicons-react";
import { bukuType, peminjamanType } from "@/lib";

interface TablePeminjamanMuridProps {
  data: peminjamanType[];
  bukuList: bukuType[];
  studentNIS: string;
}

const TablePeminjamanMurid = ({
  data = [],
  bukuList = [],
  studentNIS,
}: TablePeminjamanMuridProps) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const getBukuData = (isbn: string) => {
    if (!bukuList || !isbn) return null;
    return bukuList.find((b) => b.isbn === isbn);
  };

  const filteredData = React.useMemo(() => {
    if (!data) return [];

    const studentLoans = data.filter((item) => item.nis === studentNIS);

    return studentLoans.filter((item) => {
      if (!searchQuery) return true;

      const bukuInfo = getBukuData(item.bukuPinjaman?.[0]?.bukuISBN || "");
      const searchLower = searchQuery.toLowerCase();

      return bukuInfo?.judul?.toLowerCase().includes(searchLower);
    });
  }, [data, searchQuery, bukuList, studentNIS]);

  if (!data || !bukuList) {
    return <div className="w-full p-4 text-center">Data tidak tersedia</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari berdasarkan judul buku..."
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
        {filteredData.map((item, index) => {
          const bukuInfo = getBukuData(item.bukuPinjaman?.[0]?.bukuISBN || "");

          return (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border-2 border-primary"
            >
              <div className="space-y-2">
                <h3 className="font-source-serif font-semibold text-lg">
                  {bukuInfo?.judul || "Judul tidak tersedia"}
                </h3>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Tanggal Pinjam:</span>{" "}
                    {item.tanggalPinjam
                      ? new Date(item.tanggalPinjam).toLocaleString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Tanggal tidak tersedia"}
                  </p>
                  <p>
                    <span className="font-semibold">Tenggat:</span>{" "}
                    {item.bukuPinjaman?.[0]?.tenggatWaktu
                      ? new Date(
                          item.bukuPinjaman[0].tenggatWaktu
                        ).toLocaleString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Tidak ada tenggat"}
                  </p>
                  <div className="mt-2 flex justify-end">
                    <div className="px-2 py-0.5 border border-jewel-green bg-pastel-green rounded-full flex justify-between items-center text-jewel-green">
                      <span className="inline-block w-2 h-2 rounded-full bg-jewel-green"></span>
                      <p className="text-xs ml-1">Masih Dipinjam</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block border border-primary rounded-lg max-h-80 overflow-y-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-light-primary text-white sticky top-0 z-10">
              <th className="px-4 py-2 text-left w-1/12">ID</th>
              <th className="px-4 py-2 text-left w-4/12">Judul Buku</th>
              <th className="px-4 py-2 text-center w-3/12">Tanggal Pinjam</th>
              <th className="px-4 py-2 text-center w-3/12">Tenggat</th>
              <th className="px-4 py-2 text-center w-1/12">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => {
              const bukuInfo = getBukuData(
                item.bukuPinjaman?.[0]?.bukuISBN || ""
              );

              return (
                <tr
                  key={index}
                  className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
                >
                  <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                    {item.id}
                  </td>
                  <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                    {bukuInfo?.judul || "Judul tidak tersedia"}
                  </td>
                  <td className="px-4 py-2 text-sm text-center">
                    {item.tanggalPinjam
                      ? new Date(item.tanggalPinjam).toLocaleString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Tanggal tidak tersedia"}
                  </td>
                  <td className="px-4 py-2 text-sm text-center">
                    {item.bukuPinjaman?.[0]?.tenggatWaktu
                      ? new Date(
                          item.bukuPinjaman[0].tenggatWaktu
                        ).toLocaleString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Tidak ada tenggat"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <div className="px-2 py-0.5 border border-jewel-green bg-pastel-green rounded-full flex justify-between items-center text-jewel-green">
                        <span className="inline-block w-2 h-2 rounded-full bg-jewel-green"></span>
                        <p className="text-xs ml-1">Masih</p>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePeminjamanMurid;
