import { Link } from "react-router";
import { ArrowRight, Clock, UserX, BarChart3, DollarSign, Bot, Workflow, AppWindow, PieChart, Zap, Search, Wrench, Rocket, Check, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useTranslation } from "react-i18next";
import { LeadMagnet } from "./LeadMagnet";

function SectionAnchor({ id }: { id: string }) {
  return <div id={id} className="scroll-mt-20" />;
}

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-violet-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white">
                TailorAI — <br />
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {t("hero.headline")}
                </span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                {t("hero.subheadline")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/consultation">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0 rounded-full px-8 gap-2" data-testid="hero-cta-primary">
                    {t("hero.ctaPrimary")} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button size="lg" variant="outline" className="rounded-full px-8" data-testid="hero-cta-secondary">
                    {t("hero.ctaSecondary")}
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-400 dark:text-slate-500 pt-2">
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-blue-500" /> {t("hero.trust1")}</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-violet-500" /> {t("hero.trust2")}</span>
                <span className="flex items-center gap-1.5"><Rocket className="w-3.5 h-3.5 text-blue-500" /> {t("hero.trust3")}</span>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-[2rem] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-amber-400" /><div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <p className="text-slate-500">// Your business workflow</p>
                  <p className="text-blue-400">const <span className="text-white">solution</span> = await <span className="text-violet-400">TailorAI</span>.<span className="text-emerald-400">build</span>({`{`}</p>
                  <p className="text-slate-400 pl-6">business: <span className="text-amber-300">"your_company"</span>,</p>
                  <p className="text-slate-400 pl-6">goal: <span className="text-amber-300">"automate_operations"</span>,</p>
                  <p className="text-slate-400 pl-6">timeline: <span className="text-amber-300">"2-4 weeks"</span></p>
                  <p className="text-blue-400">{`}`});</p>
                  <p className="text-emerald-400 mt-4">// Result: 40% time saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t("problem.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, key: "problem.card1" },
              { icon: UserX, key: "problem.card2" },
              { icon: BarChart3, key: "problem.card3" },
              { icon: DollarSign, key: "problem.card4" },
            ].map((item) => (
              <Card key={item.key} className="p-6 text-center border-slate-100 dark:border-slate-800 dark:bg-slate-900/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{t(item.key)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">{t("solution.title")}</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">{t("solution.subtitle")}</p>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl px-6 py-4 shadow-md border border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{t("solution.input")}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl px-6 py-4 shadow-lg">
              <p className="text-sm font-medium text-white">TailorAI</p>
            </div>
            <ArrowRight className="w-6 h-6 text-violet-500 shrink-0" />
            <div className="bg-white dark:bg-slate-800 rounded-xl px-6 py-4 shadow-md border border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{t("solution.output")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE BUILD ──────────────────────────── */}
      <SectionAnchor id="what-we-build" />
      <section className="py-24 px-4 sm:px-6 lg:px-8" data-testid="what-we-build-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t("build.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Bot, titleKey: "build.card1Title", descKey: "build.card1Desc", color: "from-blue-500 to-blue-600" },
              { icon: Workflow, titleKey: "build.card2Title", descKey: "build.card2Desc", color: "from-violet-500 to-violet-600" },
              { icon: AppWindow, titleKey: "build.card3Title", descKey: "build.card3Desc", color: "from-indigo-500 to-indigo-600" },
              { icon: PieChart, titleKey: "build.card4Title", descKey: "build.card4Desc", color: "from-blue-600 to-violet-600" },
            ].map((item) => (
              <Card key={item.titleKey} className="p-7 border-slate-100 dark:border-slate-800 dark:bg-slate-900/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t(item.descKey)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ──────────────────────────────── */}
      <SectionAnchor id="use-cases" />
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/30" data-testid="use-cases-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t("useCases.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { titleKey: "useCases.case1Title", descKey: "useCases.case1Desc", gradient: "from-blue-500/10 to-violet-500/10 dark:from-blue-500/5 dark:to-violet-500/5" },
              { titleKey: "useCases.case2Title", descKey: "useCases.case2Desc", gradient: "from-violet-500/10 to-indigo-500/10 dark:from-violet-500/5 dark:to-indigo-500/5" },
              { titleKey: "useCases.case3Title", descKey: "useCases.case3Desc", gradient: "from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/5 dark:to-blue-500/5" },
            ].map((item) => (
              <Card key={item.titleKey} className={`p-8 bg-gradient-to-br ${item.gradient} border-0 hover:shadow-lg transition-all duration-300`}>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{t(item.titleKey)}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t(item.descKey)}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-10">{t("useCases.footer")}</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <SectionAnchor id="how-it-works" />
      <section className="py-24 px-4 sm:px-6 lg:px-8" data-testid="how-it-works-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t("howItWorks.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-0">
            {[
              { icon: Search, num: "01", titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc" },
              { icon: Wrench, num: "02", titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc" },
              { icon: Rocket, num: "03", titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc" },
            ].map((step, i) => (
              <div key={step.num} className="relative text-center px-8 py-10">
                {i < 2 && <div className="hidden md:block absolute top-1/3 right-0 w-px h-16 bg-gradient-to-b from-blue-200 to-violet-200 dark:from-blue-800 dark:to-violet-800" />}
                <div className="text-xs font-bold text-blue-500 mb-4 tracking-widest">{t("howItWorks.stepLabel")} {step.num}</div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/30" data-testid="pricing-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t("pricing.title")}</h2>
            <p className="text-slate-500 dark:text-slate-400">{t("pricing.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="p-8 border-slate-200 dark:border-slate-700 dark:bg-slate-900/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("pricing.starterTitle")}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">{t("pricing.starterDesc")}</p>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{t("pricing.starterPrice")}</div>
              <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-300">
                {["pricing.starterF1", "pricing.starterF2", "pricing.starterF3"].map((k) => (
                  <li key={k} className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500 shrink-0" />{t(k)}</li>
                ))}
              </ul>
              <Link to="/consultation"><Button variant="outline" className="w-full rounded-full">{t("pricing.cta")}</Button></Link>
            </Card>

            {/* Growth - highlighted */}
            <Card className="p-8 border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-slate-900 relative shadow-xl shadow-blue-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full">{t("pricing.popular")}</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("pricing.growthTitle")}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">{t("pricing.growthDesc")}</p>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{t("pricing.growthPrice")}</div>
              <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-300">
                {["pricing.growthF1", "pricing.growthF2", "pricing.growthF3", "pricing.growthF4"].map((k) => (
                  <li key={k} className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500 shrink-0" />{t(k)}</li>
                ))}
              </ul>
              <Link to="/consultation"><Button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0">{t("pricing.cta")}</Button></Link>
            </Card>

            {/* Custom */}
            <Card className="p-8 border-slate-200 dark:border-slate-700 dark:bg-slate-900/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("pricing.customTitle")}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">{t("pricing.customDesc")}</p>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{t("pricing.customPrice")}</div>
              <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-300">
                {["pricing.customF1", "pricing.customF2", "pricing.customF3", "pricing.customF4"].map((k) => (
                  <li key={k} className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-500 shrink-0" />{t(k)}</li>
                ))}
              </ul>
              <Link to="/contact"><Button variant="outline" className="w-full rounded-full">{t("pricing.ctaCustom")}</Button></Link>
            </Card>
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATOR ─────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{t("diff.title")}</h2>
          <p className="text-lg text-slate-400 mb-10">{t("diff.subtitle")}</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {["diff.point1", "diff.point2", "diff.point3"].map((k) => (
              <div key={k} className="flex items-start gap-3 text-left">
                <Check className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-slate-300 text-sm">{t(k)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEAD MAGNET ────────────────────────────── */}
      <LeadMagnet />

      {/* ── FINAL CTA ──────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-14 text-white">
            <h2 className="text-4xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-lg mx-auto">{t("cta.subtitle")}</p>
            <Link to="/consultation">
              <Button size="lg" variant="secondary" className="rounded-full px-10 gap-2 font-semibold" data-testid="final-cta-btn">
                {t("cta.button")} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
