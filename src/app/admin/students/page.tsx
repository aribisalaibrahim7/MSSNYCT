"use client";

import { useEffect, useState, useMemo } from "react";
import { Users, Search, Download, RefreshCw, Phone, BookOpen, GraduationCap, ChevronDown, ChevronUp, Clock } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  profile?: {
    phoneNumber?: string;
    course?: string;
    level?: string;
    sex?: string;
    department?: string; // fallback
  };
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function exportCsv(rows: Student[]) {
  const headers = ["Name", "Email", "Phone", "Course/Department", "Level", "Sex", "Registered On"];
  const lines = rows.map(r => [
    r.name,
    r.email,
    r.profile?.phoneNumber || "",
    r.profile?.course || r.profile?.department || "",
    r.profile?.level || "",
    r.profile?.sex || "",
    fmt(r.createdAt)
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "students_list.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "createdAt" | "course" | "level" | "sex">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      setStudents(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const rows = useMemo(() => {
    let data = students.filter(s => {
      const q = search.toLowerCase();
      if (!q) return true;
      const courseStr = s.profile?.course || s.profile?.department || "";
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        courseStr.toLowerCase().includes(q) ||
        s.profile?.level?.toLowerCase().includes(q)
      );
    });

    data = [...data].sort((a, b) => {
      let va = "";
      let vb = "";
      
      if (sortField === "name") {
        va = a.name || ""; vb = b.name || "";
      } else if (sortField === "course") {
        va = a.profile?.course || a.profile?.department || ""; vb = b.profile?.course || b.profile?.department || "";
      } else if (sortField === "level") {
        va = a.profile?.level || ""; vb = b.profile?.level || "";
      } else if (sortField === "sex") {
        va = a.profile?.sex || ""; vb = b.profile?.sex || "";
      } else if (sortField === "createdAt") {
        va = a.createdAt; vb = b.createdAt;
      }

      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    return data;
  }, [students, search, sortField, sortDir]);

  const toggleSort = (field: "name" | "createdAt" | "course" | "level" | "sex") => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: string }) =>
    sortField === field
      ? sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
      : <ChevronDown size={13} className="opacity-30" />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Students Directory</h1>
          <p className="text-muted-foreground text-sm">Manage all registered students.</p>
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, course, or level..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
            <RefreshCw size={22} className="animate-spin" />
            <span className="font-medium">Loading students...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24 text-red-500 font-medium gap-2">
            ⚠ {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Users size={40} className="opacity-30" />
            <p className="font-semibold">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-border">
                  <th onClick={() => toggleSort("name")} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap">
                    <span className="flex items-center gap-1">Student <SortIcon field="name" /></span>
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    Phone
                  </th>
                  <th onClick={() => toggleSort("course")} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap">
                    <span className="flex items-center gap-1">Course <SortIcon field="course" /></span>
                  </th>
                  <th onClick={() => toggleSort("level")} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap">
                    <span className="flex items-center gap-1">Level <SortIcon field="level" /></span>
                  </th>
                  <th onClick={() => toggleSort("sex")} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap">
                    <span className="flex items-center gap-1">Sex <SortIcon field="sex" /></span>
                  </th>
                  <th onClick={() => toggleSort("createdAt")} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap">
                    <span className="flex items-center gap-1">Registered <SortIcon field="createdAt" /></span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {r.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold leading-tight">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium">
                      {r.profile?.phoneNumber || <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {r.profile?.course || r.profile?.department || <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {r.profile?.level || <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {r.profile?.sex || <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {fmt(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
              Showing <strong>{rows.length}</strong> of <strong>{students.length}</strong> students
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
