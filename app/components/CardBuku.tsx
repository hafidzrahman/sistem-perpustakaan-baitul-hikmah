import Image from "next/image";
import { useSession } from "next-auth/react";
import { cariBukuType } from "@/lib";
import ButtonDetail from "./ButtonDetail";
import ButtonPinjam from "./ButtonPinjam";

const CardBuku = ({ data }: { data: cariBukuType }) => {
  const { data: session } = useSession();

  if (!data) {
    return <div>kosong</div>;
  }

  const { linkGambar, judul, penulis, isbn } = data;

  return (
    <div className="py-4 flex flex-col items-center max-w-36 justify-between rounded-lg gap-2 flex-shrink-0">
      <div>
        <Image
          src={linkGambar || "/placeholder-book.jpg"}
          alt={`Cover buku ${judul}`}
          width={132}
          height={200}
          className="rounded-md border-2 border-black-custom"
        />
      </div>
      <div className="flex flex-col px-0.5 w-full justify-center">
        <h1 className="font-source-serif text-sm font-bold truncate">
          {judul}
        </h1>
        <h2 className="font-source-sans text-gray-text text-xs">
          {penulis.map((d) => d.nama).join(", ")}
        </h2>
      </div>
      <ButtonDetail isbn={isbn} />
    </div>
  );
};

export default CardBuku;
