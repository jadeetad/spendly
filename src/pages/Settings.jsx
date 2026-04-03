import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

const C = { indigo:"#3D39C4", pale:"#EEEEFF", bg:"#F8F8FA", surface:"#FFFFFF", text:"#18172E", muted:"#6B6980", border:"rgba(61,57,196,0.1)" }

const PERSONAS = [
  { id:"student",      label:"Student",      icon:"🎓" },
  { id:"professional", label:"Professional",  icon:"💼" },
  { id:"parent",       label:"Parent",        icon:"🏠" },
  { id:"other",        label:"Other",         icon:"✦"  },
]

function Toggle({ on, onClick }) {
  return (
    <motion.div onClick={onClick}
      style={{ width:40, height:22, borderRadius:100, background:on?C.indigo:"#E0E0EE", position:"relative", cursor:"pointer", flexShrink:0, transition:"background .2s" }}>
      <motion.div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3 }}
        animate={{ left:on?21:3 }} transition={{ type:"spring", stiffness:400, damping:25 }}/>
    </motion.div>
  )
}

function Section({ title, sub, children }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:13, padding:"1.3rem", marginBottom:"1.1rem" }}>
      <div style={{ marginBottom:"1rem" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".92rem" }}>{title}</div>
        {sub && <div style={{ fontSize:".73rem", color:C.muted, marginTop:2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const navigate              = useNavigate()
  const { user, signOut, refreshUser } = useAuth()

  const [profile, setProfile] = useState({ name:"", persona:"student" })
  const [budgets, setBudgets] = useState({ food:0, transport:0, entertainment:0, health:0, utilities:0 })
  const [notifs, setNotifs]   = useState({ splurge:true, weekly:true, monthly:false, tips:false })
  const [currency, setCurrency] = useState("NGN")
  const [saved, setSaved]     = useState(false)
  const [saving, setSaving]   = useState(false)

  // Load existing profile + budgets on mount
  useEffect(() => {
    if (!user) return
    setProfile({ name:user.name||"", persona:user.persona||"student" })
    loadBudgets()
  }, [user])

  const loadBudgets = async () => {
    const { data } = await supabase.from("budgets").select("*").eq("user_id", user.id)
    if (data && data.length > 0) {
      const mapped = {}
      data.forEach(b => { mapped[b.category] = b.amount })
      setBudgets(prev => ({ ...prev, ...mapped }))
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    // Update profile
    await supabase.from("profiles").upsert({
      id:      user.id,
      name:    profile.name,
      persona: profile.persona,
      currency,
    })

    // Upsert budgets
    const budgetRows = Object.entries(budgets).map(([cat, amt]) => ({
      user_id:  user.id,
      category: cat,
      amount:   Number(amt) || 0,
    }))
    await supabase.from("budgets").upsert(budgetRows, { onConflict:"user_id,category" })

    await refreshUser()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  if (!user) {
    return (
      <div style={s.page}>
        <h1 style={s.pageTitle}>Settings</h1>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:13, padding:"3rem 2rem", maxWidth:420, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, marginBottom:".5rem" }}>Sign in to access settings</div>
          <button onClick={() => navigate("/signin")} style={s.btnPrimary}>Sign in →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div>
          <h1 style={s.pageTitle}>Settings</h1>
          <p style={s.pageDate}>Manage your account and preferences</p>
        </div>
        <motion.button onClick={handleSave} disabled={saving} whileTap={{ scale:.97 }}
          style={{ ...s.btnPrimary, background:saved?"#1D9E75":C.indigo, transition:"background .3s", opacity:saving?.7:1 }}>
          {saving?"Saving...":saved?"✓ Saved":"Save changes"}
        </motion.button>
      </div>

      <div style={{ maxWidth:640 }}>
        {/* Profile */}
        <Section title="Profile" sub="Your personal details">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".9rem" }}>
            <div style={s.fieldWrap}>
              <label style={s.label}>Full name</label>
              <input value={profile.name} onChange={e => setProfile({...profile,name:e.target.value})} placeholder="Your name" style={s.input}/>
            </div>
            <div style={s.fieldWrap}>
              <label style={s.label}>Email</label>
              <input value={user.email} disabled style={{ ...s.input, background:"#F4F4F9", color:C.muted }}/>
            </div>
          </div>
        </Section>

        {/* Persona */}
        <Section title="Profile type" sub="Affects how AI personalises insights for you">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:".6rem" }}>
            {PERSONAS.map(p => (
              <button key={p.id} onClick={() => setProfile({...profile,persona:p.id})}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:".8rem .4rem", border:`1.5px solid ${profile.persona===p.id?C.indigo:C.border}`, borderRadius:11, background:profile.persona===p.id?C.pale:C.bg, cursor:"pointer", color:profile.persona===p.id?C.indigo:C.muted, transition:"all .18s" }}>
                <span style={{ fontSize:18 }}>{p.icon}</span>
                <span style={{ fontSize:".72rem", fontWeight:600, marginTop:3 }}>{p.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Budgets */}
        <Section title="Monthly budgets" sub="Soft limits per category — AI alerts you when you're close">
          <div style={{ display:"flex", flexDirection:"column", gap:".8rem" }}>
            {Object.keys(budgets).map(key => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                <div style={{ width:115, fontSize:".8rem", fontWeight:500, textTransform:"capitalize", color:C.text }}>{key}</div>
                <div style={{ position:"relative", flex:1 }}>
                  <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:".82rem", color:C.muted, fontWeight:600 }}>₦</span>
                  <input type="number" value={budgets[key]||""} placeholder="0"
                    onChange={e => setBudgets({...budgets,[key]:e.target.value})}
                    style={{ ...s.input, paddingLeft:"1.75rem" }}/>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" sub="Choose what Spendly alerts you about">
          <div style={{ display:"flex", flexDirection:"column", gap:".9rem" }}>
            {[
              { key:"splurge", label:"Splurge alerts",  sub:"When a transaction is flagged as unusual"  },
              { key:"weekly",  label:"Weekly summary",   sub:"Every Sunday — your week in numbers"       },
              { key:"monthly", label:"Monthly report",   sub:"First of the month — full breakdown"       },
              { key:"tips",    label:"AI spending tips", sub:"Personalised suggestions from Spendly AI"  },
            ].map(n => (
              <div key={n.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem" }}>
                <div>
                  <div style={{ fontSize:".84rem", fontWeight:500 }}>{n.label}</div>
                  <div style={{ fontSize:".71rem", color:C.muted, marginTop:1 }}>{n.sub}</div>
                </div>
                <Toggle on={notifs[n.key]} onClick={() => setNotifs({...notifs,[n.key]:!notifs[n.key]})}/>
              </div>
            ))}
          </div>
        </Section>

        {/* Currency */}
        <Section title="Currency" sub="All amounts display in this currency">
          <div style={{ display:"flex", gap:".5rem" }}>
            {["NGN","USD","GBP","EUR"].map(c => (
              <button key={c} onClick={() => setCurrency(c)}
                style={{ padding:".38rem .88rem", border:`1.5px solid ${currency===c?C.indigo:C.border}`, borderRadius:8, background:currency===c?C.pale:"transparent", fontSize:".8rem", fontWeight:700, color:currency===c?C.indigo:C.muted, cursor:"pointer", fontFamily:"'Syne',sans-serif", transition:"all .15s" }}>
                {c}
              </button>
            ))}
          </div>
        </Section>

        {/* Account */}
        <Section title="Account" sub="">
          <div style={{ display:"flex", flexDirection:"column", gap:".6rem" }}>
            <button onClick={handleSignOut}
              style={{ padding:".62rem 1rem", border:`1.5px solid ${C.border}`, borderRadius:9, background:"transparent", color:C.muted, fontSize:".84rem", fontWeight:600, fontFamily:"'Syne',sans-serif", cursor:"pointer", textAlign:"left" }}>
              Sign out
            </button>
            <button
              style={{ padding:".62rem 1rem", border:"1.5px solid rgba(226,75,74,.2)", borderRadius:9, background:"rgba(226,75,74,.05)", color:"#E24B4A", fontSize:".84rem", fontWeight:600, fontFamily:"'Syne',sans-serif", cursor:"pointer", textAlign:"left" }}>
              Delete account
            </button>
          </div>
        </Section>
      </div>
    </div>
  )
}

const s = {
  page:      { padding:"1.8rem 2rem", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" },
  topbar:    { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.4rem", flexWrap:"wrap", gap:".75rem" },
  pageTitle: { fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:700, letterSpacing:"-.02em", color:C.text },
  pageDate:  { fontSize:".76rem", color:"#AAAACC", marginTop:2 },
  btnPrimary:{ background:C.indigo, color:"#fff", border:"none", borderRadius:9, padding:".42rem 1.1rem", fontSize:".82rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  fieldWrap: { display:"flex", flexDirection:"column", gap:".38rem" },
  label:     { fontSize:".74rem", fontWeight:600, color:C.text, fontFamily:"'Syne',sans-serif" },
  input:     { padding:".65rem .95rem", borderRadius:9, border:`1.5px solid ${C.border}`, background:C.bg, fontSize:".84rem", color:C.text, fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%" },
}