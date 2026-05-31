import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { getUser } from "../services/authService";

function RouteMap() {
  const [mapUrl, setMapUrl] = useState(null);

  useEffect(() => {
    fetch("/api/maps/1/1")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.imageUrl) setMapUrl(data.imageUrl); })
      .catch(() => {});
  }, []);

  return (
    <div style={s.mapWrapper}>
      {mapUrl ? (
        <img src={mapUrl} alt="რუსთავი გზა 1" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <svg viewBox="0 0 320 160" width="100%" height="100%">
          <rect width="320" height="160" fill="#c8dfc8" rx="8" />
          <path d="M0,80 Q40,60 80,80 Q120,100 160,80 Q200,60 240,80 Q280,100 320,80"
            stroke="#6ab0d4" strokeWidth="18" fill="none" opacity="0.7"/>
          <rect x="60" y="50" width="200" height="14" fill="#e8e0c8" rx="2"/>
          <rect x="60" y="96" width="200" height="14" fill="#e8e0c8" rx="2"/>
          <rect x="100" y="20" width="12" height="120" fill="#e8e0c8" rx="2"/>
          <rect x="160" y="20" width="12" height="120" fill="#e8e0c8" rx="2"/>
          <rect x="220" y="20" width="12" height="120" fill="#e8e0c8" rx="2"/>
          {[
            { x:108,y:46,c:"#e74c3c" }, { x:130,y:52,c:"#e67e22" },
            { x:152,y:44,c:"#e74c3c" }, { x:175,y:50,c:"#27ae60" },
            { x:195,y:48,c:"#2980b9" }, { x:215,y:53,c:"#e74c3c" },
            { x:235,y:46,c:"#8e44ad" }, { x:255,y:52,c:"#e67e22" },
          ].map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="5" fill={d.c} stroke="white" strokeWidth="1"/>
          ))}
          <path d="M70,57 L130,57 L130,103 L220,103 L220,57 L280,57"
            stroke="#2ecc71" strokeWidth="3" fill="none" strokeDasharray="6,3" opacity="0.9"/>
          <rect x="230" y="110" width="82" height="44" fill="white" rx="4" opacity="0.85"/>
          <circle cx="238" cy="118" r="3" fill="#2ecc71"/>
          <text x="244" y="121" fontSize="5" fill="#333">გამავლობის გზა</text>
          <circle cx="238" cy="128" r="3" fill="#e74c3c"/>
          <text x="244" y="131" fontSize="5" fill="#333">გაჩერება აკრძ.</text>
          <circle cx="238" cy="138" r="3" fill="#2980b9"/>
          <text x="244" y="141" fontSize="5" fill="#333">სხვა ნიშნები</text>
        </svg>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate  = useNavigate();
  const [pressed, setPressed] = useState(null);

  const user      = getUser();
  const isPremium = user?.isPremium === true;
  const userName  = user?.name || "მომხმარებელი";

  const press   = (k) => setPressed(k);
  const release = ()  => setPressed(null);

  // ── PREMIUM VIEW ──────────────────────────────────────
  if (isPremium) {
    return (
      <div style={s.screen}>
        <div style={s.container}>

          <div style={s.greetBanner}>
            <p style={s.greetText}>👋 გამარჯობა, {userName}!</p>
          </div>

          <div style={s.card}>
            <RouteMap />

            <div style={s.statusBadge}>
              <span style={s.statusDot} />
              <span style={s.statusText}>გამოწერილი</span>
            </div>

            <div style={s.dateBox}>
              <p style={s.dateLabel}>გამოწერის თარიღი</p>
              <p style={s.dateValue}>
                {new Date().toLocaleDateString("ka-GE", { day:"numeric", month:"short" })}
              </p>
            </div>
          </div>

          <div style={s.actions}>
            <button
              style={{ ...s.theoryBtn, transform: pressed==="theory" ? "scale(0.97)" : "scale(1)" }}
              onClick={() => navigate("/theory")}
              onMouseDown={() => press("theory")} onMouseUp={release} onMouseLeave={release}
              onTouchStart={() => press("theory")} onTouchEnd={release}
            >
              ქალაქში მოქცევის წესები
              <br/>
              <span style={s.theoryQuote}>"თეორია"</span>
            </button>

            <button
              style={{ ...s.signsBtn, transform: pressed==="signs" ? "scale(0.97)" : "scale(1)" }}
              onClick={() => navigate("/signs")}
              onMouseDown={() => press("signs")} onMouseUp={release} onMouseLeave={release}
              onTouchStart={() => press("signs")} onTouchEnd={release}
            >
              საგზაო ნიშნები
            </button>
          </div>

        </div>
        <BottomNav />
      </div>
    );
  }

  // ── FREE / GUEST VIEW ─────────────────────────────────
  return (
    <div style={s.screen}>
      <div style={s.container}>

        <div style={s.infoBanner}>
          <p style={s.infoBannerText}>რას მიიღებ ჩვენი საიტის დახმარებით?</p>
        </div>

        <div style={s.freeCard}>
          <RouteMap />

          <button
            style={{ ...s.subscribeBtn, transform: pressed==="sub" ? "scale(0.97)" : "scale(1)" }}
            onClick={() => navigate(user ? "/premium" : "/login")}
            onMouseDown={() => press("sub")} onMouseUp={release} onMouseLeave={release}
            onTouchStart={() => press("sub")} onTouchEnd={release}
          >
            გამოწერა
          </button>

          <button
            style={s.demoBtn}
            onClick={() => navigate("/cities/1/routes/1")}
          >
            სატესტო რუკის ნახვა
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

const s = {
  screen: {
    display:"flex", flexDirection:"column", minHeight:"100vh",
    backgroundColor:"#0d1f0d",
    fontFamily:"'BPG Arial','Sylfaen',sans-serif",
    userSelect:"none",
  },
  container: {
    flex:1, display:"flex", flexDirection:"column",
    alignItems:"center",
    padding:"24px 16px 16px",
    gap:18,
    maxWidth:420, width:"100%", margin:"0 auto",
  },

  // ── premium ──
  greetBanner: {
    backgroundColor:"#3b82f6", borderRadius:16,
    padding:"18px 24px", width:"100%", textAlign:"center",
    boxShadow:"0 4px 20px rgba(59,130,246,0.35)",
  },
  greetText: { color:"white", fontSize:17, fontWeight:600, margin:0 },

  card: {
    backgroundColor:"#162016", borderRadius:20,
    width:"100%", display:"flex", flexDirection:"column", gap:0,
    boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
    border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden",
  },
  mapWrapper: { width:"100%", height:175, backgroundColor:"#c8dfc8", overflow:"hidden" },
  statusBadge: {
    backgroundColor:"#22c55e", display:"flex", alignItems:"center",
    justifyContent:"center", gap:8, padding:12,
  },
  statusDot: { width:8, height:8, borderRadius:"50%", backgroundColor:"white" },
  statusText: { color:"white", fontWeight:700, fontSize:17, letterSpacing:"0.3px" },
  dateBox: {
    backgroundColor:"#1e3a1e", padding:"12px 16px",
    display:"flex", flexDirection:"column", alignItems:"center", gap:2,
    borderTop:"1px solid rgba(255,255,255,0.06)",
  },
  dateLabel: { color:"#86efac", fontSize:13, margin:0, fontWeight:500 },
  dateValue: { color:"white", fontSize:20, fontWeight:700, margin:0 },

  actions: { display:"flex", flexDirection:"column", gap:12, width:"100%" },
  theoryBtn: {
    backgroundColor:"#22c55e", color:"white", border:"none",
    borderRadius:16, padding:"16px 20px", fontSize:16, fontWeight:600,
    cursor:"pointer", width:"100%", textAlign:"center", lineHeight:1.4,
    transition:"transform 0.1s ease", boxShadow:"0 4px 16px rgba(34,197,94,0.3)",
  },
  theoryQuote: { fontSize:15, fontWeight:500, opacity:0.9 },
  signsBtn: {
    backgroundColor:"#1e3a1e", color:"#d1fae5",
    border:"1.5px solid rgba(34,197,94,0.3)",
    borderRadius:16, padding:"16px 20px", fontSize:16, fontWeight:600,
    cursor:"pointer", width:"100%", transition:"transform 0.1s ease",
  },

  // ── free ──
  infoBanner: {
    backgroundColor:"#3b82f6", borderRadius:16,
    padding:"18px 24px", width:"100%", textAlign:"center",
    boxShadow:"0 4px 20px rgba(59,130,246,0.4)",
  },
  infoBannerText: { color:"white", fontSize:17, fontWeight:600, margin:0, lineHeight:1.4 },

  freeCard: {
    backgroundColor:"#162016", borderRadius:20,
    padding:16, width:"100%", display:"flex", flexDirection:"column", gap:14,
    boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
    border:"1px solid rgba(255,255,255,0.06)",
  },
  subscribeBtn: {
    backgroundColor:"#4ade80", color:"#0f172a", border:"none",
    borderRadius:14, padding:16, fontSize:18, fontWeight:700,
    cursor:"pointer", width:"100%", letterSpacing:"0.5px",
    transition:"transform 0.1s ease",
    boxShadow:"0 4px 16px rgba(74,222,128,0.35)",
  },
  demoBtn: {
    backgroundColor:"transparent", color:"#93c5fd",
    border:"1.5px solid rgba(147,197,253,0.4)",
    borderRadius:14, padding:14, fontSize:15, fontWeight:500,
    cursor:"pointer", width:"100%",
  },
};
