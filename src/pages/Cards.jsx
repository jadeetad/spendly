import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

const MOCK_CARDS = [
  { id:1, name:"Alex Mensah", number:"4812", expiry:"09/28", type:"Visa",       color:["#4C47D9","#7B5CF0","#A39FF5"], primary:true },
  { id:2, name:"Alex Mensah", number:"3341", expiry:"03/27", type:"Mastercard", color:["#1D9E75","#34C78A","#7BE3B8"], primary:false },
]

function CardUI({ card, scale = 1 }) {
  return (
    <motion.div style={{ width:300*scale, height:185*scale, borderRadius:18*scale, background:`linear-gradient(135deg,${card.color[0]} 0%,${card.color[1]} 60%,${card.color[2]} 100%)`, padding:`${24*scale}px`, display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden", cursor:"default" }}
      animate={{ rotateY:[-4,4,-4], rotateX:[2,-2,2], y:[0,-6,0] }}
      transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}>
      <div style={{ position:"absolute", top:-30*scale, right:-30*scale, width:130*scale, height:130*scale, borderRadius:"50%", background:"rgba(255,255,255,.06)" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ width:38*scale, height:26*scale, borderRadius:5*scale, background:"linear-gradient(135deg,#EFD09A,#C9A84C)" }}/>
        {card.primary && <div style={{ background:"rgba(255,255,255,.2)", borderRadius:100, padding:`${2*scale}px ${8*scale}px`, fontSize:10*scale, fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif" }}>Primary</div>}
      </div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14*scale, fontWeight:500, color:"rgba(255,255,255,.9)", letterSpacing:".15em" }}>•••• •••• •••• {card.number}</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:8*scale, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:2 }}>Card Holder</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:10*scale, fontWeight:600, color:"rgba(255,255,255,.9)" }}>{card.name}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:8*scale, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:2 }}>Expires</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:10*scale, fontWeight:600, color:"rgba(255,255,255,.85)" }}>{card.expiry}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Cards() {
  const navigate  = useNavigate()
  const [cards, setCards]       = useState(MOCK_CARDS)
  const [selected, setSelected] = useState(MOCK_CARDS[0])
  const [showAdd, setShowAdd]   = useState(false)
  const [newCard, setNewCard]   = useState({ name:"", number:"", expiry:"", cvv:"" })

  const spendByCard = { 1: 62400, 2: 21800 }

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <button onClick={() => navigate("/dashboard")} style={s.backBtn}>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" stroke="#14132A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem" }}>My Cards</div>
        <button onClick={() => setShowAdd(true)} style={s.addBtn}>+ Add Card</button>
      </div>

      <div style={s.content}>
        {/* Card carousel */}
        <div style={{ display:"flex", gap:"1.5rem", overflowX:"auto", paddingBottom:".5rem", marginBottom:"1.5rem" }}>
          {cards.map(card => (
            <div key={card.id} onClick={() => setSelected(card)} style={{ cursor:"pointer", opacity: selected.id===card.id?1:0.6, transition:"opacity .2s", flexShrink:0 }}>
              <CardUI card={card} scale={0.85}/>
            </div>
          ))}
          <motion.div whileTap={{ scale:.95 }} onClick={() => setShowAdd(true)}
            style={{ width:255, height:157, borderRadius:15, border:"2px dashed rgba(76,71,217,0.2)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, cursor:"pointer", flexShrink:0, background:"rgba(76,71,217,0.03)" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"#EEEEFF", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="#4C47D9" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <span style={{ fontSize:".78rem", fontWeight:600, color:"#9999BB", fontFamily:"'Syne',sans-serif" }}>Add new card</span>
          </motion.div>
        </div>

        {/* Selected card details */}
        {selected && (
          <motion.div key={selected.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} style={s.detailCard}>
            <div style={s.cardHd}>
              <span style={s.cardTitle}>Card Details</span>
              <div style={{ display:"flex", gap:".5rem" }}>
                <button style={s.smallBtn}>Freeze</button>
                <button style={{ ...s.smallBtn, color:"#E24B4A", borderColor:"rgba(226,75,74,.2)", background:"rgba(226,75,74,.05)" }}>Remove</button>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              {[
                { l:"Card type",    v:selected.type },
                { l:"Last 4 digits",v:`•••• ${selected.number}` },
                { l:"Expiry",       v:selected.expiry },
                { l:"Status",       v:"Active" },
              ].map((x,i) => (
                <div key={i}>
                  <div style={{ fontSize:".68rem", color:"#9999BB", textTransform:"uppercase", letterSpacing:".07em", fontWeight:600, marginBottom:3 }}>{x.l}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".9rem", color: x.v==="Active"?"#1D9E75":"#14132A" }}>{x.v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"1.2rem", paddingTop:"1.2rem", borderTop:"1px solid rgba(76,71,217,0.08)" }}>
              <div style={{ fontSize:".68rem", color:"#9999BB", textTransform:"uppercase", letterSpacing:".07em", fontWeight:600, marginBottom:6 }}>This month's spend</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.4rem" }}>₦{spendByCard[selected.id].toLocaleString()}</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add card modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div style={s.overlay} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setShowAdd(false)}/>
            <motion.div style={s.modal} initial={{ opacity:0, scale:.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:.95, y:20 }} transition={{ type:"spring", damping:25, stiffness:300 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1.1rem" }}>Add New Card</h2>
                <button onClick={() => setShowAdd(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#9999BB" }}>×</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                {[
                  { name:"name",   label:"Cardholder name", placeholder:"As on card" },
                  { name:"number", label:"Card number",      placeholder:"•••• •••• •••• ••••" },
                ].map(f => (
                  <div key={f.name} style={s.fieldWrap}>
                    <label style={s.label}>{f.label}</label>
                    <input name={f.name} placeholder={f.placeholder} value={newCard[f.name]} onChange={e => setNewCard({...newCard,[e.target.name]:e.target.value})} style={s.input}/>
                  </div>
                ))}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
                  {[{ name:"expiry",label:"Expiry",placeholder:"MM/YY" },{ name:"cvv",label:"CVV",placeholder:"•••" }].map(f => (
                    <div key={f.name} style={s.fieldWrap}>
                      <label style={s.label}>{f.label}</label>
                      <input name={f.name} placeholder={f.placeholder} value={newCard[f.name]} onChange={e => setNewCard({...newCard,[e.target.name]:e.target.value})} style={s.input}/>
                    </div>
                  ))}
                </div>
                <motion.button whileTap={{ scale:.97 }} onClick={() => setShowAdd(false)}
                  style={{ background:"#4C47D9", color:"#fff", border:"none", borderRadius:10, padding:".8rem", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".9rem", cursor:"pointer", marginTop:".25rem" }}>
                  Add Card
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const s = {
  page:      { minHeight:"100vh", background:"#F4F4F9", fontFamily:"'DM Sans',sans-serif" },
  topbar:    { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.2rem 1.5rem", background:"#fff", borderBottom:"1px solid rgba(76,71,217,0.1)", position:"sticky", top:0, zIndex:10 },
  backBtn:   { display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:".85rem", fontWeight:600, color:"#14132A", fontFamily:"'DM Sans',sans-serif" },
  addBtn:    { background:"#4C47D9", color:"#fff", border:"none", borderRadius:8, padding:".38rem .9rem", fontSize:".8rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  content:   { maxWidth:760, margin:"0 auto", padding:"1.5rem" },
  detailCard:{ background:"#fff", border:"1px solid rgba(76,71,217,0.1)", borderRadius:16, padding:"1.4rem" },
  cardHd:    { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem" },
  cardTitle: { fontFamily:"'Syne',sans-serif", fontSize:".9rem", fontWeight:700 },
  smallBtn:  { padding:".35rem .9rem", border:"1.5px solid rgba(76,71,217,0.15)", borderRadius:8, background:"#EEEEFF", color:"#4C47D9", fontSize:".75rem", fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" },
  overlay:   { position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:40 },
  modal:     { position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"#fff", borderRadius:20, padding:"1.8rem", width:"90%", maxWidth:440, zIndex:50 },
  fieldWrap: { display:"flex", flexDirection:"column", gap:".4rem" },
  label:     { fontSize:".78rem", fontWeight:600, color:"#14132A", fontFamily:"'Syne',sans-serif" },
  input:     { padding:".72rem 1rem", borderRadius:10, border:"1.5px solid rgba(76,71,217,0.15)", background:"#F9F9FC", fontSize:".88rem", color:"#14132A", fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%" },
}