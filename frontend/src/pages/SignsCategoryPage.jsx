import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const typeColors = {
  mandatory:   "#2980b9",
  warning:     "#e67e22",
  prohibition: "#e74c3c",
  info:        "#27ae60",
};

// ---- SVG fallback when no photo uploaded ----
function SignSVG({ index, size = 70 }) {
  const color = Object.values(typeColors)[index % 4];
  const arrows = [
    "M12 4l-8 10h5v6h6v-6h5z",
    "M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4v2h-2l3 4 3-4h-2v-2c0-3.3-2.7-6-6-6s-6 2.7-6 6h2z",
    "M12 4l8 10h-5v6H9v-6H4z",
    "M12 4v8l6-4-6-4zm0 8H6v4h12v-4h-6z",
    "M12 3l-5 7h3v8h4v-8h3z",
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill={color} stroke="white" strokeWidth="1.5"/>
      <path d={arrows[index % arrows.length]} fill="white"/>
    </svg>
  );
}

// ---- Sign Modal ----
function SignModal({ sign, index, onClose }) {
  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <button style={modal.closeBtn} onClick={onClose}>✕</button>

        <div style={modal.top}>
          <div style={modal.signLarge}>
            {sign.imageUrl
              ? <img src={sign.imageUrl} alt={sign.name} style={{ width: 90, height: 90, objectFit: "contain" }} />
              : <SignSVG index={index} size={90} />
            }
          </div>
          <div style={modal.meta}>
            <span style={modal.code}>{sign.code}</span>
            <span style={modal.name}>{sign.name}</span>
          </div>
        </div>

        <p style={modal.description}>{sign.description || "აღწერა არ არის"}</p>
      </div>
    </div>
  );
}

const modal = {
  overlay: {
    position: "fixed", inset: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 100, padding: 20,
  },
  box: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: "20px 18px",
    width: "100%", maxWidth: 340,
    position: "relative",
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
  },
  closeBtn: {
    position: "absolute", top: 12, right: 14,
    background: "none", border: "none",
    fontSize: 18, cursor: "pointer",
    color: "#6b7280", lineHeight: 1,
  },
  top: {
    display: "flex", flexDirection: "row",
    alignItems: "center", gap: 14,
    marginBottom: 14,
  },
  signLarge: {
    flexShrink: 0,
    backgroundColor: "#f3f4f6",
    borderRadius: 14, padding: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  meta: { display: "flex", flexDirection: "column", gap: 5 },
  code: { fontSize: 11, color: "#e74c3c", fontWeight: 700, letterSpacing: "0.5px" },
  name: { fontSize: 15, fontWeight: 700, color: "#111", lineHeight: 1.3 },
  description: {
    fontSize: 13, color: "#374151", lineHeight: 1.7,
    margin: 0,
  },
};

// ---- Sign Card ----
function SignCard({ sign, index, onPress }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      style={{
        ...styles.signCard,
        transform: pressed ? "scale(0.93)" : "scale(1)",
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => { setPressed(false); onPress(sign, index); }}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => { setPressed(false); onPress(sign, index); }}
    >
      <div style={styles.signImgBox}>
        {sign.imageUrl
          ? <img src={sign.imageUrl} alt={sign.name} style={{ width: 58, height: 58, objectFit: "contain" }} />
          : <SignSVG index={index} size={58} />
        }
      </div>
      <span style={styles.signCode}>{sign.code}</span>
      <span style={styles.signName}>{sign.name}</span>
    </button>
  );
}

// ---- Main Page ----
export default function SignsCategoryPage() {
  const navigate = useNavigate();
  const { categoryId: categoryIdParam } = useParams();
  const [signs, setSigns]               = useState([]);
  const [category, setCategory]         = useState(null);
  const [selectedSign, setSelectedSign] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const categoryId = Number(categoryIdParam) || 1;

  useEffect(() => {
    fetch("/api/sign-categories")
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategory(data.find(c => c.id === categoryId) || null))
      .catch(() => {});

    fetch(`/api/signs/${categoryId}`)
      .then(r => r.ok ? r.json() : [])
      .then(setSigns)
      .catch(() => {});
  }, [categoryId]);

  const handlePress = (sign, index) => {
    setSelectedSign(sign);
    setSelectedIndex(index);
  };

  return (
    <div style={styles.screen}>
      {selectedSign && (
        <SignModal sign={selectedSign} index={selectedIndex} onClose={() => setSelectedSign(null)} />
      )}

      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        {category && (
          <div style={styles.headerBadge}>
            <div style={styles.countPill}>
              <span style={styles.countText}>{category.count}</span>
            </div>
            <span style={styles.catNameText}>{category.name}</span>
          </div>
        )}

        {signs.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: 40 }}>🪧</span>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>ნიშნები ჯერ არ არის დამატებული</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {signs.map((sign, i) => (
              <SignCard key={sign.id} sign={sign} index={i} onPress={handlePress} />
            ))}
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}

// ---- Styles ----
const styles = {
  screen: {
    display: "flex", flexDirection: "column", minHeight: "100vh",
    backgroundColor: "#0d1f0d",
    fontFamily: "'BPG Arial','Sylfaen',sans-serif",
    userSelect: "none",
  },
  container: {
    flex: 1,
    display: "flex", flexDirection: "column",
    alignItems: "center",
    padding: "16px 14px 20px",
    gap: 14,
    maxWidth: 440, width: "100%", margin: "0 auto",
  },

  backBtn: {
    alignSelf: "flex-start",
    background: "none", border: "none", cursor: "pointer", padding: 4,
    marginBottom: -4,
  },

  headerBadge: {
    display: "flex", flexDirection: "row",
    alignItems: "center", gap: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 12, padding: "8px 16px 8px 8px",
    alignSelf: "flex-start",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  countPill: {
    backgroundColor: "#e74c3c",
    borderRadius: 8, padding: "5px 10px",
    minWidth: 38,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  countText: { color: "white", fontWeight: 800, fontSize: 15 },
  catNameText: { color: "#111", fontWeight: 700, fontSize: 15 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10, width: "100%",
  },

  signCard: {
    backgroundColor: "#1a2e1a",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "12px 6px 10px",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 6,
    cursor: "pointer",
    transition: "transform 0.12s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  signImgBox: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 70, height: 70,
  },
  signCode: {
    color: "#e74c3c", fontSize: 10, fontWeight: 700,
    letterSpacing: "0.3px",
  },
  signName: {
    color: "#d1fae5", fontSize: 10, fontWeight: 500,
    textAlign: "center", lineHeight: 1.3,
    maxWidth: 90,
  },

  empty: {
    flex: 1,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 12, padding: 40,
  },
};
