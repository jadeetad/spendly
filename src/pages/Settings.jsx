import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function Settings() {
  const navigate = useNavigate()
  const [profile, setProfile]   = useState({ name:"", email:"", persona:"student" })
  const [budgets, setBudgets]   = useState({ food:40000, transport:20000, entertainment:15000, health:12000, utilities:10000 })
  const [notifs, setNotifs]     = useState({ splurge:true, weekly:true, monthly:true, tips:false })
  const [currency, setCurrency] = useState("NGN")
  const [saved, setSaved]       = useState(false)

  const handleSave = () => {
    // TODO: save to Supabase
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const PERSONAS = [
    { id:"student",      label:"Student",      icon:"🎓" },
    { id:"professional", label:"Professional",  icon:"💼" },
    { id:"parent",       label:"Parent",        icon:"🏠" },
    { id:"other",        label:"Other",         icon:"✦"  },
  ]

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <button onClick={() => navigate("/dashboard")} style={s.backBtn}>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" stroke="#14132A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem" }}>Settings</div>
        <motion.button onClick={handleSave} whileTap={{ scale:.97 }}
          style={{ ...s.saveBtn, background:saved?"#1D9E75":"#4C47D9" }}>
          {saved ? "✓ Saved" : "Save changes"}
        </motion.button>
      </div>

      <div style={s.content}>

        {/* Profile */}
        <Section title="Profile" sub="Your personal details">
          <div style={{ display:"flex", alignItems:"center", gap:"1.2rem", marginBottom:"1.2rem" }}>
            <div style={s.avatar}>
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                <circle cx="14" cy="10" r="6" stroke="#9999BB" strokeWidth="1.6"/>
                <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#9999BB" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".92rem", color:"#AAAACC" }}>No photo</div>
              <div style={{ fontSize:".75rem", color:"#CCCCDD" }}>Sign in to set a profile photo</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            <Field label="Full name" name="name" placeholder="Your name" value={profile.name} onChange={e => setProfile({...profile,name:e.target.value})}/>
            <Field label="Email" name="email" type="email" placeholder="your@email.com" value={profile.email} onChange={e => setProfile({...profile,email:e.target.value})}/>
          </div>
        </Section>

        {/* Persona */}
        <Section title="Your Profile Type" sub="Affects how AI personalises insights for you">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:".75rem" }}>
            {PERSONAS.map(p => (
              <button key={p.id} onClick={() => setProfile({...profile,persona:p.id})}
                style={{ ...s.personaBtn, ...(profile.persona===p.id ? s.personaActive : {}) }}>
                <span style={{ fontSize:20 }}>{p.icon}</span>
                <span style={{ fontSize:".74rem", fontWeight:600, marginTop:4 }}>{p.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Budgets */}
        <Section title="Monthly Budgets" sub="Set soft limits per category — Spendly will alert you when you're close">
          <div style={{ display:"flex", flexDirection:"column", gap:".85rem" }}>
            {Object.entries(budgets).map(([key, val]) => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                <div style={{ width:130, fontSize:".8rem", fontWeight:500, textTransform:"capitalize" }}>{key}</div>
                <div style={{ position:"relative", flex:1 }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:".82rem", color:"#9999BB", fontFamily:"'Syne',sans-serif", fontWeight:600 }}>₦</span>
                  <input type="number" value={val}
                    onChange={e => setBudgets({...budgets,[key]:Number(e.target.value)})}
                    style={{ ...s.input, paddingLeft:"1.8rem" }}/>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" sub="Choose what Spendly notifies you about">
          <div style={{ display:"flex", flexDirection:"column", gap:".85rem" }}>
            {[
              { key:"splurge", label:"Splurge alerts",         sub:"When a transaction is flagged as unusual" },
              { key:"weekly",  label:"Weekly summary",          sub:"Every Sunday — your week in review" },
              { key:"monthly", label:"Monthly report",          sub:"First of the month — full breakdown" },
              { key:"tips",    label:"AI spending tips",        sub:"Personalised suggestions from Spendly AI" },
            ].map(n => (
              <div key={n.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:".85rem", fontWeight:500 }}>{n.label}</div>
                  <div style={{ fontSize:".74rem", color:"#9999BB", marginTop:1 }}>{n.sub}</div>
                </div>
                <Toggle on={notifs[n.key]} onClick={() => setNotifs({...notifs,[n.key]:!notifs[n.key]})}/>
              </div>
            ))}
          </div>
        </Section>

        {/* Currency */}
        <Section title="Currency" sub="All amounts will be displayed in this currency">
          <div style={{ display:"flex", gap:".5rem" }}>
            {["NGN","USD","GBP","EUR"].map(c => (
              <button key={c} onClick={() => setCurrency(c)}
                style={{ ...s.currencyBtn, ...(currency===c ? s.currencyActive : {}) }}>{c}</button>
            ))}
          </div>
        </Section>

        {/* Danger zone */}
        <Section title="Account" sub="">
          <div style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
            <button style={{ ...s.dangerBtn, color:"#6B6980", borderColor:"rgba(76,71,217,0.15)", background:"transparent" }}>
              Sign out
            </button>
            <button style={s.dangerBtn}>Delete account</button>
          </div>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, sub, children }) {
  return (
    <motion.div style={st.section} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
      <div style={{ marginBottom:"1.1rem" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".95rem" }}>{title}</div>
        {sub && <div style={{ fontSize:".76rem", color:"#9999BB", marginTop:2 }}>{sub}</div>}
      </div>
      {children}
    </motion.div>
  )
}

function Field({ label, name, type="text", placeholder, value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:".4rem" }}>
      <label style={{ fontSize:".76rem", fontWeight:600, color:"#14132A", fontFamily:"'Syne',sans-serif" }}>{label}</label>
      <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ padding:".68rem 1rem", borderRadius:10, border:"1.5px solid rgba(76,71,217,0.15)", background:"#F9F9FC", fontSize:".86rem", color:"#14132A", fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%" }}/>
    </div>
  )
}

