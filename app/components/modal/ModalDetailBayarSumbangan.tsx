import React, { useRef, useState } from "react";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { detailSumbanganType, beriSumbanganType, tambahBukuType } from "@/lib";

interface DetailFormBuktiProps {
  isOpen: boolean;
  onClose: () => void;
  sumbanganId: number | null | undefined;
}

const ModalDetailSumbangan: React.FC<DetailFormBuktiProps> = ({
  isOpen,
  onClose,
  sumbanganId,
}) => {
  const [sumbangan, setSumbangan] = useState<
    detailSumbanganType | null | undefined
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [metodePembayaran, setMetodePembayaran] = useState<string>("buku");
  const [nominalValue, setNominalValue] = useState<string>("");
  const [inputCount, setInputCount] = useState<number>(1);
  const arrayObjekBuku = useRef<any[]>([{}]);

  function handleOnTambahBuku() {
    arrayObjekBuku.current.push({});
    setInputCount((prev) => prev + 1);
  }

  React.useEffect(() => {
    const fetchSumbangan = async () => {
      if (!sumbanganId) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/sumbangan/${sumbanganId}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil detail form bukti");
        }
        const data = await response.json();
        setSumbangan(data);
      } catch (err) {
        setError("Gagal memuat detail form bukti");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && sumbanganId) {
      fetchSumbangan();
    }
  }, [isOpen, sumbanganId]);

  const handleAccept = async () => {
    if (!sumbangan?.id) return;

    if (metodePembayaran === "tunai") {
      arrayObjekBuku.current = [];
    }

    try {
      const dataPembayaran: beriSumbanganType = {
        idSumbangan: sumbangan.id,
        nominalTotal: Number(nominalValue),
        buku: arrayObjekBuku.current.map((objekBuku: any) => {
          const dataBuku: tambahBukuType = {
            isbn: objekBuku.isbn,
            judul: objekBuku.judul,
            penulis: objekBuku.penulis,
            penerbit: objekBuku.penerbit,
            halaman: Number(objekBuku.halaman),
            genre: objekBuku.genre,
            linkGambar: objekBuku.linkGambar,
            sinopsis: objekBuku.sinopsis,
            tanggalMasuk: new Date(),
            idSumbangan: sumbangan.id,
          };
          return dataBuku;
        }),
      };

      const response = await fetch(`/api/sumbangan/beri-sumbangan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPembayaran),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      arrayObjekBuku.current = [{}];
      setNominalValue("");
      setTimeout(onClose, 1000);
    } catch (err) {
      setError("Gagal mengubah status form bukti");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 md:w-4/5 max-h-[90vh] overflow-y-auto relative flex flex-col gap-4 p-4 md:p-8 bg-white-custom border-black-custom rounded-lg border-2">
        <button
          onClick={onClose}
          className="absolute top-4 md:top-6 p-2 right-4 md:right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h2 className="text-2xl md:text-3xl font-extrabold font-source-serif text-light-primary">
          Detail Sumbangan
        </h2>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-primary"></div>
          </div>
        )}

        {error && (
          <div className="w-full p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-source-sans">
            {error}
          </div>
        )}

        {sumbangan && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border-2 border-black-custom">
                  <h3 className="font-source-serif text-lg font-bold mb-3">
                    Informasi {`${sumbangan.murid ? "Murid" : "Guru"}`}
                  </h3>
                  <div className="space-y-2 font-source-sans">
                    <p>Nama: {sumbangan.murid?.nama}</p>
                    <p>{`${sumbangan.murid ? "NIS" : "NIP"}: ${
                      sumbangan.murid?.nis || sumbangan.guru?.nip
                    }`}</p>
                    <p>
                      Kontak:{" "}
                      {sumbangan.murid?.kontak || sumbangan.guru?.kontak}
                    </p>
                    <p>
                      Alamat:{" "}
                      {sumbangan.murid?.alamat || sumbangan.guru?.alamat}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border-2 border-black-custom">
                  <h3 className="font-source-serif text-lg font-bold mb-3">
                    Informasi Keterangan Sumbangan
                  </h3>
                  <div className="space-y-2 font-source-sans">
                    <p>Keterangan: {sumbangan.keterangan.keterangan}</p>
                    <p>Jumlah Buku: {sumbangan.keterangan.jumlahBuku}</p>
                    <p>
                      Total Nominal: Rp{" "}
                      {sumbangan.keterangan.totalNominal?.toLocaleString()}
                    </p>
                    <p>
                      Nominal per Hari: Rp{" "}
                      {sumbangan.keterangan.nominalPerHari?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border-2 border-black-custom">
                  <h3 className="font-source-serif text-lg font-bold mb-3">
                    Detail Status
                  </h3>
                  <div className="space-y-2 font-source-sans">
                    <p>
                      Tanggal Selesai:{" "}
                      <span className="font-medium">
                        {sumbangan.tanggalSelesai?.toString() || "-"}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      Status:{" "}
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          sumbangan.tanggalSelesai
                            ? "bg-pastel-green text-jewel-green"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {sumbangan.tanggalSelesai
                          ? "Terverifikasi"
                          : "Menunggu"}
                      </span>
                    </p>
                  </div>
                </div>

                {!sumbangan.tanggalSelesai && (
                  <div className="bg-white p-4 rounded-lg border-2 border-black-custom">
                    <h3 className="font-source-serif text-lg font-bold mb-3">
                      Pembayaran
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="metode-pembayaran"
                          className="font-source-serif font-bold"
                        >
                          Metode Pembayaran
                        </label>
                        <select
                          name="metode-pembayaran"
                          id="metode-pembayaran"
                          defaultValue="buku"
                          onChange={(e) => setMetodePembayaran(e.target.value)}
                          className="py-2 px-6 w-full border border-black rounded-md font-source-sans"
                        >
                          <option value="buku">Buku</option>
                          <option value="tunai">Tunai</option>
                        </select>
                      </div>

                      {metodePembayaran === "tunai" ? (
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="nominal"
                            className="font-source-serif font-bold"
                          >
                            Nominal
                          </label>
                          <input
                            type="number"
                            id="nominal"
                            value={nominalValue}
                            onChange={(e) => setNominalValue(e.target.value)}
                            className="py-2 px-6 w-full border border-black rounded-md font-source-sans"
                            placeholder="Masukkan nominal pembayaran"
                          />
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {arrayObjekBuku.current.map((_, index) => (
                            <div
                              key={index}
                              className="space-y-4 p-4 border-2 border-black rounded-lg"
                            >
                              <h4 className="font-source-serif font-bold">
                                Buku {index + 1}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                  label="ISBN"
                                  id={`isbn-${index}`}
                                  onChange={(e) =>
                                    (arrayObjekBuku.current[index].isbn =
                                      e.target.value)
                                  }
                                />
                                <InputField
                                  label="Judul"
                                  id={`judul-${index}`}
                                  onChange={(e) =>
                                    (arrayObjekBuku.current[index].judul =
                                      e.target.value)
                                  }
                                />
                                <InputField
                                  label="Penulis"
                                  id={`penulis-${index}`}
                                  onChange={(e) =>
                                    (arrayObjekBuku.current[index].penulis =
                                      e.target.value)
                                  }
                                />
                                <InputField
                                  label="Penerbit"
                                  id={`penerbit-${index}`}
                                  onChange={(e) =>
                                    (arrayObjekBuku.current[index].penerbit =
                                      e.target.value)
                                  }
                                />
                                <InputField
                                  label="Halaman"
                                  id={`halaman-${index}`}
                                  type="number"
                                  onChange={(e) =>
                                    (arrayObjekBuku.current[index].halaman =
                                      e.target.value)
                                  }
                                />
                                <InputField
                                  label="Genre"
                                  id={`genre-${index}`}
                                  onChange={(e) =>
                                    (arrayObjekBuku.current[index].genre =
                                      e.target.value)
                                  }
                                />
                                <InputField
                                  label="Link Gambar"
                                  id={`linkGambar-${index}`}
                                  onChange={(e) =>
                                    (arrayObjekBuku.current[index].linkGambar =
                                      e.target.value)
                                  }
                                />
                                <InputField
                                  label="Sinopsis"
                                  id={`sinopsis-${index}`}
                                  onChange={(e) =>
                                    (arrayObjekBuku.current[index].sinopsis =
                                      e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={handleOnTambahBuku}
                            className="w-full py-2 px-4 bg-light-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 font-source-sans"
                          >
                            Tambah Buku
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!sumbangan.tanggalSelesai && (
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border-2 border-black rounded-lg hover:bg-gray-100 font-source-sans"
                >
                  Batal
                </button>
                <button
                  onClick={handleAccept}
                  className="bg-dark-primary text-white-custom font-source-sans text-sm py-2 px-6 rounded-lg border-2 border-black hover:shadow-md transition-all duration-300"
                >
                  Terima Sumbangan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({
  label,
  id,
  type = "text",
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="font-source-serif font-bold text-sm">
      {label}
    </label>
    <input
      type={type}
      id={id}
      onChange={onChange}
      className="py-2 px-4 w-full border border-black rounded-md font-source-sans text-sm"
      placeholder={`Masukkan ${label.toLowerCase()}`}
    />
  </div>
);

export default ModalDetailSumbangan;
