import React from 'react';
import Navbar from '../../components/layout/Navbar';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import ProblemSection from './ProblemSection';
import FeaturesSection from './FeaturesSection';
import DashboardPreviewSection from './DashboardPreviewSection';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import Footer from '../../components/layout/Footer';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header / Navbar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <FeaturesSection />
        <DashboardPreviewSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
