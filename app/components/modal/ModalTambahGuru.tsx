import { useState } from "react";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { toast } from "react-toastify";

interface ModalTambahGuruProps {
  status: boolean;
  handle: () => void;
}

const ModalTambahGuru = ({ status, handle }: ModalTambahGuruProps) => {
  const [nip, setNIP] = useState("");
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [kontak, setKontak] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setNIP("");
    setNama("");
    setJenisKelamin("");
    setKontak("");
    setAlamat("");
    setPassword("");
  };

  const getFormattedName = (name: string, gender: string) => {
    const title = gender === "LAKI" ? "Ustadz" : "Ustadzah";
    return `${title} ${name}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!nip.trim()) {
      toast.error("NIP tidak boleh kosong!");
      return;
    }
    if (!nama.trim()) {
      toast.error("Nama tidak boleh kosong!");
      return;
    }
    if (!jenisKelamin) {
      toast.error("Jenis kelamin harus dipilih!");
      return;
    }
    if (!password.trim()) {
      toast.error("Kata sandi tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the name with the appropriate title
      const formattedName = getFormattedName(nama.trim(), jenisKelamin);

      // Add teacher data
      let response = await fetch("/api/guru", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nip,
          nama: formattedName, // Use the formatted name here
          jenisKelamin,
          kontak,
          alamat,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menambahkan data guru");
      }

      // Create user account
      response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: nip,
          guruNIP: nip,
          password: password,
          role: "guru",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal membuat akun guru");
      }

      toast.success(
        `Berhasil menambahkan akun dan data guru dengan nip ${nip}`
      );
      resetForm();
      handle(); // Close modal after success
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menambahkan guru"
      );
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
      <div className="w-11/12 md:w-3/5 relative flex flex-col items-center gap-4 p-4 md:p-8 bg-white-custom border-black-custom rounded-lg border-2">
        <button
          onClick={handle}
          className="absolute top-4 md:top-6 p-2 right-4 md:right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h1 className="text-2xl md:text-3xl font-extrabold font-source-serif text-light-primary">
          Tambah Guru
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-4 justify-center items-stretch"
        >
          <div className="w-full flex flex-col md:flex-row gap-6">
            <div className="flex w-full md:w-1/2 flex-col gap-4 items-stretch">
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
                  value={nip}
                  onChange={(e) => setNIP(e.target.value)}
                  placeholder="Masukkan NIP"
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
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value)}
                    className="py-3 px-6 w-full border text-xs border-black rounded-md font-source-sans appearance-none"
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
                  value={kontak}
                  onChange={(e) => setKontak(e.target.value)}
                  placeholder="Masukkan nomor telepon"
                  className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex w-full md:w-1/2 flex-col gap-4 items-stretch">
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
                  placeholder="Masukkan nama lengkap (tanpa Ustadz/Ustadzah)"
                  className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="font-source-serif text-lg font-bold"
                >
                  Kata Sandi Akun
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
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
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans resize-none h-24"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <p className="text-gray-text italic text-sm mt-4">
            *Data tetap akan bisa diubah di lain waktu
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-dark-primary text-white-custom font-source-sans text-sm py-2 w-full rounded-lg border-2 border-black hover:shadow-md transition-all duration-300 ${
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
