"use client";

import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { toSlug } from "@/app/utils/slug";

const Page = ({ params }: { params: Promise<{ judul: string }> }) => {
  const { judul } = use(params);

  const [detailBuku, setDetailBuku] = useState<any | null>(null);

  useEffect(() => {
    const fetchDetailBuku = async () => {
      try {
        const response = await fetch(`/api/buku/${toSlug(judul)}`);
        const data = await response.json();
        setDetailBuku(data);
      } catch (error) {
        console.error("Gagal mengambil detail buku:", error);
      }
    };

    fetchDetailBuku();
  }, [judul]);

  console.log(detailBuku);

  if (!detailBuku) {
    return <div>Loading...</div>; // Loading state sementara data diambil
  }

  return (
    <div className="relative bg-noise bg-repeat">
      <div className="border-2 rounded-xl bg-white-custom border-black-custom p-6 relative">
        <div className="w-full flex gap-4 relative">
          <div className="w-full h-48 absolute top-0 left-0 bg-gradient-to-r from-dark flex -z-[0] to-light-primary rounded-lg"></div>
          <div className="w-[30%] relative z-10 p-12">
            <Image
              alt="gambar-buku"
              src={detailBuku.linkGambar || "/img/book-2.png"}
              width={220}
              height={0}
              className="rounded-md border-2 w-full border-black-custom"
            />
            <button
              className={`bg-transparent mt-4 flex justify-center items-center gap-2 text-light-primary font-source-sans leading-none text-md font-normal rounded-md border-2 border-light-primary py-3 w-full px-4 transition-all duration-300
        hover:font-semibold hover:shadow-md hover:transition-all hover:duration-300`}
            >
              Edit
            </button>
          </div>
          <div className="w-[70%] flex flex-col gap-8 z-10 py-12">
            <div>
              <h1 className="text-5xl font-bold font-source-serif text-white-custom">
                {detailBuku.judul}
              </h1>
              <h2 className="text-xl ml-0.5 font-normal text-white-custom">
                Oleh: {detailBuku.penulis}
              </h2>
              <div className="w-full flex items-center gap-2">
                {detailBuku &&
                  detailBuku.genre.map((item: string[], index: number) => (
                    <div
                      key={index}
                      className="bg-yellow-custom mt-4 flex justify-center items-center gap-2 text-dark font-source-sans leading-none text-xs font-normal rounded-full py-2 px-4"
                    >
                      {item}
                    </div>
                  ))}
              </div>
            </div>
            <div className="pr-12 flex flex-col gap-2">
              <h1 className="text-xl font-source-serif font-bold">Sinopsis</h1>
              <div className="text-justify font-source-serif text-sm indent-8">
                <p>{detailBuku.sinopsis}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
