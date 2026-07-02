"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users, Search, Download, RefreshCw, CheckCircle2,
  Clock, Calendar, ChevronDown, ChevronUp, Banknote,
  UserCircle2, Phone, BookOpen, GraduationCap,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  level: string | null;
  sex: string | null;
  isPaid: boolean;
  amountPaid: number | null;
  paymentReference: string | null;
  createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function exportCsv(rows: Registration[]) {
  const headers = ["Name", "Email", "Phone", "Department", "Level", "Sex", "Event", "Paid", "Amount (₦)", "Reference", "Registered On"];
  const lines = rows.map(r => [
    r.name, r.email, r.phone ?? "", r.department ?? "", r.level ?? "", r.sex ?? "",
    r.eventTitle, r.isPaid ? "Yes" : "No",
    r.amountPaid != null ? r.amountPaid : "",
    r.paymentReference ?? "", fmt(r.createdAt),
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "event_registrations.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All");
  const [sortField, setSortField] = useState<keyof Registration>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/events/registrations");
      if (!res.ok) throw new Error("Failed to fetch");
      setRegistrations(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Event filter options
  const eventTitles = useMemo(() => {
    const set = new Set(registrations.map(r => r.eventTitle));
    return ["All", ...Array.from(set)];
  }, [registrations]);

  // Filtered + sorted rows
  const rows = useMemo(() => {
    let data = registrations.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q || [r.name, r.email, r.department, r.level, r.eventTitle]
        .some(v => v?.toLowerCase().includes(q));
      const matchEvent = selectedEvent === "All" || r.eventTitle === selectedEvent;
      return matchSearch && matchEvent;
    });

    data = [...data].sort((a, b) => {
      const va = String(a[sortField] ?? "");
      const vb = String(b[sortField] ?? "");
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    return data;
  }, [registrations, search, selectedEvent, sortField, sortDir]);

  const paidCount = rows.filter(r => r.isPaid).length;
  const totalRevenue = rows.reduce((acc, r) => acc + (r.amountPaid ?? 0), 0);

  const toggleSort = (field: keyof Registration) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: keyof Registration }) =>
    sortField === field
      ? sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
      : <ChevronDown size={13} className="opacity-30" />;

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Event Registrations</h1>
          <p className="text-muted-foreground text-sm">All programme registrations across events.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => exportCsv(rows)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Registered",   value: rows.length,                      icon: Users,        color: "text-violet-600 bg-violet-100 dark:bg-violet-950/50" },
          { label: "Paid Registrations", value: paidCount,                         icon: Banknote,     color: "text-amber-600 bg-amber-100 dark:bg-amber-950/50" },
          { label: "Free Registrations", value: rows.length - paidCount,           icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50" },
          { label: "Total Revenue (₦)",  value: totalRevenue.toLocaleString(),      icon: Banknote,     color: "text-blue-600 bg-blue-100 dark:bg-blue-950/50" },
        ].map(c => (
          <div key={c.label} className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.color}`}>
              <c.icon size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{c.label}</p>
              <p className="text-2xl font-heading font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={selectedEvent}
          onChange={e => setSelectedEvent(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {eventTitles.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
            <RefreshCw size={22} className="animate-spin" />
            <span className="font-medium">Loading registrations…</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24 text-red-500 font-medium gap-2">
            ⚠ {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Calendar size={40} className="opacity-30" />
            <p className="font-semibold">No registrations found</p>
            <p className="text-sm">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-border">
                  {([
                    ["name",       "Student"],
                    ["eventTitle", "Event"],
                    ["department", "Department"],
                    ["level",      "Level"],
                    ["sex",        "Sex"],
                    ["isPaid",     "Payment"],
                    ["createdAt",  "Registered"],
                  ] as [keyof Registration, string][]).map(([field, label]) => (
                    <th
                      key={field}
                      onClick={() => toggleSort(field)}
                      className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1">{label} <SortIcon field={field} /></span>
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(r => (
                  <>
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {r.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold leading-tight">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{r.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Event */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                          {r.eventTitle}
                        </span>
                      </td>
                      {/* Dept */}
                      <td className="px-5 py-4 text-sm">{r.department ?? <span className="text-muted-foreground/50">—</span>}</td>
                      {/* Level */}
                      <td className="px-5 py-4 text-sm">{r.level ?? <span className="text-muted-foreground/50">—</span>}</td>
                      {/* Sex */}
                      <td className="px-5 py-4 text-sm">{r.sex ?? <span className="text-muted-foreground/50">—</span>}</td>
                      {/* Payment */}
                      <td className="px-5 py-4">
                        {r.isPaid ? (
                          <div>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 w-fit">
                              <CheckCircle2 size={11} /> Paid · ₦{(r.amountPaid ?? 0).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-muted-foreground text-xs font-bold">
                            Free
                          </span>
                        )}
                      </td>
                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} /> {fmt(r.createdAt)}
                        </div>
                      </td>
                      {/* Expand */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          {expandedId === r.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          {expandedId === r.id ? "Less" : "More"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expandedId === r.id && (
                      <tr key={r.id + "_exp"} className="bg-slate-50/80 dark:bg-slate-800/30">
                        <td colSpan={8} className="px-8 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                              <Phone size={14} className="text-primary mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground font-medium">Phone</p>
                                <p className="font-semibold">{r.phone ?? "Not provided"}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <BookOpen size={14} className="text-primary mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground font-medium">Department</p>
                                <p className="font-semibold">{r.department ?? "Not provided"}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <GraduationCap size={14} className="text-primary mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground font-medium">Level</p>
                                <p className="font-semibold">{r.level ?? "Not provided"}</p>
                              </div>
                            </div>
                            {r.paymentReference && (
                              <div className="flex items-start gap-2">
                                <Banknote size={14} className="text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground font-medium">Payment Ref</p>
                                  <p className="font-mono text-xs font-semibold break-all">{r.paymentReference}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
              Showing <strong>{rows.length}</strong> of <strong>{registrations.length}</strong> registrations
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
