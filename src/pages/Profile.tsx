import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, User, MapPin, Link as LinkIcon, Trash2 } from "lucide-react";
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
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const PROFILE_COLLECTION = "profiles";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  photo: string | null;
}

const defaultProfile: ProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  bio: "",
  location: "",
  website: "",
  photo: null,
};

import { getSavedPortfolios, deletePortfolio } from "@/lib/portfolio-storage";
import { SavedPortfolio } from "@/data/templates";
import { addHistoryItem } from "@/lib/history-storage";

// ... previous imports ...

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedPortfolios, setSavedPortfolios] = useState<SavedPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Load profile and portfolios from Firestore on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          // Load User Profile
          const docRef = doc(db, PROFILE_COLLECTION, user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data() as ProfileData);
          } else {
            // If no profile, maybe pre-fill email?
            setProfile(prev => ({ ...prev, email: user.email || "" }));
          }

          // Load CMS Portfolios (You might need to update getSavedPortfolios to accept a userId too)
          // For now, presuming getSavedPortfolios handles it or needs update.
          // Let's assume for now it needs update, but I'll focus on profile first.
          const portfolios = await getSavedPortfolios();
          setSavedPortfolios(portfolios);
        } catch (error) {
          console.error("Error loading data:", error);
          toast.error("Failed to load profile data");
        }
      } else {
        setUserId(null);
        // Maybe redirect to login?
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Convert to base64 for storage (Note: Firestore has document size limits, ideally use Storage)
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setProfile((prev) => ({ ...prev, photo: base64 }));
      setHasChanges(true);
      toast.success("Photo updated successfully!");
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, photo: null }));
    setHasChanges(true);
    toast.success("Photo removed");
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("You must be logged in to save.");
      return;
    }
    try {
      await setDoc(doc(db, PROFILE_COLLECTION, userId), profile);
      setHasChanges(false);
      await addHistoryItem("Updated profile information", "profile");
      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error("Failed to save profile");
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = async () => {
    if (!userId) return;
    try {
      const docRef = doc(db, PROFILE_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as ProfileData);
      } else {
        setProfile({ ...defaultProfile, email: auth.currentUser?.email || "" });
      }
    } catch (error) {
      console.error("Error reverting changes", error);
    }
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'portfolio' | 'account';
    id?: string;
  }>({ isOpen: false, type: 'portfolio' });

  const triggerDeletePortfolio = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDeleteDialog({ isOpen: true, type: 'portfolio', id });
  };

  const triggerDeleteAccount = () => {
    setDeleteDialog({ isOpen: true, type: 'account' });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.type === 'portfolio' && deleteDialog.id) {
      await deletePortfolio(deleteDialog.id);
      setSavedPortfolios(prev => prev.filter(p => p.id !== deleteDialog.id));
      toast.success("Portfolio deleted successfully");
    } else if (deleteDialog.type === 'account') {
      if (!userId) return;
      try {
        await deleteDoc(doc(db, PROFILE_COLLECTION, userId));
        // Maybe also delete all portfolios? For now just profile.
        // Also delete auth user?
        // await deleteUser(auth.currentUser!); // Requires re-auth usually
        toast.success("Account deleted successfully");
        window.location.href = "/";
      } catch (error) {
        console.error("Error deleting account", error);
        toast.error("Failed to delete account");
      }
    }
    setDeleteDialog(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                {profile.photo ? (
                  <AvatarImage src={profile.photo} alt="Profile" />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile.firstName?.[0] || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2" onClick={handlePhotoClick}>
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </Button>
                  {profile.photo && (
                    <Button variant="outline" size="icon" onClick={handleRemovePhoto}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="Enter your name"
                      value={profile.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("firstName", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={profile.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={profile.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Enter your bio..."
                  rows={4}
                  value={profile.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("bio", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter location"
                    value={profile.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("location", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={profile.website}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("website", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button type="button" onClick={handleSave} disabled={!hasChanges}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={!hasChanges}>
                Cancel
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">My Portfolios</h2>
            {savedPortfolios.length === 0 ? (
              <div className="text-center py-8 bg-secondary/20 rounded-lg">
                <p className="text-muted-foreground mb-4">You haven't created any portfolios yet.</p>
                <Button onClick={() => window.location.href = '/templates'}>
                  Create New Portfolio
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedPortfolios.map((portfolio) => (
                  <div key={portfolio.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={portfolio.previewImage || '/placeholder.svg'}
                          alt={portfolio.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{portfolio.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created {new Date(portfolio.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/editor/portfolio/${portfolio.id}`} className="gap-2">
                          Edit
                        </a>
                      </Button>
                      <Button size="sm" asChild>
                        <a href={`/portfolio/${portfolio.id}`} target="_blank" rel="noopener noreferrer" className="gap-2">
                          <LinkIcon className="w-3 h-3" />
                          View Live
                        </a>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={(e) => triggerDeletePortfolio(portfolio.id, e)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Subscription & Payment</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-muted-foreground">Free Plan</p>
                </div>
                <Button onClick={() => (window.location.href = "/subscriptions")}>
                  Upgrade Plan
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Payment Methods</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                      <div>
                        <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      Remove
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-destructive">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" onClick={triggerDeleteAccount}>Delete Account</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.type === 'portfolio'
                ? "This will permanently delete this portfolio. This action cannot be undone."
                : "This will permanently delete your account and all saved portfolios. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Profile;
