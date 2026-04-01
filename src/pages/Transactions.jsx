import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

const ALL_TXNS = [
  { id:1,  ico:"🍔", name:"Chicken Republic",   cat:"food",          date:"2026-03-30", amt:-4800,   splurge:true },
  { id:2,  ico:"🚌", name:"Bolt Ride",           cat:"transport",     date:"2026-03-30", amt:-1200 },
  { id:3,  ico:"📱", name:"Airtime Recharge",    cat:"utilities",     date:"2026-03-29", amt:-1000 },
  { id:4,  ico:"🛒", name:"Shoprite Groceries",  cat:"food",          date:"2026-03-28", amt:-8400,   splurge:true },
  { id:5,  ico:"💳", name:"Salary Deposit",      cat:"income",        date:"2026-03-27", amt:120000 },
  { id:6,  ico:"🎬", name:"Netflix",             cat:"entertainment", date:"2026-03-25", amt:-4600 },
  { id:7,  ico:"🏋", name:"Gym Membership",      cat:"health",        date:"2026-03-24", amt:-5000 },
  { id:8,  ico:"🍕", name:"Domino's Pizza",      cat:"food",          date:"2026-03-23", amt:-3800,   refund:true },
  { id:9,  ico:"📚", name:"Textbook",            cat:"education",     date:"2026-03-20", amt:-7500 },
  { id:10, ico:"🚌", name:"Uber",                cat:"transport",     date:"2026-03-19", amt:-2200 },
  { id:11, ico:"🍔", name:"KFC",                 cat:"food",          date:"2026-03-18", amt:-3100,   splurge:true },
  { id:12, ico:"📱", name:"DSTV Subscription",   cat:"utilities",     date:"2026-03-15", amt:-5500 },
]

const CATS = ["all","food","transport","entertainment","health","utilities","education","income"]

const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })

