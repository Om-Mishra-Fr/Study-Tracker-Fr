import React from "react";

// ---------------- GLOBAL CSS ----------------
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
html { scroll-behavior: smooth; }
body { background:#07070f; font-family:'Sora', sans-serif; color:#e2e2f0; overflow-x:hidden; }
::-webkit-scrollbar { width:5px; height:5px; }
::-webkit-scrollbar-thumb { background:#1e1e30; border-radius:99px; }
@keyframes fadeUp { from{opacity:0; transform:translateY(20px);} to{opacity:1; transform:translateY(0);} }
@keyframes spin { to{transform:rotate(360deg);} }
.anim-fadeUp { animation: fadeUp .45s both; }
.glass { background:rgba(255,255,255,.03); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,.06); }
`;

// ---------------- CONSTANTS & HELPERS ----------------
const STORAGE_KEY = "studybuddy_v3";
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function dbLoad() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

function dbSave(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Up late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ---------------- STYLES ----------------
const iStyle = (color) => ({
  background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)",
  borderRadius:12, color:"#e2e2f0", padding:"11px 16px", fontSize:14, width:"100%"
});

const cardStyle = (color) => ({
  background:"linear-gradient(145deg,#0c0c1e,#10101f)",
  border:`1px solid ${color ? color+"25" : "rgba(255,255,255,.06)"}`,
  borderRadius:20, padding:"20px 22px", marginBottom: 15
});

const btnPrimary = (color) => ({
  background:`linear-gradient(135deg,${color},${color}cc)`,
  border:"none", borderRadius:12, color:"#000", padding:"11px 26px", fontWeight:700, cursor:"pointer"
});

// ---------------- COMPONENTS ----------------
function Spinner({ size=24, color="#818cf8" }) {
  return <div style={{ width:size, height:size, border:`3px solid ${color}22`, borderTop:`3px solid ${color}`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />;
}

function SectionHeader({ title, sub, action, actionLabel, color }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:24, alignItems: 'center' }}>
      <div>
        <h2 style={{ color:"#fff", fontWeight:800, fontSize:28 }}>{title}</h2>
        {sub && <p style={{ color:"#3a3a55", fontSize:13 }}>{sub}</p>}
      </div>
      {action && <button onClick={action} style={btnPrimary(color || "#818cf8")}>{actionLabel}</button>}
    </div>
  );
}

// ---------------- VIEWS ----------------

function TimerView({ data, update, userId, u, showToast }) {
  const [localSecs, setLocalSecs] = React.useState(data.timer.seconds);
  const isRunning = data.timer.running;

  React.useEffect(() => {
    let itv;
    if (isRunning && localSecs > 0) {
      itv = setInterval(() => setLocalSecs(s => s - 1), 1000);
    } else if (localSecs === 0) {
      showToast("Time is up!");
    }
    return () => clearInterval(itv);
  }, [isRunning, localSecs]);

  const toggle = () => update(d => { d.timer.running = !d.timer.running; });

  return (
    <div style={cardStyle(u.color)}>
      <h3 style={{fontSize: 48, textAlign: 'center'}}>{Math.floor(localSecs/60)}:{String(localSecs%60).padStart(2,'0')}</h3>
      <div style={{display:'flex', gap: 10, justifyContent: 'center', marginTop: 20}}>
        <button style={btnPrimary(u.color)} onClick={toggle}>{isRunning ? "Pause" : "Start"}</button>
      </div>
    </div>
  );
}

function DoubtsView({ data, update, userId, u, showToast }) {
  const [question, setQuestion] = React.useState("");
  const post = () => {
    if(!question) return;
    update(d => { d.doubts.push({ id: Date.now(), question, from: userId, ts: Date.now() }); });
    setQuestion("");
    showToast("Doubt Posted!");
  };
  return (
    <div>
      <SectionHeader title="Doubts" color={u.color} />
      <textarea value={question} onChange={e => setQuestion(e.target.value)} style={iStyle()} placeholder="Ask anything..." />
      <button onClick={post} style={{...btnPrimary(u.color), marginTop: 10}}>Post</button>
      {data.doubts.map(d => (
        <div key={d.id} style={cardStyle(u.color)}>{d.question}</div>
      ))}
    </div>
  );
}

function ChatView({ data, update, userId, u }) {
  const [msg, setMsg] = React.useState("");
  const send = () => {
    if(!msg) return;
    update(d => { d.chat.push({ id: Date.now(), text: msg, from: userId }); });
    setMsg("");
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '70vh'}}>
      <div style={{flex: 1, overflowY: 'auto'}}>
        {data.chat.map(m => <div key={m.id} style={{textAlign: m.from === userId ? 'right' : 'left', margin: 10}}><b>{m.from}:</b> {m.text}</div>)}
      </div>
      <div style={{display: 'flex', gap: 10}}>
        <input value={msg} onChange={e => setMsg(e.target.value)} style={iStyle()} />
        <button onClick={send} style={btnPrimary(u.color)}>Send</button>
      </div>
    </div>
  );
}

// ---------------- MAIN LOGIC ----------------

function DashboardShell({ data, update, userId, setUserId, tab, setTab, syncing, showToast, toast }) {
  const u = data.users[userId];
  const renderContent = () => {
    if (tab === "timer") return <TimerView data={data} update={update} userId={userId} u={u} showToast={showToast} />;
    if (tab === "doubts") return <DoubtsView data={data} update={update} userId={userId} u={u} showToast={showToast} />;
    if (tab === "chat") return <ChatView data={data} update={update} userId={userId} u={u} />;
    return <div className="anim-fadeUp"><h1>{greeting()}, {u.name}</h1></div>;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: 250, background: "#0c0c1e", padding: 25, borderRight: "1px solid #1e1e30" }}>
        <h2 style={{ color: u.color, marginBottom: 30 }}>StudyBuddy</h2>
        {["home", "timer", "doubts", "chat"].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{ color: tab === t ? u.color : "#666", padding: "12px 0", cursor: "pointer", fontWeight: 600 }}>
            {t.toUpperCase()}
          </div>
        ))}
        <button onClick={() => setUserId(null)} style={{marginTop: 40, background: 'none', border: 'none', color: '#f87171', cursor: 'pointer'}}>Logout</button>
      </nav>
      <main style={{ flex: 1, padding: 40 }}>{renderContent()}</main>
      {toast && <div style={{ position: "fixed", bottom: 20, right: 20, background: u.color, color: "#000", padding: "10px 20px", borderRadius: 10 }}>{toast.msg}</div>}
    </div>
  );
}

export default function App() {
  const [data, setData] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [tab, setTab] = React.useState("home");
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    const el = document.createElement("style"); el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    const saved = dbLoad();
    setData(saved || {
        users: { A: { name: "User A", color: "#818cf8", avatar: "🌙" }, B: { name: "User B", color: "#34d399", avatar: "⭐" } },
        timer: { running: false, seconds: 1500 }, doubts: [], chat: [], notes: []
    });
  }, []);

  const update = (fn) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      dbSave(next);
      return next;
    });
  };

  const showToast = (msg) => {
    setToast({ msg });
    setTimeout(() => setToast(null), 3000);
  };

  if (!data) return <div>Loading...</div>;

  if (!userId) {
    return (
      <div style={{height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <h1>Select Profile</h1>
        <button style={btnPrimary("#818cf8")} onClick={() => setUserId("A")}>Enter as User A</button>
        <button style={{...btnPrimary("#34d399"), marginTop: 10}} onClick={() => setUserId("B")}>Enter as User B</button>
      </div>
    );
  }

  return <DashboardShell data={data} update={update} userId={userId} setUserId={setUserId} tab={tab} setTab={setTab} showToast={showToast} toast={toast} />;
}
