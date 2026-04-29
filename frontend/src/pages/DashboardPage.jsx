import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../utils/api.js";
import { Card, StatCard, Badge, Spinner, Button } from "../components/ui.jsx";
import { Clock, FileText, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ExpiryBar({ daysLeft }) {
  if (daysLeft === null) return null;
  const pct = daysLeft <= 0 ? 100 : daysLeft >= 365 ? 0 : Math.max(0, 100 - (daysLeft / 365) * 100);
  const color = daysLeft < 0 ? "var(--red)" : daysLeft <= 30 ? "var(--red)" : daysLeft <= 90 ? "var(--yellow)" : "var(--green)";
  return (
    <div style={{ height: 4, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden", marginTop: 8 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.5s" }} />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDocuments(),
      api.getTimeSummary(),
      api.getStoredInsights(),
    ]).then(([d, t, a]) => {
      setDocs(d.documents);
      setSummary(t);
      setInsights(a.insights.filter(i => !i.is_read).slice(0, 3));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <Spinner size={32} />
    </div>
  );

  const expiringSoon = docs.filter(d => d.days_until_expiry !== null && d.days_until_expiry <= 90);
  const stats = summary?.stats;
  const isStudent = user?.job_type === "student";
  const daysUsed = stats?.full_days_this_year || 0;
  const daysAllowed = isStudent ? 140 : null;
  const hoursMonth = stats?.total_hours_this_month || 0;
  const maxMonth = stats?.rules?.max_hours_per_month || (isStudent ? null : 80);
  const pctMonth = maxMonth ? Math.min(100, (hoursMonth / maxMonth) * 100) : 0;

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--text)" }}>
          Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--text-3)", marginTop: 6, fontSize: 14 }}>
          Here's your compliance overview for today
        </p>
      </div>

      {/* AI Alerts */}
      {insights.length > 0 && (
        <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
          {insights.map(insight => {
            let parsed;
            try { parsed = JSON.parse(insight.message); } catch { return null; }
            const colorMap = { danger: "red", warning: "yellow", info: "blue", success: "green" };
            const c = colorMap[parsed.type] || "blue";
            const borderColor = { red: "var(--red)", yellow: "var(--yellow)", blue: "var(--blue)", green: "var(--green)" }[c];
            const bg = { red: "var(--red-bg)", yellow: "var(--yellow-bg)", blue: "var(--blue-bg)", green: "var(--green-bg)" }[c];
            return (
              <div key={insight.id} style={{
                background: bg, border: `1px solid ${borderColor}`,
                borderRadius: "var(--radius)", padding: "14px 18px",
                display: "flex", alignItems: "flex-start", gap: 12,
              }}>
                <AlertTriangle size={16} color={borderColor} style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{parsed.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 3 }}>{parsed.message}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/ai")}>
                  View →
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {isStudent && (
          <StatCard
            label="Full days worked this year"
            value={`${daysUsed} / ${daysAllowed}`}
            sub={`${daysAllowed - daysUsed} days remaining`}
            color={daysUsed >= 120 ? "red" : daysUsed >= 100 ? "yellow" : "green"}
            icon={<Clock size={20} />}
          />
        )}
        <StatCard
          label="Hours this month"
          value={`${hoursMonth.toFixed(1)}h`}
          sub={maxMonth ? `of ${maxMonth}h allowed` : "No limit"}
          color={pctMonth >= 90 ? "red" : pctMonth >= 70 ? "yellow" : "accent"}
          icon={<Clock size={20} />}
        />
        <StatCard
          label="Documents tracked"
          value={docs.length}
          sub={`${expiringSoon.length} expiring soon`}
          color={expiringSoon.length > 0 ? "yellow" : "green"}
          icon={<FileText size={20} />}
        />
        <StatCard
          label="AI alerts"
          value={insights.length}
          sub="Unread notifications"
          color={insights.length > 0 ? "yellow" : "green"}
          icon={<Sparkles size={20} />}
        />
      </div>

      {/* Monthly progress */}
      {maxMonth && (
        <Card style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>Monthly Hours Progress</span>
            <Badge color={pctMonth >= 90 ? "red" : pctMonth >= 70 ? "yellow" : "green"}>
              {pctMonth.toFixed(0)}%
            </Badge>
          </div>
          <div style={{ height: 8, background: "var(--bg-3)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pctMonth}%`,
              background: pctMonth >= 90 ? "var(--red)" : pctMonth >= 70 ? "var(--yellow)" : "var(--accent)",
              borderRadius: 4, transition: "width 0.8s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--text-3)" }}>
            <span>{hoursMonth.toFixed(1)}h used</span>
            <span>{(maxMonth - hoursMonth).toFixed(1)}h remaining</span>
          </div>
        </Card>
      )}

      {/* Expiring documents */}
      {expiringSoon.length > 0 && (
        <Card>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            ⚠️ Documents Expiring Soon
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {expiringSoon.map(doc => (
              <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                    {doc.days_until_expiry < 0
                      ? `Expired ${Math.abs(doc.days_until_expiry)} days ago`
                      : `Expires in ${doc.days_until_expiry} days · ${doc.expiry_date}`}
                  </div>
                  <ExpiryBar daysLeft={doc.days_until_expiry} />
                </div>
                <Badge color={doc.days_until_expiry < 0 ? "red" : doc.days_until_expiry <= 30 ? "red" : "yellow"}>
                  {doc.days_until_expiry < 0 ? "EXPIRED" : `${doc.days_until_expiry}d`}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" style={{ marginTop: 16 }} onClick={() => navigate("/documents")}>
            View all documents →
          </Button>
        </Card>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
