import React from "react";
import { useRouter } from "next/navigation";
import {
  Delete02Icon,
  HijabIcon,
  MuslimIcon,
  PencilEdit01Icon,
  Search01Icon,
} from "hugeicons-react";
import { bukuType, guruType, muridType, peminjamanType } from "@/lib";

interface TablePeminjamanProps {
  data: peminjamanType[];
  bukuList: bukuType[];
  guruList: guruType[];
  muridList: muridType[];
}

const TablePeminjaman = ({
  data = [],
  bukuList = [],
  guruList = [],
  muridList = [],
}: TablePeminjamanProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const getBukuData = (isbn: string) => {
    if (!bukuList || !isbn) return null;
    return bukuList.find((b) => b.isbn === isbn);
  };

  const getPeminjamData = (nis?: string, nip?: string) => {
    if (!muridList || !guruList) return null;
    if (nis) {
      return muridList.find((m) => m.nis === nis);
    }
    if (nip) {
      return guruList.find((g) => g.nip === nip);
    }
    return null;
  };

  const filteredData = React.useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      if (!searchQuery) return true;

      const bukuInfo = getBukuData(item.bukuPinjaman?.[0]?.bukuISBN || "");
      const peminjam = getPeminjamData(item.nis, item.nip);
      const searchLower = searchQuery.toLowerCase();

      return (
        bukuInfo?.judul?.toLowerCase().includes(searchLower) ||
        peminjam?.nama?.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchQuery, bukuList, guruList, muridList]);

  if (!data || !bukuList || !guruList || !muridList) {
    return <div className="w-full p-4 text-center">Data tidak tersedia</div>;
  }
  console.log(data);
  console.log(bukuList);
  console.log(guruList);
  console.log(muridList);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari berdasarkan judul buku atau nama peminjam..."
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

      {/* Rest of your component remains the same, just ensure optional chaining is used */}
      {/* Mobile and Tablet View */}
      <div className="lg:hidden space-y-4">
        {filteredData.map((item, index) => {
          const bukuInfo = getBukuData(item.bukuPinjaman?.[0]?.bukuISBN || "");
          const peminjam = getPeminjamData(item.nis, item.nip);

          return (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border-2 border-primary"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-source-serif font-semibold text-lg">
                      {bukuInfo?.judul || "Judul tidak tersedia"}
                    </h3>
                    <p className="text-sm font-source-sans">
                      Peminjam: {peminjam?.nama || "Nama tidak tersedia"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Delete02Icon className="w-5 h-5 text-jewel-red" />
                    <PencilEdit01Icon className="w-5 h-5 text-jewel-blue" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {peminjam?.jenisKelamin === "PEREMPUAN" ? (
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
                </div>

                <button
                  onClick={() => router.push(`/peminjaman/${item.id}`)}
                  className="w-full bg-dark-primary text-white-custom font-source-sans py-2 px-4 rounded-lg border-2 border-black text-sm hover:shadow-sm transition-all duration-300"
                >
                  Detail
                </button>
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
              <th className="px-4 py-2 text-left w-3/12">Judul Buku</th>
              <th className="px-4 py-2 text-left w-2/12">Peminjam</th>
              <th className="px-4 py-2 text-center w-2/12">Tanggal Pinjam</th>
              <th className="px-4 py-2 text-center w-2/12">Tenggat</th>
              <th className="px-4 py-2 text-center w-1/12">Status</th>
              <th className="px-4 py-2 text-center w-1/12">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => {
              const bukuInfo = getBukuData(
                item.bukuPinjaman?.[0]?.bukuISBN || ""
              );
              const peminjam = getPeminjamData(item.nis, item.nip);

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
                  <td className="px-4 py-2 font-source-sans">
                    <div className="flex items-center gap-2">
                      {peminjam?.jenisKelamin === "PEREMPUAN" ? (
                        <HijabIcon
                          className="text-jewel-red"
                          width={20}
                          height={20}
                        />
                      ) : (
                        <MuslimIcon
                          className="text-jewel-blue"
                          width={20}
                          height={20}
                        />
                      )}
                      <span className="text-sm">
                        {peminjam?.nama || "Nama tidak tersedia"}
                      </span>
                    </div>
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
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <Delete02Icon className="w-5 h-5 text-jewel-red cursor-pointer" />
                      <PencilEdit01Icon className="w-5 h-5 text-jewel-blue cursor-pointer" />
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

export default TablePeminjaman;
