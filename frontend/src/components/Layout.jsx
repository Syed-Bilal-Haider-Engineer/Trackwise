import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LayoutDashboard, FileText, Clock, Sparkles, Settings, LogOut, Menu, X, Bell
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

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => { setSidebarOpen(false); }, [location]);

  useEffect(() => {
    api.getStoredInsights().then(({ insights }) => {
      setUnreadCount(insights.filter(i => !i.is_read).length);
    }).catch(() => {});
  }, [location]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <>
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
              zIndex: 40, backdropFilter: "blur(4px)"
            }}
          />
        )}
        <aside style={{
          position: "fixed", left: 0, top: 0, bottom: 0,
          width: 240,
          background: "var(--bg-2)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          padding: "24px 0",
        }}
        className="sidebar"
        >
          {/* Logo */}
          <div style={{ padding: "0 24px 32px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "var(--shadow-accent)",
                fontFamily: "var(--font-display)",
                fontWeight: 800, fontSize: 16, color: "#fff"
              }}>TW</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>TrackWise</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: -2 }}>Student Compliance</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "var(--text)" : "var(--text-2)",
                  background: isActive ? "var(--bg-3)" : "transparent",
                  border: isActive ? "1px solid var(--border-light)" : "1px solid transparent",
                  transition: "all 0.15s",
                  position: "relative",
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} color={isActive ? "var(--accent-2)" : "currentColor"} />
                    {label}
                    {to === "/ai" && unreadCount > 0 && (
                      <span style={{
                        marginLeft: "auto",
                        background: "var(--red)",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 999,
                        padding: "1px 6px",
                        minWidth: 18,
                        textAlign: "center",
                      }}>{unreadCount}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border)" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: "var(--radius-sm)",
              marginBottom: 4,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "var(--accent)", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "#fff",
                flexShrink: 0,
              }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "capitalize" }}>{user?.job_type?.replace("_", " ")}</div>
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "9px 12px",
                background: "transparent", border: "1px solid transparent",
                borderRadius: "var(--radius-sm)", cursor: "pointer",
                color: "var(--text-3)", fontSize: 13, fontWeight: 500,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.borderColor = "transparent"; }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </aside>
      </>

      {/* Desktop sidebar always visible */}
      <style>{`
        @media (min-width: 768px) {
          .sidebar { transform: translateX(0) !important; position: sticky; top: 0; height: 100vh; }
        }
      `}</style>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, marginLeft: 0 }}>
        {/* Mobile header */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          background: "var(--bg-2)", borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, zIndex: 30,
        }}
        className="mobile-header"
        >
          <style>{`@media (min-width: 768px) { .mobile-header { display: none !important; } }`}</style>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>TrackWise</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {unreadCount > 0 && (
              <div style={{
                background: "var(--red)", color: "#fff", width: 20, height: 20,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700
              }}>{unreadCount}</div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "transparent", border: "none",
                cursor: "pointer", color: "var(--text)", padding: 4
              }}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: "32px 28px", maxWidth: 1100, width: "100%" }}>
          <style>{`@media (max-width: 767px) { main { padding: 20px 16px; } }`}</style>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
