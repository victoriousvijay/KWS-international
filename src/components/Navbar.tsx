import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Phone, Zap, Shield, ArrowRight } from "lucide-react";

interface NavbarProps {
  activePage: string;
  onChangePage: (page: string) => void;
}

export default function Navbar({ activePage, onChangePage }: NavbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Force default light theme to come first when opening the website
    setTheme("light");
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.body.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-custom bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { onChangePage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">
              KW<span className="text-primary">S</span>
            </span>
            <span className="block text-[9px] font-semibold tracking-wider uppercase text-text-secondary">
              International
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onChangePage("home")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "home" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onChangePage("checker")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "checker" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            Check Availability
          </button>
          <button
            onClick={() => onChangePage("services")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "services" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            Services
          </button>
          <button
            onClick={() => onChangePage("how-it-works")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "how-it-works" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onChangePage("faq")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "faq" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            FAQ
          </button>
        </nav>

        {/* CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-border-custom p-2.5 hover:bg-card text-text-secondary transition-colors"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          {/* Phone Action */}
          <a
            href="tel:+19293146523"
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/10 hover:bg-primary/90 transition-all"
          >
            <Phone className="h-4 w-4" />
            <span>+1-929-314-6523</span>
          </a>
        </div>

        {/* Mobile menu and triggers */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Theme Toggle Mobile */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-border-custom p-2 hover:bg-card text-text-secondary"
          >
            {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          {/* Call Mobile Icon */}
          <a
            href="tel:+19293146523"
            className="rounded-xl bg-primary p-2 text-white"
            title="Call Now"
          >
            <Phone className="h-4.5 w-4.5" />
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-border-custom p-2 text-text-secondary hover:bg-card"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-custom bg-card px-4 py-6 space-y-4 animate-fade-in-up">
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => { onChangePage("home"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "home" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              Home
            </button>
            <button
              onClick={() => { onChangePage("checker"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "checker" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              Check Availability
            </button>
            <button
              onClick={() => { onChangePage("services"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "services" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              Services Grid
            </button>
            <button
              onClick={() => { onChangePage("how-it-works"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "how-it-works" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              How It Works
            </button>
            <button
              onClick={() => { onChangePage("faq"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "faq" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              FAQ
            </button>
          </nav>

          <hr className="border-border-custom" />

          <div className="flex flex-col gap-3">
            <a
              href="tel:+19293146523"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-base font-semibold text-white shadow-md"
            >
              <Phone className="h-4 w-4" />
              <span>Call +1-929-314-6523</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
