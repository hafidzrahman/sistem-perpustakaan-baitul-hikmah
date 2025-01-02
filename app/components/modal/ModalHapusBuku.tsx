// components/modal/ModalHapusBuku.tsx
import React from "react";
import { CancelCircleHalfDotIcon } from "hugeicons-react";

interface ModalHapusBukuProps {
  status: boolean;
  handle: () => void;
  isbn: string;
  judul: string;
  onConfirm: () => void;
}

const ModalHapusBuku = ({
  status,
  handle,
  isbn,
  judul,
  onConfirm,
}: ModalHapusBukuProps) => {
  return (
    <div
      className={`fixed bg-black bg-opacity-50 inset-0 z-50 flex items-center justify-center ${
        status ? "block" : "hidden"
      }`}
    >
      <div className="w-11/12 md:w-1/2 relative flex flex-col items-center gap-4 p-4 md:p-8 bg-white-custom border-black-custom rounded-lg border-2">
        <button
          onClick={handle}
          className="absolute top-4 md:top-6 p-2 right-4 md:right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h1 className="text-2xl md:text-3xl font-extrabold font-source-serif text-light-primary">
          Hapus Buku
        </h1>

        <div className="text-center">
          <p className="mb-4">Apakah Anda yakin ingin menghapus buku:</p>
          <p className="font-bold mb-2">{judul}</p>
          <p className="text-sm text-gray-600 mb-6">ISBN: {isbn}</p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handle}
              className="px-6 py-2 border-2 border-black rounded-lg hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-500 text-white border-2 border-red-600 rounded-lg hover:bg-red-600"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalHapusBuku;
