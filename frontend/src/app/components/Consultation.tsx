import { useState, useEffect } from "react";
import { Calendar, Loader2, CheckCircle, Clock, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslation } from "react-i18next";

const API_BASE = "/api";

function TimeSlotsDisplay({ date, isLoading, slots, selectedTime, onSelect, t }: {
  date: string; isLoading: boolean; slots: string[]; selectedTime: string;
  onSelect: (slot: string) => void; t: (key: string) => string;
}) {
  if (!date) return <p className="text-sm text-slate-500 mt-2">{t("consultation.selectDate")}</p>;
  if (isLoading) return <div className="flex items-center gap-2 mt-2 text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /></div>;
  if (slots.length === 0) return <p className="text-sm text-red-500 mt-2">{t("consultation.noSlots")}</p>;
  return (
    <div className="grid grid-cols-3 gap-2 mt-1">
      {slots.map((slot) => (
        <button key={slot} type="button" data-testid={`time-slot-${slot}`} onClick={() => onSelect(slot)}
          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
            selectedTime === slot ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
          }`}
        ><Clock className="w-3 h-3" />{slot}</button>
      ))}
    </div>
  );
}

export function Consultation() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", company: "", date: "", time: "", topic: "", notes: "" });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [error, setError] = useState("");

  const topics = [
    { value: "strategy", label: t("consultation.topics.strategy") },
    { value: "development", label: t("consultation.topics.development") },
    { value: "integration", label: t("consultation.topics.integration") },
    { value: "analytics", label: t("consultation.topics.analytics") },
    { value: "automation", label: t("consultation.topics.automation") },
    { value: "other", label: t("consultation.topics.other") },
  ];

  const selectedDate = form.date;

  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);
      fetch(`${API_BASE}/appointments/available?date=${selectedDate}`)
        .then((r) => r.json())
        .then((data) => setAvailableSlots(data.available_slots || []))
        .catch(() => setAvailableSlots([]))
        .finally(() => setIsLoading(false));
    }
  }, [selectedDate]);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: i18n.language }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed");
      }
      const result = await res.json();
      setAppointmentId(result.appointment_id);
      setBooked(true);
    } catch (err: any) {
      setError(err.message || t("consultation.errorMessage"));
    } finally {
      setIsBooking(false);
    }
  };

  if (booked) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" data-testid="consultation-page">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl text-slate-900 mb-4" data-testid="consultation-success-title">{t("consultation.successTitle")}</h2>
          <p className="text-lg text-slate-600 mb-2">{t("consultation.successMessage")}</p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{form.date} - {form.time}</span>
          </div>
          {appointmentId && (
            <div className="mt-4">
              <a href={`${API_BASE}/appointments/${appointmentId}/calendar`} download>
                <Button variant="outline" className="gap-2" data-testid="consultation-download-ics">
                  <Download className="w-4 h-4" />
                  {t("consultation.addToCalendar")}
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" data-testid="consultation-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl text-slate-900 dark:text-white mb-4">{t("consultation.title")}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">{t("consultation.subtitle")}</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="consultation-form">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cons-name">{t("consultation.nameLabel")}</Label>
                <Input
                  id="cons-name"
                  data-testid="consultation-name-input"
                  placeholder={t("consultation.namePlaceholder")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cons-email">{t("consultation.emailLabel")}</Label>
                <Input
                  id="cons-email"
                  type="email"
                  data-testid="consultation-email-input"
                  placeholder={t("consultation.emailPlaceholder")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cons-company">{t("consultation.companyLabel")}</Label>
                <Input
                  id="cons-company"
                  data-testid="consultation-company-input"
                  placeholder={t("consultation.companyPlaceholder")}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("consultation.topicLabel")}</Label>
                <Select value={form.topic} onValueChange={(v) => setForm({ ...form, topic: v })}>
                  <SelectTrigger data-testid="consultation-topic-select">
                    <SelectValue placeholder={t("consultation.topicPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cons-date">{t("consultation.dateLabel")}</Label>
                <Input
                  id="cons-date"
                  type="date"
                  data-testid="consultation-date-input"
                  min={getMinDate()}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value, time: "" })}
                  required
                />
              </div>
              <div>
                <Label>{t("consultation.timeLabel")}</Label>
                <TimeSlotsDisplay
                  date={form.date}
                  isLoading={isLoading}
                  slots={availableSlots}
                  selectedTime={form.time}
                  onSelect={(slot) => setForm({ ...form, time: slot })}
                  t={t}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cons-notes">{t("consultation.notesLabel")}</Label>
              <Textarea
                id="cons-notes"
                data-testid="consultation-notes-input"
                placeholder={t("consultation.notesPlaceholder")}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            {error && <p className="text-red-600 text-sm" data-testid="consultation-error">{error}</p>}

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={isBooking || !form.time || !form.topic}
              data-testid="consultation-submit-btn"
            >
              {isBooking ? (
                <><Loader2 className="w-5 h-5 animate-spin" />{t("consultation.booking")}</>
              ) : (
                <><Calendar className="w-5 h-5" />{t("consultation.submit")}</>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
