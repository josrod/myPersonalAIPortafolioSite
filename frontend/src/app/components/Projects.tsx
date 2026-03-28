import { ExternalLink, Clock, DollarSign, Target, Sparkles, Trophy, Home, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";

export function Projects() {
  const { t } = useTranslation();

  const projects = [
    {
      title: t("projects.aiCommute.title"),
      tagline: t("projects.aiCommute.tagline"),
      description: t("projects.aiCommute.description"),
      image:
        "https://images.unsplash.com/photo-1581715732770-c966271e462a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdXRlJTIwbW9ybmluZyUyMGNvZmZlZSUyMG5ld3N8ZW58MXx8fHwxNzcxODU3NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      technologies: ["AI/NLP", "React", "Text Synthesis", "Audio"],
      icon: Clock,
      liveLink: "https://ai-commute-summarizer-820940536854.us-west1.run.app/",
    },
    {
      title: t("projects.budgetFlow.title"),
      tagline: t("projects.budgetFlow.tagline"),
      description: t("projects.budgetFlow.description"),
      image:
        "https://images.unsplash.com/photo-1765868017186-18a3fc4c2942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRnZXQlMjBmaW5hbmNlJTIwbW9uZXklMjB0cmFja2luZ3xlbnwxfHx8fDE3NzE4NTc2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      technologies: ["React", "D3.js", "AI Analytics", "i18n"],
      icon: DollarSign,
      liveLink: "https://moneyminder-76.emergent.host/",
    },
    {
      title: t("projects.agileTracker.title"),
      tagline: t("projects.agileTracker.tagline"),
      description: t("projects.agileTracker.description"),
      image:
        "https://images.unsplash.com/photo-1676276374429-3902f2666824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ2lsZSUyMHRlYW0lMjBjb2xsYWJvcmF0aW9uJTIwc3ByaW50fGVufDF8fHx8MTc3MTg1NzY1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      technologies: ["React", "Node.js", "WebSocket", "Agile Metrics"],
      icon: Target,
      liveLink: "https://ready-set-track.lovable.app",
    },
    {
      title: t("projects.vibeForge.title"),
      tagline: t("projects.vibeForge.tagline"),
      description: t("projects.vibeForge.description"),
      image:
        "https://images.unsplash.com/photo-1763568258338-94886e7533ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwZGV2ZWxvcG1lbnQlMjBzdHVkaW8lMjBzY3JlZW58ZW58MXx8fHwxNzcxODU3NjU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      technologies: ["AI Codegen", "React", "Node.js", "Code Export"],
      icon: Sparkles,
      liveLink: "https://smooth-build-studio.lovable.app",
    },
    {
      title: t("projects.footballStats.title"),
      tagline: t("projects.footballStats.tagline"),
      description: t("projects.footballStats.description"),
      image:
        "https://images.unsplash.com/photo-1549923015-badf41b04831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHNvY2NlciUyMHN0YWRpdW0lMjBtYXRjaHxlbnwxfHx8fDE3NzE4NTc2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      technologies: ["React", "Sports API", "ML Analytics", "Real-time Data"],
      icon: Trophy,
      liveLink: "https://fantasy-pitch-pulse.lovable.app",
    },
    {
      title: t("projects.thursdayFootball.title"),
      tagline: t("projects.thursdayFootball.tagline"),
      description: t("projects.thursdayFootball.description"),
      image:
        "https://images.unsplash.com/photo-1645976443265-b707c8f87203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwcGxheWluZyUyMHNvY2NlciUyMGZvb3RiYWxsJTIwY2FzdWFsJTIwZ2FtZXxlbnwxfHx8fDE3NzI1MzUyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      technologies: ["React", "Team Management", "Social", "Match Scheduling"],
      icon: Users,
      liveLink: "https://thursdayfootball.netlify.app",
    },
    {
      title: t("projects.hearthbeat.title"),
      tagline: t("projects.hearthbeat.tagline"),
      description: t("projects.hearthbeat.description"),
      image:
        "https://images.unsplash.com/photo-1758687126783-ea42f92dad72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBob21lJTIwdG9nZXRoZXIlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MTg1NzY1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      technologies: ["React", "Calendar API", "AI Recommendations", "Family Sync"],
      icon: Home,
      liveLink: "https://hearthbeat-family-hub.netlify.app",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl text-slate-900 dark:text-white mb-4">{t("projects.title")}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            {t("projects.subtitle")}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <project.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl text-slate-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-blue-600">{project.tagline}</p>
                </div>
                <p className="text-slate-600">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4 pt-4">
                  <Button 
                    className="gap-2"
                    onClick={() => window.open(project.liveLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t("projects.viewProject")}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Portfolio Narrative */}
        <div className="mt-20">
          <Card className="p-12 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <h2 className="text-3xl text-slate-900 mb-6 text-center">
              {t("projects.narrativeTitle")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl text-slate-900 mb-2">{t("projects.narrative1Title")}</h3>
                <p className="text-slate-600">
                  {t("projects.narrative1Desc")}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl text-slate-900 mb-2">{t("projects.narrative2Title")}</h3>
                <p className="text-slate-600">
                  {t("projects.narrative2Desc")}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl text-slate-900 mb-2">{t("projects.narrative3Title")}</h3>
                <p className="text-slate-600">
                  {t("projects.narrative3Desc")}
                </p>
              </div>
            </div>
            <p className="text-center text-lg text-slate-700">
              {t("projects.narrativeConclusion")} <strong>{t("projects.narrativeBold")}</strong>
              {t("projects.narrativeEnd")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}