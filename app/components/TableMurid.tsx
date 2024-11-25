interface TableMuridProps {}

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

const murid = [
  {
    nama: "Aufa Hajati",
    nisn: "12250110320",
    kelas: "7C",
    jenisKelamin: "Perempuan",
    alamat: "Jl. Paradise",
  },
  {
    nama: "Hafidz Alhadid Rahman",
    nisn: "12250111794",
    kelas: "9A",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Manyar",
  },
  {
    nama: "Muhammad Aditya Rinaldi",
    nisn: "12250111048",
    kelas: "8A",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Pandau",
  },
  {
    nama: "Muhammad Faruq",
    nisn: "12250111791",
    kelas: "7B",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Garuda Sakti",
  },
];

const TableMurid = ({}: TableMuridProps) => {
  return (
    <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-lg">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-light-primary text-white sticky top-0 z-10">
            <th className="px-4 py-2 text-left w-1/12">NISN</th>
            <th className="px-4 py-2 text-left w-3/12">Nama</th>
            <th className="px-4 py-2 text-center w-1/12">Kelas</th>
            <th className="px-4 py-2 text-left w-3/12">Alamat</th>
            <th className="px-4 py-2 text-center w-1/12">Jenis Kelamin</th>
            <th className="px-4 py-2 text-center w-2/12">Aksi</th>
            <th className="px-2 py-2 text-center w-1/12">Detail</th>
          </tr>
        </thead>
        <tbody>
          {murid?.map(
            (
              item: {
                nama: string;
                nisn: string;
                jenisKelamin: string;
                kelas: string;
                alamat: string;
              },
              index: number
            ) => (
              <tr
                key={index}
                className="group hover:bg-dark-gray border-b-2 border-dashed transition-all duration-100 hover:text-white-custom hover:transition-all hover:duration-100"
              >
                <td className="px-4 py-2 font-source-sans font-semibold text-sm">
                  {item.nisn}
                </td>
                <td className="px-4 py-2 font-source-serif font-semibold text-sm">
                  {item.nama}
                </td>
                <td className="px-4 py-2 font-source-sans text-center">
                  <div
                    className={`${
                      item.kelas.includes("7")
                        ? `${bg[0]} ${border[0]}`
                        : item.kelas.includes("8")
                        ? `${bg[2]} ${border[2]}`
                        : `${bg[3]} ${border[3]}`
                    } flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans leading-none text-xs rounded-full py-2 px-3`}
                  >
                    {item.kelas}
                  </div>
                </td>
                <td className="px-4 py-2 ">{item.alamat}</td>
                <td className="px-4 py-2 text-center">
                  <div
                    className={`${
                      item.jenisKelamin == "Perempuan"
                        ? `${bg[1]} ${border[1]}`
                        : `${bg[4]} ${border[4]}`
                    } flex justify-center text-white-custom items-center gap-2 border-2 font-source-sans leading-none text-xs rounded-full py-2 px-3`}
                  >
                    {item.jenisKelamin}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">Aksi</td>
                <td className="px-4 py-2 ">
                  <button
                    type="submit"
                    className="bg-dark-primary text-white-custom font-source-sans py-1 px-2 w-full rounded-lg border-2 border-black text-xs hover:shadow-sm transition-all duration-300 hover:transition-all hover:duration-300"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableMurid;
