import { Users, Activity, Link2, CreditCard, LayoutDashboard } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActiveUsersChart } from "@/components/dashboard/ActiveUsersChart";
import { SubscriptionChart } from "@/components/dashboard/SubscriptionChart";
import { UserCard } from "@/components/dashboard/UserCard";
import { ActiveLinks } from "@/components/dashboard/ActiveLinks";
import { users } from "@/data/users";

const Index = () => {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "online").length;
  const totalSubscriptions = users.length;

  return (
    <div className="min-h-screen professional-bg relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb w-96 h-96 bg-primary/30 -top-48 -left-48" />
      <div className="floating-orb w-80 h-80 bg-violet/20 top-1/3 -right-40" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-64 h-64 bg-emerald/20 bottom-20 left-1/4" style={{ animationDelay: '4s' }} />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet glow-primary">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Portfolio Admin</h1>
              <p className="text-xs text-muted-foreground">Dashboard Overview</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald/10 border border-emerald/20">
              <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs text-emerald font-medium">Live</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-violet ring-2 ring-primary/20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            trend={12}
            color="primary"
            delay={0}
          />
          <StatCard
            title="Active Users"
            value={activeUsers}
            icon={Activity}
            trend={8}
            color="emerald"
            delay={100}
          />
          <StatCard
            title="Active Links"
            value={5}
            icon={Link2}
            trend={-2}
            color="amber"
            delay={200}
          />
          <StatCard
            title="Subscriptions"
            value={totalSubscriptions}
            icon={CreditCard}
            trend={15}
            color="rose"
            delay={300}
          />
        </section>

        {/* Charts Row */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Active Users Chart */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Active Users</h2>
                <p className="text-sm text-muted-foreground">
                  Real-time user activity (updates every 5s)
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10">
                <Activity className="h-4 w-4 text-emerald" />
              </div>
            </div>
            <ActiveUsersChart />
          </div>

          {/* Subscription Chart */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Subscription Analytics</h2>
                <p className="text-sm text-muted-foreground">
                  Plan distribution over time
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose/10">
                <CreditCard className="h-4 w-4 text-rose" />
              </div>
            </div>
            <SubscriptionChart />
          </div>
        </section>

        {/* Bottom Row */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Users List */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Users</h2>
                <p className="text-sm text-muted-foreground">
                  Click on a user to view their profile
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
              {users.map((user, index) => (
                <UserCard key={user.id} user={user} index={index} />
              ))}
            </div>
          </div>

          {/* Active Links */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Active Links</h2>
                <p className="text-sm text-muted-foreground">
                  Most visited pages on your portfolio
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber/10">
                <Link2 className="h-4 w-4 text-amber" />
              </div>
            </div>
            <ActiveLinks />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