function Toggle({ on, onClick }) {
  return (
    <motion.div onClick={onClick}
      style={{ width:42, height:24, borderRadius:100, background:on?"#4C47D9":"#E0E0EE", position:"relative", cursor:"pointer", flexShrink:0, transition:"background .2s" }}>
      <motion.div
        style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3 }}
        animate={{ left: on ? 21 : 3 }}
        transition={{ type:"spring", stiffness:400, damping:25 }}/>
    </motion.div>
  )
}

const s = {
  page:         { minHeight:"100vh", background:"#F4F4F9", fontFamily:"'DM Sans',sans-serif" },
  topbar:       { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.2rem 1.5rem", background:"#fff", borderBottom:"1px solid rgba(76,71,217,0.1)", position:"sticky", top:0, zIndex:10 },
  backBtn:      { display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:".85rem", fontWeight:600, color:"#14132A", fontFamily:"'DM Sans',sans-serif" },
  saveBtn:      { color:"#fff", border:"none", borderRadius:9, padding:".42rem 1rem", fontSize:".82rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer", transition:"background .3s" },
  content:      { maxWidth:680, margin:"0 auto", padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1.2rem" },
  input:        { padding:".68rem 1rem", borderRadius:10, border:"1.5px solid rgba(76,71,217,0.15)", background:"#F9F9FC", fontSize:".86rem", color:"#14132A", fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%" },
  avatar:       { width:60, height:60, borderRadius:"50%", background:"#F0F0F8", border:"1.5px solid rgba(76,71,217,0.1)", display:"flex", alignItems:"center", justifyContent:"center" },
  personaBtn:   { display:"flex", flexDirection:"column", alignItems:"center", padding:".85rem .5rem", border:"1.5px solid rgba(76,71,217,0.12)", borderRadius:12, background:"#F9F9FC", cursor:"pointer", color:"#9999BB", transition:"all .18s" },
  personaActive:{ border:"1.5px solid #4C47D9", background:"#EEEEFF", color:"#4C47D9" },
  currencyBtn:  { padding:".42rem .9rem", border:"1.5px solid rgba(76,71,217,0.15)", borderRadius:8, background:"#F9F9FC", fontSize:".8rem", fontWeight:700, color:"#9999BB", cursor:"pointer", fontFamily:"'Syne',sans-serif" },
  currencyActive:{ background:"#4C47D9", color:"#fff", borderColor:"#4C47D9" },
  dangerBtn:    { padding:".65rem 1rem", border:"1.5px solid rgba(226,75,74,.2)", borderRadius:10, background:"rgba(226,75,74,.06)", color:"#E24B4A", fontSize:".85rem", fontWeight:600, fontFamily:"'Syne',sans-serif", cursor:"pointer", textAlign:"left" },
}

const st = {
  section: { background:"#fff", border:"1px solid rgba(76,71,217,0.1)", borderRadius:16, padding:"1.4rem" },
}