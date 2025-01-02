import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

const DoughnutChartGenreBuku = () => {
  const [bookData, setBookData] = useState<
    { name: string; value: number; color: string; stroke: string }[]
  >([]);

  useEffect(() => {
    async function fetching() {
      try {
        const response = await fetch("/api/genre");
        const data = await response.json();

        // Transform the API data to match the bookData format
        const transformedData = data.map((genre: any, index: number) => ({
          name: genre.nama,
          value: genre._count.buku,
          color: generateColor(index), // Function to generate unique colors
          stroke: generateStroke(index), // Function to generate unique strokes
        }));

        setBookData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetching();
  }, []);

  // Function to generate colors dynamically
  const generateColor = (index: number) => {
    const colors = ["#064359", "#6D275D", "#055A39", "#C50043", "#F3A51A"];
    return colors[index % colors.length];
  };

  // Function to generate stroke colors dynamically
  const generateStroke = (index: number) => {
    const strokes = ["#a0ced9", "#a594f9", "#adf7b6", "#ffc09f", "#ffee93"];
    return strokes[index % strokes.length];
  };

  // Custom Tooltip
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
          paddingAngle={4}
          cornerRadius={4}
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

export default DoughnutChartGenreBuku;
