import { use, useEffect, useState } from "react";
import { Delete02Icon, PencilEdit01Icon } from "hugeicons-react";
import { peminjamanType } from "@/lib";

const TablePeminjaman = ({ data }: { data: peminjamanType[] }) => {
  const [murid, setMurid] = useState<any>([]);
  const [guru, setGuru] = useState<any>([]);

  useEffect(() => {
    const fetchMurid = async () => {
      try {
        const allMurid = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].nis) {
            // Pastikan ada NIS
            const response = await fetch(`/api/murid/${data[i].nis}`);
            if (!response.ok) {
              throw new Error(`Error fetching murid with NIS: ${data[i].nis}`);
            }
            const murid = await response.json();
            allMurid.push(murid); // Kumpulkan hasil
          }
        }
        setMurid(allMurid); // Set semua murid setelah selesai
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
            // Pastikan ada NIP
            const response = await fetch(`/api/guru/${data[i].nip}`);
            if (!response.ok) {
              throw new Error(`Error fetching guru with NIP: ${data[i].nip}`);
            }
            const guru = await response.json();
            allGuru.push(guru); // Kumpulkan hasil
          }
        }
        setGuru(allGuru); // Set semua guru setelah selesai
      } catch (error) {
        console.error("Error fetching guru data:", error);
      }
    };

    fetchGuru();
  }, [data]);

  console.log(murid);
  console.log(guru);

  return (
    <div className="max-h-80 overflow-y-auto border border-primary rounded-lg">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-light-primary text-white sticky top-0 z-10">
            <th className="px-4 py-2 text-left w-1/12">ID</th>
            <th className="px-4 py-2 text-left w-3/12">Judul</th>
            <th className="px-4 py-2 text-left w-3/12">Peminjam</th>
            <th className="px-4 py-2 text-left w-2/12">Mulai</th>
            <th className="px-4 py-2 text-center w-2/12">Tenggat</th>
            <th className="px-4 py-2 text-center w-1/12">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: peminjamanType, index: number) => (
            <tr
              key={index}
              className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
            >
              <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                {item?.id}
              </td>
              <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                {item?.nis}
              </td>
              <td className="px-4 py-2 font-source-sans text-sm">
                {/* {item?.penulis.map((p) => p.nama).join(", ")} */}
              </td>
              <td className="px-4 py-2">
                <div className="flex justify-center items-center flex-row flex-wrap gap-0.5">
                  {/* {item?.genre.map((genre: genreType, genreIndex: number) => (
                    <div
                      key={genreIndex}
                      className={`${bg[genreIndex % bg.length]} ${
                        border[genreIndex % border.length]
                      } flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans leading-none text-xs rounded-full py-2 px-3`}
                    >
                      {genre.nama}
                    </div>
                  ))} */}
                </div>
              </td>
              <td className="px-4 py-2 ">
                <div className="flex items-center justify-center">
                  <div className="px-2 gap-1 py-0.5 border border-jewel-green bg-pastel-green rounded-full flex justify-between items-center text-jewel-green">
                    <span className="inline-block w-2 h-2 rounded-full bg-jewel-green"></span>
                    <p className="text-xs">Tersedia</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 ">
                <div className="flex items-center justify-center gap-2">
                  <Delete02Icon className="w-5 h-5 text-jewel-red" />
                  <PencilEdit01Icon className="w-5 h-5 text-jewel-blue " />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePeminjaman;
