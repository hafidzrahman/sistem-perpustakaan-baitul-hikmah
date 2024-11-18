import { useState } from "react";
import BtnPrimary from "./BtnPrimary";
import { CancelCircleHalfDotIcon } from "hugeicons-react";

interface CardKelolaBukuProps {
  status: boolean;
  handle: () => void;
}

const CardKelolaBuku = ({ status, handle }: CardKelolaBukuProps) => {
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [isbn, setISBN] = useState("");
  const [genre, setGenre] = useState("");
  const [linkGambar, setLinkGambar] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/buku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul,
          penulis: penulis.split(","),
          genre: genre.split(","),
          isbn,
          linkGambar,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setJudul("");
        setPenulis("");
        setGenre("");
        setISBN("");
        setLinkGambar("");
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
            Tambah Buku
          </h1>
          <form
            onSubmit={onSubmit}
            className="w-full flex flex-col gap-4 justify-center items-stretch"
          >
            <div className="flex justify-between items-center">
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="judul"
                    className="font-source-serif text-lg font-bold"
                  >
                    Judul
                  </label>
                  <input
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
                    htmlFor="penulis"
                    className="font-source-serif text-lg font-bold"
                  >
                    Penulis
                  </label>
                  <input
                    type="text"
                    id="penulis"
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                    placeholder="Masukkan nama penulis buku (jika lebih dari satu, pisahkan dengan koma)"
                    className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="genre"
                    className="font-source-serif text-lg font-bold"
                  >
                    Genre
                  </label>
                  <input
                    type="text"
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Masukkan genre buku (jika lebih dari satu, pisahkan dengan koma)"
                    className="py-2 px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="isbn"
                    className="font-source-serif text-lg font-bold"
                  >
                    ISBN
                  </label>
                  <input
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
                    htmlFor="link"
                    className="font-source-serif text-lg font-bold"
                  >
                    Link Gambar
                  </label>
                  <input
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
                    value={linkGambar}
                    onChange={(e) => setLinkGambar(e.target.value)}
                    placeholder="Masukkan link gambar buku dari internet"
                    className="py-2 flex px-6 w-full border border-black rounded-md font-source-sans placeholder:text-xs placeholder:font-source-sans"
                  />
                </div>
              </div>
            </div>
            <p className="text-gray-text italic text-sm">
              *Data tetap akan bisa diubah di lain waktu
            </p>
            <button
              type="submit"
              className={`bg-dark-primary text-white-custom font-source-sans leading-none text-sm font-normal rounded-lg border-2 border-black-custom py-3 w-full px-14`}
            >
              Tambahkan Buku
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CardKelolaBuku;
