import {
  Delete02Icon,
  HijabIcon,
  MuslimIcon,
  PencilEdit01Icon,
  Search01Icon,
} from "hugeicons-react";
import { bookType, guruType, muridType, peminjamanType } from "@/lib";

interface TableDendaProps {}

const TableDenda = ({}: TableDendaProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="relative">
        {/* <input
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
        /> */}
      </div>

      {/* Mobile and Tablet View
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
                    <p className="text-sm">ISBN: {bukuInfo?.isbn}</p>
                    <p className="text-sm">
                      Eksemplar: {bukuInfo?._count?.eksemplarBuku}
                    </p>
                    <p className="text-sm font-source-sans">
                      Peminjam: {peminjam?.nama || "Nama tidak tersedia"}
                    </p>
                    <p className="text-sm font-source-sans">
                      {item.nis
                        ? `NIS: ${peminjam?.nis}`
                        : `NIP: ${peminjam?.nip}`}
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
              </div>
            </div>
          );
        })}
      </div> */}

      {/* Desktop View */}
      <div className="hidden lg:block border border-primary rounded-lg max-h-80 overflow-y-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-light-primary text-white sticky top-0 z-10">
              <th className="px-4 py-2 text-left w-1/12">No</th>
              <th className="px-4 py-2 text-left w-2/12">Nama</th>
              <th className="px-4 py-2 text-left w-2/12">Tanggal</th>
              <th className="px-4 py-2 text-left w-4/12">Ket</th>
              <th className="px-4 py-2 text-center w-1/12">Jenis</th>
              <th className="px-4 py-2 text-center w-2/12">Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr
              key={""}
              className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
            >
              <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                id
              </td>
              <td className="px-4 py-2 font-source-serif font-semibold">
                test
              </td>
              <td className="px-4 py-2 font-source-sans">test</td>
              <td className="px-4 py-2 text-sm text-left">test</td>
              <td className="px-4 py-2 text-sm text-center">test</td>
              <td className="px-4 py-2 text-sm text-center">
                <button className="bg-primary w-full text-white-custom font-source-sans leading-none text-xs rounded-md border-2 border-black-custom py-2 font-normal transition-all duration-300 hover:font-bold hover:shadow-sm hover:transition-all hover:duration-300">
                  Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDenda;
