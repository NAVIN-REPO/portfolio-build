import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  color: "primary" | "emerald" | "amber" | "rose" | "violet";
  delay?: number;
}

const colorClasses = {
  primary: "from-primary/20 to-primary/5 border-primary/20",
  emerald: "from-emerald/20 to-emerald/5 border-emerald/20",
  amber: "from-amber/20 to-amber/5 border-amber/20",
  rose: "from-rose/20 to-rose/5 border-rose/20",
  violet: "from-violet/20 to-violet/5 border-violet/20",
};

const iconColorClasses = {
  primary: "text-primary bg-primary/10",
  emerald: "text-emerald bg-emerald/10",
  amber: "text-amber bg-amber/10",
  rose: "text-rose bg-rose/10",
  violet: "text-violet bg-violet/10",
};

export function StatCard({ title, value, icon: Icon, trend, color, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all duration-500",
        colorClasses[color],
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {displayValue.toLocaleString()}
          </p>
          {trend !== undefined && (
            <p className={cn(
              "mt-1 text-sm font-medium",
              trend >= 0 ? "text-emerald" : "text-rose"
            )}>
              {trend >= 0 ? "+" : ""}{trend}% from last month
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-3", iconColorClasses[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Decorative gradient orb */}
      <div className={cn(
        "absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl",
        color === "primary" && "bg-primary",
        color === "emerald" && "bg-emerald",
        color === "amber" && "bg-amber",
        color === "rose" && "bg-rose",
        color === "violet" && "bg-violet"
      )} />
    </div>
  );
}
