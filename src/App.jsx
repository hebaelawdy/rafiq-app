import { useState, useRef, useCallback } from "react";

const C = {
  purple: "#bf59d8",
  blue: "#07049e",
  white: "#ffffff",
  grad: "linear-gradient(135deg, #bf59d8 0%, #7b2fd4 50%, #07049e 100%)",
  gradSoft: "linear-gradient(135deg, rgba(191,89,216,0.10) 0%, rgba(7,4,158,0.10) 100%)",
};

const SYSTEM_PROMPT = `أنتِ "رفيق العافية المشاعرية" — مرافقة نفسية دافئة وعملية. مهمتك مساعدة المستخدمة تفهم مشاعرها وتستقر نفسياً. قواعد: تكلمي بنفس لغة المستخدمة. اسألي سؤال واحد فقط في كل رد. أظهري تعاطفاً حقيقياً. لا تشخصي. ردودك قصيرة ودافئة. خاطبي المستخدمة بصيغة المؤنث دائماً.`;

const QUICK_MOODS = [
  {emoji:"😊",label:"كويسة",positive:true},
  {emoji:"😔",label:"تقيلة",positive:false},
  {emoji:"😤",label:"متوترة",positive:false},
  {emoji:"🥰",label:"ممتنة",positive:true},
  {emoji:"😩",label:"تعبانة",positive:false},
  {emoji:"😶",label:"فاضية",positive:null},
];

const POSITIVE_BOOSTERS = [
  {icon:"💭", text:"فكّري في شخص علّمك حاجة مهمة — لو قدرتِ تشكريه دلوقتي إيه اللي كنتِ هتقوليله؟"},
  {icon:"🎵", text:"شغّلي أغنيتك المفضلة وامشي معاها خطوتين في البيت"},
  {icon:"✨", text:"اكتبي جملة واحدة: 'أنا ممتنة إن...' واملاها بأي حاجة صغيرة"},
  {icon:"🌿", text:"روحي للنافذة تلات دقايق — الضوء الطبيعي بيضاعف الشعور الكويس"},
];

const BODY_AREAS = ["الصدر","الحلق","المعدة","الكتفين","الرأس","اليدين","الظهر","التنفس"];

const NEGATIVE_MODIFIERS = [
  {icon:"💭", text:"خلّي الشعور ده يتكلم — لو كان عنده رسالة إيه اللي كان هيقوله؟"},
  {icon:"🫁", text:"تنفسي بعمق: 4 ثواني شهيق، 4 سكون، 6 زفير — كرري 3 مرات"},
  {icon:"🚶", text:"قومي وامشي ببطء 5 دقايق وخلّي الجسم يصرّف الطاقة دي"},
  {icon:"✍️", text:"اكتبي الشعور ده على ورقة بدون رقابة — ممنوع تعدّلي، بس اكتبي"},
];

const DAYS_AR = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

const STORE_KEY = "rafiq_v4";
const load = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)||"{}"); } catch { return {}; } };
const persist = (d) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch {} };
const todayKey = () => new Date().toISOString().slice(0,10);

const TABS = [
  {id:"chat",icon:"💬",label:"رفيق"},
  {id:"wheel",icon:"🎡",label:"عجلة"},
  {id:"track",icon:"📊",label:"تتبع"},
  {id:"remind",icon:"🔔",label:"تذكير"},
];

