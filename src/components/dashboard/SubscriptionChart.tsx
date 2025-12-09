import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const dailyData = [
  { name: "Mon", basic: 12, pro: 8, premium: 3 },
  { name: "Tue", basic: 15, pro: 10, premium: 5 },
  { name: "Wed", basic: 18, pro: 12, premium: 4 },
  { name: "Thu", basic: 14, pro: 9, premium: 6 },
  { name: "Fri", basic: 20, pro: 15, premium: 8 },
  { name: "Sat", basic: 10, pro: 6, premium: 2 },
  { name: "Sun", basic: 8, pro: 4, premium: 1 },
];

const monthlyData = [
  { name: "Jan", basic: 120, pro: 80, premium: 30 },
  { name: "Feb", basic: 150, pro: 100, premium: 45 },
  { name: "Mar", basic: 180, pro: 120, premium: 55 },
  { name: "Apr", basic: 140, pro: 90, premium: 40 },
  { name: "May", basic: 200, pro: 150, premium: 70 },
  { name: "Jun", basic: 220, pro: 170, premium: 85 },
];

const yearlyData = [
  { name: "2020", basic: 800, pro: 400, premium: 150 },
  { name: "2021", basic: 1200, pro: 700, premium: 280 },
  { name: "2022", basic: 1800, pro: 1100, premium: 450 },
  { name: "2023", basic: 2400, pro: 1600, premium: 720 },
  { name: "2024", basic: 3200, pro: 2200, premium: 1100 },
];

type TimeRange = "daily" | "monthly" | "yearly";

export function SubscriptionChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");

  const getData = () => {
    switch (timeRange) {
      case "daily":
        return dailyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["daily", "monthly", "yearly"] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              timeRange === range
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald" />
          <span className="text-muted-foreground">Basic ₹199</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber" />
          <span className="text-muted-foreground">Pro ₹499</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose" />
          <span className="text-muted-foreground">Premium ₹999</span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getData()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
            <XAxis 
              dataKey="name" 
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
              dataKey="basic" 
              name="Basic ₹199"
              fill="hsl(160, 84%, 39%)" 
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
            <Bar 
              dataKey="pro" 
              name="Pro ₹499"
              fill="hsl(38, 92%, 50%)" 
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationBegin={200}
            />
            <Bar 
              dataKey="premium" 
              name="Premium ₹999"
              fill="hsl(350, 89%, 60%)" 
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationBegin={400}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
