import { useEffect, useState } from "react";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { formBuktiType } from "@/lib";
import { useSession } from "next-auth/react";

interface ModalFormBuktiProps {
  status: boolean;
  handle: () => void;
}

const ModalFormBukti = ({ status, handle }: ModalFormBuktiProps) => {
  const { data: session } = useSession();
  const [bukuList, setBukuList] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bukuISBN: "",
    muridNIS: "",
    intisari: "",
    tanggal: new Date().toISOString().split("T")[0],
    halamanAwal: "",
    halamanAkhir: "",
    status: false,
  });

  useEffect(() => {
    const fetchBuku = async () => {
      try {
        const response = await fetch("/api/buku");
        if (!response.ok) {
          throw new Error("Gagal mengambil data buku");
        }
        const data = await response.json();
        setBukuList(data);
      } catch (error) {
        setErrorMessage("Gagal memuat daftar buku. Silakan coba lagi.");
      }
    };
    fetchBuku();
  }, [status]);

  useEffect(() => {
    if (session?.user?.username) {
      setFormData((prev) => ({
        ...prev,
        muridNIS: session.user.username,
      }));
    }
  }, [session?.user?.username]);

  const validateForm = () => {
    if (!formData.bukuISBN) {
      setErrorMessage("Silakan pilih buku terlebih dahulu");
      return false;
    }
    if (!formData.tanggal) {
      setErrorMessage("Silakan isi tanggal baca");
      return false;
    }
    if (!formData.halamanAwal || !formData.halamanAkhir) {
      setErrorMessage("Silakan isi halaman awal dan akhir");
      return false;
    }
    if (Number(formData.halamanAwal) > Number(formData.halamanAkhir)) {
      setErrorMessage(
        "Halaman awal tidak boleh lebih besar dari halaman akhir"
      );
      return false;
    }
    if (!formData.intisari.trim()) {
      setErrorMessage("Silakan isi intisari bacaan");
      return false;
    }
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage(""); // Clear error message when user makes changes
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/form-bukti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim form bukti");
      }

      // Reset form and close modal on success
      setFormData({
        bukuISBN: "",
        muridNIS: session?.user?.username || "",
        intisari: "",
        tanggal: new Date().toISOString().split("T")[0],
        halamanAwal: "",
        halamanAkhir: "",
        status: false,
      });
      handle();
    } catch (error: any) {
      setErrorMessage(
        error.message || "Terjadi kesalahan. Silakan coba lagi nanti."
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
      <div className="w-11/12 md:w-3/4 lg:w-1/2 relative flex flex-col items-center gap-4 p-8 bg-white-custom border-black-custom rounded-lg border-2 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handle}
          className="absolute top-6 p-2 right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h1 className="text-3xl font-extrabold font-source-serif sm:text-3xl text-light-primary">
          Ajukan Form Bukti Bacaan
        </h1>

        {errorMessage && (
          <div className="w-full p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col md:flex-row gap-6">
            <div className="flex w-full md:w-1/2 flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bukuISBN"
                  className="font-source-serif text-lg font-bold"
                >
                  Buku
                </label>
                <div className="relative">
                  <select
                    id="bukuISBN"
                    name="bukuISBN"
                    value={formData.bukuISBN}
                    onChange={handleChange}
                    className="py-3 px-6 w-full border text-xs border-black rounded-md font-source-sans appearance-none"
                    required
                  >
                    <option value="" className="text-xs">
                      Pilih Buku
                    </option>
                    {bukuList.map((buku: { isbn: string; judul: string }) => (
                      <option key={buku.isbn} value={buku.isbn}>
                        {buku.judul}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ▼
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="tanggal"
                  className="font-source-serif text-lg font-bold"
                >
                  Tanggal Baca
                </label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="py-3 px-6 text-xs w-full border border-black rounded-md font-source-sans"
                  required
                />
              </div>
            </div>

            <div className="flex w-full md:w-1/2 flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="halamanAwal"
                  className="font-source-serif text-lg font-bold"
                >
                  Halaman Awal
                </label>
                <input
                  type="number"
                  min="1"
                  id="halamanAwal"
                  name="halamanAwal"
                  value={formData.halamanAwal}
                  onChange={handleChange}
                  placeholder="Masukkan halaman awal"
                  className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="halamanAkhir"
                  className="font-source-serif text-lg font-bold"
                >
                  Halaman Akhir
                </label>
                <input
                  type="number"
                  min="1"
                  id="halamanAkhir"
                  name="halamanAkhir"
                  value={formData.halamanAkhir}
                  onChange={handleChange}
                  placeholder="Masukkan halaman akhir"
                  className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="intisari"
              className="font-source-serif text-lg font-bold"
            >
              Intisari
            </label>
            <textarea
              id="intisari"
              name="intisari"
              value={formData.intisari}
              onChange={handleChange}
              placeholder="Tuliskan intisari dari bacaan"
              className="py-3 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs min-h-[100px]"
              required
            />
          </div>

          <p className="text-gray-text italic text-sm">
            *Form bukti akan diverifikasi oleh guru
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-dark-primary text-white-custom font-source-sans text-sm py-2 w-full rounded-lg border-2 border-black transition-all duration-300 ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-md hover:bg-opacity-90"
            }`}
          >
            {isSubmitting ? "Mengirim..." : "Ajukan Form Bukti"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalFormBukti;
