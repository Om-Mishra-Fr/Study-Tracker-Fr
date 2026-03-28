// ===============================================================
// STUDYBUDDY — SEGMENT 1 of 5
// Imports · Storage · Default Data · Global Styles
// ===============================================================

import React from "react";
// ---------------- GLOBAL CSS ----------------
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
html { scroll-behavior: smooth; }

body {
  background:#07070f;
  font-family:'Sora', sans-serif;
  color:#e2e2f0;
  overflow-x:hidden;
}

::-webkit-scrollbar { width:5px; height:5px; }
::-webkit-scrollbar-thumb { background:#1e1e30; border-radius:99px; }

@keyframes fadeUp { from{opacity:0; transform:translateY(20px);} to{opacity:1; transform:translateY(0);} }
@keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
@keyframes slideRight { from{opacity:0; transform:translateX(-16px);} to{opacity:1; transform:translateX(0);} }
@keyframes slideLeft { from{opacity:0; transform:translateX(16px);} to{opacity:1; transform:translateX(0);} }
@keyframes scaleIn { from{opacity:0; transform:scale(.92);} to{opacity:1; transform:scale(1);} }
@keyframes spin { to{transform:rotate(360deg);} }

.anim-fadeUp { animation: fadeUp .45s both; }
.anim-fadeIn { animation: fadeIn .35s both; }
.anim-scaleIn { animation: scaleIn .3s both; }

.glass {
 background:rgba(255,255,255,.03);
 backdrop-filter:blur(16px);
 border:1px solid rgba(255,255,255,.06);
}
`;

// ---------------- STORAGE ----------------
const STORAGE_KEY = "studybuddy_v3";

function dbLoad() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}

function dbSave(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ---------------- TIME HELPERS ----------------
function timeAgo(ts) {
  const diff = Date.now() - ts;

  if (diff < 60000) return "just now";
  if (diff < 3600000) return Math.floor(diff/60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff/3600000) + "h ago";

  return new Date(ts).toLocaleDateString();
}

function greeting() {
  const h = new Date().getHours();

  if (h < 5) return "Up late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";

  return "Good night";
}

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ---------------- DEFAULT STATE ----------------
const DEFAULT_STATE = {
  users: {
    A:{ name:"You", avatar:"🌙", color:"#818cf8", colorDim:"#818cf820", joined:Date.now() },
    B:{ name:"Friend", avatar:"⭐", color:"#34d399", colorDim:"#34d39920", joined:Date.now() }
  },

  timetable:[],
  resources:[],
  doubts:[],
  chat:[],
  notes:[],

  timer:{
    running:false,
    seconds:1500,
    total:1500,
    label:"Focus Session",
    startedBy:null,
    startedAt:null
  },

  goals:{ A:[], B:[] },

  lastSeen:{ A:null, B:null }
};

// ---------------- INPUT STYLE ----------------
const iStyle = () => ({
  background:"rgba(255,255,255,.05)",
  border:"1px solid rgba(255,255,255,.08)",
  borderRadius:12,
  color:"#e2e2f0",
  padding:"11px 16px",
  fontSize:14,
  width:"100%"
});

// ---------------- CARD STYLE ----------------
const cardStyle = (color) => ({
  background:"linear-gradient(145deg,#0c0c1e,#10101f)",
  border:`1px solid ${color ? color+"25" : "rgba(255,255,255,.06)"}`,
  borderRadius:20,
  padding:"20px 22px"
});

// ---------------- BUTTONS ----------------
const btnPrimary = (color) => ({
  background:`linear-gradient(135deg,${color},${color}cc)`,
  border:"none",
  borderRadius:12,
  color:"#000",
  padding:"11px 26px",
  fontWeight:700,
  cursor:"pointer",
  fontSize:14
});

const btnGhost = {
  background:"rgba(255,255,255,.04)",
  border:"1px solid rgba(255,255,255,.08)",
  borderRadius:12,
  color:"#888",
  padding:"10px 20px",
  fontSize:14,
  cursor:"pointer"
};

// ---------------- SPINNER ----------------
function Spinner({ size=24, color="#818cf8" }) {
  return (
    <div
      style={{
        width:size,
        height:size,
        border:`3px solid ${color}22`,
        borderTop:`3px solid ${color}`,
        borderRadius:"50%",
        animation:"spin .8s linear infinite"
      }}
    />
  );
}

// ---------------- BADGE ----------------
function Badge({ count, color="#f87171" }) {

  if(!count) return null;

  return (
    <span
      style={{
        position:"absolute",
        top:4,
        right:4,
        minWidth:16,
        height:16,
        background:color,
        borderRadius:99,
        fontSize:9,
        fontWeight:800,
        color:"#000",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        padding:"0 4px"
      }}
    >
      {count}
    </span>
  );
}

// ---------------- EMPTY STATE ----------------
function Empty({ icon, title, sub }) {
  return (
    <div style={{ textAlign:"center", padding:"60px 20px", color:"#2a2a40" }}>
      <div style={{ fontSize:52, marginBottom:14 }}>{icon}</div>
      <div style={{ fontWeight:700, fontSize:16 }}>{title}</div>
      {sub && <div style={{ fontSize:13 }}>{sub}</div>}
    </div>
  );
}

// ---------------- SECTION HEADER ----------------
function SectionHeader({ title, sub, action, actionLabel, color }) {

  return (
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:24 }}>

      <div>
        <h2 style={{ color:"#fff", fontWeight:800, fontSize:28 }}>{title}</h2>
        {sub && <p style={{ color:"#3a3a55", fontSize:13 }}>{sub}</p>}
      </div>

      {action && (
        <button onClick={action} style={btnPrimary(color || "#818cf8")}>
          {actionLabel}
        </button>
      )}

    </div>
  );
}

// END SEGMENT 1
// ============================================================
// STUDYBUDDY — SEGMENT 2 of 5
// Root App · Landing · Dashboard · Home
// ============================================================

// ROOT APP
export default function App() {
  const [data, setData] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [tab, setTab] = React.useState("home");
  const [syncing, setSyncing] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const pollRef = React.useRef(null);

  React.useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  React.useEffect(() => {
    (async () => {
      const saved = await dbLoad();
      setData(saved || DEFAULT_STATE);
    })();
  }, []);

  React.useEffect(() => {
    if (!data || !userId) return;
    pollRef.current = setInterval(async () => {
      setSyncing(true);
      const fresh = await dbLoad();
      if (fresh) setData(fresh);
      setTimeout(() => setSyncing(false), 400);
    }, 2500);
    return () => clearInterval(pollRef.current);
  }, [data, userId]);

  React.useEffect(() => {
    if (!userId || !data) return;
    update(d => { d.lastSeen[userId] = Date.now(); });
  }, [userId]);

  const update = React.useCallback((fn) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      dbSave(next);
      return next;
    });
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  if (!data) {
    return (
      <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        Loading StudyBuddy...
      </div>
    );
  }

  if (!userId) {
    return <LandingPage data={data} update={update} onSelect={setUserId} />;
  }

  return (
    <DashboardShell
      data={data}
      update={update}
      userId={userId}
      setUserId={setUserId}
      tab={tab}
      setTab={setTab}
      syncing={syncing}
      showToast={showToast}
      toast={toast}
    />
  );
}

// LANDING PAGE
function LandingPage({ data, update, onSelect }) {
  const [editingId, setEditingId] = React.useState(null);
  const [tmpName, setTmpName] = React.useState("");
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <h1>StudyBuddy</h1>

      {["A","B"].map(uid => {
        const u = data.users[uid];

        return (
          <div key={uid} style={{margin:20}}>
            {editingId === uid ? (
              <div>
                <input
                  value={tmpName}
                  onChange={e=>setTmpName(e.target.value)}
                />
                <button onClick={()=>{
                  update(d=>{d.users[uid].name=tmpName});
                  setEditingId(null);
                }}>
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h3>{u.avatar} {u.name}</h3>
                <button onClick={()=>onSelect(uid)}>
                  Enter
                </button>
                <button onClick={()=>{
                  setEditingId(uid);
                  setTmpName(u.name);
                }}>
                  Rename
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
        }
// ============================================================
// STUDYBUDDY — SEGMENT 3 of 5
// Timer · Schedule · Resources
// ============================================================

// TIMER VIEW
function TimerView({ data, update, userId, u, otherU, showToast }) {
  const [localSecs, setLocalSecs] = React.useState(data.timer.seconds);
  const [preset, setPreset] = React.useState(1500);
  const [label, setLabel] = React.useState(data.timer.label);
  const [sessions, setSessions] = React.useState([]);
  const itvRef = React.useRef(null);

  React.useEffect(() => {
    setLocalSecs(data.timer.seconds);
  }, [data.timer.seconds]);

  React.useEffect(() => {
    setLabel(data.timer.label);
  }, [data.timer.label]);

  React.useEffect(() => {
    if (data.timer.running) {
      itvRef.current = setInterval(() => {
        setLocalSecs((s) => {
          if (s <= 1) {
            clearInterval(itvRef.current);
            showToast("Session complete!");
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(itvRef.current);
    }

    return () => clearInterval(itvRef.current);
  }, [data.timer.running]);

  const start = () => {
    update((d) => {
      d.timer = {
        running: true,
        seconds: preset,
        total: preset,
        label,
        startedBy: userId,
        startedAt: Date.now(),
      };
    });

    setLocalSecs(preset);
    showToast("Session started!");
  };

  const pause = () => {
    update((d) => {
      d.timer.running = false;
      d.timer.seconds = localSecs;
    });
  };

  const resume = () => {
    update((d) => {
      d.timer.running = true;
    });
  };

  const reset = () => {
    update((d) => {
      d.timer = {
        running: false,
        seconds: preset,
        total: preset,
        label,
        startedBy: null,
        startedAt: null,
      };
    });

    setLocalSecs(preset);
  };

  const finish = () => {
    setSessions((prev) => [
      ...prev,
      { label, duration: preset - localSecs, ts: Date.now() },
    ]);

    reset();
    showToast("Session logged!");
  };
  // ============================================================
// STUDYBUDDY — SEGMENT 4 of 5
// Doubts · Chat
// ============================================================

// DOUBTS VIEW
function DoubtsView({ data, update, userId, u, otherU, other, showToast }) {

  const [question, setQuestion] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [urgency, setUrgency] = React.useState("normal");
  const [ansMap, setAnsMap] = React.useState({});
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const textRef = React.useRef(null);

  const post = () => {
    if (!question.trim()) {
      showToast("Type your question first","error");
      return;
    }

    update(d => {
      d.doubts.push({
        id: Date.now(),
        question: question.trim(),
        subject: subject.trim(),
        urgency,
        from: userId,
        answer: null,
        answeredBy: null,
        ts: Date.now(),
        upvotes: []
      });
    });

    setQuestion("");
    setSubject("");
    setUrgency("normal");

    showToast("Doubt posted!");
  };


  const answer = (id) => {

    const text = ansMap[id]?.trim();

    if (!text) {
      showToast("Write an answer first","error");
      return;
    }

    update(d => {

      const dbt = d.doubts.find(x => x.id === id);

      if (dbt) {
        dbt.answer = text;
        dbt.answeredBy = userId;
        dbt.answeredAt = Date.now();
      }

    });

    setAnsMap(p => {
      const n = {...p};
      delete n[id];
      return n;
    });

    showToast("Answer posted!");
  };


  const upvote = (id) => {

    update(d => {

      const dbt = d.doubts.find(x => x.id === id);
      if (!dbt) return;

      if (!dbt.upvotes) dbt.upvotes = [];

      if (dbt.upvotes.includes(userId))
        dbt.upvotes = dbt.upvotes.filter(x => x !== userId);
      else
        dbt.upvotes.push(userId);

    });

  };


  const remove = (id) => {

    update(d => {
      d.doubts = d.doubts.filter(x => x.id !== id);
    });

    showToast("Removed");

  };


  const URGENCY = {
    low:    { label:"Low", color:"#34d399" },
    normal: { label:"Normal", color:"#818cf8" },
    urgent: { label:"Urgent", color:"#f87171" }
  };


  let items = [...data.doubts];

  if (filter === "mine")
    items = items.filter(d => d.from === userId);

  if (filter === "unanswered")
    items = items.filter(d => !d.answer);

  if (filter === "answered")
    items = items.filter(d => d.answer);


  if (search.trim()) {

    items = items.filter(d =>
      d.question.toLowerCase().includes(search.toLowerCase()) ||
      d.subject?.toLowerCase().includes(search.toLowerCase())
    );

  }


  items.sort((a,b) => {

    const score = u =>
      u === "urgent" ? 2 :
      u === "normal" ? 1 : 0;

    const uDiff = score(b.urgency) - score(a.urgency);

    return uDiff !== 0 ? uDiff : b.ts - a.ts;

  });


  return (
    <div>

      <SectionHeader
        title="Doubts & Q&A"
        sub="Post questions, get answers from your study partner"
        color={u.color}
      />

      <div style={{marginBottom:20}}>

        <input
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          style={iStyle(u.color)}
        />

        <textarea
          ref={textRef}
          placeholder="Write your doubt..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={4}
          style={{...iStyle(u.color), marginTop:10}}
        />

        <button
          onClick={post}
          style={btnPrimary(u.color)}
        >
          Post Doubt
        </button>

      </div>


      {items.map(dbt => {

        const asker = data.users[dbt.from];
        const canAnswer = dbt.from !== userId && !dbt.answer;

        return (

          <div key={dbt.id} style={cardStyle(u.color)}>

            <div>
              <strong>{asker.name}</strong>
            </div>

            <div style={{margin:"8px 0"}}>
              {dbt.question}
            </div>


            {dbt.answer && (
              <div style={{color:"#34d399"}}>
                Answer: {dbt.answer}
              </div>
            )}


            {canAnswer && (

              <div>

                <textarea
                  value={ansMap[dbt.id] || ""}
                  onChange={e =>
                    setAnsMap(p => ({
                      ...p,
                      [dbt.id]: e.target.value
                    }))
                  }
                />

                <button
                  onClick={() => answer(dbt.id)}
                  style={btnPrimary("#34d399")}
                >
                  Answer
                </button>

              </div>

            )}

          </div>

        );

      })}

    </div>
  );

}



// ============================================================
// CHAT VIEW
// ============================================================

function ChatView({ data, update, userId, u, otherU, other, showToast }) {

  const [msg, setMsg] = React.useState("");
  const [replyTo, setReplyTo] = React.useState(null);
  const endRef = React.useRef(null);
  const inputRef = React.useRef(null);


  React.useEffect(() => {
    endRef.current?.scrollIntoView({behavior:"smooth"});
  }, [data.chat.length]);


  const send = () => {

    const text = msg.trim();
    if (!text) return;

    update(d => {

      d.chat.push({
        id: Date.now(),
        text,
        from: userId,
        ts: Date.now(),
        replyTo: replyTo
          ? { id: replyTo.id, text: replyTo.text, from: replyTo.from }
          : null,
        reactions: {},
        edited:false
      });

    });

    setMsg("");
    setReplyTo(null);

  };


  const deleteMsg = (id) => {
    update(d => {
      d.chat = d.chat.filter(x => x.id !== id);
    });
  };


  const startReply = (m) => {
    setReplyTo(m);
    inputRef.current?.focus();
  };


  return (

    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>

      <h2>Chat</h2>


      <div style={{flex:1,overflowY:"auto"}}>

        {data.chat.map(m => {

          const isMe = m.from === userId;
          const sender = data.users[m.from];

          return (

            <div key={m.id} style={{marginBottom:10}}>

              <strong>{sender.name}</strong>

              <div>
                {m.text}
              </div>

              <button onClick={()=>startReply(m)}>Reply</button>

              {isMe && (
                <button onClick={()=>deleteMsg(m.id)}>
                  Delete
                </button>
              )}

            </div>

          );

        })}

        <div ref={endRef}/>

      </div>


      <div style={{display:"flex",gap:8}}>

        <input
          ref={inputRef}
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Type message..."
        />

        <button onClick={send}>
          Send
        </button>

      </div>

    </div>

  );

    }
// =============================================================
// STUDYBUDDY — SEGMENT 5 of 5
// This segment: Notes · Goals
// =============================================================


// ---------- NOTES VIEW ----------

function NotesView({ data, update, userId, u, otherU, other, showToast }) {

  const [title,setTitle] = React.useState("");
  const [body,setBody] = React.useState("");
  const [tag,setTag] = React.useState("");
  const [editId,setEditId] = React.useState(null);
  const [selected,setSelected] = React.useState(null);
  const [search,setSearch] = React.useState("");
  const [filter,setFilter] = React.useState("all");

  const COLORS = [
    "#818cf8",
    "#34d399",
    "#f59e0b",
    "#f87171",
    "#c084fc",
    "#38bdf8",
    "#fb923c"
  ];

  const [noteColor,setNoteColor] = React.useState(COLORS[0]);

  const save = () => {

    if(!title.trim()){
      showToast("Add a title","error");
      return;
    }

    if(editId){

      update(d=>{
        const n = d.notes.find(x=>x.id===editId);
        if(n){
          n.title = title;
          n.body = body;
          n.tag = tag;
          n.color = noteColor;
          n.updatedAt = Date.now();
        }
      });

      showToast("Note updated");

    }else{

      update(d=>{
        d.notes.push({
          id:Date.now(),
          title,
          body,
          tag,
          color:noteColor,
          owner:userId,
          ts:Date.now(),
          updatedAt:Date.now(),
          pinned:false
        });
      });

      showToast("Note saved");

    }

    setTitle("");
    setBody("");
    setTag("");
    setNoteColor(COLORS[0]);
    setEditId(null);
  };

  const startEdit = (n)=>{

    setTitle(n.title);
    setBody(n.body || "");
    setTag(n.tag || "");
    setNoteColor(n.color || COLORS[0]);
    setEditId(n.id);
    setSelected(null);

    window.scrollTo({
      top:0,
      behavior:"smooth"
    });
  };

  const remove = (id)=>{

    update(d=>{
      d.notes = d.notes.filter(x=>x.id !== id);
    });

    setSelected(null);
    showToast("Note deleted");
  };

  const pinNote = (id)=>{

    update(d=>{
      const n = d.notes.find(x=>x.id===id);
      if(n) n.pinned = !n.pinned;
    });
  };

  let notes = [...(data.notes || [])];

  if(filter !== "all"){
    notes = notes.filter(n=>n.owner===filter);
  }

  if(search.trim()){
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body?.toLowerCase().includes(search.toLowerCase()) ||
      n.tag?.toLowerCase().includes(search.toLowerCase())
    );
  }

  notes.sort((a,b)=>
    (b.pinned?1:0)-(a.pinned?1:0) ||
    (b.updatedAt||b.ts)-(a.updatedAt||a.ts)
  );

  const viewNote = selected
    ? data.notes.find(x=>x.id===selected)
    : null;

  return (
    <div>
      <h2>Shared Notes</h2>

      <input
        placeholder="Note title"
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write note"
        value={body}
        onChange={e=>setBody(e.target.value)}
      />

      <input
        placeholder="Tag"
        value={tag}
        onChange={e=>setTag(e.target.value)}
      />

      <button onClick={save}>
        {editId ? "Save Changes" : "Save Note"}
      </button>

      <hr/>

      {notes.map(n=>(
        <div key={n.id} style={{marginBottom:10}}>
          <h4>{n.title}</h4>
          <p>{n.body}</p>

          <button onClick={()=>startEdit(n)}>Edit</button>
          <button onClick={()=>remove(n.id)}>Delete</button>
          <button onClick={()=>pinNote(n.id)}>Pin</button>
        </div>
      ))}

    </div>
  );
}



// ---------- GOALS VIEW ----------


function GoalsView({ data, update, userId, showToast }) {

  const [text,setText] = React.useState("");
  const [deadline,setDeadline] = React.useState("");

  const addGoal = ()=>{

    if(!text.trim()){
      showToast("Write a goal","error");
      return;
    }

    update(d=>{

      if(!d.goals[userId]){
        d.goals[userId] = [];
      }

      d.goals[userId].push({
        id:Date.now(),
        text:text.trim(),
        done:false,
        deadline,
        ts:Date.now(),
        completedAt:null
      });

    });

    setText("");
    setDeadline("");

    showToast("Goal added");
  };


  const toggle = (id)=>{

    update(d=>{

      const g = d.goals[userId]?.find(x=>x.id===id);

      if(g){
        g.done = !g.done;
        g.completedAt = g.done ? Date.now() : null;
      }

    });
  };


  const remove = (id)=>{

    update(d=>{
      d.goals[userId] =
        d.goals[userId]?.filter(x=>x.id!==id) || [];
    });

    showToast("Goal removed");
  };


  const goals = data.goals[userId] || [];

  return (
    <div>

      <h2>Goals</h2>

      <input
        placeholder="Goal"
        value={text}
        onChange={e=>setText(e.target.value)}
      />

      <input
        type="date"
        value={deadline}
        onChange={e=>setDeadline(e.target.value)}
      />

      <button onClick={addGoal}>
        Add Goal
      </button>

      <hr/>

      {goals.map(g=>(
        <div key={g.id}>

          <span
            style={{
              textDecoration: g.done
                ? "line-through"
                : "none"
            }}
          >
            {g.text}
          </span>

          <button onClick={()=>toggle(g.id)}>
            ✓
          </button>

          <button onClick={()=>remove(g.id)}>
            ×
          </button>

        </div>
      ))}

    </div>
  );
            }
