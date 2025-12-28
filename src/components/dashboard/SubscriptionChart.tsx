import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { IndianRupee, TrendingUp } from "lucide-react";

const dailyData = [
  { name: "Mon", basic: 0, pro: 0, premium: 0 },
  { name: "Tue", basic: 0, pro: 0, premium: 0 },
  { name: "Wed", basic: 0, pro: 0, premium: 0 },
  { name: "Thu", basic: 0, pro: 0, premium: 0 },
  { name: "Fri", basic: 0, pro: 0, premium: 0 },
  { name: "Sat", basic: 0, pro: 0, premium: 0 },
  { name: "Sun", basic: 0, pro: 0, premium: 0 },
];

const monthlyData = [
  { name: "Apr", basic: 0, pro: 0, premium: 0 },
  { name: "May", basic: 0, pro: 0, premium: 0 },
  { name: "Jun", basic: 0, pro: 0, premium: 0 },
  { name: "Jul", basic: 0, pro: 0, premium: 0 },
  { name: "Aug", basic: 0, pro: 0, premium: 0 },
  { name: "Sep", basic: 0, pro: 0, premium: 0 },
  { name: "Oct", basic: 0, pro: 0, premium: 0 },
  { name: "Nov", basic: 0, pro: 0, premium: 0 },
  { name: "Dec", basic: 0, pro: 0, premium: 0 },
  { name: "Jan", basic: 0, pro: 0, premium: 0 },
  { name: "Feb", basic: 0, pro: 0, premium: 0 },
  { name: "Mar", basic: 0, pro: 0, premium: 0 },
  { name: "Apr", basic: 0, pro: 0, premium: 0 },
];

const yearlyData = [
  { name: "2026", basic: 0, pro: 0, premium: 0 },
  { name: "2027", basic: 0, pro: 0, premium: 0 },
  { name: "2028", basic: 0, pro: 0, premium: 0 },
  { name: "2029", basic: 0, pro: 0, premium: 0 },
  { name: "2030", basic: 0, pro: 0, premium: 0 },
];

const PLAN_PRICES = { basic: 199, pro: 499, premium: 999 };

type TimeRange = "daily" | "monthly" | "yearly";

export function SubscriptionChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

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

  const currentData = getData();

  const { totalRevenue, revenueByPlan } = useMemo(() => {
    const basicTotal = currentData.reduce((sum, d) => sum + d.basic, 0);
    const proTotal = currentData.reduce((sum, d) => sum + d.pro, 0);
    const premiumTotal = currentData.reduce((sum, d) => sum + d.premium, 0);

    return {
      totalRevenue:
        basicTotal * PLAN_PRICES.basic +
        proTotal * PLAN_PRICES.pro +
        premiumTotal * PLAN_PRICES.premium,
      revenueByPlan: {
        basic: basicTotal * PLAN_PRICES.basic,
        pro: proTotal * PLAN_PRICES.pro,
        premium: premiumTotal * PLAN_PRICES.premium,
      },
    };
  }, [currentData]);

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  return (
    <div className="space-y-4">
      {/* Revenue Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-primary/20 to-violet/10 p-3 border border-primary/20">
          <div className="flex items-center gap-2 text-primary mb-1">
            <IndianRupee className="h-4 w-4" />
            <span className="text-xs font-medium">Total Revenue</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="rounded-lg bg-emerald/10 p-3 border border-emerald/20">
          <div className="flex items-center gap-2 text-emerald mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald" />
            <span className="text-xs font-medium">Basic ₹199</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatCurrency(revenueByPlan.basic)}</p>
        </div>
        <div className="rounded-lg bg-amber/10 p-3 border border-amber/20">
          <div className="flex items-center gap-2 text-amber mb-1">
            <div className="h-2 w-2 rounded-full bg-amber" />
            <span className="text-xs font-medium">Pro ₹499</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatCurrency(revenueByPlan.pro)}</p>
        </div>
        <div className="rounded-lg bg-rose/10 p-3 border border-rose/20">
          <div className="flex items-center gap-2 text-rose mb-1">
            <div className="h-2 w-2 rounded-full bg-rose" />
            <span className="text-xs font-medium">Premium ₹999</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatCurrency(revenueByPlan.premium)}</p>
        </div>
      </div>

      {/* Time Range Toggle */}
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

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
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
              formatter={(value: number, name: string) => {
                const planKey = name.toLowerCase().split(" ")[0] as keyof typeof PLAN_PRICES;
                const revenue = value * PLAN_PRICES[planKey];
                return [`${value} subs (₹${revenue.toLocaleString()})`, name];
              }}
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
