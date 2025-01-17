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

interface DataFormBukti {
  date: string;
  formCount: number;
}

const LineChartFormBukti: React.FC = () => {
  const [groupMode, setGroupMode] = useState<GroupMode>("weekly");
  const [data, setData] = useState<DataFormBukti[]>([]);
  const [loading, setLoading] = useState(true);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [r, setR] = useState(2);
  const [marginL, setMarginL] = useState(-20);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setStrokeWidth(5);
        setR(12);
      } else if (width >= 768) {
        setStrokeWidth(4);
        setR(8);
      } else if (width >= 640) {
        setStrokeWidth(3);
        setR(6);
        setMarginL(-24);
      } else {
        setStrokeWidth(2);
        setR(4);
        setMarginL(-40);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/form-bukti");
        const result = await response.json();

        const groupedData: DataFormBukti[] = [];

        if (groupMode === "weekly") {
          // Get last 7 days data
          const today = new Date();
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const formattedDate = date.toISOString().split("T")[0];
            const formCount = result?.filter(
              (item: any) => item.tanggal.split("T")[0] === formattedDate
            ).length;

            groupedData.push({
              date: date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              }),
              formCount,
            });
          }
        } else {
          // Group by weeks in current month
          const today = new Date();
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );
          for (let i = 0; i < 4; i++) {
            const startOfWeek = new Date(startOfMonth);
            startOfWeek.setDate(startOfMonth.getDate() + i * 7);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const formCount = result?.filter((item: any) => {
              const itemDate = new Date(item.tanggal);
              return itemDate >= startOfWeek && itemDate <= endOfWeek;
            }).length;

            groupedData.push({
              date: `Minggu ${i + 1}`,
              formCount,
            });
          }
        }

        setData(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupMode]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between sm:items-center mb-4">
        <h2 className="font-source-sans md:text-2xl text-xl text-primary font-bold">
          Statistik Pengajuan Form Bukti
        </h2>
        <div className="space-x-2">
          {(["weekly", "monthly"] as GroupMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setGroupMode(mode)}
              className={`px-4 py-1 rounded-md sm:text-sm text-xs ${
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full h-[300px] md:h-[400px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: marginL,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" className="text-[12px] lg:text-sm" />
              <YAxis className="text-[12px] lg:text-sm" />
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
                type="monotone"
                dataKey="formCount"
                stroke="#002C13"
                strokeWidth={strokeWidth}
                activeDot={{ r: r }}
                name="Pengajuan"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default LineChartFormBukti;
