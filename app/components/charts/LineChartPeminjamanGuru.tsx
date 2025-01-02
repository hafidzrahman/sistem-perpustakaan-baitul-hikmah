import { peminjamanType } from "@/lib";
import React from "react";
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis } from "recharts";

interface LineChartPeminjamanGuruProps {
  data: peminjamanType[];
  nip?: string;
}

// Define tooltip props type
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: Date;
      jumlah: number;
      weekNumber: number;
    };
  }>;
}

const LineChartPeminjamanGuru = ({
  data,
  nip,
}: LineChartPeminjamanGuruProps) => {
  const processSemesterData = React.useMemo(() => {
    if (!data || !nip) return [];

    // Filter for current student's loans
    const studentLoans = data.filter((loan) => loan.nip === nip);

    // Create weekly data for 6 months (approximately 24 weeks)
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 7, 1); // August 1st
    const weeklyData = new Array(24).fill(null).map((_, index) => {
      const weekDate = new Date(startDate);
      weekDate.setDate(weekDate.getDate() + index * 7);
      return {
        date: weekDate,
        weekNumber: index + 1,
        jumlah: 0,
      };
    });

    // Count loans per week
    studentLoans.forEach((loan) => {
      const loanDate = new Date(loan.tanggalPinjam);
      const diffTime = Math.abs(loanDate.getTime() - startDate.getTime());
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

      if (diffWeeks >= 0 && diffWeeks < 24) {
        weeklyData[diffWeeks].jumlah += 1;
      }
    });

    return weeklyData;
  }, [data, nip]);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0].payload.date);
      const weekNumber = payload[0].payload.weekNumber;
      const monthName = date.toLocaleDateString("id-ID", { month: "long" });
      return (
        <div className="bg-white p-2 border border-primary rounded  text-xs">
          <p className="font-medium">{`${monthName} - Pekan ke ${weekNumber}`}</p>
          <p className="font-medium">{`${payload[0].value} peminjaman`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-36">
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={processSemesterData}>
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="linear"
            dataKey="jumlah"
            stroke="#145A32"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartPeminjamanGuru;
