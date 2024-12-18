import { use, useEffect, useState } from "react";
import { Delete02Icon, PencilEdit01Icon } from "hugeicons-react";
import { peminjamanType } from "@/lib";

const TablePeminjaman = ({ data }: { data: peminjamanType[] }) => {
  const [buku, setBuku] = useState<any>([]);
  const [murid, setMurid] = useState<any>([]);
  const [guru, setGuru] = useState<any>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    const fetchBuku = async () => {
      try {
        const allBuku = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].bukuPinjaman?.[0]?.bukuISBN) {
            const response = await fetch(
              `/api/buku/${data[i]?.bukuPinjaman[0]?.bukuISBN}`
            );
            if (!response.ok) {
              throw new Error(
                `Error fetching buku with ISBN: ${data[i].bukuPinjaman[0].bukuISBN}`
              );
            }
            const buku = await response.json();
            allBuku.push(buku);
          }
        }
        setBuku(allBuku);
      } catch (error) {
        console.error("Error fetching buku data:", error);
      }
    };

    fetchBuku();
  }, [data]);

  useEffect(() => {
    const fetchMurid = async () => {
      try {
        const allMurid = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].nis) {
            const response = await fetch(`/api/murid/${data[i].nis}`);
            if (!response.ok) {
              throw new Error(`Error fetching murid with NIS: ${data[i].nis}`);
            }
            const murid = await response.json();
            allMurid.push(murid);
          }
        }
        setMurid(allMurid);
      } catch (error) {
        console.error("Error fetching murid data:", error);
      }
    };

    fetchMurid();
  }, [data]);

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const allGuru = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].nip) {
            const response = await fetch(`/api/guru/${data[i].nip}`);
            if (!response.ok) {
              throw new Error(`Error fetching guru with NIP: ${data[i].nip}`);
            }
            const guru = await response.json();
            allGuru.push(guru);
          }
        }
        setGuru(allGuru);
      } catch (error) {
        console.error("Error fetching guru data:", error);
      }
    };

    fetchGuru();
  }, [data]);

  const bukuData = (isbn: string) => buku.find((b: any) => b.bukuISBN === isbn);

  const getNama = (nis?: string, nip?: string): string => {
    if (nis) {
      const muridData = murid.find((m: any) => m.nis === nis);
      return muridData ? muridData.nama : "Nama tidak ditemukan";
    }
    if (nip) {
      const guruData = guru.find((g: any) => g.nip === nip);
      return guruData ? guruData.nama : "Nama tidak ditemukan";
    }
    return "Nama tidak tersedia";
  };

  const filteredData = data.filter((item) => {
    const judul = bukuData(item.bukuPinjaman?.[0]?.bukuISBN)?.judul || "";
    const nama = getNama(item.nis, item.nip);
    return (
      judul.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      nama.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan judul atau nama peminjam..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
      <div className="flex flex-col lg:hidden gap-4 p-2">
        {filteredData?.map((item: peminjamanType, index: number) => (
          <div
            key={index}
            className="border-2 border-primary rounded-lg p-4 mb-4"
          >
            <h1 className="text-base font-source-sans font-semibold text-gray-700">
              ID: {item?.id}
            </h1>
            <h2 className="mt-2 text-lg font-source-serif font-bold text-gray-800">
              {bukuData(item.bukuPinjaman?.[0]?.bukuISBN)?.judul}
            </h2>
            <h3 className="mt-2 text-sm font-source-sans font-medium text-gray-600">
              Nama: {getNama(item.nis, item.nip)}
            </h3>
            <p className="mt-2 text-sm font-source-sans text-gray-500">
              Tanggal Pinjam:{" "}
              <span className="font-medium text-gray-700">
                {new Date(item.tanggalPinjam).toLocaleString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Tenggat Waktu:{" "}
              <span className="font-medium text-gray-700">
                {item.bukuPinjaman?.[0]?.tenggatWaktu
                  ? new Date(item.bukuPinjaman[0].tenggatWaktu).toLocaleString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "Tidak ada tenggat"}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className="max-h-80 overflow-y-auto border border-primary rounded-lg">
        <table className="min-w-full bg-white hidden lg:table">
          <thead>
            <tr className="bg-light-primary text-white sticky top-0 z-10">
              <th className="px-4 py-2 text-left w-1/12">ID</th>
              <th className="px-4 py-2 text-left w-3/12">Judul</th>
              <th className="px-4 py-2 text-left w-3/12">Peminjam</th>
              <th className="px-4 py-2 text-center w-2/12">Mulai</th>
              <th className="px-4 py-2 text-center w-2/12">Tenggat</th>
              <th className="px-4 py-2 text-center w-1/12">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item: peminjamanType, index: number) => (
              <tr
                key={index}
                className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
              >
                <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                  {item?.id}
                </td>
                <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                  {bukuData(item.bukuPinjaman?.[0]?.bukuISBN)?.judul}
                </td>
                <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                  {getNama(item.nis, item.nip)}
                </td>
                <td className="px-4 py-2 font-source-sans text-sm text-center">
                  {new Date(item.tanggalPinjam).toLocaleString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
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
                    <div className="px-2 gap-1 py-0.5 border border-jewel-green bg-pastel-green rounded-full flex justify-between items-center text-jewel-green">
                      <span className="inline-block w-2 h-2 rounded-full bg-jewel-green"></span>
                      <p className="text-xs">Masih</p>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablePeminjaman;
