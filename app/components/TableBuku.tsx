import BtnSecondary from "./BtnSecondary";
import { Delete02Icon, PencilEdit01Icon } from "hugeicons-react";

interface TableBukuProps {
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

const TableBuku = ({ data }: TableBukuProps) => {
  console.log(data);
  return (
    <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-lg shadow-md">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-light-primary text-white sticky top-0 z-10">
            <th className="px-4 py-2 text-left w-2/12">ISBN</th>
            <th className="px-4 py-2 text-left w-3/12">Judul</th>
            <th className="px-4 py-2 text-left w-2/12">Penulis</th>
            <th className="px-4 py-2 text-center w-2/12">Genre</th>
            <th className="px-4 py-2 text-center w-1/12">Status</th>
            <th className="px-4 py-2 text-center w-1/12">Aksi</th>
            <th className="px-4 py-2 text-center w-1/12">Detail</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(
            (
              item: {
                isbn: string;
                judul: string;
                penulisBuku: { penulis: { nama: string } }[];
                genre: string[];
                linkGambar: string;
              },
              index: number
            ) => (
              <tr
                key={index}
                className="group border-b-2 border-dashed hover:bg-dark-gray transition-all duration-100 hover:text-white-custom hover:transition-all hover:duration-100"
              >
                <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                  {item.isbn}
                </td>
                <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                  {item.judul}
                </td>
                <td className="px-4 py-2 font-source-sans text-sm">
                  {item.penulisBuku.map((d) => d.penulis.nama).join(", ")}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center items-center flex-row flex-wrap gap-0.5">
                    {item.genre.map((genre: string, genreIndex: number) => (
                      <div
                        key={genreIndex}
                        className={`${bg[genreIndex % bg.length]} ${
                          border[genreIndex % border.length]
                        } flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans leading-none text-xs rounded-full py-2 px-3`}
                      >
                        {genre}
                      </div>
                    ))}
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
                <td className="px-4 py-2 ">
                  <button
                    type="submit"
                    className="bg-dark-primary text-white-custom font-source-sans py-1 px-2 w-full rounded-lg border-2 border-black text-xs hover:shadow-sm transition-all duration-300 hover:transition-all hover:duration-300"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableBuku;