export default function Transactions() {
  const navigate = useNavigate()
  const [filter, setFilter]   = useState("all")
  const [search, setSearch]   = useState("")
  const [selected, setSelected] = useState(null)
  const [editMode, setEditMode] = useState(false)

  const filtered = ALL_TXNS.filter(t =>
    (filter === "all" || t.cat === filter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()))
  )

  const totalIn  = filtered.filter(t => t.amt > 0).reduce((a, b) => a + b.amt, 0)
  const totalOut = filtered.filter(t => t.amt < 0).reduce((a, b) => a + b.amt, 0)

  return (
    <div style={s.page}>
      {/* Topbar */}
      <div style={s.topbar}>
        <button onClick={() => navigate("/dashboard")} style={s.backBtn}>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" stroke="#14132A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem" }}>Transactions</div>
        <button onClick={() => navigate("/add-expense")} style={s.addBtn}>+ Add</button>
      </div>

      <div style={s.content}>
        {/* Summary row */}
        <div style={s.summaryRow}>
          {[
            { label:"Money in",  val:`+₦${totalIn.toLocaleString()}`,           color:"#1D9E75" },
            { label:"Money out", val:`-₦${Math.abs(totalOut).toLocaleString()}`, color:"#E24B4A" },
            { label:"Net",       val:`₦${(totalIn+totalOut).toLocaleString()}`,  color:"#4C47D9" },
          ].map((s2,i) => (
            <div key={i} style={s.summaryCard}>
              <div style={{ fontSize:".68rem", color:"#9999BB", textTransform:"uppercase", letterSpacing:".08em", fontWeight:600, marginBottom:4 }}>{s2.label}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.1rem", color:s2.color }}>{s2.val}</div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div style={s.searchRow}>
          <div style={{ position:"relative", flex:1 }}>
            <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} width="14" height="14" fill="none" viewBox="0 0 14 14">
              <circle cx="6" cy="6" r="4.5" stroke="#9999BB" strokeWidth="1.3"/>
              <path d="M9.5 9.5l2.5 2.5" stroke="#9999BB" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...s.searchInput, paddingLeft:"2.2rem" }}/>
          </div>
        </div>

        {/* Category filter */}
        <div style={s.filterRow}>
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ ...s.filterBtn, ...(filter===c ? s.filterBtnActive : {}) }}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        <div style={s.listCard}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"3rem", color:"#BBBBCC" }}>
              <div style={{ fontSize:32, opacity:.2, marginBottom:8 }}>↕</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700 }}>No transactions found</div>
            </div>
          ) : filtered.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i*0.04 }}
              onClick={() => setSelected(t)}
              style={{ ...s.txnRow, borderBottom: i < filtered.length-1 ? "1px solid rgba(76,71,217,0.07)" : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={s.txnIco}>{t.ico}</div>
                <div>
                  <div style={{ fontSize:".84rem", fontWeight:500 }}>
                    {t.name}
                    {t.splurge && <span style={s.badgeSplurge}>Splurge</span>}
                    {t.refund  && <span style={s.badgeRefund}>Refunded</span>}
                  </div>
                  <div style={{ fontSize:".7rem", color:"#9999BB", marginTop:1 }}>{fmt(t.date)} · {t.cat}</div>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".9rem", color: t.amt>0?"#1D9E75":"#E24B4A" }}>
                  {t.amt>0?"+":"-"}₦{Math.abs(t.amt).toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div style={s.overlay} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setSelected(null)}/>
            <motion.div style={s.drawer} initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }} transition={{ type:"spring", damping:28, stiffness:300 }}>
              <div style={{ width:36, height:4, borderRadius:100, background:"#E0E0EE", margin:"0 auto 1.5rem" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:"1.5rem" }}>
                <div style={{ ...s.txnIco, width:52, height:52, fontSize:22, borderRadius:14 }}>{selected.ico}</div>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1.1rem" }}>{selected.name}</div>
                  <div style={{ fontSize:".78rem", color:"#9999BB" }}>{fmt(selected.date)} · {selected.cat}</div>
                </div>
                <div style={{ marginLeft:"auto", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.3rem", color: selected.amt>0?"#1D9E75":"#E24B4A" }}>
                  {selected.amt>0?"+":"-"}₦{Math.abs(selected.amt).toLocaleString()}
                </div>
              </div>
              <div style={{ display:"flex", gap:".75rem" }}>
                <button style={s.drawerBtn} onClick={() => { setEditMode(true) }}>Edit</button>
                <button style={{ ...s.drawerBtn, background:"rgba(226,75,74,.08)", color:"#E24B4A", borderColor:"rgba(226,75,74,.2)" }}>Delete</button>
                <button style={{ ...s.drawerBtn, background:"rgba(29,158,117,.08)", color:"#1D9E75", borderColor:"rgba(29,158,117,.2)", marginLeft:"auto" }}>
                  {selected.refund ? "Remove refund" : "Mark refunded"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const s = {
  page:           { minHeight:"100vh", background:"#F4F4F9", fontFamily:"'DM Sans',sans-serif" },
  topbar:         { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.2rem 1.5rem", background:"#fff", borderBottom:"1px solid rgba(76,71,217,0.1)", position:"sticky", top:0, zIndex:10 },
  backBtn:        { display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:".85rem", fontWeight:600, color:"#14132A", fontFamily:"'DM Sans',sans-serif" },
  addBtn:         { background:"#4C47D9", color:"#fff", border:"none", borderRadius:8, padding:".38rem .9rem", fontSize:".8rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  content:        { maxWidth:760, margin:"0 auto", padding:"1.5rem" },
  summaryRow:     { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"1.2rem" },
  summaryCard:    { background:"#fff", border:"1px solid rgba(76,71,217,0.1)", borderRadius:12, padding:"1rem 1.1rem" },
  searchRow:      { display:"flex", gap:".75rem", marginBottom:".75rem" },
  searchInput:    { width:"100%", padding:".65rem 1rem", borderRadius:10, border:"1.5px solid rgba(76,71,217,0.12)", background:"#fff", fontSize:".85rem", fontFamily:"'DM Sans',sans-serif", outline:"none", color:"#14132A" },
  filterRow:      { display:"flex", gap:".5rem", flexWrap:"wrap", marginBottom:"1rem" },
  filterBtn:      { padding:".35rem .85rem", borderRadius:100, border:"1.5px solid rgba(76,71,217,0.12)", background:"#fff", fontSize:".75rem", fontWeight:600, color:"#9999BB", cursor:"pointer", fontFamily:"'Syne',sans-serif", transition:"all .15s" },
  filterBtnActive:{ background:"#4C47D9", color:"#fff", borderColor:"#4C47D9" },
  listCard:       { background:"#fff", borderRadius:16, border:"1px solid rgba(76,71,217,0.1)", overflow:"hidden" },
  txnRow:         { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1rem 1.2rem", cursor:"pointer", transition:"background .15s" },
  txnIco:         { width:38, height:38, borderRadius:10, background:"#F4F4F9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 },
  badgeSplurge:   { fontSize:".58rem", fontWeight:700, background:"rgba(239,113,77,.12)", color:"#B84A20", padding:"1px 6px", borderRadius:100, marginLeft:6 },
  badgeRefund:    { fontSize:".58rem", fontWeight:700, background:"rgba(29,158,117,.1)", color:"#1D9E75", padding:"1px 6px", borderRadius:100, marginLeft:6 },
  overlay:        { position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:40 },
  drawer:         { position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderRadius:"20px 20px 0 0", padding:"1.2rem 1.5rem 2rem", zIndex:50 },
  drawerBtn:      { padding:".55rem 1.1rem", borderRadius:9, border:"1.5px solid rgba(76,71,217,0.15)", background:"#EEEEFF", color:"#4C47D9", fontSize:".82rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
}