import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { peminjamType } from "@/lib";
import { toast } from "react-toastify";

interface ButtonPinjamProps {
  session:
    | (Session & { user: { role: "murid" | "guru"; username: string } })
    | null;
  isbn: string;
  judul: string;
  disabled: boolean;
  text?: string;
  peminjamanData?: any[];
  eksemplarCount: number;
}

const ButtonPinjam = ({
  session,
  isbn,
  judul,
  disabled,
  text,
  peminjamanData = [],
  eksemplarCount,
}: ButtonPinjamProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Tambahkan pengecekan array
  const safeArrayData = Array.isArray(peminjamanData) ? peminjamanData : [];

  // Check if current user has borrowed this book
  const currentUserBorrowing = safeArrayData.find(
    (peminjaman) =>
      peminjaman.nisUser === session?.user?.username &&
      peminjaman.bukuPinjaman?.some(
        (bp: any) => bp.bukuISBN === isbn && bp.tanggalKembali === null
      )
  );

  // Count total borrowed copies
  const totalBorrowed = safeArrayData.reduce((count, peminjaman) => {
    if (!Array.isArray(peminjaman.bukuPinjaman)) return count;

    return (
      count +
      peminjaman.bukuPinjaman.filter(
        (bp: any) => bp.bukuISBN === isbn && bp.tanggalKembali === null
      ).length
    );
  }, 0);

  const handleReturn = async () => {
    if (!session?.user?.username || !currentUserBorrowing) {
      toast.error("Terjadi kesalahan!");
      return;
    }

    setIsLoading(true);
    try {
      const borrowedBook = currentUserBorrowing.bukuPinjaman.find(
        (bp: any) => bp.bukuISBN === isbn && bp.tanggalKembali === null
      );

      if (!borrowedBook) {
        throw new Error("Data peminjaman tidak ditemukan");
      }

      const requestData = {
        idPeminjaman: currentUserBorrowing.id,
        bukuISBN: isbn,
        bukuId: borrowedBook.eksemplarId,
      };

      const response = await fetch("/api/buku/konfirmasi-pengembalian", {
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
            "Gagal mengembalikan buku"
        );
      }

      toast.success(responseData.message);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Terjadi kesalahan yang tidak diketahui saat mengembalikan buku"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinjam = async () => {
    if (!session?.user?.username) {
      toast.error("Anda harus login terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        nis: session.user.role === "murid" ? session.user.username : undefined,
        nip: session.user.role === "guru" ? session.user.username : undefined,
        keterangan: `Peminjaman buku ${judul}`,
        daftarBukuPinjaman: [
          {
            isbn: isbn,
            tenggatWaktu: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        ],
      } as peminjamType;

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

      toast.success("Buku berhasil dipinjam!");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Terjadi kesalahan yang tidak diketahui saat meminjam buku"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyle =
    "w-full mt-4 py-2 rounded-lg font-medium transition-colors";
  const activeStyle = "bg-jewel-green text-white hover:bg-dark-primary";
  const disabledStyle = "bg-gray-300 text-gray-600 cursor-not-allowed";

  if (isLoading) {
    return (
      <button className={`${buttonStyle} ${disabledStyle}`} disabled>
        Memproses...
      </button>
    );
  }

  // If current user has borrowed the book
  if (currentUserBorrowing) {
    return (
      <button
        onClick={handleReturn}
        className={`${buttonStyle} ${activeStyle}`}
      >
        Kembalikan
      </button>
    );
  }

  // If all copies are borrowed
  if (totalBorrowed >= eksemplarCount) {
    return (
      <button className={`${buttonStyle} ${disabledStyle}`} disabled>
        Sedang dipinjam
      </button>
    );
  }

  // Default borrow button
  return (
    <button onClick={handlePinjam} className={`${buttonStyle} ${activeStyle}`}>
      Pinjam
    </button>
  );
};

export default ButtonPinjam;
