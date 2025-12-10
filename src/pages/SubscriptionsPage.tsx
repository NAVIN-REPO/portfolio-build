import { CreditCard } from "lucide-react";
import { SubscriptionChart } from "@/components/dashboard/SubscriptionChart";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function SubscriptionsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen professional-bg relative overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-rose/20 -top-40 -left-40" />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose/10">
              <CreditCard className="h-5 w-5 text-rose" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
              <p className="text-sm text-muted-foreground">
                Manage and track subscription plans
              </p>
            </div>
          </div>

          {/* Subscription Chart */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-6">
            <SubscriptionChart />
          </div>

          {/* Plans Info */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald/20 bg-emerald/5 p-6">
              <h3 className="text-lg font-bold text-emerald mb-2">Basic Plan</h3>
              <p className="text-3xl font-bold text-foreground">₹199<span className="text-sm text-muted-foreground">/month</span></p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• 5 Portfolio links</li>
                <li>• Basic analytics</li>
                <li>• Email support</li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber/20 bg-amber/5 p-6">
              <h3 className="text-lg font-bold text-amber mb-2">Pro Plan</h3>
              <p className="text-3xl font-bold text-foreground">₹499<span className="text-sm text-muted-foreground">/month</span></p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• 20 Portfolio links</li>
                <li>• Advanced analytics</li>
                <li>• Priority support</li>
              </ul>
            </div>

            <div className="rounded-xl border border-rose/20 bg-rose/5 p-6">
              <h3 className="text-lg font-bold text-rose mb-2">Premium Plan</h3>
              <p className="text-3xl font-bold text-foreground">₹999<span className="text-sm text-muted-foreground">/month</span></p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Unlimited links</li>
                <li>• Full analytics suite</li>
                <li>• 24/7 support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
