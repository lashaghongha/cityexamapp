import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const checkPremium = () => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.isPremium === "True";
  } catch { return false; }
};

const cityData = {
  1: { name: "რუსთავი",  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Rustavi_aerial.jpg/640px-Rustavi_aerial.jpg" },
  2: { name: "გორი",     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Gori_fortress.jpg/640px-Gori_fortress.jpg" },
  3: { name: "თელავი",   image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Telavi_view.jpg/640px-Telavi_view.jpg" },
  4: { name: "ქუთაისი",  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Kutaisi_view.jpg/640px-Kutaisi_view.jpg" },
  5: { name: "ფოთი",     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Poti_Georgia.jpg/640px-Poti_Georgia.jpg" },
  6: { name: "საჩხერე",  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sachkhere.jpg/640px-Sachkhere.jpg" },
  7: { name: "ზუგდიდი",  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Zugdidi.jpg/640px-Zugdidi.jpg" },
  8: { name: "თბილისი",  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Tbilisi_panorama.jpg/640px-Tbilisi_panorama.jpg" },
};

function LockIcon({ unlocked }) {
  return unlocked ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 3c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm6 17H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    </svg>
  );
}

function RouteButton({ route, onPress }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      style={{
        ...styles.routeBtn,
        transform: pressed ? "scale(0.95)" : "scale(1)",
        opacity: route.unlocked ? 1 : 0.9,
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => { setPressed(false); onPress(route); }}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => { setPressed(false); onPress(route); }}
    >
      <span style={styles.routeLabel}>გზა №{route.id}</span>
      <span style={{ ...styles.lockBadge, backgroundColor: route.unlocked ? "#22c55e" : "#e74c3c" }}>
        <LockIcon unlocked={route.unlocked} />
      </span>
    </button>
  );
}

function PremiumPopup({ onClose, onBuy }) {
  return (
    <div style={styles.popupOverlay} onClick={onClose}>
      <div style={styles.popupBox} onClick={e => e.stopPropagation()}>
        <p style={styles.popupIcon}>🔒</p>
        <p style={styles.popupTitle}>პრემიუმი საჭიროა</p>
        <p style={styles.popupText}>
          ეს გზა მხოლოდ პრემიუმ მომხმარებლებისთვისაა.
          შეიძინე პრემიუმი და გახსენი ყველა გზა და ქალაქი!
        </p>
        <button style={styles.popupBuyBtn} onClick={onBuy}>👑 პრემიუმის შეძენა</button>
        <button style={styles.popupCloseBtn} onClick={onClose}>გაუქმება</button>
      </div>
    </div>
  );
}

export default function CityDetailPage() {
  const navigate = useNavigate();
  const { cityId } = useParams();
  const isPremium = checkPremium();
  const [showPopup, setShowPopup] = useState(false);

  const city = cityData[Number(cityId)] || { name: "ქალაქი", image: "" };

  const routes = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    unlocked: isPremium ? true : i === 0,
  }));

  const handleRoutePress = (route) => {
    if (!route.unlocked) { setShowPopup(true); return; }
    navigate(`/cities/${cityId}/routes/${route.id}`);
  };

  const rows = [];
  for (let i = 0; i < routes.length; i += 3) {
    rows.push(routes.slice(i, i + 3));
  }

  return (
    <div style={styles.screen}>
      {showPopup && (
        <PremiumPopup
          onClose={() => setShowPopup(false)}
          onBuy={() => navigate("/premium")}
        />
      )}

      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        {isPremium && (
          <div style={styles.premiumBadge}>👑 პრემიუმ მომხმარებელი — ყველა გზა ღიაა</div>
        )}

        <div style={styles.cityCard}>
          <div style={styles.cityImageWrapper}>
            <img src={city.image} alt={city.name} style={styles.cityImage}
              onError={(e) => { e.target.style.display = "none"; }} />
          </div>
          <div style={styles.cityNameBar}>
            <span style={styles.cityNameText}>{city.name}</span>
          </div>
        </div>

        <div style={styles.routesContainer}>
          {rows.map((row, ri) => (
            <div key={ri} style={styles.routeRow}>
              {row.map((route) => (
                <RouteButton key={route.id} route={route} onPress={handleRoutePress} />
              ))}
            </div>
          ))}
        </div>

        <button style={styles.theoryBtn} onClick={() => navigate("/signs")}>
          საგზაო ნიშნები და{"\n"}მოქცევის წესები
        </button>
      </div>

      <BottomNav active="map" />
    </div>
  );
}

const styles = {
  screen: { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#0d1f0d", fontFamily: "'BPG Arial', 'Sylfaen', sans-serif", userSelect: "none" },
  container: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 16px 16px", gap: "18px", maxWidth: "420px", width: "100%", margin: "0 auto" },
  backBtn: { alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", padding: "4px", marginBottom: "-6px" },
  premiumBadge: { backgroundColor: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "8px 16px", width: "100%", textAlign: "center", color: "#f59e0b", fontSize: 13, fontWeight: 700 },
  cityCard: { width: "100%", borderRadius: "16px", overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.5)" },
  cityImageWrapper: { width: "100%", height: "160px", backgroundColor: "#2d5a27", overflow: "hidden" },
  cityImage: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  cityNameBar: { backgroundColor: "#1e4d1e", padding: "12px 16px", textAlign: "center", borderTop: "1px solid rgba(74,222,128,0.15)" },
  cityNameText: { color: "white", fontSize: "18px", fontWeight: "700" },
  routesContainer: { width: "100%", display: "flex", flexDirection: "column", gap: "12px" },
  routeRow: { display: "flex", flexDirection: "row", gap: "10px", justifyContent: "flex-start" },
  routeBtn: { display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "#1e2e1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", overflow: "hidden", cursor: "pointer", transition: "transform 0.12s ease", minWidth: "100px", height: "42px", padding: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
  routeLabel: { color: "white", fontSize: "13px", fontWeight: "600", padding: "0 10px 0 14px", whiteSpace: "nowrap" },
  lockBadge: { display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "42px", flexShrink: 0, borderRadius: "0 30px 30px 0" },
  theoryBtn: { backgroundColor: "#1e3a4a", color: "#93c5fd", border: "1.5px solid rgba(147,197,253,0.3)", borderRadius: "16px", padding: "16px 20px", fontSize: "15px", fontWeight: "600", cursor: "pointer", width: "100%", whiteSpace: "pre-line", textAlign: "center", lineHeight: "1.5", marginTop: "auto" },
  popupOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  popupBox: { backgroundColor: "#1a2e1a", borderRadius: 20, padding: "28px 22px", width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, border: "1px solid rgba(245,158,11,0.3)" },
  popupIcon: { fontSize: 48, margin: 0 },
  popupTitle: { color: "white", fontSize: 20, fontWeight: 800, margin: 0 },
  popupText: { color: "#d1fae5", fontSize: 14, lineHeight: 1.6, textAlign: "center", margin: 0 },
  popupBuyBtn: { backgroundColor: "#f59e0b", color: "#0f172a", border: "none", borderRadius: 14, padding: "14px 28px", fontSize: 16, fontWeight: 800, cursor: "pointer", width: "100%", boxShadow: "0 4px 14px rgba(245,158,11,0.35)" },
  popupCloseBtn: { backgroundColor: "transparent", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px", fontSize: 14, cursor: "pointer", width: "100%" },
};
