import React from "react";
import {
  BookOpen01Icon,
  Calendar01Icon,
  HijabIcon,
  MapPinIcon,
  MuslimIcon,
  Search01Icon,
  UserAccountIcon,
} from "hugeicons-react";
import { bukuType, muridType, peminjamanType } from "@/lib";
import PeminjamanCalendar from "@/app/components/PeminjamanCalendar";
import Image from "next/image";

interface BerandaMuridProps {
  data: peminjamanType[];
  bukuList: bukuType[];
  muridList: muridType[];
  studentNIS: string;
}

const BerandaMurid = ({
  data = [],
  bukuList = [],
  muridList = [],
  studentNIS,
}: BerandaMuridProps) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const getBukuData = (isbn: string) => {
    if (!bukuList || !isbn) return null;
    return bukuList.find((b) => b.isbn === isbn);
  };

  const studentData = React.useMemo(() => {
    return muridList.find((m) => m.nis === studentNIS);
  }, [muridList, studentNIS]);

  const studentPeminjaman = React.useMemo(() => {
    return data.filter((item) => item.nis === studentNIS);
  }, [data, studentNIS]);

  const filteredPeminjaman = React.useMemo(() => {
    if (!studentPeminjaman) return [];

    return studentPeminjaman.filter((item) => {
      if (!searchQuery) return true;

      const bukuInfo = getBukuData(item.bukuPinjaman?.[0]?.bukuISBN || "");
      const searchLower = searchQuery.toLowerCase();

      return bukuInfo?.judul?.toLowerCase().includes(searchLower);
    });
  }, [studentPeminjaman, searchQuery, bukuList]);

  if (!studentData) {
    return (
      <div className="w-full p-4 text-center">Data siswa tidak ditemukan</div>
    );
  }

  const getClassColor = (kelas: string) => {
    const colors = {
      "7": { bg: "bg-jewel-purple", border: "border-pastel-purple" },
      "8": { bg: "bg-jewel-red", border: "border-pastel-red" },
      "9": { bg: "bg-jewel-blue", border: "border-pastel-blue" },
    };

    const grade = Object.keys(colors).find((grade) => kelas.includes(grade));
    return grade ? colors[grade as keyof typeof colors] : colors["9"];
  };

  const kelas = studentData.riwayatKelas[0]?.kelas.tingkat
    ? `${studentData.riwayatKelas[0].kelas.tingkat} ${studentData.riwayatKelas[0].kelas.nama}`
    : "Tidak Diketahui";

  const classColors = getClassColor(kelas);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 p-6">
      {/* Profile Card */}
      <div className="col-span-1 lg:col-span-2 lg:row-span-2 bg-white rounded-lg border-2 border-dark-gray">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-primary font-bold font-source-sans flex items-center gap-2">
              <UserAccountIcon className="h-6 w-6" />
              Profil Saya
            </h2>
            <span
              className={`${classColors.bg} ${classColors.border} px-4 py-2 rounded-full text-white-custom text-sm font-medium border-2`}
            >
              {kelas}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-44 h-44 rounded-lg overflow-hidden border-2 border-black-custom">
              <Image
                src="/img/boy.jpeg"
                alt={`Foto ${studentData.nama}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nomor Induk Siswa</p>
                <p className="text-lg font-medium">{studentData.nis}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nama Lengkap</p>
                <h1 className="text-2xl font-bold">{studentData.nama}</h1>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                <p className="text-sm text-gray-600">{studentData.alamat}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="col-span-1 lg:col-span-2 lg:row-span-2 bg-white rounded-lg border-2 border-dark-gray">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar01Icon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl text-primary font-bold font-source-sans">
              Kalender Peminjaman
            </h2>
          </div>
          <PeminjamanCalendar
            loans={studentPeminjaman.map((p) => ({
              date: p.tanggalPinjam,
              bookTitle:
                getBukuData(p.bukuPinjaman?.[0]?.bukuISBN || "")?.judul || "",
            }))}
          />
        </div>
      </div>

      {/* Peminjaman Table */}
      <div className="col-span-1 lg:col-span-4 bg-white rounded-lg border-2 border-dark-gray">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen01Icon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl text-primary font-bold font-source-sans">
              Riwayat Peminjaman
            </h2>
          </div>

          <div className="space-y-4">
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

            <div className="border border-primary rounded-lg max-h-80 overflow-y-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-light-primary text-white sticky top-0 z-10">
                    <th className="px-4 py-2 text-left w-4/12">Judul Buku</th>
                    <th className="px-4 py-2 text-center w-3/12">
                      Tanggal Pinjam
                    </th>
                    <th className="px-4 py-2 text-center w-3/12">Tenggat</th>
                    <th className="px-4 py-2 text-center w-2/12">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeminjaman.map((item, index) => {
                    const bukuInfo = getBukuData(
                      item.bukuPinjaman?.[0]?.bukuISBN || ""
                    );

                    return (
                      <tr
                        key={index}
                        className="border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
                      >
                        <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                          {bukuInfo?.judul || "Judul tidak tersedia"}
                        </td>
                        <td className="px-4 py-2 text-sm text-center">
                          {item.tanggalPinjam
                            ? new Date(item.tanggalPinjam).toLocaleString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
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
        </div>
      </div>
    </div>
  );
};

export default BerandaMurid;
