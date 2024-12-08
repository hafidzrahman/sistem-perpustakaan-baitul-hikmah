"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toSlug } from "../utils/slug";

interface Buku {
  id: number;
  isbn: string;
  judul: string;
  penulisBuku: { penulis: { nama: string } }[];
  linkGambar: string;
}

interface CardBukuProps {
  data: Buku;
}

const CardBuku = ({ data }: CardBukuProps) => {
  const router = useRouter();
  return (
    <div className="py-4 flex flex-col items-center max-w-36 justify-between rounded-lg gap-2 flex-shrink-0">
      <div>
        <Image
          src={data.linkGambar}
          alt="buku"
          width={132}
          height={0}
          className="rounded-md border-2 border-black-custom"
        />
      </div>
      <div className="flex flex-col px-0.5 w-full justify-center">
        <h1 className="font-source-serif text-sm font-bold truncate">
          {data.judul}
        </h1>
        <h2 className="font-source-sans text-gray-text text-xs">
          {data.penulisBuku.map((d) => d.penulis.nama).join(", ")}
        </h2>
      </div>
      <button
        onClick={() => router.push(`/buku/${toSlug(data.judul)}`)}
        className={`bg-primary w-full text-white-custom font-source-sans leading-none text-xs rounded-md border-2 border-black-custom py-2 font-normal transition-all duration-300
        hover:font-bold hover:shadow-sm hover:transition-all hover:duration-300`}
      >
        Lihat Detail
      </button>
    </div>
  );
};

export default CardBuku;
