import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

const C = { indigo:"#3D39C4", pale:"#EEEEFF", bg:"#F8F8FA", surface:"#fff", text:"#18172E", muted:"#6B6980", border:"rgba(61,57,196,0.1)" }

const CATEGORIES = [
  { id:"food",          label:"Food",          icon:"🍔" },
  { id:"transport",     label:"Transport",      icon:"🚌" },
  { id:"entertainment", label:"Entertainment",  icon:"🎬" },
  { id:"health",        label:"Health",         icon:"🏥" },
  { id:"utilities",     label:"Utilities",      icon:"📱" },
  { id:"shopping",      label:"Shopping",       icon:"🛒" },
  { id:"education",     label:"Education",      icon:"📚" },
  { id:"other",         label:"Other",          icon:"✦"  },
]

const QUICK_PRESETS = [
  { icon:"🚌", label:"Transport", amount:1500, cat:"transport" },
  { icon:"🍔", label:"Food",      amount:3000, cat:"food"      },
  { icon:"📱", label:"Airtime",   amount:1000, cat:"utilities" },
  { icon:"☕", label:"Coffee",    amount:800,  cat:"food"      },
  { icon:"🛻", label:"Bolt",      amount:2200, cat:"transport" },
  { icon:"🍕", label:"Dinner",    amount:4500, cat:"food"      },
]

function parseNatural(text) {
  const lower     = text.toLowerCase()
  const amtMatch  = lower.match(/(\d[\d,]*)/)
  const amount    = amtMatch ? parseInt(amtMatch[1].replace(/,/g,"")) : null
  const catMap    = {
    food:          ["food","lunch","dinner","suya","chicken","rice","eat","kfc","domino","pizza","restaurant","shawarma","eatery"],
    transport:     ["bolt","uber","bus","ride","taxi","transport","keke","okada","danfo"],
    entertainment: ["netflix","showmax","movie","cinema","game","club","bar","streaming"],
    utilities:     ["airtime","data","dstv","gotv","light","electricity","nepa","wifi"],
    health:        ["gym","pharmacy","doctor","hospital","medicine","drug","clinic"],
    shopping:      ["shoprite","jumia","konga","market","buy","bought","clothes","shoes"],
    education:     ["book","textbook","school","course","class","tuition","lecture"],
  }
  let category = "other"
  for (const [cat, words] of Object.entries(catMap)) {
    if (words.some(w => lower.includes(w))) { category = cat; break }
  }
  const descMatch = lower.match(/(?:on|for|at|from)\s+(.+)/)
  const description = descMatch ? descMatch[1].trim() : text.trim()
  return { amount, category, description }
}

