import { useState, useEffect } from "react";
import { Lock, Users, Calendar, Mail, MessageSquare, Download, LogOut, RefreshCw, X as XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useTranslation } from "react-i18next";

const API_BASE = "/api";

interface Stats {
  total_contacts: number;
  total_appointments: number;
  confirmed_appointments: number;
  total_leads: number;
  total_chat_messages: number;
}

interface AdminData {
  stats: Stats;
  recent_contacts: any[];
  recent_appointments: any[];
  recent_leads: any[];
}

export function AdminDashboard() {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "appointments" | "leads">("overview");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Invalid password");
      const result = await res.json();
      setToken(result.token);
    } catch {
      setLoginError("Invalid password");
    }
  };

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { "x-admin-token": token },
      });
      if (!res.ok) throw new Error("Failed");
      setData(await res.json());
    } catch {
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center" data-testid="admin-page">
        <Card className="p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl text-slate-900">Admin Dashboard</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your admin password</p>
          </div>
          <form onSubmit={login} className="space-y-4" data-testid="admin-login-form">
            <Input
              type="password"
              data-testid="admin-password-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && <p className="text-red-600 text-sm" data-testid="admin-login-error">{loginError}</p>}
            <Button type="submit" className="w-full" data-testid="admin-login-btn">Sign In</Button>
          </form>
        </Card>
      </div>
    );
  }

  const statCards = data ? [
    { label: "Contacts", value: data.stats.total_contacts, icon: Mail, color: "bg-blue-500" },
    { label: "Appointments", value: data.stats.total_appointments, icon: Calendar, color: "bg-emerald-500" },
    { label: "Leads", value: data.stats.total_leads, icon: Download, color: "bg-purple-500" },
    { label: "Chat Messages", value: data.stats.total_chat_messages, icon: MessageSquare, color: "bg-amber-500" },
  ] : [];

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "contacts" as const, label: "Contacts" },
    { id: "appointments" as const, label: "Appointments" },
    { id: "leads" as const, label: "Leads" },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl text-slate-900">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2" data-testid="admin-refresh-btn">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => setToken(null)} className="gap-2" data-testid="admin-logout-btn">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-testid={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === tab.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {data && (
          <Card className="p-0 overflow-hidden">
            {activeTab === "overview" && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[...data.recent_contacts.slice(0, 3).map((c: any) => ({ type: "contact", ...c })),
                    ...data.recent_appointments.slice(0, 3).map((a: any) => ({ type: "appointment", ...a })),
                    ...data.recent_leads.slice(0, 3).map((l: any) => ({ type: "lead", ...l })),
                  ]
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 8)
                    .map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <Badge variant={item.type === "contact" ? "default" : item.type === "appointment" ? "secondary" : "outline"}>
                            {item.type}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "contacts" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="admin-contacts-table">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-600">Name</th>
                      <th className="px-4 py-3 text-left text-slate-600">Email</th>
                      <th className="px-4 py-3 text-left text-slate-600">Subject</th>
                      <th className="px-4 py-3 text-left text-slate-600">Status</th>
                      <th className="px-4 py-3 text-left text-slate-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_contacts.map((c: any, i: number) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-slate-900">{c.name}</td>
                        <td className="px-4 py-3 text-slate-600">{c.email}</td>
                        <td className="px-4 py-3 text-slate-600">{c.subject}</td>
                        <td className="px-4 py-3"><Badge variant="secondary">{c.status}</Badge></td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {data.recent_contacts.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No contacts yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "appointments" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="admin-appointments-table">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-600">Name</th>
                      <th className="px-4 py-3 text-left text-slate-600">Email</th>
                      <th className="px-4 py-3 text-left text-slate-600">Date</th>
                      <th className="px-4 py-3 text-left text-slate-600">Time</th>
                      <th className="px-4 py-3 text-left text-slate-600">Topic</th>
                      <th className="px-4 py-3 text-left text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_appointments.map((a: any, i: number) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-slate-900">{a.name}</td>
                        <td className="px-4 py-3 text-slate-600">{a.email}</td>
                        <td className="px-4 py-3 text-slate-600">{a.date}</td>
                        <td className="px-4 py-3 text-slate-600">{a.time}</td>
                        <td className="px-4 py-3 text-slate-600">{a.topic}</td>
                        <td className="px-4 py-3">
                          <Badge variant={a.status === "confirmed" ? "default" : "secondary"}>{a.status}</Badge>
                        </td>
                      </tr>
                    ))}
                    {data.recent_appointments.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No appointments yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "leads" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="admin-leads-table">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-600">Name</th>
                      <th className="px-4 py-3 text-left text-slate-600">Email</th>
                      <th className="px-4 py-3 text-left text-slate-600">Company</th>
                      <th className="px-4 py-3 text-left text-slate-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_leads.map((l: any, i: number) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-slate-900">{l.name}</td>
                        <td className="px-4 py-3 text-slate-600">{l.email}</td>
                        <td className="px-4 py-3 text-slate-600">{l.company || "-"}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{new Date(l.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {data.recent_leads.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No leads yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
