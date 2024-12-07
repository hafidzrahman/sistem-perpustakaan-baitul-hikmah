import { MuslimIcon, HijabIcon } from "hugeicons-react";

interface TableMuridProps {
  data: any;
}

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

const TableMurid = ({ data }: TableMuridProps) => {
  return (
    <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-lg">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-light-primary text-white sticky top-0 z-10">
            <th className="px-4 py-2 text-left w-1/12">NISN</th>
            <th className="px-4 py-2 text-left w-3/12">Nama</th>
            <th className="px-4 py-2 text-center w-2/12">Kelas</th>
            <th className="px-4 py-2 text-left w-3/12">Alamat</th>
            <th className="px-4 py-2 text-center w-1/12">Jenis Kelamin</th>
            <th className="px-4 py-2 text-center w-1/12">Aksi</th>
            <th className="px-2 py-2 text-center w-1/12">Detail</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(
            (
              item: {
                nis: string;
                nama: string;
                jenisKelamin: string;
                riwayatKelas: {kelas : {id : number, nama : string, tingkat : number}}[];
                alamat: string;
              },
              index: number
            ) => {
              const kelas = item.riwayatKelas[0].kelas.tingkat
                ? `${item.riwayatKelas[0].kelas.tingkat} ${item.riwayatKelas[0].kelas.nama}`
                : "Tidak Diketahui";
              return (
                <tr
                  key={index}
                  className="group hover:bg-dark-gray border-b-2 border-dashed transition-all duration-100 hover:text-white-custom hover:transition-all hover:duration-100"
                >
                  <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                    {item.nis}
                  </td>
                  <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                    {item.nama}
                  </td>
                  <td className="px-4 py-2 font-source-sans text-center">
                    <div
                      className={`${
                        kelas.includes("7")
                          ? `${bg[0]} ${border[0]}`
                          : kelas.includes("8")
                          ? `${bg[1]} ${border[1]}`
                          : `${bg[4]} ${border[4]}`
                      } flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans leading-none text-xs rounded-full py-2 px-3`}
                    >
                      {kelas}
                    </div>
                  </td>
                  <td className="px-4 py-2 ">{item.alamat}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center">
                      {item.jenisKelamin === "Perempuan" ? (
                        <HijabIcon
                          className="text-black-custom group-hover:text-white-custom"
                          width={24}
                          height={24}
                        />
                      ) : (
                        <MuslimIcon
                          className="text-black-custom group-hover:text-white-custom"
                          width={24}
                          height={24}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">Aksi</td>
                  <td className="px-4 py-2 ">
                    <button
                      type="submit"
                      className="bg-dark-primary text-white-custom font-source-sans py-1 px-2 w-full rounded-lg border-2 border-black text-xs hover:shadow-sm transition-all duration-300 hover:transition-all hover:duration-300"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableMurid;
