import { useState, useRef } from "react";
import { ExternalLink, Play, Clock, DollarSign, Target, Sparkles, Trophy, Users, GraduationCap, HeartPulse, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";

interface CaseData {
  title: string;
  challenge: string;
  solution: string;
  image: string;
  video?: string;
  technologies: string[];
  icon: any;
  liveLink: string;
}

function CaseMediaCard({ item, index }: { item: CaseData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play().catch(() => {}); }
  };
  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      onClick={() => window.open(item.liveLink, "_blank")} data-testid={`case-media-${index}`}>
      <ImageWithFallback src={item.image} alt={item.title}
        className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${hovered ? "scale-110" : "scale-100"}`} />
      {item.video && (
        <video ref={videoRef} src={item.video} muted loop playsInline preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />
      )}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(180deg, transparent 0%, transparent 45%, rgba(59,130,246,0.08) 50%, transparent 55%, transparent 100%)", backgroundSize: "100% 200%", animation: hovered ? "scanline 2s linear infinite" : "none" }} />
      <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(to top, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.1) 40%, transparent 100%)" }} />
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 px-5 py-3 transition-all duration-500 ${hovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        <span className="text-white text-sm font-medium drop-shadow-lg">{item.challenge}</span>
      </div>
      <div className={`absolute top-4 left-4 transition-transform duration-300 ${hovered ? "scale-90 opacity-80" : "scale-100 opacity-100"}`}>
        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-lg flex items-center justify-center">
          <item.icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

export function UseCases() {
  const { t } = useTranslation();

  const cases: CaseData[] = [
    {
      title: t("cases.aiCommute.title"), challenge: t("cases.aiCommute.challenge"), solution: t("cases.aiCommute.solution"),
      image: "https://images.unsplash.com/photo-1581715732770-c966271e462a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdXRlJTIwbW9ybmluZyUyMGNvZmZlZSUyMG5ld3N8ZW58MXx8fHwxNzcxODU3NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["AI/NLP", "React", "Text Synthesis", "Audio"], icon: Clock,
      liveLink: "https://ai-commute-summarizer-820940536854.us-west1.run.app/",
    },
    {
      title: t("cases.budgetFlow.title"), challenge: t("cases.budgetFlow.challenge"), solution: t("cases.budgetFlow.solution"),
      image: "https://images.unsplash.com/photo-1765868017186-18a3fc4c2942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRnZXQlMjBmaW5hbmNlJTIwbW9uZXklMjB0cmFja2luZ3xlbnwxfHx8fDE3NzE4NTc2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "D3.js", "AI Analytics", "i18n"], icon: DollarSign,
      liveLink: "https://moneyminder-76.emergent.host/",
    },
    {
      title: t("cases.hearthbeat.title"), challenge: t("cases.hearthbeat.challenge"), solution: t("cases.hearthbeat.solution"),
      image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxibG9vZCUyMHByZXNzdXJlJTIwbW9uaXRvciUyMGhlYWx0aCUyMHRyYWNraW5nJTIwbWVkaWNhbCUyMGRldmljZXxlbnwwfHx8fDE3NzUxMzA5NTh8MA&ixlib=rb-4.1.0&q=85",
      technologies: ["React", "Health Data", "Charts & Trends", "Family Profiles", "Medical Reports"], icon: HeartPulse,
      liveLink: "https://hearthbeat-family-hub.netlify.app",
    },
    {
      title: t("cases.agileTracker.title"), challenge: t("cases.agileTracker.challenge"), solution: t("cases.agileTracker.solution"),
      image: "https://images.unsplash.com/photo-1676276374429-3902f2666824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ2lsZSUyMHRlYW0lMjBjb2xsYWJvcmF0aW9uJTIwc3ByaW50fGVufDF8fHx8MTc3MTg1NzY1NXww&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "Node.js", "WebSocket", "Agile Metrics"], icon: Target,
      liveLink: "https://ready-set-track.lovable.app",
    },
    {
      title: t("cases.vibeForge.title"), challenge: t("cases.vibeForge.challenge"), solution: t("cases.vibeForge.solution"),
      image: "https://images.unsplash.com/photo-1763568258338-94886e7533ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwZGV2ZWxvcG1lbnQlMjBzdHVkaW8lMjBzY3JlZW58ZW58MXx8fHwxNzcxODU3NjU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["AI Codegen", "React", "Node.js", "Code Export"], icon: Sparkles,
      liveLink: "https://smooth-build-studio.lovable.app",
    },
    {
      title: t("cases.footballStats.title"), challenge: t("cases.footballStats.challenge"), solution: t("cases.footballStats.solution"),
      image: "https://images.unsplash.com/photo-1549923015-badf41b04831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHNvY2NlciUyMHN0YWRpdW0lMjBtYXRjaHxlbnwxfHx8fDE3NzE4NTc2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "Sports API", "ML Analytics", "Real-time Data"], icon: Trophy,
      liveLink: "https://fantasy-pitch-pulse.lovable.app",
    },
    {
      title: t("cases.thursdayFootball.title"), challenge: t("cases.thursdayFootball.challenge"), solution: t("cases.thursdayFootball.solution"),
      image: "https://images.unsplash.com/photo-1645976443265-b707c8f87203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwcGxheWluZyUyMHNvY2NlciUyMGZvb3RiYWxsJTIwY2FzdWFsJTIwZ2FtZXxlbnwxfHx8fDE3NzI1MzUyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "Team Management", "Social", "Match Scheduling"], icon: Users,
      liveLink: "https://thursdayfootball.netlify.app",
    },
    {
      title: t("cases.footballAcademy.title"), challenge: t("cases.footballAcademy.challenge"), solution: t("cases.footballAcademy.solution"),
      image: "https://images.unsplash.com/photo-1606470542032-a9caa0be6e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGZvb3RiYWxsJTIwYWNhZGVteSUyMHRyYWluaW5nJTIwY2hpbGRyZW4lMjBjb2FjaHxlbnwxfHx8fDE3NzM0ODg2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "SaaS", "Payment Integration", "CRM", "Scheduling"], icon: GraduationCap,
      liveLink: "https://football-academy-mvp.emergent.host/login",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <style>{`@keyframes scanline { 0% { background-position: 0% 0%; } 100% { background-position: 0% 100%; } }`}</style>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">{t("cases.badge")}</div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">{t("cases.title")}</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">{t("cases.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-14">
          {cases.map((item, index) => (
            <Card key={item.title} className="overflow-hidden hover:shadow-xl transition-all duration-300 dark:bg-slate-800/50 dark:border-slate-700" data-testid={`case-card-${index}`}>
              <CaseMediaCard item={item} index={index} />
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{item.challenge}</p>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.solution}</p>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                </div>
                <div className="flex gap-4 pt-2">
                  <Button className="gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0"
                    onClick={() => window.open(item.liveLink, "_blank")} data-testid={`case-view-btn-${index}`}>
                    <ExternalLink className="w-4 h-4" />{t("cases.viewDemo")}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-20">
          <Card className="p-12 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 border-blue-200 dark:border-blue-800">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">{t("cases.summaryTitle")}</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {[
                { icon: Target, titleKey: "cases.sum1Title", descKey: "cases.sum1Desc", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
                { icon: Trophy, titleKey: "cases.sum2Title", descKey: "cases.sum2Desc", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400" },
                { icon: Sparkles, titleKey: "cases.sum3Title", descKey: "cases.sum3Desc", color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" },
              ].map((s) => (
                <div key={s.titleKey} className="text-center">
                  <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center mx-auto mb-3`}><s.icon className="w-6 h-6" /></div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t(s.titleKey)}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{t(s.descKey)}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-lg text-slate-700 dark:text-slate-300">
              {t("cases.conclusion")} <strong className="text-slate-900 dark:text-white">{t("cases.conclusionBold")}</strong>
            </p>
            <div className="text-center mt-8">
              <Link to="/consultation">
                <Button className="gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0 px-8" data-testid="cases-cta-btn">
                  {t("cases.ctaButton")} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
