import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type GroupMode = "weekly" | "monthly";

interface DataPeminjaman {
  date: string;
  lendingCount: number;
}

const PeminjamanLineChart: React.FC = () => {
  const [groupMode, setGroupMode] = useState<GroupMode>("weekly");
  const [data, setData] = useState<DataPeminjaman[]>([]);

  useEffect(() => {
    const generateData = () => {
      const currentDate = new Date();
      const generatedData: DataPeminjaman[] = [];

      if (groupMode === "weekly") {
        // 7 hari terakhir
        for (let i = 6; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - i);
          generatedData.push({
            date: date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            }),
            lendingCount: Math.floor(Math.random() * 50),
          });
        }
      } else {
        // 4 minggu dalam sebulan
        for (let i = 0; i < 4; i++) {
          generatedData.push({
            date: `Minggu ${i + 1}`,
            lendingCount: Math.floor(Math.random() * 200),
          });
        }
      }

      setData(generatedData);
    };

    generateData();
  }, [groupMode]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-source-sans text-2xl text-primary font-bold">
          Statistik Peminjaman Buku
        </h2>
        <div className="space-x-2">
          {(["weekly", "monthly"] as GroupMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setGroupMode(mode)}
              className={`px-4 py-1 rounded-md text-sm ${
                groupMode === mode
                  ? "bg-primary border-black-custom border-2 text-white"
                  : "bg-white-custom text-light-primary border-2 border-light-primary hover:shadow-sm hover:transition-all hover:duration-300"
              }`}
            >
              {mode === "weekly" ? "Mingguan" : "Bulanan"}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "2px solid #145A32",
              borderRadius: "8px",
            }}
            labelStyle={{ fontWeight: "bold", color: "#000" }}
          />
          <Legend />
          <Line
            type="bump"
            dataKey="lendingCount"
            stroke="#002C13"
            strokeWidth={4}
            activeDot={{ r: 12 }}
            name="Jumlah Peminjaman"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default PeminjamanLineChart;
