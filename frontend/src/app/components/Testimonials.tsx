import { useRef, useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { Card } from "./ui/card";
import { useTranslation } from "react-i18next";

const testimonials = [
  {
    nameKey: "testimonials.t1Name",
    roleKey: "testimonials.t1Role",
    textKey: "testimonials.t1Text",
    rating: 5,
    avatar: "MC",
  },
  {
    nameKey: "testimonials.t2Name",
    roleKey: "testimonials.t2Role",
    textKey: "testimonials.t2Text",
    rating: 5,
    avatar: "SR",
  },
  {
    nameKey: "testimonials.t3Name",
    roleKey: "testimonials.t3Role",
    textKey: "testimonials.t3Text",
    rating: 5,
    avatar: "LW",
  },
  {
    nameKey: "testimonials.t4Name",
    roleKey: "testimonials.t4Role",
    textKey: "testimonials.t4Text",
    rating: 5,
    avatar: "AK",
  },
];

export function Testimonials() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean[]>(new Array(testimonials.length).fill(false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = refs.current.indexOf(entry.target as HTMLDivElement);
          if (idx !== -1 && entry.isIntersecting) {
            setVisible((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-slate-900 dark:text-white mb-4">{t("testimonials.title")}</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">{t("testimonials.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              ref={(el) => { refs.current[index] = el; }}
              className="transition-all duration-700 ease-out"
              style={{
                opacity: visible[index] ? 1 : 0,
                transform: visible[index] ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <Card className="p-8 h-full relative overflow-hidden group hover:shadow-xl transition-shadow duration-300 dark:bg-slate-800/50 dark:border-slate-700">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-16 h-16 text-blue-600" />
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 relative z-10">
                  "{t(item.textKey)}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{t(item.nameKey)}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{t(item.roleKey)}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
