BASE64=$(base64 /mnt/user-data/uploads/ecc480c5-08ac-423d-9390-dd81c96db3ed.png | tr -d '\n')
cat > /tmp/final_app.jsx << JSXSTART
import { useState, useRef, useCallback } from "react";

const LOGO_SRC = "data:image/png;base64,${BASE64}";

const C = {
  purple: "#bf59d8", blue: "#07049e", white: "#ffffff",
  grad: "linear-gradient(135deg, #bf59d8 0%, #7b2fd4 50%, #07049e 100%)",
  gradSoft: "linear-gradient(135deg, rgba(191,89,216,0.10) 0%, rgba(7,4,158,0.10) 100%)",
};

const Logo = ({ size=48 }) => (
  <img src={LOGO_SRC} alt="رفيق" width={size} height={size} style={{objectFit:"contain"}}/>
);

const EMOTION_WHEEL = [
  {core:"فرح",color:"#FFD700",emoji:"😊",positive:true,sub:["سعادة","امتنان","ثقة","إلهام","فخر","بهجة","حماس","نشاط"]},
  {core:"حب",color:"#FF69B4",emoji:"🩷",positive:true,sub:["قبول","تعاطف","تقدير","ود","تعلق","دفء","اهتمام","حنان"]},
  {core:"مفاجأة",color:"#00CED1",emoji:"😲",positive:true,sub:["دهشة","ذهول","فضول","ارتباك","إثارة","انبهار","تساؤل","توقع"]},
  {core:"خوف",color:"#9B59B6",emoji:"😨",positive:false,sub:["قلق","توتر","خشية","ذعر","تردد","وجل","شك","إحجام"]},
  {core:"حزن",color:"#4169E1",emoji:"😢",positive:false,sub:["خسارة","وحدة","يأس","ندم","خيبة","ألم","ضعف","حزن عميق"]},
  {core:"غضب",color:"#FF4500",emoji:"😤",positive:false,sub:["إحباط","ضيق","حنق","غيظ","توتر","مرارة","كره","تهيج"]},
  {core:"اشمئزاز",color:"#556B2F",emoji:"🤢",positive:false,sub:["رفض","نفور","استياء","ازدراء","ملل","تقزز","إنكار","صد"]},
  {core:"توقع",color:"#FF8C00",emoji:"🤔",positive:null,sub:["اهتمام","يقظة","تركيز","ترقب","أمل","تخطيط","قلق خفي","تساؤل"]},
];

const BODY_AREAS = ["الصدر","الحلق","المعدة","الكتفين","الرأس","اليدين","الظهر","التنفس"];

const RELEASE_ACTIONS = [
  {icon:"🫁",text:"تنفسي بعمق وتخيّلي إن مع كل زفير الشعور ده بيطلع من جسمك شوية شوية"},
  {icon:"🤲",text:"ضعي إيدك على المكان ده وقوليله بهدوء: 'أنا شايفاكِ وأنا هنا'"},
  {icon:"🚶",text:"قومي وامشي ببطء وحسّي بقدميك على الأرض — الحركة بتساعد الجسم يصرّف الطاقة"},
  {icon:"💨",text:"هزّي جسمك بلطف زي ما بتهزّي الماية عن إيدك — الجسم بيعرف يحرر لو سمحتيله"},
  {icon:"✍️",text:"اكتبي الشعور ده على ورقة بكل تفاصيله من غير رقابة — بعدين قدّري تحرقيها أو ترميها"},
];

const MODIFY_ACTIONS = [
  {icon:"💭",text:"فكّري في لحظة حسيتِ فيها بأمان حقيقي — وحاولي تستشعري نفس الإحساس ده دلوقتي في جسمك"},
  {icon:"🌿",text:"روحي للنافذة أو البرّا وخدي 3 أنفاس عميقة — الهواء الطبيعي بيغيّر كيمياء الجسم فعلاً"},
  {icon:"🎵",text:"شغّلي أغنية بتريّحك وسيبي نفسك تحسيها في جسمك"},
  {icon:"💌",text:"ابعتي رسالة لشخص بتحبيه — التواصل بيكسر دايرة الشعور السلبي"},
  {icon:"🧊",text:"اغسلي وشك بمية باردة — الإحساس الحسي بيساعد الجسم يعيد التوازن"},
];

