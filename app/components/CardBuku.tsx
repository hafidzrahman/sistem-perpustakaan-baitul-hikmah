"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toSlug } from "../utils/slug";

interface CardBukuProps {
  judul: string;
  penulis: string;
  link: string;
}

const CardBuku = ({ judul, penulis, link }: CardBukuProps) => {
  const router = useRouter();
  return (
    <div className="py-4 flex flex-col items-center justify-between rounded-lg gap-2 flex-shrink-0">
      <div>
        <Image
          src={link}
          alt="buku"
          width={132}
          height={0}
          className="rounded-md border-2 border-black-custom"
        />
      </div>
      <div className="flex flex-col px-0.5 w-full justify-center">
        <h1 className="font-source-serif text-sm font-bold">{judul}</h1>
        <h2 className="font-source-sans text-dark-gray text-xs">{penulis}</h2>
      </div>
      <button
        onClick={() => router.push(`/buku/${toSlug(judul)}`)}
        className={`bg-primary w-full text-white-custom font-source-sans leading-none text-xs rounded-md border-2 border-black-custom py-2 font-normal`}
      >
        Lihat Detail
      </button>
    </div>
  );
};

export default CardBuku;
