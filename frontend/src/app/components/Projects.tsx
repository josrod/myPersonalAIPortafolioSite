import { useState, useRef } from "react";
import { ExternalLink, Play, Clock, DollarSign, Target, Sparkles, Trophy, Home, Users, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";

interface ProjectData {
  title: string;
  tagline: string;
  description: string;
  image: string;
  video?: string;
  technologies: string[];
  icon: any;
  liveLink: string;
}

function ProjectMediaCard({ project, index }: { project: ProjectData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };
  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.open(project.liveLink, "_blank")}
      data-testid={`project-media-${index}`}
    >
      {/* Static Image */}
      <ImageWithFallback
        src={project.image}
        alt={project.title}
        className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${hovered ? "scale-110" : "scale-100"}`}
      />

      {/* Video layer (if video URL provided) */}
      {project.video && (
        <video
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* Animated scan line on hover */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        style={{
          background: "linear-gradient(180deg, transparent 0%, transparent 45%, rgba(59,130,246,0.08) 50%, transparent 55%, transparent 100%)",
          backgroundSize: "100% 200%",
          animation: hovered ? "scanline 2s linear infinite" : "none",
        }}
      />

      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(to top, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.1) 40%, transparent 100%)" }}
      />

      {/* Play indicator on hover */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
        </div>
      </div>

      {/* Bottom label on hover */}
      <div className={`absolute bottom-0 left-0 right-0 px-5 py-3 transition-all duration-500 ${hovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        <span className="text-white text-sm font-medium drop-shadow-lg">{project.tagline}</span>
      </div>

      {/* Icon badge */}
      <div className={`absolute top-4 left-4 transition-transform duration-300 ${hovered ? "scale-90 opacity-80" : "scale-100 opacity-100"}`}>
        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-lg flex items-center justify-center">
          <project.icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const { t } = useTranslation();

  const projects: ProjectData[] = [
    {
      title: t("projects.aiCommute.title"),
      tagline: t("projects.aiCommute.tagline"),
      description: t("projects.aiCommute.description"),
      image: "https://images.unsplash.com/photo-1581715732770-c966271e462a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdXRlJTIwbW9ybmluZyUyMGNvZmZlZSUyMG5ld3N8ZW58MXx8fHwxNzcxODU3NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["AI/NLP", "React", "Text Synthesis", "Audio"],
      icon: Clock,
      liveLink: "https://ai-commute-summarizer-820940536854.us-west1.run.app/",
    },
    {
      title: t("projects.budgetFlow.title"),
      tagline: t("projects.budgetFlow.tagline"),
      description: t("projects.budgetFlow.description"),
      image: "https://images.unsplash.com/photo-1765868017186-18a3fc4c2942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRnZXQlMjBmaW5hbmNlJTIwbW9uZXklMjB0cmFja2luZ3xlbnwxfHx8fDE3NzE4NTc2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "D3.js", "AI Analytics", "i18n"],
      icon: DollarSign,
      liveLink: "https://moneyminder-76.emergent.host/",
    },
    {
      title: t("projects.agileTracker.title"),
      tagline: t("projects.agileTracker.tagline"),
      description: t("projects.agileTracker.description"),
      image: "https://images.unsplash.com/photo-1676276374429-3902f2666824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ2lsZSUyMHRlYW0lMjBjb2xsYWJvcmF0aW9uJTIwc3ByaW50fGVufDF8fHx8MTc3MTg1NzY1NXww&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "Node.js", "WebSocket", "Agile Metrics"],
      icon: Target,
      liveLink: "https://ready-set-track.lovable.app",
    },
    {
      title: t("projects.vibeForge.title"),
      tagline: t("projects.vibeForge.tagline"),
      description: t("projects.vibeForge.description"),
      image: "https://images.unsplash.com/photo-1763568258338-94886e7533ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwZGV2ZWxvcG1lbnQlMjBzdHVkaW8lMjBzY3JlZW58ZW58MXx8fHwxNzcxODU3NjU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["AI Codegen", "React", "Node.js", "Code Export"],
      icon: Sparkles,
      liveLink: "https://smooth-build-studio.lovable.app",
    },
    {
      title: t("projects.footballStats.title"),
      tagline: t("projects.footballStats.tagline"),
      description: t("projects.footballStats.description"),
      image: "https://images.unsplash.com/photo-1549923015-badf41b04831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHNvY2NlciUyMHN0YWRpdW0lMjBtYXRjaHxlbnwxfHx8fDE3NzE4NTc2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "Sports API", "ML Analytics", "Real-time Data"],
      icon: Trophy,
      liveLink: "https://fantasy-pitch-pulse.lovable.app",
    },
    {
      title: t("projects.thursdayFootball.title"),
      tagline: t("projects.thursdayFootball.tagline"),
      description: t("projects.thursdayFootball.description"),
      image: "https://images.unsplash.com/photo-1645976443265-b707c8f87203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwcGxheWluZyUyMHNvY2NlciUyMGZvb3RiYWxsJTIwY2FzdWFsJTIwZ2FtZXxlbnwxfHx8fDE3NzI1MzUyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "Team Management", "Social", "Match Scheduling"],
      icon: Users,
      liveLink: "https://thursdayfootball.netlify.app",
    },
    {
      title: t("projects.footballAcademy.title"),
      tagline: t("projects.footballAcademy.tagline"),
      description: t("projects.footballAcademy.description"),
      image: "https://images.unsplash.com/photo-1606470542032-a9caa0be6e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGZvb3RiYWxsJTIwYWNhZGVteSUyMHRyYWluaW5nJTIwY2hpbGRyZW4lMjBjb2FjaHxlbnwxfHx8fDE3NzM0ODg2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "SaaS", "Payment Integration", "CRM", "Scheduling"],
      icon: GraduationCap,
      liveLink: "https://football-academy-mvp.emergent.host/login",
    },
    {
      title: t("projects.hearthbeat.title"),
      tagline: t("projects.hearthbeat.tagline"),
      description: t("projects.hearthbeat.description"),
      image: "https://images.unsplash.com/photo-1758687126783-ea42f92dad72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBob21lJTIwdG9nZXRoZXIlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MTg1NzY1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["React", "Calendar API", "AI Recommendations", "Family Sync"],
      icon: Home,
      liveLink: "https://hearthbeat-family-hub.netlify.app",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      {/* Scan line animation */}
      <style>{`
        @keyframes scanline {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl text-slate-900 dark:text-white mb-4">{t("projects.title")}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">{t("projects.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 dark:bg-slate-800/50 dark:border-slate-700" data-testid={`project-card-${index}`}>
              <ProjectMediaCard project={project} index={index} />
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl text-slate-900 dark:text-white mb-1">{project.title}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{project.tagline}</p>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary">{tech}</Badge>
                  ))}
                </div>
                <div className="flex gap-4 pt-4">
                  <Button className="gap-2" onClick={() => window.open(project.liveLink, "_blank")} data-testid={`project-view-btn-${index}`}>
                    <ExternalLink className="w-4 h-4" />
                    {t("projects.viewProject")}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <Card className="p-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
            <h2 className="text-3xl text-slate-900 dark:text-white mb-6 text-center">{t("projects.narrativeTitle")}</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl text-slate-900 dark:text-white mb-2">{t("projects.narrative1Title")}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t("projects.narrative1Desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl text-slate-900 dark:text-white mb-2">{t("projects.narrative2Title")}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t("projects.narrative2Desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl text-slate-900 dark:text-white mb-2">{t("projects.narrative3Title")}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t("projects.narrative3Desc")}</p>
              </div>
            </div>
            <p className="text-center text-lg text-slate-700 dark:text-slate-300">
              {t("projects.narrativeConclusion")} <strong>{t("projects.narrativeBold")}</strong>
              {t("projects.narrativeEnd")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
