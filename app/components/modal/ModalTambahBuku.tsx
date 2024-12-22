import { useEffect, useState } from "react";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { Genre } from "@/lib";

interface ModalTambahBukuProps {
  status: boolean;
  handle: () => void;
}

const bg = [
  "bg-jewel-purple",
  "bg-jewel-red",
  "bg-jewel-green",
  "bg-jewel-yellow",
  "bg-jewel-blue",
];
const border = [
  "border-pastel-purple",
  "border-pastel-red",
  "border-pastel-green",
  "border-pastel-yellow",
  "border-pastel-blue",
];

const ModalTambahBuku = ({ status, handle }: ModalTambahBukuProps) => {
  const [isbn, setISBN] = useState("");
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [halaman, setHalaman] = useState("");
  const [linkGambar, setLinkGambar] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const fetchBookByISBN = async (isbn: string) => {
    try {
      const response = await fetch(`/api/buku/${isbn}`);
      const data = await response.json();

      if (response.ok && data) {
        setJudul(data.judul);
        setPenulis(
          data.penulis.map((p: { nama: string }) => p.nama).join(", ")
        );
        setPenerbit(data.penerbitDetails.nama);
        setHalaman(data.halaman.toString());
        setSinopsis(data.sinopsis);
        setLinkGambar(data.linkGambar);
        setSelectedGenres(data.genre.map((g: { nama: string }) => g.nama));
      }
    } catch (error) {
      console.log("Error fetching book data:", error);
    }
  };

  useEffect(() => {
    if (isbn.length >= 13) {
      fetchBookByISBN(isbn);
    }
  }, [isbn]);

  const shelfPositions = [
    ["A1", "A2", "", "", ""],
    ["", "", "", "", ""],
    ["C1", "C2", "", "C4", "C5"],
    ["", "", "", "", ""],
    ["E1", "E2", "E3", "E4", "E5"],
  ];

  const handleGenreSelect = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres((prev) => [...prev, genre]);
    }
  };

  const handleGenreRemove = (genre: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/buku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isbn,
          judul,
          penulis: penulis.split(","),
          penerbit,
          halaman,
          genre: selectedGenres,
          linkGambar,
          sinopsis,
          posisi: selectedPosition,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setISBN("");
        setJudul("");
        setPenulis("");
        setPenerbit("");
        setLinkGambar("");
        setSinopsis("");
        setHalaman("");
        setSelectedGenres([]);
        setSelectedPosition(null);
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
      <div className="w-11/12 md:w-4/5 max-h-[90vh] overflow-y-auto relative flex flex-col items-center gap-4 p-4 md:p-8 bg-white-custom border-black-custom rounded-lg border-2">
        <button
          onClick={handle}
          className="absolute top-4 md:top-6 p-2 right-4 md:right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h1 className="text-2xl md:text-3xl font-extrabold font-source-serif text-light-primary">
          Tambah Buku
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-4 justify-center items-stretch"
        >
          <div className="w-full flex flex-col lg:flex-row gap-6">
            {/* Form Fields Container */}
            <div className="flex flex-col md:flex-row lg:w-2/3 gap-6">
              {/* First Column */}
              <div className="flex w-full md:w-1/2 flex-col gap-4 items-stretch">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="isbn"
                    className="font-source-serif text-lg font-bold"
                  >
                    ISBN
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="isbn"
                    value={isbn}
                    onChange={(e) => setISBN(e.target.value)}
                    placeholder="Masukkan ISBN buku"
                    className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="penulis"
                    className="font-source-serif text-lg font-bold"
                  >
                    Penulis
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="penulis"
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                    placeholder="Masukkan nama penulis buku"
                    className="py-2 px-6 w-full border border-black rounded-md placeholder:text-xs placeholder:font-source-sans font-source-sans"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="halaman"
                    className="font-source-serif text-lg font-bold"
                  >
                    Halaman
                  </label>
                  <input
                    autoComplete="off"
                    type="number"
                    id="halaman"
                    value={halaman}
                    onChange={(e) => setHalaman(e.target.value)}
                    placeholder="Masukkan nama halaman buku"
                    className="py-2 px-6 w-full border border-black rounded-md placeholder:text-xs placeholder:font-source-sans font-source-sans"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="genre"
                    className="font-source-serif text-lg font-bold"
                  >
                    Genre
                  </label>
                  <div className="relative">
                    <select
                      id="genre"
                      onChange={(e) => handleGenreSelect(e.target.value)}
                      className="py-3 px-6 w-full border border-black rounded-md text-xs font-source-sans appearance-none"
                      value=""
                    >
                      <option value="" disabled>
                        Pilih genre
                      </option>
                      {Object.values(Genre).map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ▼
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedGenres.map((genre, genreIndex) => (
                      <div
                        key={genre}
                        className={`${bg[genreIndex % bg.length]} ${
                          border[genreIndex % border.length]
                        } flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans leading-none rounded-full py-1.5 px-3`}
                      >
                        <span className="text-[10px] font-normal">{genre}</span>
                        <button
                          type="button"
                          onClick={() => handleGenreRemove(genre)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Second Column */}
              <div className="flex w-full md:w-1/2 flex-col gap-4 items-stretch">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="judul"
                    className="font-source-serif text-lg font-bold"
                  >
                    Judul
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="judul"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Masukkan judul buku"
                    className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="penerbit"
                    className="font-source-serif text-lg font-bold"
                  >
                    Penerbit
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="penerbit"
                    value={penerbit}
                    onChange={(e) => setPenerbit(e.target.value)}
                    placeholder="Masukkan penerbit buku"
                    className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="link"
                    className="font-source-serif text-lg font-bold"
                  >
                    Link Gambar
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="link"
                    value={linkGambar}
                    onChange={(e) => setLinkGambar(e.target.value)}
                    placeholder="Masukkan link gambar buku dari internet"
                    className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="sinopsis"
                    className="font-source-serif text-lg font-bold"
                  >
                    Sinopsis
                  </label>
                  <textarea
                    id="sinopsis"
                    value={sinopsis}
                    onChange={(e) => setSinopsis(e.target.value)}
                    placeholder="Masukkan sinopsis buku"
                    className="py-3 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  />
                </div>
              </div>
            </div>

            {/* Third Column (Book Position) - Full width on mobile/tablet, 1/3 on desktop */}
            <div className="flex w-full lg:w-1/3 flex-col gap-1 items-stretch justify-start">
              <label className="font-source-serif text-lg font-bold">
                Posisi Buku
              </label>
              <div className="relative border-2 border-black p-4 rounded-lg">
                <div className="absolute top-8 -left-2 w-2 h-10 bg-white z-10"></div>
                <div className="grid grid-rows-5 gap-2">
                  {shelfPositions.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-5 gap-1">
                      {row.map((position, colIndex) => (
                        <div key={`${rowIndex}-${colIndex}`}>
                          {position && (
                            <button
                              type="button"
                              onClick={() => setSelectedPosition(position)}
                              className={`text-xs p-4 font-normal rounded-md border-2 w-full
                                ${
                                  selectedPosition === position
                                    ? "bg-primary text-white border-light-primary"
                                    : "bg-dark-gray text-white border-gray-texty hover:bg-gray-300"
                                }
                                font-bold transition-all duration-200 ease-in-out
                              `}
                            >
                              {position}
                            </button>
                          )}
                          {!position && (
                            <div className="w-full aspect-square"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-text italic text-sm mt-4">
            *Data tetap akan bisa diubah di lain waktu
          </p>
          <button
            type="submit"
            className="bg-dark-primary text-white-custom font-source-sans text-sm py-2 w-full rounded-lg border-2 border-black hover:shadow-md transition-all duration-300"
          >
            Tambahkan Buku
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahBuku;
