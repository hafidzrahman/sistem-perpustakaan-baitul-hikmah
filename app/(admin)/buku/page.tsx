"use client";

import { useEffect, useState, useRef } from "react";
import { AddCircleHalfDotIcon } from "hugeicons-react";
import BtnSecondary from "@/app/components/BtnSecondary";
import CardBuku from "@/app/components/CardBuku";
import { cariBukuType } from "@/lib";
import ModalTambahBuku from "@/app/components/modal/ModalTambahBuku";
import TableBukuAdmin from "@/app/components/TableBukuAdmin";
import { useSession } from "next-auth/react";
import TableBukuUser from "@/app/components/TableBukuUser";

const BukuPage = () => {
  const [tambahBuku, setTambahBuku] = useState(false);
  const [buku, setBuku] = useState<cariBukuType[]>([]);
  const [recentBooks, setRecentBooks] = useState<cariBukuType[]>([]);
  const { data: session } = useSession();
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [bukuDetails, setBukuDetails] = useState({});

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startX;
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTambahBuku = () => {
    setTambahBuku(!tambahBuku);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUpGlobal);
    return () => window.removeEventListener("mouseup", handleMouseUpGlobal);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch basic book list
        const response = await fetch("/api/buku");
        const bookList = await response.json();
        setBuku(bookList);

        // Fetch detailed info for each book to get tanggalMasuk
        const detailedBooks = await Promise.all(
          bookList.map(async (book: cariBukuType) => {
            const detailResponse = await fetch(`/api/buku/${book!.isbn}`);
            const detailData = await detailResponse.json();
            return {
              ...book,
              eksemplarBuku: detailData.eksemplarBuku,
            };
          })
        );

        // Filter and sort books by most recent tanggalMasuk
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const recentBooksList = detailedBooks
          .filter((book: any) => {
            const mostRecentCopy = book.eksemplarBuku?.reduce(
              (latest: Date, current: any) => {
                const currentDate = new Date(current.tanggalMasuk);
                return latest > currentDate ? latest : currentDate;
              },
              new Date(0)
            );

            return mostRecentCopy > twoWeeksAgo;
          })
          .sort((a: any, b: any) => {
            const aDate = new Date(a.eksemplarBuku[0]?.tanggalMasuk || 0);
            const bDate = new Date(b.eksemplarBuku[0]?.tanggalMasuk || 0);
            return bDate.getTime() - aDate.getTime();
          })
          .slice(0, 10);

        setRecentBooks(recentBooksList);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [tambahBuku]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch peminjaman data
        const peminjamanResponse = await fetch("/api/peminjaman");
        const peminjamanResult = await peminjamanResponse.json();
        setPeminjamanData(peminjamanResult);

        // Fetch book details for each ISBN using buku state
        for (const book of buku) {
          const detailResponse = await fetch(`/api/buku/${book.isbn}`);
          const details = await detailResponse.json();
          setBukuDetails((prev) => ({
            ...prev,
            [book.isbn]: details,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (buku.length > 0) {
      fetchAllData();
    }
  }, [buku]); // Add buku as dependency

  return (
    <>
      <ModalTambahBuku status={tambahBuku} handle={handleTambahBuku} />
      <div className="mb-4">
        <h2 className="font-semibold text-gray-text font-source-sans">
          Disini Anda, bisa melihat daftar buku, menambahkan, menghapus, dan
          mengedit data buku.
        </h2>
      </div>
      <h1 className="font-source-sans text-2xl text-primary font-bold">
        Buku terbaru
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
        {recentBooks.length ? (
          recentBooks.map((item: cariBukuType, index) => (
            <CardBuku data={item} key={index} />
          ))
        ) : (
          <div>Tidak ada buku terbaru</div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="flex flex-col gap-4 order-last col-span-1 row-span-2 p-6 bg-white rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 dark-gray">
          <div className="w-full flex px-2 justify-between items-center">
            <h1 className="font-source-sans text-2xl text-primary font-bold">
              Daftar Buku
            </h1>
            {session?.user?.username === "admin" ? (
              <BtnSecondary
                label="Tambah Buku"
                onClick={handleTambahBuku}
                icon={AddCircleHalfDotIcon}
              />
            ) : (
              ""
            )}
          </div>

          {buku.length > 0 &&
            (session?.user?.username === "admin" ? (
              <TableBukuAdmin data={buku} />
            ) : (
              <TableBukuUser
                data={buku}
                peminjamanData={peminjamanData}
                bukuDetails={bukuDetails}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default BukuPage;
