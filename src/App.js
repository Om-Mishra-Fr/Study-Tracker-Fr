// ===============================================================
// STUDYBUDDY — SEGMENT 1 of 5
// Imports · Storage · Default Data · Global Styles
// ===============================================================

import { useState, useEffect, useRef, useCallback } from "react";

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
