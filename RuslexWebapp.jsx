import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════

const PRIVACY_URL = "https://alzergawi.github.io/ruslex-privacy-policy/";

// ══════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════

const WORDS = [
  {id:1,word:"привет",pos:"intj",level:"A1",meaning_ar:"مرحبا، أهلاً",meaning_en:"Hi, Hello",ipa:"[prʲɪˈvʲet]",categoryId:1},
  {id:2,word:"мир",pos:"noun",level:"A1",meaning_ar:"عالم، سلام",meaning_en:"World, Peace",ipa:"[mʲir]",categoryId:1},
  {id:3,word:"любовь",pos:"noun",level:"A2",meaning_ar:"حب، محبة",meaning_en:"Love",ipa:"[lʲʉˈbofʲ]",categoryId:2},
  {id:4,word:"работать",pos:"verb",level:"A1",meaning_ar:"يعمل",meaning_en:"To work",ipa:"[ˈrabətətʲ]",categoryId:3,conjugation:{pres1sg:"работаю",pres2sg:"работаешь",pres3sg:"работает",pres1pl:"работаем",pres2pl:"работаете",pres3pl:"работают",pastM:"работал",pastF:"работала"}},
  {id:5,word:"красивый",pos:"adj",level:"A1",meaning_ar:"جميل، رائع",meaning_en:"Beautiful",ipa:"[krɐˈsʲivɨj]",categoryId:4},
  {id:6,word:"говорить",pos:"verb",level:"A1",meaning_ar:"يتكلم، يقول",meaning_en:"To speak, to say",ipa:"[ɡəvɐˈrʲitʲ]",categoryId:3,conjugation:{pres1sg:"говорю",pres2sg:"говоришь",pres3sg:"говорит",pres1pl:"говорим",pres2pl:"говорите",pres3pl:"говорят",pastM:"говорил",pastF:"говорила"}},
  {id:7,word:"большой",pos:"adj",level:"A1",meaning_ar:"كبير",meaning_en:"Big, Large",ipa:"[bɐlʲˈʂoj]",categoryId:4},
  {id:8,word:"хорошо",pos:"adv",level:"A1",meaning_ar:"جيداً، بخير",meaning_en:"Good, Well",ipa:"[xərɐˈʂo]",categoryId:4},
  {id:9,word:"понимать",pos:"verb",level:"A1",meaning_ar:"يفهم",meaning_en:"To understand",ipa:"[pənʲɪˈmatʲ]",categoryId:3,conjugation:{pres1sg:"понимаю",pres2sg:"понимаешь",pres3sg:"понимает",pres1pl:"понимаем",pres2pl:"понимаете",pres3pl:"понимают",pastM:"понимал",pastF:"понимала"}},
  {id:10,word:"спасибо",pos:"intj",level:"A1",meaning_ar:"شكراً",meaning_en:"Thank you",ipa:"[spɐˈsʲibə]",categoryId:1},
  {id:11,word:"дом",pos:"noun",level:"A1",meaning_ar:"بيت، منزل",meaning_en:"House, Home",ipa:"[dom]",categoryId:5,declension:{nom:"дом",gen:"дома",dat:"дому",acc:"дом",inst:"домом",prep:"доме",nomPl:"дома",genPl:"домов"}},
  {id:12,word:"время",pos:"noun",level:"A2",meaning_ar:"وقت، زمن",meaning_en:"Time",ipa:"[ˈvrʲemʲə]",categoryId:1},
  {id:13,word:"учить",pos:"verb",level:"A1",meaning_ar:"يتعلم، يدرس",meaning_en:"To learn, to study",ipa:"[ʊˈtʲitʲ]",categoryId:3,conjugation:{pres1sg:"учу",pres2sg:"учишь",pres3sg:"учит",pres1pl:"учим",pres2pl:"учите",pres3pl:"учат",pastM:"учил",pastF:"учила"}},
  {id:14,word:"книга",pos:"noun",level:"A1",meaning_ar:"كتاب",meaning_en:"Book",ipa:"[ˈknʲiɡə]",categoryId:6,declension:{nom:"книга",gen:"книги",dat:"книге",acc:"книгу",inst:"книгой",prep:"книге",nomPl:"книги",genPl:"книг"}},
  {id:15,word:"вода",pos:"noun",level:"A1",meaning_ar:"ماء",meaning_en:"Water",ipa:"[vɐˈda]",categoryId:5,declension:{nom:"вода",gen:"воды",dat:"воде",acc:"воду",inst:"водой",prep:"воде",nomPl:"воды",genPl:"вод"}},
  {id:16,word:"жизнь",pos:"noun",level:"A2",meaning_ar:"حياة",meaning_en:"Life",ipa:"[ʐɨzʲnʲ]",categoryId:2},
  {id:17,word:"друг",pos:"noun",level:"A1",meaning_ar:"صديق",meaning_en:"Friend",ipa:"[druk]",categoryId:1,declension:{nom:"друг",gen:"друга",dat:"другу",acc:"друга",inst:"другом",prep:"друге",nomPl:"друзья",genPl:"друзей"}},
  {id:18,word:"страна",pos:"noun",level:"A1",meaning_ar:"بلد، دولة",meaning_en:"Country",ipa:"[strɐˈna]",categoryId:7},
  {id:19,word:"язык",pos:"noun",level:"A1",meaning_ar:"لغة، لسان",meaning_en:"Language, Tongue",ipa:"[jɪˈzɨk]",categoryId:6,declension:{nom:"язык",gen:"языка",dat:"языку",acc:"язык",inst:"языком",prep:"языке",nomPl:"языки",genPl:"языков"}},
  {id:20,word:"знать",pos:"verb",level:"A1",meaning_ar:"يعرف",meaning_en:"To know",ipa:"[znatʲ]",categoryId:3,conjugation:{pres1sg:"знаю",pres2sg:"знаешь",pres3sg:"знает",pres1pl:"знаем",pres2pl:"знаете",pres3pl:"знают",pastM:"знал",pastF:"знала"}},
  {id:21,word:"хотеть",pos:"verb",level:"A1",meaning_ar:"يريد، يرغب",meaning_en:"To want",ipa:"[xɐˈtʲetʲ]",categoryId:3,conjugation:{pres1sg:"хочу",pres2sg:"хочешь",pres3sg:"хочет",pres1pl:"хотим",pres2pl:"хотите",pres3pl:"хотят",pastM:"хотел",pastF:"хотела"}},
  {id:22,word:"красота",pos:"noun",level:"A2",meaning_ar:"جمال",meaning_en:"Beauty",ipa:"[krɐˈsota]",categoryId:2},
  {id:23,word:"делать",pos:"verb",level:"A1",meaning_ar:"يفعل، يصنع",meaning_en:"To do, to make",ipa:"[ˈdʲeɫətʲ]",categoryId:3,conjugation:{pres1sg:"делаю",pres2sg:"делаешь",pres3sg:"делает",pres1pl:"делаем",pres2pl:"делаете",pres3pl:"делают",pastM:"делал",pastF:"делала"}},
  {id:24,word:"Россия",pos:"noun",level:"A1",meaning_ar:"روسيا",meaning_en:"Russia",ipa:"[rɐˈsʲijə]",categoryId:7},
  {id:25,word:"маленький",pos:"adj",level:"A1",meaning_ar:"صغير",meaning_en:"Small, Little",ipa:"[ˈmalʲɪnʲkʲɪj]",categoryId:4},
  {id:26,word:"чёрный",pos:"adj",level:"A1",meaning_ar:"أسود",meaning_en:"Black",ipa:"[ˈtɕɵrnɨj]",categoryId:4},
  {id:27,word:"белый",pos:"adj",level:"A1",meaning_ar:"أبيض",meaning_en:"White",ipa:"[ˈbʲelɨj]",categoryId:4},
  {id:28,word:"сегодня",pos:"adv",level:"A1",meaning_ar:"اليوم",meaning_en:"Today",ipa:"[sʲɪˈvodnʲə]",categoryId:1},
  {id:29,word:"завтра",pos:"adv",level:"A1",meaning_ar:"غداً",meaning_en:"Tomorrow",ipa:"[ˈzaftrə]",categoryId:1},
  {id:30,word:"ночь",pos:"noun",level:"A1",meaning_ar:"ليل",meaning_en:"Night",ipa:"[notɕ]",categoryId:1},
];

