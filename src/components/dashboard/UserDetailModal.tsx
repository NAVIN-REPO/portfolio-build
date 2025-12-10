import { User } from "@/data/users";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Mail, Calendar, CreditCard } from "lucide-react";

interface UserDetailModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({ user, open, onOpenChange }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">User Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20"
            />
            <span
              className={cn(
                "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-card",
                user.status === "online" ? "bg-emerald" : "bg-muted-foreground"
              )}
            />
          </div>

          {/* Name & Status */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
            <span
              className={cn(
                "text-sm font-medium",
                user.status === "online" ? "text-emerald" : "text-muted-foreground"
              )}
            >
              {user.status === "online" ? "Online" : "Offline"}
            </span>
          </div>

          {/* Plan Badge */}
          <span
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold",
              user.plan === "basic" && "bg-emerald/20 text-emerald",
              user.plan === "pro" && "bg-amber/20 text-amber",
              user.plan === "premium" && "bg-rose/20 text-rose"
            )}
          >
            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/10">
              <Calendar className="h-4 w-4 text-emerald" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(user.joinedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/10">
              <CreditCard className="h-4 w-4 text-amber" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subscription</p>
              <p className="text-sm font-medium text-foreground">
                ₹{user.plan === "basic" ? "199" : user.plan === "pro" ? "499" : "999"}/month
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
