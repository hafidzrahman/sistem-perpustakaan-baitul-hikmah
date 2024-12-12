import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface CardLeaderboardMuridProps {
  name: string;
  kelas: string;
  booksRead: number;
  totalBooksToRead?: number;
  className?: string;
}

const CardLeaderboardMurid: React.FC<CardLeaderboardMuridProps> = ({
  name,
  kelas,
  booksRead,
  totalBooksToRead = 20,
  className = "",
}) => {
  // Prepare data for pie chart
  const data = [
    { name: "Buku Dibaca", value: booksRead },
    { name: "Sisa Buku", value: Math.max(0, totalBooksToRead - booksRead) },
  ];

  // Colors for the chart
  const COLORS = [
    "rgba(54, 162, 235, 0.8)", // Blue for read books
    "rgba(211, 211, 211, 0.3)", // Light gray for remaining books
  ];

  return (
    <div
      className={`border-jewel-blue flex items-center w-full px-6 py-4 border justify-between bg-pastel-blue rounded-lg ${className}`}
    >
      <div className="flex flex-col">
        <h2 className="font-base text-xs -mb-2">{kelas}</h2>
        <h1 className="font-bold font-source-serif text-base">{name}</h1>
      </div>

      {/* Recharts Doughnut Progress Bar */}
      <div className="relative flex items-center justify-center">
        <PieChart width={56} height={56}>
          <Pie
            data={data}
            cx={24}
            cy={24}
            innerRadius={12}
            outerRadius={48}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={1}
              />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
          {booksRead}/{totalBooksToRead}
        </div>
      </div>
    </div>
  );
};

export default CardLeaderboardMurid;
