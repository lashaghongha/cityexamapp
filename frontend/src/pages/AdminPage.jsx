import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── API Base URL ─────────────────────────────
const API = "";

// ── API helpers ──────────────────────────────
const api = {
  get: async (path) => {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  },
  put: async (path, body) => {
    const res = await fetch(`${API}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
    return res.json();
  },
  post: async (path, body) => {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  },
  postForm: async (path, formData) => {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  },
  delete: async (path) => {
    const res = await fetch(`${API}${path}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  },
};

// ── Sidebar tabs ─────────────────────────────
const TABS = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "cities",    icon: "🏙️", label: "ქალაქები" },
  { id: "maps",      icon: "🗺️",  label: "რუკები" },
  { id: "roadsigns", icon: "🚦", label: "ნიშნები" },
  { id: "theory",    icon: "📚", label: "თეორია" },
  { id: "users",     icon: "👥", label: "მომხმარებლები" },
  { id: "premium",   icon: "👑", label: "პრემიუმები" },
  { id: "settings",  icon: "⚙️", label: "პარამეტრები" },
];

// ── Loading / Error helpers ──────────────────
function Loader() {
  return <div style={{ color: "#9ca3af", padding: 40, textAlign: "center" }}>⏳ იტვირთება...</div>;
}
function ErrorMsg({ msg }) {
  return <div style={{ color: "#ef4444", padding: 20, backgroundColor: "rgba(239,68,68,0.1)", borderRadius: 12, margin: 20 }}>❌ შეცდომა: {msg}</div>;
}

