import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Auto-positions used when admin hasn't set a custom position yet
const AUTO_POS = [
  [20,25],[50,20],[78,28],[85,55],[70,72],[45,78],[20,68],[10,45],
  [35,35],[62,40],[55,60],[30,55],[15,80],[65,85],[85,80],[40,90],
];

function toSituation(q, i) {
  const correctIdx = { A: 0, B: 1, C: 2 }[q.correctAnswer] ?? 0;
  const unset = (q.markerX ?? 0) === 0 && (q.markerY ?? 0) === 0;
  const [ax, ay] = AUTO_POS[i % AUTO_POS.length];
  return {
    id:               i + 1,
    scenario:         q.scenario,
    title:            q.question,
    answers:          [q.answerA, q.answerB, q.answerC],
    correctAnswer:    correctIdx + 1,
    explanation:      q.explanation,
    locationPhotoUrl: q.locationPhotoUrl || null,
    markerX:          unset ? ax : q.markerX,
    markerY:          unset ? ay : q.markerY,
  };
}

// ── Situation overlay (mobile-first) ──────────────────────────
function SituationScreen({ situation, index, total, onClose, onPrev, onNext }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
  }, [index]);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
  };

  const isCorrect = (idx) => idx + 1 === situation.correctAnswer;

  return (
    <div style={qs.overlay}>
      <div style={qs.sheet}>

        {/* Header */}
        <div style={qs.header}>
          <button style={qs.backBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div style={qs.markerBadge}>{situation.id}</div>
          <span style={qs.pageLabel}>{index + 1} / {total}</span>
        </div>

        {/* Location photo */}
        <div style={qs.photoBox}>
          {situation.locationPhotoUrl
            ? <img src={situation.locationPhotoUrl} alt="" style={qs.locationPhoto} />
            : <div style={qs.photoPlaceholder}>
                <span style={{ fontSize: 36 }}>📍</span>
                <span style={{ color: "#6b7280", fontSize: 13 }}>ფოტო არ არის</span>
              </div>
          }
        </div>

        {/* Scrollable content */}
        <div style={qs.content}>

          {/* Scenario */}
          {situation.scenario ? (
            <div style={qs.scenarioCard}>
              <p style={qs.scenarioText}>{situation.scenario}</p>
            </div>
          ) : null}

          {/* Question */}
          <p style={qs.question}>{situation.title}</p>

          {/* Answers */}
          <div style={qs.answersList}>
            {situation.answers.map((ans, idx) => {
              let bg     = "#1a1f2e";
              let border = "rgba(255,255,255,0.12)";
              let numBg  = "#374151";
              if (answered) {
                if (isCorrect(idx))        { bg = "rgba(34,197,94,0.18)";  border = "#22c55e"; numBg = "#22c55e"; }
                else if (selected === idx) { bg = "rgba(239,68,68,0.18)";  border = "#ef4444"; numBg = "#ef4444"; }
              }
              return (
                <button key={idx}
                  style={{ ...qs.answerBtn, backgroundColor: bg, borderColor: border }}
                  onClick={() => handleSelect(idx)}
                >
                  <span style={{ ...qs.answerNum, backgroundColor: numBg }}>
                    {["A","B","C"][idx]}
                  </span>
                  <span style={qs.answerText}>{ans}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && situation.explanation && (
            <div style={qs.explanationBox}>
              <p style={qs.explanationText}>💡 {situation.explanation}</p>
            </div>
          )}

          {/* Prev / Next */}
          <div style={qs.navRow}>
            <button
              style={{ ...qs.navBtn, opacity: index === 0 ? 0.35 : 1 }}
              onClick={onPrev} disabled={index === 0}
            >← წინა</button>
            <button
              style={{ ...qs.navBtn, opacity: index === total - 1 ? 0.35 : 1 }}
              onClick={onNext} disabled={index === total - 1}
            >შემდეგი →</button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── SVG fallback map ───────────────────────────────────────────
function MapBackground() {
  return (
    <svg viewBox="0 0 400 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width="400" height="300" fill="#c8dfc8"/>
      <path d="M0,150 Q60,120 120,150 Q180,180 240,150 Q300,120 400,150"
        stroke="#6ab0d4" strokeWidth="30" fill="none" opacity="0.65"/>
      <rect x="60"  y="110" width="280" height="16" fill="#e8e0c8"/>
      <rect x="60"  y="174" width="280" height="16" fill="#e8e0c8"/>
      <rect x="120" y="40"  width="14"  height="220" fill="#e8e0c8"/>
      <rect x="200" y="40"  width="14"  height="220" fill="#e8e0c8"/>
      <rect x="280" y="40"  width="14"  height="220" fill="#e8e0c8"/>
    </svg>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function FullscreenMapPage() {
  const { cityId, routeId } = useParams();
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState(Number(routeId) || 1);
  const [mapImageUrl, setMapImageUrl] = useState(null);
  const [questions, setQuestions]     = useState([]);
  const [openIndex, setOpenIndex]     = useState(null);

  useEffect(() => {
    setMapImageUrl(null);
    setQuestions([]);
    setOpenIndex(null);

    fetch(`/api/maps/${cityId}/${activeRoute}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setMapImageUrl(data?.imageUrl || null))
      .catch(() => {});

    fetch(`/api/route-questions/${cityId}/${activeRoute}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setQuestions(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [cityId, activeRoute]);

  const situations = questions.map(toSituation);

  return (
    <div style={ms.screen}>
      {/* Situation overlay */}
      {openIndex !== null && (
        <SituationScreen
          situation={situations[openIndex]}
          index={openIndex}
          total={situations.length}
          onClose={() => setOpenIndex(null)}
          onPrev={() => openIndex > 0 && setOpenIndex(openIndex - 1)}
          onNext={() => openIndex < situations.length - 1 && setOpenIndex(openIndex + 1)}
        />
      )}

      {/* Top bar */}
      <div style={ms.topBar}>
        <button style={ms.iconBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <div style={ms.routeTabs}>
          {[1, 2, 3, 4].map(r => (
            <button key={r}
              style={{ ...ms.routeTab, ...(activeRoute === r ? ms.routeTabActive : {}) }}
              onClick={() => setActiveRoute(r)}
            >№{r}</button>
          ))}
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Map */}
      <div style={ms.mapContainer}>
        {mapImageUrl
          ? <img src={mapImageUrl} alt="" style={ms.mapImg} />
          : <MapBackground />
        }

        {/* Numbered markers */}
        {situations.map((sit, i) => (
          <button key={sit.id}
            style={{ ...ms.marker, left: `${sit.markerX}%`, top: `${sit.markerY}%` }}
            onClick={() => setOpenIndex(i)}
          >
            <span style={ms.markerText}>{sit.id}</span>
          </button>
        ))}

        {situations.length === 0 && (
          <div style={ms.emptyBadge}>კითხვები ჯერ არ არის დამატებული</div>
        )}
      </div>

      {/* Bottom hint */}
      {situations.length > 0 && openIndex === null && (
        <div style={ms.hintBar}>
          <span style={ms.hintText}>დააჭირე ნომერს რუკაზე</span>
        </div>
      )}
    </div>
  );
}

// ── Situation sheet styles ─────────────────────────────────────
const qs = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 200,
    backgroundColor: "#0d1520",
    display: "flex", flexDirection: "column",
    fontFamily: "'BPG Arial','Sylfaen',sans-serif",
  },
  sheet: {
    flex: 1, display: "flex", flexDirection: "column",
    maxWidth: 480, width: "100%", margin: "0 auto",
    overflow: "hidden",
  },
  header: {
    display: "flex", flexDirection: "row", alignItems: "center",
    gap: 12, padding: "14px 16px 10px",
    flexShrink: 0,
  },
  backBtn: {
    background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10,
    width: 36, height: 36, display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer", flexShrink: 0,
  },
  markerBadge: {
    backgroundColor: "#22c55e", color: "white",
    fontWeight: 800, fontSize: 16,
    width: 36, height: 36, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  pageLabel: {
    color: "#6b7280", fontSize: 14, fontWeight: 600, flex: 1, textAlign: "right",
  },
  photoBox: {
    width: "100%", height: 220,
    backgroundColor: "#111827",
    flexShrink: 0, overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  locationPhoto: {
    width: "100%", height: "100%", objectFit: "cover", display: "block",
  },
  photoPlaceholder: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  content: {
    flex: 1, overflowY: "auto",
    padding: "16px 16px 24px",
    display: "flex", flexDirection: "column", gap: 14,
  },
  scenarioCard: {
    backgroundColor: "#0f2d1a",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: 14, padding: "12px 14px",
  },
  scenarioText: {
    color: "#86efac", fontSize: 13, lineHeight: 1.7, margin: 0,
    fontFamily: "'BPG Arial','Sylfaen',sans-serif",
  },
  question: {
    color: "white", fontSize: 15, fontWeight: 700,
    margin: 0, lineHeight: 1.5,
  },
  answersList: { display: "flex", flexDirection: "column", gap: 10 },
  answerBtn: {
    display: "flex", flexDirection: "row", alignItems: "center",
    gap: 12, border: "1.5px solid", borderRadius: 14,
    padding: "12px 14px", cursor: "pointer", textAlign: "left",
    transition: "all 0.15s", width: "100%",
  },
  answerNum: {
    flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
    color: "white", fontSize: 13, fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  answerText: { color: "#e5e7eb", fontSize: 13, lineHeight: 1.5 },
  explanationBox: {
    backgroundColor: "rgba(34,197,94,0.08)",
    border: "1px solid rgba(34,197,94,0.25)",
    borderRadius: 12, padding: "12px 14px",
  },
  explanationText: { color: "#86efac", fontSize: 13, lineHeight: 1.6, margin: 0 },
  navRow: {
    display: "flex", flexDirection: "row", gap: 12,
    marginTop: 4,
  },
  navBtn: {
    flex: 1, backgroundColor: "#1a1f2e",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12, padding: "12px 0",
    color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
};

// ── Map screen styles ─────────────────────────────────────────
const ms = {
  screen: {
    display: "flex", flexDirection: "column", height: "100vh",
    backgroundColor: "#0d1f0d", overflow: "hidden",
    fontFamily: "'BPG Arial','Sylfaen',sans-serif",
  },
  topBar: {
    display: "flex", flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", padding: "12px 14px 8px",
    position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
  },
  iconBtn: {
    background: "rgba(0,0,0,0.55)", border: "none", borderRadius: 10,
    width: 36, height: 36, display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer",
  },
  routeTabs: {
    display: "flex", gap: 4,
    background: "rgba(0,0,0,0.5)", borderRadius: 20, padding: 4,
  },
  routeTab: {
    background: "none", border: "none", color: "rgba(255,255,255,0.45)",
    fontSize: 13, fontWeight: 600, padding: "5px 12px",
    borderRadius: 16, cursor: "pointer",
  },
  routeTabActive: { backgroundColor: "#22c55e", color: "white" },
  mapContainer: { flex: 1, position: "relative", overflow: "hidden" },
  mapImg: {
    position: "absolute", inset: 0,
    width: "100%", height: "100%", objectFit: "cover",
  },
  marker: {
    position: "absolute", transform: "translate(-50%, -50%)",
    width: 32, height: 32, borderRadius: "50%",
    backgroundColor: "#e74c3c",
    border: "3px solid white",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", zIndex: 15, padding: 0,
    boxShadow: "0 3px 10px rgba(0,0,0,0.6)",
  },
  markerText: { color: "white", fontSize: 13, fontWeight: 900, lineHeight: 1 },
  emptyBadge: {
    position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
    backgroundColor: "rgba(0,0,0,0.65)", color: "#9ca3af",
    fontSize: 13, padding: "10px 20px", borderRadius: 22, zIndex: 10,
    whiteSpace: "nowrap",
  },
  hintBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.55)", padding: "12px 16px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  hintText: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
};
