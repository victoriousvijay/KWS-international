import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import InternetPlans from "./components/InternetPlans";
import AvailabilityChecker from "./components/AvailabilityChecker";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import ShapeGrid from "./components/ShapeGrid";
import Loader from "./components/Loader";
import AdvantageCard from "./components/AdvantageCard";
import ServiceCard from "./components/ServiceCard";
import Interactive3DCursor from "./components/Interactive3DCursor";
import FiberPlansHomepage from "./components/FiberPlansHomepage";
import { PrivacyPolicy, TermsAndConditions } from "./components/LegalPages";
import { PROVIDERS_LIST } from "./data";
import { InternetPlan } from "./types";
import { motion, useScroll, useTransform } from "motion/react";

import {
  Wifi,
  Tv,
  PhoneCall,
  Layers,
  Briefcase,
  ShieldAlert,
  ArrowRight,
  Phone,
  CheckCircle,
  Clock,
  Award,
  ChevronDown,
  HelpCircle,
  HelpCircle as QuestionIcon
} from "lucide-react";

export default function App() {
  // App navigation & selection states
  const [activePage, setActivePage] = useState<string>("home");
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);

  const handlePageChange = (newPage: string) => {
    setIsPageLoading(true);
    setTimeout(() => {
      setActivePage(newPage);
      setIsPageLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600); // 600ms matching transition/animation
  };

  // FAQ accordion open states
  const [faqOpenStates, setFaqOpenStates] = useState<Record<string, boolean>>({
    "faq-1": true, // Default first open
    "faq-2": false,
    "faq-3": false,
    "faq-4": false,
    "faq-5": false
  });

  // Handle plan selection from InternetPlans card
  const handleSelectPlan = (plan: InternetPlan) => {
    setSelectedPlanId(plan.id);
    setSelectedPlanName(`${plan.provider} - ${plan.name}`);
    
    // Route directly to availability checker page
    handlePageChange("checker");
  };

  const toggleFaq = (id: string) => {
    setFaqOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg relative overflow-x-hidden w-full max-w-full">
      
      {/* Premium Interactive 3D Cursor for desktop */}
      <Interactive3DCursor />
      
      {/* Loading overlay with high-tech loader */}
      {isPageLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/85 backdrop-blur-md">
          <Loader />
        </div>
      )}
      
      {/* Dynamic theme background nodes */}

      {/* Sticky Top Progress scroll bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-50 origin-left" style={{ transform: "scaleX(1)" }} />

      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        onChangePage={handlePageChange}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {activePage === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. HERO SECTION */}
            <section id="hero" className="py-24 md:py-36 relative overflow-hidden bg-[#0A2463] text-white border-b border-blue-900/40 shadow-inner">
              
              {/* Animated ShapeGrid background */}
              <div className="absolute inset-0">
                <ShapeGrid
                  shape="square"
                  direction="diagonal"
                  lineColor="#2a2734"
                  hoverColor="#ffffff"
                  hoverFillColor="#ffffff"
                  fillOpacity={0.15}
                  cellSize={40}
                  speed={0.5}
                  tiltX={0}
                  tiltY={0}
                  rainbow={false}
                />
              </div>
              
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Centered hero content */}
                <div className="space-y-8 lg:col-span-12 text-center">
                  <div className="space-y-4">
                    <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-tight">
                      Stay Connected.<br />
                      <span className="text-yellow-400">
                        Pay Less.
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-red-100/80 leading-relaxed max-w-2xl mx-auto font-light">
                      KWS International compares Internet, TV, Phone and Business connectivity from leading providers, so your home or office gets the right speed at the right price, with no guesswork.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a
                      href="tel:+19293146523"
                      data-cursor="call"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm hover:scale-[1.02] active:scale-95 duration-200"
                    >
                      <Phone className="h-4 w-4 animate-bounce" />
                      <span>Call Now</span>
                    </a>

                    <button
                      onClick={() => handlePageChange("checker")}
                      data-cursor="verify"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/95 transition-all text-sm cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
                    >
                      <span>Check Availability</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handlePageChange("plans")}
                      data-cursor="explore"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white hover:bg-white/10 hover:border-white/40 transition-all text-sm cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
                    >
                      <span>Compare Plans</span>
                    </button>
                  </div>

                  {/* Trust Metric line */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/10 max-w-xl mx-auto">
                    <div>
                      <span className="font-number text-2xl font-extrabold text-white block">
                        9,800+
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-red-200/60">
                        Customers Connected
                      </span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <span className="font-number text-2xl font-extrabold text-white block">
                        24 Hr
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-red-200/60">
                        Avg. Setup Time
                      </span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <span className="font-number text-2xl font-extrabold text-white block">
                        4.9 / 5
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-red-200/60">
                        Customer Rating
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* 3. FIBER-POWERED PLANS SPECUAL SECTION */}
            <FiberPlansHomepage onSelectPlan={(planId, planName) => {
              setSelectedPlanId(planId);
              setSelectedPlanName(planName);
              handlePageChange("checker");
            }} />

            {/* 4. WHY CHOOSE CORECONNECT */}
            <motion.section
              id="why-choose"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="py-24 bg-card border-t border-border-custom relative overflow-hidden"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                  <span className="inline-block rounded-full bg-accent/5 border border-accent/20 px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-wider mb-4">
                    The KWS Difference
                  </span>
                  <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
                    Why Customers Choose KWS
                  </h2>
                  <p className="text-lg text-text-secondary">
                    Honest advice, real savings and fast setup. Here is what sets KWS International apart from going it alone.
                  </p>
                </div>

                {/* Bento Style Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                  
                  {/* Feature Card 1 */}
                  <AdvantageCard
                    title="Exclusive Savings"
                    description="Our partner network gives you access to promotional rates, bundle discounts and seasonal offers that are hard to find on your own."
                    gradient="#D62828"
                    shadowColor="rgba(244, 180, 0, 0.45)"
                    icon={<Award className="h-6 w-6 text-white" />}
                    imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
                  />

                  {/* Feature Card 2 */}
                  <AdvantageCard
                    title="Fast, Easy Setup"
                    description="Choose a plug-and-play self-install kit or let us schedule a certified technician at a time that suits you, often within 48 hours."
                    gradient="#2563EB"
                    shadowColor="rgba(236, 72, 153, 0.45)"
                    icon={<Clock className="h-6 w-6 text-white" />}
                    imageUrl="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80"
                  />

                  {/* Feature Card 3 */}
                  <AdvantageCard
                    title="Clear, Upfront Pricing"
                    description="Every fee is explained before you sign up. The price we quote is the price you see on your monthly bill."
                    gradient="#F4B400"
                    shadowColor="rgba(16, 185, 129, 0.45)"
                    icon={<CheckCircle className="h-6 w-6 text-white" />}
                    imageUrl="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
                  />

                </div>

              </div>
            </motion.section>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Let's Get You Connected
                </h2>
                <p className="text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
                  Tell us your ZIP code and a KWS International specialist will show you every plan available at your address, and help you pick the best one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-red-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Check My Address</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+19293146523"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Us +1-929-314-6523</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "plans" && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 3. INTERNET PLANS GRID */}
            <div className="py-8">
              <InternetPlans onSelectPlan={handleSelectPlan} />
            </div>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Let's Get You Connected
                </h2>
                <p className="text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
                  Tell us your ZIP code and a KWS International specialist will show you every plan available at your address, and help you pick the best one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-red-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Check My Address</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+19293146523"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Us +1-929-314-6523</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "checker" && (
          <motion.div
            key="checker"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 5. INSTANT AVAILABILITY CHECKER */}
            <div className="py-8">
              <AvailabilityChecker
                selectedPlanId={selectedPlanId}
                onClearSelectedPlan={() => {
                  setSelectedPlanId(null);
                  setSelectedPlanName(null);
                }}
                selectedPlanName={selectedPlanName}
              />
            </div>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Let's Get You Connected
                </h2>
                <p className="text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
                  Tell us your ZIP code and a KWS International specialist will show you every plan available at your address, and help you pick the best one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-red-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Check My Address</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+19293146523"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Us +1-929-314-6523</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "services" && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 6. SERVICES GRID */}
            <motion.section
              id="services"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="py-24 bg-bg relative overflow-hidden"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="inline-block rounded-full bg-primary/5 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-4">
                    What We Offer
                  </span>
                  <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
                    Connectivity Services by KWS International
                  </h2>
                  <p className="text-lg text-text-secondary">
                    One trusted partner for everything that keeps your home and business online, from fast internet to smart security.
                  </p>
                </div>

                {/* Grid 3x2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                  
                  {/* Card 1: Internet */}
                  <ServiceCard
                    title="High-Speed Internet"
                    description="Fiber, cable and 5G home internet options compared side by side, from everyday browsing to multi-gig speeds."
                    icon={<Wifi className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 2: TV */}
                  <ServiceCard
                    title="TV & Streaming"
                    description="Find channel packages with the local news, live sports and movies you love, plus cloud DVR for every room."
                    icon={<Tv className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 3: Phone */}
                  <ServiceCard
                    title="Home & Business Phone"
                    description="Unlimited nationwide calling with HD voice quality, caller ID, spam protection and call forwarding included."
                    icon={<PhoneCall className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 4: Bundles */}
                  <ServiceCard
                    title="Smart Bundles"
                    description="Combine internet, TV and phone into one simple bill and save up to 40% compared with separate services."
                    icon={<Layers className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 5: Business */}
                  <ServiceCard
                    title="Business Solutions"
                    description="Dedicated fiber, static IPs, 99.9% uptime guarantees and priority support built for offices, retail and remote teams."
                    icon={<Briefcase className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 6: Security */}
                  <ServiceCard
                    title="Home Security"
                    description="Smart cameras, motion alerts and 24/7 professional monitoring you can check from your phone, anywhere."
                    icon={<ShieldAlert className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                </div>

              </div>
            </motion.section>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Let's Get You Connected
                </h2>
                <p className="text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
                  Tell us your ZIP code and a KWS International specialist will show you every plan available at your address, and help you pick the best one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-red-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Check My Address</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+19293146523"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Us +1-929-314-6523</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "how-it-works" && (
          <motion.div
            key="how-it-works"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 7. HOW IT WORKS */}
            <div className="py-8">
              <HowItWorks onNavigateToChecker={() => handlePageChange("checker")} />
            </div>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Let's Get You Connected
                </h2>
                <p className="text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
                  Tell us your ZIP code and a KWS International specialist will show you every plan available at your address, and help you pick the best one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-red-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Check My Address</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+19293146523"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Us +1-929-314-6523</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "faq" && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 9. FAQ ACCORDION SECTION */}
            <section id="faq" className="py-24 bg-card border-t border-border-custom relative overflow-hidden">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
                    <QuestionIcon className="h-3.5 w-3.5" />
                    <span>Have Questions?</span>
                  </div>
                  <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
                    Frequently Asked Questions
                  </h2>
                </div>

                {/* Interactive Accordion Panel */}
                <div className="space-y-4">
                  {[
                    {
                      id: "faq-1",
                      q: "How does KWS International know which plans are available at my address?",
                      a: "We check your ZIP code and street address against up-to-date provider coverage data for fiber, cable and 5G networks. That way you only see plans that can actually be installed at your home or business."
                    },
                    {
                      id: "faq-2",
                      q: "Will I pay more by going through KWS International?",
                      a: "No. Our service is free for customers. We show standard provider pricing along with any current promotions and bundle deals, and we never add markups or consulting fees."
                    },
                    {
                      id: "faq-3",
                      q: "Should I choose Fiber or Cable internet?",
                      a: "Fiber sends data using light, giving you equal upload and download speeds with very low latency, ideal for video calls, gaming and cloud backups. Cable offers fast downloads (up to 1 Gbps) but slower uploads, usually 35-50 Mbps. If fiber is available at your address, it is usually the better pick."
                    },
                    {
                      id: "faq-4",
                      q: "Do I need to sign a long-term contract?",
                      a: "Most home plans we offer, including KWS Fiber, are month-to-month with no contract. Some business plans use 1 or 2 year agreements in exchange for a locked-in price. Contract terms are clearly shown on every plan card."
                    },
                    {
                      id: "faq-5",
                      q: "How soon can I get connected?",
                      a: "If your address already has active lines, a self-install kit usually arrives in 2-3 business days and takes about 15 minutes to set up. If a technician visit is needed, we typically schedule it within 48-72 hours of your request."
                    }
                  ].map((item) => {
                    const isOpen = faqOpenStates[item.id];
                    return (
                      <div
                        key={item.id}
                        className="border border-border-custom bg-bg/40 rounded-2xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFaq(item.id)}
                          className="w-full flex items-center justify-between p-6 text-left font-semibold text-text-primary hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="font-display text-base md:text-lg">{item.q}</span>
                          <ChevronDown
                            className={`h-5 w-5 text-text-secondary shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-primary" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="p-6 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border-custom bg-card animate-fade-in-up">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Let's Get You Connected
                </h2>
                <p className="text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
                  Tell us your ZIP code and a KWS International specialist will show you every plan available at your address, and help you pick the best one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-red-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Check My Address</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+19293146523"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Us +1-929-314-6523</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "privacy" && (
          <PrivacyPolicy onBack={() => handlePageChange("home")} />
        )}

        {activePage === "terms" && (
          <TermsAndConditions onBack={() => handlePageChange("home")} />
        )}
      </main>

      {/* Footer Section */}
      <Footer onChangePage={handlePageChange} />

    </div>
  );
}
