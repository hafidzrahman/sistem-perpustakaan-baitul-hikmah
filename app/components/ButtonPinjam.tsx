import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

interface ButtonPinjamProps {
  session: Session | null;
  isbn: string;
  judul: string;
}

const ButtonPinjam = ({ session, isbn, judul }: ButtonPinjamProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePinjam = async () => {
    if (!session?.user?.username) {
      setError("Anda harus login terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestData = {
        nis: session.user.username,
        nip: null,
        keterangan: `Peminjaman buku ${judul}`,
        daftarBukuPinjaman: [
          {
            isbn: isbn,
            tenggatWaktu: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        ],
      };

      const response = await fetch("/api/peminjaman", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.details?.message ||
            responseData.message ||
            "Gagal melakukan peminjaman"
        );
      }

      alert("Peminjaman berhasil!");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui saat meminjam buku");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="w-full">
        <button
          onClick={() => setError("Silakan login terlebih dahulu")}
          className="bg-primary w-full text-white-custom font-source-sans leading-none text-xs rounded-md border-2 border-black-custom py-2 font-normal opacity-50"
        >
          Login untuk Pinjam
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={handlePinjam}
        disabled={isLoading}
        className={`bg-primary w-full text-white-custom font-source-sans leading-none text-xs rounded-md border-2 border-black-custom py-2 font-normal transition-all duration-300 
          ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:font-bold hover:shadow-sm hover:transition-all hover:duration-300"
          }`}
      >
        {isLoading ? "Memproses..." : "Pinjam"}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ButtonPinjam;
