import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

// ---- Category Row ----
function CategoryRow({ cat, onPress }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      style={{
        ...styles.row,
        transform: pressed ? "scale(0.98)" : "scale(1)",
        opacity: pressed ? 0.85 : 1,
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => { setPressed(false); onPress(cat); }}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => { setPressed(false); onPress(cat); }}
    >
      <div style={styles.countBadge}>
        <span style={styles.countText}>{cat.count}</span>
      </div>
      <span style={styles.catName}>{cat.name}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#9ca3af" style={{ flexShrink: 0 }}>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </button>
  );
}

// ---- Main Page ----
export default function RoadSignsPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/sign-categories")
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  return (
    <div style={styles.screen}>
      <div style={styles.container}>

        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        <div style={styles.header}>
          <p style={styles.headerText}>საგზაო ნიშნები და{"\n"}მოქცევის წესები</p>
        </div>

        <div style={styles.list}>
          {categories.map(cat => (
            <CategoryRow key={cat.id} cat={cat} onPress={(c) => navigate(`/signs/${c.id}`)} />
          ))}
        </div>

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
    padding: "16px 16px 20px",
    gap: 14,
    maxWidth: 420, width: "100%", margin: "0 auto",
  },

  backBtn: {
    alignSelf: "flex-start",
    background: "none", border: "none", cursor: "pointer", padding: 4,
    marginBottom: -6,
  },

  header: {
    backgroundColor: "#1e4d1e",
    borderRadius: 16, padding: "16px 20px",
    width: "100%", textAlign: "center",
    border: "1px solid rgba(74,222,128,0.18)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  },
  headerText: {
    color: "white", fontSize: 17, fontWeight: 700,
    margin: 0, lineHeight: 1.5, whiteSpace: "pre-line",
  },

  list: {
    display: "flex", flexDirection: "column",
    gap: 10, width: "100%",
  },

  row: {
    display: "flex", flexDirection: "row",
    alignItems: "center", gap: 14,
    backgroundColor: "#1a2e1a",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: "13px 14px",
    cursor: "pointer", textAlign: "left",
    transition: "transform 0.12s ease, opacity 0.12s ease",
    width: "100%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },

  countBadge: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    minWidth: 40, height: 34,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    padding: "0 8px",
  },
  countText: {
    color: "white", fontSize: 15, fontWeight: 800,
  },

  catName: {
    flex: 1,
    color: "white", fontSize: 15, fontWeight: 500,
    lineHeight: 1.3,
  },
};
