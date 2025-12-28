import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Eye, Edit, Trash2, TrendingUp, Users, BarChart as BarChartIcon, ExternalLink, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSavedPortfolios, deletePortfolio } from "@/lib/portfolio-storage";
import { SavedPortfolio } from "@/data/templates";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const PROFILE_COLLECTION = "profiles";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null); // Changed to string
  const [copiedId, setCopiedId] = useState<string | null>(null); // Changed to string
  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);

  // User profile data
  const [user, setUser] = useState({
    name: "User",
    email: "",
    avatar: "/placeholder-avatar.jpg",
    joinedDate: "Just now",
    portfoliosCount: 0,
    totalViews: 0,
    totalVisitors: 0,
  });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Auth Listener
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        await loadDashboardData(currentUser);
      } else {
        setUserId(null);
        // Optional: navigate('/auth');
      }
    });
    return () => unsubscribe();
  }, []);

  const loadDashboardData = async (currentUser: any) => {
    try {
      // Load Portfolios
      // TODO: Update getSavedPortfolios to filter by user if not already
      const saved = await getSavedPortfolios();
      setPortfolios(saved);

      // Calculate Stats
      const totalViews = saved.reduce((acc, curr) => acc + (curr.views || 0), 0);
      const totalVisitors = saved.reduce((acc, curr) => acc + (curr.visitors || 0), 0);

      // Load Profile
      try {
        const docRef = doc(db, PROFILE_COLLECTION, currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(prev => ({
            ...prev,
            name: data.firstName || "User",
            email: data.email || currentUser.email || "",
            avatar: data.photo || prev.avatar,
            portfoliosCount: saved.length,
            totalViews,
            totalVisitors,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) // Approximation or store in db
          }));
        } else {
          // No profile yet, use auth data
          setUser(prev => ({
            ...prev,
            email: currentUser.email || "",
            name: currentUser.displayName || "User",
            portfoliosCount: saved.length,
            totalViews,
            totalVisitors
          }));
        }
      } catch (error) {
        console.error("Error loading profile", error);
      }

    } catch (error) {
      console.error("Error loading dashboard data", error);
    }
  };


  // Dynamic Screen Time Tracking
  const [screenTimeData, setScreenTimeData] = useState([
    { name: "Mon", hours: 0 },
    { name: "Tue", hours: 0 },
    { name: "Wed", hours: 0 },
    { name: "Thu", hours: 0 },
    { name: "Fri", hours: 0 },
    { name: "Sat", hours: 0 },
    { name: "Sun", hours: 0 },
  ]);

  useEffect(() => {
    // 1. Load stored data or initialize
    const storedData = localStorage.getItem("poovi_screen_time");
    const currentData = storedData ? JSON.parse(storedData) : {
      "Mon": 2.5, "Tue": 3.8, "Wed": 1.5, "Thu": 4.2, "Fri": 5.0, "Sat": 0, "Sun": 0
    }; // Mock initial history, real app would have database

    // 2. Identify Today
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = days[new Date().getDay()];

    // 3. Update State Helper
    const updateState = () => {
      const formattedData = days.slice(1).concat(days[0]).map(day => ({ // Mon-Sun order
        name: day,
        hours: parseFloat(parseFloat(currentData[day] || 0).toFixed(1))
      }));
      setScreenTimeData(formattedData);
    };

    updateState(); // Initial Load

    // 4. Start Timer (Add 1 minute every minute)
    const timer = setInterval(() => {
      currentData[today] = (currentData[today] || 0) + (1 / 60); // Add 1 minute in hours
      localStorage.setItem("poovi_screen_time", JSON.stringify(currentData));
      updateState();
    }, 60000); // 1 minute

    return () => clearInterval(timer);
  }, []);

  // Handler functions
  const handleEditProfile = () => {
    navigate("/profile");
  };

  const handleNewPortfolio = () => {
    navigate("/templates");
  };

  const handleViewLive = (id: string) => {
    window.open(`/portfolio/${id}`, "_blank");
  };

  const handleEdit = (portfolioId: string) => {
    navigate(`/editor/portfolio/${portfolioId}`);
  };

  const handleCopyUrl = (id: string) => {
    const fullUrl = `${window.location.origin}/portfolio/${id}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast({
      title: "URL Copied!",
      description: "Portfolio URL has been copied to clipboard.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDuplicate = (portfolio: SavedPortfolio) => {
    toast({
      title: "Coming Soon",
      description: `Duplication feature is coming soon.`,
    });
  };

  const handleAnalytics = (portfolioId: string) => {
    navigate("/history");
  };

  const handleDeleteClick = (portfolioId: string) => {
    setPortfolioToDelete(portfolioId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (portfolioToDelete) {
      try {
        await deletePortfolio(portfolioToDelete);

        // Update Local State
        const updatedPortfolios = portfolios.filter(p => p.id !== portfolioToDelete);
        setPortfolios(updatedPortfolios);

        // Update Stats
        const totalViews = updatedPortfolios.reduce((acc, curr) => acc + (curr.views || 0), 0);
        const totalVisitors = updatedPortfolios.reduce((acc, curr) => acc + (curr.visitors || 0), 0);

        setUser(prev => ({
          ...prev,
          portfoliosCount: updatedPortfolios.length,
          totalViews,
          totalVisitors
        }));

        toast({
          title: "Portfolio Deleted",
          description: "The portfolio has been deleted successfully.",
          variant: "destructive",
        });
      } catch (error) {
        console.error("Error deleting portfolio", error);
        toast({
          title: "Error",
          description: "Failed to delete portfolio",
          variant: "destructive"
        });
      }
      setDeleteDialogOpen(false);
      setPortfolioToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* User Profile Header */}
        <Card className="p-6 mb-8 hover:shadow-lg transition-all border-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                <p className="text-muted-foreground mb-2">{user.email}</p>
                <p className="text-sm text-muted-foreground">Member since {user.joinedDate}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleEditProfile}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button className="gap-2" onClick={handleNewPortfolio}>
                <Plus className="w-4 h-4" />
                New Portfolio
              </Button>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <BarChartIcon className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{user.portfoliosCount}</div>
            <p className="text-muted-foreground">Total Portfolios</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              {/* <span className="text-xs text-muted-foreground">+24%</span> */}
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{user.totalViews.toLocaleString()}</div>
            <p className="text-muted-foreground">Total Views</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-primary" />
              {/* <span className="text-xs text-muted-foreground">+18%</span> */}
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{user.totalVisitors.toLocaleString()}</div>
            <p className="text-muted-foreground">Total Visitors</p>
          </Card>
        </div>

        {/* Weekly Performance Chart (Screen Time) */}
        <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/20 mb-8">
          <h3 className="text-xl font-bold mb-4">User Screen Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={screenTimeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value) => [`${value} hrs`, "Screen Time"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="hours"
                name="Screen Time"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* My Portfolios Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Portfolios</h2>
            {/* <Button variant="ghost" size="sm">View All</Button> */}
          </div>

          {portfolios.length === 0 ? (
            <div className="text-center py-12 bg-secondary/10 rounded-lg">
              <p className="text-muted-foreground mb-4">You haven't created any portfolios yet.</p>
              <Button onClick={handleNewPortfolio}>Create Your First Portfolio</Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {portfolios.map((portfolio) => (
                <Card key={portfolio.id} className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/20">
                  <div className="space-y-4">
                    {/* Portfolio Header */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{portfolio.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${portfolio.isPublic
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                            {portfolio.isPublic ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>Template: {portfolio.templateName}</span>
                          <span>•</span>
                          <span>Created {new Date(portfolio.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            /{portfolio.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Portfolio Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Views</p>
                          <p className="text-lg font-bold">{(portfolio.views || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Visitors</p>
                          <p className="text-lg font-bold">{(portfolio.visitors || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      {/* Engagement Mock */}
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <BarChartIcon className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                          <p className="text-lg font-bold">
                            {portfolio.views ? Math.round(((portfolio.visitors || 0) / portfolio.views) * 100) : 0}%
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" variant="default" onClick={() => handleViewLive(portfolio.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Live
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(portfolio.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCopyUrl(portfolio.id)}>
                        {copiedId === portfolio.id ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedId === portfolio.id ? "Copied!" : "Copy URL"}
                      </Button>
                      {/* <Button size="sm" variant="outline" onClick={() => handleDuplicate(portfolio)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </Button> */}
                      <Button size="sm" variant="outline" onClick={() => handleAnalytics(portfolio.id)}>
                        <BarChartIcon className="w-4 h-4 mr-2" />
                        History
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(portfolio.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your portfolio
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Dashboard;
