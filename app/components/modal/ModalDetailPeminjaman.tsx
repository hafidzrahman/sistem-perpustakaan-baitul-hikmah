import React, { useState } from "react";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { bukuType, guruType, muridType, peminjamanType } from "@/lib";

interface DetailPeminjamanProps {
  isOpen: boolean;
  onClose: () => void;
  peminjaman: peminjamanType | null;
  bukuInfo: bukuType | null;
  peminjam: guruType | muridType | null;
}

const ModalDetailPeminjaman: React.FC<DetailPeminjamanProps> = ({
  isOpen,
  onClose,
  peminjaman,
  bukuInfo,
  peminjam,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen || !peminjaman) return null;

  const handleConfirmReturn = async (
    idPeminjaman: number,
    bukuPinjaman: peminjamanType["bukuPinjaman"][0]
  ) => {
    if (!bukuPinjaman) {
      toast.error("Data buku pinjaman tidak ditemukan");
      return;
    }

    const payload = {
      idPeminjaman,
      bukuISBN: bukuPinjaman.bukuISBN,
      bukuId: bukuPinjaman.bukuId,
    };

    setIsLoading(true);
    try {
      const response = await fetch(
        "/api/buku-pinjaman/konfirmasi-pengembalian",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.details?.message || data.message;
        throw new Error(errorMessage);
      }

      toast.success(data.message);
      router.refresh();
      setTimeout(onClose, 1000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengkonfirmasi pengembalian"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusPeminjaman = (
    tanggalKembali: Date | null,
    tenggatWaktu: Date
  ) => {
    if (!tanggalKembali) return "Masih";
    const kembali = new Date(tanggalKembali);
    const tenggat = new Date(tenggatWaktu);
    return kembali > tenggat ? "Terlambat" : "Dikembalikan";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Masih":
        return "bg-pastel-green text-jewel-green";
      case "Dikembalikan":
        return "bg-pastel-blue text-jewel-blue";
      case "Terlambat":
        return "bg-pastel-red text-jewel-red";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 md:w-3/4 lg:w-1/2 relative flex flex-col gap-4 p-8 bg-white border-2 border-black rounded-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h2 className="text-2xl font-bold font-source-serif text-light-primary">
          Detail Peminjaman
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Informasi Peminjam</h3>
                <p className="text-sm">Nama: {peminjam?.nama}</p>
                <p className="text-sm">
                  {peminjam && "nis" in peminjam
                    ? `NIS: ${peminjam.nis}`
                    : `NIP: ${peminjam?.nip}`}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Informasi Buku</h3>
                <p className="text-sm">Judul: {bukuInfo?.judul}</p>
                <p className="text-sm">ISBN: {bukuInfo?.isbn}</p>
                <p className="text-sm">
                  Eksemplar: {bukuInfo?._count?.eksemplarBuku}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Detail Peminjaman</h3>
                <p className="text-sm">
                  Tanggal Pinjam:{" "}
                  {peminjaman.tanggalPinjam
                    ? new Date(peminjaman.tanggalPinjam).toLocaleString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Tanggal tidak tersedia"}
                </p>
                {peminjaman.bukuPinjaman.map((buku, index) => {
                  const status = getStatusPeminjaman(
                    buku.tanggalKembali,
                    buku.tenggatWaktu
                  );

                  return (
                    <div key={index} className="space-y-2">
                      <p className="text-sm">
                        Tenggat Waktu:{" "}
                        {new Date(buku.tenggatWaktu).toLocaleString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm">
                        Status:{" "}
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </p>
                      {!buku.tanggalKembali && (
                        <div className="pt-4">
                          <button
                            onClick={() =>
                              handleConfirmReturn(peminjaman.id, buku)
                            }
                            disabled={isLoading}
                            className="bg-dark-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading
                              ? "Memproses..."
                              : "Konfirmasi Pengembalian"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailPeminjaman;
