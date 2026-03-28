import { useState } from "react";
import { Download, Loader2, CheckCircle, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useTranslation } from "react-i18next";

const API_BASE = "/api";

export function LeadMagnet() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: i18n.language }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(t("leadMagnet.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const guideSteps = [
    t("leadMagnet.step1"),
    t("leadMagnet.step2"),
    t("leadMagnet.step3"),
    t("leadMagnet.step4"),
    t("leadMagnet.step5"),
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="lead-magnet-section">
      <div className="max-w-5xl mx-auto">
        <Card className="p-0 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left - Guide Info */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-xs uppercase tracking-widest text-blue-300 font-semibold">{t("leadMagnet.badge")}</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">{t("leadMagnet.title")}</h3>
              <p className="text-slate-300 mb-6 text-sm leading-relaxed">{t("leadMagnet.subtitle")}</p>
              <ul className="space-y-3">
                {guideSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold">{i + 1}</span>
                    <span className="text-slate-200">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Form */}
            <div className="p-10 flex items-center">
              {submitted ? (
                <div className="text-center w-full" data-testid="lead-magnet-success">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-xl text-slate-900 mb-2">{t("leadMagnet.successTitle")}</h4>
                  <p className="text-slate-600 text-sm mb-6">{t("leadMagnet.successMessage")}</p>
                  <Button variant="outline" className="gap-2" data-testid="lead-magnet-download-btn">
                    <Download className="w-4 h-4" />
                    {t("leadMagnet.downloadBtn")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full space-y-5" data-testid="lead-magnet-form">
                  <h4 className="text-lg font-medium text-slate-900 mb-1">{t("leadMagnet.formTitle")}</h4>
                  <p className="text-sm text-slate-500 mb-4">{t("leadMagnet.formSubtitle")}</p>
                  <div>
                    <Label htmlFor="lm-name">{t("leadMagnet.nameLabel")}</Label>
                    <Input
                      id="lm-name"
                      data-testid="lead-magnet-name-input"
                      placeholder={t("leadMagnet.namePlaceholder")}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lm-email">{t("leadMagnet.emailLabel")}</Label>
                    <Input
                      id="lm-email"
                      type="email"
                      data-testid="lead-magnet-email-input"
                      placeholder={t("leadMagnet.emailPlaceholder")}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lm-company">{t("leadMagnet.companyLabel")}</Label>
                    <Input
                      id="lm-company"
                      data-testid="lead-magnet-company-input"
                      placeholder={t("leadMagnet.companyPlaceholder")}
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting} data-testid="lead-magnet-submit-btn">
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />{t("leadMagnet.sending")}</>
                    ) : (
                      <><Download className="w-4 h-4" />{t("leadMagnet.submitBtn")}</>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
