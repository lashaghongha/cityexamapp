import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function buildPlans(s) {
  return [
    { id: "monthly1", label: "1 თვე", price: s.price1Month, period: "თვეში", popular: false },
    { id: "monthly3", label: "3 თვე", price: s.price3Month, period: "თვეში", popular: true,  badge: "პოპულარული" },
    { id: "monthly6", label: "6 თვე", price: s.price6Month, period: "თვეში", popular: false, badge: "დაზოგე 40%" },
  ];
}

const DEFAULT_PLANS = buildPlans({ price1Month: 9.99, price3Month: 7.99, price6Month: 5.99 });

const FEATURES = [
  "✅ ყველა ქალაქის სრული გზები",
  "✅ ყველა სიტუაციური კითხვა",
  "✅ გავლილი მარშრუტების ისტორია",
  "✅ საგზაო ნიშნების სრული ბაზა",
  "✅ თეორიის სრული კურსი",
  "✅ განახლებები უფასოდ",
];

export default function PremiumPage() {
  const navigate = useNavigate();
  const [plans, setPlans]               = useState(DEFAULT_PLANS);
  const [selectedPlan, setSelectedPlan] = useState("monthly3");
  const [payMethod, setPayMethod]       = useState(null); // "tbc" | "bog"
  const [loading, setLoading]           = useState(false);
  const [step, setStep]                 = useState(1); // 1=plan, 2=payment

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setPlans(buildPlans(data)); })
      .catch(() => {});
  }, []);

  const plan = plans.find(p => p.id === selectedPlan);

  const handleContinue = () => {
    if (step === 1) { setStep(2); return; }
    if (!payMethod) return;
    setLoading(true);
    // TODO: backend-ზე გაგზავნა
    // POST /api/payments/initiate { planId: selectedPlan, provider: payMethod }
    // response-ში მოვა redirect URL → ბანკის გვერდზე გადამისამართება
    setTimeout(() => {
      setLoading(false);
      alert(`${payMethod === "tbc" ? "TBC" : "BOG"} გადახდის გვერდზე გადადიხარ...`);
      // window.location.href = data.paymentUrl;
    }, 1500);
  };

  return (
    <div style={s.screen}>
      <div style={s.container}>

        {/* Back */}
        <button style={s.backBtn} onClick={() => step === 2 ? setStep(1) : navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        {/* Header */}
        <div style={s.header}>
          <div style={s.crownBox}>👑</div>
          <p style={s.headerTitle}>Premium-ი</p>
          <p style={s.headerSub}>სრული წვდომა ყველა ფუნქციაზე</p>
        </div>

        {/* Step 1 — Plan selection */}
        {step === 1 && (
          <>
            {/* Features */}
            <div style={s.featuresCard}>
              {FEATURES.map((f, i) => (
                <p key={i} style={s.featureRow}>{f}</p>
              ))}
            </div>

            {/* Plans */}
            <div style={s.plansRow}>
              {plans.map(plan => (
                <button
                  key={plan.id}
                  style={{
                    ...s.planCard,
                    borderColor:     selectedPlan === plan.id ? "#f59e0b" : "rgba(255,255,255,0.1)",
                    backgroundColor: selectedPlan === plan.id ? "rgba(245,158,11,0.12)" : "#162016",
                  }}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.badge && (
                    <div style={{
                      ...s.planBadge,
                      backgroundColor: plan.popular ? "#f59e0b" : "#22c55e",
                    }}>
                      <span style={s.planBadgeText}>{plan.badge}</span>
                    </div>
                  )}
                  <p style={s.planLabel}>{plan.label}</p>
                  <p style={s.planPrice}>₾{plan.price}</p>
                  <p style={s.planPeriod}>{plan.period}</p>
                  {selectedPlan === plan.id && (
                    <div style={s.checkMark}>✓</div>
                  )}
                </button>
              ))}
            </div>

            {/* Total */}
            <div style={s.totalBox}>
              <span style={s.totalLabel}>სულ ყოველთვიურად:</span>
              <span style={s.totalPrice}>₾{plan?.price}</span>
            </div>
          </>
        )}

        {/* Step 2 — Payment method */}
        {step === 2 && (
          <>
            <div style={s.summaryCard}>
              <p style={s.summaryTitle}>არჩეული პლანი</p>
              <div style={s.summaryRow}>
                <span style={s.summaryPlan}>{plan?.label} — Premium</span>
                <span style={s.summaryAmount}>₾{plan?.price}/თვე</span>
              </div>
            </div>

            <p style={s.payTitle}>გადახდის მეთოდი</p>

            {/* TBC */}
            <button
              style={{
                ...s.bankBtn,
                borderColor: payMethod === "tbc" ? "#00A3E0" : "rgba(255,255,255,0.1)",
                backgroundColor: payMethod === "tbc" ? "rgba(0,163,224,0.1)" : "#162016",
              }}
              onClick={() => setPayMethod("tbc")}
            >
              <div style={{ ...s.bankLogo, backgroundColor: "#00A3E0" }}>
                <span style={s.bankLogoText}>TBC</span>
              </div>
              <div style={s.bankInfo}>
                <p style={s.bankName}>TBC ბანკი</p>
                <p style={s.bankSub}>ბარათით ან TBC Pay-ით</p>
              </div>
              <div style={{
                ...s.radioCircle,
                borderColor: payMethod === "tbc" ? "#00A3E0" : "rgba(255,255,255,0.3)",
                backgroundColor: payMethod === "tbc" ? "#00A3E0" : "transparent",
              }}/>
            </button>

            {/* BOG */}
            <button
              style={{
                ...s.bankBtn,
                borderColor: payMethod === "bog" ? "#FF6B00" : "rgba(255,255,255,0.1)",
                backgroundColor: payMethod === "bog" ? "rgba(255,107,0,0.1)" : "#162016",
              }}
              onClick={() => setPayMethod("bog")}
            >
              <div style={{ ...s.bankLogo, backgroundColor: "#FF6B00" }}>
                <span style={s.bankLogoText}>BOG</span>
              </div>
              <div style={s.bankInfo}>
                <p style={s.bankName}>Bank of Georgia</p>
                <p style={s.bankSub}>ბარათით ან BOG Pay-ით</p>
              </div>
              <div style={{
                ...s.radioCircle,
                borderColor: payMethod === "bog" ? "#FF6B00" : "rgba(255,255,255,0.3)",
                backgroundColor: payMethod === "bog" ? "#FF6B00" : "transparent",
              }}/>
            </button>

            <p style={s.secureNote}>🔒 გადახდა დაცულია SSL დაშიფვრით</p>
          </>
        )}

        {/* CTA Button */}
        <button
          style={{
            ...s.ctaBtn,
            opacity: step === 2 && !payMethod ? 0.5 : 1,
            backgroundColor: loading ? "#6b7280" : "#f59e0b",
          }}
          onClick={handleContinue}
          disabled={loading || (step === 2 && !payMethod)}
        >
          {loading ? "დამუშავება..." : step === 1 ? "გაგრძელება →" : "გადახდა"}
        </button>

        <p style={s.terms}>
          გამოწერა ავტომატურად განახლდება ყოველ თვე.{"\n"}
          გაუქმება ნებისმიერ დროს შეიძლება.
        </p>

      </div>
    </div>
  );
}

