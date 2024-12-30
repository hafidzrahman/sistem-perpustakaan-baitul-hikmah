import { useEffect, useState } from "react";
import { classType, imposeFineType, infType } from "@/lib";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { toast } from "react-toastify";

interface ModalTambahDendaProps {
  status: boolean;
  handle: () => void;
}

const ModalTambahDenda = ({ status, handle }: ModalTambahDendaProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isNIS, setIsNIS] = useState(1)
  const [idKeterangan, setIdKeterangan] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keterangan, setKeterangan] = useState<infType[]>([])
  const resetForm = () => {
    setInputValue("");
    setIdKeterangan(1);
  };

  useEffect(() => {
    async function fetching() {
      const response = await fetch("/api/keterangan/denda");
      const responseData = await response.json();
      if (!responseData) {
        throw new Error("Gagal mendapatkan data keterangan")
      }
      setKeterangan(responseData)
    }

    fetching()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      toast.error("inputValue kelas tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/denda/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nis : (isNIS === 1) && inputValue,
          nip : (isNIS === 0) && inputValue,
          idKeterangan,
        } as imposeFineType),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Kelas ${data.inputValue} berhasil ditambahkan!`);
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
          Tambah Denda
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-4 justify-center items-stretch"
        >
          <div className="flex flex-col gap-1">
          <select
                id="isNIS"
                value={isNIS}
                onChange={(e) => setIsNIS(Number(e.target.value))}
                className="py-3 px-6 w-full border border-black rounded-md text-sm font-source-sans appearance-none"
                disabled={isSubmitting}
              >
                <option value={1} disabled>
                  Pilih NIS atau NIP
                </option>
                <option value={1}>NIS</option>
                <option value={0}>NIP</option>
              </select>
            <input
              autoComplete="off"
              type="text"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Masukkan inputValue murid"
              className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="idKeterangan"
              className="font-source-serif text-lg font-bold"
            >
              Keterangan
            </label>
            <div className="relative">
              <select
                id="idKeterangan"
                value={idKeterangan}
                onChange={(e) => setIdKeterangan(Number(e.target.value))}
                className="py-3 px-6 w-full border border-black rounded-md text-sm font-source-sans appearance-none"
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Pilih Keterangan Denda
                </option>
                {keterangan.map(data => <option key={data.id} value={data.id}>{data.keterangan}</option>)}
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
            {isSubmitting ? "Menambahkan..." : "Tambahkan Denda"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahDenda;
