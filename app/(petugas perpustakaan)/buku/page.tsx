"use client";

import BtnSecondary from "@/app/components/BtnSecondary";
import CardBuku from "@/app/components/CardBuku";
import { useEffect, useState, useRef } from "react";
import { AddCircleHalfDotIcon } from "hugeicons-react";
import TableBuku from "@/app/components/TableBuku";
import CardTambahBuku from "@/app/components/CardTambahBuku";
import BookChart from "@/app/components/BookChart";

interface BukuPageProps {}

const BukuPage = ({}: BukuPageProps) => {
  const [tambahBuku, setTambahBuku] = useState(false);
  const [buku, setBuku] = useState([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null); // Referensi ke elemen scrollable
  const [isDragging, setIsDragging] = useState(false); // Melacak status drag
  const [startX, setStartX] = useState(0); // Posisi awal mouse saat drag
  const [scrollLeft, setScrollLeft] = useState(0); // Posisi scroll container saat drag dimulai

  // Event handler saat mouse ditekan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true); // Mengaktifkan drag
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft); // Menyimpan posisi awal mouse
    setScrollLeft(scrollContainerRef.current.scrollLeft); // Menyimpan posisi awal scroll
  };

  // Event handler saat mouse bergerak
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft; // Posisi mouse saat ini
    const walk = x - startX; // Perbedaan posisi awal dan saat ini
    // Gunakan requestAnimationFrame untuk memperbaiki performa
    requestAnimationFrame(() => {
      scrollContainerRef.current!.scrollLeft = scrollLeft - walk; // Update posisi scroll container
    });
  };

  // Event handler saat mouse dilepas
  const handleMouseUp = () => {
    setIsDragging(false); // Menonaktifkan drag
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUpGlobal);

    return () => window.removeEventListener("mouseup", handleMouseUpGlobal);
  }, []);

  const handleTambahBuku = () => {
    setTambahBuku(!tambahBuku);
  };

  useEffect(() => {
    const fetchBuku = async () => {
      const response = await fetch("/api/buku");
      const data = await response.json();
      console.log(data);
      setBuku(data);
    };
    fetchBuku();
  }, [tambahBuku]);

  console.log(buku);

  return (
    <>
      <CardTambahBuku status={tambahBuku} handle={handleTambahBuku} />
      <div className="mb-4">
        <h2 className="font-semibold text-gray-text font-source-sans">
          Disini Anda, bisa melihat daftar buku, menambahkan, menghapus, dan
          mengedit data buku.
        </h2>
      </div>
      <h1 className="font-source-sans text-2xl text-primary font-bold">
        Baru ditambahkan
      </h1>
      <div
        ref={scrollContainerRef}
        className="flex gap-8 mb-4 border-b-2 border-dark-gray overflow-x-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          overflowX: "auto",
        }}
      >
        {buku.length ? (
          buku.map(
            (
              item: { judul: string; penulisBuku: {penulis : {nama : string}}[]; linkGambar: string },
              index
            ) => (
              <CardBuku
                key={index}
                judul={item.judul}
                penulis={item.penulisBuku.map(d => d.penulis.nama).join(", ")}
                link={item.linkGambar}
              />
            )
          )
        ) : (
          <div>Bentar</div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="flex flex-col gap-4 order-last col-span-1 row-span-2 p-6 bg-white  rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 dark-gray">
          <div className="w-full flex px-2 justify-between items-center">
            <h1 className="font-source-sans text-2xl text-primary font-bold">
              Daftar Buku
            </h1>
            <BtnSecondary
              label="Tambah Buku"
              onClick={handleTambahBuku}
              icon={AddCircleHalfDotIcon}
            />
          </div>
          <div className="rounded-lg overflow-hidden border-black-custom border">
            <TableBuku data={buku} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BukuPage;
