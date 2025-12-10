import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-50 h-14 border-b border-border/50 bg-background/60 backdrop-blur-xl flex items-center px-4 gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs text-emerald font-medium">Live</span>
            </div>
          </header>
          
          {/* Page Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
