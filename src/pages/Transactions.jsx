import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

const C = { indigo:"#3D39C4", pale:"#EEEEFF", bg:"#F8F8FA", surface:"#FFFFFF", text:"#18172E", muted:"#6B6980", border:"rgba(61,57,196,0.1)" }
const CATS = ["all","food","transport","entertainment","health","utilities","education","shopping","other"]
const fmt  = d => new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })

const CAT_ICONS = { food:"🍔", transport:"🚌", entertainment:"🎬", health:"🏥", utilities:"📱", shopping:"🛒", education:"📚", income:"💳", other:"✦" }

export default function Transactions() {
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const [txns, setTxns]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState("all")
  const [search, setSearch]     = useState("")
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetchTxns()
  }, [user])

  const fetchTxns = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending:false })
      .order("created_at", { ascending:false })

    if (!error) setTxns(data || [])
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!selected) return
    setDeleting(true)
    await supabase.from("transactions").delete().eq("id", selected.id)
    setTxns(prev => prev.filter(t => t.id !== selected.id))
    setSelected(null)
    setDeleting(false)
  }

  const handleToggleRefund = async () => {
    if (!selected) return
    const newVal = !selected.is_refund
    await supabase.from("transactions").update({ is_refund:newVal }).eq("id", selected.id)
    setTxns(prev => prev.map(t => t.id===selected.id ? {...t, is_refund:newVal} : t))
    setSelected(prev => ({ ...prev, is_refund:newVal }))
  }

  const filtered = txns.filter(t =>
    (filter==="all" || t.category===filter) &&
    (t.description||"").toLowerCase().includes(search.toLowerCase())
  )

  const totalIn  = filtered.filter(t => t.amount > 0).reduce((a,b) => a+b.amount, 0)
  const totalOut = filtered.filter(t => t.amount < 0).reduce((a,b) => a+b.amount, 0)

  if (!user) {
    return (
      <div style={s.page}>
        <h1 style={s.pageTitle}>Transactions</h1>
        <div style={s.gateCard}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, marginBottom:".5rem" }}>Sign in to view transactions</div>
          <button onClick={() => navigate("/signin")} style={s.btnPrimary}>Sign in →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div>
          <h1 style={s.pageTitle}>Transactions</h1>
          <p style={s.pageDate}>{txns.length} total</p>
        </div>
        <button onClick={() => navigate("/add-expense")} style={s.btnPrimary}>+ Add expense</button>
      </div>

      <div style={s.content}>
        {/* Summary — only if data exists */}
        {filtered.length > 0 && (
          <div style={s.summaryRow}>
            {[
              { label:"Money in",  val:`+₦${totalIn.toLocaleString()}`,           color:"#1D9E75" },
              { label:"Money out", val:`−₦${Math.abs(totalOut).toLocaleString()}`, color:"#E24B4A" },
              { label:"Net",       val:`₦${(totalIn+totalOut).toLocaleString()}`,  color:C.indigo  },
            ].map((s2,i) => (
              <div key={i} style={s.summaryCard}>
                <div style={{ fontSize:".63rem", color:C.muted, textTransform:"uppercase", letterSpacing:".08em", fontWeight:600, marginBottom:4 }}>{s2.label}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.05rem", color:s2.color }}>{s2.val}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div style={{ position:"relative", marginBottom:".75rem" }}>
          <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} width="14" height="14" fill="none" viewBox="0 0 14 14">
            <circle cx="6" cy="6" r="4.5" stroke="#9999BB" strokeWidth="1.3"/>
            <path d="M9.5 9.5l2.5 2.5" stroke="#9999BB" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:".63rem 1rem .63rem 2.2rem", borderRadius:9, border:`1.5px solid ${C.border}`, background:C.surface, fontSize:".84rem", fontFamily:"'DM Sans',sans-serif", outline:"none", color:C.text }}/>
        </div>

        {/* Category filter */}
        <div style={{ display:"flex", gap:".4rem", flexWrap:"wrap", marginBottom:"1rem" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ padding:".3rem .78rem", borderRadius:100, border:`1.5px solid ${filter===c?C.indigo:C.border}`, background:filter===c?C.indigo:C.surface, fontSize:".72rem", fontWeight:600, color:filter===c?"#fff":C.muted, cursor:"pointer", fontFamily:"'Syne',sans-serif", transition:"all .15s" }}>
              {c==="all"?"All":c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"3rem", color:C.muted, fontSize:".84rem" }}>Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ opacity:.15, fontSize:26, marginBottom:8 }}>↕</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#BBBBCC", fontSize:".86rem" }}>
              {txns.length===0 ? "No transactions yet" : "No results"}
            </div>
            <div style={{ fontSize:".74rem", color:"#CCCCDD", marginTop:4, maxWidth:240, textAlign:"center", lineHeight:1.6 }}>
              {txns.length===0 ? "Add your first expense using the button above." : "Try a different search or filter."}
            </div>
            {txns.length===0 && (
              <button onClick={() => navigate("/add-expense")} style={{ ...s.btnPrimary, marginTop:"1rem" }}>+ Add expense</button>
            )}
          </div>
        ) : (
          <div style={{ background:C.surface, borderRadius:13, border:`1px solid ${C.border}`, overflow:"hidden" }}>
            {filtered.map((t, i) => (
              <motion.div key={t.id}
                initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:i*0.03 }}
                onClick={() => setSelected(t)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".88rem 1.1rem", cursor:"pointer", borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                  <div style={s.txnIco}>{CAT_ICONS[t.category] || "✦"}</div>
                  <div>
                    <div style={{ fontSize:".83rem", fontWeight:500 }}>
                      {t.description}
                      {t.is_splurge && <span style={s.badgeSplurge}>Splurge</span>}
                      {t.is_refund  && <span style={s.badgeRefund}>Refunded</span>}
                    </div>
                    <div style={{ fontSize:".7rem", color:C.muted, marginTop:1 }}>{fmt(t.date)} · {t.category}</div>
                  </div>
                </div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".88rem", color:t.amount>0?"#1D9E75":"#E24B4A" }}>
                  {t.amount>0?"+":"−"}₦{Math.abs(t.amount).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div style={s.overlay} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setSelected(null)}/>
            <motion.div style={s.drawer}
              initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
              transition={{ type:"spring", damping:28, stiffness:300 }}>
              <div style={{ width:32, height:4, borderRadius:100, background:"#E0E0EE", margin:"0 auto 1.3rem" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:13, marginBottom:"1.3rem" }}>
                <div style={{ ...s.txnIco, width:46, height:46, fontSize:20, borderRadius:13 }}>{CAT_ICONS[selected.category]||"✦"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem" }}>{selected.description}</div>
                  <div style={{ fontSize:".74rem", color:C.muted, marginTop:1 }}>{fmt(selected.date)} · {selected.category}</div>
                  {selected.note && <div style={{ fontSize:".74rem", color:C.muted, marginTop:3, fontStyle:"italic" }}>"{selected.note}"</div>}
                </div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.2rem", color:selected.amount>0?"#1D9E75":"#E24B4A" }}>
                  {selected.amount>0?"+":"−"}₦{Math.abs(selected.amount).toLocaleString()}
                </div>
              </div>
              <div style={{ display:"flex", gap:".6rem", flexWrap:"wrap" }}>
                <button onClick={handleToggleRefund}
                  style={{ ...s.drawerBtn, background:"rgba(29,158,117,.07)", color:"#1D9E75", borderColor:"rgba(29,158,117,.2)" }}>
                  {selected.is_refund ? "Remove refund" : "Mark refunded"}
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  style={{ ...s.drawerBtn, background:"rgba(226,75,74,.07)", color:"#E24B4A", borderColor:"rgba(226,75,74,.2)", marginLeft:"auto", opacity:deleting?.6:1 }}>
                  {deleting?"Deleting...":"Delete"}
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
  page:        { padding:"1.8rem 2rem", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" },
  topbar:      { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.4rem", flexWrap:"wrap", gap:".75rem" },
  pageTitle:   { fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:700, letterSpacing:"-.02em", color:C.text },
  pageDate:    { fontSize:".76rem", color:"#AAAACC", marginTop:2 },
  btnPrimary:  { background:C.indigo, color:"#fff", border:"none", borderRadius:9, padding:".4rem 1rem", fontSize:".8rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  content:     { maxWidth:760 },
  summaryRow:  { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"1.1rem" },
  summaryCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:11, padding:".9rem 1rem" },
  txnIco:      { width:36, height:36, borderRadius:10, background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 },
  badgeSplurge:{ fontSize:".56rem", fontWeight:700, background:"rgba(239,113,77,.1)", color:"#B84A20", padding:"1px 6px", borderRadius:100, marginLeft:5 },
  badgeRefund: { fontSize:".56rem", fontWeight:700, background:"rgba(29,158,117,.09)", color:"#1D9E75", padding:"1px 6px", borderRadius:100, marginLeft:5 },
  emptyState:  { textAlign:"center", padding:"3rem 1rem", background:C.surface, border:`1px solid ${C.border}`, borderRadius:13, display:"flex", flexDirection:"column", alignItems:"center" },
  gateCard:    { background:C.surface, border:`1px solid ${C.border}`, borderRadius:13, padding:"3rem 2rem", maxWidth:400, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" },
  overlay:     { position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", zIndex:40 },
  drawer:      { position:"fixed", bottom:0, left:210, right:0, background:C.surface, borderRadius:"18px 18px 0 0", padding:"1.1rem 1.5rem 2rem", zIndex:50 },
  drawerBtn:   { padding:".5rem 1rem", borderRadius:8, border:`1.5px solid ${C.border}`, background:C.pale, color:C.indigo, fontSize:".8rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
}