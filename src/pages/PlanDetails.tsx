
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Gem } from "lucide-react";
import { toast } from "sonner";

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
        buttonText: "Current Plan",
        buttonVariant: "outline" as const,
        disabled: true,
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
        disabled: false,
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
        disabled: false,
    },
];

const PlanDetails = () => {
    // Mock current plan for now, can be fetched from DB later
    const currentPlanName = "Free";

    const handleUpgrade = (planName: string) => {
        toast.success(`Upgraded to ${planName} successfully!`);
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Plan</h1>
                    <p className="text-muted-foreground">
                        Manage your subscription and billing details
                    </p>
                </div>

                <div className="grid gap-6 mb-8">
                    <Card className="p-6 border-primary/20 bg-primary/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Current Plan: {currentPlanName}</h2>
                                <p className="text-muted-foreground">Your plan renews on January 1, 2026</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">₹0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                            </div>
                        </div>
                    </Card>
                </div>

                <h3 className="text-xl font-bold mb-6">Available Plans</h3>
                <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`p-6 sm:p-8 relative overflow-hidden transition-all hover:shadow-xl ${plan.name === currentPlanName ? "border-2 border-green-500" : ""
                                } ${plan.popular ? "border-2 border-primary" : ""
                                }`}
                        >
                            {plan.name === currentPlanName && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    CURRENT
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
                                disabled={plan.name === currentPlanName}
                                onClick={() => handleUpgrade(plan.name)}
                            >
                                {plan.name === currentPlanName ? "Current Plan" : plan.buttonText}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PlanDetails;