const s = {
  screen: { display:"flex", flexDirection:"column", minHeight:"100vh", backgroundColor:"#0d1f0d", fontFamily:"sans-serif", userSelect:"none" },
  container: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 16px 30px", gap:16, maxWidth:420, width:"100%", margin:"0 auto" },

  backBtn: { alignSelf:"flex-start", background:"none", border:"none", cursor:"pointer", padding:4 },

  header: { display:"flex", flexDirection:"column", alignItems:"center", gap:6 },
  crownBox: { fontSize:48, lineHeight:1 },
  headerTitle: { color:"#f59e0b", fontSize:26, fontWeight:800, margin:0 },
  headerSub: { color:"#86efac", fontSize:14, margin:0 },

  featuresCard: { backgroundColor:"#162016", borderRadius:16, padding:"16px 18px", width:"100%", display:"flex", flexDirection:"column", gap:8, border:"1px solid rgba(255,255,255,0.07)" },
  featureRow: { color:"#d1fae5", fontSize:14, margin:0, lineHeight:1.5 },

  plansRow: { display:"flex", flexDirection:"row", gap:10, width:"100%" },
  planCard: { flex:1, border:"2px solid", borderRadius:16, padding:"14px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", position:"relative", transition:"all 0.2s" },
  planBadge: { position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", borderRadius:20, padding:"3px 10px", whiteSpace:"nowrap" },
  planBadgeText: { color:"white", fontSize:10, fontWeight:700 },
  planLabel: { color:"white", fontSize:13, fontWeight:700, margin:0 },
  planPrice: { color:"#f59e0b", fontSize:22, fontWeight:800, margin:0 },
  planPeriod: { color:"#9ca3af", fontSize:11, margin:0 },
  checkMark: { color:"#f59e0b", fontSize:18, fontWeight:800 },

  totalBox: { display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", backgroundColor:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:12, padding:"12px 16px", width:"100%" },
  totalLabel: { color:"#d1fae5", fontSize:14 },
  totalPrice: { color:"#f59e0b", fontSize:20, fontWeight:800 },

  summaryCard: { backgroundColor:"#162016", borderRadius:14, padding:"14px 16px", width:"100%", border:"1px solid rgba(245,158,11,0.25)" },
  summaryTitle: { color:"#9ca3af", fontSize:12, margin:"0 0 8px", fontWeight:600 },
  summaryRow: { display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  summaryPlan: { color:"white", fontSize:15, fontWeight:700 },
  summaryAmount: { color:"#f59e0b", fontSize:15, fontWeight:800 },

  payTitle: { color:"white", fontSize:16, fontWeight:700, alignSelf:"flex-start", margin:0 },

  bankBtn: { display:"flex", flexDirection:"row", alignItems:"center", gap:14, border:"2px solid", borderRadius:16, padding:"14px 16px", cursor:"pointer", width:"100%", textAlign:"left", transition:"all 0.2s" },
  bankLogo: { width:48, height:48, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  bankLogoText: { color:"white", fontSize:13, fontWeight:800 },
  bankInfo: { flex:1, display:"flex", flexDirection:"column", gap:3 },
  bankName: { color:"white", fontSize:15, fontWeight:700, margin:0 },
  bankSub: { color:"#9ca3af", fontSize:12, margin:0 },
  radioCircle: { width:22, height:22, borderRadius:"50%", border:"2px solid", flexShrink:0, transition:"all 0.2s" },

  secureNote: { color:"#6b7280", fontSize:12, margin:0 },

  ctaBtn: { color:"#0f172a", border:"none", borderRadius:16, padding:"16px", fontSize:17, fontWeight:800, cursor:"pointer", width:"100%", transition:"all 0.2s", boxShadow:"0 4px 16px rgba(245,158,11,0.35)" },

  terms: { color:"#6b7280", fontSize:11, textAlign:"center", margin:0, lineHeight:1.6, whiteSpace:"pre-line" },
};
