import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const C = { indigo:"#3D39C4", pale:"#EEEEFF", bg:"#F8F8FA", surface:"#fff", text:"#18172E", muted:"#6B6980", border:"rgba(61,57,196,0.12)" }

export default function SignIn() {
  const navigate    = useNavigate()
  const { signIn }  = useAuth()
  const [form, setForm]       = useState({ email:"", password:"" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [show, setShow]       = useState(false)

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError("") }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) { setError("Please fill in all fields."); return }
    setLoading(true)

    // TODO: replace mock with real Supabase auth:
    // const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    // if (error) { setError(error.message); setLoading(false); return }
    // signIn({ name: data.user.user_metadata.name, email: data.user.email, persona: data.user.user_metadata.persona })

    // Mock sign-in for now — uses email prefix as name
    setTimeout(() => {
      const mockName = form.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase())
      signIn({ name: mockName, email: form.email, persona: "student" })
      setLoading(false)
      navigate("/dashboard")
    }, 1000)
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

          <div style={{ marginTop:"auto", marginBottom:"auto" }}>
            <motion.blockquote style={s.quote}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55 }}>
              "Spendly helped me see I was spending ₦18k a month on impulse food orders — and I didn't even notice until the AI flagged it."
            </motion.blockquote>
            <div style={s.quoteAuthor}>
              <div style={s.quoteAvatar}>AM</div>
              <div>
                <div style={{ fontSize:".8rem", fontWeight:600, color:"#fff" }}>Alex M.</div>
                <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.4)" }}>Student · Lagos</div>
              </div>
            </div>
          </div>

          <motion.div style={s.decoCard}
            animate={{ y:[0,-7,0] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}>
            <div style={{ fontSize:".6rem", color:"rgba(255,255,255,.4)", marginBottom:4, fontFamily:"'Syne',sans-serif", textTransform:"uppercase", letterSpacing:".08em" }}>This month</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:"#fff" }}>₦84,200</div>
            <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.4)", marginTop:2 }}>3 splurges detected</div>
            <div style={{ marginTop:10, height:3, background:"rgba(255,255,255,.1)", borderRadius:100 }}>
              <div style={{ width:"62%", height:"100%", background:"#A39FF5", borderRadius:100 }}/>
            </div>
          </motion.div>
        </div>
      </div>

      <div style={s.right}>
        <motion.div style={s.formWrap}
          initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5, delay:0.08, ease:[0.22,1,0.36,1] }}>
          <h1 style={s.title}>Welcome back</h1>
          <p style={s.sub}>Sign in to your Spendly account</p>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem", marginTop:"1.8rem" }}>
            <Field label="Email address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange}/>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".4rem" }}>
                <label style={s.label}>Password</label>
                <Link to="/forgot-password" style={{ fontSize:".72rem", color:C.indigo, fontWeight:600, textDecoration:"none" }}>Forgot?</Link>
              </div>
              <div style={{ position:"relative" }}>
                <input name="password" type={show?"text":"password"} placeholder="Your password" value={form.password} onChange={handleChange}
                  style={{ ...s.input, paddingRight:"2.6rem" }}/>
                <button type="button" onClick={() => setShow(!show)} style={s.eyeBtn}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 15 15">
                    <path d="M1.5 7.5s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="#9999BB" strokeWidth="1.3"/>
                    <circle cx="7.5" cy="7.5" r="1.8" stroke="#9999BB" strokeWidth="1.3"/>
                    {show && <path d="M3 3l9 9" stroke="#9999BB" strokeWidth="1.3" strokeLinecap="round"/>}
                  </svg>
                </button>
              </div>
            </div>

            {error && <div style={s.errorMsg}>{error}</div>}

            <motion.button type="submit" style={{ ...s.btnPrimary, opacity:loading?.7:1 }}
              whileHover={{ backgroundColor:"#5854D6" }} whileTap={{ scale:.98 }} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>

          <div style={s.divider}><div style={s.divLine}/><span style={s.divTxt}>or</span><div style={s.divLine}/></div>

          <motion.button style={s.googleBtn} whileHover={{ borderColor:C.indigo }} whileTap={{ scale:.98 }}>
            <GoogleIcon/> Continue with Google
          </motion.button>

          <p style={s.switchTxt}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color:C.indigo, fontWeight:600, textDecoration:"none" }}>Create one free</Link>
          </p>
        </motion.div>
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
  page:       { display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" },
  left:       { width:"40%", background:"#3D39C4", display:"flex", flexDirection:"column" },
  leftInner:  { padding:"2.2rem", display:"flex", flexDirection:"column", height:"100%" },
  logo:       { display:"flex", alignItems:"center", gap:9, textDecoration:"none" },
  logoMark:   { width:30, height:30, borderRadius:8, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center" },
  logoTxt:    { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem", color:"#fff" },
  quote:      { fontSize:".88rem", color:"rgba(255,255,255,.75)", lineHeight:1.7, fontStyle:"italic", marginBottom:"1.1rem", maxWidth:300 },
  quoteAuthor:{ display:"flex", alignItems:"center", gap:10 },
  quoteAvatar:{ width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".72rem", color:"#fff" },
  decoCard:   { background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, padding:"1rem 1.2rem", marginTop:"2rem" },
  right:      { flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#F8F8FA", padding:"2rem" },
  formWrap:   { width:"100%", maxWidth:400 },
  title:      { fontFamily:"'Syne',sans-serif", fontSize:"1.65rem", fontWeight:800, letterSpacing:"-.03em", color:"#18172E" },
  sub:        { fontSize:".86rem", color:"#6B6980", marginTop:".35rem", fontWeight:300 },
  label:      { fontSize:".75rem", fontWeight:600, color:"#18172E", fontFamily:"'Syne',sans-serif" },
  input:      { padding:".68rem .95rem", borderRadius:9, border:"1.5px solid rgba(61,57,196,0.15)", background:"#fff", fontSize:".86rem", color:"#18172E", fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%" },
  eyeBtn:     { position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" },
  errorMsg:   { fontSize:".76rem", color:"#E24B4A", background:"rgba(226,75,74,.07)", border:"1px solid rgba(226,75,74,.18)", borderRadius:8, padding:".55rem .85rem" },
  btnPrimary: { background:"#3D39C4", color:"#fff", border:"none", borderRadius:9, padding:".78rem", fontSize:".9rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  divider:    { display:"flex", alignItems:"center", gap:".7rem", margin:"1.3rem 0" },
  divLine:    { flex:1, height:1, background:"rgba(61,57,196,0.1)" },
  divTxt:     { fontSize:".72rem", color:"#9999BB" },
  googleBtn:  { width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:9, background:"#fff", border:"1.5px solid rgba(61,57,196,0.15)", borderRadius:9, padding:".72rem", fontSize:".86rem", fontWeight:600, color:"#18172E", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", transition:"border-color .2s" },
  switchTxt:  { fontSize:".8rem", color:"#6B6980", textAlign:"center", marginTop:"1.3rem" },
}