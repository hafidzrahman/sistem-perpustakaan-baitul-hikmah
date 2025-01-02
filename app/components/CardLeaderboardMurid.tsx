import React from "react";
import dynamic from "next/dynamic";
import { Pie, Label, Cell } from "recharts";

const PieChart = dynamic(
  () => import("recharts").then((recharts) => recharts.PieChart),
  { ssr: false }
);

interface CardLeaderboardMuridProps {
  name: string;
  kelas: string;
  booksRead: number;
  totalBooksToRead: number;
  rank?: number;
  className?: string;
}

const CardLeaderboardMurid = ({
  name,
  kelas,
  booksRead,
  totalBooksToRead,
  rank = 0,
}: CardLeaderboardMuridProps) => {
  const chartData = [
    { name: "Read", value: booksRead },
    { name: "Unread", value: totalBooksToRead - booksRead },
  ];

  // Define color schemes for different ranks
  const getColorScheme = (rank: number) => {
    const schemes = {
      0: {
        border: "border-amber-500",
        bg: "bg-amber-50",
        accent: "text-amber-700",
        chart: ["#F59E0B", "#FDE68A"],
      },
      1: {
        border: "border-gray-400",
        bg: "bg-gray-50",
        accent: "text-gray-700",
        chart: ["#6B7280", "#E5E7EB"],
      },
      2: {
        border: "border-orange-700",
        bg: "bg-orange-50",
        accent: "text-orange-800",
        chart: ["#C2410C", "#FFEDD5"],
      },
    };
    return schemes[rank as keyof typeof schemes] || schemes[1];
  };

  const colorScheme = getColorScheme(rank);
  const percentage = (booksRead / totalBooksToRead) * 100;

  return (
    <div
      className={`relative rounded-lg ${colorScheme.bg} border-2 ${colorScheme.border} p-4 duration-200`}
    >
      <div className="flex items-center gap-4">
        {/* Left side - Info */}
        <div className="flex-grow">
          <div className="space-y-1">
            <p className={`text-xs font-medium ${colorScheme.accent}`}>
              {kelas}
            </p>
            <h2 className="text-sm font-bold tracking-tight">{name}</h2>
            <div className={`text-xs ${colorScheme.accent}`}>
              <span className="font-medium">{booksRead}</span>
              <span className="mx-1">/</span>
              <span>{totalBooksToRead} buku</span>
            </div>
          </div>
        </div>

        {/* Right side - Chart */}
        <div className="flex-shrink-0">
          <PieChart width={48} height={48}>
            <Pie
              data={chartData}
              cx={24}
              cy={24}
              innerRadius={12}
              outerRadius={20}
              cornerRadius={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorScheme.chart[index]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default CardLeaderboardMurid;
