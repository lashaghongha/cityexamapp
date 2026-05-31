import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { logout, getUser } from "../services/authService";

function NotificationDropdown({ value, onChange, onClose }) {
  return (
    <div style={nd.wrapper}>
      {["Allow", "Mute"].map(opt => (
        <button
          key={opt}
          style={{ ...nd.option, color: value === opt ? "#6366f1" : "#1a1a1a" }}
          onClick={() => { onChange(opt); onClose(); }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const nd = {
  wrapper: {
    position: "absolute", right: 0, top: "110%",
    backgroundColor: "white", borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    overflow: "hidden", zIndex: 50, minWidth: 90,
    border: "1px solid rgba(0,0,0,0.07)",
  },
  option: {
    display: "block", width: "100%", padding: "13px 20px",
    background: "none", border: "none",
    fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "center",
  },
};

function Avatar({ imageUrl }) {
  return (
    <div style={styles.avatarBox}>
      {imageUrl
        ? <img src={imageUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <svg width="52" height="52" viewBox="0 0 24 24" fill="#9ca3af">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
      }
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getUser();

  const [notifOpen,  setNotifOpen]  = useState(false);
  const [notifValue, setNotifValue] = useState("Allow");
  const [form, setForm] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleFormChange = (field, val) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={styles.screen} onClick={() => notifOpen && setNotifOpen(false)}>
      <div style={styles.container}>

        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#c8a84b">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        {/* Card 1: user info + settings */}
        <div style={styles.card}>
          <div style={styles.userRow}>
            <Avatar imageUrl={user?.profileImageUrl} />
            <div style={styles.userMeta}>
              <p style={styles.userName}>{user?.name || "სახელი"}</p>
              <p style={styles.userEmail}>{user?.email || "email@example.com"}</p>
            </div>
          </div>

          <div style={styles.divider}/>

          <div style={styles.settingRow} onClick={e => e.stopPropagation()}>
            <div style={styles.settingLeft}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span style={styles.settingLabel}>Notification</span>
            </div>
            <div style={{ position: "relative" }}>
              <button style={styles.allowBtn} onClick={() => setNotifOpen(o => !o)}>
                {notifValue}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b7280"
                  style={{ marginLeft: 4, transition: "transform 0.2s",
                    transform: notifOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              {notifOpen && (
                <NotificationDropdown
                  value={notifValue}
                  onChange={setNotifValue}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>
          </div>

          <div style={styles.divider}/>

          <div style={{ ...styles.settingRow, cursor: "pointer" }} onClick={handleLogout}>
            <div style={styles.settingLeft}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span style={{ ...styles.settingLabel, color: "#ef4444" }}>გამოსვლა</span>
            </div>
          </div>
        </div>

        {/* Card 2: edit form */}
        <div style={styles.card}>
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>სახელი</label>
            <input
              style={styles.fieldInput}
              placeholder="შენი სახელი"
              value={form.name}
              onChange={e => handleFormChange("name", e.target.value)}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Mail</label>
            <input
              style={styles.fieldInput}
              placeholder="შენი მეილი"
              type="email"
              value={form.email}
              onChange={e => handleFormChange("email", e.target.value)}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>მობ. ნომერი</label>
            <input
              style={styles.fieldInput}
              placeholder="ტელეფონის ნომერი"
              type="tel"
              value={form.phone}
              onChange={e => handleFormChange("phone", e.target.value)}
            />
          </div>

          <button style={styles.saveBtn}>შენახვა</button>
        </div>

      </div>

      <BottomNav active="profile" />
    </div>
  );
}

const styles = {
  screen: {
    display: "flex", flexDirection: "column", minHeight: "100vh",
    backgroundColor: "#0d1f0d",
    fontFamily: "'BPG Arial','Sylfaen',sans-serif",
    userSelect: "none",
  },
  container: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center",
    padding: "16px 16px 20px",
    gap: 18,
    maxWidth: 420, width: "100%", margin: "0 auto",
  },
  backBtn: {
    alignSelf: "flex-start",
    background: "none", border: "none", cursor: "pointer", padding: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18, padding: "18px 20px",
    width: "100%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
  },
  userRow: {
    display: "flex", flexDirection: "row",
    alignItems: "center", gap: 14, paddingBottom: 14,
  },
  avatarBox: {
    width: 68, height: 68, borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, overflow: "hidden",
  },
  userMeta: { display: "flex", flexDirection: "column", gap: 3 },
  userName:  { margin: 0, fontSize: 16, fontWeight: 700, color: "#111" },
  userEmail: { margin: 0, fontSize: 13, color: "#6b7280" },
  divider: {
    height: 1, backgroundColor: "#f3f4f6",
    marginLeft: -20, marginRight: -20, marginBottom: 12,
  },
  settingRow: {
    display: "flex", flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
    paddingTop: 2, paddingBottom: 10, position: "relative",
  },
  settingLeft: {
    display: "flex", flexDirection: "row", alignItems: "center", gap: 10,
  },
  settingLabel: { fontSize: 15, fontWeight: 600, color: "#111" },
  allowBtn: {
    display: "flex", alignItems: "center",
    background: "none", border: "none",
    fontSize: 14, fontWeight: 600, color: "#6b7280",
    cursor: "pointer", padding: "4px 6px",
  },
  fieldGroup: {
    display: "flex", flexDirection: "column", gap: 6, marginBottom: 14,
  },
  fieldLabel: { fontSize: 14, fontWeight: 700, color: "#111" },
  fieldInput: {
    backgroundColor: "#f3f4f6", border: "none", borderRadius: 12,
    padding: "13px 16px", fontSize: 14, color: "#374151",
    outline: "none", fontFamily: "inherit",
  },
  saveBtn: {
    marginTop: 4,
    backgroundColor: "#22c55e", color: "white",
    border: "none", borderRadius: 12, padding: "13px",
    fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%",
    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
  },
};
