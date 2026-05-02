import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LayoutDashboard, FileText, Clock, Sparkles, Settings,
  LogOut, Menu, X, HelpCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../utils/api.js";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/time", icon: Clock, label: "Time Tracking" },
  { to: "/ai", icon: Sparkles, label: "AI Guidance" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

function Breadcrumbs({ pathname }) {
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>
      <Link to="/dashboard">Home</Link>
      {paths.map((p, i) => {
        const to = "/" + paths.slice(0, i + 1).join("/");
        return (
          <span key={to}>
            {" / "}
            <Link to={to}>{p}</Link>
          </span>
        );
      })}
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    api.getStoredInsights()
      .then(({ insights }) => {
        setUnreadCount(insights.filter(i => !i.is_read).length);
      })
      .catch(() => {});
  }, [location]);

  return (
    <div style={styles.shell}>

      {/* SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          transform: sidebarOpen ? "translateX(0)" : "translateX(0)",
        }}
      >
        {/* Brand */}
        <Link to="/" style={styles.brand}>
          <div style={styles.logo}>TW</div>
          <div>
            <div style={styles.brandName}>TrackWise</div>
            <div style={styles.brandSub}>Student Compliance</div>
          </div>
        </Link>

        {/* NAV */}
        <nav role="navigation" aria-label="Main navigation" style={styles.nav}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? "var(--bg-3)" : "transparent",
                color: isActive ? "var(--text)" : "var(--text-2)",
              })}
            >
              <Icon size={16} />
              {label}

              {to === "/ai" && unreadCount > 0 && (
                <span style={styles.badge}>{unreadCount}</span>
              )}
            </NavLink>
          ))}

          <NavLink to="/help" style={styles.navItem}>
            <HelpCircle size={16} />
            Help & Support
          </NavLink>
        </nav>

        {/* USER */}
        <div style={styles.userBox}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={styles.userName}>{user?.name}</div>
              <div style={styles.userRole}>{user?.job_type}</div>
            </div>
          </div>

          <button onClick={logout} style={styles.logout}>
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={styles.main}>
<header role="banner" style={styles.topbar}>

  {/* Sidebar toggle */}
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    style={styles.menuBtn}
    aria-label="Toggle navigation menu"
  >
    {sidebarOpen ? <X /> : <Menu />}
  </button>

  {/* Search (accessible SaaS pattern) */}
  <div style={styles.searchPlaceholder}>
    <input
      type="text"
      placeholder="Search..."
      aria-label="Search"
      style={{
        background: "transparent",
        border: "none",
        outline: "none",
        color: "inherit",
        width: "100%",
      }}
    />
  </div>

  {/* Right actions */}
  <div style={styles.topbarRight}>
    <div
      style={styles.pill}
      role="status"
      aria-label="Current plan: Pro"
    >
      Pro
    </div>
  </div>

</header>

        {/* CONTENT */}
        <main role="main" style={styles.content}>
          <Breadcrumbs pathname={location.pathname} />

          <div style={styles.pageWrapper}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--bg)",
    fontFamily: "system-ui",
  },

  sidebar: {
    width: 260,
    background: "var(--bg-2)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    height: "100vh",
    padding: "18px",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    marginBottom: 20,
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
  },

  brandName: { fontWeight: 700 },
  brandSub: { fontSize: 11, color: "var(--text-3)" },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 14,
  },

  badge: {
    marginLeft: "auto",
    background: "red",
    color: "#fff",
    fontSize: 10,
    padding: "2px 6px",
    borderRadius: 999,
  },

  userBox: {
    borderTop: "1px solid var(--border)",
    paddingTop: 14,
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "var(--accent)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },

  userName: { fontSize: 13, fontWeight: 600 },
  userRole: { fontSize: 11, color: "var(--text-3)" },

  logout: {
    width: "100%",
    display: "flex",
    gap: 8,
    padding: "8px 10px",
    border: "1px solid var(--border)",
    background: "transparent",
    borderRadius: 8,
    cursor: "pointer",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  topbar: {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-2)",
    position: "sticky",
    top: 0,
  },

  menuBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },

  searchPlaceholder: {
    fontSize: 13,
    color: "var(--text-3)",
  },

  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  pill: {
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    background: "var(--bg-3)",
  },

  content: {
    padding: 24,
    maxWidth: 1200,
    width: "100%",
    margin: "0 auto",
  },

  pageWrapper: {
    background: "transparent",
  },
};