const EXPAND_ACTIONS = [
  {icon:"🌸",text:"خدي نفس عميق وتخيّلي إن الشعور ده بيتمدد مع كل شهيق ويملا صدرك ثم جسمك كله"},
  {icon:"✍️",text:"اكتبي 3 أشياء صغيرة بتشكريها دلوقتي — الامتنان بيوسّع الشعور الكويس في الجسم"},
  {icon:"📞",text:"شاركي الشعور ده مع شخص بتحبيه — المشاركة بتضاعفه"},
  {icon:"🎵",text:"شغّلي أغنية بتفرّحك واتركي جسمك يتحرك معاها بحرية"},
  {icon:"🌿",text:"روحي مكان بتحبيه أو افتحي النافذة وخدي وقتك — الشعور الكويس يستاهل مساحة"},
];

const SYSTEM_PROMPT = "أنتِ رفيق العافية المشاعرية — مرافقة نفسية دافئة وعملية. مهمتك مساعدة المستخدمة تفهم مشاعرها وتستقر نفسياً. تكلمي بنفس لغة المستخدمة. اسألي سؤال واحد فقط في كل رد. أظهري تعاطفاً حقيقياً. لا تشخّصي. ردودك قصيرة ودافئة. خاطبي المستخدمة بصيغة المؤنث دائماً.";

const STORE_KEY = "rafiq_v5";
const load = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)||"{}"); } catch { return {}; } };
const persist = (d) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch {} };
const todayKey = () => new Date().toISOString().slice(0,10);
const DAYS_AR = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const TABS = [{id:"chat",icon:"💬",label:"رفيق"},{id:"track",icon:"📊",label:"تتبع"},{id:"remind",icon:"🔔",label:"تذكير"}];

