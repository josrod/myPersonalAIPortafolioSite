import { useState } from "react";
import { Send, Loader2, CheckCircle, Mail, Clock, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useTranslation } from "react-i18next";

const API_BASE = "/api";

export function Contact() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: i18n.language }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(t("contact.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" data-testid="contact-page">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl text-slate-900 mb-4" data-testid="contact-success-title">{t("contact.successTitle")}</h2>
          <p className="text-lg text-slate-600">{t("contact.successMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" data-testid="contact-page">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl text-slate-900 mb-4">{t("contact.title")}</h1>
          <p className="text-xl text-slate-600">{t("contact.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">{t("contact.nameLabel")}</Label>
                    <Input
                      id="name"
                      data-testid="contact-name-input"
                      placeholder={t("contact.namePlaceholder")}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("contact.emailLabel")}</Label>
                    <Input
                      id="email"
                      type="email"
                      data-testid="contact-email-input"
                      placeholder={t("contact.emailPlaceholder")}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="company">{t("contact.companyLabel")}</Label>
                    <Input
                      id="company"
                      data-testid="contact-company-input"
                      placeholder={t("contact.companyPlaceholder")}
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">{t("contact.subjectLabel")}</Label>
                    <Input
                      id="subject"
                      data-testid="contact-subject-input"
                      placeholder={t("contact.subjectPlaceholder")}
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">{t("contact.messageLabel")}</Label>
                  <Textarea
                    id="message"
                    data-testid="contact-message-input"
                    placeholder={t("contact.messagePlaceholder")}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                {error && <p className="text-red-600 text-sm" data-testid="contact-error">{error}</p>}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                  data-testid="contact-submit-btn"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />{t("contact.sending")}</>
                  ) : (
                    <><Send className="w-5 h-5" />{t("contact.submit")}</>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg text-slate-900">{t("contact.infoTitle")}</h3>
              </div>
              <p className="text-slate-600 mb-4">{t("contact.infoDesc")}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{t("contact.responseTime")}</span>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6" />
                <h3 className="text-lg">{t("contact.chatCta")}</h3>
              </div>
              <p className="text-blue-50 mb-4 text-sm">{t("contact.chatCtaButton")}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
