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

interface ClassData {
  name: string;
  male: number;
  female: number;
}

const classData: ClassData[] = [
  { name: "7 Al-Fatih", male: 20, female: 18 },
  { name: "7 Ibnu Abbas", male: 17, female: 16 },
  { name: "8 Geber", male: 17, female: 15 },
  { name: "8 Avicenna", male: 20, female: 22 },
  { name: "9 Ibnu Umar", male: 20, female: 19 },
  { name: "9 Syafii", male: 18, female: 17 },
];

const BarChartMurid: React.FC = () => {
  const [chartConfig, setChartConfig] = useState({
    barSize: 20,
    fontSize: 14,
    marginLeft: 10,
    chartHeight: 400,
    xAxisAngle: 0,
    bottomMargin: 60,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        // Desktop
        setChartConfig({
          barSize: 20,
          fontSize: 14,
          marginLeft: 10,
          chartHeight: 400,
          xAxisAngle: 0,
          bottomMargin: 60,
        });
      } else if (width >= 768) {
        // Tablet
        setChartConfig({
          barSize: 16,
          fontSize: 12,
          marginLeft: 0,
          chartHeight: 350,
          xAxisAngle: -15,
          bottomMargin: 50,
        });
      } else if (width >= 640) {
        // Small Tablet
        setChartConfig({
          barSize: 14,
          fontSize: 11,
          marginLeft: -10,
          chartHeight: 300,
          xAxisAngle: -30,
          bottomMargin: 45,
        });
      } else {
        // Mobile
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

  return (
    <div className="w-full flex flex-col">
      <ResponsiveContainer width="100%" height={chartConfig.chartHeight}>
        <BarChart
          data={classData}
          margin={{
            top: 20,
            right: 20,
            left: chartConfig.marginLeft,
            bottom: chartConfig.bottomMargin,
          }}
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
            domain={[0, "dataMax + 4"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "2px solid #145A32",
              fontSize: chartConfig.fontSize,
            }}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              fontSize: chartConfig.fontSize,
              paddingBottom: "8px",
            }}
          />
          <Bar
            dataKey="male"
            fill="#064359"
            stroke="#a0ced9"
            strokeWidth={1}
            name="Ikhwan"
            barSize={chartConfig.barSize}
            radius={[4, 4, 0, 0]}
            className="transition-all duration-300 hover:opacity-80"
          />
          <Bar
            dataKey="female"
            fill="#C50043"
            stroke="#ffc09f"
            strokeWidth={1}
            name="Akhwat"
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
