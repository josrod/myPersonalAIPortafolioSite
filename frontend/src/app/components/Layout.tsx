import { Link, Outlet, useLocation } from "react-router";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { ChatWidget } from "./ChatWidget";
import { Button } from "./ui/button";

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const isHome = location.pathname === "/";

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { type: "scroll" as const, id: "what-we-build", label: t("nav.whatWeBuild") },
    { type: "scroll" as const, id: "how-it-works", label: t("nav.howItWorks") },
    { type: "link" as const, path: "/use-cases", label: t("nav.useCases") },
    { type: "link" as const, path: "/contact", label: t("nav.contact") },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800" data-testid="main-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2.5 group" data-testid="nav-logo">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">TailorAI</span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) =>
                item.type === "scroll" ? (
                  <button key={item.id} onClick={() => scrollTo(item.id)} data-testid={`nav-${item.id}`}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    {item.label}
                  </button>
                ) : (
                  <Link key={item.path} to={item.path!} data-testid={`nav-link-${item.path!.replace(/\//g, '')}`}
                    className={`text-sm transition-colors ${isActive(item.path!) ? "text-blue-600 dark:text-blue-400 font-medium" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
                    {item.label}
                  </Link>
                )
              )}
              <ThemeToggle />
              <LanguageSwitcher />
              <Link to="/consultation">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0 rounded-full px-5" data-testid="nav-cta">
                  {t("nav.bookCall")}
                </Button>
              </Link>
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              <button data-testid="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-400">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) =>
                item.type === "scroll" ? (
                  <button key={item.id} onClick={() => scrollTo(item.id)} className="block w-full text-left py-2 px-4 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                    {item.label}
                  </button>
                ) : (
                  <Link key={item.path} to={item.path!} onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                    {item.label}
                  </Link>
                )
              )}
              <Link to="/consultation" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full">{t("nav.bookCall")}</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16"><Outlet /></main>

      <footer className="bg-slate-950 text-slate-400 py-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">TailorAI</span>
            </div>
            <p className="text-sm">{t("footer.tagline")}</p>
            <div className="flex gap-6 text-sm">
              <Link to="/contact" className="hover:text-white transition-colors">{t("nav.contact")}</Link>
              <Link to="/use-cases" className="hover:text-white transition-colors">{t("nav.useCases")}</Link>
              <Link to="/about" className="hover:text-white transition-colors">{t("nav.about")}</Link>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
            {t("footer.copy")}
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
