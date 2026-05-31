import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";

// ---- Sign icon: uploaded photo or placeholder ----
function SignIcon({ sign, size = 44 }) {
  if (sign.imageUrl) {
    return (
      <img
        src={sign.imageUrl}
        alt={sign.name}
        style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      backgroundColor: "#1e3a1e", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "1px solid rgba(255,255,255,0.1)",
    }}>
      <span style={{ fontSize: size * 0.45 }}>🪧</span>
    </div>
  );
}

// ---- Map placeholder SVG ----
function MapPlaceholder({ routeNumber }) {
  return (
    <svg viewBox="0 0 320 170" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="170" fill="#c8dfc8"/>
      <path d="M0,85 Q40,65 80,85 Q120,105 160,85 Q200,65 240,85 Q280,105 320,85"
        stroke="#6ab0d4" strokeWidth="20" fill="none" opacity="0.7"/>
      <rect x="55" y="55" width="210" height="14" fill="#e8e0c8" rx="2"/>
      <rect x="55" y="101" width="210" height="14" fill="#e8e0c8" rx="2"/>
      <rect x="95"  y="22" width="12" height="126" fill="#e8e0c8" rx="2"/>
      <rect x="155" y="22" width="12" height="126" fill="#e8e0c8" rx="2"/>
      <rect x="215" y="22" width="12" height="126" fill="#e8e0c8" rx="2"/>
      {[
        {x:103,y:51,c:"#e74c3c"},{x:125,y:57,c:"#e67e22"},
        {x:147,y:49,c:"#e74c3c"},{x:170,y:55,c:"#27ae60"},
        {x:190,y:53,c:"#2980b9"},{x:210,y:58,c:"#e74c3c"},
        {x:230,y:51,c:"#8e44ad"},{x:250,y:57,c:"#e67e22"},
        {x:270,y:52,c:"#e74c3c"},
      ].map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="5" fill={s.c} stroke="white" strokeWidth="1"/>
      ))}
      <path d="M65,62 L125,62 L125,108 L215,108 L215,62 L285,62"
        stroke="#2ecc71" strokeWidth="3.5" fill="none" strokeDasharray="7,3" opacity="0.95"/>
      <rect x="222" y="118" width="90" height="46" fill="white" rx="4" opacity="0.88"/>
      <circle cx="230" cy="126" r="3" fill="#2ecc71"/>
      <text x="236" y="129" fontSize="5" fill="#333">გამავლობის გზა</text>
      <circle cx="230" cy="136" r="3" fill="#e74c3c"/>
      <text x="236" y="139" fontSize="5" fill="#333">გაჩერება აკრძ.</text>
      <circle cx="230" cy="146" r="3" fill="#2980b9"/>
      <text x="236" y="149" fontSize="5" fill="#333">სხვა ნიშნები</text>
      <rect x="5" y="5" width="30" height="16" fill="#1e4d1e" rx="4" opacity="0.85"/>
      <text x="20" y="16" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">
        №{routeNumber}
      </text>
    </svg>
  );
}

// ---- Map Component ----
function RouteMap({ routeNumber, imageUrl, onFullscreen }) {
  return (
    <div style={styles.mapOuter}>
      <button style={styles.zoomBtn} onClick={onFullscreen}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#333">
          <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </button>

      {imageUrl
        ? <img src={imageUrl} alt={`გზა №${routeNumber}`} style={styles.mapImage} />
        : <MapPlaceholder routeNumber={routeNumber} />
      }
    </div>
  );
}

// ---- Main Route Detail Page ----
export default function RouteDetailPage() {
  const { cityId, routeId } = useParams();
  const navigate = useNavigate();
  const [mapImageUrl, setMapImageUrl] = useState(null);
  const [signs, setSigns]             = useState([]);

  useEffect(() => {
    fetch(`/api/maps/${cityId}/${routeId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.imageUrl) setMapImageUrl(data.imageUrl); })
      .catch(() => {});

    fetch(`/api/route-signs/${cityId}/${routeId}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setSigns(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [cityId, routeId]);

  const routeNum = Number(routeId) || 1;

  return (
    <div style={styles.screen}>
      <div style={styles.container}>

        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        <div style={styles.routeTitle}>
          <span style={styles.routeTitleText}>გზა №{routeNum}</span>
        </div>

        <div
          style={styles.mapCard}
          onClick={() => navigate(`/cities/${cityId}/routes/${routeId}/map`)}
        >
          <RouteMap
            routeNumber={routeNum}
            imageUrl={mapImageUrl}
            onFullscreen={() => navigate(`/cities/${cityId}/routes/${routeId}/map`)}
          />
        </div>

        {!mapImageUrl && (
          <div style={styles.noMapBadge}>
            🗺️ ადმინის პანელიდან ატვირთე რუკა ამ გზისთვის
          </div>
        )}

        {signs.length > 0 && (
          <div style={styles.signsSection}>
            <p style={styles.signsSectionTitle}>რუკაზე გამოყენებული ნიშნები</p>
            <div style={styles.signsList}>
              {signs.map((sign) => (
                <div key={sign.id} style={styles.signRow}>
                  <SignIcon sign={sign} size={44} />
                  <div style={styles.signDivider} />
                  <span style={styles.signName}>{sign.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <BottomNav active="map" />
    </div>
  );
}

// ---- Styles ----
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
    padding: "16px 16px 16px",
    gap: "14px",
    maxWidth: "420px", width: "100%", margin: "0 auto",
  },
  backBtn: {
    alignSelf: "flex-start", background: "none", border: "none",
    cursor: "pointer", padding: "4px", marginBottom: "-4px",
  },
  routeTitle: {
    backgroundColor: "#1e4d1e", borderRadius: 12,
    padding: "10px 24px", alignSelf: "center",
    border: "1px solid rgba(74,222,128,0.2)",
  },
  routeTitleText: { color: "white", fontSize: 16, fontWeight: 700 },
  mapCard: {
    width: "100%", borderRadius: "16px", overflow: "hidden",
    backgroundColor: "#162016",
    border: "2px solid rgba(74,222,128,0.15)",
    boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
    position: "relative", cursor: "pointer",
  },
  mapOuter: {
    width: "100%", height: "185px",
    position: "relative", backgroundColor: "#c8dfc8",
  },
  mapImage: {
    width: "100%", height: "100%", objectFit: "cover", display: "block",
  },
  zoomBtn: {
    position: "absolute", top: "8px", left: "8px", zIndex: 10,
    backgroundColor: "white", border: "none", borderRadius: "6px",
    width: "30px", height: "30px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  noMapBadge: {
    backgroundColor: "rgba(255,165,0,0.1)",
    border: "1px solid rgba(255,165,0,0.25)",
    borderRadius: 12, padding: "10px 16px",
    color: "#ffa500", fontSize: 13, textAlign: "center", width: "100%",
  },
  signsSection: {
    width: "100%", backgroundColor: "#162016",
    borderRadius: "16px", padding: "16px",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  signsSectionTitle: {
    color: "white", fontSize: "15px", fontWeight: "700",
    margin: "0 0 14px 0", textAlign: "center",
  },
  signsList: { display: "flex", flexDirection: "column", gap: "12px" },
  signRow: { display: "flex", flexDirection: "row", alignItems: "center", gap: "14px" },
  signDivider: { width: "32px", height: "2px", backgroundColor: "#374151", flexShrink: 0 },
  signName: { color: "#d1fae5", fontSize: "13px", fontWeight: "500", lineHeight: "1.4" },
};
