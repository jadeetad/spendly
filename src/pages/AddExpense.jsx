import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"

const C = { indigo: "#3D39C4", pale: "#EEEEFF", bg: "#F8F8FA", surface: "#fff", text: "#18172E", muted: "#6B6980", border: "rgba(61,57,196,0.1)" }

const CATEGORIES = [
  { id: "food",          label: "Food",         icon: "🍔" },
  { id: "transport",     label: "Transport",     icon: "🚌" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "health",        label: "Health",        icon: "🏥" },
  { id: "utilities",     label: "Utilities",     icon: "📱" },
  { id: "shopping",      label: "Shopping",      icon: "🛒" },
  { id: "education",     label: "Education",     icon: "📚" },
  { id: "other",         label: "Other",         icon: "✦"  },
]

const QUICK_PRESETS = [
  { icon: "🚌", label: "Transport", amount: 1500, cat: "transport" },
  { icon: "🍔", label: "Lunch",     amount: 3000, cat: "food" },
  { icon: "📱", label: "Airtime",   amount: 1000, cat: "utilities" },
  { icon: "☕", label: "Coffee",    amount: 800,  cat: "food" },
  { icon: "🛻", label: "Bolt",      amount: 2200, cat: "transport" },
  { icon: "🍕", label: "Dinner",    amount: 4500, cat: "food" },
]

// Very basic NLP parser for "spent X on Y"
function parseNaturalInput(text) {
  const lower = text.toLowerCase()
  const amtMatch  = lower.match(/(\d[\d,]*)/);
  const amount    = amtMatch ? parseInt(amtMatch[1].replace(/,/g, "")) : null
  const catMap    = { food:["food","lunch","dinner","suya","chicken","rice","eat","kfc","domino","pizza","restaurant"], transport:["bolt","uber","bus","ride","taxi","transport","keke"], entertainment:["netflix","movie","cinema","game","club"], utilities:["airtime","data","dstv","light","electricity"], health:["gym","pharmacy","doctor","hospital","medicine"], shopping:["shoprite","jumia","market","buy","bought"], education:["book","textbook","school","course","class"] }
  let category = "other"
  for (const [cat, words] of Object.entries(catMap)) {
    if (words.some(w => lower.includes(w))) { category = cat; break }
  }
  const descMatch = lower.match(/(?:on|for|at|from)\s+(.+)/)
  const description = descMatch ? descMatch[1].trim() : text.trim()
  return { amount, category, description }
}

