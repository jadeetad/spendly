import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
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

// Compact week strip — 7 small circles, current week, today highlighted
function WeekStrip() {
  const today  = new Date()
  const dow    = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow === 0 ? 7 : dow) - 1))

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  const dayNames = ["M","T","W","T","F","S","S"]
  const monthLabel = monday.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div style={s.weekStrip}>
      <span style={{ fontSize: ".68rem", color: C.muted, fontWeight: 500 }}>{monthLabel}</span>
      <div style={{ display: "flex", gap: ".3rem", alignItems: "center" }}>
        {days.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString()
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: ".58rem", color: C.muted, fontWeight: 600 }}>{dayNames[i]}</span>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: isToday ? C.indigo : "transparent",
                border: isToday ? "none" : `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ".72rem", fontWeight: isToday ? 700 : 400,
                color: isToday ? "#fff" : C.muted,
              }}>
                {d.getDate()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Period data — empty by default (no fake data shown to real users)
const EMPTY_STATS = { spent: "—", income: "—", saved: "—", splurges: "—" }

// Demo data only used when explicitly toggled (for testing UI)
const DEMO_DATA = {
  Week: {
    bars: [{ label:"Mon",val:2200 },{ label:"Tue",val:1500 },{ label:"Wed",val:4800 },{ label:"Thu",val:900 },{ label:"Fri",val:6200 },{ label:"Sat",val:8100 },{ label:"Sun",val:3400 }],
    stats: { spent:"₦27,100", income:"—", saved:"—", splurges:"1" },
  },
  Month: {
    bars: [{ label:"W1",val:18000 },{ label:"W2",val:22000 },{ label:"W3",val:31000 },{ label:"W4",val:13200 }],
    stats: { spent:"₦84,200", income:"₦50,000", saved:"₦35,800", splurges:"3" },
  },
  Year: {
    bars: [{ label:"Oct",val:62000 },{ label:"Nov",val:74000 },{ label:"Dec",val:95000 },{ label:"Jan",val:58000 },{ label:"Feb",val:71000 },{ label:"Mar",val:84200 }],
    stats: { spent:"₦444,200", income:"₦300,000", saved:"₦275,800", splurges:"14" },
  },
}

function SpendingChart({ bars }) {
  if (!bars) return (
    <div style={s.emptyChart}>
      <div style={{ opacity: .18, fontSize: 24, marginBottom: 6 }}>📊</div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#BBBBCC", fontSize:".82rem" }}>No data yet</div>
      <div style={{ fontSize:".74rem", color:"#CCCCDD", marginTop:3 }}>Add expenses to see your chart</div>
    </div>
  )
  const max = Math.max(...bars.map(d => d.val))
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:110 }}>
      {bars.map((d, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
          <motion.div style={{ width:"100%", borderRadius:"5px 5px 0 0", background: i===bars.length-1 ? C.indigo : C.pale }}
            initial={{ height:0 }} animate={{ height:(d.val/max)*100 }}
            transition={{ delay:i*0.06, duration:0.5, ease:"easeOut" }}/>
          <span style={{ fontSize:".6rem", color:C.muted }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

const QUICK_PRESETS = [
  { icon:"🚌", label:"Transport", amount:1500, cat:"transport" },
  { icon:"🍔", label:"Food",      amount:3000, cat:"food"      },
  { icon:"📱", label:"Airtime",   amount:1000, cat:"utilities" },
  { icon:"☕", label:"Coffee",    amount:800,  cat:"food"      },
]

export default function Dashboard() {
  const navigate      = useNavigate()
  const { user }      = useAuth()
  const [period, setPeriod]   = useState("Month")
  const [demoMode, setDemoMode] = useState(false)
  const [tapped, setTapped]   = useState(null)

  // Use real data (empty) unless demo mode is on
  const chartBars = demoMode ? DEMO_DATA[period].bars : null
  const stats     = demoMode ? DEMO_DATA[period].stats : EMPTY_STATS

  const today = new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" })

  const handleQuick = (q) => {
    setTapped(q.label)
    setTimeout(() => setTapped(null), 700)
    // TODO: supabase.from("transactions").insert({ user_id: user.id, amount: q.amount, category: q.cat, description: q.label, date: new Date().toISOString(), type: "expense" })
    navigate("/add-expense")
  }

  return (
    <div style={s.page}>
      {/* Topbar */}
      <div style={s.topbar}>
        <div>
          <h1 style={s.pageTitle}>
            {user ? `Hi, ${user.name.split(" ")[0]} 👋` : "Dashboard"}
          </h1>
          <p style={s.pageDate}>{today}</p>
        </div>
        <div style={{ display:"flex", gap:".6rem", alignItems:"center", flexWrap:"wrap" }}>
          <div style={s.tabGroup}>
            {["Week","Month","Year"].map(t => (
              <button key={t} onClick={() => setPeriod(t)}
                style={{ ...s.tab, ...(period===t ? s.tabActive : {}) }}>{t}</button>
            ))}
          </div>
          <button onClick={() => navigate("/add-expense")} style={s.addBtn}>+ Add expense</button>
        </div>
      </div>

      {/* Guest banner — only if not signed in */}
      {!user && (
        <motion.div style={s.banner} initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#fff", marginBottom:3 }}>
              Welcome to Spendly 👋
            </div>
            <div style={{ fontSize:".8rem", color:"rgba(255,255,255,.65)" }}>
              Sign in to save your data and unlock AI insights.
            </div>
          </div>
          <button onClick={() => navigate("/signup")} style={s.bannerBtn}>Get started →</button>
        </motion.div>
      )}

      {/* Week strip */}
      <WeekStrip/>

      {/* Stats row */}
      <div style={s.statsRow}>
        {[
          { label:"Spent",    val:stats.spent,    accent:true },
          { label:"Income",   val:stats.income },
          { label:"Saved",    val:stats.saved },
          { label:"Splurges", val:stats.splurges },
        ].map((stat, i) => (
          <motion.div key={i} style={{ ...s.statItem, ...(stat.accent ? s.statAccent : {}) }}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.06 }}>
            <div style={{ fontSize:".63rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", color: stat.accent ? "rgba(255,255,255,.5)" : C.muted, marginBottom:".3rem" }}>
              {stat.label}
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.25rem", color: stat.accent ? "#fff" : (stat.val==="—" ? "#DDDDEE" : C.text), letterSpacing:"-.02em" }}>
              {stat.val}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick add */}
      <div style={s.section}>
        <div style={s.sectionHd}>
          <span style={s.sectionTxt}>Quick add</span>
          <button onClick={() => navigate("/add-expense")} style={s.linkBtn}>Custom →</button>
        </div>
        <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap" }}>
          {QUICK_PRESETS.map(q => (
            <motion.button key={q.label} whileTap={{ scale:.93 }} onClick={() => handleQuick(q)}
              style={{ ...s.quickBtn, background: tapped===q.label ? C.indigo : C.surface, color: tapped===q.label ? "#fff" : C.text }}>
              <span style={{ fontSize:15 }}>{q.icon}</span>
              <div>
                <div style={{ fontSize:".76rem", fontWeight:600 }}>{q.label}</div>
                <div style={{ fontSize:".65rem", color: tapped===q.label ? "rgba(255,255,255,.6)" : C.muted }}>₦{q.amount.toLocaleString()}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart + AI */}
      <div style={s.row2}>
        <div style={s.chartCard}>
          <div style={s.sectionHd}>
            <span style={s.sectionTxt}>Spending — {period}</span>
            {!demoMode && (
              <button onClick={() => setDemoMode(true)} style={{ ...s.linkBtn, color:"#AAAACC", fontSize:".7rem" }}>
                Preview demo →
              </button>
            )}
            {demoMode && (
              <button onClick={() => setDemoMode(false)} style={{ ...s.linkBtn, color:"#E24B4A", fontSize:".7rem" }}>
                Clear demo
              </button>
            )}
          </div>
          <SpendingChart bars={chartBars}/>
        </div>

        <div style={s.aiCard}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:"1rem" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background: user ? "#4EE5A0" : "rgba(255,255,255,.25)" }}/>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:".78rem", fontWeight:700, color:"#fff" }}>Spendly AI</span>
            <span style={{ fontSize:".58rem", color:"rgba(255,255,255,.3)", marginLeft:"auto", fontFamily:"'Syne',sans-serif", fontWeight:600, letterSpacing:".06em" }}>
              {user ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:".55rem" }}>
            <svg width="30" height="30" fill="none" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="13" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/>
              <circle cx="15" cy="15" r="7"  stroke="rgba(255,255,255,.15)" strokeWidth="1.5" strokeDasharray="3 3"/>
              <circle cx="15" cy="15" r="2.5" fill="rgba(255,255,255,.2)"/>
            </svg>
            <p style={{ fontSize:".76rem", color:"rgba(255,255,255,.4)", lineHeight:1.6, maxWidth:170 }}>
              {user
                ? "Add some expenses and your AI insights will appear here."
                : "Sign in and log expenses to activate AI insights."}
            </p>
            {!user && (
              <button onClick={() => navigate("/signin")}
                style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.18)", borderRadius:7, padding:".36rem .9rem", fontSize:".74rem", fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif", cursor:"pointer" }}>
                Sign in
              </button>
            )}
            {user && (
              <button onClick={() => navigate("/ai-insights")}
                style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.18)", borderRadius:7, padding:".36rem .9rem", fontSize:".74rem", fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif", cursor:"pointer" }}>
                Open AI Insights →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div style={s.section}>
        <div style={s.sectionHd}>
          <span style={s.sectionTxt}>Recent transactions</span>
          <button onClick={() => navigate("/transactions")} style={s.linkBtn}>View all →</button>
        </div>
        {/* Empty state — no fake data */}
        <div style={s.emptyTxn}>
          <div style={{ opacity:.15, fontSize:26, marginBottom:6 }}>↕</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#BBBBCC", fontSize:".82rem" }}>
            No transactions yet
          </div>
          <div style={{ fontSize:".74rem", color:"#CCCCDD", marginTop:3 }}>
            {user ? "Tap '+ Add expense' or use Quick add above to log your first transaction." : "Sign in and add your first expense to get started."}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{ ...s.section, marginBottom:"2rem" }}>
        <div style={s.sectionHd}>
          <span style={s.sectionTxt}>By category</span>
          <button onClick={() => navigate("/analytics")} style={s.linkBtn}>Analytics →</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:".65rem" }}>
          {["Food & Drinks","Transport","Entertainment","Health","Utilities"].map((cat, i) => (
            <div key={i}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".78rem", marginBottom:".28rem" }}>
                <span style={{ fontWeight:500, color:"#CCCCDD" }}>{cat}</span>
                <span style={{ color:"#DDDDEE" }}>—</span>
              </div>
              <div style={{ height:4, background:"#F0F0F8", borderRadius:100 }}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  page:       { padding:"1.8rem 2rem", minHeight:"100vh" },
  topbar:     { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.3rem", flexWrap:"wrap", gap:".75rem" },
  pageTitle:  { fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:700, letterSpacing:"-.02em", color:C.text },
  pageDate:   { fontSize:".76rem", color:"#AAAACC", marginTop:2 },
  tabGroup:   { display:"flex", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" },
  tab:        { padding:".33rem .8rem", fontSize:".75rem", fontWeight:600, fontFamily:"'Syne',sans-serif", cursor:"pointer", border:"none", background:"transparent", color:"#AAAACC" },
  tabActive:  { background:C.indigo, color:"#fff" },
  addBtn:     { background:C.indigo, color:"#fff", border:"none", borderRadius:8, padding:".38rem .9rem", fontSize:".78rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  banner:     { background:C.indigo, borderRadius:11, padding:"1rem 1.2rem", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem", gap:"1rem" },
  bannerBtn:  { background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.2)", borderRadius:7, padding:".36rem .95rem", fontSize:".76rem", fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif", cursor:"pointer", whiteSpace:"nowrap" },
  weekStrip:  { display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.2rem", padding:".7rem 1rem", background:C.surface, borderRadius:10, border:`1px solid ${C.border}` },
  statsRow:   { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1px", background:C.border, borderRadius:12, overflow:"hidden", marginBottom:"1.4rem" },
  statItem:   { background:C.surface, padding:".9rem 1rem" },
  statAccent: { background:C.indigo },
  section:    { marginBottom:"1.4rem" },
  sectionHd:  { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".7rem" },
  sectionTxt: { fontFamily:"'Syne',sans-serif", fontSize:".8rem", fontWeight:700, color:C.text },
  linkBtn:    { fontSize:".74rem", color:C.indigo, fontWeight:600, background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },
  quickBtn:   { display:"flex", alignItems:"center", gap:9, padding:".6rem .85rem", border:`1px solid ${C.border}`, borderRadius:9, background:C.surface, cursor:"pointer", transition:"all .18s", fontFamily:"'DM Sans',sans-serif" },
  row2:       { display:"grid", gridTemplateColumns:"1fr 260px", gap:"1.1rem", marginBottom:"1.4rem" },
  chartCard:  { background:C.surface, border:`1px solid ${C.border}`, borderRadius:11, padding:"1.1rem" },
  aiCard:     { background:C.indigo, borderRadius:11, padding:"1.1rem", display:"flex", flexDirection:"column" },
  emptyChart: { height:110, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" },
  emptyTxn:   { textAlign:"center", padding:"2.2rem", background:C.surface, border:`1px solid ${C.border}`, borderRadius:11 },
}