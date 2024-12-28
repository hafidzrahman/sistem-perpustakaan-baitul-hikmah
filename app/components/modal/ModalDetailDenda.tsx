import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CancelCircleHalfDotIcon } from "hugeicons-react";

interface DetailDenda {
  isOpen: boolean;
  onClose: () => void;
  formBuktiId: number | null;
}

interface FormBuktiDetail {}

const ModalDetailDenda: React.FC<DetailDenda> = ({
  isOpen,
  onClose,
  formBuktiId,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 md:w-3/4 lg:w-1/2 relative flex flex-col gap-4 p-8 bg-white border-2 border-black rounded-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-red-600 hover:text-red-400"
        >
          <CancelCircleHalfDotIcon width={32} height={32} strokeWidth={4} />
        </button>

        <h2 className="text-2xl font-bold font-source-serif text-light-primary">
          Detail Form Bukti Bacaan
        </h2>

        {loading && <div className="text-center py-8">Loading...</div>}

        {error && (
          <div className="w-full p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {formBukti && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Informasi Siswa</h3>
                  <p className="text-sm">Nama: {formBukti.murid.nama}</p>
                  <p className="text-sm">NIS: {formBukti.murid.nis}</p>
                  <p className="text-sm">Kontak: {formBukti.murid.kontak}</p>
                  <p className="text-sm">Alamat: {formBukti.murid.alamat}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Informasi Buku</h3>
                  <p className="text-sm">Judul: {formBukti.buku.judul}</p>
                  <p className="text-sm">ISBN: {formBukti.buku.isbn}</p>
                  <p className="text-sm">
                    Total Halaman: {formBukti.buku.halaman}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Detail Bacaan</h3>
                  <p className="text-sm">
                    Tanggal:{" "}
                    {format(new Date(formBukti.tanggal), "dd MMMM yyyy")}
                  </p>
                  <p className="text-sm">
                    Halaman: {formBukti.halamanAwal} - {formBukti.halamanAkhir}
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        formBukti.status
                          ? "bg-pastel-green text-jewel-green"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {formBukti.status ? "Terverifikasi" : "Menunggu"}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Intisari</h3>
                  <p className="text-sm text-gray-600">{formBukti.intisari}</p>
                </div>
              </div>
            </div>

            {!formBukti.status && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleAccept}
                  className="bg-dark-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                >
                  Terima Form Bukti
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDetailDenda;
