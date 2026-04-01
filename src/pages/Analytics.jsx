import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

const PERSONAS = ["Student","Professional","Parent"]

const STARTER_INSIGHTS = [
  { type:"warn",  icon:"🔥", title:"Food splurge pattern",   body:"You've had 3 food splurges this month — all on weekends. Your weekend food spend is 2.4× your weekday average." },
  { type:"good",  icon:"🎉", title:"Best savings month",      body:"March is your best savings month in 6 cycles. You're ₦6,400 below your average monthly spend." },
  { type:"info",  icon:"💡", title:"Entertainment creeping up", body:"Entertainment has been above your 15% baseline for 2 months in a row. Small increases compound quickly." },
  { type:"warn",  icon:"📅", title:"End of month spending",   body:"You tend to spend 38% more in the last week of the month. Payday effect detected across 4 months of data." },
]

export default function AIInsights() {
  const navigate    = useNavigate()
  const [persona, setPersona]   = useState("Student")
  const [chat, setChat]         = useState([])
  const [input, setInput]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [tab, setTab]           = useState("insights")
  const endRef = useRef(null)

  const SYSTEM = `You are Spendly, an AI behavioral finance assistant. The user is a ${persona} in Nigeria. 
Their spending this month: ₦84,200 total — Food ₦31,920 (38%), Entertainment ₦18,480 (22%), Transport ₦15,120 (18%), Health ₦10,080 (12%), Utilities ₦8,400 (10%). 3 splurge events. Monthly income: ₦120,000.
Be warm, concise, non-judgmental. Use ₦. Max 3 sentences per reply. Give actionable, specific advice.`

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
          system: SYSTEM,
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

  const PROMPTS = [
    "Why do I keep splurging on food?",
    "How can I reduce my spending this month?",
    "What's my biggest money leak?",
    "Am I saving enough as a student?",
  ]

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <button onClick={() => navigate("/dashboard")} style={s.backBtn}>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" stroke="#14132A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem" }}>AI Insights</div>
        <div style={{ display:"flex", background:"#F4F4F9", borderRadius:8, padding:3 }}>
          {["insights","chat"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:".3rem .8rem", border:"none", borderRadius:6, fontSize:".75rem", fontWeight:600, cursor:"pointer", background:tab===t?"#fff":"transparent", color:tab===t?"#4C47D9":"#9999BB", fontFamily:"'Syne',sans-serif", transition:"all .2s" }}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={s.content}>
        {/* Persona selector */}
        <div style={s.personaRow}>
          <span style={{ fontSize:".75rem", color:"#9999BB", fontWeight:600 }}>Your profile:</span>
          {PERSONAS.map(p => (
            <button key={p} onClick={() => setPersona(p)}
              style={{ ...s.personaBtn, ...(persona===p ? s.personaActive : {}) }}>{p}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "insights" ? (
            <motion.div key="insights" initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:10 }} transition={{ duration:0.25 }}>
              {/* Score card */}
              <div style={s.scoreCard}>
                <div>
                  <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".08em", fontWeight:600, marginBottom:6 }}>Financial Health Score</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"3rem", fontWeight:800, color:"#fff", lineHeight:1 }}>72</div>
                  <div style={{ fontSize:".78rem", color:"rgba(255,255,255,.65)", marginTop:4 }}>Good — 3 areas to improve</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1, maxWidth:200 }}>
                  {[{ l:"Spending control", v:65 },{ l:"Saving rate", v:82 },{ l:"Splurge frequency", v:55 }].map((x,i) => (
                    <div key={i}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:".68rem", color:"rgba(255,255,255,.6)", marginBottom:3 }}>
                        <span>{x.l}</span><span>{x.v}%</span>
                      </div>
                      <div style={{ height:4, background:"rgba(255,255,255,.15)", borderRadius:100 }}>
                        <motion.div style={{ height:"100%", borderRadius:100, background:x.v>70?"#4EE5A0":x.v>55?"#EFD09A":"#FF8080" }}
                          initial={{ width:0 }} animate={{ width:`${x.v}%` }}
                          transition={{ delay:0.2+i*0.1, duration:0.6, ease:"easeOut" }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insight cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:".85rem", marginTop:"1.2rem" }}>
                {STARTER_INSIGHTS.map((ins,i) => (
                  <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.1+i*0.07 }}
                    style={{ ...s.insightCard, background: ins.type==="warn"?"rgba(239,154,77,.07)":ins.type==="good"?"rgba(29,158,117,.07)":"rgba(76,71,217,.05)", borderColor: ins.type==="warn"?"rgba(239,154,77,.2)":ins.type==="good"?"rgba(29,158,117,.2)":"rgba(76,71,217,.15)" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                      <div style={{ fontSize:20, flexShrink:0 }}>{ins.icon}</div>
                      <div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".88rem", marginBottom:4 }}>{ins.title}</div>
                        <p style={{ fontSize:".8rem", color:"#6B6980", lineHeight:1.65, margin:0 }}>{ins.body}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
              transition={{ duration:0.25 }}
              style={s.chatWrap}>
              {/* Suggested prompts */}
              {chat.length === 0 && (
                <div style={{ marginBottom:"1.2rem" }}>
                  <div style={{ fontSize:".75rem", color:"#9999BB", fontWeight:600, marginBottom:".6rem" }}>Suggested questions</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:".5rem" }}>
                    {PROMPTS.map((p,i) => (
                      <button key={i} onClick={() => setInput(p)}
                        style={{ textAlign:"left", background:"#fff", border:"1.5px solid rgba(76,71,217,0.12)", borderRadius:10, padding:".65rem 1rem", fontSize:".82rem", color:"#14132A", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"border-color .15s" }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div style={s.messages}>
                {chat.map((m,i) => (
                  <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    style={{ alignSelf:m.role==="user"?"flex-end":"flex-start", maxWidth:"82%" }}>
                    {m.role==="assistant" && (
                      <div style={{ fontSize:".65rem", fontWeight:700, color:"#4C47D9", marginBottom:3, fontFamily:"'Syne',sans-serif", textTransform:"uppercase", letterSpacing:".06em" }}>Spendly AI</div>
                    )}
                    <div style={{ background:m.role==="user"?"#4C47D9":"#fff", color:m.role==="user"?"#fff":"#14132A", borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px", padding:".75rem 1rem", fontSize:".85rem", lineHeight:1.6, border:m.role==="user"?"none":"1px solid rgba(76,71,217,0.1)" }}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div style={{ alignSelf:"flex-start", background:"#fff", border:"1px solid rgba(76,71,217,0.1)", borderRadius:"12px 12px 12px 4px", padding:".75rem 1rem", fontSize:".85rem", color:"#9999BB" }}>Thinking...</div>
                )}
                <div ref={endRef}/>
              </div>

              {/* Input */}
              <div style={s.chatInput}>
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && send()}
                  placeholder="Ask about your spending..."
                  style={{ flex:1, padding:".72rem 1rem", borderRadius:10, border:"1.5px solid rgba(76,71,217,0.15)", background:"#fff", fontSize:".85rem", fontFamily:"'DM Sans',sans-serif", outline:"none", color:"#14132A" }}/>
                <motion.button onClick={send} whileTap={{ scale:.95 }}
                  style={{ background:"#4C47D9", color:"#fff", border:"none", borderRadius:10, padding:".72rem 1.2rem", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".82rem", cursor:"pointer" }}>
                  {loading ? "..." : "Send"}
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
  page:         { minHeight:"100vh", background:"#F4F4F9", fontFamily:"'DM Sans',sans-serif" },
  topbar:       { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.2rem 1.5rem", background:"#fff", borderBottom:"1px solid rgba(76,71,217,0.1)", position:"sticky", top:0, zIndex:10 },
  backBtn:      { display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:".85rem", fontWeight:600, color:"#14132A", fontFamily:"'DM Sans',sans-serif" },
  content:      { maxWidth:720, margin:"0 auto", padding:"1.5rem" },
  personaRow:   { display:"flex", alignItems:"center", gap:".5rem", marginBottom:"1.2rem", flexWrap:"wrap" },
  personaBtn:   { padding:".35rem .9rem", borderRadius:100, border:"1.5px solid rgba(76,71,217,0.15)", background:"#fff", fontSize:".75rem", fontWeight:600, color:"#9999BB", cursor:"pointer", fontFamily:"'Syne',sans-serif", transition:"all .15s" },
  personaActive:{ background:"#4C47D9", color:"#fff", borderColor:"#4C47D9" },
  scoreCard:    { background:"#4C47D9", borderRadius:16, padding:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"2rem" },
  insightCard:  { border:"1.5px solid", borderRadius:14, padding:"1.1rem 1.2rem" },
  chatWrap:     { display:"flex", flexDirection:"column", gap:"1rem" },
  messages:     { display:"flex", flexDirection:"column", gap:".85rem", minHeight:200 },
  chatInput:    { display:"flex", gap:".75rem", position:"sticky", bottom:"1.5rem" },
}