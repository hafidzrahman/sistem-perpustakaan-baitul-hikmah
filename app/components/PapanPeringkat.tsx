import {
  ArrowUp01Icon,
  Award01Icon,
  Bookmark01Icon,
  BookOpen01Icon,
  StarsIcon,
} from "hugeicons-react";
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  YAxis,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Definisi tipe data untuk entri peringkat
interface StudentRankEntry {
  id: number;
  name: string;
  kelas: string;
  submissionCount: number;
  progress: number;
  trending: "up" | "down" | "stable";
}

// Data dummy peringkat murid
const studentRankings: StudentRankEntry[] = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    kelas: "9 Ibnu Umar",
    submissionCount: 20,
    progress: 100,
    trending: "up",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    kelas: "8 Avicenna",
    submissionCount: 18,
    progress: 90,
    trending: "up",
  },
  {
    id: 3,
    name: "Muhammad Rizki",
    kelas: "7 Al-Fatih",
    submissionCount: 15,
    progress: 75,
    trending: "stable",
  },
  {
    id: 4,
    name: "Aisyah Putri",
    kelas: "9 Syafii",
    submissionCount: 12,
    progress: 60,
    trending: "down",
  },
  {
    id: 5,
    name: "Budi Santoso",
    kelas: "8 Geber",
    submissionCount: 10,
    progress: 50,
    trending: "stable",
  },
];

const PapanPeringkat: React.FC = () => {
  // Urutkan peringkat berdasarkan jumlah submission
  const sortedRankings = useMemo(
    () =>
      [...studentRankings].sort(
        (a, b) => b.submissionCount - a.submissionCount
      ),
    [studentRankings]
  );

  // Warna untuk trending
  const getTrendingIcon = (trending: "up" | "down" | "stable") => {
    switch (trending) {
      case "up":
        return <ArrowUp01Icon className="text-green-500" />;
      case "down":
        return <ArrowUp01Icon className="text-red-500 rotate-180" />;
      default:
        return <StarsIcon className="text-gray-500" />;
    }
  };

  return (
    // <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl mx-auto">
    //   {/* Header */}
    //   <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex items-center justify-between">
    //     <div className="flex items-center space-x-4">
    //       <Award01Icon className="w-10 h-10 text-yellow-300" />
    //       <div>
    //         <h2 className="text-2xl font-bold">Papan Peringkat Bukti Bacaan</h2>
    //         <p className="text-sm opacity-80">
    //           Top 5 Murid dengan Submit Terbanyak
    //         </p>
    //       </div>
    //     </div>
    //     <BookOpen01Icon className="w-8 h-8 opacity-70" />
    //   </div>

    //   {/* Konten Utama */}
    //   <div className="grid md:grid-cols-3 gap-4 p-6">
    //     {/* Horizontal Bar Chart Peringkat */}
    //     <div className="md:col-span-2 h-64">
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        layout="vertical"
        data={sortedRankings}
        margin={{ left: 10, right: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis
          dataKey="name"
          type="category"
          width={80}
          tickLine={false}
          tick={{ fontSize: 10 }}
        />
        <Tooltip
          content={({ payload }) => {
            if (payload && payload.length) {
              const data = payload[0].payload as StudentRankEntry;
              return (
                <div className="bg-white p-2 shadow-lg rounded-lg text-xs">
                  <p className="font-bold">{data.name}</p>
                  <p>Kelas: {data.kelas}</p>
                  <p>Bukti Bacaan: {data.submissionCount}/20</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="submissionCount"
          fill="#3182bd"
          radius={[0, 4, 4, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
    //     </div>

    //     {/* Daftar Peringkat */}
    //     <div className="space-y-2">
    //       {sortedRankings.map((student, index) => (
    //         <div
    //           key={student.id}
    //           className={`
    //             flex items-center p-3 rounded-lg
    //             ${
    //               index === 0
    //                 ? "bg-yellow-100"
    //                 : index === 1
    //                 ? "bg-gray-100"
    //                 : index === 2
    //                 ? "bg-orange-100"
    //                 : "bg-white"
    //             }
    //           `}
    //         >
    //           <div className="mr-4 font-bold text-xl">{index + 1}</div>
    //           <div className="flex-grow">
    //             <p className="font-semibold">{student.name}</p>
    //             <p className="text-sm text-gray-600">{student.kelas}</p>
    //           </div>
    //           <div className="flex items-center space-x-2">
    //             <div className="flex items-center">
    //               <Bookmark01Icon className="mr-1 text-blue-600" size={18} />
    //               <span>{student.submissionCount}/20</span>
    //             </div>
    //             {getTrendingIcon(student.trending)}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
  );
};

export default PapanPeringkat;
