import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"

export default function SignUp() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(1)
  const [form, setForm]       = useState({ name: "", email: "", password: "", persona: "" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [show, setShow]       = useState(false)

  const personas = [
    { id: "student",      label: "Student",      icon: "🎓", desc: "Managing a tight budget" },
    { id: "professional", label: "Professional",  icon: "💼", desc: "Tracking work & life spend" },
    { id: "parent",       label: "Parent",        icon: "🏠", desc: "Managing household finances" },
    { id: "other",        label: "Other",         icon: "✦",  desc: "Just tracking my money" },
  ]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const nextStep = (e) => {
    e.preventDefault()
    if (!form.name.trim())     { setError("Please enter your name.");     return }
    if (!form.email.trim())    { setError("Please enter your email.");    return }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return }
    setError("")
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.persona) { setError("Please select your profile type."); return }
    setLoading(true)
    // TODO: replace with real Supabase auth
    // const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { name: form.name, persona: form.persona } } })
    setTimeout(() => {
      setLoading(false)
      navigate("/dashboard")
    }, 1400)
  }

  return (
    <div style={s.page}>
      {/* Left panel */}
      <div style={s.left}>
        <div style={s.leftInner}>
          <Link to="/" style={s.logo}>
            <div style={s.logoMark}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6.5" stroke="#fff" strokeWidth="1.6"/>
                <path d="M5.5 8h5M8 5.5v5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={s.logoTxt}>Spend<span style={{ color: "#A39FF5" }}>ly</span></span>
          </Link>

          {/* Steps indicator */}
          <div style={s.stepsWrap}>
            {["Account details", "Your profile"].map((label, i) => (
              <div key={i} style={s.stepRow}>
                <div style={{ ...s.stepCircle, ...(step > i ? s.stepDone : step === i + 1 ? s.stepActive : s.stepIdle) }}>
                  {step > i + 1 ? (
                    <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                      <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : i + 1}
                </div>
                <div>
                  <div style={{ fontSize: ".78rem", fontWeight: 600, color: step === i + 1 ? "#fff" : "rgba(255,255,255,.5)" }}>{label}</div>
                  <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.35)" }}>{i === 0 ? "Name, email & password" : "Tell us about yourself"}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={s.leftNote}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".5rem", fontFamily: "'Syne',sans-serif" }}>Why we ask</div>
              <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,.7)", lineHeight: 1.65 }}>
                Spendly uses your profile to tailor AI insights to your real life — a student's spending patterns look very different from a parent's.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={s.right}>
        <motion.div style={s.formWrap}
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

          {/* Step indicator dots */}
          <div style={{ display: "flex", gap: 6, marginBottom: "2rem" }}>
            {[1, 2].map((n) => (
              <div key={n} style={{ height: 4, borderRadius: 100, background: step >= n ? "#4C47D9" : "#E0E0EE", transition: "all .3s", width: step >= n ? 24 : 12 }} />
            ))}
          </div>

          {step === 1 ? (
            <>
              <div style={s.formTop}>
                <h1 style={s.formTitle}>Create your account</h1>
                <p style={s.formSub}>Free forever. No card required.</p>
              </div>

              <form onSubmit={nextStep} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={s.fieldWrap}>
                  <label style={s.label}>Full name</label>
                  <input name="name" type="text" placeholder="Alex Mensah" value={form.name} onChange={handleChange} style={s.input} autoComplete="name"/>
                </div>

                <div style={s.fieldWrap}>
                  <label style={s.label}>Email address</label>
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} style={s.input} autoComplete="email"/>
                </div>

                <div style={s.fieldWrap}>
                  <label style={s.label}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input name="password" type={show ? "text" : "password"} placeholder="At least 6 characters" value={form.password} onChange={handleChange} style={{ ...s.input, paddingRight: "2.8rem" }} autoComplete="new-password"/>
                    <button type="button" onClick={() => setShow(!show)} style={s.eyeBtn}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                        <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="#9999BB" strokeWidth="1.3"/>
                        <circle cx="8" cy="8" r="1.8" stroke="#9999BB" strokeWidth="1.3"/>
                      </svg>
                    </button>
                  </div>
                  {/* Password strength */}
                  {form.password.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      {[1, 2, 3].map((n) => (
                        <div key={n} style={{ flex: 1, height: 3, borderRadius: 100, background: form.password.length >= n * 3 ? (form.password.length >= 9 ? "#1D9E75" : form.password.length >= 6 ? "#EFD09A" : "#E24B4A") : "#F0F0F8", transition: "background .3s" }}/>
                      ))}
                    </div>
                  )}
                </div>

                {error && <div style={s.errorMsg}>{error}</div>}

                <motion.button type="submit" style={s.submitBtn} whileHover={{ backgroundColor: "#6C67E8" }} whileTap={{ scale: 0.98 }}>
                  Continue →
                </motion.button>
              </form>

              <div style={s.divider}>
                <div style={s.dividerLine}/><span style={s.dividerTxt}>or</span><div style={s.dividerLine}/>
              </div>

              <motion.button style={s.googleBtn} whileHover={{ borderColor: "#4C47D9" }} whileTap={{ scale: 0.98 }}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </motion.button>

              <p style={s.switchTxt}>
                Already have an account?{" "}
                <Link to="/signin" style={s.switchLink}>Sign in</Link>
              </p>
            </>
          ) : (
            <>
              <div style={s.formTop}>
                <h1 style={s.formTitle}>What describes you?</h1>
                <p style={s.formSub}>This helps us personalise your AI insights.</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                  {personas.map((p) => (
                    <motion.div key={p.id}
                      onClick={() => { setForm({ ...form, persona: p.id }); setError("") }}
                      whileTap={{ scale: 0.97 }}
                      style={{ ...s.personaCard, ...(form.persona === p.id ? s.personaActive : {}) }}>
                      <div style={{ fontSize: 22, marginBottom: ".4rem" }}>{p.icon}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".88rem", marginBottom: 2 }}>{p.label}</div>
                      <div style={{ fontSize: ".72rem", color: form.persona === p.id ? "#4C47D9" : "#9999BB" }}>{p.desc}</div>
                    </motion.div>
                  ))}
                </div>

                {error && <div style={s.errorMsg}>{error}</div>}

                <div style={{ display: "flex", gap: ".75rem", marginTop: ".25rem" }}>
                  <button type="button" onClick={() => setStep(1)}
                    style={{ ...s.submitBtn, background: "transparent", color: "#6B6980", border: "1.5px solid rgba(76,71,217,0.15)", flex: "0 0 auto", padding: ".8rem 1.2rem" }}>
                    ← Back
                  </button>
                  <motion.button type="submit"
                    style={{ ...s.submitBtn, flex: 1, opacity: loading ? 0.7 : 1 }}
                    whileHover={{ backgroundColor: "#6C67E8" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                  </motion.button>
                </div>
              </form>

              <p style={{ ...s.switchTxt, marginTop: "1.2rem", fontSize: ".74rem", color: "#AAAACC" }}>
                By creating an account you agree to our{" "}
                <a href="#" style={{ color: "#4C47D9", textDecoration: "none" }}>Terms</a> and{" "}
                <a href="#" style={{ color: "#4C47D9", textDecoration: "none" }}>Privacy Policy</a>.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

const s = {
  page:         { display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" },
  left:         { width: "42%", background: "#4C47D9", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" },
  leftInner:    { padding: "2.5rem", display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 2 },
  logo:         { display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: "3rem" },
  logoMark:     { width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoTxt:      { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#fff" },
  stepsWrap:    { display: "flex", flexDirection: "column", gap: "1.5rem" },
  stepRow:      { display: "flex", alignItems: "flex-start", gap: 12 },
  stepCircle:   { width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".78rem", flexShrink: 0 },
  stepActive:   { background: "#fff", color: "#4C47D9" },
  stepDone:     { background: "rgba(255,255,255,.25)", color: "#fff" },
  stepIdle:     { background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.4)" },
  leftNote:     { background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "1rem 1.1rem" },
  right:        { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F7FB", padding: "2rem" },
  formWrap:     { width: "100%", maxWidth: 440 },
  formTop:      { marginBottom: "1.8rem" },
  formTitle:    { fontFamily: "'Syne',sans-serif", fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-.03em", color: "#14132A", marginBottom: ".4rem" },
  formSub:      { fontSize: ".88rem", color: "#6B6980", fontWeight: 300 },
  fieldWrap:    { display: "flex", flexDirection: "column", gap: ".4rem" },
  label:        { fontSize: ".78rem", fontWeight: 600, color: "#14132A", fontFamily: "'Syne',sans-serif" },
  input:        { padding: ".72rem 1rem", borderRadius: 10, border: "1.5px solid rgba(76,71,217,0.15)", background: "#fff", fontSize: ".88rem", color: "#14132A", fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%" },
  eyeBtn:       { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" },
  errorMsg:     { fontSize: ".78rem", color: "#E24B4A", background: "rgba(226,75,74,.08)", border: "1px solid rgba(226,75,74,.2)", borderRadius: 8, padding: ".6rem .9rem" },
  submitBtn:    { background: "#4C47D9", color: "#fff", border: "none", borderRadius: 10, padding: ".8rem", fontSize: ".92rem", fontWeight: 700, fontFamily: "'Syne',sans-serif", cursor: "pointer", transition: "background .2s" },
  divider:      { display: "flex", alignItems: "center", gap: ".75rem", margin: "1.4rem 0" },
  dividerLine:  { flex: 1, height: 1, background: "rgba(76,71,217,0.1)" },
  dividerTxt:   { fontSize: ".74rem", color: "#9999BB", fontWeight: 500 },
  googleBtn:    { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", border: "1.5px solid rgba(76,71,217,0.15)", borderRadius: 10, padding: ".75rem", fontSize: ".88rem", fontWeight: 600, color: "#14132A", fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "border-color .2s" },
  switchTxt:    { fontSize: ".82rem", color: "#6B6980", textAlign: "center", marginTop: "1.4rem" },
  switchLink:   { color: "#4C47D9", fontWeight: 600, textDecoration: "none", fontFamily: "'Syne',sans-serif" },
  personaCard:  { background: "#fff", border: "1.5px solid rgba(76,71,217,0.12)", borderRadius: 14, padding: "1.1rem", cursor: "pointer", transition: "all .18s" },
  personaActive:{ border: "1.5px solid #4C47D9", background: "#EEEEFF" },
}