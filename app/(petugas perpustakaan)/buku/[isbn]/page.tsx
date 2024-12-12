"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cariBukuType, genreType } from "@/lib";

const Page = ({ params }: { params: Promise<{ isbn: string }> }) => {

  const [detailBuku, setDetailBuku] = useState<cariBukuType | null>(null);

  useEffect(() => {
    const fetchDetailBuku = async () => {
        const { isbn } = await params;
        console.log(isbn)
      try {
        const response = await fetch(`/api/buku/${isbn}`);
        const data = await response.json();
        setDetailBuku(data);
      } catch (error) {
        console.error("Gagal mengambil detail buku:", error);
      }
    };

    fetchDetailBuku();
  }, []);

  console.log(detailBuku);

  if (!detailBuku) {
    return (
      <div className="relative bg-gray-200 animate-pulse">
        <div className="w-full flex gap-4 relative">
          <div className="w-full h-48 absolute top-0 left-0 bg-gray-200 flex rounded-lg border-dark border-4"></div>
          <div className="w-1/4 relative z-10 p-12">
            <div className="rounded-md border-2 w-full border-black-custom h-48 bg-gray-200"></div>
          </div>
          <div className="w-3/4 flex flex-col gap-8 z-10 py-12">
            <div>
              <div className="h-12 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="flex items-center gap-2 mt-3 h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="pr-12 flex flex-col gap-2">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="text-justify font-source-serif text-sm indent-8">
                <div className="h-5 bg-gray-200 rounded w-full mt-1"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3 mt-1"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bg = [
    "bg-jewel-purple",
    "bg-jewel-red",
    "bg-jewel-green",
    "bg-jewel-yellow",
    "bg-jewel-blue",
  ];
  const fromBg = [
    "from-jewel-purple",
    "from-jewel-red",
    "from-jewel-green",
    "from-jewel-yellow",
    "from-jewel-blue",
  ];
  const toBg = [
    "to-jewel-purple",
    "to-jewel-red",
    "to-jewel-green",
    "to-jewel-yellow",
    "to-jewel-blue",
  ];

  const border = [
    "border-pastel-purple",
    "border-pastel-red",
    "border-pastel-green",
    "border-pastel-yellow",
    "border-pastel-blue",
  ];

  const {linkGambar, judul, penulis, genre, sinopsis, _count : stock} = detailBuku;
  // console.log(detailBuku.id);
  // console.log(fromBg[detailBuku?.id % bg.length]);
  // console.log(toBg[detailBuku?.id + (Math.floor(Math.random()) % bg.length)]);

  return (
    <div className="relative bg-noise bg-repeat">
      <div className="w-full flex gap-4 relative">
        <div
          className={`w-full h-48 absolute top-0 left-0 bg-gradient-to-r ${
            fromBg[(1 + 1) % bg.length]
          } ${
            toBg[3 % bg.length]
          } flex -z-[0] rounded-lg border-dark border-4`}
        ></div>
        <div className="w-[30%] relative z-10 p-12">
          <Image
            alt="gambar-buku"
            src={linkGambar || "/img/book-2.png"}
            width={2140}
            height={0}
            className="rounded-md border-2 w-full border-black-custom"
          />
        </div>
        <div className="w-[70%] flex flex-col gap-8 z-10 py-12">
          <div>
            <h1 className="text-5xl font-bold font-source-serif text-white-custom">
              {judul}
            </h1>
            <h2 className="text-xl ml-0.5 font-normal text-white-custom">
              {penulis.map((e => e.nama)).join(", ")}
            </h2>
            <div className="w-full flex items-center gap-2">
              {genre.map((item: genreType, index: number) => <div
                    key={index}
                    className={`${bg[index]} ${border[index]} font-bold mt-4 flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans leading-none text-xs rounded-full py-2 px-4`}
                  >
                    {item.nama}
                  </div>
                )}
            </div>
          </div>
          <div className="pr-12 flex flex-col gap-2">
            <h1 className="text-xl font-source-serif font-bold">Sinopsis</h1>
            <div className="text-justify font-source-serif text-sm indent-8">
              <p>{sinopsis}</p>
            </div>
            <h1 className="text-xl font-source-serif font-bold">Stock</h1>
            <div className="text-justify font-source-serif text-sm indent-8">
              <p>{stock.eksemplarBuku}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
