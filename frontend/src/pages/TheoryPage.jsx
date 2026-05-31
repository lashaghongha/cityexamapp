import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

const correctMap = { A: 0, B: 1, C: 2 };

function transform(q) {
  return {
    id: q.id,
    scenario: q.scenario,
    question: q.question,
    answers: [`A) ${q.answerA}`, `B) ${q.answerB}`, `C) ${q.answerC}`],
    correct: correctMap[q.correctAnswer] ?? 0,
    explanation: q.explanation,
  };
}


// ---- Main Theory Page ----
export default function TheoryPage() {
  const [questions,    setQuestions]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [answered,     setAnswered]     = useState(false);
  const [showExpl,     setShowExpl]     = useState(false);

  useEffect(() => {
    fetch("/api/admin/theory")
      .then(r => r.json())
      .then(data => setQuestions(data.map(transform)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ ...styles.screen, alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#ffa500", fontSize: 16 }}>იტვირთება...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ ...styles.screen, alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9ca3af", fontSize: 15, textAlign: "center", padding: 24 }}>
          კითხვები ჯერ არ არის დამატებული.{"\n"}ადმინის პანელიდან დაამატე.
        </p>
        <BottomNav />
      </div>
    );
  }

  const q = questions[currentIndex];
  const total = questions.length;

  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setCurrentIndex(idx);
    setSelected(null);
    setAnswered(false);
    setShowExpl(false);
  };

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setShowExpl(true);
  };

  const isCorrect = (idx) => idx === q.correct;

  return (
    <div style={styles.screen}>
      <div style={styles.container}>

        {/* ── Top nav bar ── */}
        <div style={styles.topBar}>
          {/* prev */}
          <button style={styles.navArrow} onClick={() => goTo(currentIndex - 1)} disabled={currentIndex===0}>
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill={currentIndex===0 ? "rgba(255,165,0,0.3)" : "#ffa500"}>
              <path d="M18 6l-12 6 12 6V6z"/>
            </svg>
          </button>

          {/* title */}
          <p style={styles.topTitle}>კითხვა {currentIndex + 1}</p>

          {/* next */}
          <button style={styles.navArrow} onClick={() => goTo(currentIndex + 1)} disabled={currentIndex===total-1}>
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill={currentIndex===total-1 ? "rgba(255,165,0,0.3)" : "#ffa500"}>
              <path d="M6 18l12-6L6 6v12z"/>
            </svg>
          </button>
        </div>

        {/* ── Question card ── */}
        <div style={styles.card}>

          {/* Scenario */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTag}>სცენარი:</span>
              <button style={styles.hintBtn} title="მინიშნება">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffa500">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
              </button>
            </div>
            <p style={styles.scenarioText}>{q.scenario}</p>
          </div>

          <div style={styles.divider}/>

          {/* Question */}
          <div style={styles.section}>
            <span style={styles.sectionTag}>კითხვა:</span>
            <p style={styles.questionText}>{q.question}</p>
          </div>

          {/* Answers */}
          <div style={styles.answersList}>
            {q.answers.map((ans, idx) => {
              let bg     = "#1e2e1e";
              let border = "rgba(255,255,255,0.08)";
              let color  = "white";
              if (answered) {
                if (isCorrect(idx)) {
                  bg = "#14532d"; border = "#22c55e"; color = "#bbf7d0";
                } else if (selected === idx) {
                  bg = "#450a0a"; border = "#ef4444"; color = "#fca5a5";
                }
              }
              return (
                <button key={idx}
                  style={{ ...styles.answerBtn, backgroundColor:bg, borderColor:border, color }}
                  onClick={() => handleAnswer(idx)}
                >
                  {ans}
                </button>
              );
            })}
          </div>

          {/* Correct answer badge */}
          {answered && (
            <div style={{
              ...styles.correctBadge,
              backgroundColor: isCorrect(selected) ? "#14532d" : "#450a0a",
              borderColor:     isCorrect(selected) ? "#22c55e" : "#ef4444",
            }}>
              <span style={{ fontSize:16, marginRight:6 }}>
                {isCorrect(selected) ? "✅" : "❌"}
              </span>
              <span style={styles.correctBadgeText}>
                სწორი პასუხი: {q.answers[q.correct]}
              </span>
            </div>
          )}
        </div>

        {/* ── Explanation card ── */}
        {showExpl && (
          <div style={styles.explCard}>
            <p style={styles.explTitle}>განმარტება:</p>
            <p style={styles.explText}>{q.explanation}</p>
          </div>
        )}

        {/* ── Pagination dots ── */}
        <div style={styles.dots}>
          {questions.map((_, i) => (
            <button key={i} style={{
              ...styles.dot,
              backgroundColor: i===currentIndex ? "#ffa500"
                : i < currentIndex ? "#22c55e" : "rgba(255,255,255,0.2)",
              width:  i===currentIndex ? 20 : 8,
            }} onClick={() => goTo(i)}/>
          ))}
        </div>

        {/* ── Next button ── */}
        {answered && currentIndex < total - 1 && (
          <button style={styles.nextBtn} onClick={() => goTo(currentIndex + 1)}>
            შემდეგი კითხვა →
          </button>
        )}
        {answered && currentIndex === total - 1 && (
          <button style={{ ...styles.nextBtn, backgroundColor:"#22c55e" }}
            onClick={() => goTo(0)}>
            თავიდან დაწყება 🔄
          </button>
        )}

      </div>

      <BottomNav active="home" />
    </div>
  );
}

