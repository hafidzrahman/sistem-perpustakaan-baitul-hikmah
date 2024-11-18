"use client";

import BtnSecondary from "@/app/components/BtnSecondary";
import CardBuku from "@/app/components/CardBuku";
import CardKelolaBuku from "@/app/components/CardKelolaBuku";
// import TableBuku from "@/app/components/TableBuku";
import { useEffect, useState } from "react";
import { AddCircleHalfDotIcon } from "hugeicons-react";

interface BukuPageProps {}

const BukuPage = ({}: BukuPageProps) => {
  const [addPopUp, setAddPopUp] = useState(false);
  const [buku, setBuku] = useState([]);

  const handleAddPopUp = () => {
    setAddPopUp(!addPopUp);
  };
  console.log(addPopUp);
  useEffect(() => {
    const fetchBuku = async () => {
      const response = await fetch("/api/buku");
      const data = await response.json();
      console.log(data);
      setBuku(data);
    };
    fetchBuku();
  }, [addPopUp]);

  return (
    <>
      <CardKelolaBuku status={addPopUp} handle={handleAddPopUp} />
      <div className="mb-4">
        <h2 className="font-semibold text-dark-gray font-source-sans">
          Disini Anda, bisa melihat daftar buku, menambahkan, menghapus, dan
          mengedit data buku.
        </h2>
      </div>
      <h1>Baru ditambahkan</h1>
      <div className="flex gap-8 mb-4">
        {buku?.map(
          (
            item: { judul: string; penulis: string[]; linkGambar: string },
            index
          ) => (
            <CardBuku
              key={index}
              judul={item.judul}
              penulis={item.penulis.join()}
              link={item.linkGambar}
            />
          )
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="flex flex-col max-h-[380px] gap-4 order-last col-span-1 row-span-2 p-6 bg-white  rounded-lg border-2 border-border-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 border-gray">
          <div className="w-full flex justify-between items-center">
            <h1 className="font-source-sans text-2xl text-primary font-bold">
              Daftar Buku
            </h1>
            <BtnSecondary
              label="Tambah Buku"
              onClick={handleAddPopUp}
              icon={AddCircleHalfDotIcon}
            />
          </div>
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-light-primary text-white">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Judul</th>
                <th className="px-4 py-2 text-left">Penulis</th>
                <th className="px-4 py-2 text-left">Genre</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">Buku A</td>
                <td className="px-4 py-2">Penulis A</td>
                <td className="px-4 py-2">Fiksi</td>
                <td className="px-4 py-2">Tersedia</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">2</td>
                <td className="px-4 py-2">Buku B</td>
                <td className="px-4 py-2">Penulis B</td>
                <td className="px-4 py-2">Non-Fiksi</td>
                <td className="px-4 py-2">Dipinjam</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">3</td>
                <td className="px-4 py-2">Buku C</td>
                <td className="px-4 py-2">Penulis C</td>
                <td className="px-4 py-2">Fiksi</td>
                <td className="px-4 py-2">Tersedia</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BukuPage;