const CATEGORIES = [
  {id:1,icon:"💬",nameAr:"عبارات يومية",nameEn:"Daily Phrases",nameRu:"Повседневные фразы",color:"#4a9eff",count:8},
  {id:2,icon:"❤️",nameAr:"المشاعر",nameEn:"Emotions",nameRu:"Эмоции",color:"#e91e63",count:5},
  {id:3,icon:"⚡",nameAr:"الأفعال",nameEn:"Verbs",nameRu:"Глаголы",color:"#f44336",count:7},
  {id:4,icon:"✨",nameAr:"الصفات",nameEn:"Adjectives",nameRu:"Прилагательные",color:"#9c27b0",count:5},
  {id:5,icon:"🏠",nameAr:"البيت والمنزل",nameEn:"Home",nameRu:"Дом",color:"#ff9800",count:4},
  {id:6,icon:"📚",nameAr:"التعليم",nameEn:"Education",nameRu:"Образование",color:"#00bcd4",count:3},
  {id:7,icon:"🌍",nameAr:"الجغرافيا",nameEn:"Geography",nameRu:"География",color:"#4caf50",count:2},
  {id:8,icon:"🍕",nameAr:"الطعام",nameEn:"Food",nameRu:"Еда",color:"#d4af37",count:0},
  {id:9,icon:"👨‍👩‍👧",nameAr:"العائلة",nameEn:"Family",nameRu:"Семья",color:"#ff6b35",count:0},
  {id:10,icon:"🏥",nameAr:"الصحة",nameEn:"Health",nameRu:"Здоровье",color:"#00e676",count:0},
];

const DECL_LESSONS = [
  {case:"nominative",color:"#2196f3",titleAr:"حالة الرفع — Именительный",question:"من؟ ما؟",desc:"الاسم في أصل صورته — يستخدم للفاعل في الجملة",examples:[{ru:"Это стол.",ar:"هذه طاولة."},{ru:"Анна красивая.",ar:"آنا جميلة."}],endings:[{gender:"مذكر",sg:"-",pl:"-ы/-и"},{gender:"مؤنث",sg:"-а/-я",pl:"-ы/-и"},{gender:"محايد",sg:"-о/-е",pl:"-а/-я"}]},
  {case:"genitive",color:"#e91e63",titleAr:"المضاف إليه — Родительный",question:"من؟ لمن؟ (ملكية/نفي)",desc:"يدل على الملكية والانتماء، مع النفي وبعض الأعداد",examples:[{ru:"Книга студента.",ar:"كتاب الطالب."},{ru:"Нет воды.",ar:"لا يوجد ماء."}],endings:[{gender:"مذكر",sg:"-а/-я",pl:"-ов/-ей"},{gender:"مؤنث",sg:"-ы/-и",pl:"-"},{gender:"محايد",sg:"-а/-я",pl:"-"}]},
  {case:"dative",color:"#4caf50",titleAr:"المفعول غير المباشر — Дательный",question:"لمن؟ لما؟",desc:"المفعول به غير المباشر — «إعطاء» شيء لشخص",examples:[{ru:"Я дал другу книгу.",ar:"أعطيت الكتاب لصديقي."},{ru:"Мне нравится музыка.",ar:"تعجبني الموسيقى."}],endings:[{gender:"مذكر",sg:"-у/-ю",pl:"-ам/-ям"},{gender:"مؤنث",sg:"-е/-и",pl:"-ам/-ям"},{gender:"محايد",sg:"-у/-ю",pl:"-ам/-ям"}]},
  {case:"accusative",color:"#ff9800",titleAr:"حالة النصب — Винительный",question:"من؟ ماذا؟ (مفعول به)",desc:"المفعول به المباشر — الهدف المباشر للفعل",examples:[{ru:"Я вижу дом.",ar:"أرى البيت."},{ru:"Я люблю музыку.",ar:"أحب الموسيقى."}],endings:[{gender:"مذكر(جماد)",sg:"-",pl:"-ы/-и"},{gender:"مذكر(حي)",sg:"-а/-я",pl:"-ов/-ей"},{gender:"مؤنث",sg:"-у/-ю",pl:"-ы/-и"}]},
  {case:"instrumental",color:"#9c27b0",titleAr:"حالة الإفادة — Творительный",question:"بمن؟ بماذا؟",desc:"الأداة أو الوسيلة أو الرفقة",examples:[{ru:"Я пишу ручкой.",ar:"أكتب بالقلم."},{ru:"С другом.",ar:"مع صديق."}],endings:[{gender:"مذكر",sg:"-ом/-ем",pl:"-ами/-ями"},{gender:"مؤنث",sg:"-ой/-ей",pl:"-ами/-ями"},{gender:"محايد",sg:"-ом/-ем",pl:"-ами/-ями"}]},
  {case:"prepositional",color:"#00bcd4",titleAr:"حالة الجر — Предложный",question:"عن من؟ أين؟",desc:"دائماً مع حروف الجر: в، на، о، при",examples:[{ru:"Я думаю о тебе.",ar:"أفكر فيك."},{ru:"Живу в Москве.",ar:"أسكن في موسكو."}],endings:[{gender:"مذكر",sg:"-е/-и",pl:"-ах/-ях"},{gender:"مؤنث",sg:"-е/-и",pl:"-ах/-ях"},{gender:"محايد",sg:"-е/-и",pl:"-ах/-ях"}]},
];

const PREFIXES = [
  {key:"none",prefix:"—",icon:"🚶",color:"#4a9eff",meaningAr:"بدون بادئة — حركة أساسية",pairs:[{sv:"пойти",nsv:"идти",ar:"يذهب (مشياً)",en:"To go (on foot)"},{sv:"поехать",nsv:"ехать",ar:"يذهب (بمركبة)",en:"To go (by vehicle)"},{sv:"полететь",nsv:"летать",ar:"يطير",en:"To fly"}]},
  {key:"при",prefix:"при-",icon:"🏠",color:"#4caf50",meaningAr:"وصول، قدوم",pairs:[{sv:"прийти",nsv:"приходить",ar:"يصل مشياً",en:"To arrive on foot"},{sv:"приехать",nsv:"приезжать",ar:"يصل بمركبة",en:"To arrive by vehicle"},{sv:"прилететь",nsv:"прилетать",ar:"يصل طيراً",en:"To arrive by air"}]},
  {key:"у",prefix:"у-",icon:"🚪",color:"#f44336",meaningAr:"مغادرة، رحيل",pairs:[{sv:"уйти",nsv:"уходить",ar:"يغادر مشياً",en:"To leave on foot"},{sv:"уехать",nsv:"уезжать",ar:"يغادر بمركبة",en:"To leave by vehicle"},{sv:"улететь",nsv:"улетать",ar:"يغادر طيراً",en:"To fly away"}]},
  {key:"вы",prefix:"вы-",icon:"🚀",color:"#ff9800",meaningAr:"خروج من مكان",pairs:[{sv:"выйти",nsv:"выходить",ar:"يخرج مشياً",en:"To exit on foot"},{sv:"выехать",nsv:"выезжать",ar:"يخرج بمركبة",en:"To drive out"},{sv:"вылететь",nsv:"вылетать",ar:"يقلع",en:"To take off"}]},
  {key:"в",prefix:"в-",icon:"🚪",color:"#9c27b0",meaningAr:"دخول إلى مكان",pairs:[{sv:"войти",nsv:"входить",ar:"يدخل مشياً",en:"To enter on foot"},{sv:"въехать",nsv:"въезжать",ar:"يدخل بمركبة",en:"To drive in"},{sv:"влететь",nsv:"влетать",ar:"يدخل طيراً",en:"To fly in"}]},
  {key:"пере",prefix:"пере-",icon:"🌉",color:"#00bcd4",meaningAr:"عبور، انتقال",pairs:[{sv:"перейти",nsv:"переходить",ar:"يعبر مشياً",en:"To cross on foot"},{sv:"переехать",nsv:"переезжать",ar:"يعبر بمركبة",en:"To cross by vehicle"},{sv:"перелететь",nsv:"перелетать",ar:"يعبر طيراً",en:"To fly across"}]},
  {key:"по",prefix:"по-",icon:"🗺️",color:"#d4af37",meaningAr:"بداية حركة",pairs:[{sv:"пойти",nsv:"ходить",ar:"يبدأ بالمشي",en:"Start walking"},{sv:"поехать",nsv:"ездить",ar:"يبدأ بالسفر",en:"Start traveling"},{sv:"побежать",nsv:"бегать",ar:"يبدأ بالجري",en:"Start running"}]},
  {key:"до",prefix:"до-",icon:"🎯",color:"#e91e63",meaningAr:"الوصول إلى نهاية الطريق",pairs:[{sv:"дойти",nsv:"доходить",ar:"يصل مشياً",en:"Reach on foot"},{sv:"доехать",nsv:"доезжать",ar:"يصل بمركبة",en:"Reach by vehicle"},{sv:"долететь",nsv:"долетать",ar:"يصل طيراً",en:"Reach by air"}]},
];