// ---- Styles ----
const styles = {
  screen: {
    display:"flex", flexDirection:"column", minHeight:"100vh",
    backgroundColor:"#0d0d1a",
    fontFamily:"'BPG Arial','Sylfaen',sans-serif",
    userSelect:"none",
  },
  container: {
    flex:1,
    display:"flex", flexDirection:"column",
    alignItems:"center",
    padding:"16px 14px 20px",
    gap:14,
    maxWidth:440, width:"100%", margin:"0 auto",
  },

  /* top bar */
  topBar: {
    display:"flex", flexDirection:"row",
    alignItems:"center", justifyContent:"space-between",
    width:"100%",
  },
  navArrow: {
    background:"none", border:"none", cursor:"pointer",
    padding:6, borderRadius:8,
  },
  topTitle: {
    color:"#ffa500", fontSize:18, fontWeight:800, margin:0,
  },

  /* main card */
  card: {
    backgroundColor:"#111827",
    borderRadius:18, padding:"18px 16px",
    width:"100%",
    border:"1px solid rgba(255,255,255,0.07)",
    boxShadow:"0 6px 24px rgba(0,0,0,0.5)",
    display:"flex", flexDirection:"column", gap:12,
  },

  section: { display:"flex", flexDirection:"column", gap:6 },
  sectionHeader: { display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between" },
  sectionTag: { color:"#ffa500", fontSize:12, fontWeight:700, letterSpacing:"0.5px" },
  hintBtn: { background:"none", border:"none", cursor:"pointer", padding:2 },

  scenarioText: { color:"#d1d5db", fontSize:13, lineHeight:1.7, margin:0 },
  questionText: { color:"white",   fontSize:14, lineHeight:1.6, margin:0, fontWeight:600 },

  divider: { height:1, backgroundColor:"rgba(255,255,255,0.07)", margin:"2px 0" },

  /* answers */
  answersList: { display:"flex", flexDirection:"column", gap:8 },
  answerBtn: {
    border:"1.5px solid",
    borderRadius:12, padding:"13px 16px",
    fontSize:14, fontWeight:500,
    cursor:"pointer", textAlign:"left",
    transition:"all 0.15s",
    fontFamily:"inherit",
  },

  /* correct badge */
  correctBadge: {
    display:"flex", flexDirection:"row", alignItems:"center",
    border:"1.5px solid",
    borderRadius:12, padding:"11px 14px",
    marginTop:2,
  },
  correctBadgeText: { color:"white", fontSize:13, fontWeight:600 },

  /* explanation */
  explCard: {
    backgroundColor:"#1a1a2e",
    borderRadius:16, padding:"16px",
    width:"100%",
    border:"1px solid rgba(255,165,0,0.2)",
  },
  explTitle: { color:"#ffa500", fontSize:13, fontWeight:700, margin:"0 0 8px" },
  explText:  { color:"#d1d5db", fontSize:12, lineHeight:1.75, margin:0 },

  /* dots */
  dots: {
    display:"flex", flexDirection:"row",
    alignItems:"center", gap:6, flexWrap:"wrap",
    justifyContent:"center",
  },
  dot: {
    height:8, borderRadius:4,
    border:"none", cursor:"pointer",
    transition:"all 0.2s ease",
    padding:0,
  },

  /* next */
  nextBtn: {
    backgroundColor:"#ffa500",
    color:"#0d0d1a",
    border:"none", borderRadius:14,
    padding:"14px 28px",
    fontSize:15, fontWeight:800,
    cursor:"pointer", width:"100%",
    boxShadow:"0 4px 14px rgba(255,165,0,0.35)",
  },

  /* bottom nav */
  bottomNav: {
    display:"flex", justifyContent:"space-around", alignItems:"center",
    backgroundColor:"#0a0a14",
    borderTop:"1px solid rgba(255,255,255,0.08)",
    padding:"12px 0 16px",
  },
  navBtn: {
    background:"none", border:"none", cursor:"pointer",
    padding:"8px 24px",
    display:"flex", flexDirection:"column", alignItems:"center", gap:4,
  },
  navDot: { width:6, height:6, borderRadius:"50%", backgroundColor:"#3b82f6" },
};
