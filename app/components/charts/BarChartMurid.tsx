import React, { useState, useEffect } from "react";
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

interface KelasData {
  id: number;
  nama: string;
  tingkat: number;
  JKMurid: "LAKI" | "PEREMPUAN";
  _count: {
    RiwayatKelas: number;
  };
}

interface ChartData {
  name: string;
  LAKI?: number;
  PEREMPUAN?: number;
}

const BarChartMurid: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chartConfig, setChartConfig] = useState({
    barSize: 20,
    fontSize: 14,
    marginLeft: 10,
    chartHeight: 400,
    xAxisAngle: 0,
    bottomMargin: 60,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/kelas");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: KelasData[] = await response.json();

        // Transform the data to group by class and gender
        const transformedData: { [key: string]: ChartData } = {};

        data.forEach((kelas) => {
          const name = `${kelas.tingkat} ${kelas.nama}`;
          if (!transformedData[name]) {
            transformedData[name] = { name };
          }
          transformedData[name][kelas.JKMurid] = kelas._count.RiwayatKelas;
        });

        setChartData(Object.values(transformedData));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setChartConfig({
          barSize: 20,
          fontSize: 14,
          marginLeft: 10,
          chartHeight: 400,
          xAxisAngle: 0,
          bottomMargin: 60,
        });
      } else if (width >= 768) {
        setChartConfig({
          barSize: 16,
          fontSize: 12,
          marginLeft: 0,
          chartHeight: 350,
          xAxisAngle: -15,
          bottomMargin: 50,
        });
      } else if (width >= 640) {
        setChartConfig({
          barSize: 14,
          fontSize: 11,
          marginLeft: -10,
          chartHeight: 300,
          xAxisAngle: -30,
          bottomMargin: 45,
        });
      } else {
        setChartConfig({
          barSize: 12,
          fontSize: 10,
          marginLeft: -20,
          chartHeight: 280,
          xAxisAngle: -45,
          bottomMargin: 40,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border-2 border-primary rounded-lg">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === "Ikhwan" ? "Ikhwan: " : "Akhwat: "}
              {entry.value} murid
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center h-64">Error: {error}</div>;
  }

  return (
    <div className="w-full flex flex-col">
      <ResponsiveContainer width="100%" height={chartConfig.chartHeight}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: chartConfig.marginLeft,
            bottom: chartConfig.bottomMargin,
          }}
        >
          <Legend />
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e0e0e0"
          />
          <XAxis
            dataKey="name"
            axisLine={true}
            tickLine={true}
            fontSize={chartConfig.fontSize}
            fontWeight="bold"
            interval={0}
            angle={chartConfig.xAxisAngle}
            textAnchor={chartConfig.xAxisAngle !== 0 ? "end" : "middle"}
            height={50}
            tickMargin={chartConfig.xAxisAngle !== 0 ? 15 : 8}
          />
          <YAxis
            axisLine={true}
            tickLine={true}
            fontSize={chartConfig.fontSize}
            fontWeight="bold"
            tickMargin={8}
            domain={[0, "dataMax + 2"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="LAKI"
            name="Ikhwan"
            fill="#064359"
            stroke="#a0ced9"
            strokeWidth={1}
            barSize={chartConfig.barSize}
            radius={[4, 4, 0, 0]}
            className="transition-all duration-300 hover:opacity-80"
          />
          <Bar
            dataKey="PEREMPUAN"
            name="Akhwat"
            fill="#C50043"
            stroke="#ffc09f"
            strokeWidth={1}
            barSize={chartConfig.barSize}
            radius={[4, 4, 0, 0]}
            className="transition-all duration-300 hover:opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartMurid;
