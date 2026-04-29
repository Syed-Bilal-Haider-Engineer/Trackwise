import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { Card, Button, Modal, Input, Select, Badge, Spinner, StatCard } from "../components/ui.jsx";
import { Plus, Clock, Trash2, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const JOB_TYPES = [
  { value: "student", label: "Student" },
  { value: "mini_job", label: "Mini Job" },
  { value: "part_time", label: "Part-Time" },
  { value: "full_time", label: "Full-Time" },
];

function EntryForm({ initial = {}, onSave, onClose }) {
  const [form, setForm] = useState({
    job_name: initial.job_name || "",
    job_type: initial.job_type || "student",
    date: initial.date || format(new Date(), "yyyy-MM-dd"),
    hours: initial.hours || "",
    notes: initial.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initial.id;
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = isEdit
        ? await api.updateTimeEntry(initial.id, form)
        : await api.addTimeEntry(form);
      onSave(result.entry);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Input label="Job/Employer name *" value={form.job_name} onChange={set("job_name")} required placeholder="e.g. Campus Café" />
      <Select label="Job type" value={form.job_type} onChange={set("job_type")} options={JOB_TYPES} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Date *" type="date" value={form.date} onChange={set("date")} required />
        <Input label="Hours worked *" type="number" step="0.5" min="0.5" max="24" value={form.hours} onChange={set("hours")} required placeholder="e.g. 4.5" />
      </div>
      <Input label="Notes" value={form.notes} onChange={set("notes")} placeholder="Optional notes..." />

      {/* German rule hint */}
      {form.hours && (
        <div style={{
          background: parseFloat(form.hours) >= 4 ? "var(--yellow-bg)" : "var(--green-bg)",
          border: `1px solid ${parseFloat(form.hours) >= 4 ? "rgba(234,179,8,0.3)" : "rgba(34,197,94,0.3)"}`,
          borderRadius: "var(--radius-sm)", padding: "8px 12px", fontSize: 12, color: "var(--text-2)"
        }}>
          {parseFloat(form.hours) >= 4
            ? "⚠️ This counts as a full day (≥4h) towards your 140-day annual limit"
            : "✅ This counts as a half day (<4h)"}
        </div>
      )}

      {error && <div style={{ background: "var(--red-bg)", border: "1px solid var(--red)", borderRadius: "var(--radius-sm)", padding: "10px 14px", color: "var(--red)", fontSize: 13 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner size={14} /> : null}
          {isEdit ? "Save changes" : "Log hours"}
        </Button>
      </div>
    </form>
  );
}

export default function TimeTrackingPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [entriesData, summaryData] = await Promise.all([
        api.getTimeEntries({
          year: format(currentMonth, "yyyy"),
          month: format(currentMonth, "M"),
        }),
        api.getTimeSummary(),
      ]);
      setEntries(entriesData.entries);
      setStats(summaryData.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [currentMonth]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this entry?")) return;
    await api.deleteTimeEntry(id);
    setEntries(e => e.filter(x => x.id !== id));
    const s = await api.getTimeSummary();
    setStats(s.stats);
  };

  const handleSave = () => {
    setModal(null);
    load();
  };

  // Chart data: group by date
  const chartData = (() => {
    const byDate = {};
    for (const e of entries) {
      byDate[e.date] = (byDate[e.date] || 0) + e.hours;
    }
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, hours]) => ({ date: date.slice(5), hours, isFullDay: hours >= 4 }));
  })();

  const isStudent = stats?.rules?.max_full_days_per_year;
  const daysUsed = stats?.full_days_this_year || 0;
  const hoursMonth = stats?.total_hours_this_month || 0;
  const maxMonth = stats?.rules?.max_hours_per_month;
  const totalYear = stats?.total_hours_this_year || 0;

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700 }}>Time Tracking</h1>
          <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 4 }}>Log work hours and stay within German regulations</p>
        </div>
        <Button variant="primary" onClick={() => setModal("add")}>
          <Plus size={15} /> Log hours
        </Button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        {isStudent && (
          <StatCard
            label="Full days this year"
            value={`${daysUsed}/140`}
            sub={`${140 - daysUsed} days left`}
            color={daysUsed >= 120 ? "red" : daysUsed >= 100 ? "yellow" : "green"}
            icon={<Clock size={18} />}
          />
        )}
        <StatCard
          label="Hours this month"
          value={`${hoursMonth.toFixed(1)}h`}
          sub={maxMonth ? `of ${maxMonth}h` : "No limit"}
          color={maxMonth && hoursMonth >= maxMonth * 0.9 ? "red" : "accent"}
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Hours this year"
          value={`${totalYear.toFixed(0)}h`}
          color="blue"
          icon={<Briefcase size={18} />}
        />
        <StatCard
          label="Entries this month"
          value={entries.length}
          color="accent"
        />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Daily hours this month</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-3)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-3)" }} />
              <Tooltip
                contentStyle={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${v}h`, "Hours"]}
              />
              <Bar dataKey="hours" radius={4}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.isFullDay ? "var(--yellow)" : "var(--accent)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "var(--text-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--accent)", display: "inline-block" }} />
              Half day (&lt;4h)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--yellow)", display: "inline-block" }} />
              Full day (≥4h)
            </span>
          </div>
        </Card>
      )}

      {/* Month nav + entries */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 }}>
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div style={{ display: "flex", gap: 4 }}>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(m => subMonths(m, 1))}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(m => addMonths(m, 1))}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner size={24} /></div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Clock size={36} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
            <div style={{ color: "var(--text-2)", fontWeight: 500 }}>No entries this month</div>
            <Button variant="primary" style={{ marginTop: 16 }} onClick={() => setModal("add")}>
              <Plus size={14} /> Log your first hours
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {entries.map(entry => (
              <div key={entry.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 0", borderBottom: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: entry.hours >= 4 ? "var(--yellow-bg)" : "var(--accent-glow)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)",
                  color: entry.hours >= 4 ? "var(--yellow)" : "var(--accent-2)",
                }}>
                  {entry.hours}h
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{entry.job_name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 1 }}>
                    {entry.date} · <span style={{ textTransform: "capitalize" }}>{entry.job_type.replace("_", " ")}</span>
                    {entry.hours >= 4 && <span style={{ color: "var(--yellow)", marginLeft: 6 }}>· Full day</span>}
                  </div>
                  {entry.notes && <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2, fontStyle: "italic" }}>{entry.notes}</div>}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <Button variant="ghost" size="sm" onClick={() => setModal(entry)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(entry.id)}>
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === "add" ? "Log work hours" : "Edit entry"}
      >
        {modal && (
          <EntryForm
            initial={modal === "add" ? {} : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
