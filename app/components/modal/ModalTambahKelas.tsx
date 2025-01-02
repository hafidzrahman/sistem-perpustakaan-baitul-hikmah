import { useState } from "react";
import { kelasType } from "@/lib";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { toast } from "react-toastify";

interface ModalTambahKelasProps {
  status: boolean;
  handle: () => void;
}

const ModalTambahKelas = ({ status, handle }: ModalTambahKelasProps) => {
  const [nama, setNama] = useState("");
  const [tingkat, setTingkat] = useState<number>(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setNama("");
    setTingkat(7);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      toast.error("Nama kelas tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/kelas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          tingkat,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Kelas ${data.nama} berhasil ditambahkan!`);
        resetForm();
        handle(); // Tutup modal setelah berhasil
      } else {
        toast.error(data.error || "Gagal menambahkan kelas");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan kelas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed bg-black bg-opacity-50 inset-0 z-50 flex items-center justify-center ${
        status ? "block" : "hidden"
      } `}
    >
      <div className="w-1/2 relative flex flex-col items-center gap-4 p-8 bg-white-custom border-black-custom rounded-lg border-2">
        <button
          onClick={handle}
          className="absolute top-6 p-2 right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h1 className="text-3xl font-extrabold font-source-serif sm:text-3xl text-light-primary">
          Tambah Kelas
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-4 justify-center items-stretch"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="nama"
              className="font-source-serif text-lg font-bold"
            >
              Nama
            </label>
            <input
              autoComplete="off"
              type="text"
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama kelas"
              className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="tingkat"
              className="font-source-serif text-lg font-bold"
            >
              Tingkat
            </label>
            <div className="relative">
              <select
                id="tingkat"
                value={tingkat}
                onChange={(e) => setTingkat(Number(e.target.value))}
                className="py-3 px-6 w-full border border-black rounded-md text-sm font-source-sans appearance-none"
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Pilih Tingkat Kelas
                </option>
                <option value={7}>Kelas 7</option>
                <option value={8}>Kelas 8</option>
                <option value={9}>Kelas 9</option>
              </select>
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                ▼
              </span>
            </div>
          </div>
          <p className="text-gray-text italic text-sm">
            *Data tetap akan bisa diubah di lain waktu
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-dark-primary text-white-custom font-source-sans text-sm py-2 w-full rounded-lg border-2 border-black hover:shadow-md transition-all duration-300 hover:transition-all hover:duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Menambahkan..." : "Tambahkan Kelas"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahKelas;
