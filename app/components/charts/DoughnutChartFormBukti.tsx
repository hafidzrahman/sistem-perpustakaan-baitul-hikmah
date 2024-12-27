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

const DoughnutChartFormBukti = () => {
  const [formData, setFormData] = useState<
    { name: string; value: number; color: string; stroke: string }[]
  >([]);

  // Function to generate colors dynamically
  const generateColor = (index: number) => {
    const colors = ["#C50043", "#064359"];
    return colors[index % colors.length];
  };

  // Function to generate stroke colors dynamically
  const generateStroke = (index: number) => {
    const strokes = ["#ffc09f", "#a0ced9"];
    return strokes[index % strokes.length];
  };

  useEffect(() => {
    async function fetching() {
      try {
        const response = await fetch("/api/form-bukti");
        const data = await response.json();

        // Count forms by status with explicit typing
        const statusCounts: Record<string, number> = data.reduce(
          (acc: Record<string, number>, form: { status: boolean }) => {
            const status = form.status ? "Disetujui" : "Belum Disetujui";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {}
        );

        // Transform the counts into the required format with explicit number typing
        const transformedData = Object.entries(statusCounts).map(
          ([status, count]: [string, number], index: number) => ({
            name: status,
            value: count,
            color: generateColor(index),
            stroke: generateStroke(index),
          })
        );

        setFormData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetching();
  }, []);

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
          data={formData}
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="80%"
          paddingAngle={4}
          cornerRadius={4}
          dataKey="value"
        >
          {formData.map((entry, index) => (
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

export default DoughnutChartFormBukti;
