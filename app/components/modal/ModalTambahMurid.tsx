import { useEffect, useState } from "react";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { muridType, userType } from "@/lib";
import { toast } from "react-toastify";

interface ModalTambahMuridProps {
  status: boolean;
  handle: () => void;
}

const ModalTambahMurid = ({ status, handle }: ModalTambahMuridProps) => {
  const [nis, setNIS] = useState("");
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [kontakOrtu, setKontakOrtu] = useState("");
  const [alamat, setAlamat] = useState("");
  const [idKelas, setIdKelas] = useState<number>(0);
  const [kelas, setKelas] = useState([]);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data kelas
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await fetch("/api/kelas");
        const data = await response.json();
        setKelas(data);
      } catch (error) {
        console.error("Gagal mengambil data kelas:", error);
        toast.error("Gagal mengambil data kelas");
      }
    };
    fetchKelas();
  }, [status]);

  const resetForm = () => {
    setNIS("");
    setNama("");
    setJenisKelamin("");
    setKontakOrtu("");
    setAlamat("");
    setIdKelas(0);
    setPassword("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!nis.trim()) {
      toast.error("NIS tidak boleh kosong!");
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
    if (!idKelas) {
      toast.error("Kelas harus dipilih!");
      return;
    }
    if (!password.trim()) {
      toast.error("Kata sandi tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add student data
      let response = await fetch("/api/murid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nis,
          nama,
          jenisKelamin,
          kontak: kontakOrtu,
          alamat,
          idKelas: Number(idKelas),
        } as muridType),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menambahkan data murid");
      }

      // Create user account
      response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: nis,
          muridNIS: nis,
          password: password,
          role: "murid",
        } as userType),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal membuat akun murid");
      }

      toast.success(
        `Berhasil menambahkan akun dan data murid dengan nis ${nis}`
      );
      resetForm();
      handle(); // Close modal after success
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menambahkan murid"
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
      <div className="w-11/12 md:w-3/5 max-h-[90vh] overflow-y-auto relative flex flex-col items-center gap-4 p-4 md:p-8 bg-white-custom border-black-custom rounded-lg border-2">
        <button
          onClick={handle}
          className="absolute top-4 md:top-6 p-2 right-4 md:right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h1 className="text-2xl md:text-3xl font-extrabold font-source-serif text-light-primary">
          Tambah Murid
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-4 justify-center items-stretch"
        >
          <div className="w-full flex flex-col md:flex-row gap-6">
            <div className="flex w-full md:w-1/2 flex-col gap-4 items-stretch">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="nis"
                  className="font-source-serif text-lg font-bold"
                >
                  NIS
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  id="nis"
                  value={nis}
                  onChange={(e) => setNIS(e.target.value)}
                  placeholder="Masukkan NIS murid"
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
                  htmlFor="idKelas"
                  className="font-source-serif text-lg font-bold"
                >
                  Kelas
                </label>
                <div className="relative">
                  <select
                    id="idKelas"
                    value={idKelas}
                    onChange={(e) => setIdKelas(Number(e.target.value))}
                    className="py-3 px-6 w-full border text-xs border-black rounded-md font-source-sans appearance-none"
                    disabled={isSubmitting}
                  >
                    <option value={0} disabled>
                      Pilih Kelas
                    </option>
                    {kelas.map(
                      (k: { id: number; nama: string; tingkat: number }) => (
                        <option key={k.id} value={k.id}>
                          {k.tingkat} {k.nama}
                        </option>
                      )
                    )}
                  </select>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ▼
                  </span>
                </div>
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
                  placeholder="Masukkan nama murid"
                  className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="kontak"
                  className="font-source-serif text-lg font-bold"
                >
                  Kontak Ortu
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  id="kontak"
                  value={kontakOrtu}
                  onChange={(e) => setKontakOrtu(e.target.value)}
                  placeholder="Masukkan kontak orang tua murid"
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
                  placeholder="Masukkan kata sandi akun murid"
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
                  placeholder="Masukkan alamat murid"
                  className="py-3 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
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
            {isSubmitting ? "Menambahkan..." : "Tambahkan Murid"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahMurid;
