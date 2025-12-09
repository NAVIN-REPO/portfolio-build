import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const generateData = () => {
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  return hours.map((hour) => ({
    time: hour,
    users: Math.floor(Math.random() * 500) + 100,
  }));
};

export function ActiveUsersChart() {
  const [data, setData] = useState(generateData());
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData());
      setAnimationKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart key={animationKey} data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={1} />
              <stop offset="100%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(215, 20%, 65%)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="hsl(215, 20%, 65%)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 8%)",
              border: "1px solid hsl(217, 33%, 17%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 98%)",
            }}
            cursor={{ fill: "hsl(217, 33%, 17%)", opacity: 0.3 }}
          />
          <Bar 
            dataKey="users" 
            fill="url(#barGradient)" 
            radius={[6, 6, 0, 0]}
            animationDuration={1000}
            animationBegin={0}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
