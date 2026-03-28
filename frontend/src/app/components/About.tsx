import { Award, BookOpen, Coffee, Heart, Brain, Zap, TrendingUp, Code, Server, Monitor } from "lucide-react";
import { Card } from "./ui/card";
const profileImage = "/src/assets/d449f75dc33297607a801b0a02400c567f97ffb4.png";
import { useTranslation } from "react-i18next";

export function About() {
  const { t } = useTranslation();

  const skills = [
    "AI & Machine Learning",
    "React & TypeScript",
    "Node.js & Python",
    "Data Visualization",
    "Financial Analytics",
    "Sports Analytics",
    "Agile Development",
    "Intelligent Automation",
  ];

  const stats = [
    { icon: Brain, label: t("about.stat1Label"), value: "7+" },
    { icon: Code, label: t("about.stat2Label"), value: "25+" },
    { icon: TrendingUp, label: t("about.stat3Label"), value: "1M+" },
    { icon: Zap, label: t("about.stat4Label"), value: "40%" },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl text-slate-900 mb-4">{t("about.title")}</h1>
          <p className="text-xl text-slate-600">
            {t("about.subtitle")}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <div className="relative">
              {/* Tech-themed decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-3xl opacity-20"></div>
              
              {/* Main profile container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Profile image */}
                <img
                  src={profileImage}
                  alt="Professional Developer in Server Room"
                  className="w-full h-auto relative z-10"
                />
                
                {/* Subtle tech overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 z-20"></div>
                
                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-bl-full z-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-tr-full z-20"></div>
              </div>
              
              {/* Tech badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-xl z-30">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  <span className="font-semibold">AI Developer</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl text-slate-900">{t("about.visionTitle")}</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t("about.vision1")}
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t("about.vision2")}
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t("about.vision3")} <strong>{t("about.vision3Bold")}</strong>
              {t("about.vision3End")}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl text-slate-900 mb-2">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-3xl p-12 mb-12">
          <h2 className="text-3xl text-slate-900 mb-8 text-center">{t("about.skillsTitle")}</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-slate-900 rounded-full border border-blue-100 hover:shadow-md transition-shadow"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl text-slate-900 mb-3">{t("about.value1Title")}</h3>
            <p className="text-slate-600">
              {t("about.value1Desc")}
            </p>
          </Card>
          <Card className="p-8">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl text-slate-900 mb-3">{t("about.value2Title")}</h3>
            <p className="text-slate-600">
              {t("about.value2Desc")}
            </p>
          </Card>
          <Card className="p-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl text-slate-900 mb-3">{t("about.value3Title")}</h3>
            <p className="text-slate-600">
              {t("about.value3Desc")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}