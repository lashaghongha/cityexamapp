import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError,    setLoginError]    = useState("");
  const [loginLoading,  setLoginLoading]  = useState(false);

  const [regName,      setRegName]      = useState("");
  const [regEmail,     setRegEmail]     = useState("");
  const [regPhone,     setRegPhone]     = useState("");
  const [regPassword,  setRegPassword]  = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [regError,     setRegError]     = useState("");
  const [regLoading,   setRegLoading]   = useState(false);

  const handleLogin = async () => {
    setLoginError("");
    if (!loginEmail || !loginPassword) { setLoginError("შეავსე ყველა ველი"); return; }
    setLoginLoading(true);
    try {
      const data = await login({ email: loginEmail, password: loginPassword });
      navigate(data.user?.isPremium ? "/" : "/");
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegError("");
    if (!regName || !regEmail || !regPassword) { setRegError("შეავსე ყველა სავალდებულო ველი"); return; }
    if (regPassword !== regPassword2) { setRegError("პაროლები არ ემთხვევა"); return; }
    if (regPassword.length < 6) { setRegError("პაროლი მინ. 6 სიმბოლო უნდა იყოს"); return; }
    setRegLoading(true);
    try {
      await register({ name: regName, email: regEmail, phone: regPhone, password: regPassword });
      navigate("/");
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div style={s.screen}>
      <div style={s.container}>

        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        <div style={s.logoBox}>
          <div style={s.logoIcon}>🚗</div>
          <p style={s.logoTitle}>Driving School</p>
          <p style={s.logoSub}>ქალაქის გამოცდის სასწავლო პლატფორმა</p>
        </div>

        <div style={s.tabs}>
          <button
            style={{ ...s.tab, ...(tab === "login" ? s.tabActive : s.tabInactive) }}
            onClick={() => setTab("login")}
          >
            შესვლა
          </button>
          <button
            style={{ ...s.tab, ...(tab === "register" ? s.tabActive : s.tabInactive) }}
            onClick={() => setTab("register")}
          >
            რეგისტრაცია
          </button>
        </div>

        <div style={s.card}>

          {tab === "login" && (
            <div style={s.form}>
              <p style={s.formTitle}>კეთილი იყოს შენი დაბრუნება 👋</p>

              {loginError && <div style={s.errorBox}>{loginError}</div>}

              <div style={s.fieldGroup}>
                <label style={s.label}>Email</label>
                <input style={s.input} type="email" placeholder="შენი მეილი"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}/>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>პაროლი</label>
                <input style={s.input} type="password" placeholder="••••••••"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}/>
              </div>

              <button
                style={{ ...s.submitBtn, opacity: loginLoading ? 0.7 : 1 }}
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? "⏳ შედიხარ..." : "შესვლა"}
              </button>

              <p style={s.switchText}>
                ანგარიში არ გაქვს?{" "}
                <button style={s.switchLink} onClick={() => setTab("register")}>
                  დარეგისტრირდი
                </button>
              </p>
            </div>
          )}

          {tab === "register" && (
            <div style={s.form}>
              <p style={s.formTitle}>ახალი ანგარიშის შექმნა ✨</p>

              {regError && <div style={s.errorBox}>{regError}</div>}

              <div style={s.fieldGroup}>
                <label style={s.label}>სახელი *</label>
                <input style={s.input} placeholder="შენი სახელი"
                  value={regName} onChange={e => setRegName(e.target.value)}/>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Email *</label>
                <input style={s.input} type="email" placeholder="შენი მეილი"
                  value={regEmail} onChange={e => setRegEmail(e.target.value)}/>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>მობ. ნომერი</label>
                <input style={s.input} type="tel" placeholder="5XX XXX XXX"
                  value={regPhone} onChange={e => setRegPhone(e.target.value)}/>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>პაროლი *</label>
                <input style={s.input} type="password" placeholder="მინ. 6 სიმბოლო"
                  value={regPassword} onChange={e => setRegPassword(e.target.value)}/>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>გაიმეორე პაროლი *</label>
                <input style={s.input} type="password" placeholder="••••••••"
                  value={regPassword2} onChange={e => setRegPassword2(e.target.value)}/>
              </div>

              <button
                style={{ ...s.submitBtn, backgroundColor: "#f59e0b", opacity: regLoading ? 0.7 : 1 }}
                onClick={handleRegister}
                disabled={regLoading}
              >
                {regLoading ? "⏳ ვქმნი ანგარიშს..." : "რეგისტრაცია"}
              </button>

              <p style={s.switchText}>
                უკვე გაქვს ანგარიში?{" "}
                <button style={s.switchLink} onClick={() => setTab("login")}>
                  შესვლა
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  screen:{display:"flex",flexDirection:"column",minHeight:"100vh",backgroundColor:"#0d1f0d",fontFamily:"sans-serif",userSelect:"none"},
  container:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 16px 30px",gap:16,maxWidth:420,width:"100%",margin:"0 auto"},
  backBtn:{alignSelf:"flex-start",background:"none",border:"none",cursor:"pointer",padding:4},
  logoBox:{display:"flex",flexDirection:"column",alignItems:"center",gap:6,marginBottom:4},
  logoIcon:{fontSize:42},
  logoTitle:{color:"white",fontSize:22,fontWeight:800,margin:0},
  logoSub:{color:"#86efac",fontSize:13,margin:0,textAlign:"center"},
  tabs:{display:"flex",flexDirection:"row",backgroundColor:"#162016",borderRadius:16,padding:4,width:"100%",gap:4},
  tab:{flex:1,border:"none",borderRadius:12,padding:"11px",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all 0.2s"},
  tabActive:{backgroundColor:"#22c55e",color:"white",boxShadow:"0 2px 8px rgba(34,197,94,0.35)"},
  tabInactive:{backgroundColor:"transparent",color:"#6b7280"},
  card:{backgroundColor:"white",borderRadius:20,padding:"22px 20px",width:"100%",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"},
  form:{display:"flex",flexDirection:"column",gap:14},
  formTitle:{color:"#111",fontSize:16,fontWeight:700,margin:0,textAlign:"center"},
  errorBox:{backgroundColor:"#fef2f2",border:"1px solid #fca5a5",borderRadius:10,padding:"10px 14px",color:"#dc2626",fontSize:13,textAlign:"center"},
  fieldGroup:{display:"flex",flexDirection:"column",gap:5},
  label:{fontSize:13,fontWeight:700,color:"#374151"},
  input:{border:"1.5px solid #e5e7eb",borderRadius:12,padding:"12px 14px",fontSize:14,outline:"none",fontFamily:"inherit",color:"#111",transition:"border 0.2s"},
  submitBtn:{backgroundColor:"#22c55e",color:"white",border:"none",borderRadius:14,padding:"14px",fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(34,197,94,0.3)"},
  switchText:{textAlign:"center",fontSize:13,color:"#6b7280",margin:0},
  switchLink:{background:"none",border:"none",color:"#22c55e",fontWeight:700,cursor:"pointer",fontSize:13},
};