export default function App() {
  const [tab, setTab] = useState("chat");
  const [data, setData] = useState(load);
  const updateData = useCallback((u) => {
    setData(p => { const n = typeof u==="function"?u(p):{...p,...u}; persist(n); return n; });
  }, []);

  return (
    <div style={{minHeight:"100vh",maxWidth:480,margin:"0 auto",background:"#f7f4ff",fontFamily:"'Cairo',sans-serif",display:"flex",flexDirection:"column",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"/>
      <div style={{position:"sticky",top:0,zIndex:20,background:C.grad,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 4px 24px rgba(7,4,158,0.28)"}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🌿</div>
        <div>
          <div style={{color:"#fff",fontWeight:900,fontSize:15}}>رفيق العافية المشاعرية</div>
          <div style={{color:"rgba(255,255,255,0.72)",fontSize:10}}>{DAYS_AR[new Date().getDay()]}، {new Date().getDate()} {MONTHS_AR[new Date().getMonth()]}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:72}}>
        {tab==="chat" && <ChatTab data={data} updateData={updateData}/>}
        {tab==="wheel" && <WheelTab data={data} updateData={updateData}/>}
        {tab==="track" && <TrackTab data={data}/>}
        {tab==="remind" && <RemindTab data={data} updateData={updateData}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid rgba(191,89,216,0.18)",display:"flex",zIndex:20}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 0 6px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontFamily:"inherit"}}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:tab===t.id?700:400,color:tab===t.id?C.purple:"#bbb"}}>{t.label}</span>
            {tab===t.id && <div style={{width:4,height:4,borderRadius:"50%",background:C.purple}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

function callClaude(messages) {
  return fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEM_PROMPT,messages}),
  }).then(r=>r.json()).then(d=>d.content?.[0]?.text||"...");
}

function ChatTab({ data, updateData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("pick");
  const [currentMood, setCurrentMood] = useState(null);
  const [negStep, setNegStep] = useState("allow");
  const [bodyArea, setBodyArea] = useState(null);
  const [booster, setBooster] = useState(null);
  const [modifier, setModifier] = useState(null);
  const bottomRef = useRef(null);

  const logMood = (mood) => updateData(prev=>{
    const t=todayKey(); const moods=prev.moods||{};
    return {...prev,moods:{...moods,[t]:[...(moods[t]||[]),{time:new Date().toLocaleTimeString("ar",{hour:"2-digit",minute:"2-digit"}),mood:mood.label,emoji:mood.emoji,positive:mood.positive}]}};
  });

  const pickMood = async (mood) => {
    setCurrentMood(mood); logMood(mood);
    if (mood.positive===true) {
      setBooster(POSITIVE_BOOSTERS[Math.floor(Math.random()*POSITIVE_BOOSTERS.length)]);
      setPhase("booster");
    } else if (mood.positive===false) {
      setNegStep("allow"); setPhase("neg");
    } else {
      setPhase("chat"); setLoading(true);
      try { const r=await callClaude([{role:"user",content:`المستخدمة حاسة بـ "${mood.label}".`}]); setMessages([{role:"assistant",content:r}]); } catch {}
      setLoading(false);
    }
  };

  const gotoChat = async (ctx) => {
    setPhase("chat"); setLoading(true);
    try { const r=await callClaude([{role:"user",content:ctx}]); setMessages([{role:"assistant",content:r}]); } catch {}
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim()||loading) return;
    const txt=input.trim(); setInput("");
    const msgs=[...messages,{role:"user",content:txt}]; setMessages(msgs); setLoading(true);
    try { const r=await callClaude(msgs); setMessages([...msgs,{role:"assistant",content:r}]); } catch {}
    setLoading(false);
  };

  const reset = () => { setMessages([]); setPhase("pick"); setCurrentMood(null); setNegStep("allow"); setBooster(null); setModifier(null); setBodyArea(null); };

  if (phase==="pick") return (
    <div style={{padding:"24px 20px"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:19,fontWeight:900,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>إيه اللي بتحسي بيه دلوقتي؟</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
        {QUICK_MOODS.map(m=>(
          <button key={m.label} onClick={()=>pickMood(m)} style={{background:C.gradSoft,border:"1.5px solid rgba(191,89,216,0.22)",borderRadius:18,padding:"15px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,fontFamily:"inherit"}}>
            <span style={{fontSize:28}}>{m.emoji}</span>
            <span style={{fontSize:12,color:C.blue,fontWeight:600}}>{m.label}</span>
          </button>
        ))}
      </div>
      <button onClick={()=>gotoChat("المستخدمة عايزة تتكلم بحرية.")} style={{width:"100%",padding:"12px",borderRadius:16,border:"1.5px dashed rgba(191,89,216,0.4)",background:"transparent",color:C.purple,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
        💬 عايزة أتكلم بحرية
      </button>
    </div>
  );

  if (phase==="booster") return (
    <div style={{padding:"24px 20px"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:44}}>{currentMood.emoji}</div>
        <div style={{fontSize:17,fontWeight:700,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginTop:8}}>جميل إنك حاسة بـ {currentMood.label} 🌟</div>
      </div>
      <div style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(191,89,216,0.12)",marginBottom:14}}>
        <span style={{fontSize:28}}>{booster.icon}</span>
        <div style={{fontSize:15,color:"#2d1a4a",lineHeight:1.85,marginTop:8}}>{booster.text}</div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setBooster(POSITIVE_BOOSTERS[Math.floor(Math.random()*POSITIVE_BOOSTERS.length)])} style={{flex:1,padding:"12px",borderRadius:14,border:"1.5px solid rgba(191,89,216,0.3)",background:"transparent",color:C.purple,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 اقتراح تاني</button>
        <button onClick={()=>gotoChat(`المستخدمة حاسة بـ "${currentMood.label}".`)} style={{flex:1,padding:"12px",borderRadius:14,border:"none",background:C.grad,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💬 أكملي مع رفيق</button>
      </div>
      <button onClick={reset} style={{width:"100%",marginTop:10,padding:"9px",borderRadius:14,border:"none",background:"transparent",color:"#bbb",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← رجوع</button>
    </div>
  );

  if (phase==="neg") return (
    <div style={{padding:"24px 20px"}}>
      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:40}}>{currentMood.emoji}</div>
        <div style={{fontSize:16,fontWeight:700,color:"#2d1a4a",marginTop:8}}>{currentMood.label}...</div>
      </div>
      {negStep==="allow" && (
        <div style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(191,89,216,0.12)"}}>
          <div style={{fontSize:26,textAlign:"center",marginBottom:12}}>🌊</div>
          <div style={{fontSize:15,color:"#2d1a4a",lineHeight:1.9,textAlign:"center"}}>مش لازم تهربي من الشعور ده.<br/><span style={{color:C.purple,fontWeight:700}}>اسمحي لنفسك تحسيه.</span><br/>هو مش عدوك — هو رسالة.</div>
          <button onClick={()=>setNegStep("body")} style={{width:"100%",marginTop:18,padding:"13px",borderRadius:14,border:"none",background:C.grad,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>تمام، أنا هنا مع نفسي 🤍</button>
        </div>
      )}
      {negStep==="body" && (
        <div style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(191,89,216,0.12)"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#2d1a4a",marginBottom:10,textAlign:"center"}}>🧠 فين حاسة بالشعور ده في جسمك؟</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {BODY_AREAS.map(a=>(
              <button key={a} onClick={()=>setBodyArea(a)} style={{padding:"8px 16px",borderRadius:20,border:`1.5px solid ${bodyArea===a?C.purple:"rgba(191,89,216,0.25)"}`,background:bodyArea===a?C.gradSoft:"#faf8ff",color:"#2d1a4a",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{a}</button>
            ))}
          </div>
          {bodyArea && <button onClick={()=>{setModifier(NEGATIVE_MODIFIERS[Math.floor(Math.random()*NEGATIVE_MODIFIERS.length)]);setNegStep("modify");}} style={{width:"100%",marginTop:16,padding:"13px",borderRadius:14,border:"none",background:C.grad,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>حاسة بيه في {bodyArea} ← شوفي اقتراح</button>}
        </div>
      )}
      {negStep==="modify" && modifier && (
        <div>
          <div style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(191,89,216,0.12)",marginBottom:12}}>
            <span style={{fontSize:28}}>{modifier.icon}</span>
            <div style={{fontSize:15,color:"#2d1a4a",lineHeight:1.85,marginTop:8}}>{modifier.text}</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setModifier(NEGATIVE_MODIFIERS[Math.floor(Math.random()*NEGATIVE_MODIFIERS.length)])} style={{flex:1,padding:"11px",borderRadius:14,border:"1.5px solid rgba(191,89,216,0.3)",background:"transparent",color:C.purple,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 اقتراح تاني</button>
            <button onClick={()=>gotoChat(`المستخدمة حاسة بـ "${currentMood.label}" وحاسة بيه في "${bodyArea}".`)} style={{flex:1,padding:"11px",borderRadius:14,border:"none",background:C.grad,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💬 أكملي مع رفيق</button>
          </div>
          <button onClick={reset} style={{width:"100%",marginTop:10,padding:"9px",borderRadius:14,border:"none",background:"transparent",color:"#bbb",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← رجوع</button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 128px)"}}>
      <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-start":"flex-end"}}>
            <div style={{maxWidth:"78%",padding:"10px 14px",lineHeight:1.8,fontSize:14,borderRadius:m.role==="user"?"18px 18px 18px 4px":"18px 18px 4px 18px",background:m.role==="user"?C.grad:"#fff",color:m.role==="user"?"#fff":"#2d1a4a",boxShadow:"0 2px 10px rgba(191,89,216,0.12)"}}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:"#fff",padding:"12px 16px",borderRadius:"18px 18px 4px 18px"}}>...</div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"10px 14px 12px",background:"#fff",borderTop:"1px solid rgba(191,89,216,0.12)",display:"flex",gap:8}}>
        <button onClick={reset} style={{background:C.gradSoft,border:"none",borderRadius:12,padding:"0 12px",cursor:"pointer",fontSize:15}}>🔄</button>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="اكتبي هنا..." rows={1} style={{flex:1,border:"1.5px solid rgba(191,89,216,0.28)",borderRadius:18,padding:"10px 14px",fontSize:14,fontFamily:"inherit",background:"#faf8ff",color:"#2d1a4a",outline:"none",resize:"none",direction:"rtl"}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{width:42,height:42,borderRadius:"50%",background:loading||!input.trim()?"#ddd":C.grad,border:"none",cursor:"pointer",color:"#fff",fontSize:17}}>➤</button>
      </div>
    </div>
  );
}

function WheelTab({ updateData }) {
  const EMOTION_WHEEL = [
    {core:"فرح",color:"#FFD700",emoji:"😊",positive:true,sub:["سعادة","امتنان","ثقة","فخر","بهجة","حماس"]},
    {core:"حب",color:"#FF69B4",emoji:"🩷",positive:true,sub:["قبول","تعاطف","تقدير","ود","دفء","حنان"]},
    {core:"خوف",color:"#9B59B6",emoji:"😨",positive:false,sub:["قلق","توتر","خشية","تردد","شك","وجل"]},
    {core:"حزن",color:"#4169E1",emoji:"😢",positive:false,sub:["خسارة","وحدة","يأس","ندم","ألم","ضعف"]},
    {core:"غضب",color:"#FF4500",emoji:"😤",positive:false,sub:["إحباط","ضيق","حنق","غيظ","مرارة","تهيج"]},
    {core:"توقع",color:"#FF8C00",emoji:"🤔",positive:null,sub:["اهتمام","ترقب","أمل","تركيز","تساؤل","يقظة"]},
  ];
  const [sel, setSel] = useState(null);
  const [sub, setSub] = useState(null);
  const [saved, setSaved] = useState(false);
  const saveW = () => {
    updateData(prev=>{
      const t=todayKey(); const moods=prev.moods||{};
      return {...prev,moods:{...moods,[t]:[...(moods[t]||[]),{time:new Date().toLocaleTimeString("ar",{hour:"2-digit",minute:"2-digit"}),mood:sub,emoji:sel.emoji,positive:sel.positive}]}};
    });
    setSaved(true);
  };
  return (
    <div style={{padding:"20px"}}>
      <div style={{textAlign:"center",marginBottom:18,fontSize:18,fontWeight:700,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>عجلة المشاعر</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {EMOTION_WHEEL.map(e=>(
          <button key={e.core} onClick={()=>{setSel(e);setSub(null);setSaved(false);}} style={{padding:"11px 10px",borderRadius:14,border:`2px solid ${sel?.core===e.core?e.color:"transparent"}`,background:sel?.core===e.core?`${e.color}18`:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
            <span style={{fontSize:22}}>{e.emoji}</span>
            <span style={{fontSize:14,fontWeight:600,color:"#2d1a4a"}}>{e.core}</span>
          </button>
        ))}
      </div>
      {sel && (
        <div style={{background:"#fff",borderRadius:18,padding:16}}>
          <div style={{fontSize:13,color:"#888",marginBottom:10,textAlign:"center"}}>أيّ نوع من {sel.emoji} {sel.core}؟</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {sel.sub.map(s=>(
              <button key={s} onClick={()=>{setSub(s);setSaved(false);}} style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${sub===s?sel.color:"rgba(191,89,216,0.2)"}`,background:sub===s?`${sel.color}18`:"#faf8ff",color:"#2d1a4a",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{s}</button>
            ))}
          </div>
          {sub&&!saved && <button onClick={saveW} style={{display:"block",width:"100%",marginTop:14,padding:"11px",borderRadius:14,border:"none",background:C.grad,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💾 احفظي "{sub}" في يومك</button>}
          {saved && <div style={{textAlign:"center",marginTop:12,color:"#6BAA8E"}}>✅ اتحفظ!</div>}
        </div>
      )}
    </div>
  );
}

function TrackTab({ data }) {
  const [viewDate, setViewDate] = useState(todayKey());
  const moods=data.moods||{};
  const dMoods=moods[viewDate]||[];
  const last7=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return d.toISOString().slice(0,10);}).reverse();
  const dayLbl=k=>{const d=new Date(k+"T12:00:00");return k===todayKey()?"اليوم":DAYS_AR[d.getDay()];};
  return (
    <div style={{padding:"20px"}}>
      <div style={{textAlign:"center",marginBottom:18,fontSize:18,fontWeight:700,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>تتبع المشاعر</div>
      <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:18}}>
        {last7.map(k=>{
          const count=moods[k]?.length||0;
          return <button key={k} onClick={()=>setViewDate(k)} style={{flex:"0 0 auto",minWidth:52,padding:"10px 6px",borderRadius:14,border:`2px solid ${viewDate===k?C.purple:"transparent"}`,background:viewDate===k?C.gradSoft:"#fff",cursor:"pointer",textAlign:"center",fontFamily:"inherit"}}>
            <div style={{fontSize:10,color:"#888"}}>{dayLbl(k)}</div>
            <div style={{fontSize:18,margin:"4px 0"}}>{count>0?"🫧":"○"}</div>
            <div style={{fontSize:10,color:C.purple,fontWeight:600}}>{count>0?count:"-"}</div>
          </button>;
        })}
      </div>
      <div style={{background:"#fff",borderRadius:18,padding:16}}>
        <div style={{fontWeight:700,color:"#2d1a4a",marginBottom:12}}>{dayLbl(viewDate)}</div>
        {dMoods.length===0 && <div style={{textAlign:"center",color:"#ccc",padding:"16px 0"}}>مفيش تسجيلات</div>}
        {dMoods.map((m,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f0eaff"}}>
            <span style={{fontSize:22}}>{m.emoji||"🫧"}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:"#2d1a4a"}}>{m.mood}</div>
              <div style={{fontSize:11,color:"#aaa"}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RemindTab({ data, updateData }) {
  const [time, setTime] = useState("09:00");
  const [msg, setMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const reminders=data.reminders||[];
  const add=()=>{if(!time)return;updateData(p=>({...p,reminders:[...(p.reminders||[]),{id:Date.now(),time,msg:msg||"وقت تسجّلي مشاعرك مع رفيق 🌿",active:true}]}));setMsg("");setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const del=id=>updateData(p=>({...p,reminders:(p.reminders||[]).filter(r=>r.id!==id)}));
  return (
    <div style={{padding:"20px"}}>
      <div style={{textAlign:"center",marginBottom:18,fontSize:18,fontWeight:700,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>التذكيرات اليومية</div>
      <div style={{background:"#fff",borderRadius:18,padding:16,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <label style={{fontSize:13,color:"#888"}}>الوقت:</label>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} style={{flex:1,border:"1.5px solid rgba(191,89,216,0.3)",borderRadius:10,padding:"8px 12px",fontSize:16,fontFamily:"inherit",outline:"none"}}/>
        </div>
        <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="رسالة التذكير..." style={{width:"100%",border:"1.5px solid rgba(191,89,216,0.3)",borderRadius:10,padding:"9px 12px",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",direction:"rtl"}}/>
        <button onClick={add} style={{width:"100%",marginTop:12,padding:"12px",borderRadius:14,border:"none",background:C.grad,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{saved?"✅ اتحفظ!":"🔔 إضافة التذكير"}</button>
      </div>
      {reminders.map(r=>(
        <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px",background:"#fff",borderRadius:14,marginBottom:8}}>
          <span style={{fontSize:18}}>🔔</span>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:C.blue}}>{r.time}</div>
            <div style={{fontSize:12,color:"#666"}}>{r.msg}</div>
          </div>
          <button onClick={()=>del(r.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#ccc"}}>✕</button>
        </div>
      ))}
    </div>
  );
}
