import { Link } from "react-router";
import { ArrowRight, Code, Palette, Zap, Brain, TrendingUp, Users, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: t("home.feature1Title"),
      description: t("home.feature1Desc"),
    },
    {
      icon: TrendingUp,
      title: t("home.feature2Title"),
      description: t("home.feature2Desc"),
    },
    {
      icon: Users,
      title: t("home.feature3Title"),
      description: t("home.feature3Desc"),
    },
    {
      icon: Sparkles,
      title: t("home.feature4Title"),
      description: t("home.feature4Desc"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm">
                {t("home.badge")}
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl text-slate-900">
                {t("home.title")}{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("home.titleHighlight")}
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                {t("home.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/ai-app">
                  <Button size="lg" className="gap-2">
                    {t("home.ctaExplore")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button size="lg" variant="outline">
                    {t("home.ctaProjects")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1759884247199-eceeff174430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBjb2RpbmclMjBsYXB0b3B8ZW58MXx8fHwxNzcxODU3MjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern workspace"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-slate-900 mb-4">{t("home.featuresTitle")}</h2>
            <p className="text-xl text-slate-600">
              {t("home.featuresSubtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl mb-4">{t("home.ctaTitle")}</h2>
            <p className="text-xl mb-8 text-blue-50">
              {t("home.ctaSubtitle")}
            </p>
            <Link to="/about">
              <Button size="lg" variant="secondary" className="gap-2">
                {t("home.ctaButton")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}