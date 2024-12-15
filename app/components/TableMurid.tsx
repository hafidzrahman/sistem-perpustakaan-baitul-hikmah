import {
  MuslimIcon,
  HijabIcon,
  Delete02Icon,
  PencilEdit01Icon,
} from "hugeicons-react";
import DataTableMurid from "./DataTableMurid";

interface TableMuridProps {
  data: any;
}

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
                riwayatKelas: {
                  kelas: { id: number; nama: string; tingkat: number };
                }[];
                alamat: string;
              },
              index: number
            ) => {
              console.log(data);

              const kelas = item.riwayatKelas[0].kelas.tingkat
                ? `${item.riwayatKelas[0].kelas.tingkat} ${item.riwayatKelas[0].kelas.nama}`
                : "Tidak Diketahui";
              return <DataTableMurid item={item} kelas={kelas} key={index} />;
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableMurid;
