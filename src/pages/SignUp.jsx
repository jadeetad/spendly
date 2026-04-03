import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"

const C = { indigo:"#3D39C4", pale:"#EEEEFF", bg:"#F8F8FA", surface:"#fff", text:"#18172E", muted:"#6B6980", border:"rgba(61,57,196,0.12)" }

const PERSONAS = [
  { id:"student",      label:"Student",      icon:"🎓", desc:"Managing a tight budget"      },
  { id:"professional", label:"Professional",  icon:"💼", desc:"Tracking work and life spend"  },
  { id:"parent",       label:"Parent",        icon:"🏠", desc:"Managing household finances"   },
  { id:"other",        label:"Other",         icon:"✦",  desc:"Just tracking my money"        },
]

export default function SignUp() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(1)
  const [form, setForm]       = useState({ name:"", email:"", password:"", persona:"" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [show, setShow]       = useState(false)

  const handleChange = e => { setForm({ ...form, [e.target.name]:e.target.value }); setError("") }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColor = ["transparent","#E24B4A","#EFD09A","#1D9E75"][strength]
  const strengthLabel = ["","Weak","Good","Strong"][strength]

  const nextStep = e => {
    e.preventDefault()
    if (!form.name.trim())        { setError("Please enter your name."); return }
    if (!form.email.trim())       { setError("Please enter your email."); return }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return }
    setError(""); setStep(2)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.persona) { setError("Please choose your profile type."); return }
    setLoading(true)

    // 1. Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email:    form.email,
      password: form.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // 2. Insert profile row
    const { error: profileError } = await supabase.from("profiles").insert({
      id:      data.user.id,
      name:    form.name,
      persona: form.persona,
    })

    if (profileError) {
      // Profile insert failed — not fatal, user can update in Settings
      console.error("Profile insert error:", profileError.message)
    }

    // 3. Insert default budgets (all zero — user sets them in Settings)
    const defaultBudgets = ["food","transport","entertainment","health","utilities"].map(cat => ({
      user_id:  data.user.id,
      category: cat,
      amount:   0,
    }))
    await supabase.from("budgets").insert(defaultBudgets)

    navigate("/dashboard")
  }

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.leftInner}>
          <Link to="/" style={s.logo}>
            <div style={s.logoMark}>
              <svg width="14" height="14" fill="none" viewBox="0 0 15 15">
                <circle cx="7.5" cy="7.5" r="6" stroke="#fff" strokeWidth="1.5"/>
                <path d="M5 7.5h5M7.5 5v5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={s.logoTxt}>Spend<span style={{ color:"#A39FF5" }}>ly</span></span>
          </Link>

          <div style={{ marginTop:"2.5rem", display:"flex", flexDirection:"column", gap:"1.4rem" }}>
            {[
              { n:1, label:"Account details", sub:"Name, email & password" },
              { n:2, label:"Your profile",    sub:"Tell us about yourself"  },
            ].map((st, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".76rem", background:step>i?"rgba(255,255,255,.25)":step===i+1?"#fff":"rgba(255,255,255,.1)", color:step===i+1?C.indigo:step>i?"#fff":"rgba(255,255,255,.4)" }}>
                  {step>i+1?"✓":st.n}
                </div>
                <div>
                  <div style={{ fontSize:".8rem", fontWeight:600, color:step===i+1?"#fff":"rgba(255,255,255,.45)" }}>{st.label}</div>
                  <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.3)", marginTop:1 }}>{st.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:"auto" }}>
            <p style={{ fontSize:".76rem", color:"rgba(255,255,255,.35)", lineHeight:1.6 }}>
              Free forever. No credit card required.
            </p>
          </div>
        </div>
      </div>

      <div style={s.right}>
        <AnimatePresence mode="wait">
          <motion.div key={step} style={s.formWrap}
            initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }}
            transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}>

            <div style={{ display:"flex", gap:5, marginBottom:"2rem" }}>
              {[1,2].map(n => (
                <div key={n} style={{ height:3, borderRadius:100, background:step>=n?C.indigo:"#E4E4F0", transition:"all .3s", width:step>=n?22:10 }}/>
              ))}
            </div>

            {step === 1 ? (
              <>
                <h1 style={s.title}>Create your account</h1>
                <p style={s.sub}>Free forever. No card required.</p>

                <form onSubmit={nextStep} style={{ display:"flex", flexDirection:"column", gap:"1rem", marginTop:"1.8rem" }}>
                  <Field label="Full name"     name="name"     type="text"  placeholder="Alex Mensah"     value={form.name}     onChange={handleChange}/>
                  <Field label="Email address" name="email"    type="email" placeholder="you@example.com" value={form.email}    onChange={handleChange}/>
                  <div>
                    <label style={s.label}>Password</label>
                    <div style={{ position:"relative", marginTop:".4rem" }}>
                      <input name="password" type={show?"text":"password"} placeholder="At least 6 characters"
                        value={form.password} onChange={handleChange}
                        style={{ ...s.input, paddingRight:"2.6rem" }}/>
                      <button type="button" onClick={() => setShow(!show)} style={s.eyeBtn}>
                        <svg width="15" height="15" fill="none" viewBox="0 0 15 15">
                          <path d="M1.5 7.5s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="#9999BB" strokeWidth="1.3"/>
                          <circle cx="7.5" cy="7.5" r="1.8" stroke="#9999BB" strokeWidth="1.3"/>
                        </svg>
                      </button>
                    </div>
                    {strength > 0 && (
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
                        <div style={{ display:"flex", gap:3, flex:1 }}>
                          {[1,2,3].map(n => (
                            <div key={n} style={{ flex:1, height:3, borderRadius:100, background:strength>=n?strengthColor:"#F0F0F8", transition:"background .3s" }}/>
                          ))}
                        </div>
                        <span style={{ fontSize:".68rem", color:strengthColor, fontWeight:600 }}>{strengthLabel}</span>
                      </div>
                    )}
                  </div>

                  {error && <div style={s.errorMsg}>{error}</div>}

                  <motion.button type="submit" style={s.btnPrimary}
                    whileHover={{ backgroundColor:"#5854D6" }} whileTap={{ scale:.98 }}>
                    Continue →
                  </motion.button>
                </form>

                <div style={s.divider}><div style={s.divLine}/><span style={s.divTxt}>or</span><div style={s.divLine}/></div>

                <motion.button style={s.googleBtn} whileTap={{ scale:.98 }}
                  onClick={async () => {
                    await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin+"/dashboard" } })
                  }}>
                  <GoogleIcon/> Continue with Google
                </motion.button>

                <p style={s.switchTxt}>
                  Already have an account?{" "}
                  <Link to="/signin" style={{ color:C.indigo, fontWeight:600, textDecoration:"none" }}>Sign in</Link>
                </p>
              </>
            ) : (
              <>
                <h1 style={s.title}>What describes you?</h1>
                <p style={s.sub}>This personalises your AI insights.</p>

                <div style={{ background:C.pale, border:`1px solid rgba(61,57,196,0.15)`, borderRadius:10, padding:".85rem 1rem", marginTop:"1.4rem" }}>
                  <div style={{ fontSize:".7rem", fontWeight:700, color:C.indigo, fontFamily:"'Syne',sans-serif", textTransform:"uppercase", letterSpacing:".07em", marginBottom:".4rem" }}>Why we ask</div>
                  <p style={{ fontSize:".8rem", color:C.muted, lineHeight:1.6, margin:0 }}>
                    A student's spending looks very different from a parent's. Spendly uses this to give you relevant insights — not a generic template.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem", marginTop:"1.2rem" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".65rem" }}>
                    {PERSONAS.map(p => (
                      <motion.div key={p.id} whileTap={{ scale:.97 }}
                        onClick={() => { setForm({ ...form, persona:p.id }); setError("") }}
                        style={{ ...s.personaCard, ...(form.persona===p.id?s.personaActive:{}) }}>
                        <div style={{ fontSize:20, marginBottom:".35rem" }}>{p.icon}</div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".86rem", marginBottom:2 }}>{p.label}</div>
                        <div style={{ fontSize:".7rem", color:form.persona===p.id?C.indigo:"#9999BB" }}>{p.desc}</div>
                      </motion.div>
                    ))}
                  </div>

                  {error && <div style={s.errorMsg}>{error}</div>}

                  <div style={{ display:"flex", gap:".65rem" }}>
                    <button type="button" onClick={() => setStep(1)}
                      style={{ ...s.btnPrimary, background:"transparent", color:C.muted, border:`1.5px solid ${C.border}`, flex:"0 0 auto", padding:".78rem 1.1rem" }}>
                      ← Back
                    </button>
                    <motion.button type="submit"
                      style={{ ...s.btnPrimary, flex:1, opacity:loading?.7:1 }}
                      whileHover={{ backgroundColor:"#5854D6" }} whileTap={{ scale:.98 }} disabled={loading}>
                      {loading?"Creating account...":"Create account"}
                    </motion.button>
                  </div>
                </form>

                <p style={{ ...s.switchTxt, marginTop:"1.1rem", fontSize:".72rem", color:"#AAAACC" }}>
                  By signing up you agree to our{" "}
                  <a href="#" style={{ color:C.indigo, textDecoration:"none" }}>Terms</a> and{" "}
                  <a href="#" style={{ color:C.indigo, textDecoration:"none" }}>Privacy Policy</a>.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Field({ label, name, type="text", placeholder, value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:".4rem" }}>
      <label style={{ fontSize:".75rem", fontWeight:600, color:"#18172E", fontFamily:"'Syne',sans-serif" }}>{label}</label>
      <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ padding:".68rem .95rem", borderRadius:9, border:"1.5px solid rgba(61,57,196,0.15)", background:"#fff", fontSize:".86rem", color:"#18172E", fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%" }}/>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

