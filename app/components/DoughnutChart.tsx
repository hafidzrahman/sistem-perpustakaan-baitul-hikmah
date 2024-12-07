import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

const BookCategoryDonutChart = () => {
  // Data kategori buku
  const bookData = [
    {
      name: "Fiksi",
      value: 45,
      color: "#064359",
      stroke: "#a0ced9",
    },
    {
      name: "Non-Fiksi",
      value: 35,
      color: "#6D275D",
      stroke: "#a594f9",
    },
    {
      name: "Sains",
      value: 20,
      color: "#055A39",
      stroke: "#adf7b6",
    },
    {
      name: "Sejarah",
      value: 25,
      color: "#C50043",
      stroke: "#ffc09f",
    },
    {
      name: "Teknologi",
      value: 15,
      color: "#F3A51A",
      stroke: "#ffee93",
    },
  ];

  // Kustom Tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 border-primary border-2 rounded-md">
          <p className="font-bold" style={{ color: data.payload.color }}>
            {data.name}
          </p>
          <p className="text-black-custom">Jumlah: {data.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="85%">
      <PieChart>
        <Pie
          data={bookData}
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="80%"
          paddingAngle={4} // Jarak antar segmen
          cornerRadius={4} // Lengkungan sudut
          dataKey="value"
        >
          {bookData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              stroke={entry.stroke}
              fill={entry.color}
              strokeWidth={2}
            />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />

        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          className="text-sm"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BookCategoryDonutChart;
