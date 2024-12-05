import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

// Definisi tipe data untuk buku
interface BookData {
  kategori: string;
  jumlahBuku: number;
  totalHalaman: number;
}

const BookChart = () => {
  // Data contoh tentang buku
  const bookData: BookData[] = [
    {
      kategori: "Fiksi",
      jumlahBuku: 45,
      totalHalaman: 12750,
    },
    {
      kategori: "Non-Fiksi",
      jumlahBuku: 35,
      totalHalaman: 9800,
    },
    {
      kategori: "Sains",
      jumlahBuku: 20,
      totalHalaman: 6500,
    },
    {
      kategori: "Sejarah",
      jumlahBuku: 25,
      totalHalaman: 8750,
    },
    {
      kategori: "Teknologi",
      jumlahBuku: 15,
      totalHalaman: 4500,
    },
  ];

  // Kustom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-bold text-gray-700">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`tooltip-${index}`}
              style={{ color: entry.color }}
              className="text-sm"
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart
        data={bookData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="text-gray-200" />

        <XAxis dataKey="kategori" className="text-sm text-gray-600" />

        <YAxis
          label={{
            value: "Jumlah",
            angle: -90,
            position: "insideLeft",
          }}
          className="text-sm text-gray-600"
        />

        <Tooltip content={CustomTooltip} cursor={{ fill: "rgba(0,0,0,0.1)" }} />

        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          className="text-sm"
        />

        {/* Bar untuk jumlah buku dengan warna dinamis */}
        <Bar dataKey="jumlahBuku" name="Jumlah Buku" barSize={30} />
        <Bar
          dataKey="totalHalaman"
          name="Total Halaman"
          barSize={30}
          fill="#055A39"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BookChart;
