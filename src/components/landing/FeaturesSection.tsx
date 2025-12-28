import { Card } from "@/components/ui/card";
import { Palette, Zap, Shield, Globe2, Sparkles, Layout } from "lucide-react";

const features = [
  {
    icon: Layout,
    title: "Drag & Drop Builder",
    description: "Intuitive interface to arrange your content exactly how you want it. No coding required.",
  },
  {
    icon: Palette,
    title: "50+ Templates",
    description: "Choose from professionally designed templates and customize every aspect to match your brand.",
  },
  {
    icon: Sparkles,
    title: "Smooth Animations",
    description: "Impress visitors with beautiful animations and transitions that bring your portfolio to life.",
  },
  {
    icon: Globe2,
    title: "Instant Publishing",
    description: "Go live in seconds with your custom domain. Share your portfolio anywhere, anytime.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed. Your portfolio loads instantly, keeping visitors engaged.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is protected with enterprise-grade security. 99.9% uptime guaranteed.",
  },
];

import { useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export const FeaturesSection = () => {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);

  const particlesOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: "#3b82f6",
        },
        links: {
          color: "#3b82f6",
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none" as const,
          random: false,
          straight: false,
          outModes: {
            default: "bounce" as const,
          },
        },
        number: {
          value: 80,
          density: {
            enable: true,
          },
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <section id="features" className="relative py-16 sm:py-24 overflow-hidden">
      <Particles
        id="features-particles"
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Shine
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make building your digital portfolio effortless
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all group cursor-pointer border-2 hover:border-primary/20 bg-card/80 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
