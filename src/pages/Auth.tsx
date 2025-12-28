import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Github, Linkedin, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveUser } from "@/lib/user-storage";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup
} from "firebase/auth";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const [isSignUp, setIsSignUp] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setIsSignUp(mode === "signup");
  }, [mode]);

  useEffect(() => {
    // Set persistence to local (default) but explicit is good
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Persistence Error:", error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const GENERIC_ADMIN_EMAIL = "admin@example.com"; // Changed for safety, real auth preferred
    // ... logic remains ... 

    // Copying the rest of the existing function logic is risky with replace_content if I don't include it all.
    // I will target specific blocks instead.
  };

  const handleOAuthLogin = async (providerName: string) => {
    let provider;
    switch (providerName) {
      case "Google":
        provider = new GoogleAuthProvider();
        break;
      case "GitHub":
        provider = new GithubAuthProvider();
        break;
      case "LinkedIn":
        provider = new OAuthProvider('oidc.linkedin'); // Requires Firebase Console setup
        break;
      default:
        return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user to Firestore if needed (merge true)
      await saveUser({
        id: user.uid,
        name: user.displayName || name || "User",
        email: user.email || "",
      });

      toast({
        title: "Signed in successfully!",
        description: `Welcome ${user.displayName || "User"}`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("OAuth Error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Cancelled",
          description: "Sign in was cancelled.",
          variant: "destructive"
        });
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists with a different provider.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sign In Failed",
          description: error.message || "Could not sign in with " + providerName,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl"></span>
            </div>
            <span className="font-bold text-xl">PortfolioBuilder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp
              ? "Start building your digital portfolio today"
              : "Sign in to continue to your portfolio"}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthLogin("Google")}
          >
            <Mail className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthLogin("LinkedIn")}
          >
            <Linkedin className="w-5 h-5 mr-2" />
            Continue with LinkedIn
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthLogin("GitHub")}
          >
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              navigate(`/auth?mode=${isSignUp ? "signin" : "signup"}`);
            }}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
