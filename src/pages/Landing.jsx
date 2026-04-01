import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"

const C = {
  indigo:   "#3D39C4",
  indigoL:  "#5854D6",
  pale:     "#EEEEFF",
  mid:      "#A39FF5",
  bg:       "#F8F8FA",
  surface:  "#FFFFFF",
  text:     "#18172E",
  muted:    "#6B6980",
  border:   "rgba(61,57,196,0.1)",
}

function FadeUp({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logoWrap}>
        <div style={s.logoMark}>
          <svg width="15" height="15" fill="none" viewBox="0 0 15 15">
            <circle cx="7.5" cy="7.5" r="6" stroke="#fff" strokeWidth="1.5"/>
            <path d="M5 7.5h5M7.5 5v5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={s.logoTxt}>Spend<span style={{ color: C.indigo }}>ly</span></span>
      </Link>

      {/* Desktop links */}
      <div style={s.navLinks}>
        <a href="#how"      style={s.navLink}>How it works</a>
        <a href="#features" style={s.navLink}>Features</a>
        <a href="#ai"       style={s.navLink}>AI</a>
      </div>

      {/* Desktop CTA */}
      <div style={s.navRight}>
        <button onClick={() => navigate("/signin")} style={s.btnGhost}>Sign in</button>
        <button onClick={() => navigate("/signup")} style={s.btnPrimary}>
          Add Card
        </button>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)} style={s.burger}>
        <span style={{ ...s.burgerLine, transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }}/>
        <span style={{ ...s.burgerLine, opacity: open ? 0 : 1 }}/>
        <span style={{ ...s.burgerLine, transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }}/>
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div style={s.mobileMenu}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}>
            <a href="#how"      style={s.mobileLink} onClick={() => setOpen(false)}>How it works</a>
            <a href="#features" style={s.mobileLink} onClick={() => setOpen(false)}>Features</a>
            <a href="#ai"       style={s.mobileLink} onClick={() => setOpen(false)}>AI</a>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1rem", display: "flex", flexDirection: "column", gap: ".6rem" }}>
              <button onClick={() => { navigate("/signin"); setOpen(false) }} style={{ ...s.btnGhost, width: "100%" }}>Sign in</button>
              <button onClick={() => { navigate("/signup"); setOpen(false) }} style={{ ...s.btnPrimary, width: "100%", justifyContent: "center" }}>Add Card</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function FloatingCard() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", perspective: 900 }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <motion.div style={{ ...s.floatTag, top: -20, left: -50 }}
          animate={{ y: [0, -6, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>
          <div style={s.tagAmt}>₦12,500</div>
          <div style={s.tagLbl}>Food · this week</div>
        </motion.div>
        <motion.div style={{ ...s.floatTag, bottom: 20, left: -80 }}
          animate={{ y: [0, -5, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}>
          <div style={s.tagAmt}>↑ 32%</div>
          <div style={s.tagLbl}>vs last month</div>
        </motion.div>
        <motion.div style={{ ...s.floatTag, top: 30, right: -70 }}
          animate={{ y: [0, -7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3.5" fill="#1D9E75"/></svg>
            <span style={{ color: "#1D9E75", fontWeight: 700, fontSize: ".72rem" }}>Splurge alert</span>
          </div>
          <div style={s.tagLbl}>Food · Saturday</div>
        </motion.div>
        <motion.div style={s.card3d}
          animate={{ rotateY: [-6, 5, -3, -6], rotateX: [3, -2, 5, 3], y: [0, -8, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={s.chip}/>
            <div style={{ display: "flex" }}>
              <div style={{ ...s.cardCircle, background: "rgba(239,208,154,.8)" }}/>
              <div style={{ ...s.cardCircle, background: "rgba(239,120,90,.7)", marginLeft: -8 }}/>
            </div>
          </div>
          <div style={s.cardNum}>•••• •••• •••• 4812</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={s.cardLbl}>Card Holder</div>
              <div style={s.cardVal}>Alex Mensah</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={s.cardLbl}>Expires</div>
              <div style={s.cardVal}>09 / 28</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Hero() {
  const navigate = useNavigate()
  return (
    <section style={s.hero}>
      <div style={s.heroText}>
        <motion.div style={s.aiBadge}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div style={s.aiDot}/>
          Powered by behavioral AI
        </motion.div>
        <motion.h1 style={s.h1}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
          Understand your money.<br />
          <span style={{ color: C.indigo }}>Control your future.</span>
        </motion.h1>
        <motion.p style={s.heroP}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}>
          Track spending, spot patterns, and get AI insights tailored to your life — not just a list of numbers.
        </motion.p>
        <motion.div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}>
          <button onClick={() => navigate("/signup")} style={{ ...s.btnPrimary, fontSize: ".95rem", padding: ".75rem 1.8rem", borderRadius: 11 }}>
            Add your card — it's free
          </button>
          <button onClick={() => navigate("/signin")} style={{ ...s.btnGhost, fontSize: ".9rem", padding: ".72rem 1.4rem" }}>
            Sign in
          </button>
        </motion.div>
        <motion.p style={{ fontSize: ".75rem", color: C.muted, marginTop: "1rem" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          No bank access needed. Manual logging made effortless.
        </motion.p>
      </div>
      <motion.div style={s.heroCard}
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
        <FloatingCard />
      </motion.div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { n: "01", h: "Add your card",              p: "Register a card name and start logging. No bank credentials, no API — just you and your data." },
    { n: "02", h: "Log expenses your way",       p: "Type 'spent 3500 on Bolt' or tap a quick-add shortcut. Takes under 5 seconds per transaction." },
    { n: "03", h: "AI spots your patterns",      p: "Spendly watches your habits across categories and weeks — then tells you what you might not notice." },
    { n: "04", h: "Understand, don't just track", p: "No rigid budgets. Just honest, non-judgmental insights about where your money actually goes." },
  ]
  return (
    <section id="how" style={s.howSection}>
      <div style={s.sectionInner}>
        <FadeUp>
          <div style={s.sectionLabel}>How it works</div>
          <h2 style={s.sectionTitle}>Simple by design.</h2>
          <p style={{ color: C.muted, fontSize: ".95rem", lineHeight: 1.75, maxWidth: 480, marginBottom: "3rem", fontWeight: 300 }}>
            We removed everything that made expense tracking feel like homework.
          </p>
        </FadeUp>
        <div style={s.stepsGrid}>
          {steps.map((step, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div style={s.stepItem}>
                <div style={s.stepNum}>{step.n}</div>
                <h3 style={s.stepH}>{step.h}</h3>
                <p style={s.stepP}>{step.p}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const feats = [
    { icon: "⚡", h: "Quick-add logging",       p: "Log 'spent 4500 on lunch' in plain text. Or tap a preset. Done in seconds." },
    { icon: "🔍", h: "Splurge detection",        p: "AI flags when you spend more than usual on a category — gently, not aggressively." },
    { icon: "📊", h: "Spending charts",          p: "Weekly, monthly, and 6-month views of where your money goes." },
    { icon: "👤", h: "Persona-aware AI",         p: "Student, professional, or parent — insights adapt to your context automatically." },
    { icon: "↩",  h: "Refund tracking",          p: "Mark any transaction as refunded. See pending returns separately." },
    { icon: "🔁", h: "Recurring expenses",       p: "Set up regular payments like rent or subscriptions to auto-log each cycle." },
  ]
  return (
    <section id="features" style={{ padding: "6rem 5vw", background: C.surface }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeUp><div style={s.sectionLabel}>Features</div></FadeUp>
        <FadeUp delay={0.07}>
          <h2 style={{ ...s.sectionTitle, marginBottom: "3rem" }}>Built around how you actually spend.</h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1px", background: C.border }}>
          {feats.map((f, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div style={s.featItem}>
                <div style={{ fontSize: 22, marginBottom: ".75rem" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".92rem", marginBottom: ".4rem" }}>{f.h}</h3>
                <p style={{ fontSize: ".83rem", color: C.muted, lineHeight: 1.65, fontWeight: 300 }}>{f.p}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrackingNote() {
  return (
    <section style={{ padding: "5rem 5vw", background: C.bg }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <FadeUp>
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={s.sectionLabel}>On tracking</div>
              <h2 style={{ ...s.sectionTitle, fontSize: "clamp(1.4rem,2.2vw,2rem)", marginBottom: "1rem" }}>
                No bank access. No stress.
              </h2>
              <p style={{ color: C.muted, lineHeight: 1.75, fontWeight: 300, marginBottom: "1rem" }}>
                We don't connect to your bank — and that's intentional. Instead, Spendly makes manual logging so quick it barely feels like effort.
              </p>
              <p style={{ color: C.muted, lineHeight: 1.75, fontWeight: 300 }}>
                Got a GTBank or Access Bank debit alert? Just copy the amount and paste it in. Takes 4 seconds. Future versions will parse SMS alerts automatically.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {[
                { icon: "⚡", t: "Quick-add presets",    p: "One tap for your regular expenses — transport, lunch, airtime." },
                { icon: "💬", t: "Natural language",      p: 'Type "spent 3500 on Bolt" and it logs itself.' },
                { icon: "🔁", t: "Recurring auto-log",    p: "Set up rent or subscriptions once, Spendly handles the rest." },
              ].map((x, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1rem", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 18 }}>{x.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".85rem", marginBottom: 2 }}>{x.t}</div>
                    <div style={{ fontSize: ".78rem", color: C.muted }}>{x.p}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function AISection() {
  const [active, setActive] = useState("Student")
  const responses = {
    Student:      "Food budget varies on social weeks — I'll track term-time vs holiday patterns separately.",
    Professional: "Entertainment often spikes on weekends. I'll compare against your weekday baseline instead.",
    Parent:       "Household spending varies with school terms. I'll factor that into your baselines automatically.",
  }
  return (
    <section id="ai" style={{ padding: "6rem 5vw", background: C.surface }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <FadeUp>
          <div style={s.sectionLabel}>AI Engine</div>
          <h2 style={{ ...s.sectionTitle, marginBottom: "1rem" }}>Insights that adapt to you.</h2>
          <p style={{ color: C.muted, lineHeight: 1.75, fontWeight: 300, marginBottom: "1.5rem" }}>
            Spendly doesn't hand out generic tips. It learns your baseline and only flags when something genuinely shifts.
          </p>
          {["Pattern-based, not rule-based", "Adapts to your persona", "Non-judgmental tone always", "Learns from your context"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: ".855rem", color: C.muted, marginBottom: 10 }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="7" fill={C.indigo} fillOpacity="0.1"/>
                <path d="M5 8l2 2 4-4" stroke={C.indigo} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {f}
            </div>
          ))}
        </FadeUp>
        <FadeUp delay={0.12}>
          <div style={{ background: C.bg, borderRadius: 18, padding: "1.6rem", display: "flex", flexDirection: "column", gap: ".85rem" }}>
            {[
              { role: "bot",  text: "Hey — food spend this week is ₦4,800 vs your usual ₦2,200. Social spending?" },
              { role: "user", text: "Had friends over twice this week." },
              { role: "bot",  text: "Makes sense. I'll note that context. What describes you best?" },
            ].map((m, i) => (
              <div key={i} style={{ background: m.role === "bot" ? C.pale : "#fff", borderRadius: m.role === "bot" ? "12px 12px 12px 4px" : "12px 12px 4px 12px", padding: ".85rem 1rem", fontSize: ".83rem", lineHeight: 1.65, color: m.role === "user" ? C.muted : C.text, alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", border: m.role === "user" ? `1px solid ${C.border}` : "none" }}>
                {m.role === "bot" && <div style={{ fontSize: ".62rem", fontWeight: 700, color: C.indigo, marginBottom: 3, fontFamily: "'Syne',sans-serif", textTransform: "uppercase", letterSpacing: ".07em" }}>Spendly AI</div>}
                {m.text}
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Student", "Professional", "Parent"].map(p => (
                <motion.button key={p} whileTap={{ scale: 0.95 }} onClick={() => setActive(p)}
                  style={{ background: active === p ? C.indigo : "#fff", color: active === p ? "#fff" : C.text, border: `1px solid ${C.border}`, borderRadius: 100, padding: "4px 12px", fontSize: ".72rem", fontWeight: 500, cursor: "pointer" }}>
                  {p}
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={active} style={{ background: C.pale, borderRadius: "12px 12px 12px 4px", padding: ".85rem 1rem", fontSize: ".83rem", lineHeight: 1.65 }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <div style={{ fontSize: ".62rem", fontWeight: 700, color: C.indigo, marginBottom: 3, fontFamily: "'Syne',sans-serif", textTransform: "uppercase", letterSpacing: ".07em" }}>Spendly AI</div>
                {responses[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function CTA() {
  const navigate = useNavigate()
  return (
    <section style={{ padding: "7rem 5vw", background: C.indigo, textAlign: "center" }}>
      <FadeUp>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.03em", marginBottom: "1rem" }}>
          Start understanding your money.
        </h2>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".95rem", marginBottom: "2rem", fontWeight: 300 }}>
          Free. No bank access. No pressure.
        </p>
        <motion.button onClick={() => navigate("/signup")}
          style={{ background: "#fff", color: C.indigo, fontFamily: "'Syne',sans-serif", fontSize: ".95rem", fontWeight: 700, padding: ".85rem 2.2rem", borderRadius: 11, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          Add your card — it's free
        </motion.button>
      </FadeUp>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: C.text, padding: "2rem 5vw", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ ...s.logoMark, width: 26, height: 26, borderRadius: 7 }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 15 15">
            <circle cx="7.5" cy="7.5" r="6" stroke="#fff" strokeWidth="1.5"/>
            <path d="M5 7.5h5M7.5 5v5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: ".9rem" }}>Spendly</span>
      </div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {["About", "Privacy", "Contact"].map(l => (
          <a key={l} href="#" style={{ fontSize: ".78rem", color: "rgba(255,255,255,.35)", textDecoration: "none" }}>{l}</a>
        ))}
      </div>
      <span style={{ fontSize: ".7rem", color: "rgba(255,255,255,.25)" }}>© 2026 Spendly</span>
    </footer>
  )
}

export default function Landing() {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.bg, color: C.text, overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <TrackingNote />
      <AISection />
      <CTA />
      <Footer />
    </div>
  )
}

const s = {
  nav:        { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 5vw", background: "rgba(248,248,250,0.88)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}`, gap: "1rem" },
  logoWrap:   { display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 },
  logoMark:   { width: 30, height: 30, borderRadius: 8, background: C.indigo, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoTxt:    { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: C.text },
  navLinks:   { display: "flex", gap: "2rem", "@media(max-width:700px)": { display: "none" } },
  navLink:    { fontSize: ".84rem", fontWeight: 500, color: C.muted, textDecoration: "none" },
  navRight:   { display: "flex", gap: 8, alignItems: "center", flexShrink: 0 },
  btnGhost:   { background: "transparent", border: `1.5px solid ${C.border}`, borderRadius: 8, padding: ".4rem 1rem", fontSize: ".82rem", fontWeight: 600, color: C.text, cursor: "pointer", fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap" },
  btnPrimary: { background: C.indigo, color: "#fff", border: "none", borderRadius: 8, padding: ".44rem 1.1rem", fontSize: ".84rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap" },
  burger:     { display: "none", flexDirection: "column", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 4, "@media(max-width:700px)": { display: "flex" } },
  burgerLine: { width: 20, height: 2, background: C.text, borderRadius: 2, transition: "all .25s", display: "block" },
  mobileMenu: { position: "absolute", top: "100%", left: 0, right: 0, background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "1.2rem 5vw", display: "flex", flexDirection: "column", gap: ".85rem" },
  mobileLink: { fontSize: ".9rem", fontWeight: 500, color: C.muted, textDecoration: "none", padding: ".2rem 0" },
  hero:       { minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", padding: "7rem 5vw 4rem", gap: "3rem", maxWidth: 1200, margin: "0 auto" },
  heroText:   { display: "flex", flexDirection: "column", alignItems: "flex-start" },
  aiBadge:    { display: "inline-flex", alignItems: "center", gap: 8, background: C.pale, border: `1px solid rgba(61,57,196,.18)`, borderRadius: 100, padding: "5px 13px 5px 10px", fontSize: ".73rem", fontWeight: 600, color: C.indigo, marginBottom: "1.2rem" },
  aiDot:      { width: 7, height: 7, borderRadius: "50%", background: C.indigo },
  h1:         { fontFamily: "'Syne',sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", marginBottom: "1.1rem" },
  heroP:      { fontSize: "1rem", color: C.muted, maxWidth: 420, lineHeight: 1.75, marginBottom: "1.8rem", fontWeight: 300 },
  heroCard:   {},
  floatTag:   { position: "absolute", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 11px", fontSize: ".71rem", fontWeight: 500, color: C.text, boxShadow: "0 4px 14px rgba(61,57,196,.08)", whiteSpace: "nowrap" },
  tagAmt:     { fontFamily: "'Syne',sans-serif", fontWeight: 700, color: C.indigo, fontSize: ".8rem" },
  tagLbl:     { color: C.muted, fontSize: ".67rem", marginTop: 1 },
  card3d:     { width: 310, height: 192, borderRadius: 18, background: `linear-gradient(135deg,${C.indigo} 0%,#6058E0 60%,#A39FF5 100%)`, padding: "24px 24px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", position: "relative", transformStyle: "preserve-3d" },
  chip:       { width: 38, height: 26, borderRadius: 5, background: "linear-gradient(135deg,#EFD09A,#C9A84C)" },
  cardCircle: { width: 22, height: 22, borderRadius: "50%", border: "2px solid rgba(255,255,255,.2)" },
  cardNum:    { fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 500, color: "rgba(255,255,255,.9)", letterSpacing: ".14em" },
  cardLbl:    { fontSize: ".58rem", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 },
  cardVal:    { fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 600, color: "rgba(255,255,255,.88)" },
  howSection: { padding: "6rem 5vw", background: C.surface, borderTop: `1px solid ${C.border}` },
  sectionInner:{ maxWidth: 1100, margin: "0 auto" },
  sectionLabel:{ fontFamily: "'Syne',sans-serif", fontSize: ".7rem", fontWeight: 700, color: C.indigo, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: ".6rem" },
  sectionTitle:{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.6rem,2.5vw,2.4rem)", fontWeight: 700, letterSpacing: "-.025em", lineHeight: 1.2 },
  stepsGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "2.5rem" },
  stepItem:   {},
  stepNum:    { fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: C.indigo, letterSpacing: ".05em", marginBottom: ".6rem" },
  stepH:      { fontFamily: "'Syne',sans-serif", fontSize: ".95rem", fontWeight: 700, marginBottom: ".4rem" },
  stepP:      { fontSize: ".83rem", color: C.muted, lineHeight: 1.65, fontWeight: 300 },
  featItem:   { padding: "1.8rem", background: C.surface },
}