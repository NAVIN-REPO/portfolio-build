import { ExternalLink, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Portfolio Home", url: "/", clicks: 1234, trend: 12 },
  { name: "About Page", url: "/about", clicks: 856, trend: 8 },
  { name: "Projects Gallery", url: "/projects", clicks: 2341, trend: 24 },
  { name: "Contact Form", url: "/contact", clicks: 432, trend: -3 },
  { name: "Blog Section", url: "/blog", clicks: 1567, trend: 15 },
];

export function ActiveLinks() {
  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div
          key={link.name}
          className={cn(
            "flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4 transition-all hover:bg-secondary/50",
            "opacity-0 animate-fade-in"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ExternalLink className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{link.name}</p>
              <p className="text-sm text-muted-foreground">{link.url}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-semibold text-foreground">{link.clicks.toLocaleString()}</p>
            <p
              className={cn(
                "flex items-center justify-end gap-1 text-sm font-medium",
                link.trend >= 0 ? "text-emerald" : "text-rose"
              )}
            >
              <TrendingUp className={cn("h-3 w-3", link.trend < 0 && "rotate-180")} />
              {Math.abs(link.trend)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
