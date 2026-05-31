import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const FALLBACKS = ["#2d5a27","#3a4a2a","#2a4a3a","#3a2a4a","#2a3a4a","#4a3a2a","#2a4a2a","#4a2a2a"];

// ---- City Card ----
function CityCard({ city, onPress }) {
  const [imgError, setImgError] = useState(false);
  const [pressed, setPressed]   = useState(false);
  const hasImage = city.image && !imgError;

  return (
    <button
      style={{
        ...styles.cityCard,
        transform: pressed ? "scale(0.97)" : "scale(1)",
        boxShadow: pressed
          ? "0 2px 8px rgba(0,0,0,0.5)"
          : "0 6px 20px rgba(0,0,0,0.45)",
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => { setPressed(false); onPress(city); }}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => { setPressed(false); onPress(city); }}
    >
      <div style={{ ...styles.cityImageWrapper, backgroundColor: city.fallback }}>

        {/* Photo */}
        {hasImage && (
          <img src={city.image} alt={city.name} style={styles.cityImage}
            onError={() => setImgError(true)} />
        )}

        {/* Fallback icon (no photo) */}
        {!hasImage && (
          <div style={styles.cityImageFallback}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        )}

        {/* Full-height gradient */}
        <div style={styles.gradient} />

        {/* Name + arrow row */}
        <div style={styles.nameRow}>
          <span style={styles.cityName}>{city.name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
          </svg>
        </div>

      </div>
    </button>
  );
}


// ---- Main Cities Page ----
export default function CitiesPage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("/api/cities")
      .then(r => r.ok ? r.json() : [])
      .then(data => setCities(data.map((c, i) => ({ ...c, fallback: FALLBACKS[i % FALLBACKS.length] }))))
      .catch(() => {});
  }, []);

  return (
    <div style={styles.screen}>
      <div style={styles.container}>

        <div style={styles.header}>
          <h1 style={styles.headerTitle}>საგამოდო ქალაქები</h1>
        </div>

        <div style={styles.subtitleBadge}>
          <span style={styles.subtitleText}>აირჩიე რომლის სწავლაც გსურს</span>
        </div>

        <div style={styles.grid}>
          {cities.map((city) => (
            <CityCard key={city.id} city={{ ...city, image: city.imageUrl }} onPress={(c) => navigate(`/cities/${c.id}`)} />
          ))}
        </div>

      </div>
      <BottomNav active="map" />
    </div>
  );
}

// ---- Styles ----
const styles = {
  screen: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#0d1f0d",
    fontFamily: "'BPG Arial', 'Sylfaen', sans-serif",
    userSelect: "none",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 14px 16px",
    gap: "14px",
    maxWidth: "420px",
    width: "100%",
    margin: "0 auto",
  },

  header: {
    backgroundColor: "#1e4d1e",
    borderRadius: "18px",
    padding: "16px 24px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
    border: "1px solid rgba(74,222,128,0.2)",
  },
  headerTitle: {
    color: "white",
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "0.3px",
  },

  subtitleBadge: {
    backgroundColor: "#93c5fd22",
    border: "1px solid rgba(147,197,253,0.35)",
    borderRadius: "20px",
    padding: "8px 20px",
  },
  subtitleText: {
    color: "#93c5fd",
    fontSize: "13px",
    fontWeight: "500",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    width: "100%",
  },

  cityCard: {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    borderRadius: "14px",
    overflow: "hidden",
    transition: "transform 0.15s ease",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
  },
  cityImageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 0.85",
    borderRadius: "14px",
    overflow: "hidden",
  },
  cityImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cityImageFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.88) 100%)",
    borderRadius: "14px",
  },
  nameRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
  },
  cityName: {
    color: "white",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.2px",
    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
    lineHeight: 1.2,
  },
  cityNameOverlay: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cityNameBadge: {
    backgroundColor: "rgba(0,0,0,0.62)",
    color: "white",
    fontSize: "14px",
    fontWeight: "700",
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "14px",
    paddingRight: "14px",
    borderRadius: "20px",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.18)",
    letterSpacing: "0.3px",
    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
    whiteSpace: "nowrap",
  },

  bottomNav: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#0a150a",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "12px 0 16px",
  },
  navBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  navDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
  },
};
