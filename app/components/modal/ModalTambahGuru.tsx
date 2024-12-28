import { useState } from "react";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { toast } from "react-toastify";

interface ModalTambahGuruProps {
  status: boolean;
  handle: () => void;
}

const ModalTambahGuru = ({ status, handle }: ModalTambahGuruProps) => {
  const [formData, setFormData] = useState({
    nip: "",
    nama: "",
    jenisKelamin: "",
    kontak: "",
    alamat: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      nip: "",
      nama: "",
      jenisKelamin: "",
      kontak: "",
      alamat: "",
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nip.trim() || !formData.nama.trim()) {
      toast.error("NIP dan nama tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/guru", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Guru ${data.nama} berhasil ditambahkan!`);
        resetForm(); // Hanya reset form tanpa menutup modal
      } else {
        toast.error(data.error || "Gagal menambahkan guru");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan guru");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed bg-black bg-opacity-50 inset-0 z-50 flex items-center justify-center ${
        status ? "block" : "hidden"
      }`}
    >
      <div className="w-1/2 relative flex flex-col items-center gap-4 p-8 bg-white-custom border-black-custom rounded-lg border-2">
        <button
          onClick={handle}
          className="absolute top-6 p-2 right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h1 className="text-3xl font-extrabold font-source-serif sm:text-3xl text-light-primary">
          Tambah Guru
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-4 justify-center items-stretch"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="nip"
              className="font-source-serif text-lg font-bold"
            >
              NIP
            </label>
            <input
              autoComplete="off"
              type="text"
              id="nip"
              value={formData.nip}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nip: e.target.value }))
              }
              placeholder="Masukkan NIP"
              className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
              disabled={isSubmitting}
            />
          </div>

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
              value={formData.nama}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nama: e.target.value }))
              }
              placeholder="Masukkan nama lengkap"
              className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="jenisKelamin"
              className="font-source-serif text-lg font-bold"
            >
              Jenis Kelamin
            </label>
            <div className="relative">
              <select
                id="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jenisKelamin: e.target.value,
                  }))
                }
                className="py-3 px-6 w-full border border-black rounded-md text-sm font-source-sans appearance-none"
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Pilih Jenis Kelamin
                </option>
                <option value="LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                ▼
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="kontak"
              className="font-source-serif text-lg font-bold"
            >
              Kontak
            </label>
            <input
              autoComplete="off"
              type="text"
              id="kontak"
              value={formData.kontak}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, kontak: e.target.value }))
              }
              placeholder="Masukkan nomor telepon"
              className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="alamat"
              className="font-source-serif text-lg font-bold"
            >
              Alamat
            </label>
            <textarea
              id="alamat"
              value={formData.alamat}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, alamat: e.target.value }))
              }
              placeholder="Masukkan alamat lengkap"
              className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans resize-none h-24"
              disabled={isSubmitting}
            />
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
            {isSubmitting ? "Menambahkan..." : "Tambahkan Guru"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahGuru;
