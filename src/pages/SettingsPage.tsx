import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen professional-bg relative overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-primary/20 bottom-20 -right-40" />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <Settings className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your preferences
              </p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Profile</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Display Name</p>
                    <p className="text-sm text-muted-foreground">Admin User</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">admin@portfolio.dev</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-amber" />
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">New User Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when users sign up</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-emerald" />
                <h2 className="text-lg font-semibold text-foreground">Security</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="h-5 w-5 text-violet" />
                <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
