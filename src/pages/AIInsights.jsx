import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const C = {
  indigo:"#3D39C4", pale:"#EEEEFF", bg:"#F8F8FA",
  surface:"#FFFFFF", text:"#18172E", muted:"#6B6980",
  border:"rgba(61,57,196,0.1)",
}

const STARTER_INSIGHTS = [
  { type:"warn", icon:"🔥", title:"Food splurge pattern",      body:"You've had 3 food splurges this month — all on weekends. Your weekend food spend is 2.4× your weekday average." },
  { type:"good", icon:"🎉", title:"Best savings month",         body:"March is your best savings month in 6 cycles. You're ₦6,400 below your average monthly spend." },
  { type:"info", icon:"💡", title:"Entertainment creeping up",  body:"Entertainment has been above your 15% baseline for 2 months in a row. Small increases compound quickly." },
  { type:"warn", icon:"📅", title:"End-of-month spending spike", body:"You tend to spend 38% more in the last week of the month. Payday effect detected across 4 months." },
]

const SUGGESTED_PROMPTS = [
  "Why do I keep splurging on food?",
  "Where can I cut spending this month?",
  "What's my biggest money leak?",
  "Am I spending within a healthy range?",
]

export default function AIInsights() {
  const navigate     = useNavigate()
  const { user }     = useAuth()
  const [tab, setTab]         = useState("insights")
  const [persona, setPersona] = useState(user?.persona || "student")
  const [chat, setChat]       = useState([])
  const [input, setInput]     = useState("")
  const [loading, setLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const endRef = useRef(null)

  const SYSTEM = `You are Spendly, an AI behavioral finance assistant embedded in an expense tracker.
The user is a ${persona} in Nigeria. Monthly income context: moderate. 
This month's spending (demo data): ₦84,200 total — Food ₦31,920 (38%), Entertainment ₦18,480 (22%), Transport ₦15,120 (18%), Health ₦10,080 (12%), Utilities ₦8,400 (10%). 3 splurge events detected.
Be warm, concise, non-judgmental. Use ₦. Max 3 sentences. Give specific, actionable advice.`

  const send = async () => {
    if (!input.trim() || loading) return
    const msg = input.trim()
    setInput("")
    setChat(c => [...c, { role:"user", text:msg }])
    setLoading(true)
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:SYSTEM,
          messages:[
            ...chat.map(c => ({ role:c.role, content:c.text })),
            { role:"user", content:msg }
          ]
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || "Let me look into that."
      setChat(c => [...c, { role:"assistant", text:reply }])
    } catch {
      setChat(c => [...c, { role:"assistant", text:"Having trouble connecting — please try again." }])
    }
    setLoading(false)
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }) }, [chat, loading])

  // Not signed in
  if (!user) {
    return (
      <div style={s.page}>
        <div style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>AI Insights</h1>
            <p style={s.pageDate}>Powered by Spendly AI</p>
          </div>
        </div>
        <div style={s.gateCard}>
          <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" stroke={C.indigo} strokeWidth="1.5" strokeOpacity=".2"/>
            <circle cx="20" cy="20" r="10" stroke={C.indigo} strokeWidth="1.5" strokeOpacity=".2" strokeDasharray="3 3"/>
            <circle cx="20" cy="20" r="3.5" fill={C.indigo} fillOpacity=".3"/>
          </svg>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem", color:C.text, marginTop:".75rem" }}>
            Sign in to unlock AI Insights
          </div>
          <p style={{ fontSize:".82rem", color:C.muted, lineHeight:1.65, maxWidth:280, textAlign:"center", margin:".5rem 0 1.2rem" }}>
            Once you sign in and log your first expenses, Spendly AI will start analysing your spending patterns and giving you personalised insights.
          </p>
          <button onClick={() => navigate("/signin")} style={s.gateBtn}>Sign in →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div>
          <h1 style={s.pageTitle}>AI Insights</h1>
          <p style={s.pageDate}>Personalised for you, {user.name.split(" ")[0]}</p>
        </div>
        <div style={{ display:"flex", gap:".6rem", alignItems:"center" }}>
          {!demoMode
            ? <button onClick={() => setDemoMode(true)} style={s.demoBtn}>Preview demo</button>
            : <button onClick={() => setDemoMode(false)} style={{ ...s.demoBtn, color:"#E24B4A", borderColor:"rgba(226,75,74,.2)" }}>Clear demo</button>
          }
          <div style={s.tabGroup}>
            {["insights","chat"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ ...s.tabBtn, ...(tab===t ? s.tabActive : {}) }}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={s.content}>
        {/* Persona selector */}
        <div style={s.personaRow}>
          <span style={{ fontSize:".72rem", color:C.muted, fontWeight:600 }}>Your profile:</span>
          {["student","professional","parent"].map(p => (
            <button key={p} onClick={() => setPersona(p)}
              style={{ ...s.personaBtn, ...(persona===p ? s.personaActive : {}) }}>
              {p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "insights" ? (
            <motion.div key="insights"
              initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
              transition={{ duration:0.22 }}>
              {!demoMode ? (
                <div style={s.emptyInsights}>
                  <div style={{ opacity:.15, fontSize:26, marginBottom:8 }}>✦</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#BBBBCC", fontSize:".88rem" }}>
                    No insights yet
                  </div>
                  <p style={{ fontSize:".76rem", color:"#CCCCDD", maxWidth:240, textAlign:"center", lineHeight:1.6, margin:".4rem 0 1rem" }}>
                    Log at least a week of expenses and your AI insights will appear here automatically.
                  </p>
                  <button onClick={() => navigate("/add-expense")} style={s.gateBtn}>
                    Start logging expenses
                  </button>
                </div>
              ) : (
                <>
                  {/* Score card */}
                  <div style={s.scoreCard}>
                    <div>
                      <div style={{ fontSize:".65rem", color:"rgba(255,255,255,.55)", textTransform:"uppercase", letterSpacing:".08em", fontWeight:600, marginBottom:6 }}>Financial Health Score</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"2.8rem", fontWeight:800, color:"#fff", lineHeight:1 }}>72</div>
                      <div style={{ fontSize:".76rem", color:"rgba(255,255,255,.6)", marginTop:4 }}>Good — 3 areas to improve</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1, maxWidth:200 }}>
                      {[{ l:"Spending control",v:65 },{ l:"Saving rate",v:82 },{ l:"Splurge frequency",v:55 }].map((x,i) => (
                        <div key={i}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:".67rem", color:"rgba(255,255,255,.55)", marginBottom:3 }}>
                            <span>{x.l}</span><span>{x.v}%</span>
                          </div>
                          <div style={{ height:4, background:"rgba(255,255,255,.15)", borderRadius:100 }}>
                            <motion.div style={{ height:"100%", borderRadius:100, background:x.v>70?"#4EE5A0":x.v>55?"#EFD09A":"#FF8080" }}
                              initial={{ width:0 }} animate={{ width:`${x.v}%` }}
                              transition={{ delay:0.2+i*0.1, duration:0.55, ease:"easeOut" }}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:".75rem", marginTop:"1.1rem" }}>
                    {STARTER_INSIGHTS.map((ins, i) => (
                      <motion.div key={i}
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay:0.1+i*0.07 }}
                        style={{ ...s.insightCard, background:ins.type==="warn"?"rgba(239,154,77,.07)":ins.type==="good"?"rgba(29,158,117,.07)":"rgba(61,57,196,.05)", borderColor:ins.type==="warn"?"rgba(239,154,77,.2)":ins.type==="good"?"rgba(29,158,117,.2)":"rgba(61,57,196,.15)" }}>
                        <div style={{ display:"flex", alignItems:"flex-start", gap:11 }}>
                          <span style={{ fontSize:18, flexShrink:0 }}>{ins.icon}</span>
                          <div>
                            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".86rem", marginBottom:4 }}>{ins.title}</div>
                            <p style={{ fontSize:".78rem", color:C.muted, lineHeight:1.6, margin:0 }}>{ins.body}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div key="chat"
              initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
              transition={{ duration:0.22 }}
              style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {/* Suggested prompts */}
              {chat.length === 0 && (
                <div>
                  <div style={{ fontSize:".73rem", color:C.muted, fontWeight:600, marginBottom:".6rem" }}>Try asking:</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:".45rem" }}>
                    {SUGGESTED_PROMPTS.map((p, i) => (
                      <button key={i} onClick={() => setInput(p)}
                        style={{ textAlign:"left", background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:9, padding:".62rem 1rem", fontSize:".82rem", color:C.text, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"border-color .15s" }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div style={{ display:"flex", flexDirection:"column", gap:".8rem", minHeight:200 }}>
                {chat.map((m, i) => (
                  <motion.div key={i} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                    style={{ alignSelf:m.role==="user"?"flex-end":"flex-start", maxWidth:"84%" }}>
                    {m.role==="assistant" && (
                      <div style={{ fontSize:".62rem", fontWeight:700, color:C.indigo, marginBottom:3, fontFamily:"'Syne',sans-serif", textTransform:"uppercase", letterSpacing:".06em" }}>
                        Spendly AI
                      </div>
                    )}
                    <div style={{ background:m.role==="user"?C.indigo:C.surface, color:m.role==="user"?"#fff":C.text, borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px", padding:".72rem .95rem", fontSize:".84rem", lineHeight:1.6, border:m.role==="user"?"none":`1px solid ${C.border}` }}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div style={{ alignSelf:"flex-start", background:C.surface, border:`1px solid ${C.border}`, borderRadius:"12px 12px 12px 4px", padding:".72rem .95rem", fontSize:".84rem", color:C.muted }}>
                    Thinking...
                  </div>
                )}
                <div ref={endRef}/>
              </div>

              {/* Input */}
              <div style={{ display:"flex", gap:".6rem", position:"sticky", bottom:"1.5rem" }}>
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && send()}
                  placeholder="Ask about your spending..."
                  style={{ flex:1, padding:".68rem .95rem", borderRadius:9, border:`1.5px solid ${C.border}`, background:C.surface, fontSize:".84rem", fontFamily:"'DM Sans',sans-serif", outline:"none", color:C.text }}/>
                <motion.button onClick={send} whileTap={{ scale:.95 }}
                  style={{ background:C.indigo, color:"#fff", border:"none", borderRadius:9, padding:".68rem 1.1rem", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".8rem", cursor:"pointer", opacity:loading?.7:1 }}>
                  {loading?"...":"Send"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const s = {
  page:         { padding:"1.8rem 2rem", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" },
  topbar:       { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.4rem", flexWrap:"wrap", gap:".75rem" },
  pageTitle:    { fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:700, letterSpacing:"-.02em", color:C.text },
  pageDate:     { fontSize:".76rem", color:"#AAAACC", marginTop:2 },
  demoBtn:      { background:"transparent", color:C.muted, border:`1px solid ${C.border}`, borderRadius:8, padding:".36rem .85rem", fontSize:".75rem", fontWeight:600, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  tabGroup:     { display:"flex", background:C.bg, borderRadius:8, padding:3, border:`1px solid ${C.border}` },
  tabBtn:       { padding:".3rem .75rem", border:"none", borderRadius:6, fontSize:".74rem", fontWeight:600, cursor:"pointer", background:"transparent", color:C.muted, fontFamily:"'Syne',sans-serif" },
  tabActive:    { background:C.surface, color:C.indigo, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
  content:      { maxWidth:700 },
  personaRow:   { display:"flex", alignItems:"center", gap:".5rem", marginBottom:"1.1rem", flexWrap:"wrap" },
  personaBtn:   { padding:".32rem .85rem", borderRadius:100, border:`1.5px solid ${C.border}`, background:C.surface, fontSize:".73rem", fontWeight:600, color:C.muted, cursor:"pointer", fontFamily:"'Syne',sans-serif", transition:"all .15s" },
  personaActive:{ background:C.indigo, color:"#fff", borderColor:C.indigo },
  gateCard:     { background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"3rem 2rem", display:"flex", flexDirection:"column", alignItems:"center", maxWidth:480 },
  gateBtn:      { background:C.indigo, color:"#fff", border:"none", borderRadius:9, padding:".65rem 1.4rem", fontSize:".86rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  scoreCard:    { background:C.indigo, borderRadius:14, padding:"1.4rem", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"2rem" },
  insightCard:  { border:"1.5px solid", borderRadius:13, padding:"1rem 1.1rem" },
  emptyInsights:{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:13, padding:"3rem 1rem", display:"flex", flexDirection:"column", alignItems:"center" },
}