export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "online" | "offline";
  plan: "basic" | "pro" | "premium";
  joinedAt: string;
}

export const users: User[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    email: "aarav.sharma@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    status: "online",
    plan: "premium",
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    status: "online",
    plan: "pro",
    joinedAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    status: "offline",
    plan: "basic",
    joinedAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Ananya Gupta",
    email: "ananya.gupta@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    status: "online",
    plan: "pro",
    joinedAt: "2024-01-28",
  },
  {
    id: "5",
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    status: "online",
    plan: "premium",
    joinedAt: "2024-02-05",
  },
  {
    id: "6",
    name: "Meera Reddy",
    email: "meera.reddy@email.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    status: "offline",
    plan: "basic",
    joinedAt: "2024-03-25",
  },
  {
    id: "7",
    name: "Arjun Nair",
    email: "arjun.nair@email.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    status: "online",
    plan: "pro",
    joinedAt: "2024-01-08",
  },
  {
    id: "8",
    name: "Kavya Iyer",
    email: "kavya.iyer@email.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    status: "online",
    plan: "premium",
    joinedAt: "2024-02-14",
  },
];