export default function AddExpense() {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [natural, setNatural]   = useState("")
  const [parsed, setParsed]     = useState(null)
  const [form, setForm]         = useState({ amount:"", description:"", category:"", date:new Date().toISOString().split("T")[0], note:"", type:"expense" })
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(null)
  const [quickLoading, setQuickLoading] = useState(null)

  const handleChange = e => { setForm({ ...form, [e.target.name]:e.target.value }); setError("") }

  const saveTransaction = async (txn) => {
    if (!user) { navigate("/signin"); return null }
    const { data, error: dbError } = await supabase.from("transactions").insert({
      user_id:     user.id,
      amount:      txn.type === "expense" ? -Math.abs(txn.amount) : Math.abs(txn.amount),
      type:        txn.type,
      category:    txn.category,
      description: txn.description,
      note:        txn.note || null,
      date:        txn.date,
    }).select().single()
    if (dbError) throw dbError
    return data
  }

  const handleQuick = async (q) => {
    setQuickLoading(q.label)
    try {
      await saveTransaction({ amount:q.amount, type:"expense", category:q.cat, description:q.label, date:new Date().toISOString().split("T")[0] })
      setSuccess({ amount:q.amount, category:q.label })
    } catch (e) {
      setError(e.message)
    }
    setQuickLoading(null)
  }

  const handleNaturalParse = () => {
    const result = parseNatural(natural)
    if (result.amount) {
      setForm({ ...form, amount:result.amount, category:result.category, description:result.description })
      setParsed(result)
    } else {
      setError("Couldn't parse that — try 'spent 3500 on Bolt'")
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) { setError("Please enter a valid amount."); return }
    if (!form.category)    { setError("Please select a category."); return }
    if (!form.description) { setError("Please add a description."); return }
    setLoading(true)
    try {
      await saveTransaction({ ...form, amount:Number(form.amount) })
      setSuccess({ amount:Number(form.amount), category:CATEGORIES.find(c=>c.id===form.category)?.label })
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const reset = () => {
    setSuccess(null); setParsed(null); setNatural("")
    setForm({ amount:"", description:"", category:"", date:new Date().toISOString().split("T")[0], note:"", type:"expense" })
  }

  if (success) {
    return (
      <div style={{ padding:"1.8rem 2rem", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
        <motion.div style={{ textAlign:"center" }} initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ type:"spring", stiffness:200 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:C.pale, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.1rem" }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 26 26">
              <path d="M6.5 13l4 4 9-10" stroke={C.indigo} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, marginBottom:".5rem" }}>Saved!</h2>
          <p style={{ color:C.muted, fontSize:".85rem", marginBottom:"1.4rem" }}>
            ₦{Number(success.amount).toLocaleString()} logged under {success.category}
          </p>
          <div style={{ display:"flex", gap:".7rem", justifyContent:"center" }}>
            <button onClick={reset} style={{ background:C.pale, color:C.indigo, border:"none", borderRadius:9, padding:".65rem 1.3rem", fontSize:".86rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" }}>Add another</button>
            <button onClick={() => navigate("/dashboard")} style={{ background:C.indigo, color:"#fff", border:"none", borderRadius:9, padding:".65rem 1.3rem", fontSize:".86rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" }}>Dashboard</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", padding:"1.8rem 2rem" }}>
      <div style={{ marginBottom:"1.4rem" }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:700, letterSpacing:"-.02em", color:C.text }}>Add Expense</h1>
        <p style={{ fontSize:".76rem", color:"#AAAACC", marginTop:2 }}>Log a new transaction</p>
      </div>

      <div style={{ maxWidth:560, display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        {/* Quick presets */}
        <div style={s.block}>
          <div style={s.blockHd}>Quick add</div>
          <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap" }}>
            {QUICK_PRESETS.map(q => (
              <motion.button key={q.label} whileTap={{ scale:.93 }}
                onClick={() => handleQuick(q)}
                disabled={!!quickLoading}
                style={{ ...s.quickBtn, background:quickLoading===q.label?C.indigo:C.surface, color:quickLoading===q.label?"#fff":C.text, opacity:quickLoading&&quickLoading!==q.label?.5:1 }}>
                <span style={{ fontSize:15 }}>{q.icon}</span>
                <div>
                  <div style={{ fontSize:".76rem", fontWeight:600 }}>{q.label}</div>
                  <div style={{ fontSize:".65rem", color:quickLoading===q.label?"rgba(255,255,255,.6)":C.muted }}>₦{q.amount.toLocaleString()}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Natural language */}
        <div style={s.block}>
          <div style={s.blockHd}>Say it naturally</div>
          <div style={{ display:"flex", gap:".6rem" }}>
            <input value={natural} onChange={e => { setNatural(e.target.value); setError("") }}
              onKeyDown={e => e.key==="Enter" && handleNaturalParse()}
              placeholder='e.g. "spent 3500 on Bolt" or "4800 for lunch"'
              style={{ ...s.input, flex:1 }}/>
            <motion.button onClick={handleNaturalParse} whileTap={{ scale:.96 }}
              style={{ background:C.indigo, color:"#fff", border:"none", borderRadius:9, padding:".68rem 1rem", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".8rem", cursor:"pointer", whiteSpace:"nowrap" }}>
              Parse →
            </motion.button>
          </div>
          {parsed && (
            <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
              style={{ marginTop:".6rem", fontSize:".76rem", color:C.indigo, background:C.pale, borderRadius:8, padding:".5rem .8rem" }}>
              Parsed: ₦{parsed.amount?.toLocaleString()} · {parsed.category} · "{parsed.description}" — form filled below ↓
            </motion.div>
          )}
        </div>

        {/* Manual form */}
        <div style={s.block}>
          <div style={s.blockHd}>Manual entry</div>

          <div style={{ display:"flex", background:"#F0F0F8", borderRadius:9, padding:3, marginBottom:"1.2rem" }}>
            {["expense","income"].map(t => (
              <button key={t} onClick={() => setForm({...form,type:t})}
                style={{ flex:1, padding:".46rem", border:"none", borderRadius:7, fontSize:".8rem", fontWeight:700, cursor:"pointer", fontFamily:"'Syne',sans-serif", background:form.type===t?C.surface:"transparent", color:form.type===t?(t==="expense"?"#E24B4A":"#1D9E75"):"#AAAACC", boxShadow:form.type===t?"0 1px 4px rgba(0,0,0,0.06)":"none", transition:"all .2s" }}>
                {t==="expense"?"− Expense":"+ Income"}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".4rem", marginBottom:"1.4rem" }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800, color:"#CCCCDD" }}>₦</span>
            <input name="amount" type="number" placeholder="0" value={form.amount} onChange={handleChange}
              style={{ fontFamily:"'Syne',sans-serif", fontSize:"2.6rem", fontWeight:800, border:"none", outline:"none", background:"transparent", color:C.text, width:"100%", textAlign:"center" }} autoFocus/>
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div style={s.fieldWrap}>
              <label style={s.label}>Description</label>
              <input name="description" placeholder="e.g. Chicken Republic lunch" value={form.description} onChange={handleChange} style={s.input}/>
            </div>

            <div style={s.fieldWrap}>
              <label style={s.label}>Category</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:".45rem" }}>
                {CATEGORIES.map(c => (
                  <motion.button key={c.id} type="button" whileTap={{ scale:.94 }}
                    onClick={() => { setForm({...form,category:c.id}); setError("") }}
                    style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:".6rem .3rem", borderRadius:9, border:`1.5px solid ${form.category===c.id?C.indigo:C.border}`, background:form.category===c.id?C.pale:"#F9F9FC", cursor:"pointer", color:form.category===c.id?C.indigo:C.muted, transition:"all .18s" }}>
                    <span style={{ fontSize:17 }}>{c.icon}</span>
                    <span style={{ fontSize:".62rem", fontWeight:600, marginTop:3 }}>{c.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div style={s.fieldWrap}>
              <label style={s.label}>Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} style={s.input}/>
            </div>

            <div style={s.fieldWrap}>
              <label style={s.label}>Note <span style={{ color:"#AAAACC", fontWeight:400 }}>(optional)</span></label>
              <textarea name="note" placeholder="Any extra context..." value={form.note} onChange={handleChange}
                style={{ ...s.input, resize:"none", height:70, paddingTop:".65rem" }}/>
            </div>

            {error && <div style={s.errorMsg}>{error}</div>}

            <motion.button type="submit" style={{ background:C.indigo, color:"#fff", border:"none", borderRadius:9, padding:".8rem", fontSize:".9rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer", opacity:loading?.7:1 }}
              whileHover={{ backgroundColor:"#5854D6" }} whileTap={{ scale:.98 }} disabled={loading}>
              {loading?"Saving...": `Save ${form.type}`}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}

const s = {
  block:     { background:C.surface, border:`1px solid ${C.border}`, borderRadius:13, padding:"1.2rem" },
  blockHd:   { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".8rem", color:C.text, marginBottom:".8rem" },
  fieldWrap: { display:"flex", flexDirection:"column", gap:".38rem" },
  label:     { fontSize:".74rem", fontWeight:600, color:C.text, fontFamily:"'Syne',sans-serif" },
  input:     { padding:".65rem .95rem", borderRadius:9, border:`1.5px solid ${C.border}`, background:"#F9F9FC", fontSize:".85rem", color:C.text, fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%" },
  errorMsg:  { fontSize:".75rem", color:"#E24B4A", background:"rgba(226,75,74,.07)", border:"1px solid rgba(226,75,74,.18)", borderRadius:8, padding:".5rem .85rem" },
  quickBtn:  { display:"flex", alignItems:"center", gap:9, padding:".58rem .82rem", border:`1px solid ${C.border}`, borderRadius:9, background:C.surface, cursor:"pointer", transition:"all .18s", fontFamily:"'DM Sans',sans-serif" },
}