// ════════════════════════════════════════════
// Login Gate — პაროლი backend-ის Settings-დან
// ════════════════════════════════════════════
function AdminLogin({ onSuccess }) {
  const [pass, setPass]     = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const settings = await api.get("/api/admin/settings");
      if (pass === settings.adminPassword) {
        onSuccess();
      } else {
        setError("პაროლი არასწორია");
      }
    } catch (e) {
      // fallback: თუ backend არ პასუხობს, hardcode-ით შევამოწმოთ
      if (pass === "admin2024!") {
        onSuccess();
      } else {
        setError("პაროლი არასწორია (ან სერვერი მიუწვდომელია)");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={ls.screen}>
      <div style={ls.card}>
        <div style={ls.icon}>🛡️</div>
        <p style={ls.title}>Admin Panel</p>
        <p style={ls.sub}>შეიყვანე ადმინის პაროლი</p>
        {error && <p style={ls.error}>{error}</p>}
        <input
          style={ls.input}
          type="password"
          placeholder="••••••••"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button style={{ ...ls.btn, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? "⏳ შემოწმება..." : "შესვლა"}
        </button>
      </div>
    </div>
  );
}

const ls = {
  screen:  { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#0a0a0f", fontFamily: "sans-serif" },
  card:    { backgroundColor: "#111118", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "40px 32px", width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  icon:    { fontSize: 48 },
  title:   { color: "white", fontSize: 24, fontWeight: 800, margin: 0 },
  sub:     { color: "#6b7280", fontSize: 14, margin: 0 },
  error:   { color: "#ef4444", fontSize: 13, margin: 0 },
  input:   { width: "100%", backgroundColor: "#1a1a2e", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "13px 16px", fontSize: 15, color: "white", outline: "none", boxSizing: "border-box" },
  btn:     { width: "100%", backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
};

// ════════════════════════════════════════════
// Dashboard
// ════════════════════════════════════════════
function Dashboard() {
  const [data, setData]   = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/users"),
      api.get("/api/admin/maps"),
      api.get("/api/admin/theory"),
    ])
      .then(([users, maps, theory]) => setData({ users, maps, theory }))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorMsg msg={error} />;
  if (!data) return <Loader />;

  const { users, maps, theory } = data;
  const premium = users.filter((u) => u.isPremium).length;
  const uploadedMaps = maps.filter((m) => m.imageUrl).length;

  const stats = [
    { label: "სულ მომხმარებელი", value: users.length, color: "#6366f1", icon: "👥" },
    { label: "პრემიუმ",          value: premium,       color: "#f59e0b", icon: "👑" },
    { label: "ატვირთული რუკა",  value: uploadedMaps,  color: "#22c55e", icon: "🗺️" },
    { label: "თეორიის კითხვა",  value: theory.length, color: "#3b82f6", icon: "📚" },
  ];

  return (
    <div style={p.section}>
      <p style={p.sectionTitle}>Dashboard</p>
      <div style={p.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} style={{ ...p.statCard, borderColor: s.color + "44" }}>
            <span style={p.statIcon}>{s.icon}</span>
            <p style={{ ...p.statValue, color: s.color }}>{s.value}</p>
            <p style={p.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      <p style={p.subTitle}>ბოლო მომხმარებლები</p>
      <div style={p.table}>
        <div style={p.tableHeader}>
          <span style={{ flex: 2 }}>სახელი</span>
          <span style={{ flex: 2 }}>Email</span>
          <span style={{ flex: 1 }}>სტატუსი</span>
        </div>
        {users.slice(0, 5).map((u) => (
          <div key={u.id} style={p.tableRow}>
            <span style={{ flex: 2, color: "white" }}>{u.name}</span>
            <span style={{ flex: 2, color: "#9ca3af", fontSize: 12 }}>{u.email}</span>
            <span style={{ flex: 1 }}>
              <span style={{ ...p.badge, backgroundColor: u.isPremium ? "rgba(245,158,11,0.2)" : "rgba(107,114,128,0.2)", color: u.isPremium ? "#f59e0b" : "#9ca3af" }}>
                {u.isPremium ? "👑 Premium" : "Free"}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Cities Manager
// ════════════════════════════════════════════
function CitiesManager() {
  const [cities, setCities]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    api.get("/api/cities")
      .then(setCities)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (cityId, file) => {
    if (!file) return;
    setUploading(cityId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const updated = await api.postForm(`/api/admin/cities/${cityId}/upload`, fd);
      setCities((prev) => prev.map((c) => (c.id === cityId ? updated : c)));
    } catch (e) {
      alert("ატვირთვა ვერ მოხერხდა: " + e.message);
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <ErrorMsg msg={error} />;

  return (
    <div style={p.section}>
      <p style={p.sectionTitle}>🏙️ ქალაქების სურათები</p>
      <p style={p.hint}>ატვირთე JPG/PNG ფოტო თითოეული ქალაქისთვის</p>

      <div style={p.mapGrid}>
        {cities.map((city) => (
          <div key={city.id} style={p.mapCard}>
            <div style={p.mapPreview}>
              {city.imageUrl
                ? <img src={city.imageUrl} alt={city.name} style={p.mapImg} />
                : <div style={p.mapEmpty}>
                    <span style={{ fontSize: 32 }}>🏙️</span>
                    <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>სურათი არ არის</p>
                  </div>
              }
              {uploading === city.id && (
                <div style={p.uploadOverlay}>
                  <span style={{ color: "white", fontSize: 13 }}>⏳ იტვირთება...</span>
                </div>
              )}
            </div>
            <div style={p.mapInfo}>
              <p style={p.mapTitle}>{city.name}</p>
            </div>
            <label style={p.uploadBtn}>
              {city.imageUrl ? "🔄 შეცვლა" : "⬆️ ატვირთვა"}
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => handleUpload(city.id, e.target.files[0])} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Route Signs Panel (inside Maps section)
// ════════════════════════════════════════════
function RouteSignsPanel({ cityId, routeId, title, onBack }) {
  const [signs, setSigns]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(null);
  const [editing, setEditing]     = useState(null); // null | "new" | id
  const emptyForm = { cityId, routeId, name: "", order: 0 };
  const [form, setForm]           = useState(emptyForm);
  const [pendingFile, setPendingFile] = useState(null); // file selected during create/edit

  useEffect(() => {
    api.get(`/api/admin/route-signs?cityId=${cityId}&routeId=${routeId}`)
      .then(setSigns)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [cityId, routeId]);

  const openNew = () => {
    setForm({ ...emptyForm, order: signs.length + 1 });
    setPendingFile(null);
    setEditing("new");
  };
  const openEdit = (s) => {
    setForm({ cityId, routeId, name: s.name, order: s.order });
    setPendingFile(null);
    setEditing(s.id);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let sign;
      if (editing === "new") {
        sign = await api.post("/api/admin/route-signs", form);
        setSigns((prev) => [...prev, sign]);
      } else {
        sign = await api.put(`/api/admin/route-signs/${editing}`, form);
        setSigns((prev) => prev.map((s) => (s.id === editing ? sign : s)));
      }
      // upload photo if selected
      if (pendingFile) {
        const fd = new FormData();
        fd.append("file", pendingFile);
        const updated = await api.postForm(`/api/admin/route-signs/${sign.id}/upload`, fd);
        setSigns((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
      setEditing(null);
    } catch (e) {
      alert("შენახვა ვერ მოხერხდა: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (signId, file) => {
    if (!file) return;
    setUploading(signId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const updated = await api.postForm(`/api/admin/route-signs/${signId}/upload`, fd);
      setSigns((prev) => prev.map((s) => (s.id === signId ? updated : s)));
    } catch (e) {
      alert("ატვირთვა ვერ მოხერხდა: " + e.message);
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("წაშლა?")) return;
    try {
      await api.delete(`/api/admin/route-signs/${id}`);
      setSigns((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert("წაშლა ვერ მოხერხდა: " + e.message);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <ErrorMsg msg={error} />;

  // ── FORM VIEW ──
  if (editing !== null) {
    return (
      <div style={p.section}>
        <div style={p.formHeader}>
          <button style={p.backBtn} onClick={() => setEditing(null)}>← უკან</button>
          <p style={p.sectionTitle}>{editing === "new" ? "ახალი ნიშანი" : "ნიშნის რედაქტირება"}</p>
        </div>
        <p style={{ color: "#6b7280", fontSize: 13, margin: "-12px 0 16px" }}>{title}</p>
        <div style={p.form}>

          {/* Photo upload */}
          <div style={p.fieldGroup}>
            <label style={p.formLabel}>ნიშნის ფოტო</label>
            <label style={sp.photoUploadBox}>
              {pendingFile ? (
                <img src={URL.createObjectURL(pendingFile)} alt="" style={sp.photoPreview} />
              ) : editing !== "new" && signs.find(s => s.id === editing)?.imageUrl ? (
                <>
                  <img src={signs.find(s => s.id === editing).imageUrl} alt="" style={sp.photoPreview} />
                  <span style={sp.changeHint}>შეცვლა</span>
                </>
              ) : (
                <div style={sp.photoPlaceholder}>
                  <span style={{ fontSize: 32 }}>📷</span>
                  <span style={sp.photoHint}>ფოტოს ატვირთვა</span>
                </div>
              )}
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => setPendingFile(e.target.files[0] || null)} />
            </label>
          </div>

          {/* Name */}
          <div style={p.fieldGroup}>
            <label style={p.formLabel}>ნიშნის სახელი</label>
            <input style={p.formInput} placeholder="მაგ. დაუთმე გზა"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          {/* Order */}
          <div style={p.fieldGroup}>
            <label style={p.formLabel}>თანმიმდევრობა</label>
            <input style={p.formInput} type="number" value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
          </div>

          <button style={{ ...p.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? "⏳ ინახება..." : "✅ შენახვა"}
          </button>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div style={p.section}>
      <div style={p.formHeader}>
        <button style={p.backBtn} onClick={onBack}>← უკან (რუკები)</button>
      </div>
      <div style={p.sectionHeader}>
        <div>
          <p style={p.sectionTitle}>🪧 საგზაო ნიშნები</p>
          <p style={{ color: "#6b7280", fontSize: 13, margin: "-12px 0 0" }}>{title}</p>
        </div>
        <button style={p.addBtn} onClick={openNew}>➕ ახალი ნიშანი</button>
      </div>

      <div style={p.list}>
        {signs.map((s, i) => (
          <div key={s.id} style={{ ...p.listItem, alignItems: "flex-start", gap: 12 }}>
            {/* Photo thumbnail / upload */}
            <label style={sp.thumbLabel}>
              {s.imageUrl
                ? <img src={s.imageUrl} alt="" style={sp.thumbImg} />
                : <div style={sp.thumbEmpty}>
                    {uploading === s.id ? "⏳" : "📷"}
                  </div>
              }
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => handlePhotoUpload(s.id, e.target.files[0])} />
            </label>

            <div style={p.listContent}>
              <p style={p.listTitle}>{s.name || "—"}</p>
              <p style={p.listSub}>თანმ. {s.order}</p>
            </div>

            <div style={p.listActions}>
              <button style={p.editBtn}   onClick={() => openEdit(s)}>✏️</button>
              <button style={p.deleteBtn} onClick={() => handleDelete(s.id)}>🗑️</button>
            </div>
          </div>
        ))}
        {signs.length === 0 && (
          <p style={{ color: "#6b7280", textAlign: "center", padding: 20 }}>ნიშნები არ არის</p>
        )}
      </div>
    </div>
  );
}

// ── Clickable map for marker placement ───────────────────────
function MapPicker({ mapUrl, markerX, markerY, markerNum, onChange }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    onChange(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
  };
  return (
    <div
      onClick={handleClick}
      style={{ position: "relative", height: 200, borderRadius: 12, overflow: "hidden",
        backgroundColor: "#1a1a2e", cursor: "crosshair",
        border: "2px dashed rgba(99,102,241,0.45)" }}
    >
      {mapUrl
        ? <img src={mapUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
            <span style={{ fontSize: 32 }}>🗺️</span>
            <span style={{ color: "#6b7280", fontSize: 13 }}>რუკა ჯერ ატვირთული არ არის — მაგრამ შეგიძლია ციფრები ჩასვა</span>
          </div>
      }
      {/* Marker dot */}
      <div style={{ position: "absolute", left: `${markerX}%`, top: `${markerY}%`,
        transform: "translate(-50%,-50%)", pointerEvents: "none",
        width: 30, height: 30, borderRadius: "50%",
        backgroundColor: "#e74c3c", border: "3px solid white",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
        <span style={{ color: "white", fontSize: 13, fontWeight: 900, lineHeight: 1 }}>{markerNum}</span>
      </div>
      {/* Hint */}
      <div style={{ position: "absolute", bottom: 6, right: 8,
        backgroundColor: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.6)",
        fontSize: 11, padding: "3px 8px", borderRadius: 8, pointerEvents: "none" }}>
        დააჭირე განსათავსებლად · X:{markerX.toFixed(1)}% Y:{markerY.toFixed(1)}%
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Route Questions Panel (inside Maps section)
// ════════════════════════════════════════════
function RouteQuestionsPanel({ cityId, routeId, title, onBack }) {
  const [questions, setQuestions]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [saving, setSaving]           = useState(false);
  const [uploading, setUploading]     = useState(null);
  const [editing, setEditing]         = useState(null);
  const emptyForm = { cityId, routeId, scenario: "", question: "", answerA: "", answerB: "", answerC: "", correctAnswer: "A", explanation: "", markerX: 50, markerY: 50 };
  const [form, setForm]               = useState(emptyForm);
  const [pendingPhoto, setPendingPhoto] = useState(null);

  const [mapImageUrl, setMapImageUrl] = useState(null);

  useEffect(() => {
    api.get(`/api/admin/route-questions?cityId=${cityId}&routeId=${routeId}`)
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    fetch(`/api/maps/${cityId}/${routeId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.imageUrl) setMapImageUrl(data.imageUrl); })
      .catch(() => {});
  }, [cityId, routeId]);

  const openNew = () => { setForm({ ...emptyForm }); setPendingPhoto(null); setEditing("new"); };
  const openEdit = (q) => {
    setForm({ cityId, routeId, scenario: q.scenario, question: q.question,
      answerA: q.answerA, answerB: q.answerB, answerC: q.answerC,
      correctAnswer: q.correctAnswer, explanation: q.explanation,
      markerX: q.markerX ?? 50, markerY: q.markerY ?? 50 });
    setPendingPhoto(null);
    setEditing(q.id);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let q;
      if (editing === "new") {
        q = await api.post("/api/admin/route-questions", form);
        setQuestions((prev) => [...prev, q]);
      } else {
        q = await api.put(`/api/admin/route-questions/${editing}`, form);
        setQuestions((prev) => prev.map((x) => (x.id === editing ? q : x)));
      }
      if (pendingPhoto) {
        const fd = new FormData();
        fd.append("file", pendingPhoto);
        const updated = await api.postForm(`/api/admin/route-questions/${q.id}/upload-photo`, fd);
        setQuestions((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      }
      setEditing(null);
    } catch (e) {
      alert("შენახვა ვერ მოხერხდა: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (qId, file) => {
    if (!file) return;
    setUploading(qId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const updated = await api.postForm(`/api/admin/route-questions/${qId}/upload-photo`, fd);
      setQuestions((prev) => prev.map((x) => (x.id === qId ? updated : x)));
    } catch (e) {
      alert("ატვირთვა ვერ მოხერხდა: " + e.message);
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("წაშლა?")) return;
    try {
      await api.delete(`/api/admin/route-questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (e) {
      alert("წაშლა ვერ მოხერხდა: " + e.message);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <ErrorMsg msg={error} />;

  if (editing !== null) {
    const currentQ = editing !== "new" ? questions.find(x => x.id === editing) : null;
    return (
      <div style={p.section}>
        <div style={p.formHeader}>
          <button style={p.backBtn} onClick={() => setEditing(null)}>← უკან</button>
          <p style={p.sectionTitle}>{editing === "new" ? "ახალი კითხვა" : "კითხვის რედაქტირება"}</p>
        </div>
        <p style={{ color: "#6b7280", fontSize: 13, margin: "-12px 0 16px" }}>{title}</p>
        <div style={p.form}>

          {/* Location photo */}
          <div style={p.fieldGroup}>
            <label style={p.formLabel}>📍 ადგილის ფოტო (რუკაზე ამ ნომრის რეალური ადგილი)</label>
            <label style={sp.photoUploadBox}>
              {pendingPhoto ? (
                <img src={URL.createObjectURL(pendingPhoto)} alt="" style={sp.photoPreview} />
              ) : currentQ?.locationPhotoUrl ? (
                <>
                  <img src={currentQ.locationPhotoUrl} alt="" style={sp.photoPreview} />
                  <span style={sp.changeHint}>შეცვლა</span>
                </>
              ) : (
                <div style={sp.photoPlaceholder}>
                  <span style={{ fontSize: 32 }}>📷</span>
                  <span style={sp.photoHint}>ადგილის ფოტო</span>
                </div>
              )}
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => setPendingPhoto(e.target.files[0] || null)} />
            </label>
          </div>

          {/* Map marker picker */}
          <div style={p.fieldGroup}>
            <label style={p.formLabel}>📌 ნომრის განთავსება რუკაზე — დააჭირე სადაც გინდა</label>
            <MapPicker
              mapUrl={mapImageUrl}
              markerX={form.markerX}
              markerY={form.markerY}
              markerNum={editing === "new" ? questions.length + 1 : questions.findIndex(q => q.id === editing) + 1}
              onChange={(x, y) => setForm({ ...form, markerX: x, markerY: y })}
            />
          </div>

          {[
            ["სცენარი",    "scenario",    "textarea"],
            ["კითხვა",     "question",    "textarea"],
            ["პასუხი A",   "answerA",     "input"],
            ["პასუხი B",   "answerB",     "input"],
            ["პასუხი C",   "answerC",     "input"],
            ["განმარტება", "explanation", "textarea"],
          ].map(([label, field, type]) => (
            <div key={field} style={p.fieldGroup}>
              <label style={p.formLabel}>{label}</label>
              {type === "textarea"
                ? <textarea style={p.textarea} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} rows={3} />
                : <input   style={p.formInput} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
              }
            </div>
          ))}
          <div style={p.fieldGroup}>
            <label style={p.formLabel}>სწორი პასუხი</label>
            <div style={{ display: "flex", gap: 10 }}>
              {["A","B","C"].map((opt) => (
                <button key={opt}
                  style={{ ...p.optBtn, backgroundColor: form.correctAnswer === opt ? "#22c55e" : "#1e2e1e", color: form.correctAnswer === opt ? "white" : "#9ca3af" }}
                  onClick={() => setForm({ ...form, correctAnswer: opt })}
                >{opt}</button>
              ))}
            </div>
          </div>
          <button style={{ ...p.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? "⏳ ინახება..." : "✅ შენახვა"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={p.section}>
      <div style={p.formHeader}>
        <button style={p.backBtn} onClick={onBack}>← უკან (რუკები)</button>
      </div>
      <div style={p.sectionHeader}>
        <div>
          <p style={p.sectionTitle}>📝 სიტუაციური კითხვები</p>
          <p style={{ color: "#6b7280", fontSize: 13, margin: "-12px 0 0" }}>{title}</p>
        </div>
        <button style={p.addBtn} onClick={openNew}>➕ ახალი კითხვა</button>
      </div>
      <div style={p.list}>
        {questions.map((q, i) => (
          <div key={q.id} style={{ ...p.listItem, alignItems: "flex-start", gap: 12 }}>
            {/* location photo thumbnail */}
            <label style={sp.thumbLabel}>
              {q.locationPhotoUrl
                ? <img src={q.locationPhotoUrl} alt="" style={sp.thumbImg} />
                : <div style={sp.thumbEmpty}>{uploading === q.id ? "⏳" : "📍"}</div>
              }
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => handlePhotoUpload(q.id, e.target.files[0])} />
            </label>
            <div style={p.listContent}>
              <p style={p.listTitle}>{q.question}</p>
              <p style={p.listSub}>სწორი: {q.correctAnswer} · X:{q.markerX ?? 50} Y:{q.markerY ?? 50}</p>
            </div>
            <div style={p.listActions}>
              <button style={p.editBtn}   onClick={() => openEdit(q)}>✏️</button>
              <button style={p.deleteBtn} onClick={() => handleDelete(q.id)}>🗑️</button>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
          <p style={{ color: "#6b7280", textAlign: "center", padding: 20 }}>კითხვები არ არის</p>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Maps Manager
// ════════════════════════════════════════════
function MapsManager() {
  const [maps, setMaps]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [uploading, setUploading]   = useState(null);
  const [selectedMap, setSelectedMap] = useState(null); // null | { map, panel: "questions"|"signs" }

  useEffect(() => {
    api.get("/api/admin/maps")
      .then(setMaps)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (mapId, file) => {
    if (!file) return;
    setUploading(mapId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const updated = await api.postForm(`/api/admin/maps/${mapId}/upload`, formData);
      setMaps((prev) => prev.map((m) => (m.id === mapId ? updated : m)));
    } catch (e) {
      alert("ატვირთვა ვერ მოხერხდა: " + e.message);
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <ErrorMsg msg={error} />;

  if (selectedMap?.panel === "questions") {
    return (
      <RouteQuestionsPanel
        cityId={selectedMap.map.cityId}
        routeId={selectedMap.map.route}
        title={`${selectedMap.map.city} — გზა №${selectedMap.map.route}`}
        onBack={() => setSelectedMap(null)}
      />
    );
  }
  if (selectedMap?.panel === "signs") {
    return (
      <RouteSignsPanel
        cityId={selectedMap.map.cityId}
        routeId={selectedMap.map.route}
        title={`${selectedMap.map.city} — გზა №${selectedMap.map.route}`}
        onBack={() => setSelectedMap(null)}
      />
    );
  }

  return (
    <div style={p.section}>
      <p style={p.sectionTitle}>🗺️ რუკების მართვა</p>
      <p style={p.hint}>ატვირთე JPG/PNG სახის რუკა თითოეული გზისთვის</p>

      <div style={p.mapGrid}>
        {maps.map((m) => (
          <div key={m.id} style={p.mapCard}>
            <div style={p.mapPreview}>
              {m.imageUrl
                ? <img src={m.imageUrl} alt="" style={p.mapImg} />
                : <div style={p.mapEmpty}>
                    <span style={{ fontSize: 32 }}>🗺️</span>
                    <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>რუკა არ არის</p>
                  </div>
              }
              {uploading === m.id && (
                <div style={p.uploadOverlay}>
                  <span style={{ color: "white", fontSize: 13 }}>⏳ იტვირთება...</span>
                </div>
              )}
            </div>
            <div style={p.mapInfo}>
              <p style={p.mapTitle}>{m.city} — გზა №{m.route}</p>
              <p style={p.mapDate}>
                განახლდა: {m.updatedAt ? new Date(m.updatedAt).toLocaleDateString("ka-GE") : "—"}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <label style={{ ...p.uploadBtn, flex: 1 }}>
                {m.imageUrl ? "🔄" : "⬆️"}
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => handleUpload(m.id, e.target.files[0])} />
              </label>
              <button
                style={{ ...p.uploadBtn, flex: 1.5, background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "none", cursor: "pointer", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
                onClick={() => setSelectedMap({ map: m, panel: "questions" })}
              >📝 კითხვები</button>
              <button
                style={{ ...p.uploadBtn, flex: 1.5, background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "none", cursor: "pointer", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
                onClick={() => setSelectedMap({ map: m, panel: "signs" })}
              >🪧 ნიშნები</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Signs Library Manager
// ════════════════════════════════════════════
function SignsLibraryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [selectedCat, setSelectedCat] = useState(null); // null | category obj

  useEffect(() => {
    api.get("/api/sign-categories")
      .then(setCategories)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error)   return <ErrorMsg msg={error} />;

  if (selectedCat) {
    return (
      <SignsCategoryEditor
        category={selectedCat}
        onBack={() => {
          // refresh count after editing
          api.get("/api/sign-categories").then(setCategories).catch(() => {});
          setSelectedCat(null);
        }}
      />
    );
  }

  return (
    <div style={p.section}>
      <p style={p.sectionTitle}>🚦 საგზაო ნიშნების ბიბლიოთეკა</p>
      <p style={p.hint}>აირჩიე კატეგორია ნიშნების სამართავად</p>
      <div style={p.list}>
        {categories.map((cat) => (
          <button key={cat.id}
            style={{ ...p.listItem, cursor: "pointer", textAlign: "left", width: "100%", border: "1px solid rgba(255,255,255,0.07)" }}
            onClick={() => setSelectedCat(cat)}
          >
            <div style={{ ...p.listNum, width: 36, height: 36, fontSize: 14 }}>{cat.count}</div>
            <div style={p.listContent}>
              <p style={p.listTitle}>{cat.name}</p>
              <p style={p.listSub}>{cat.count} ნიშანი</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

function SignsCategoryEditor({ category, onBack }) {
  const [signs, setSigns]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(null);
  const [editing, setEditing]     = useState(null);
  const emptyForm = { categoryId: category.id, code: "", name: "", description: "", order: 0 };
  const [form, setForm]           = useState(emptyForm);
  const [pendingFile, setPendingFile] = useState(null);

  useEffect(() => {
    api.get(`/api/admin/road-signs?categoryId=${category.id}`)
      .then(setSigns)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category.id]);

  const openNew = () => {
    setForm({ ...emptyForm, order: signs.length + 1 });
    setPendingFile(null);
    setEditing("new");
  };
  const openEdit = (s) => {
    setForm({ categoryId: category.id, code: s.code, name: s.name, description: s.description, order: s.order });
    setPendingFile(null);
    setEditing(s.id);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let sign;
      if (editing === "new") {
        sign = await api.post("/api/admin/road-signs", form);
        setSigns((prev) => [...prev, sign]);
      } else {
        sign = await api.put(`/api/admin/road-signs/${editing}`, form);
        setSigns((prev) => prev.map((s) => (s.id === editing ? sign : s)));
      }
      if (pendingFile) {
        const fd = new FormData();
        fd.append("file", pendingFile);
        const updated = await api.postForm(`/api/admin/road-signs/${sign.id}/upload`, fd);
        setSigns((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
      setEditing(null);
    } catch (e) {
      alert("შენახვა ვერ მოხერხდა: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (signId, file) => {
    if (!file) return;
    setUploading(signId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const updated = await api.postForm(`/api/admin/road-signs/${signId}/upload`, fd);
      setSigns((prev) => prev.map((s) => (s.id === signId ? updated : s)));
    } catch (e) {
      alert("ატვირთვა ვერ მოხერხდა: " + e.message);
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("წაშლა?")) return;
    try {
      await api.delete(`/api/admin/road-signs/${id}`);
      setSigns((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert("წაშლა ვერ მოხერხდა: " + e.message);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <ErrorMsg msg={error} />;

  if (editing !== null) {
    return (
      <div style={p.section}>
        <div style={p.formHeader}>
          <button style={p.backBtn} onClick={() => setEditing(null)}>← უკან</button>
          <p style={p.sectionTitle}>{editing === "new" ? "ახალი ნიშანი" : "ნიშნის რედაქტირება"}</p>
        </div>
        <p style={{ color: "#6b7280", fontSize: 13, margin: "-12px 0 16px" }}>{category.name}</p>
        <div style={p.form}>

          <div style={p.fieldGroup}>
            <label style={p.formLabel}>ნიშნის ფოტო</label>
            <label style={sp.photoUploadBox}>
              {pendingFile ? (
                <img src={URL.createObjectURL(pendingFile)} alt="" style={sp.photoPreview} />
              ) : editing !== "new" && signs.find(s => s.id === editing)?.imageUrl ? (
                <>
                  <img src={signs.find(s => s.id === editing).imageUrl} alt="" style={sp.photoPreview} />
                  <span style={sp.changeHint}>შეცვლა</span>
                </>
              ) : (
                <div style={sp.photoPlaceholder}>
                  <span style={{ fontSize: 32 }}>📷</span>
                  <span style={sp.photoHint}>ფოტოს ატვირთვა</span>
                </div>
              )}
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => setPendingFile(e.target.files[0] || null)} />
            </label>
          </div>

          {[
            ["კოდი (მაგ. 4.1)",  "code",        "input"],
            ["სახელი",           "name",        "input"],
            ["აღწერა",           "description", "textarea"],
          ].map(([label, field, type]) => (
            <div key={field} style={p.fieldGroup}>
              <label style={p.formLabel}>{label}</label>
              {type === "textarea"
                ? <textarea style={p.textarea} rows={4} value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                : <input style={p.formInput} value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
              }
            </div>
          ))}

          <div style={p.fieldGroup}>
            <label style={p.formLabel}>თანმიმდევრობა</label>
            <input style={p.formInput} type="number" value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
          </div>

          <button style={{ ...p.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? "⏳ ინახება..." : "✅ შენახვა"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={p.section}>
      <div style={p.formHeader}>
        <button style={p.backBtn} onClick={onBack}>← კატეგორიები</button>
      </div>
      <div style={p.sectionHeader}>
        <div>
          <p style={p.sectionTitle}>🚦 {category.name}</p>
          <p style={{ color: "#6b7280", fontSize: 13, margin: "-12px 0 0" }}>{signs.length} ნიშანი</p>
        </div>
        <button style={p.addBtn} onClick={openNew}>➕ ახალი ნიშანი</button>
      </div>

      <div style={p.list}>
        {signs.map((s) => (
          <div key={s.id} style={{ ...p.listItem, alignItems: "flex-start", gap: 12 }}>
            <label style={sp.thumbLabel}>
              {s.imageUrl
                ? <img src={s.imageUrl} alt="" style={sp.thumbImg} />
                : <div style={sp.thumbEmpty}>{uploading === s.id ? "⏳" : "📷"}</div>
              }
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => handlePhotoUpload(s.id, e.target.files[0])} />
            </label>
            <div style={p.listContent}>
              <p style={{ ...p.listTitle, color: "#e74c3c", fontSize: 12 }}>{s.code}</p>
              <p style={p.listTitle}>{s.name || "—"}</p>
              {s.description && <p style={p.listSub} title={s.description}>{s.description.slice(0, 60)}{s.description.length > 60 ? "…" : ""}</p>}
            </div>
            <div style={p.listActions}>
              <button style={p.editBtn}   onClick={() => openEdit(s)}>✏️</button>
              <button style={p.deleteBtn} onClick={() => handleDelete(s.id)}>🗑️</button>
            </div>
          </div>
        ))}
        {signs.length === 0 && (
          <p style={{ color: "#6b7280", textAlign: "center", padding: 20 }}>ნიშნები არ არის</p>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Theory Manager
// ════════════════════════════════════════════
function TheoryManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [editing, setEditing]     = useState(null); // null | "new" | id (number)
  const emptyForm = { scenario: "", question: "", answerA: "", answerB: "", answerC: "", correctAnswer: "A", explanation: "" };
  const [form, setForm]           = useState(emptyForm);

  useEffect(() => {
    api.get("/api/admin/theory")
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditing("new");
  };

  const openEdit = (q) => {
    setForm({
      scenario:      q.scenario,
      question:      q.question,
      answerA:       q.answerA,
      answerB:       q.answerB,
      answerC:       q.answerC,
      correctAnswer: q.correctAnswer,
      explanation:   q.explanation,
    });
    setEditing(q.id);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing === "new") {
        const created = await api.post("/api/admin/theory", form);
        setQuestions((prev) => [...prev, created]);
      } else {
        const updated = await api.put(`/api/admin/theory/${editing}`, form);
        setQuestions((prev) => prev.map((q) => (q.id === editing ? updated : q)));
      }
      setEditing(null);
    } catch (e) {
      alert("შენახვა ვერ მოხერხდა: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("წაშლა?")) return;
    try {
      await api.delete(`/api/admin/theory/${id}`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (e) {
      alert("წაშლა ვერ მოხერხდა: " + e.message);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <ErrorMsg msg={error} />;

  if (editing !== null) {
    const opts = ["A", "B", "C"];
    return (
      <div style={p.section}>
        <div style={p.formHeader}>
          <button style={p.backBtn} onClick={() => setEditing(null)}>← უკან</button>
          <p style={p.sectionTitle}>{editing === "new" ? "ახალი კითხვა" : "კითხვის რედაქტირება"}</p>
        </div>
        <div style={p.form}>
          {[
            ["სცენარი",    "scenario",    "textarea"],
            ["კითხვა",     "question",    "textarea"],
            ["პასუხი A",   "answerA",     "input"],
            ["პასუხი B",   "answerB",     "input"],
            ["პასუხი C",   "answerC",     "input"],
            ["განმარტება", "explanation", "textarea"],
          ].map(([label, field, type]) => (
            <div key={field} style={p.fieldGroup}>
              <label style={p.formLabel}>{label}</label>
              {type === "textarea"
                ? <textarea style={p.textarea} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} rows={3} />
                : <input   style={p.formInput} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
              }
            </div>
          ))}
          <div style={p.fieldGroup}>
            <label style={p.formLabel}>სწორი პასუხი</label>
            <div style={{ display: "flex", gap: 10 }}>
              {opts.map((opt) => (
                <button key={opt}
                  style={{ ...p.optBtn, backgroundColor: form.correctAnswer === opt ? "#22c55e" : "#1e2e1e", color: form.correctAnswer === opt ? "white" : "#9ca3af" }}
                  onClick={() => setForm({ ...form, correctAnswer: opt })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <button style={{ ...p.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? "⏳ ინახება..." : "✅ შენახვა"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={p.section}>
      <div style={p.sectionHeader}>
        <p style={p.sectionTitle}>📚 თეორიის კითხვები</p>
        <button style={p.addBtn} onClick={openNew}>➕ ახალი კითხვა</button>
      </div>
      <div style={p.list}>
        {questions.map((q, i) => (
          <div key={q.id} style={p.listItem}>
            <div style={p.listNum}>{i + 1}</div>
            <div style={p.listContent}>
              <p style={p.listTitle}>{q.question}</p>
              <p style={p.listSub}>სწორი: {q.correctAnswer}</p>
            </div>
            <div style={p.listActions}>
              <button style={p.editBtn}   onClick={() => openEdit(q)}>✏️</button>
              <button style={p.deleteBtn} onClick={() => handleDelete(q.id)}>🗑️</button>
            </div>
          </div>
        ))}
        {questions.length === 0 && <p style={{ color: "#6b7280", textAlign: "center", padding: 20 }}>კითხვები არ არის</p>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Users (+ Premium filter)
// ════════════════════════════════════════════
function UsersPanel({ premiumOnly = false }) {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    api.get("/api/admin/users")
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      (!premiumOnly || u.isPremium) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const togglePremium = async (id) => {
    setToggling(id);
    try {
      const updated = await api.put(`/api/admin/users/${id}/premium`);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (e) {
      alert("შეცდომა: " + e.message);
    } finally {
      setToggling(null);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <ErrorMsg msg={error} />;

  return (
    <div style={p.section}>
      <div style={p.sectionHeader}>
        <p style={p.sectionTitle}>{premiumOnly ? "👑 პრემიუმ მომხმარებლები" : "👥 ყველა მომხმარებელი"}</p>
        <span style={p.countBadge}>{filtered.length}</span>
      </div>

      <input style={p.searchInput} placeholder="🔍 ძებნა სახელით ან Email-ით..."
        value={search} onChange={(e) => setSearch(e.target.value)} />

      <div style={p.table}>
        <div style={p.tableHeader}>
          <span style={{ flex: 2 }}>სახელი</span>
          <span style={{ flex: 2 }}>Email</span>
          <span style={{ flex: 1 }}>ტელეფონი</span>
          <span style={{ flex: 1 }}>სტატუსი</span>
          <span style={{ flex: 1 }}>მოქმედება</span>
        </div>
        {filtered.map((u) => (
          <div key={u.id} style={p.tableRow}>
            <span style={{ flex: 2, color: "white",   fontSize: 13 }}>{u.name}</span>
            <span style={{ flex: 2, color: "#9ca3af", fontSize: 12 }}>{u.email}</span>
            <span style={{ flex: 1, color: "#9ca3af", fontSize: 12 }}>{u.phone}</span>
            <span style={{ flex: 1 }}>
              <span style={{ ...p.badge, backgroundColor: u.isPremium ? "rgba(245,158,11,0.2)" : "rgba(107,114,128,0.2)", color: u.isPremium ? "#f59e0b" : "#9ca3af" }}>
                {u.isPremium ? "👑" : "Free"}
              </span>
            </span>
            <span style={{ flex: 1 }}>
              <button
                style={{ ...p.toggleBtn, backgroundColor: u.isPremium ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: u.isPremium ? "#ef4444" : "#22c55e", opacity: toggling === u.id ? 0.5 : 1 }}
                onClick={() => togglePremium(u.id)}
                disabled={toggling === u.id}
              >
                {toggling === u.id ? "⏳" : u.isPremium ? "გაუქმება" : "Premium+"}
              </button>
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: "#6b7280", textAlign: "center", padding: 20 }}>მომხმარებელი ვერ მოიძებნა</p>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Settings
// ════════════════════════════════════════════
function Settings() {
  const [form, setForm]   = useState({ price1Month: "9.99", price3Month: "7.99", price6Month: "5.99", adminPassword: "admin2024!" });
  const [newPass, setNewPass]     = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [passError, setPassError] = useState("");
  const [passSaved, setPassSaved] = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    api.get("/api/admin/settings")
      .then((s) => setForm({
        price1Month:   String(s.price1Month),
        price3Month:   String(s.price3Month),
        price6Month:   String(s.price6Month),
        adminPassword: s.adminPassword,
      }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSavePrices = async () => {
    setSaving(true);
    try {
      await api.put("/api/admin/settings", {
        price1Month:   parseFloat(form.price1Month),
        price3Month:   parseFloat(form.price3Month),
        price6Month:   parseFloat(form.price6Month),
        adminPassword: form.adminPassword,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert("შენახვა ვერ მოხერხდა: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPassError("");
    if (!newPass) return setPassError("პაროლი ცარიელია");
    if (newPass !== confirmPass) return setPassError("პაროლები არ ემთხვევა");
    setSaving(true);
    try {
      await api.put("/api/admin/settings", {
        price1Month:   parseFloat(form.price1Month),
        price3Month:   parseFloat(form.price3Month),
        price6Month:   parseFloat(form.price6Month),
        adminPassword: newPass,
      });
      setForm((f) => ({ ...f, adminPassword: newPass }));
      setNewPass("");
      setConfirmPass("");
      setPassSaved(true);
      setTimeout(() => setPassSaved(false), 2000);
    } catch (e) {
      setPassError("შეცდომა: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <ErrorMsg msg={error} />;

  return (
    <div style={p.section}>
      <p style={p.sectionTitle}>⚙️ პარამეტრები</p>

      <div style={p.settingsCard}>
        <p style={p.settingsGroup}>💰 პრემიუმ ფასები (₾)</p>
        {[
          ["1 თვე",  "price1Month"],
          ["3 თვე",  "price3Month"],
          ["6 თვე",  "price6Month"],
        ].map(([label, field]) => (
          <div key={field} style={p.fieldGroup}>
            <label style={p.formLabel}>{label}</label>
            <input style={p.formInput} type="number" value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          </div>
        ))}
        <button style={{ ...p.saveBtn, backgroundColor: saved ? "#22c55e" : "#6366f1", opacity: saving ? 0.7 : 1 }}
          onClick={handleSavePrices} disabled={saving}>
          {saved ? "✅ შენახულია!" : saving ? "⏳..." : "შენახვა"}
        </button>
      </div>

      <div style={p.settingsCard}>
        <p style={p.settingsGroup}>🔐 ადმინ პაროლის შეცვლა</p>
        {passError && <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{passError}</p>}
        {passSaved && <p style={{ color: "#22c55e", fontSize: 13, margin: 0 }}>✅ პაროლი შეიცვალა!</p>}
        <div style={p.fieldGroup}>
          <label style={p.formLabel}>ახალი პაროლი</label>
          <input style={p.formInput} type="password" placeholder="••••••••"
            value={newPass} onChange={(e) => setNewPass(e.target.value)} />
        </div>
        <div style={p.fieldGroup}>
          <label style={p.formLabel}>გაიმეორე</label>
          <input style={p.formInput} type="password" placeholder="••••••••"
            value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
        </div>
        <button style={{ ...p.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleChangePassword} disabled={saving}>
          {saving ? "⏳..." : "პაროლის შეცვლა"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Main Admin Panel
// ════════════════════════════════════════════
export default function AdminPage() {
  const navigate  = useNavigate();
  const [auth, setAuth]             = useState(false);
  const [activeTab, setActiveTab]   = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!auth) return <AdminLogin onSuccess={() => setAuth(true)} />;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "cities":    return <CitiesManager />;
      case "maps":      return <MapsManager />;
      case "roadsigns": return <SignsLibraryManager />;
      case "theory":    return <TheoryManager />;
      case "users":     return <UsersPanel />;
      case "premium":   return <UsersPanel premiumOnly />;
      case "settings":  return <Settings />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div style={a.screen}>
      {/* Sidebar */}
      <div style={{ ...a.sidebar, width: sidebarOpen ? 220 : 64 }}>
        <div style={a.sidebarTop}>
          <span style={a.sidebarLogo}>{sidebarOpen ? "🛡️ Admin" : "🛡️"}</span>
          <button style={a.collapseBtn} onClick={() => setSidebarOpen((o) => !o)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav style={a.nav}>
          {TABS.map((tab) => (
            <button key={tab.id}
              style={{
                ...a.navItem,
                backgroundColor: activeTab === tab.id ? "rgba(99,102,241,0.2)" : "transparent",
                borderLeft: activeTab === tab.id ? "3px solid #6366f1" : "3px solid transparent",
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={a.navIcon}>{tab.icon}</span>
              {sidebarOpen && <span style={a.navLabel}>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <button style={a.logoutBtn} onClick={() => navigate("/")}>
          <span>🚪</span>
          {sidebarOpen && <span>გამოსვლა</span>}
        </button>
      </div>

      {/* Main content */}
      <div style={a.main}>{renderContent()}</div>
    </div>
  );
}

// ════════════════════════════════════════════
// Styles
// ════════════════════════════════════════════
const a = {
  screen:      { display: "flex", flexDirection: "row", minHeight: "100vh", backgroundColor: "#0a0a0f", fontFamily: "sans-serif", color: "white" },
  sidebar:     { backgroundColor: "#111118", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", transition: "width 0.2s", overflow: "hidden", flexShrink: 0 },
  sidebarTop:  { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  sidebarLogo: { color: "white", fontWeight: 800, fontSize: 16, whiteSpace: "nowrap" },
  collapseBtn: { background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 14 },
  nav:         { flex: 1, display: "flex", flexDirection: "column", padding: "12px 0", gap: 2 },
  navItem:     { display: "flex", flexDirection: "row", alignItems: "center", gap: 12, padding: "11px 16px", border: "none", cursor: "pointer", transition: "all 0.15s", textAlign: "left" },
  navIcon:     { fontSize: 18, flexShrink: 0 },
  navLabel:    { color: "#d1d5db", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" },
  logoutBtn:   { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "none", border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", color: "#ef4444", cursor: "pointer", fontSize: 14 },
  main:        { flex: 1, overflowY: "auto", padding: 0 },
};

const p = {
  section:       { padding: "28px 32px", maxWidth: 900 },
  sectionTitle:  { color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 20px" },
  sectionHeader: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  subTitle:      { color: "white", fontSize: 16, fontWeight: 700, margin: "24px 0 12px" },
  hint:          { color: "#6b7280", fontSize: 13, margin: "-12px 0 20px" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 },
  statCard:  { backgroundColor: "#111118", border: "1px solid", borderRadius: 16, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  statIcon:  { fontSize: 28 },
  statValue: { fontSize: 32, fontWeight: 900, margin: 0 },
  statLabel: { color: "#9ca3af", fontSize: 12, margin: 0, textAlign: "center" },

  table:       { backgroundColor: "#111118", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" },
  tableHeader: { display: "flex", flexDirection: "row", padding: "12px 16px", backgroundColor: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)", color: "#9ca3af", fontSize: 12, fontWeight: 700 },
  tableRow:    { display: "flex", flexDirection: "row", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" },
  badge:       { display: "inline-block", padding: "3px 8px", borderRadius: 8, fontSize: 11, fontWeight: 700 },
  countBadge:  { backgroundColor: "rgba(99,102,241,0.2)", color: "#818cf8", padding: "4px 12px", borderRadius: 20, fontSize: 14, fontWeight: 700 },

  searchInput: { width: "100%", backgroundColor: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 16px", fontSize: 14, color: "white", outline: "none", marginBottom: 16, boxSizing: "border-box" },
  toggleBtn:   { border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" },

  mapGrid:      { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 },
  mapCard:      { backgroundColor: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" },
  mapPreview:   { height: 140, backgroundColor: "#1a1a2e", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  mapImg:       { width: "100%", height: "100%", objectFit: "cover" },
  mapEmpty:     { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  uploadOverlay:{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" },
  mapInfo:      { padding: "10px 12px" },
  mapTitle:     { color: "white", fontSize: 13, fontWeight: 700, margin: 0 },
  mapDate:      { color: "#6b7280", fontSize: 11, margin: "3px 0 0" },
  uploadBtn:    { display: "block", textAlign: "center", backgroundColor: "rgba(99,102,241,0.15)", color: "#818cf8", border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer" },

  addBtn: { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" },

  list:        { display: "flex", flexDirection: "column", gap: 10 },
  listItem:    { backgroundColor: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", display: "flex", flexDirection: "row", alignItems: "center", gap: 14 },
  listNum:     { backgroundColor: "rgba(99,102,241,0.2)", color: "#818cf8", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 },
  listContent: { flex: 1 },
  listTitle:   { color: "white", fontSize: 14, fontWeight: 600, margin: 0 },
  listSub:     { color: "#6b7280", fontSize: 12, margin: "3px 0 0" },
  listActions: { display: "flex", gap: 8 },
  editBtn:     { background: "rgba(59,130,246,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 },
  deleteBtn:   { background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 },

  form:       { display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 },
  formHeader: { display: "flex", alignItems: "center", gap: 16, marginBottom: 8 },
  backBtn:    { background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 14 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  formLabel:  { color: "#9ca3af", fontSize: 13, fontWeight: 600 },
  formInput:  { backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "white", outline: "none" },
  textarea:   { backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "white", outline: "none", resize: "vertical", fontFamily: "sans-serif" },
  optBtn:     { border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  saveBtn:    { backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer" },

  settingsCard:  { backgroundColor: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 14 },
  settingsGroup: { color: "white", fontSize: 15, fontWeight: 700, margin: 0 },
};

// Sign panel specific styles
const sp = {
  photoUploadBox: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", height: 180,
    backgroundColor: "#1a1a2e", border: "2px dashed rgba(99,102,241,0.4)",
    borderRadius: 14, cursor: "pointer", position: "relative", overflow: "hidden",
  },
  photoPreview: { width: "100%", height: "100%", objectFit: "contain" },
  changeHint: {
    position: "absolute", bottom: 8, right: 10,
    color: "#818cf8", fontSize: 12, fontWeight: 600,
  },
  photoPlaceholder: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  photoHint: { color: "#6b7280", fontSize: 13 },
  thumbLabel: {
    flexShrink: 0, width: 56, height: 56,
    backgroundColor: "#1a1a2e", borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)",
  },
  thumbImg:   { width: "100%", height: "100%", objectFit: "contain" },
  thumbEmpty: { color: "#6b7280", fontSize: 22, lineHeight: 1 },
};