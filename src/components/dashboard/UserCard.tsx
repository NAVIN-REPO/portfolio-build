import { cn } from "@/lib/utils";
import { User } from "@/data/users";

interface UserCardProps {
  user: User;
  index: number;
  onClick?: () => void;
}

export function UserCard({ user, index, onClick }: UserCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-300 hover:border-primary/50 hover:bg-card",
        onClick && "cursor-pointer",
        "opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-border transition-all group-hover:ring-primary/50"
        />
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
            user.status === "online" ? "bg-emerald" : "bg-muted-foreground"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">{user.name}</h4>
        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            user.plan === "basic" && "bg-emerald/10 text-emerald",
            user.plan === "pro" && "bg-amber/10 text-amber",
            user.plan === "premium" && "bg-rose/10 text-rose"
          )}
        >
          {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
        </span>
      </div>
    </div>
  );
}
