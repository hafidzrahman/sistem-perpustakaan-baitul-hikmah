import { useRouter } from "next/navigation";
import {
  Delete02Icon,
  HijabIcon,
  MuslimIcon,
  PencilEdit01Icon,
} from "hugeicons-react";

interface DataTableMuridProps {
  item: any;
  kelas: any;
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

const DataTableMurid = ({ item, kelas }: DataTableMuridProps) => {
  const router = useRouter();

  return (
    <tr className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100">
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
          {item.jenisKelamin === "PEREMPUAN" ? (
            <HijabIcon className="text-jewel-red" width={24} height={24} />
          ) : (
            <MuslimIcon className="text-jewel-blue" width={24} height={24} />
          )}
        </div>
      </td>
      <td className="px-4 py-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Delete02Icon className="w-5 h-5 text-jewel-red" />
          <PencilEdit01Icon className="w-5 h-5 text-jewel-blue " />
        </div>
      </td>
      <td className="px-4 py-2 ">
        <button
          onClick={() => router.push(`https://sistem-perpustakaan-baitul-hikmah-iota.vercel.app//murid/${item.nis}`)}
          type="submit"
          className="bg-dark-primary text-white-custom font-source-sans py-1 px-2 w-full rounded-lg border-2 border-black text-xs hover:shadow-sm transition-all duration-300 hover:transition-all hover:duration-300"
        >
          Detail
        </button>
      </td>
    </tr>
  );
};

export default DataTableMurid;
