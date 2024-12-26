// app/components/TableBuku.tsx

import React from "react";
import { cariBukuType, genreType } from "@/lib";
import { Delete02Icon, PencilEdit01Icon } from "hugeicons-react";

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

const TableBuku = ({ data }: { data: cariBukuType[] }) => {
  return (
    <div className="w-full">
      {/* Mobile and Tablet View (Card Layout) */}
      <div className="lg:hidden space-y-4">
        {data?.map((item: cariBukuType, index: number) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border border-primary"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-source-serif font-semibold">
                  {item?.judul}
                </h3>
                <div className="flex items-center gap-2">
                  <Delete02Icon className="w-5 h-5 text-jewel-red" />
                  <PencilEdit01Icon className="w-5 h-5 text-jewel-blue" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-semibold">ISBN:</span> {item?.isbn}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Penulis:</span>{" "}
                  {item?.penulis.map((p) => p.nama).join(", ")}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {item?.genre.map((genre: genreType, genreIndex: number) => (
                  <div
                    key={genreIndex}
                    className={`${bg[genreIndex % bg.length]} ${
                      border[genreIndex % border.length]
                    } text-white-custom text-xs rounded-full py-1 px-3`}
                  >
                    {genre.nama}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="px-2 py-0.5 border border-jewel-green bg-pastel-green rounded-full flex items-center gap-1 text-jewel-green">
                  <span className="inline-block w-2 h-2 rounded-full bg-jewel-green"></span>
                  <p className="text-xs">Tersedia</p>
                </div>
                <button className="bg-dark-primary text-white-custom font-source-sans py-1 px-4 rounded-lg border-2 border-black text-xs hover:shadow-sm transition-all duration-300">
                  Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View (Table Layout) */}
      <div className="hidden lg:block max-h-80 overflow-y-auto border border-primary rounded-lg">
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
            {data?.map((item: cariBukuType, index: number) => (
              <tr
                key={index}
                className="group relative border-t-2 hover:border-y-2 hover:border-black-custom border-dashed transition-all duration-100"
              >
                <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                  {item?.isbn}
                </td>
                <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                  {item?.judul}
                </td>
                <td className="px-4 py-2 font-source-sans text-sm">
                  {item?.penulis.map((p) => p.nama).join(", ")}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center items-center flex-row flex-wrap gap-0.5">
                    {item?.genre.map((genre: genreType, genreIndex: number) => (
                      <div
                        key={genreIndex}
                        className={`${bg[genreIndex % bg.length]} ${
                          border[genreIndex % border.length]
                        } flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans leading-none text-xs rounded-full py-2 px-3`}
                      >
                        {genre.nama}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center">
                    <div className="px-2 gap-1 py-0.5 border border-jewel-green bg-pastel-green rounded-full flex justify-between items-center text-jewel-green">
                      <span className="inline-block w-2 h-2 rounded-full bg-jewel-green"></span>
                      <p className="text-xs">Tersedia</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <Delete02Icon className="w-5 h-5 text-jewel-red" />
                    <PencilEdit01Icon className="w-5 h-5 text-jewel-blue" />
                  </div>
                </td>
                <td className="px-4 py-2">
                  <button
                    type="submit"
                    className="bg-dark-primary text-white-custom font-source-sans py-1 px-2 w-full rounded-lg border-2 border-black text-xs hover:shadow-sm transition-all duration-300"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableBuku;
