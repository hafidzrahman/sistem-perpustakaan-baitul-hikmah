import { useEffect, useState } from "react";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import {muridType} from "@/lib";

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
  const [idKelas, setIdKelas] = useState<number>(0); // State untuk menyimpan ID kelas
  const [kelas, setKelas] = useState([]); // State untuk menyimpan daftar kelas

  // Fetch data kelas
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await fetch("/api/kelas");
        const data = await response.json();
        setKelas(data);
      } catch (error) {
        console.error("Gagal mengambil data kelas:", error);
      }
    };
    fetchKelas();
  }, [status]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data : muridType = {
        nis,
        nama,
        jenisKelamin,
        kontak : kontakOrtu,
        alamat,
        idKelas: Number(idKelas),
      }
      const response = await fetch("/api/murid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nis,
          nama,
          jenisKelamin,
          kontakOrtu,
          alamat,
          idKelas: Number(idKelas),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNIS("");
        setNama("");
        setJenisKelamin("");
        setKontakOrtu("");
        setAlamat("");
        setIdKelas(0);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
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
          Tambah Murid
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-4 justify-center items-stretch"
        >
          <div className="w-full flex gap-6">
            <div className="flex w-1/2 flex-col gap-4 items-stretch">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="nis"
                  className="font-source-serif text-lg font-bold"
                >
                  NIS
                </label>
                <input
                  type="text"
                  id="nis"
                  value={nis}
                  onChange={(e) => setNIS(e.target.value)}
                  placeholder="Masukkan NIS murid"
                  className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
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
                    className="py-3 px-6 w-full border border-black rounded-md text-sm font-source-sans appearance-none"
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
                    className="py-3 px-6 w-full border border-black rounded-md text-sm font-source-sans appearance-none"
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
            <div className="flex w-1/2 flex-col gap-4 items-stretch">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="isbn"
                  className="font-source-serif text-lg font-bold"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="isbn"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama murid"
                  className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
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
                  type="text"
                  id="kontak"
                  value={kontakOrtu}
                  onChange={(e) => setKontakOrtu(e.target.value)}
                  placeholder="Masukkan kontak orang tua murid"
                  className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
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
                />
              </div>
            </div>
          </div>

          <p className="text-gray-text italic text-sm">
            *Data tetap akan bisa diubah di lain waktu
          </p>
          <button
            type="submit"
            className="bg-dark-primary text-white-custom font-source-sans text-sm py-2 w-full rounded-lg border-2 border-black hover:shadow-md transition-all duration-300 hover:transition-all hover:duration-300"
          >
            Tambahkan Murid
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahMurid;
