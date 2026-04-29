// Reusable UI building blocks

export function Card({ children, style = {}, ...props }) {
  return (
    <div style={{
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: 24,
      ...style
    }} {...props}>
      {children}
    </div>
  );
}

export function Badge({ children, color = "accent" }) {
  const map = {
    accent: { bg: "var(--accent-glow)", color: "var(--accent-2)", border: "rgba(108,99,255,0.3)" },
    green: { bg: "var(--green-bg)", color: "var(--green)", border: "rgba(34,197,94,0.3)" },
    yellow: { bg: "var(--yellow-bg)", color: "var(--yellow)", border: "rgba(234,179,8,0.3)" },
    red: { bg: "var(--red-bg)", color: "var(--red)", border: "rgba(239,68,68,0.3)" },
    blue: { bg: "var(--blue-bg)", color: "var(--blue)", border: "rgba(59,130,246,0.3)" },
    gray: { bg: "rgba(255,255,255,0.05)", color: "var(--text-2)", border: "var(--border)" },
  };
  const c = map[color] || map.gray;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600,
    }}>
      {children}
    </span>
  );
}

export function Button({ children, variant = "primary", size = "md", style = {}, ...props }) {
  const bases = {
    primary: { background: "var(--accent)", color: "#fff", border: "none" },
    outline: { background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)" },
    danger: { background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red)" },
    ghost: { background: "transparent", color: "var(--text-2)", border: "1px solid transparent" },
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: 12 },
    md: { padding: "9px 18px", fontSize: 13 },
    lg: { padding: "12px 24px", fontSize: 15 },
  };
  return (
    <button style={{
      ...bases[variant],
      ...sizes[size],
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      transition: "all 0.15s",
      ...style,
    }} {...props}>
      {children}
    </button>
  );
}

export function Spinner({ size = 20 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid var(--border)`,
      borderTopColor: "var(--accent)",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }} />
  );
}

export function Input({ label, style = {}, wrapperStyle = {}, ...props }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, ...wrapperStyle }}>
      {label && <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)" }}>{label}</span>}
      <input style={{
        background: "var(--bg-3)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)", padding: "9px 13px",
        color: "var(--text)", fontSize: 14, outline: "none",
        fontFamily: "var(--font-body)", ...style
      }} {...props} />
    </label>
  );
}

export function Select({ label, options = [], wrapperStyle = {}, ...props }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, ...wrapperStyle }}>
      {label && <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)" }}>{label}</span>}
      <select style={{
        background: "var(--bg-3)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)", padding: "9px 13px",
        color: "var(--text)", fontSize: 14, outline: "none",
        fontFamily: "var(--font-body)", cursor: "pointer",
      }} {...props}>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </label>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade-in" style={{
        background: "var(--bg-2)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        padding: 28,
        width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "var(--shadow)",
      }}>
        {title && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)",
          }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{title}</h2>
            <button onClick={onClose} style={{
              background: "none", border: "none", color: "var(--text-3)",
              cursor: "pointer", fontSize: 20, lineHeight: 1,
            }}>×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub, color = "accent", icon }) {
  const colorMap = {
    accent: "var(--accent-2)",
    green: "var(--green)",
    yellow: "var(--yellow)",
    red: "var(--red)",
    blue: "var(--blue)",
  };
  return (
    <Card style={{ position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${colorMap[color]}22, transparent 70%)`,
      }} />
      {icon && (
        <div style={{ color: colorMap[color], marginBottom: 12 }}>{icon}</div>
      )}
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)", color: colorMap[color] }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}
