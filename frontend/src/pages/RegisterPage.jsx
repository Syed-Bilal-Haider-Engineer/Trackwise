import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const JOB_TYPES = [
  { value: "student", label: "Student (120 full days/year)" },
  { value: "mini_job", label: "Mini Job (30h/month)" },
  { value: "part_time", label: "Part-Time (80h/month)" },
  { value: "full_time", label: "Full-Time (180h/month)" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", job_type: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in">
        <div style={styles.brand}>
          <div style={styles.logo}>TW</div>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>Track your work and documents in Germany</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Full name
            <input type="text" value={form.name} onChange={set("name")} style={styles.input}
              placeholder="Maria Schmidt" required />
          </label>
          <label style={styles.label}>
            Email
            <input type="email" value={form.email} onChange={set("email")} style={styles.input}
              placeholder="you@university.de" required />
          </label>
          <label style={styles.label}>
            Password
            <input type="password" value={form.password} onChange={set("password")} style={styles.input}
              placeholder="Min 8 characters" minLength={8} required />
          </label>
          <label style={styles.label}>
            Employment type
            <select value={form.job_type} onChange={set("job_type")} style={{ ...styles.input, cursor: "pointer" }}>
              {JOB_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-2)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    padding: 20,
  },
  card: {
    background: "var(--bg-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: 40,
    width: "100%",
    maxWidth: 420,
    boxShadow: "var(--shadow)",
  },
  brand: { textAlign: "center", marginBottom: 32 },
  logo: {
    width: 52, height: 52, borderRadius: 14,
    background: "var(--accent)", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#fff",
    margin: "0 auto 14px", boxShadow: "var(--shadow-accent)",
  },
  title: { fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--text)" },
  subtitle: { color: "var(--text-3)", fontSize: 14, marginTop: 4 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--text-2)" },
  input: {
    background: "var(--bg-3)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)", padding: "10px 14px",
    color: "var(--text)", fontSize: 14, outline: "none",
    fontFamily: "var(--font-body)",
  },
  error: {
    background: "var(--red-bg)", border: "1px solid var(--red)",
    borderRadius: "var(--radius-sm)", padding: "10px 14px",
    color: "var(--red)", fontSize: 13,
  },
  btn: {
    background: "var(--accent)", color: "#fff", border: "none",
    borderRadius: "var(--radius-sm)", padding: "12px",
    fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15,
    cursor: "pointer", marginTop: 4,
  },
  footer: { textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text-3)" },
};