const s = {
  page:        { display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" },
  left:        { width:"38%", background:"#3D39C4", display:"flex", flexDirection:"column" },
  leftInner:   { padding:"2.2rem", display:"flex", flexDirection:"column", height:"100%" },
  logo:        { display:"flex", alignItems:"center", gap:9, textDecoration:"none" },
  logoMark:    { width:30, height:30, borderRadius:8, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center" },
  logoTxt:     { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem", color:"#fff" },
  right:       { flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#F8F8FA", padding:"2rem" },
  formWrap:    { width:"100%", maxWidth:420 },
  title:       { fontFamily:"'Syne',sans-serif", fontSize:"1.65rem", fontWeight:800, letterSpacing:"-.03em", color:"#18172E" },
  sub:         { fontSize:".86rem", color:"#6B6980", marginTop:".35rem", fontWeight:300 },
  label:       { fontSize:".75rem", fontWeight:600, color:"#18172E", fontFamily:"'Syne',sans-serif" },
  input:       { padding:".68rem .95rem", borderRadius:9, border:"1.5px solid rgba(61,57,196,0.15)", background:"#fff", fontSize:".86rem", color:"#18172E", fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%" },
  eyeBtn:      { position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" },
  errorMsg:    { fontSize:".76rem", color:"#E24B4A", background:"rgba(226,75,74,.07)", border:"1px solid rgba(226,75,74,.18)", borderRadius:8, padding:".55rem .85rem" },
  btnPrimary:  { background:"#3D39C4", color:"#fff", border:"none", borderRadius:9, padding:".78rem", fontSize:".9rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  divider:     { display:"flex", alignItems:"center", gap:".7rem", margin:"1.3rem 0" },
  divLine:     { flex:1, height:1, background:"rgba(61,57,196,0.1)" },
  divTxt:      { fontSize:".72rem", color:"#9999BB" },
  googleBtn:   { width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:9, background:"#fff", border:"1.5px solid rgba(61,57,196,0.15)", borderRadius:9, padding:".72rem", fontSize:".86rem", fontWeight:600, color:"#18172E", fontFamily:"'DM Sans',sans-serif", cursor:"pointer" },
  switchTxt:   { fontSize:".8rem", color:"#6B6980", textAlign:"center", marginTop:"1.3rem" },
  personaCard: { background:"#fff", border:"1.5px solid rgba(61,57,196,0.12)", borderRadius:12, padding:"1rem .85rem", cursor:"pointer", transition:"all .18s" },
  personaActive:{ border:"1.5px solid #3D39C4", background:"#EEEEFF" },
}