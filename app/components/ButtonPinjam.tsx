import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { peminjamType } from "@/lib";
import { toast } from "react-toastify";

interface ButtonPinjamProps {
  session:
    | (Session & {
        user: {
          role: "murid" | "guru";
          username: string;
        };
      })
    | null;
  isbn: string;
  judul: string;
  disabled: boolean;
  text?: string;
  peminjamanData?: any[];
  eksemplarCount: number;
  onUpdatePeminjaman?: (newPeminjaman: any) => void;
}

const ButtonPinjam = ({
  session,
  isbn,
  judul,
  peminjamanData = [],
  eksemplarCount: initialEksemplarCount,
  onUpdatePeminjaman,
}: ButtonPinjamProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [localPeminjamanData, setLocalPeminjamanData] =
    useState(peminjamanData);
  const [localEksemplarCount, setLocalEksemplarCount] = useState(
    initialEksemplarCount
  );

  // Update local state when props change
  useEffect(() => {
    setLocalPeminjamanData(peminjamanData);
    setLocalEksemplarCount(initialEksemplarCount);
  }, [peminjamanData, initialEksemplarCount]);

  const safeArrayData = Array.isArray(localPeminjamanData)
    ? localPeminjamanData
    : [];

  // Check if current user has borrowed this book
  const currentUserBorrowing = safeArrayData.find((peminjaman) => {
    const isGuru = session?.user?.role === "guru";
    const userIdentifier = isGuru ? peminjaman.nip : peminjaman.nis;

    return (
      userIdentifier === session?.user?.username &&
      peminjaman.bukuPinjaman?.some(
        (bp: any) => bp.bukuISBN === isbn && bp.tanggalKembali === null
      )
    );
  });

  // Optimistic update function
  const updateLocalState = (newPeminjaman: any) => {
    setLocalPeminjamanData((prev) => [...prev, newPeminjaman]);
    setLocalEksemplarCount((prev) => Math.max(0, prev - 1));

    if (onUpdatePeminjaman) {
      onUpdatePeminjaman(newPeminjaman);
    }
  };

  const handlePinjam = async () => {
    if (!session?.user?.username) {
      toast.error("Anda harus login terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    // Create the new peminjaman object
    const newPeminjaman = {
      nis: session.user.role === "murid" ? session.user.username : undefined,
      nip: session.user.role === "guru" ? session.user.username : undefined,
      bukuPinjaman: [
        {
          bukuISBN: isbn,
          tanggalKembali: null,
        },
      ],
    };

    // Optimistic update
    updateLocalState(newPeminjaman);

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
        console.log("error")
        // Rollback optimistic update if request fails
        setLocalPeminjamanData(peminjamanData);
        setLocalEksemplarCount(initialEksemplarCount);
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

  if (currentUserBorrowing) {
    return (
      <button className={`${buttonStyle} ${disabledStyle}`} disabled>
        Sudah dipinjam
      </button>
    );
  }

  if (localEksemplarCount === 0) {
    return (
      <button className={`${buttonStyle} ${disabledStyle}`} disabled>
        Sedang dipinjam
      </button>
    );
  }

  return (
    <button onClick={handlePinjam} className={`${buttonStyle} ${activeStyle}`}>
      Pinjam
    </button>
  );
};

export default ButtonPinjam;
