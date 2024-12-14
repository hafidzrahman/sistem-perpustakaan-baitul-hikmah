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
} from "recharts";

// Tipe data untuk setiap kelas
interface ClassData {
  name: string;
  male: number;
  female: number;
}

// Data contoh untuk 9 kelas
const classData: ClassData[] = [
  { name: "7 Al-Fatih", male: 20, female: 18 },
  { name: "7 Ibnu Abbas", male: 17, female: 16 },
  { name: "8 Geber", male: 17, female: 15 },
  { name: "8 Avicenna", male: 20, female: 22 },
  { name: "9 Ibnu Umar", male: 20, female: 19 },
  { name: "9 Syafii", male: 18, female: 17 },
];

const BarChartMurid: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={classData}
        margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e0e0e0"
        />
        <XAxis
          dataKey="name"
          axisLine={true}
          tickLine={true}
          fontSize={14}
          fontWeight="bold"
          interval={0}
          // angle={-30}
          textAnchor="middle"
        />
        <YAxis
          axisLine={true}
          tickLine={true}
          fontSize={14}
          fontWeight="bold"
          color="#101010"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar
          dataKey="male"
          fill="#064359"
          stroke="#a0ced9"
          strokeWidth={1}
          name="Ikhwan"
          barSize={20}
          radius={[4, 4, 0, 0]}
          className="transition-all duration-300 hover:opacity-80"
        />
        <Bar
          dataKey="female"
          fill="#C50043"
          stroke="#ffc09f"
          strokeWidth={1}
          name="Akhwat"
          barSize={20}
          radius={[4, 4, 0, 0]}
          className="transition-all duration-300 hover:opacity-80"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartMurid;
