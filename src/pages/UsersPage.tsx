import { useState } from "react";
import { Users, Search } from "lucide-react";
import { users, User } from "@/data/users";
import { UserCard } from "@/components/dashboard/UserCard";
import { UserDetailModal } from "@/components/dashboard/UserDetailModal";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen professional-bg relative overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-primary/20 -top-40 -right-40" />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Users</h1>
                <p className="text-sm text-muted-foreground">
                  {users.length} total users
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-card/50 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                index={index}
                onClick={() => setSelectedUser(user)}
              />
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>

        <UserDetailModal
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      </div>
    </DashboardLayout>
  );
}
