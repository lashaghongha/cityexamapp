import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { getUser } from "../services/authService";

function RouteMap() {
  return (
    <div style={styles.mapWrapper}>
      <div style={styles.mapInner}>
        <svg viewBox="0 0 320 160" width="100%" height="100%">
          <rect width="320" height="160" fill="#c8dfc8" rx="8" />
          <path d="M0,80 Q40,60 80,80 Q120,100 160,80 Q200,60 240,80 Q280,100 320,80" stroke="#6ab0d4" strokeWidth="18" fill="none" opacity="0.7"/>
          <rect x="60" y="50" width="200" height="14" fill="#e8e0c8" rx="2"/>
          <rect x="60" y="96" width="200" height="14" fill="#e8e0c8" rx="2"/>
          <rect x="100" y="20" width="12" height="120" fill="#e8e0c8" rx="2"/>
          <rect x="160" y="20" width="12" height="120" fill="#e8e0c8" rx="2"/>
          <rect x="220" y="20" width="12" height="120" fill="#e8e0c8" rx="2"/>
          {[
            { x: 108, y: 46, color: "#e74c3c" },
            { x: 130, y: 52, color: "#e67e22" },
            { x: 152, y: 44, color: "#e74c3c" },
            { x: 175, y: 50, color: "#27ae60" },
            { x: 195, y: 48, color: "#2980b9" },
            { x: 215, y: 53, color: "#e74c3c" },
            { x: 235, y: 46, color: "#8e44ad" },
            { x: 255, y: 52, color: "#e67e22" },
          ].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r="5" fill={s.color} stroke="white" strokeWidth="1" />
          ))}
          <path d="M70,57 L130,57 L130,103 L220,103 L220,57 L280,57" stroke="#2ecc71" strokeWidth="3" fill="none" strokeDasharray="6,3" opacity="0.9"/>
          <rect x="230" y="110" width="82" height="44" fill="white" rx="4" opacity="0.85"/>
          <circle cx="238" cy="118" r="3" fill="#2ecc71"/>
          <text x="244" y="121" fontSize="5" fill="#333">გამავლობის გზა</text>
          <circle cx="238" cy="128" r="3" fill="#e74c3c"/>
          <text x="244" y="131" fontSize="5" fill="#333">გაჩერება აკრძ.</text>
          <circle cx="238" cy="138" r="3" fill="#2980b9"/>
          <text x="244" y="141" fontSize="5" fill="#333">სხვა ნიშნები</text>
        </svg>
      </div>
    </div>
  );
}

export default function HomePagePremium() {
  const [pressedBtn, setPressedBtn] = useState(null);
  const navigate = useNavigate();

  const user = getUser();
  const userName = user?.name || "მომხმარებელი";
  const driveDate = "5 აპრ";

  return (
    <div style={styles.screen}>
      <div style={styles.container}>

        <div style={styles.userBanner}>
          <p style={styles.userBannerText}>👋 გამარჯობა, {userName}!</p>
        </div>

        <div style={styles.card}>
          <RouteMap />

          <div style={styles.statusBadge}>
            <span style={styles.statusDot} />
            <span style={styles.statusText}>გამოწერილი</span>
          </div>

          <div style={styles.dateBox}>
            <p style={styles.dateLabel}>გამოვლების თარიღი</p>
            <p style={styles.dateValue}>{driveDate}</p>
          </div>
        </div>

        <div style={styles.actionsWrapper}>
          <button
            style={{
              ...styles.theoryBtn,
              transform: pressedBtn === "theory" ? "scale(0.97)" : "scale(1)",
            }}
            onClick={() => navigate("/theory")}
            onMouseDown={() => setPressedBtn("theory")}
            onMouseUp={() => setPressedBtn(null)}
            onMouseLeave={() => setPressedBtn(null)}
            onTouchStart={() => setPressedBtn("theory")}
            onTouchEnd={() => setPressedBtn(null)}
          >
            ქალაქში მოქცევის წესები
            <br />
            <span style={styles.theoryQuote}>"თეორია"</span>
          </button>

          <button
            style={{
              ...styles.signsBtn,
              transform: pressedBtn === "signs" ? "scale(0.97)" : "scale(1)",
            }}
            onClick={() => navigate("/signs")}
            onMouseDown={() => setPressedBtn("signs")}
            onMouseUp={() => setPressedBtn(null)}
            onMouseLeave={() => setPressedBtn(null)}
            onTouchStart={() => setPressedBtn("signs")}
            onTouchEnd={() => setPressedBtn(null)}
          >
            საგზაო ნიშნები
          </button>
        </div>

      </div>

      <BottomNav active="home" />
    </div>
  );
}

const styles = {
  screen: {
    display: "flex", flexDirection: "column", minHeight: "100vh",
    backgroundColor: "#0d1f0d",
    fontFamily: "'BPG Arial', 'Sylfaen', sans-serif",
    userSelect: "none",
  },
  container: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center",
    padding: "24px 16px 16px",
    gap: "18px",
    maxWidth: "420px", width: "100%", margin: "0 auto",
  },
  userBanner: {
    backgroundColor: "#3b82f6",
    borderRadius: "16px", padding: "18px 24px",
    width: "100%", textAlign: "center",
    boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
  },
  userBannerText: { color: "white", fontSize: "17px", fontWeight: "600", margin: 0 },
  card: {
    backgroundColor: "#162016", borderRadius: "20px",
    width: "100%", display: "flex", flexDirection: "column", gap: "0",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden",
  },
  mapWrapper: { overflow: "hidden" },
  mapInner: { width: "100%", height: "175px", backgroundColor: "#c8dfc8" },
  statusBadge: {
    backgroundColor: "#22c55e", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px", padding: "12px", marginTop: "0",
  },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "white", display: "inline-block" },
  statusText: { color: "white", fontWeight: "700", fontSize: "17px", letterSpacing: "0.3px" },
  dateBox: {
    backgroundColor: "#1e3a1e", padding: "12px 16px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  dateLabel: { color: "#86efac", fontSize: "13px", margin: 0, fontWeight: "500" },
  dateValue: { color: "white", fontSize: "20px", fontWeight: "700", margin: 0 },
  actionsWrapper: { display: "flex", flexDirection: "column", gap: "12px", width: "100%" },
  theoryBtn: {
    backgroundColor: "#22c55e", color: "white", border: "none",
    borderRadius: "16px", padding: "16px 20px", fontSize: "16px", fontWeight: "600",
    cursor: "pointer", width: "100%", textAlign: "center", lineHeight: "1.4",
    transition: "transform 0.1s ease", boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
  },
  theoryQuote: { fontSize: "15px", fontWeight: "500", opacity: 0.9 },
  signsBtn: {
    backgroundColor: "#1e3a1e", color: "#d1fae5",
    border: "1.5px solid rgba(34,197,94,0.3)",
    borderRadius: "16px", padding: "16px 20px", fontSize: "16px", fontWeight: "600",
    cursor: "pointer", width: "100%", transition: "transform 0.1s ease",
  },
};
