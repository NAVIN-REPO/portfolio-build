import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Eye, Edit, Trash2, Search, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedPortfolios, deletePortfolio } from "@/lib/portfolio-storage";
import { SavedPortfolio } from "@/data/templates";
import { toast } from "sonner";
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

const Portfolios = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id?: string }>({ isOpen: false });

  // Load portfolios on mount
  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const saved = await getSavedPortfolios();
        setPortfolios(saved);
      } catch (error) {
        toast.error("Failed to load portfolios");
        console.error(error);
      }
    };
    loadPortfolios();
  }, []);

  const filteredPortfolios = portfolios.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteDialog.id) {
      try {
        await deletePortfolio(deleteDialog.id);
        setPortfolios(prev => prev.filter(p => p.id !== deleteDialog.id));
        toast.success("Portfolio deleted successfully");
      } catch (error) {
        console.error("Error deleting portfolio:", error);
        toast.error("Failed to delete portfolio");
      }
      setDeleteDialog({ isOpen: false });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Portfolios</h1>
            <p className="text-muted-foreground">
              Manage and organize your digital portfolios
            </p>
          </div>
          <Button className="gap-2" onClick={() => navigate('/templates')}>
            <Plus className="w-4 h-4" />
            New Portfolio
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search portfolios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredPortfolios.map((portfolio) => (
            <Card
              key={portfolio.id}
              className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/20"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Preview Image Thumbnail */}
                  <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden shrink-0 border">
                    <img
                      src={portfolio.previewImage || '/placeholder.svg'}
                      alt={portfolio.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold truncate">{portfolio.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>Template: {portfolio.templateName}</span>
                      <span>•</span>
                      <span>Created {new Date(portfolio.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/portfolio/${portfolio.id}`} target="_blank" rel="noopener noreferrer" className="gap-2">
                      <Eye className="w-4 h-4 mr-2" />
                      View Live
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/editor/portfolio/${portfolio.id}`)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-white hover:text-white"
                    onClick={() => handleDeleteClick(portfolio.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPortfolios.length === 0 && (
          <div className="text-center py-12 bg-white/50 rounded-lg border border-dashed">
            <p className="text-muted-foreground mb-4">No portfolios found</p>
            {portfolios.length === 0 ? (
              <Button onClick={() => navigate('/templates')}> Create your first portfolio </Button>
            ) : (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your portfolio.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Portfolios;
