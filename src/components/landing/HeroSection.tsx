import { useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCountUp } from "../../hooks/useCountUp";

export const HeroSection = () => {
  const navigate = useNavigate();
  const activeUsers = useCountUp(1000);
  const templates = useCountUp(50);
  const satisfaction = useCountUp(99);
  const support = useCountUp(24);

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
          value: "#ffffff",
        },
        links: {
          enable: false,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "top" as const,
          random: true,
          straight: false,
          outModes: {
            default: "out" as const,
          },
        },
        number: {
          value: 40,
          density: {
            enable: true,
          },
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      <Particles
        id="hero-particles"
        options={particlesOptions}
        className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-24 sm:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-top-3 duration-700">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              Build Your Digital Presence
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
            Create Stunning
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Digital Portfolios
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-5 duration-700 delay-200">
            Transform your resume into an interactive, animated digital portfolio that stands out.
            No coding required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-top-6 duration-700 delay-300">
            <Button
              size="lg"
              onClick={() => navigate("/auth?mode=signup")}
              className="group w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/templates")}
              className="w-full sm:w-auto bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white"
            >
              View Templates
            </Button>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto animate-in fade-in zoom-in duration-700 delay-500">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{activeUsers}+</div>
              <div className="text-xs sm:text-sm text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{templates}+</div>
              <div className="text-xs sm:text-sm text-gray-400">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{satisfaction}%</div>
              <div className="text-xs sm:text-sm text-gray-400">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{support}/7</div>
              <div className="text-xs sm:text-sm text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>


      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
};