// ══════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════

function getMeaning(w, lang){ return lang==='en' ? w.meaning_en : w.meaning_ar; }
function getPosLabel(pos,lang){
  if(lang==='en') return pos||'';
  const m={noun:"اسم",verb:"فعل",adj:"صفة",adjective:"صفة",adv:"ظرف",adverb:"ظرف",prep:"حرف جر",pron:"ضمير",intj:"تعجب",conj:"أداة ربط",num:"عدد"};
  return m[pos?.toLowerCase()]||pos||'';
}
function getLevelColor(lvl){
  const m={A1:"#4caf50",A2:"#ff9800",B1:"#f44336",B2:"#9c27b0"};
  return m[lvl]||"#4caf50";
}
function getPosColor(pos){
  const m={noun:"#4a9eff",verb:"#f44336",adj:"#9c27b0",adjective:"#9c27b0",adv:"#00bcd4",adverb:"#00bcd4",intj:"#4caf50",prep:"#795548"};
  return m[pos?.toLowerCase()]||"#4caf50";
}
function speak(text){
  if('speechSynthesis' in window){
    const u=new SpeechSynthesisUtterance(text);
    u.lang='ru-RU';u.rate=0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}

// ══════════════════════════════════════════════════
//  SRS STATE
// ══════════════════════════════════════════════════

const initSRS = ()=>({
  cards: WORDS.slice(0,15).map((w,i)=>({...w,srsState:['new','new','learning','review'][Math.floor(Math.random()*3)],due:i%3===0})),
  currentIdx:0,revealed:false,todayReviews:12,streak:5,
});

// ══════════════════════════════════════════════════
//  ANIMATIONS & BACKGROUND
// ══════════════════════════════════════════════════

function AnimBG(){
  return(
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
      <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 70%)",top:"-15%",right:"-15%",animation:"floatOrb 22s ease-in-out infinite",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(74,158,255,0.05) 0%,transparent 70%)",bottom:"5%",left:"-10%",animation:"floatOrb 28s ease-in-out infinite reverse",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(156,39,176,0.04) 0%,transparent 70%)",top:"45%",left:"40%",animation:"floatOrb 18s ease-in-out infinite 5s",filter:"blur(60px)"}}/>
      {/* noise overlay */}
      <div style={{position:"absolute",inset:0,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",opacity:0.3}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  FADE-IN COMPONENT
// ══════════════════════════════════════════════════

function FadeIn({children,delay=0,style={}}){
  const ref=useRef(null);
  const[visible,setVisible]=useState(false);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVisible(true);obs.disconnect();}},{threshold:0.1});
    obs.observe(el);return()=>obs.disconnect();
  },[]);
  return(
    <div ref={ref} style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(30px)",transition:`opacity 0.6s ${delay}s ease,transform 0.6s ${delay}s ease`,width:"100%",boxSizing:"border-box",...style}}>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════
//  CARD COMPONENT
// ══════════════════════════════════════════════════

function Card({children,gold,accent,onClick,style={}}){
  const[hover,setHover]=useState(false);
  const accentColor=accent||"#d4af37";
  return(
    <div
      onClick={onClick}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        background:gold
          ?`linear-gradient(135deg,rgba(212,175,55,0.12) 0%,rgba(15,15,20,0.95) 100%)`
          :"rgba(255,255,255,0.035)",
        border:gold
          ?"1px solid rgba(212,175,55,0.35)"
          :hover&&onClick?"1px solid rgba(255,255,255,0.15)":"1px solid rgba(255,255,255,0.07)",
        borderRadius:20,padding:"24px",
        cursor:onClick?"pointer":"default",
        transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",
        transform:hover&&onClick?"translateY(-5px) scale(1.015)":"none",
        boxShadow:hover&&onClick?`0 16px 50px rgba(0,0,0,0.3),0 0 0 1px ${accentColor}22`:"none",
        backdropFilter:"blur(20px)",
        position:"relative",overflow:"hidden",
        ...style
      }}
    >
      {gold&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#d4af37,transparent)"}}/>}
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════
//  BUTTON COMPONENT
// ══════════════════════════════════════════════════

function Btn({children,primary,outline,ghost,href,onClick,full,small,style={}}){
  const[h,setH]=useState(false);
  const base={
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,
    padding:small?"8px 18px":"13px 28px",
    fontSize:small?13:15,fontWeight:700,fontFamily:"'Tajawal',sans-serif",
    borderRadius:12,cursor:"pointer",transition:"all 0.3s ease",
    textDecoration:"none",border:"none",width:full?"100%":"auto",
    background:primary?(h?"linear-gradient(135deg,#e8c94a,#c9920e)":"linear-gradient(135deg,#d4af37,#b5881a)")
      :outline?"transparent"
      :ghost?(h?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.05)")
      :"transparent",
    color:primary?"#080808":outline?"#fff":"#fff",
    border:outline?"1px solid rgba(212,175,55,0.45)":"none",
    transform:h&&!ghost?"translateY(-2px)":"none",
    boxShadow:h&&primary?"0 8px 28px rgba(212,175,55,0.35)":h&&outline?"0 4px 20px rgba(212,175,55,0.15)":"none",
    ...style
  };
  const Tag=href?"a":"button";
  const extra=href?{href,target:"_blank",rel:"noopener noreferrer"}:{onClick};
  return <Tag {...extra} style={base} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{children}</Tag>;
}

// ══════════════════════════════════════════════════
//  BADGE
// ══════════════════════════════════════════════════

function Badge({children,color="#d4af37",bg}){
  return(
    <span style={{display:"inline-block",padding:"3px 12px",borderRadius:50,fontSize:12,fontWeight:700,background:bg||`${color}22`,color,border:`1px solid ${color}44`,letterSpacing:0.5,fontFamily:"'JetBrains Mono',monospace"}}>
      {children}
    </span>
  );
}

// ══════════════════════════════════════════════════
//  SECTION TITLE
// ══════════════════════════════════════════════════

function SectionTitle({title,sub,icon}){
  return(
    <div style={{textAlign:"center",marginBottom:48}}>
      {icon&&<div style={{fontSize:44,marginBottom:12}}>{icon}</div>}
      <h2 style={{fontSize:"clamp(26px,4vw,36px)",fontWeight:800,color:"#fff",margin:"0 0 12px",fontFamily:"'Tajawal',sans-serif"}}>
        {title}
      </h2>
      {sub&&<p style={{fontSize:15,color:"rgba(255,255,255,0.48)",margin:0,maxWidth:580,marginInline:"auto",lineHeight:1.7}}>{sub}</p>}
      <div style={{width:56,height:2,background:"linear-gradient(90deg,#d4af37,transparent)",margin:"14px auto 0",borderRadius:2}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  STAT BOX
// ══════════════════════════════════════════════════

function StatBox({icon,value,label,color="#d4af37"}){
  return(
    <div style={{textAlign:"center",padding:"18px 12px"}}>
      <div style={{fontSize:30,marginBottom:6}}>{icon}</div>
      <div style={{fontSize:28,fontWeight:900,color,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.1}}>{value}</div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:4,fontFamily:"'Tajawal',sans-serif"}}>{label}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════

function Toast({msg,icon,visible}){
  return(
    <div style={{
      position:"fixed",bottom:28,right:28,zIndex:3000,
      background:"rgba(12,12,18,0.96)",border:"1px solid rgba(212,175,55,0.35)",
      borderRadius:14,padding:"12px 20px",
      display:"flex",alignItems:"center",gap:10,
      fontSize:14,fontWeight:600,color:"#fff",fontFamily:"'Tajawal',sans-serif",
      transform:visible?"translateX(0)":"translateX(120%)",
      transition:"transform 0.4s cubic-bezier(0.4,0,0.2,1)",
      backdropFilter:"blur(16px)",maxWidth:260,boxShadow:"0 8px 30px rgba(0,0,0,0.4)"
    }}>
      <span style={{fontSize:18}}>{icon||"⭐"}</span>
      <span>{msg}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  WORD CARD (for categories list)
// ══════════════════════════════════════════════════

function WordCard({word,lang,favorites,onToggleFav,onOpen}){
  const meaning=getMeaning(word,lang);
  const posColor=getPosColor(word.pos);
  const lvlColor=getLevelColor(word.level);
  const isFav=favorites.has(word.id);
  return(
    <div
      onClick={()=>onOpen(word)}
      style={{
        background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16,padding:"18px 20px",cursor:"pointer",
        transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
        marginBottom:10,
      }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(212,175,55,0.35)";e.currentTarget.style.background="rgba(212,175,55,0.06)";e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.background="rgba(255,255,255,0.035)";e.currentTarget.style.transform="translateY(0)";}}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <span style={{fontSize:20,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:"#fff"}}>{word.word}</span>
            <button onClick={e=>{e.stopPropagation();speak(word.word);}} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",fontSize:15,padding:"0 4px",borderRadius:6,transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#d4af37"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>🔊</button>
          </div>
          {word.ipa&&<div style={{fontSize:12,color:"rgba(212,175,55,0.7)",fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>{word.ipa}</div>}
          <div style={{fontSize:14,color:"rgba(255,255,255,0.65)",lineHeight:1.5}}>{meaning}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
            <Badge color={posColor}>{getPosLabel(word.pos,lang)}</Badge>
            <Badge color={lvlColor}>{word.level}</Badge>
          </div>
        </div>
        <button
          onClick={e=>{e.stopPropagation();onToggleFav(word.id);}}
          style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:4,color:isFav?"#e91e63":"rgba(255,255,255,0.3)",transition:"all 0.25s",flexShrink:0}}
          onMouseEnter={e=>e.currentTarget.style.color="#e91e63"}
          onMouseLeave={e=>e.currentTarget.style.color=isFav?"#e91e63":"rgba(255,255,255,0.3)"}
        >{isFav?"❤️":"🤍"}</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  WORD DETAIL MODAL
// ══════════════════════════════════════════════════

function WordModal({word,lang,favorites,onToggleFav,onClose}){
  const[visible,setVisible]=useState(false);
  useEffect(()=>{
    if(word){setTimeout(()=>setVisible(true),10);}
    else{setVisible(false);}
  },[word]);
  if(!word)return null;
  const meaning=getMeaning(word,lang);
  const isFav=favorites.has(word.id);
  const posColor=getPosColor(word.pos);
  const lvlColor=getLevelColor(word.level);
  return(
    <div
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{
        position:"fixed",inset:0,zIndex:2000,
        background:"rgba(0,0,0,0.8)",backdropFilter:"blur(16px)",
        display:"flex",alignItems:"center",justifyContent:"center",padding:20,
        opacity:visible?1:0,transition:"opacity 0.3s ease"
      }}
    >
      <div style={{
        background:"#0c0c12",border:"1px solid rgba(212,175,55,0.3)",
        borderRadius:24,maxWidth:680,width:"100%",maxHeight:"88vh",overflowY:"auto",
        transform:visible?"translateY(0) scale(1)":"translateY(20px) scale(0.97)",
        transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)"
      }}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,rgba(212,175,55,0.12),rgba(15,15,22,0.9))",padding:"28px 28px 22px",borderBottom:"1px solid rgba(212,175,55,0.2)",borderRadius:"24px 24px 0 0",position:"relative"}}>
          <button onClick={onClose} style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,0.08)",border:"none",color:"#fff",width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.18)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}>✕</button>
          <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:36,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:"#fff"}}>{word.word}</div>
              {word.ipa&&<div style={{fontSize:15,color:"#d4af37",fontFamily:"'JetBrains Mono',monospace",marginTop:3}}>{word.ipa}</div>}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginRight:"auto"}}>
              <button onClick={()=>speak(word.word)} style={{background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.2)",color:"#d4af37",padding:"6px 12px",borderRadius:10,cursor:"pointer",fontSize:16,transition:"all 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(212,175,55,0.2)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(212,175,55,0.1)"}>🔊</button>
              <button onClick={()=>onToggleFav(word.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:isFav?"#e91e63":"rgba(255,255,255,0.4)",transition:"all 0.2s"}}>{isFav?"❤️":"🤍"}</button>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14}}>
            <Badge color={posColor}>{getPosLabel(word.pos,lang)}</Badge>
            <Badge color={lvlColor}>{word.level}</Badge>
          </div>
        </div>
        {/* Body */}
        <div style={{padding:"22px 28px"}}>
          {/* Meanings */}
          <div style={{marginBottom:24}}>
            <div style={{fontSize:12,fontWeight:700,color:"#d4af37",letterSpacing:1,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              المعنى <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(212,175,55,0.3),transparent)"}}/>
            </div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"14px 18px"}}>
              <div style={{marginBottom:6}}>🇸🇦 <span style={{color:"rgba(255,255,255,0.85)",fontSize:15}}>{word.meaning_ar}</span></div>
              <div>🇬🇧 <span style={{color:"rgba(255,255,255,0.6)",fontSize:14}}>{word.meaning_en}</span></div>
            </div>
          </div>
          {/* Conjugation */}
          {word.conjugation&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f44336",letterSpacing:1,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                التصريف <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(244,67,54,0.3),transparent)"}}/>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr>
                      {["الضمير","المضارع","الماضي"].map(h=>(
                        <th key={h} style={{background:"rgba(244,67,54,0.12)",color:"#f44336",padding:"8px 12px",textAlign:"center",border:"1px solid rgba(244,67,54,0.2)",fontSize:11,letterSpacing:0.5}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {pron:"أنا (я)",pres:word.conjugation.pres1sg,past:word.conjugation.pastM},
                      {pron:"أنتَ (ты)",pres:word.conjugation.pres2sg,past:word.conjugation.pastM},
                      {pron:"هو/هي (он/она)",pres:word.conjugation.pres3sg,past:`${word.conjugation.pastM}/${word.conjugation.pastF}`},
                      {pron:"نحن (мы)",pres:word.conjugation.pres1pl,past:"-"},
                      {pron:"أنتم (вы)",pres:word.conjugation.pres2pl,past:"-"},
                      {pron:"هم (они)",pres:word.conjugation.pres3pl,past:"-"},
                    ].map((row,i)=>(
                      <tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",fontSize:12}}>{row.pron}</td>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:"#f44336",textAlign:"center",fontWeight:600}}>{row.pres}</td>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:"rgba(255,255,255,0.6)",textAlign:"center"}}>{row.past}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Declension */}
          {word.declension&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:"#4a9eff",letterSpacing:1,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                الإعراب <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(74,158,255,0.3),transparent)"}}/>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr>
                      {["الحالة","مفرد","جمع"].map(h=>(
                        <th key={h} style={{background:"rgba(74,158,255,0.1)",color:"#4a9eff",padding:"8px 12px",textAlign:"center",border:"1px solid rgba(74,158,255,0.2)",fontSize:11,letterSpacing:0.5}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {c:"الرفع",sg:word.declension.nom,pl:word.declension.nomPl},
                      {c:"المضاف إليه",sg:word.declension.gen,pl:word.declension.genPl},
                      {c:"المفعول غير المباشر",sg:word.declension.dat,pl:"-"},
                      {c:"النصب",sg:word.declension.acc,pl:"-"},
                      {c:"الإفادة",sg:word.declension.inst,pl:"-"},
                      {c:"الجر",sg:word.declension.prep,pl:"-"},
                    ].map((row,i)=>(
                      <tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",fontSize:12}}>{row.c}</td>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:"#4a9eff",textAlign:"center",fontWeight:600}}>{row.sg}</td>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:"rgba(255,255,255,0.6)",textAlign:"center"}}>{row.pl||"-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════════════════

function Nav({active,setActive,lang,setLang}){
  const[open,setOpen]=useState(false);
  const[scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);
  },[]);
  const items=[
    {id:"home",ar:"الرئيسية",en:"Home"},
    {id:"categories",ar:"التصنيفات",en:"Categories"},
    {id:"srs",ar:"التكرار الذكي",en:"SRS"},
    {id:"grammar",ar:"القواعد",en:"Grammar"},
    {id:"motion",ar:"أفعال الحركة",en:"Motion"},
    {id:"favorites",ar:"المفضلة",en:"Favorites"},
  ];
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:scrolled?"rgba(7,7,11,0.97)":"rgba(7,7,11,0.8)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"all 0.3s ease"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
        {/* Logo */}
        <div onClick={()=>{setActive("home");setOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",textDecoration:"none"}}>
          <span style={{fontSize:26}}>🇷🇺</span>
          <span style={{fontSize:20,fontWeight:900,color:"#d4af37",fontFamily:"'JetBrains Mono',monospace",letterSpacing:2}}>RUSLEX</span>
        </div>
        {/* Desktop Links */}
        <div className="nav-desktop" style={{display:"flex",gap:4,alignItems:"center"}}>
          {items.map(it=>(
            <button key={it.id} onClick={()=>{setActive(it.id);setOpen(false);}} style={{
              background:active===it.id?"rgba(212,175,55,0.12)":"transparent",
              color:active===it.id?"#d4af37":"rgba(255,255,255,0.6)",
              border:"none",padding:"7px 14px",borderRadius:10,cursor:"pointer",
              fontSize:14,fontWeight:600,fontFamily:"'Tajawal',sans-serif",transition:"all 0.25s ease"
            }}>
              {lang==="en"?it.en:it.ar}
            </button>
          ))}
        </div>
        {/* Lang & Privacy */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {["ar","en","ru"].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{
              background:lang===l?"rgba(212,175,55,0.12)":"transparent",
              color:lang===l?"#d4af37":"rgba(255,255,255,0.45)",
              border:"1px solid",borderColor:lang===l?"rgba(212,175,55,0.35)":"rgba(255,255,255,0.1)",
              padding:"4px 9px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,
              fontFamily:"'JetBrains Mono',monospace",transition:"all 0.25s"
            }}>{l==="ar"?"ع":l==="en"?"EN":"RU"}</button>
          ))}
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="nav-desktop" style={{
            display:"inline-flex",alignItems:"center",gap:5,
            background:"rgba(212,175,55,0.07)",border:"1px solid rgba(212,175,55,0.2)",
            color:"rgba(212,175,55,0.8)",padding:"5px 12px",borderRadius:10,
            fontSize:12,fontWeight:600,fontFamily:"'Tajawal',sans-serif",
            textDecoration:"none",transition:"all 0.25s",marginRight:4,
            cursor:"pointer"
          }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,175,55,0.15)";e.currentTarget.style.color="#d4af37";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(212,175,55,0.07)";e.currentTarget.style.color="rgba(212,175,55,0.8)";}}>
            🔒 {lang==="en"?"Privacy":"الخصوصية"}
          </a>
          <button className="nav-mobile-toggle" onClick={()=>setOpen(!open)} style={{background:"none",border:"none",color:"#d4af37",fontSize:22,cursor:"pointer",display:"none"}}>
            {open?"✕":"☰"}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {open&&(
        <div style={{padding:"8px 24px 20px",display:"flex",flexDirection:"column",gap:4,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          {items.map(it=>(
            <button key={it.id} onClick={()=>{setActive(it.id);setOpen(false);}} style={{
              background:active===it.id?"rgba(212,175,55,0.12)":"transparent",
              color:active===it.id?"#d4af37":"rgba(255,255,255,0.65)",
              border:"none",padding:"11px 16px",borderRadius:10,cursor:"pointer",
              fontSize:15,fontWeight:600,fontFamily:"'Tajawal',sans-serif",textAlign:"right",transition:"all 0.25s"
            }}>
              {lang==="en"?it.en:it.ar}
            </button>
          ))}
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" style={{
            display:"flex",alignItems:"center",gap:6,
            color:"rgba(212,175,55,0.8)",padding:"11px 16px",borderRadius:10,
            fontSize:15,fontWeight:600,fontFamily:"'Tajawal',sans-serif",textDecoration:"none"
          }}>🔒 {lang==="en"?"Privacy Policy":"شروط الخصوصية"}</a>
        </div>
      )}
    </nav>
  );
}

// ══════════════════════════════════════════════════
//  HERO SECTION
// ══════════════════════════════════════════════════

function Hero({setActive,lang}){
  const labels={
    ar:{badge:"📚 قاموس تفاعلي شامل",title:"تعلّم الروسية\nبالطريقة الذكية",sub:"✦ Ruslex — معجمك الروسي الشامل ✦",desc:"أكثر من 25,000 كلمة روسية مع المعاني والتصريف والإعراب، نظام تكرار ذكي FSRS، دعم العربية والإنجليزية والروسية.",btn1:"📂 استكشف التصنيفات",btn2:"🧠 التكرار الذكي",w1:"كلمة روسية",w2:"حالة إعرابية",w3:"تكرار ذكي",w4:"لغات مدعومة"},
    en:{badge:"📚 Comprehensive Interactive Dictionary",title:"Learn Russian\nThe Smart Way",sub:"✦ Ruslex — Your Complete Russian Dictionary ✦",desc:"Over 25,000 Russian words with meanings, conjugations, declensions, FSRS spaced repetition, Arabic & English support.",btn1:"📂 Browse Categories",btn2:"🧠 Smart Review",w1:"Russian words",w2:"Grammar cases",w3:"Spaced rep.",w4:"Languages"},
    ru:{badge:"📚 Интерактивный словарь",title:"Учись Русскому\nПо-Умному",sub:"✦ Ruslex — Твой Русский Словарь ✦",desc:"Более 25,000 слов с переводом, спряжением и склонением. Система FSRS для эффективного запоминания.",btn1:"📂 Категории",btn2:"🧠 Повторение",w1:"Слов",w2:"Падежей",w3:"FSRS",w4:"Языков"},
  };
  const t=labels[lang]||labels.ar;
  return(
    <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 24px 60px",position:"relative",textAlign:"center"}}>
      {/* Big Cyrillic bg text */}
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(80px,16vw,170px)",fontWeight:900,color:"transparent",background:"linear-gradient(135deg,rgba(212,175,55,0.07),rgba(212,175,55,0.12),rgba(212,175,55,0.05))",WebkitBackgroundClip:"text",backgroundClip:"text",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-55%)",pointerEvents:"none",userSelect:"none",whiteSpace:"nowrap",letterSpacing:-5,lineHeight:1}}>
        РУССКИЙ
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:820,width:"100%"}}>
        <FadeIn>
          <div style={{display:"inline-block",padding:"5px 18px",borderRadius:50,fontSize:13,fontWeight:700,letterSpacing:0.5,background:"rgba(212,175,55,0.12)",color:"#d4af37",border:"1px solid rgba(212,175,55,0.3)",marginBottom:24}}>
            {t.badge}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 style={{fontSize:"clamp(36px,7vw,68px)",fontWeight:900,lineHeight:1.1,margin:"0 0 16px",fontFamily:"'Tajawal',sans-serif",background:"linear-gradient(135deg,#fff 0%,#d4af37 50%,#fff 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200% 200%",animation:"shimmer 5s ease infinite",whiteSpace:"pre-line"}}>
            {t.title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{fontSize:20,color:"#d4af37",fontWeight:700,margin:"0 0 16px",letterSpacing:0.5}}>{t.sub}</p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.55)",margin:"0 auto 40px",maxWidth:560,lineHeight:1.85,dangerouslySetInnerHTML:undefined}}>
            {t.desc}
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:14,maxWidth:620,margin:"0 auto 40px"}}>
            <StatBox icon="📖" value="+25K" label={t.w1} color="#d4af37"/>
            <StatBox icon="🎯" value="6" label={t.w2} color="#4a9eff"/>
            <StatBox icon="🔁" value="FSRS" label={t.w3} color="#9c27b0"/>
            <StatBox icon="🌍" value="3" label={t.w4} color="#4caf50"/>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <Btn primary onClick={()=>setActive("categories")}>{t.btn1}</Btn>
            <Btn outline onClick={()=>setActive("srs")}>{t.btn2}</Btn>
          </div>
        </FadeIn>
      </div>

      {/* Feature strip */}
      <div style={{maxWidth:1200,width:"100%",padding:"60px 0 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:18}}>
          {[
            {icon:"📖",title:"قاموس غني",desc:"معاني متعددة بالعربية والإنجليزية، نطق IPA، جداول تصريف وإعراب",color:"#d4af37"},
            {icon:"🔁",title:"تكرار ذكي FSRS",desc:"خوارزمية علمية تحسب الوقت الأمثل لمراجعة كل كلمة بناءً على أدائك",color:"#4a9eff"},
            {icon:"📐",title:"نظام الإعراب",desc:"الحالات الست الإعرابية مع جداول التصريف الكاملة للأسماء والأفعال",color:"#9c27b0"},
            {icon:"🏃",title:"أفعال الحركة",desc:"أفعال الحركة الروسية مع كل البادئات ومعانيها بشكل تفاعلي",color:"#ff9800"},
          ].map((f,i)=>(
            <FadeIn key={i} delay={0.6+i*0.07}>
              <Card gold={i===0} style={{textAlign:"center",padding:"32px 22px",height:"100%"}}>
                <div style={{fontSize:40,marginBottom:14}}>{f.icon}</div>
                <h3 style={{fontSize:18,fontWeight:800,color:f.color,margin:"0 0 10px",fontFamily:"'Tajawal',sans-serif"}}>{f.title}</h3>
                <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.8,margin:0}}>{f.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════
//  CATEGORIES SECTION
// ══════════════════════════════════════════════════

function Categories({lang,favorites,onToggleFav,onOpenWord}){
  const[selectedCat,setSelectedCat]=useState(null);
  const getCatName=(c)=>lang==="en"?c.nameEn:lang==="ru"?c.nameRu:c.nameAr;
  const catWords=selectedCat?WORDS.filter(w=>w.categoryId===selectedCat.id):[];
  return(
    <section style={{padding:"80px 24px",maxWidth:1200,margin:"0 auto"}}>
      <SectionTitle title={lang==="en"?"Categories":lang==="ru"?"Категории":"التصنيفات"} sub={lang==="en"?"Browse vocabulary by topic":lang==="ru"?"Слова по темам":"تصفّح المفردات حسب الموضوع"} icon="📂"/>
      {!selectedCat&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:16}}>
          {CATEGORIES.map((cat,i)=>(
            <FadeIn key={cat.id} delay={i*0.04}>
              <div
                onClick={()=>setSelectedCat(cat)}
                style={{
                  background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:20,padding:"24px 16px",textAlign:"center",cursor:"pointer",
                  transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px) scale(1.03)";e.currentTarget.style.borderColor=cat.color+"66";e.currentTarget.style.boxShadow=`0 12px 36px ${cat.color}22`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.boxShadow="none";}}
              >
                <div style={{width:68,height:68,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:32,background:`${cat.color}18`,border:`1.5px solid ${cat.color}33`}}>
                  {cat.icon}
                </div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:8}}>{getCatName(cat)}</div>
                <span style={{display:"inline-block",padding:"2px 10px",borderRadius:50,fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",background:`${cat.color}20`,color:cat.color}}>
                  {cat.count}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
      {selectedCat&&(
        <div>
          <button onClick={()=>setSelectedCat(null)} style={{
            background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",
            color:"#fff",padding:"8px 18px",borderRadius:10,cursor:"pointer",
            fontSize:14,fontWeight:600,fontFamily:"'Tajawal',sans-serif",marginBottom:28,
            display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.2s"
          }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
            ← {lang==="en"?"Back":"رجوع"}
          </button>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <span style={{fontSize:32}}>{selectedCat.icon}</span>
            <h3 style={{fontSize:22,fontWeight:800,color:selectedCat.color,margin:0,fontFamily:"'Tajawal',sans-serif"}}>{getCatName(selectedCat)}</h3>
            <Badge color={selectedCat.color}>{catWords.length} {lang==="en"?"words":"كلمة"}</Badge>
          </div>
          {catWords.length>0
            ?catWords.map(w=><FadeIn key={w.id}><WordCard word={w} lang={lang} favorites={favorites} onToggleFav={onToggleFav} onOpen={onOpenWord}/></FadeIn>)
            :<div style={{textAlign:"center",padding:"60px 24px",color:"rgba(255,255,255,0.3)",fontSize:16}}>
              <div style={{fontSize:64,marginBottom:16,opacity:0.2}}>📭</div>
              {lang==="en"?"No words in this category yet":"لا توجد كلمات في هذا التصنيف بعد"}
            </div>
          }
        </div>
      )}
    </section>
  );
}

// ══════════════════════════════════════════════════
//  SRS SECTION
// ══════════════════════════════════════════════════

function SRS({lang}){
  const[srs,setSrs]=useState(initSRS);
  const[revealed,setRevealed]=useState(false);

  const dueCards=srs.cards.filter(c=>c.due||c.srsState==='new');
  const mastered=srs.cards.filter(c=>c.srsState==='review').length;
  const total=srs.cards.length;
  const currentCard=dueCards[Math.min(srs.currentIdx,dueCards.length-1)];

  function revealCard(){setRevealed(true);}
  function rateCard(rating){
    setSrs(prev=>{
      const cards=[...prev.cards];
      const cardIdx=cards.findIndex(c=>c.id===currentCard?.id);
      if(cardIdx>=0){
        cards[cardIdx]={...cards[cardIdx],due:false,srsState:rating==='easy'||rating==='good'?'review':rating==='hard'?'learning':'new'};
      }
      const newDue=cards.filter(c=>c.due||c.srsState==='new');
      const nextIdx=prev.currentIdx+1>=newDue.length?0:prev.currentIdx+1;
      return{...prev,cards,currentIdx:nextIdx,todayReviews:prev.todayReviews+1};
    });
    setRevealed(false);
  }

  const statItems=[
    {label:lang==="en"?"Total Cards":"إجمالي البطاقات",val:total,color:"#4a9eff"},
    {label:lang==="en"?"Due Today":"للمراجعة اليوم",val:dueCards.length,color:"#ff9800"},
    {label:lang==="en"?"Mastered":"كلمات متقنة",val:mastered,color:"#4caf50"},
    {label:lang==="en"?"Day Streak":"سلسلة الأيام",val:`🔥${srs.streak}`,color:"#d4af37"},
  ];

  return(
    <section style={{padding:"80px 24px",maxWidth:900,margin:"0 auto"}}>
      <SectionTitle title={lang==="en"?"Smart Review":"التكرار الذكي"} sub={lang==="en"?"FSRS algorithm for maximum retention":"خوارزمية FSRS العلمية لحفظ المفردات بكفاءة قصوى"} icon="🧠"/>
      {/* Stats */}
      <FadeIn>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:28}}>
          {statItems.map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"22px",textAlign:"center"}}>
              <div style={{fontSize:38,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:s.color,lineHeight:1.1}}>{s.val}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:6,fontFamily:"'Tajawal',sans-serif"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </FadeIn>
      {/* Retention bar */}
      <FadeIn delay={0.1}>
        <Card gold style={{marginBottom:28,display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,flexWrap:"wrap",padding:"22px 28px"}}>
          <div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:4}}>{lang==="en"?"Retention Rate":"نسبة الاحتفاظ"}</div>
            <div style={{fontSize:32,fontWeight:900,color:"#d4af37",fontFamily:"'JetBrains Mono',monospace"}}>92%</div>
          </div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{background:"rgba(255,255,255,0.08)",borderRadius:50,height:10,overflow:"hidden"}}>
              <div style={{width:"92%",height:"100%",background:"linear-gradient(90deg,#d4af37,#e8cc6a)",borderRadius:50}}/>
            </div>
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:50,fontSize:14,fontWeight:700,background:"rgba(255,107,53,0.12)",color:"#ff6b35",border:"1px solid rgba(255,107,53,0.25)"}}>
            🔥 {srs.streak} {lang==="en"?"days":"يوم"}
          </div>
        </Card>
      </FadeIn>
      {/* Flash card */}
      <FadeIn delay={0.2}>
        {dueCards.length===0?(
          <div style={{textAlign:"center",padding:"80px 24px"}}>
            <div style={{fontSize:80,marginBottom:20,opacity:0.8}}>🎉</div>
            <div style={{fontSize:22,color:"rgba(255,255,255,0.7)",fontFamily:"'Tajawal',sans-serif"}}>{lang==="en"?"All done! No reviews today":"أحسنت! لا توجد مراجعات اليوم"}</div>
          </div>
        ):(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <h3 style={{fontSize:17,fontWeight:700,color:"rgba(255,255,255,0.8)",margin:0,fontFamily:"'Tajawal',sans-serif"}}>{lang==="en"?"Study Session":"جلسة المراجعة"}</h3>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontFamily:"'JetBrains Mono',monospace"}}>{Math.min(srs.currentIdx+1,dueCards.length)} / {dueCards.length}</span>
            </div>
            <div
              onClick={!revealed?revealCard:undefined}
              style={{
                background:"linear-gradient(135deg,rgba(212,175,55,0.1),rgba(15,15,22,0.95))",
                border:"1px solid rgba(212,175,55,0.3)",borderRadius:24,
                padding:"48px 32px",textAlign:"center",cursor:!revealed?"pointer":"default",
                transition:"all 0.4s ease",animation:"glowPulse 3s ease infinite",
                boxShadow:"0 0 40px rgba(212,175,55,0.08)"
              }}
            >
              {currentCard&&(
                <>
                  <div style={{fontSize:52,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:"#fff",marginBottom:8}}>{currentCard.word}</div>
                  {!revealed&&<div style={{fontSize:14,color:"rgba(255,255,255,0.4)",fontFamily:"'Tajawal',sans-serif"}}>{lang==="en"?"Tap to reveal":"اضغط لإظهار المعنى"}</div>}
                  {revealed&&(
                    <>
                      <div style={{fontSize:22,color:"#d4af37",fontWeight:700,marginBottom:32,fontFamily:"'Tajawal',sans-serif"}}>{getMeaning(currentCard,lang)}</div>
                      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                        {[
                          {r:"again",label:"Again",color:"#f44336"},
                          {r:"hard",label:"Hard",color:"#ff9800"},
                          {r:"good",label:"Good",color:"#4a9eff"},
                          {r:"easy",label:"Easy",color:"#4caf50"},
                        ].map(({r,label,color})=>(
                          <button key={r} onClick={(e)=>{e.stopPropagation();rateCard(r);}} style={{
                            padding:"10px 22px",borderRadius:12,border:`1px solid ${color}44`,
                            background:`${color}18`,color,
                            fontSize:14,fontWeight:700,fontFamily:"'Tajawal',sans-serif",cursor:"pointer",
                            transition:"all 0.25s"
                          }}
                            onMouseEnter={e=>{e.currentTarget.style.background=`${color}30`;e.currentTarget.style.transform="translateY(-2px)";}}
                            onMouseLeave={e=>{e.currentTarget.style.background=`${color}18`;e.currentTarget.style.transform="none";}}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </FadeIn>
    </section>
  );
}

// ══════════════════════════════════════════════════
//  GRAMMAR SECTION
// ══════════════════════════════════════════════════

function Grammar({lang}){
  const[filter,setFilter]=useState("all");
  const lessons=filter==="all"?DECL_LESSONS:DECL_LESSONS.filter(l=>l.case===filter);
  const chips=[
    {key:"all",label:lang==="en"?"All":"الكل",color:"#2196f3"},
    {key:"nominative",label:"Nominative",color:"#2196f3"},
    {key:"genitive",label:"Genitive",color:"#e91e63"},
    {key:"dative",label:"Dative",color:"#4caf50"},
    {key:"accusative",label:"Accusative",color:"#ff9800"},
    {key:"instrumental",label:"Instrumental",color:"#9c27b0"},
    {key:"prepositional",label:"Prepositional",color:"#00bcd4"},
  ];
  return(
    <section style={{padding:"80px 24px",maxWidth:1100,margin:"0 auto"}}>
      <SectionTitle title={lang==="en"?"Grammar System":"نظام الإعراب"} sub={lang==="en"?"The six grammatical cases in Russian":"الحالات الست الإعرابية في اللغة الروسية"} icon="📐"/>
      {/* Filter chips */}
      <FadeIn>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:32}}>
          {chips.map(c=>(
            <button key={c.key} onClick={()=>setFilter(c.key)} style={{
              padding:"6px 16px",borderRadius:50,fontSize:12,fontWeight:700,cursor:"pointer",
              transition:"all 0.25s",fontFamily:"'JetBrains Mono',monospace",
              background:filter===c.key?`${c.color}25`:"rgba(255,255,255,0.04)",
              color:filter===c.key?c.color:"rgba(255,255,255,0.5)",
              border:filter===c.key?`1px solid ${c.color}55`:"1px solid rgba(255,255,255,0.08)",
              transform:filter===c.key?"scale(1.05)":"none"
            }}>{c.label}</button>
          ))}
        </div>
      </FadeIn>
      {lessons.map((l,i)=>(
        <FadeIn key={l.case} delay={i*0.06}>
          <div style={{background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"28px",marginBottom:18,borderRight:`3px solid ${l.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:l.color,boxShadow:`0 0 10px ${l.color}88`,flexShrink:0}}/>
              <div style={{fontSize:19,fontWeight:800,color:l.color,fontFamily:"'JetBrains Mono',monospace"}}>{l.titleAr}</div>
            </div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:6,fontFamily:"'Tajawal',sans-serif"}}>{l.question}</div>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:14,lineHeight:1.7,marginBottom:20,fontFamily:"'Tajawal',sans-serif"}}>{l.desc}</p>
            {/* Examples */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,color:l.color,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>أمثلة</div>
              {l.examples.map((ex,j)=>(
                <div key={j} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 16px",marginBottom:8,borderRight:`2px solid ${l.color}55`}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:600,marginBottom:3,color:"#fff"}}>{ex.ru}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontFamily:"'Tajawal',sans-serif"}}>{ex.ar}</div>
                </div>
              ))}
            </div>
            {/* Endings table */}
            <div style={{fontSize:11,fontWeight:700,color:l.color,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>نهايات الجمع والمفرد</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead>
                  <tr>
                    {["الجنس","مفرد","جمع"].map(h=>(
                      <th key={h} style={{background:`${l.color}18`,color:l.color,padding:"8px 12px",textAlign:"center",border:`1px solid ${l.color}33`,fontSize:11,letterSpacing:0.5,fontFamily:"'Tajawal',sans-serif"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {l.endings.map((e,j)=>(
                    <tr key={j} style={{background:j%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
                      <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",fontSize:12,fontFamily:"'Tajawal',sans-serif"}}>{e.gender}</td>
                      <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:l.color,textAlign:"center",fontWeight:700}}>{e.sg}</td>
                      <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:l.color,textAlign:"center",fontWeight:700}}>{e.pl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      ))}
    </section>
  );
}

// ══════════════════════════════════════════════════
//  MOTION VERBS SECTION
// ══════════════════════════════════════════════════

function Motion({lang}){
  const[activeKey,setActiveKey]=useState(null);
  const activePref=PREFIXES.find(p=>p.key===activeKey);
  return(
    <section style={{padding:"80px 24px",maxWidth:1100,margin:"0 auto"}}>
      <SectionTitle title={lang==="en"?"Motion Verbs":"أفعال الحركة"} sub={lang==="en"?"Russian motion verbs with prefixes — perfective & imperfective":"أفعال الحركة الروسية مع البادئات — الفعل الكامل والناقص"} icon="🏃"/>
      {/* Prefix grid */}
      <FadeIn>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:12,marginBottom:32}}>
          {PREFIXES.map(p=>(
            <div key={p.key} onClick={()=>setActiveKey(activeKey===p.key?null:p.key)} style={{
              background:activeKey===p.key?`${p.color}18`:"rgba(255,255,255,0.04)",
              border:`1px solid ${activeKey===p.key?p.color+"55":"rgba(255,255,255,0.08)"}`,
              borderRadius:16,padding:"18px 12px",textAlign:"center",cursor:"pointer",
              transition:"all 0.3s"
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color+"44";e.currentTarget.style.background=`${p.color}10`;}}
              onMouseLeave={e=>{if(activeKey!==p.key){e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.background="rgba(255,255,255,0.04)";}}}
            >
              <div style={{fontSize:28,marginBottom:8}}>{p.icon}</div>
              <div style={{fontSize:15,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:p.color}}>{p.prefix}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:4,fontFamily:"'Tajawal',sans-serif",lineHeight:1.4}}>{p.meaningAr}</div>
            </div>
          ))}
        </div>
      </FadeIn>
      {/* Verb pairs */}
      {activePref&&(
        <FadeIn>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
              <button onClick={()=>setActiveKey(null)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"7px 16px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Tajawal',sans-serif",transition:"all 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>← {lang==="en"?"All":"الكل"}</button>
              <h3 style={{fontSize:20,fontWeight:800,margin:0}}>
                <span style={{color:activePref.color,fontFamily:"'JetBrains Mono',monospace"}}>{activePref.prefix}</span>
                <span style={{color:"rgba(255,255,255,0.6)",fontSize:15,fontFamily:"'Tajawal',sans-serif",marginRight:8}}> — {activePref.meaningAr}</span>
              </h3>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:14}}>
              {activePref.pairs.map((vp,i)=>(
                <FadeIn key={i} delay={i*0.05}>
                  <div style={{background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px",transition:"all 0.25s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(212,175,55,0.3)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
                      <span style={{padding:"4px 14px",borderRadius:8,fontSize:15,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",background:"rgba(76,175,80,0.12)",color:"#4caf50"}}>{vp.sv}</span>
                      <span style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>↔</span>
                      <span style={{padding:"4px 14px",borderRadius:8,fontSize:15,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",background:"rgba(244,67,54,0.12)",color:"#f44336"}}>{vp.nsv}</span>
                    </div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.5,fontFamily:"'Tajawal',sans-serif",marginBottom:10}}>{lang==="en"?vp.en:vp.ar}</div>
                    <div style={{display:"flex",gap:8}}>
                      {[vp.sv,vp.nsv].map(v=>(
                        <button key={v} onClick={()=>speak(v)} style={{
                          background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",
                          color:"rgba(255,255,255,0.55)",padding:"5px 10px",borderRadius:8,cursor:"pointer",
                          fontSize:12,fontFamily:"'JetBrains Mono',monospace",transition:"all 0.2s"
                        }}
                          onMouseEnter={e=>{e.currentTarget.style.color="#d4af37";e.currentTarget.style.borderColor="rgba(212,175,55,0.3)";}}
                          onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.55)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
                          🔊 {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </section>
  );
}

// ══════════════════════════════════════════════════
//  FAVORITES SECTION
// ══════════════════════════════════════════════════

function Favorites({lang,favorites,onToggleFav,onOpenWord}){
  const favWords=WORDS.filter(w=>favorites.has(w.id));
  return(
    <section style={{padding:"80px 24px",maxWidth:780,margin:"0 auto"}}>
      <SectionTitle title={lang==="en"?"Favorites":"المفضلة"} icon="❤️"/>
      {favWords.length===0?(
        <div style={{textAlign:"center",padding:"80px 24px"}}>
          <div style={{fontSize:80,opacity:0.15,marginBottom:22}}>🤍</div>
          <div style={{fontSize:17,color:"rgba(255,255,255,0.35)",fontFamily:"'Tajawal',sans-serif"}}>{lang==="en"?"No favorites yet — tap ❤️ on any word":"لا توجد مفضلة بعد — اضغط ❤️ على أي كلمة"}</div>
        </div>
      ):favWords.map(w=>(
        <FadeIn key={w.id}>
          <WordCard word={w} lang={lang} favorites={favorites} onToggleFav={onToggleFav} onOpen={onOpenWord}/>
        </FadeIn>
      ))}
    </section>
  );
}

// ══════════════════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════════════════

function Footer({lang}){
  return(
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"36px 24px",textAlign:"center",position:"relative",zIndex:1}}>
      <div style={{marginBottom:10,fontSize:28}}>🇷🇺</div>
      <div style={{color:"#d4af37",fontSize:17,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",letterSpacing:2,marginBottom:16}}>RUSLEX</div>
      <div style={{display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap",marginBottom:16}}>
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" style={{
          display:"inline-flex",alignItems:"center",gap:6,
          color:"rgba(212,175,55,0.75)",fontSize:14,fontWeight:600,
          fontFamily:"'Tajawal',sans-serif",textDecoration:"none",
          transition:"color 0.2s",padding:"6px 14px",borderRadius:10,
          border:"1px solid rgba(212,175,55,0.2)",background:"rgba(212,175,55,0.06)"
        }}
          onMouseEnter={e=>e.currentTarget.style.color="#d4af37"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(212,175,55,0.75)"}>
          🔒 {lang==="en"?"Privacy Policy":"شروط الخصوصية"}
        </a>
      </div>
      <div style={{color:"rgba(255,255,255,0.25)",fontSize:13,fontFamily:"'Tajawal',sans-serif"}}>
        © 2026 <span style={{color:"#d4af37"}}>Ruslex</span> — {lang==="en"?"Comprehensive Russian Dictionary | Built with ❤️ for Arabic learners":"القاموس الروسي الشامل | صُمِّم بـ ❤️ للمتعلمين العرب"}
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════
//  APP ROOT
// ══════════════════════════════════════════════════

function App(){
  const[active,setActive]=useState("home");
  const[lang,setLang]=useState("ar");
  const[favorites,setFavorites]=useState(new Set());
  const[modalWord,setModalWord]=useState(null);
  const[toast,setToast]=useState({visible:false,msg:"",icon:""});

  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[active]);

  function showToast(msg,icon="⭐"){
    setToast({visible:true,msg,icon});
    setTimeout(()=>setToast(t=>({...t,visible:false})),2600);
  }

  function toggleFav(id){
    setFavorites(prev=>{
      const next=new Set(prev);
      if(next.has(id)){next.delete(id);showToast(lang==="en"?"Removed from favorites":"تم الإزالة من المفضلة","💔");}
      else{next.add(id);showToast(lang==="en"?"Added to favorites":"تمت الإضافة للمفضلة","❤️");}
      return next;
    });
  }

  const renderSection=()=>{
    switch(active){
      case"categories":return<Categories lang={lang} favorites={favorites} onToggleFav={toggleFav} onOpenWord={setModalWord}/>;
      case"srs":return<SRS lang={lang}/>;
      case"grammar":return<Grammar lang={lang}/>;
      case"motion":return<Motion lang={lang}/>;
      case"favorites":return<Favorites lang={lang} favorites={favorites} onToggleFav={toggleFav} onOpenWord={setModalWord}/>;
      default:return<Hero setActive={setActive} lang={lang}/>;
    }
  };

  return(
    <div style={{minHeight:"100vh",background:"#07070b",color:"#f0f0f0",fontFamily:"'Tajawal',sans-serif",direction:"rtl",position:"relative",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Playfair+Display:wght@700;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#07070b;overflow-x:hidden;}
        ::selection{background:rgba(212,175,55,0.28);color:#fff;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#07070b;}
        ::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.28);border-radius:3px;}
        @keyframes shimmer{0%,100%{background-position:200% 50%;}50%{background-position:0% 50%;}}
        @keyframes floatOrb{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(28px,-32px) scale(1.04);}66%{transform:translate(-18px,18px) scale(0.96);}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 30px rgba(212,175,55,0.08);}50%{box-shadow:0 0 60px rgba(212,175,55,0.18);}}
        @media(max-width:768px){
          .nav-desktop{display:none !important;}
          .nav-mobile-toggle{display:block !important;}
        }
        @media(min-width:769px){
          .nav-mobile-toggle{display:none !important;}
        }
        section{overflow:hidden;width:100%;box-sizing:border-box;}
        img,iframe,video{max-width:100%;box-sizing:border-box;}
      `}</style>
      <AnimBG/>
      <Nav active={active} setActive={setActive} lang={lang} setLang={setLang}/>
      <div style={{position:"relative",zIndex:1,paddingTop:64}}>
        {renderSection()}
        <Footer lang={lang}/>
      </div>
      <WordModal word={modalWord} lang={lang} favorites={favorites} onToggleFav={toggleFav} onClose={()=>setModalWord(null)}/>
      <Toast {...toast}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App/></React.StrictMode>
);
