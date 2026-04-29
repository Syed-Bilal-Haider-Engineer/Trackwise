import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../utils/api.js";
import { Card, Button, Input, Select, Spinner } from "../components/ui.jsx";
import { CheckCircle } from "lucide-react";

const JOB_TYPES = [
  { value: "student", label: "Student (140 full days/year)" },
  { value: "mini_job", label: "Mini Job (30h/month)" },
  { value: "part_time", label: "Part-Time (80h/month)" },
  { value: "full_time", label: "Full-Time (180h/month)" },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", job_type: user?.job_type || "student" });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { name: form.name, job_type: form.job_type };
      if (password.new) {
        if (password.new !== password.confirm) {
          throw new Error("Passwords don't match");
        }
        if (password.new.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }
        payload.password = password.new;
      }
      const { user: updated } = await api.updateMe(payload);
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setPassword({ current: "", new: "", confirm: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700 }}>Settings</h1>
        <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 4 }}>Manage your profile and preferences</p>
      </div>

      <div style={{ maxWidth: 540 }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Profile */}
          <Card>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Profile</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Full name" value={form.name} onChange={set("name")} required />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)" }}>Email</span>
                <div style={{
                  padding: "9px 13px", background: "var(--bg-3)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--text-3)"
                }}>{user?.email}</div>
              </div>
              <Select label="Employment type" value={form.job_type} onChange={set("job_type")} options={JOB_TYPES} />
            </div>
          </Card>

          {/* Password */}
          <Card>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Change Password</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="New password" type="password" value={password.new}
                onChange={e => setPassword(p => ({ ...p, new: e.target.value }))}
                placeholder="Leave blank to keep current" minLength={8} />
              <Input label="Confirm new password" type="password" value={password.confirm}
                onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password" />
            </div>
          </Card>

          {/* German rules info */}
          <Card style={{ background: "var(--accent-glow)", border: "1px solid rgba(108,99,255,0.3)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 12, color: "var(--accent-2)" }}>
              🇩🇪 German Work Rules Reference
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--text-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Student annual limit</span>
                <strong>120 full days OR 240 half days</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Full day threshold</span>
                <strong>≥ 4 hours/day</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Mini-job limit</span>
                <strong>30h/month · €538/month max</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Part-time limit</span>
                <strong>80h/month</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Full-time limit</span>
                <strong>180h/month</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Visa renewal notice</span>
                <strong>3 months before expiry</strong>
              </div>
            </div>
          </Card>

          {error && (
            <div style={{ background: "var(--red-bg)", border: "1px solid var(--red)", borderRadius: "var(--radius-sm)", padding: "10px 14px", color: "var(--red)", fontSize: 13 }}>
              {error}
            </div>
          )}

          {saved && (
            <div style={{ background: "var(--green-bg)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "var(--radius-sm)", padding: "10px 14px", color: "var(--green)", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
              <CheckCircle size={14} /> Settings saved successfully!
            </div>
          )}

          <Button type="submit" variant="primary" disabled={loading} style={{ alignSelf: "flex-start" }}>
            {loading ? <Spinner size={14} /> : null}
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}
