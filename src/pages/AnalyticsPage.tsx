import { BarChart3 } from "lucide-react";
import { ActiveUsersChart } from "@/components/dashboard/ActiveUsersChart";
import { ActiveLinks } from "@/components/dashboard/ActiveLinks";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen professional-bg relative overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-violet/20 -top-40 right-1/4" />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10">
              <BarChart3 className="h-5 w-5 text-violet" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Real-time insights and metrics
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Active Users</h2>
              <ActiveUsersChart />
            </div>

            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Top Links</h2>
              <ActiveLinks />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