export default function AddExpense() {
  const navigate = useNavigate()
  const [mode, setMode]         = useState("manual") // "manual" | "natural"
  const [natural, setNatural]   = useState("")
  const [parsed, setParsed]     = useState(null)
  const [form, setForm]         = useState({ amount: "", description: "", category: "", date: new Date().toISOString().split("T")[0], note: "", type: "expense" })
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [quickDone, setQuickDone] = useState(null)

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError("") }

  const handleNaturalParse = () => {
    const result = parseNaturalInput(natural)
    if (result.amount) {
      setForm({ ...form, amount: result.amount, category: result.category, description: result.description })
      setParsed(result)
      setMode("manual")
    } else {
      setError("Couldn't parse that — try 'spent 3500 on Bolt'")
    }
  }

  const handleQuick = (q) => {
    setQuickDone(q.label)
    setTimeout(() => {
      setQuickDone(null)
      setSuccess(true)
      setForm({ ...form, amount: q.amount, category: q.cat, description: q.label })
    }, 600)
    // TODO: await supabase.from("transactions").insert({ amount: q.amount, category: q.cat, description: q.label, date: new Date().toISOString(), type: "expense" })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) { setError("Please enter a valid amount."); return }
    if (!form.category)    { setError("Please select a category."); return }
    if (!form.description) { setError("Please add a description."); return }
    setLoading(true)
    // TODO: await supabase.from("transactions").insert({ ... })
    setTimeout(() => { setLoading(false); setSuccess(true) }, 900)
  }

  const reset = () => {
    setSuccess(false); setParsed(null); setNatural("")
    setForm({ amount: "", description: "", category: "", date: new Date().toISOString().split("T")[0], note: "", type: "expense" })
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
        <motion.div style={{ textAlign: "center" }} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: C.pale, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem" }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
              <path d="M7 14l4.5 4.5 9.5-10" stroke={C.indigo} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.25rem", fontWeight: 800, marginBottom: ".5rem" }}>Saved!</h2>
          <p style={{ color: C.muted, fontSize: ".86rem", marginBottom: "1.5rem" }}>
            ₦{Number(form.amount).toLocaleString()} logged under{" "}
            {CATEGORIES.find(c => c.id === form.category)?.label || form.category}
          </p>
          <div style={{ display: "flex", gap: ".7rem", justifyContent: "center" }}>
            <button onClick={reset} style={s.btnSecondary}>Add another</button>
            <button onClick={() => navigate("/dashboard")} style={s.btnPrimary}>Dashboard</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif" }}>
      {/* Topbar */}
      <div style={s.topbar}>
        <button onClick={() => navigate("/dashboard")} style={s.backBtn}>
          <svg width="15" height="15" fill="none" viewBox="0 0 15 15"><path d="M9.5 3L4.5 7.5l5 4.5" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem" }}>Add Expense</span>
        <div style={{ width: 50 }}/>
      </div>

      <div style={s.content}>
        {/* Quick presets */}
        <div style={s.block}>
          <div style={s.blockHd}>Quick add</div>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {QUICK_PRESETS.map(q => (
              <motion.button key={q.label} whileTap={{ scale: .93 }} onClick={() => handleQuick(q)}
                style={{ ...s.quickBtn, background: quickDone === q.label ? C.indigo : C.surface, color: quickDone === q.label ? "#fff" : C.text }}>
                <span style={{ fontSize: 15 }}>{q.icon}</span>
                <div>
                  <div style={{ fontSize: ".76rem", fontWeight: 600 }}>{q.label}</div>
                  <div style={{ fontSize: ".65rem", color: quickDone === q.label ? "rgba(255,255,255,.65)" : C.muted }}>₦{q.amount.toLocaleString()}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Natural language input */}
        <div style={s.block}>
          <div style={s.blockHd}>Say it naturally</div>
          <div style={{ display: "flex", gap: ".6rem" }}>
            <input value={natural} onChange={e => { setNatural(e.target.value); setError("") }}
              onKeyDown={e => e.key === "Enter" && handleNaturalParse()}
              placeholder='e.g. "spent 3500 on Bolt" or "4800 for lunch"'
              style={{ ...s.input, flex: 1 }}/>
            <motion.button onClick={handleNaturalParse} whileTap={{ scale: .96 }}
              style={{ ...s.btnPrimary, padding: ".68rem 1.1rem", whiteSpace: "nowrap" }}>
              Parse →
            </motion.button>
          </div>
          {parsed && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: ".6rem", fontSize: ".78rem", color: C.indigo, background: C.pale, borderRadius: 8, padding: ".55rem .8rem" }}>
              Parsed: ₦{parsed.amount?.toLocaleString()} · {parsed.category} · "{parsed.description}" — form filled below ↓
            </motion.div>
          )}
        </div>

        {/* Manual form */}
        <div style={s.block}>
          <div style={s.blockHd}>Manual entry</div>

          {/* Type toggle */}
          <div style={{ display: "flex", background: "#F0F0F8", borderRadius: 9, padding: 3, marginBottom: "1.3rem" }}>
            {["expense","income"].map(t => (
              <button key={t} onClick={() => setForm({ ...form, type: t })}
                style={{ flex: 1, padding: ".48rem", border: "none", borderRadius: 7, fontSize: ".8rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", transition: "all .2s", background: form.type === t ? C.surface : "transparent", color: form.type === t ? (t === "expense" ? "#E24B4A" : "#1D9E75") : "#AAAACC", boxShadow: form.type === t ? "0 1px 4px rgba(0,0,0,0.06)" : "none" }}>
                {t === "expense" ? "− Expense" : "+ Income"}
              </button>
            ))}
          </div>

          {/* Big amount input */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800, color: "#CCCCDD" }}>₦</span>
            <input name="amount" type="number" placeholder="0" value={form.amount} onChange={handleChange}
              style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.8rem", fontWeight: 800, border: "none", outline: "none", background: "transparent", color: C.text, width: "100%", textAlign: "center" }}
              autoFocus/>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <div style={s.fieldWrap}>
              <label style={s.label}>Description</label>
              <input name="description" placeholder="e.g. Chicken Republic lunch" value={form.description} onChange={handleChange} style={s.input}/>
            </div>

            <div style={s.fieldWrap}>
              <label style={s.label}>Category</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: ".45rem" }}>
                {CATEGORIES.map(c => (
                  <motion.button key={c.id} type="button" whileTap={{ scale: .94 }}
                    onClick={() => { setForm({ ...form, category: c.id }); setError("") }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: ".6rem .3rem", borderRadius: 9, border: `1.5px solid ${form.category === c.id ? C.indigo : C.border}`, background: form.category === c.id ? C.pale : "#F9F9FC", cursor: "pointer", color: form.category === c.id ? C.indigo : C.muted, transition: "all .18s" }}>
                    <span style={{ fontSize: 17 }}>{c.icon}</span>
                    <span style={{ fontSize: ".62rem", fontWeight: 600, marginTop: 3 }}>{c.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div style={s.fieldWrap}>
              <label style={s.label}>Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} style={s.input}/>
            </div>

            <div style={s.fieldWrap}>
              <label style={s.label}>Note <span style={{ color: "#AAAACC", fontWeight: 400 }}>(optional)</span></label>
              <textarea name="note" placeholder="Any extra context..." value={form.note} onChange={handleChange}
                style={{ ...s.input, resize: "none", height: 72, paddingTop: ".65rem" }}/>
            </div>

            {error && <div style={s.errorMsg}>{error}</div>}

            <motion.button type="submit" style={{ ...s.btnPrimary, padding: ".82rem", fontSize: ".92rem", opacity: loading ? .7 : 1 }}
              whileHover={{ backgroundColor: "#5854D6" }} whileTap={{ scale: .98 }} disabled={loading}>
              {loading ? "Saving..." : `Save ${form.type}`}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}

const s = {
  topbar:    { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.5rem", background: C.surface, borderBottom: `1px solid ${C.border}` },
  backBtn:   { display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: ".84rem", fontWeight: 600, color: C.text, fontFamily: "'DM Sans',sans-serif" },
  content:   { maxWidth: 560, margin: "0 auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" },
  block:     { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.3rem" },
  blockHd:   { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".82rem", color: C.text, marginBottom: ".85rem" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: ".4rem" },
  label:     { fontSize: ".75rem", fontWeight: 600, color: C.text, fontFamily: "'Syne',sans-serif" },
  input:     { padding: ".68rem .95rem", borderRadius: 9, border: `1.5px solid ${C.border}`, background: "#F9F9FC", fontSize: ".86rem", color: C.text, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%" },
  errorMsg:  { fontSize: ".76rem", color: "#E24B4A", background: "rgba(226,75,74,.07)", border: "1px solid rgba(226,75,74,.18)", borderRadius: 8, padding: ".55rem .85rem" },
  btnPrimary:{ background: C.indigo, color: "#fff", border: "none", borderRadius: 9, padding: ".72rem 1.3rem", fontSize: ".88rem", fontWeight: 700, fontFamily: "'Syne',sans-serif", cursor: "pointer" },
  btnSecondary:{ background: C.pale, color: C.indigo, border: "none", borderRadius: 9, padding: ".72rem 1.3rem", fontSize: ".88rem", fontWeight: 700, fontFamily: "'Syne',sans-serif", cursor: "pointer" },
  quickBtn:  { display: "flex", alignItems: "center", gap: 8, padding: ".6rem .85rem", border: `1px solid ${C.border}`, borderRadius: 9, background: C.surface, cursor: "pointer", transition: "all .18s", fontFamily: "'DM Sans',sans-serif" },
}