function callClaude(system, messages) {
  return fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:800, system, messages}),
  }).then(r=>r.json()).then(d=>d.content?.[0]?.text||"...");
}
export default function App() {
  const [tab, setTab] = useState("chat");
  const [data, setData] = useState(load);
  const updateData = useCallback((u) => {
    setData(p => { const n = typeof u==="function"?u(p):{...p,...u}; persist(n); return n; });
  }, []);
  return (
    <div style={{minHeight:"100vh",maxWidth:480,margin:"0 auto",background:"#f7f4ff",fontFamily:"'Cairo','Tajawal',sans-serif",display:"flex",flexDirection:"column",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet"/>
      <div style={{position:"sticky",top:0,zIndex:20,background:C.grad,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 4px 24px rgba(7,4,158,0.28)"}}>
        <div style={{width:46,height:46,borderRadius:"50%",background:"rgba(255,255,255,0.95)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
          <Logo size={42}/>
        </div>
        <div>
          <div style={{color:C.white,fontWeight:900,fontSize:15}}>رفيق العافية المشاعرية</div>
          <div style={{color:"rgba(255,255,255,0.72)",fontSize:10}}>{DAYS_AR[new Date().getDay()]}، {new Date().getDate()} {MONTHS_AR[new Date().getMonth()]}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:72}}>
        {tab==="chat" && <ChatTab data={data} updateData={updateData}/>}
        {tab==="track" && <TrackTab data={data}/>}
        {tab==="remind" && <RemindTab data={data} updateData={updateData}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.white,borderTop:"1px solid rgba(191,89,216,0.18)",display:"flex",zIndex:20}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 0 6px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontFamily:"inherit"}}>
            <span style={{fontSize:20}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:tab===t.id?700:400,color:tab===t.id?C.purple:"#bbb"}}>{t.label}</span>
            {tab===t.id && <div style={{width:4,height:4,borderRadius:"50%",background:C.purple}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
function ChatTab({ data, updateData }) {
  const [phase, setPhase] = useState("core");
  const [coreEmotion, setCoreEmotion] = useState(null);
  const [subEmotion, setSubEmotion] = useState(null);
  const [bodyArea, setBodyArea] = useState(null);
  const [releaseAction, setReleaseAction] = useState(null);
  const [modifyAction, setModifyAction] = useState(null);
  const [expandAction, setExpandAction] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const logMood = (core, sub) => updateData(prev => {
    const t=todayKey(); const moods=prev.moods||{};
    return {...prev,moods:{...moods,[t]:[...(moods[t]||[]),{time:new Date().toLocaleTimeString("ar",{hour:"2-digit",minute:"2-digit"}),mood:sub||core.core,emoji:core.emoji,positive:core.positive}]}};
  });

  const pickCore = (e) => { setCoreEmotion(e); setPhase("sub"); };
  const pickSub = (s) => { setSubEmotion(s); logMood(coreEmotion,s); setPhase("body"); };
  const pickBody = (area) => { setBodyArea(area); setPhase(coreEmotion.positive===false?"allow_neg":"allow_pos"); };
  const goRelease = () => { setReleaseAction(RELEASE_ACTIONS[Math.floor(Math.random()*RELEASE_ACTIONS.length)]); setPhase("release"); };
  const goModify = () => { setModifyAction(MODIFY_ACTIONS[Math.floor(Math.random()*MODIFY_ACTIONS.length)]); setPhase("modify"); };
  const goExpand = () => { setExpandAction(EXPAND_ACTIONS[Math.floor(Math.random()*EXPAND_ACTIONS.length)]); setPhase("expand"); };

  const gotoChat = async (ctx) => {
    setPhase("chat"); setLoading(true);
    try { const r=await callClaude(SYSTEM_PROMPT,[{role:"user",content:ctx}]); setMessages([{role:"assistant",content:r}]); } catch(e) { setMessages([{role:"assistant",content:"معلش في مشكلة تقنية، جربي تاني 🌿"}]); }
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim()||loading) return;
    const txt=input.trim(); setInput("");
    const msgs=[...messages,{role:"user",content:txt}]; setMessages(msgs); setLoading(true);
    try { const r=await callClaude(SYSTEM_PROMPT,msgs); setMessages([...msgs,{role:"assistant",content:r}]); } catch(e) { setMessages([...msgs,{role:"assistant",content:"معلش في مشكلة تقنية، جربي تاني 🌿"}]); }
    setLoading(false);
  };

  const reset = () => { setPhase("core"); setCoreEmotion(null); setSubEmotion(null); setBodyArea(null); setReleaseAction(null); setModifyAction(null); setExpandAction(null); setMessages([]); setInput(""); };

  const Card = ({children,style={}}) => <div style={{background:C.white,borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(191,89,216,0.12)",marginBottom:14,...style}}>{children}</div>;
  const GradBtn = ({onClick,children,style={}}) => <button onClick={onClick} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:C.grad,color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",...style}}>{children}</button>;
  const BackBtn = ({onClick}) => <button onClick={onClick} style={{width:"100%",marginTop:8,padding:"9px",borderRadius:14,border:"none",background:"transparent",color:"#bbb",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← رجوع</button>;
  if (phase==="core") return (
    <div style={{padding:"24px 20px"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <Logo size={64}/>
        <div style={{fontSize:19,fontWeight:900,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginTop:10}}>إيه اللي بتحسي بيه دلوقتي؟</div>
        <div style={{fontSize:12,color:"#999",marginTop:4}}>اختاري المشاعر الأقرب ليكِ</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {EMOTION_WHEEL.map(e=>(
          <button key={e.core} onClick={()=>pickCore(e)} style={{background:C.white,border:"2px solid transparent",borderRadius:18,padding:"16px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit",boxShadow:"0 2px 12px rgba(191,89,216,0.10)"}}>
            <span style={{fontSize:28}}>{e.emoji}</span>
            <span style={{fontSize:15,fontWeight:700,color:"#2d1a4a"}}>{e.core}</span>
          </button>
        ))}
      </div>
      <button onClick={()=>gotoChat("المستخدمة عايزة تتكلم بحرية. ابدئي بسؤال دافئ.")} style={{width:"100%",marginTop:14,padding:"12px",borderRadius:16,border:"1.5px dashed rgba(191,89,216,0.4)",background:"transparent",color:C.purple,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💬 عايزة أتكلم بحرية</button>
      <div style={{marginTop:14,textAlign:"center",fontSize:11,color:"#ccc"}}>رفيق مش بديل عن المتخصصة 🤍</div>
    </div>
  );

  if (phase==="sub") return (
    <div style={{padding:"24px 20px"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:40}}>{coreEmotion.emoji}</div>
        <div style={{fontSize:17,fontWeight:700,color:"#2d1a4a",marginTop:8}}>أيّ نوع من {coreEmotion.core}؟</div>
        <div style={{fontSize:12,color:"#999",marginTop:4}}>اختاري الأقرب لحاسسك بيه</div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:16}}>
        {coreEmotion.sub.map(s=>(
          <button key={s} onClick={()=>pickSub(s)} style={{padding:"10px 18px",borderRadius:22,border:"2px solid "+coreEmotion.color+"44",background:coreEmotion.color+"12",color:"#2d1a4a",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>{s}</button>
        ))}
      </div>
      <BackBtn onClick={reset}/>
    </div>
  );

  if (phase==="body") return (
    <div style={{padding:"24px 20px"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:36}}>🧠</div>
        <div style={{fontSize:16,fontWeight:700,color:"#2d1a4a",marginTop:8}}>فين حاسة بـ "{subEmotion}" في جسمك؟</div>
        <div style={{fontSize:12,color:"#888",marginTop:6,lineHeight:1.6}}>الجسم بيحتفظ بالمشاعر — خدي لحظة وحاولي تحسي فين بالظبط</div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:16}}>
        {BODY_AREAS.map(a=>(
          <button key={a} onClick={()=>pickBody(a)} style={{padding:"10px 18px",borderRadius:22,border:"1.5px solid rgba(191,89,216,0.3)",background:"#faf8ff",color:"#2d1a4a",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{a}</button>
        ))}
      </div>
      <BackBtn onClick={()=>setPhase("sub")}/>
    </div>
  );

  if (phase==="allow_neg") return (
    <div style={{padding:"24px 20px"}}>
      <Card>
        <div style={{fontSize:28,textAlign:"center",marginBottom:12}}>🌊</div>
        <div style={{fontSize:15,color:"#2d1a4a",lineHeight:1.9,textAlign:"center",fontWeight:500}}>
          الشعور ده موجود في <strong style={{color:C.purple}}>{bodyArea}</strong> بتاعك.<br/><br/>
          مش لازم تهربي منه.<br/>
          <span style={{color:C.purple,fontWeight:700}}>اسمحي له يكون هناك.</span><br/><br/>
          خدي نفس عميق وحاولي تحسي بالشعور ده في {bodyArea} بدون ما تحكمي عليه.
        </div>
        <GradBtn onClick={goRelease} style={{marginTop:20}}>أنا حاسة بيه في جسمي 🤍 — إيه اللي أعمله؟</GradBtn>
      </Card>
      <BackBtn onClick={()=>setPhase("body")}/>
    </div>
  );

  if (phase==="allow_pos") return (
    <div style={{padding:"24px 20px"}}>
      <Card>
        <div style={{fontSize:28,textAlign:"center",marginBottom:12}}>✨</div>
        <div style={{fontSize:15,color:"#2d1a4a",lineHeight:1.9,textAlign:"center",fontWeight:500}}>
          الشعور الجميل ده موجود في <strong style={{color:C.purple}}>{bodyArea}</strong>.<br/><br/>
          <span style={{color:C.purple,fontWeight:700}}>اسمحي لنفسك تحسيه بالكامل.</span><br/><br/>
          خدي نفس عميق وحاولي تحسي بأثر الشعور ده على جسمك.
        </div>
        <GradBtn onClick={goExpand} style={{marginTop:20}}>حاسة بيه 🌸 — إزاي أوسّعه أكتر؟</GradBtn>
      </Card>
      <BackBtn onClick={()=>setPhase("body")}/>
    </div>
  );

  if (phase==="release") return (
    <div style={{padding:"24px 20px"}}>
      <div style={{fontSize:12,color:"#888",textAlign:"center",marginBottom:12}}>خطوة 1 من 2 — تحرير الشعور</div>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:30}}>{releaseAction.icon}</span>
          <span style={{fontSize:11,background:"rgba(191,89,216,0.15)",color:C.purple,padding:"3px 10px",borderRadius:10,fontWeight:700}}>تحرير</span>
        </div>
        <div style={{fontSize:15,color:"#2d1a4a",lineHeight:1.85,fontWeight:500}}>{releaseAction.text}</div>
      </Card>
      <div style={{display:"flex",gap:10,marginBottom:8}}>
        <button onClick={()=>setReleaseAction(RELEASE_ACTIONS[Math.floor(Math.random()*RELEASE_ACTIONS.length)])} style={{flex:1,padding:"11px",borderRadius:14,border:"1.5px solid rgba(191,89,216,0.3)",background:"transparent",color:C.purple,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 اقتراح تاني</button>
        <button onClick={goModify} style={{flex:1,padding:"11px",borderRadius:14,border:"none",background:C.grad,color:C.white,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>التالي ←</button>
      </div>
      <BackBtn onClick={()=>setPhase("allow_neg")}/>
    </div>
  );
  if (phase==="modify") return (
    <div style={{padding:"24px 20px"}}>
      <div style={{fontSize:12,color:"#888",textAlign:"center",marginBottom:12}}>خطوة 2 من 2 — تعديل الشعور</div>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:30}}>{modifyAction.icon}</span>
          <span style={{fontSize:11,background:C.grad,color:C.white,padding:"3px 10px",borderRadius:10,fontWeight:700}}>تعديل</span>
        </div>
        <div style={{fontSize:15,color:"#2d1a4a",lineHeight:1.85,fontWeight:500}}>{modifyAction.text}</div>
      </Card>
      <div style={{display:"flex",gap:10,marginBottom:8}}>
        <button onClick={()=>setModifyAction(MODIFY_ACTIONS[Math.floor(Math.random()*MODIFY_ACTIONS.length)])} style={{flex:1,padding:"11px",borderRadius:14,border:"1.5px solid rgba(191,89,216,0.3)",background:"transparent",color:C.purple,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 اقتراح تاني</button>
        <button onClick={()=>gotoChat("المستخدمة حاسة بـ "+subEmotion+" في "+bodyArea+". تحدثي معها بدفء.")} style={{flex:1,padding:"11px",borderRadius:14,border:"none",background:C.grad,color:C.white,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💬 أكملي مع رفيق</button>
      </div>
      <BackBtn onClick={()=>setPhase("release")}/>
    </div>
  );

  if (phase==="expand") return (
    <div style={{padding:"24px 20px"}}>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:30}}>{expandAction.icon}</span>
          <span style={{fontSize:11,background:C.grad,color:C.white,padding:"3px 10px",borderRadius:10,fontWeight:700}}>توسيع الشعور</span>
        </div>
        <div style={{fontSize:15,color:"#2d1a4a",lineHeight:1.85,fontWeight:500}}>{expandAction.text}</div>
      </Card>
      <div style={{display:"flex",gap:10,marginBottom:8}}>
        <button onClick={()=>setExpandAction(EXPAND_ACTIONS[Math.floor(Math.random()*EXPAND_ACTIONS.length)])} style={{flex:1,padding:"11px",borderRadius:14,border:"1.5px solid rgba(191,89,216,0.3)",background:"transparent",color:C.purple,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 اقتراح تاني</button>
        <button onClick={()=>gotoChat("المستخدمة حاسة بـ "+subEmotion+" في "+bodyArea+". تحدثي معها بدفء.")} style={{flex:1,padding:"11px",borderRadius:14,border:"none",background:C.grad,color:C.white,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💬 أكملي مع رفيق</button>
      </div>
      <BackBtn onClick={()=>setPhase("allow_pos")}/>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 128px)"}}>
      <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-start":"flex-end"}}>
            {m.role==="assistant" && <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.95)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:8,flexShrink:0,alignSelf:"flex-end"}}><Logo size={26}/></div>}
            <div style={{maxWidth:"78%",padding:"10px 14px",lineHeight:1.8,fontSize:14,borderRadius:m.role==="user"?"18px 18px 18px 4px":"18px 18px 4px 18px",background:m.role==="user"?C.grad:C.white,color:m.role==="user"?C.white:"#2d1a4a",boxShadow:"0 2px 10px rgba(191,89,216,0.12)"}}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.95)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:8}}><Logo size={26}/></div>
            <div style={{background:C.white,padding:"12px 16px",borderRadius:"18px 18px 4px 18px"}}>
              <span style={{display:"flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:7,height:7,borderRadius:"50%",background:C.purple,display:"inline-block",animation:"bonce 1.2s infinite",animationDelay:i*0.2+"s"}}/>)}</span>
              <style>{"@keyframes bonce{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-6px);opacity:1}}"}</style>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"10px 14px 12px",background:C.white,borderTop:"1px solid rgba(191,89,216,0.12)",display:"flex",gap:8}}>
        <button onClick={reset} style={{background:C.gradSoft,border:"none",borderRadius:12,padding:"0 12px",cursor:"pointer",fontSize:15}}>🔄</button>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="اكتبي هنا..." rows={1} style={{flex:1,border:"1.5px solid rgba(191,89,216,0.28)",borderRadius:18,padding:"10px 14px",fontSize:14,fontFamily:"inherit",background:"#faf8ff",color:"#2d1a4a",outline:"none",resize:"none",direction:"rtl"}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{width:42,height:42,borderRadius:"50%",background:loading||!input.trim()?"#ddd":C.grad,border:"none",cursor:"pointer",color:C.white,fontSize:17}}>➤</button>
      </div>
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
      <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:18,paddingBottom:4}}>
        {last7.map(k=>{
          const count=moods[k]?.length||0;
          return <button key={k} onClick={()=>setViewDate(k)} style={{flex:"0 0 auto",minWidth:52,padding:"10px 6px",borderRadius:14,border:"2px solid "+(viewDate===k?C.purple:"transparent"),background:viewDate===k?C.gradSoft:C.white,cursor:"pointer",textAlign:"center",fontFamily:"inherit"}}>
            <div style={{fontSize:10,color:"#888"}}>{dayLbl(k)}</div>
            <div style={{fontSize:18,margin:"4px 0"}}>{count>0?"🫧":"○"}</div>
            <div style={{fontSize:10,color:C.purple,fontWeight:600}}>{count>0?count:"-"}</div>
          </button>;
        })}
      </div>
      <div style={{background:C.white,borderRadius:18,padding:16,marginBottom:14}}>
        <div style={{fontWeight:700,color:"#2d1a4a",marginBottom:12}}>{dayLbl(viewDate)}</div>
        {dMoods.length===0&&<div style={{textAlign:"center",color:"#ccc",padding:"16px 0"}}>مفيش تسجيلات</div>}
        {dMoods.map((m,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f0eaff"}}>
            <span style={{fontSize:22}}>{m.emoji||"🫧"}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:"#2d1a4a"}}>{m.mood}</div>
              <div style={{fontSize:11,color:"#aaa"}}>{m.time}</div>
            </div>
            {m.positive===true&&<span style={{fontSize:11,color:"#6BAA8E",background:"#e8f5ee",padding:"2px 8px",borderRadius:8}}>إيجابي ✨</span>}
            {m.positive===false&&<span style={{fontSize:11,color:C.purple,background:C.gradSoft,padding:"2px 8px",borderRadius:8}}>سلبي 🌊</span>}
          </div>
        ))}
      </div>
      <div style={{background:C.gradSoft,borderRadius:16,padding:14}}>
        <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:8}}>📊 إحصائياتك</div>
        <div style={{display:"flex",gap:8}}>
          {[{label:"اليوم",val:dMoods.length},{label:"أيام نشطة",val:Object.keys(moods).length},{label:"إجمالي",val:Object.values(moods).flat().length}].map(s=>(
            <div key={s.label} style={{flex:1,textAlign:"center",background:C.white,borderRadius:12,padding:"10px 4px"}}>
              <div style={{fontSize:20,fontWeight:900,color:C.purple}}>{s.val}</div>
              <div style={{fontSize:10,color:"#888"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function RemindTab({ data, updateData }) {
  const [time, setTime] = useState("09:00");
  const [msg, setMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const reminders=data.reminders||[];
  const QUICK=["وقت تسجّلي مشاعرك مع رفيق 🌿","كيف أنتِ دلوقتي؟ 💜","خدي نفس وافتكري إنك مهمة 🌸"];
  const add=()=>{if(!time)return;updateData(p=>({...p,reminders:[...(p.reminders||[]),{id:Date.now(),time,msg:msg||QUICK[0],active:true}]}));setMsg("");setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const del=id=>updateData(p=>({...p,reminders:(p.reminders||[]).filter(r=>r.id!==id)}));
  return (
    <div style={{padding:"20px"}}>
      <div style={{textAlign:"center",marginBottom:18,fontSize:18,fontWeight:700,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>التذكيرات اليومية</div>
      <div style={{background:C.white,borderRadius:18,padding:16,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <label style={{fontSize:13,color:"#888"}}>الوقت:</label>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} style={{flex:1,border:"1.5px solid rgba(191,89,216,0.3)",borderRadius:10,padding:"8px 12px",fontSize:16,fontFamily:"inherit",outline:"none"}}/>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
          {QUICK.map(q=><button key={q} onClick={()=>setMsg(q)} style={{padding:"5px 10px",borderRadius:10,border:"1px solid "+(msg===q?C.purple:"rgba(191,89,216,0.25)"),background:msg===q?C.gradSoft:"#faf8ff",fontSize:11,cursor:"pointer",fontFamily:"inherit",color:"#2d1a4a"}}>{q}</button>)}
        </div>
        <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="أو اكتبي رسالتك..." style={{width:"100%",border:"1.5px solid rgba(191,89,216,0.3)",borderRadius:10,padding:"9px 12px",fontSize:13,fontFamily:"inherit",background:"#faf8ff",outline:"none",boxSizing:"border-box",direction:"rtl"}}/>
        <button onClick={add} style={{width:"100%",marginTop:12,padding:"12px",borderRadius:14,border:"none",background:C.grad,color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{saved?"✅ اتحفظ!":"🔔 إضافة التذكير"}</button>
      </div>
      {reminders.map(r=>(
        <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px",background:C.white,borderRadius:14,marginBottom:8}}>
          <span style={{fontSize:20}}>🔔</span>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:C.blue}}>{r.time}</div>
            <div style={{fontSize:12,color:"#666"}}>{r.msg}</div>
          </div>
          <button onClick={()=>del(r.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#ccc"}}>✕</button>
        </div>
      ))}
      {reminders.length===0&&<div style={{textAlign:"center",color:"#bbb",fontSize:13,padding:"16px 0"}}>مفيش تذكيرات لسه 🌿</div>}
    </div>
  );
}
JSXSTART
echo "Done! Size: $(wc -c < /tmp/final_app.jsx)"
