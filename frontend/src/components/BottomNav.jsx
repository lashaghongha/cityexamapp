import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  return (
    <nav style={styles.bottomNav}>
      
      {/* Cities */}
      <button
        style={styles.navBtn}
        onClick={() => navigate("/cities")}
      >
        <svg width="26" height="26" viewBox="0 0 24 24"
          fill={path.startsWith("/cities") ? "#4ade80" : "#9ca3af"}>
          <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
        </svg>
      </button>

      {/* Home */}
      <button
        style={styles.navBtn}
        onClick={() => navigate("/")}
      >
        <svg width="26" height="26" viewBox="0 0 24 24"
          fill={path === "/" ? "#4ade80" : "#9ca3af"}>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </button>

      {/* Profile */}
      <button
        style={styles.navBtn}
        onClick={() => navigate("/profile")}
      >
        <svg width="26" height="26" viewBox="0 0 24 24"
          fill={path === "/profile" ? "#4ade80" : "#9ca3af"}>
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </button>

    </nav>
  );
}

// ---- styles ----
const styles = {
  bottomNav: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#0f172a",
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
};