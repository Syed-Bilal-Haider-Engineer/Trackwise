import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in">
        <div style={styles.brand}>
          <div style={styles.logo}>TW</div>
          <h1 style={styles.title}>TrackWise</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={styles.input}
              placeholder="you@university.de"
              required
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={styles.footer}>
          No account?{" "}
          <Link to="/register" style={{ color: "var(--accent-2)" }}>Register here</Link>
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
  brand: {
    textAlign: "center",
    marginBottom: 32,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: 20,
    color: "#fff",
    margin: "0 auto 14px",
    boxShadow: "var(--shadow-accent)",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 26,
    fontWeight: 700,
    color: "var(--text)",
  },
  subtitle: {
    color: "var(--text-3)",
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text-2)",
  },
  input: {
    background: "var(--bg-3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "var(--font-body)",
  },
  error: {
    background: "var(--red-bg)",
    border: "1px solid var(--red)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    color: "var(--red)",
    fontSize: 13,
  },
  btn: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "12px",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 4,
    transition: "opacity 0.15s",
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
    color: "var(--text-3)",
  },
};
