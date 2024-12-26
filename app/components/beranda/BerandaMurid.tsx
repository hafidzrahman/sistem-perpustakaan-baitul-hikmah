"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { bukuType } from "@/lib";

const BerandaMurid = () => {
  const { data: session } = useSession();
  const [peminjaman, setPeminjaman] = useState([]);
  const [buku, setBuku] = useState<bukuType[]>([]);

  console.log(session?.user?.username);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch peminjaman khusus murid yang sedang login
        const responsePeminjaman = await fetch(
          `/api/peminjaman?userId=${session?.user?.username}`
        );
        const dataPeminjaman = await responsePeminjaman.json();
        setPeminjaman(dataPeminjaman);

        // Fetch data buku
        const responseBuku = await fetch("/api/buku");
        const dataBuku = await responseBuku.json();
        setBuku(dataBuku);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (session?.user?.username) {
      fetchData();
    }
  }, [session]);

  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Assalamu'alaikum wr wb., {session?.user?.name}
        </h2>
      </div>

      {/* Section untuk buku yang sedang dipinjam */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="border-2 border-dark-gray rounded-lg p-6">
          <h2 className="font-source-sans text-xl font-bold mb-4">
            Buku yang Sedang Dipinjam
          </h2>
          {/* Tampilkan daftar buku yang sedang dipinjam */}
        </div>
      </div>

      {/* Section untuk riwayat peminjaman */}
      <div className="border-2 border-dark-gray rounded-lg p-6">
        <h2 className="font-source-sans text-xl font-bold mb-4">
          Riwayat Peminjaman
        </h2>
        {/* Tampilkan tabel riwayat peminjaman */}
      </div>
    </>
  );
};

export default BerandaMurid;
