import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const C = {
  indigo:  "#3D39C4",
  pale:    "#EEEEFF",
  bg:      "#F8F8FA",
  surface: "#FFFFFF",
  text:    "#18172E",
  muted:   "#6B6980",
  border:  "rgba(61,57,196,0.1)",
}

const NAV = [
  { icon: "⊞", label: "Dashboard",    path: "/dashboard" },
  { icon: "↕", label: "Transactions", path: "/transactions" },
  { icon: "◎", label: "Analytics",    path: "/analytics" },
  { icon: "✦", label: "AI Insights",  path: "/ai-insights" },
  { icon: "◈", label: "Cards",        path: "/cards" },
  { icon: "⚙", label: "Settings",     path: "/settings" },
]

function getInitials(name) {
  if (!name) return "?"
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

export default function Layout({ children }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, signOut } = useAuth()

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif" }}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <Link to="/" style={s.logo}>
          <div style={s.logoMark}>
            <svg width="14" height="14" fill="none" viewBox="0 0 15 15">
              <circle cx="7.5" cy="7.5" r="6" stroke="#fff" strokeWidth="1.5"/>
              <path d="M5 7.5h5M7.5 5v5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={s.logoTxt}>Spend<span style={{ color: C.indigo }}>ly</span></span>
        </Link>

        <div style={s.sectionLabel}>Menu</div>

        {NAV.map(n => {
          const active = location.pathname === n.path
          return (
            <button key={n.path} onClick={() => navigate(n.path)}
              style={{ ...s.navItem, ...(active ? s.navItemActive : {}) }}>
              <span style={{ fontSize: 13 }}>{n.icon}</span>
              {n.label}
            </button>
          )
        })}

        {/* User slot at bottom */}
        <div style={s.sBottom}>
          {user ? (
            <div style={s.userRow}>
              <div style={{ ...s.avatar, background: C.indigo }}>
                {getInitials(user.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: ".8rem", fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.name}
                </div>
                <div style={{ fontSize: ".68rem", color: C.muted, textTransform: "capitalize" }}>
                  {user.persona || "User"}
                </div>
              </div>
              <button onClick={signOut} title="Sign out" style={s.signOutBtn}>
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                  <path d="M5 7h7M9.5 4.5L12 7l-2.5 2.5" stroke={C.muted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2" stroke={C.muted} strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ) : (
            <div style={s.userRow}>
              <div style={{ ...s.avatar, background: "#EDEDF7" }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 14 14">
                  <circle cx="7" cy="5" r="3" stroke="#AAAACC" strokeWidth="1.3"/>
                  <path d="M2 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="#AAAACC" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: ".78rem", fontWeight: 500, color: "#AAAACC" }}>Guest</div>
                <Link to="/signin" style={{ fontSize: ".7rem", color: C.indigo, fontWeight: 600, textDecoration: "none" }}>
                  Sign in →
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Page content */}
      <main style={s.main}>
        {children}
      </main>
    </div>
  )
}

const s = {
  sidebar:       { width: 210, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "1.4rem .9rem", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50, overflowY: "auto" },
  logo:          { display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem", padding: "0 .4rem", textDecoration: "none" },
  logoMark:      { width: 28, height: 28, borderRadius: 7, background: C.indigo, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoTxt:       { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem", color: C.text },
  sectionLabel:  { fontSize: ".62rem", fontWeight: 700, color: "#BBBBCC", textTransform: "uppercase", letterSpacing: ".1em", padding: "0 .5rem", marginBottom: ".4rem" },
  navItem:       { display: "flex", alignItems: "center", gap: 9, padding: ".55rem .6rem", borderRadius: 8, fontSize: ".82rem", fontWeight: 500, color: C.muted, cursor: "pointer", border: "none", background: "transparent", width: "100%", textAlign: "left", marginBottom: 1, fontFamily: "'DM Sans',sans-serif", transition: "all .15s" },
  navItemActive: { background: C.pale, color: C.indigo, fontWeight: 600 },
  sBottom:       { marginTop: "auto", paddingTop: "1rem", borderTop: `1px solid ${C.border}` },
  userRow:       { display: "flex", alignItems: "center", gap: 9, padding: ".4rem .5rem" },
  avatar:        { width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".7rem", color: "#fff" },
  signOutBtn:    { background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center", marginLeft: "auto" },
  main:          { marginLeft: 210, flex: 1, minHeight: "100vh", maxWidth: "calc(100vw - 210px)" },
}