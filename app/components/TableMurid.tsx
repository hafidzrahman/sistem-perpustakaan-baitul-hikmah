import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Delete02Icon,
  HijabIcon,
  MuslimIcon,
  PencilEdit01Icon,
  Search01Icon,
} from "hugeicons-react";
import { kelasType } from "@/lib";

const bg = [
  "bg-jewel-purple",
  "bg-jewel-red",
  "bg-jewel-green",
  "bg-jewel-yellow",
  "bg-jewel-blue",
];

const border = [
  "border-pastel-purple",
  "border-pastel-red",
  "border-pastel-green",
  "border-pastel-yellow",
  "border-pastel-blue",
];

const TableMurid = ({ data }: { data: any }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classData, setClassData] = useState<kelasType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch("/api/kelas");
        const data = await response.json();
        setClassData(data);
      } catch (error) {
        console.error("Error fetching class data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, []);

  // Filter data berdasarkan pencarian dan kelas
  const filteredData = data?.filter((item: any) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClass === "" ||
      `${item.riwayatKelas[0].kelas.tingkat} ${item.riwayatKelas[0].kelas.nama}` ===
        selectedClass;

    return matchesSearch && matchesClass;
  });

  const getKelasColor = (kelas: string) => {
    if (kelas.includes("7")) return `${bg[0]} ${border[0]}`;
    if (kelas.includes("8")) return `${bg[1]} ${border[1]}`;
    return `${bg[4]} ${border[4]}`;
  };

  // Get student counts
  const totalStudents = data?.length || 0;
  const filteredStudents = filteredData?.length || 0;
  const selectedClassCount = selectedClass
    ? filteredData?.length
    : totalStudents;

  return (
    <div className="w-full space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau NIS..."
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

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 border-2 border-primary rounded-lg focus:outline-none focus:border-dark-primary disabled:bg-gray-100"
          disabled={isLoading}
        >
          <option value="">Semua Kelas</option>
          {classData.map((kelas) => (
            <option key={kelas.id} value={`${kelas.tingkat} ${kelas.nama}`}>
              {kelas.tingkat} {kelas.nama} ({kelas._count.RiwayatKelas} murid)
            </option>
          ))}
        </select>
      </div>

      {/* Mobile and Tablet View (Card Layout) */}
      <div className="lg:hidden space-y-4">
        {filteredData?.map((item: any, index: number) => {
          const kelas = item.riwayatKelas[0].kelas.tingkat
            ? `${item.riwayatKelas[0].kelas.tingkat} ${item.riwayatKelas[0].kelas.nama}`
            : "Tidak Diketahui";

          return (
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
                    <p className="text-sm font-source-sans">NIS: {item.nis}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Delete02Icon className="w-5 h-5 text-jewel-red" />
                    <PencilEdit01Icon className="w-5 h-5 text-jewel-blue" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`${getKelasColor(
                      kelas
                    )} px-3 py-1 rounded-full text-white-custom text-sm`}
                  >
                    {kelas}
                  </div>
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
              <th className="px-4 py-2 text-left w-1/12">NIS</th>
              <th className="px-4 py-2 text-left w-3/12">Nama</th>
              <th className="px-4 py-2 text-center w-2/12">Kelas</th>
              <th className="px-4 py-2 text-left w-3/12">Alamat</th>
              <th className="px-4 py-2 text-center w-1/12">Jenis Kelamin</th>
              <th className="px-4 py-2 text-center w-1/12">Aksi</th>
              <th className="px-2 py-2 text-center w-1/12">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item: any, index: number) => {
              const kelas = item.riwayatKelas[0].kelas.tingkat
                ? `${item.riwayatKelas[0].kelas.tingkat} ${item.riwayatKelas[0].kelas.nama}`
                : "Tidak Diketahui";

              return (
                <tr
                  key={index}
                  className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
                >
                  <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                    {item.nis}
                  </td>
                  <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                    {item.nama}
                  </td>
                  <td className="px-4 py-2 font-source-sans text-center">
                    <div
                      className={`${getKelasColor(
                        kelas
                      )} flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans leading-none text-xs rounded-full py-2 px-3`}
                    >
                      {kelas}
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
                        router.push(`http://localhost:3000/murid/${item.nis}`)
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
  );
};

export default TableMurid;
