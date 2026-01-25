import { useEffect } from "react";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  // Track mouse position for ambient glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Layered background effects */}
      <div className="fixed inset-0 bg-grid-premium" aria-hidden="true" />
      <div className="fixed inset-0 bg-radial-premium" aria-hidden="true" />
      <div className="fixed inset-0 bg-noise" aria-hidden="true" />
      
      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;