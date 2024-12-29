import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { CancelCircleHalfDotIcon } from "hugeicons-react";
import { detailSumbanganType, beriSumbanganType, tambahBukuType } from "@/lib";

interface DetailFormBuktiProps {
  isOpen: boolean;
  onClose: () => void;
  sumbanganId: number | null | undefined;
}




const ModalDetailSumbangan: React.FC<DetailFormBuktiProps> = ({
  isOpen,
  onClose,
  sumbanganId,
}) => {
  const [sumbangan, setSumbangan] = useState<detailSumbanganType | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [metodePembayaran, setMetodePembayaran] = useState<string>("buku");
  const [nominalValue, setNominalValue] = useState<string>("");
  const [inputCount, setInputCount] = useState<number>(1);
  const arrayObjekBuku = useRef<any[]>([{
  }]);


  function handleOnTambahBuku() {
    arrayObjekBuku.current.push({})
    arrayObjekBuku.current.push()
      setInputCount(prev => ++prev)
  }

  React.useEffect(() => {
    const fetchSumbangan = async () => {
      if (!sumbanganId) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/sumbangan/${sumbanganId}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil detail form buki");
        }
        const data = await response.json();
        setSumbangan(data);
      } catch (err) {
        setError("Gagal memuat detail form bukti");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && sumbanganId) {
      fetchSumbangan();
    }
  }, [isOpen, sumbanganId]);

  const handleAccept = async () => {
    if (!sumbangan?.id) return;

    if (metodePembayaran === "tunai") {
      arrayObjekBuku.current = []
    }

    try {
      const dataPembayaran : beriSumbanganType = {
        idSumbangan : sumbangan.id,
        nominalTotal : Number(nominalValue),
        buku : arrayObjekBuku.current.map((objekBuku : any) => {
          const dataBuku : tambahBukuType = {
            isbn : objekBuku.isbn,
            judul : objekBuku.judul,
            penulis : objekBuku.penulis,
            penerbit : objekBuku.penerbit,
            halaman : Number(objekBuku.halaman),
            genre : objekBuku.genre,
            linkGambar : objekBuku.linkGambar,
            sinopsis : objekBuku.sinopsis,
            tanggalMasuk : new Date(),
            idSumbangan : sumbangan.id
          }
          return dataBuku
        }
        )
      }
      const response = await fetch(`/api/sumbangan/beri-sumbangan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPembayaran),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      

      // Update local state
      // setSumbangan((prev) => (prev ? { ...prev, tanggalSelesai: new Date(), berlebih : false} : null));

      // Close modal after successful update
      arrayObjekBuku.current = [{

      }];
      setNominalValue("")
      setTimeout(onClose, 1000);
    } catch (err) {
      setError("Gagal mengubah status form bukti");
    }
  };

  if (!isOpen) return null;
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
          Detail Sumbangan
        </h2>

        {loading && <div className="text-center py-8">Loading...</div>}

        {error && (
          <div className="w-full p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {sumbangan && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Informasi {`${sumbangan.murid ? "Murid" : "Guru"}`}</h3>
                  <p className="text-sm">Nama: {sumbangan.murid?.nama}</p>
                  <p className="text-sm">{`${sumbangan.murid ? `NIS` : `NIP`} ${sumbangan.murid?.nis || sumbangan.guru?.nip}`}</p>
                  <p className="text-sm">Kontak: {sumbangan.murid?.kontak || sumbangan.guru?.kontak}</p>
                  <p className="text-sm">Alamat: {sumbangan.murid?.alamat || sumbangan.murid?.alamat}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Informasi Keterangan Sumbangan</h3>
                  <p className="text-sm">Keterangan: {sumbangan.keterangan.keterangan}</p>
                  <p className="text-sm">Jumlah Buku: {sumbangan.keterangan.jumlahBuku}</p>
                  <p className="text-sm">Total Nominal: {sumbangan.keterangan.totalNominal}</p>
                  <p className="text-sm">Nominal per Hari: {sumbangan.keterangan.nominalPerHari}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Riwayat Pembayaran</h3>
                  {sumbangan.pembayaranTunai.map((data, i) => <p key={i}>{`Rp${data.jumlah} - ${data.tanggal}`}</p>)}
                  {sumbangan.pembayaranTunai.length === 0 && "-"}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Riwayat Bantuan Sumbangan</h3>
                  {sumbangan.riwayatBantuan.map((data, i) => <p key={i}>{`Rp${data.jumlah} - ${data.pembayaranTunai.sumbangan?.murid?.nama}`}</p>)}
                  {sumbangan.riwayatBantuan.length === 0 && "-"}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Detail Sumbangan</h3>
                  <p className="text-sm">
                    Tanggal Selesai:{` ${sumbangan.tanggalSelesai?.toString() || "-"}`}
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        sumbangan.tanggalSelesai
                          ? "bg-pastel-green text-jewel-green"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {sumbangan.tanggalSelesai ? "Terverifikasi" : "Menunggu"}
                    </span>
                  </p>
                  
                  {sumbangan.denda && <> 
                    <p>
                      Jenis : Denda
                    </p>
                  <p>
                    Tanggal Dikenakan: 
                    {sumbangan.denda?.tanggal?.toString()}
                  </p>
                  </>
                  }
                </div>

                {!sumbangan.tanggalSelesai && <div>
                  <h3 className="font-semibold text-lg">Pembayaran</h3>
                  <div className="text-sm text-gray-600">
                    <label htmlFor="metode-pembayaran">Metode Pembayaran : </label>
                     <select name="metode-pembayaran" id="metode-pembayaran" defaultValue="buku" onChange={(e) => setMetodePembayaran(e.target.value)}>
                      <option key={1} value="buku">Buku</option>
                      <option key={2} value="tunai">Tunai</option>
                     </select>
                  </div>
                  {metodePembayaran === "tunai" ?
                  <div className="flex flex-col">
                  <label htmlFor="user-input">Nominal :</label>
                  <input className="border-[1px]" type="number" id="user-input" value={nominalValue} onChange={(e) => setNominalValue(e.target.value)} />
                  </div> : <div>
                  {arrayObjekBuku.current.map((item, i) => <div key={i}>  
                    <div className="flex flex-col">
                  <label htmlFor="isbn">ISBN :</label>
                  <input type="text" className="border-[1px]" id="isbn" onChange={(e) => arrayObjekBuku.current[i].isbn = e.target.value} />
                  </div>
                  <div className="flex flex-col">
                  <label htmlFor="judul">Judul :</label>
                  <input type="text" className="border-[1px]" id="judul" onChange={(e) => arrayObjekBuku.current[i].judul = e.target.value}  />
                  </div>
                  <div className="flex flex-col">
                  <label htmlFor="penulis">Penulis :</label>
                  <input type="text" className="border-[1px]" id="penulis" onChange={(e) => arrayObjekBuku.current[i].penulis = e.target.value}  />
                  </div>
                  <div className="flex flex-col">
                  <label htmlFor="penerbit">Penerbit :</label>
                  <input type="text" className="border-[1px]" id="penerbit" onChange={(e) => arrayObjekBuku.current[i].penerbit = e.target.value}  />
                  </div>
                  <div className="flex flex-col">
                  <label htmlFor="halaman">Halaman :</label>
                  <input type="text" className="border-[1px]" id="halaman" onChange={(e) => arrayObjekBuku.current[i].halaman = e.target.value}  />
                  </div>
                  <div className="flex flex-col">
                  <label htmlFor="genre">Genre :</label>
                  <input type="text" className="border-[1px]" id="genre" onChange={(e) => arrayObjekBuku.current[i].genre = e.target.value}  />
                  </div>
                  <div className="flex flex-col">
                  <label htmlFor="linkGambar">Link Gambar :</label>
                  <input type="text" className="border-[1px]" id="linkGambar" onChange={(e) => arrayObjekBuku.current[i].linkGambar = e.target.value}  />
                  </div>
                  <div className="flex flex-col">
                  <label htmlFor="sinopsis">Sinopsis :</label>
                  <input type="text" className="border-[1px]" id="sinopsis" onChange={(e) => arrayObjekBuku.current[i].sinopsis = e.target.value}  />
                  </div>
     </div>)}
     <button onClick={() => handleOnTambahBuku()}>Tambah Buku</button>
                  </div>
                  }
                </div>}
              </div>
            </div>

            {!sumbangan.tanggalSelesai && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleAccept}
                  className="bg-dark-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                >
                  Terima Sumbangan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDetailSumbangan;
