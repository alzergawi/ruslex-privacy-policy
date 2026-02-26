import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════
//  CONSTANTS — حقيقية من التطبيق
// ══════════════════════════════════════════════════

const PRIVACY_URL = "https://alzergawi.github.io/ruslex-privacy-policy/";
const APP_VERSION = "1.3";
const PACKAGE_NAME = "com.haider.ruslex";
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

// ══════════════════════════════════════════════════
//  DATA — بيانات حقيقية تعكس بنية قاعدة بيانات RusLex
// ══════════════════════════════════════════════════

// Categories حقيقية من قاعدة البيانات (جدول categories)
const CATEGORIES = [
  {id:1, icon:"💬", nameAr:"عبارات يومية",      nameEn:"Daily Phrases",   nameRu:"Повседневные фразы",   color:"#4a9eff", count:1240},
  {id:2, icon:"❤️", nameAr:"المشاعر والحالة",   nameEn:"Emotions & State",nameRu:"Эмоции и состояние",   color:"#e91e63", count:380},
  {id:3, icon:"⚡",  nameAr:"الأفعال",           nameEn:"Verbs",           nameRu:"Глаголы",               color:"#f44336", count:4800},
  {id:4, icon:"✨",  nameAr:"الصفات",            nameEn:"Adjectives",      nameRu:"Прилагательные",        color:"#9c27b0", count:2100},
  {id:5, icon:"🏠",  nameAr:"البيت والمنزل",     nameEn:"Home & House",    nameRu:"Дом и жилище",          color:"#ff9800", count:560},
  {id:6, icon:"📚",  nameAr:"التعليم والعلم",    nameEn:"Education",       nameRu:"Образование и наука",   color:"#00bcd4", count:740},
  {id:7, icon:"🌍",  nameAr:"الجغرافيا",         nameEn:"Geography",       nameRu:"География",             color:"#4caf50", count:430},
  {id:8, icon:"🍕",  nameAr:"الطعام والشراب",    nameEn:"Food & Drink",    nameRu:"Еда и напитки",         color:"#d4af37", count:820},
  {id:9, icon:"👨‍👩‍👧", nameAr:"العائلة",          nameEn:"Family",          nameRu:"Семья",                 color:"#ff6b35", count:320},
  {id:10,icon:"🏥",  nameAr:"الصحة والجسم",      nameEn:"Health & Body",   nameRu:"Здоровье и тело",       color:"#00e676", count:610},
  {id:11,icon:"💼",  nameAr:"العمل والمهن",      nameEn:"Work & Professions",nameRu:"Работа и профессии",  color:"#607d8b", count:890},
  {id:12,icon:"🚗",  nameAr:"التنقل والسفر",     nameEn:"Transport & Travel",nameRu:"Транспорт и путешествия",color:"#795548",count:490},
  {id:13,icon:"🎭",  nameAr:"الثقافة والفنون",   nameEn:"Culture & Arts",  nameRu:"Культура и искусство",  color:"#ff4081", count:350},
  {id:14,icon:"📅",  nameAr:"الزمان والوقت",     nameEn:"Time & Date",     nameRu:"Время и даты",          color:"#26c6da", count:270},
  {id:15,icon:"🔢",  nameAr:"الأعداد والكميات",  nameEn:"Numbers",         nameRu:"Числа и количества",    color:"#8bc34a", count:180},
];

// كلمات نموذجية حقيقية من قاعدة البيانات تعكس بنية جدول words + meanings + pronunciations
const WORDS = [
  {id:1, word:"привет",     pos:"intj", level:"A1", frequency:95, meaning_ar:"مرحبا، أهلاً",         meaning_en:"Hi, Hello",         ipa:"[prʲɪˈvʲet]",  categoryId:1},
  {id:2, word:"мир",        pos:"noun", level:"A1", frequency:90, meaning_ar:"عالم، سلام",           meaning_en:"World, Peace",      ipa:"[mʲir]",        categoryId:1},
  {id:3, word:"любовь",     pos:"noun", level:"A2", frequency:82, meaning_ar:"حب، محبة",             meaning_en:"Love",              ipa:"[lʲʉˈbofʲ]",   categoryId:2,
    declension:{singNom:"любовь",singGen:"любви",singDat:"любви",singAcc:"любовь",singInst:"любовью",singPrep:"любви",plurNom:"—",plurGen:"—"}},
  {id:4, word:"работать",   pos:"verb", level:"A1", frequency:88, meaning_ar:"يعمل",                 meaning_en:"To work",           ipa:"[ˈrabətətʲ]",  categoryId:3,
    conjugation:{infinitive:"работать",pres1sg:"работаю",pres2sg:"работаешь",pres3sg:"работает",pres1pl:"работаем",pres2pl:"работаете",pres3pl:"работают",pastM:"работал",pastF:"работала",pastN:"работало",pastPl:"работали",impSg:"работай",impPl:"работайте"}},
  {id:5, word:"красивый",   pos:"adj",  level:"A1", frequency:75, meaning_ar:"جميل، رائع",           meaning_en:"Beautiful",         ipa:"[krɐˈsʲivɨj]", categoryId:4},
  {id:6, word:"говорить",   pos:"verb", level:"A1", frequency:92, meaning_ar:"يتكلم، يقول",          meaning_en:"To speak, to say",  ipa:"[ɡəvɐˈrʲitʲ]",categoryId:3,
    conjugation:{infinitive:"говорить",pres1sg:"говорю",pres2sg:"говоришь",pres3sg:"говорит",pres1pl:"говорим",pres2pl:"говорите",pres3pl:"говорят",pastM:"говорил",pastF:"говорила",pastN:"говорило",pastPl:"говорили",impSg:"говори",impPl:"говорите"}},
  {id:7, word:"большой",    pos:"adj",  level:"A1", frequency:80, meaning_ar:"كبير",                 meaning_en:"Big, Large",        ipa:"[bɐlʲˈʂoj]",   categoryId:4},
  {id:8, word:"хорошо",     pos:"adv",  level:"A1", frequency:85, meaning_ar:"جيداً، بخير",          meaning_en:"Good, Well",        ipa:"[xərɐˈʂo]",    categoryId:1},
  {id:9, word:"понимать",   pos:"verb", level:"A1", frequency:87, meaning_ar:"يفهم",                 meaning_en:"To understand",     ipa:"[pənʲɪˈmatʲ]", categoryId:3,
    conjugation:{infinitive:"понимать",pres1sg:"понимаю",pres2sg:"понимаешь",pres3sg:"понимает",pres1pl:"понимаем",pres2pl:"понимаете",pres3pl:"понимают",pastM:"понимал",pastF:"понимала",pastN:"понимало",pastPl:"понимали",impSg:"понимай",impPl:"понимайте"}},
  {id:10,word:"спасибо",    pos:"intj", level:"A1", frequency:94, meaning_ar:"شكراً",                meaning_en:"Thank you",         ipa:"[spɐˈsʲibə]",  categoryId:1},
  {id:11,word:"дом",        pos:"noun", level:"A1", frequency:88, meaning_ar:"بيت، منزل",            meaning_en:"House, Home",       ipa:"[dom]",         categoryId:5,
    declension:{singNom:"дом",singGen:"дома",singDat:"дому",singAcc:"дом",singInst:"домом",singPrep:"доме",plurNom:"дома",plurGen:"домов",plurDat:"домам",plurAcc:"дома",plurInst:"домами",plurPrep:"домах"}},
  {id:12,word:"время",      pos:"noun", level:"A2", frequency:89, meaning_ar:"وقت، زمن",            meaning_en:"Time",              ipa:"[ˈvrʲemʲə]",   categoryId:14},
  {id:13,word:"учить",      pos:"verb", level:"A1", frequency:78, meaning_ar:"يتعلم، يدرس",          meaning_en:"To learn, to study",ipa:"[ʊˈtʲitʲ]",    categoryId:3,
    conjugation:{infinitive:"учить",pres1sg:"учу",pres2sg:"учишь",pres3sg:"учит",pres1pl:"учим",pres2pl:"учите",pres3pl:"учат",pastM:"учил",pastF:"учила",pastN:"учило",pastPl:"учили",impSg:"учи",impPl:"учите"}},
  {id:14,word:"книга",      pos:"noun", level:"A1", frequency:72, meaning_ar:"كتاب",                 meaning_en:"Book",              ipa:"[ˈknʲiɡə]",    categoryId:6,
    declension:{singNom:"книга",singGen:"книги",singDat:"книге",singAcc:"книгу",singInst:"книгой",singPrep:"книге",plurNom:"книги",plurGen:"книг",plurDat:"книгам",plurAcc:"книги",plurInst:"книгами",plurPrep:"книгах"}},
  {id:15,word:"вода",       pos:"noun", level:"A1", frequency:83, meaning_ar:"ماء",                  meaning_en:"Water",             ipa:"[vɐˈda]",       categoryId:8,
    declension:{singNom:"вода",singGen:"воды",singDat:"воде",singAcc:"воду",singInst:"водой",singPrep:"воде",plurNom:"воды",plurGen:"вод",plurDat:"водам",plurAcc:"воды",plurInst:"водами",plurPrep:"водах"}},
  {id:16,word:"жизнь",      pos:"noun", level:"A2", frequency:84, meaning_ar:"حياة",                 meaning_en:"Life",              ipa:"[ʐɨzʲnʲ]",     categoryId:2},
  {id:17,word:"друг",       pos:"noun", level:"A1", frequency:81, meaning_ar:"صديق",                 meaning_en:"Friend",            ipa:"[druk]",        categoryId:1,
    declension:{singNom:"друг",singGen:"друга",singDat:"другу",singAcc:"друга",singInst:"другом",singPrep:"друге",plurNom:"друзья",plurGen:"друзей",plurDat:"друзьям",plurAcc:"друзей",plurInst:"друзьями",plurPrep:"друзьях"}},
  {id:18,word:"страна",     pos:"noun", level:"A1", frequency:77, meaning_ar:"بلد، دولة",            meaning_en:"Country",           ipa:"[strɐˈna]",     categoryId:7},
  {id:19,word:"язык",       pos:"noun", level:"A1", frequency:76, meaning_ar:"لغة، لسان",            meaning_en:"Language, Tongue",  ipa:"[jɪˈzɨk]",     categoryId:6,
    declension:{singNom:"язык",singGen:"языка",singDat:"языку",singAcc:"язык",singInst:"языком",singPrep:"языке",plurNom:"языки",plurGen:"языков",plurDat:"языкам",plurAcc:"языки",plurInst:"языками",plurPrep:"языках"}},
  {id:20,word:"знать",      pos:"verb", level:"A1", frequency:90, meaning_ar:"يعرف",                 meaning_en:"To know",           ipa:"[znatʲ]",       categoryId:3,
    conjugation:{infinitive:"знать",pres1sg:"знаю",pres2sg:"знаешь",pres3sg:"знает",pres1pl:"знаем",pres2pl:"знаете",pres3pl:"знают",pastM:"знал",pastF:"знала",pastN:"знало",pastPl:"знали",impSg:"знай",impPl:"знайте"}},
  {id:21,word:"хотеть",     pos:"verb", level:"A1", frequency:86, meaning_ar:"يريد، يرغب",           meaning_en:"To want",           ipa:"[xɐˈtʲetʲ]",   categoryId:3,
    conjugation:{infinitive:"хотеть",pres1sg:"хочу",pres2sg:"хочешь",pres3sg:"хочет",pres1pl:"хотим",pres2pl:"хотите",pres3pl:"хотят",pastM:"хотел",pastF:"хотела",pastN:"хотело",pastPl:"хотели",impSg:"—",impPl:"—"}},
  {id:22,word:"делать",     pos:"verb", level:"A1", frequency:91, meaning_ar:"يفعل، يصنع",           meaning_en:"To do, to make",    ipa:"[ˈdʲeɫətʲ]",   categoryId:3,
    conjugation:{infinitive:"делать",pres1sg:"делаю",pres2sg:"делаешь",pres3sg:"делает",pres1pl:"делаем",pres2pl:"делаете",pres3pl:"делают",pastM:"делал",pastF:"делала",pastN:"делало",pastPl:"делали",impSg:"делай",impPl:"делайте"}},
  {id:23,word:"Россия",     pos:"noun", level:"A1", frequency:79, meaning_ar:"روسيا",                meaning_en:"Russia",            ipa:"[rɐˈsʲijə]",   categoryId:7},
  {id:24,word:"есть",       pos:"verb", level:"A1", frequency:93, meaning_ar:"يأكل / يوجد",          meaning_en:"To eat / There is", ipa:"[jestʲ]",       categoryId:3,
    conjugation:{infinitive:"есть",pres1sg:"ем",pres2sg:"ешь",pres3sg:"ест",pres1pl:"едим",pres2pl:"едите",pres3pl:"едят",pastM:"ел",pastF:"ела",pastN:"ело",pastPl:"ели",impSg:"ешь",impPl:"ешьте"}},
  {id:25,word:"идти",       pos:"verb", level:"A1", frequency:87, meaning_ar:"يذهب (مشياً)",         meaning_en:"To go (on foot)",   ipa:"[ɪtʲˈtʲi]",    categoryId:3,
    conjugation:{infinitive:"идти",pres1sg:"иду",pres2sg:"идёшь",pres3sg:"идёт",pres1pl:"идём",pres2pl:"идёте",pres3pl:"идут",pastM:"шёл",pastF:"шла",pastN:"шло",pastPl:"шли",impSg:"иди",impPl:"идите"}},
  {id:26,word:"маленький",  pos:"adj",  level:"A1", frequency:73, meaning_ar:"صغير",                 meaning_en:"Small, Little",     ipa:"[ˈmalʲɪnʲkʲɪj]",categoryId:4},
  {id:27,word:"сегодня",    pos:"adv",  level:"A1", frequency:85, meaning_ar:"اليوم",                meaning_en:"Today",             ipa:"[sʲɪˈvodnʲə]", categoryId:14},
  {id:28,word:"хлеб",       pos:"noun", level:"A1", frequency:70, meaning_ar:"خبز",                  meaning_en:"Bread",             ipa:"[xlʲep]",       categoryId:8,
    declension:{singNom:"хлеб",singGen:"хлеба",singDat:"хлебу",singAcc:"хлеб",singInst:"хлебом",singPrep:"хлебе",plurNom:"хлебы",plurGen:"хлебов",plurDat:"хлебам",plurAcc:"хлебы",plurInst:"хлебами",plurPrep:"хлебах"}},
  {id:29,word:"семья",      pos:"noun", level:"A1", frequency:76, meaning_ar:"عائلة، أسرة",          meaning_en:"Family",            ipa:"[sʲɪˈmʲja]",   categoryId:9,
    declension:{singNom:"семья",singGen:"семьи",singDat:"семье",singAcc:"семью",singInst:"семьёй",singPrep:"семье",plurNom:"семьи",plurGen:"семей",plurDat:"семьям",plurAcc:"семьи",plurInst:"семьями",plurPrep:"семьях"}},
  {id:30,word:"здоровье",   pos:"noun", level:"A2", frequency:74, meaning_ar:"صحة، عافية",           meaning_en:"Health",            ipa:"[zdɐˈrovʲjɪ]", categoryId:10},
];

// Aspect pairs — حقيقية من جدول aspect_pairs
const ASPECT_PAIRS_EXAMPLES = [
  {imperfective:"читать",   perfective:"прочитать",  ar:"يقرأ",         en:"To read"},
  {imperfective:"писать",   perfective:"написать",   ar:"يكتب",         en:"To write"},
  {imperfective:"смотреть", perfective:"посмотреть", ar:"يشاهد",        en:"To watch"},
  {imperfective:"делать",   perfective:"сделать",    ar:"يفعل",         en:"To do/make"},
  {imperfective:"говорить", perfective:"сказать",    ar:"يتكلم",        en:"To speak/say"},
];

// Grammar cases — حقيقية من شاشة DeclensionScreen
const DECL_LESSONS = [
  {case:"nominative",  color:"#2196f3", titleAr:"حالة الرفع — Именительный",      question:"من؟ ما؟",             desc:"الاسم في أصل صورته — يستخدم للفاعل في الجملة",examples:[{ru:"Это стол.",ar:"هذه طاولة."},{ru:"Анна красивая.",ar:"آنا جميلة."}],endings:[{gender:"مذكر",sg:"-",pl:"-ы/-и"},{gender:"مؤنث",sg:"-а/-я",pl:"-ы/-и"},{gender:"محايد",sg:"-о/-е",pl:"-а/-я"}]},
  {case:"genitive",    color:"#e91e63", titleAr:"المضاف إليه — Родительный",      question:"من؟ لمن؟ (ملكية/نفي)",desc:"يدل على الملكية والانتماء، مع النفي وبعض الأعداد",examples:[{ru:"Книга студента.",ar:"كتاب الطالب."},{ru:"Нет воды.",ar:"لا يوجد ماء."}],endings:[{gender:"مذكر",sg:"-а/-я",pl:"-ов/-ей"},{gender:"مؤنث",sg:"-ы/-и",pl:"-"},{gender:"محايد",sg:"-а/-я",pl:"-"}]},
  {case:"dative",      color:"#4caf50", titleAr:"المفعول غير المباشر — Дательный",question:"لمن؟ لما؟",           desc:"المفعول به غير المباشر — «إعطاء» شيء لشخص",examples:[{ru:"Я дал другу книгу.",ar:"أعطيت الكتاب لصديقي."},{ru:"Мне нравится музыка.",ar:"تعجبني الموسيقى."}],endings:[{gender:"مذكر",sg:"-у/-ю",pl:"-ам/-ям"},{gender:"مؤنث",sg:"-е/-и",pl:"-ам/-ям"},{gender:"محايد",sg:"-у/-ю",pl:"-ам/-ям"}]},
  {case:"accusative",  color:"#ff9800", titleAr:"حالة النصب — Винительный",       question:"من؟ ماذا؟ (مفعول به)",desc:"المفعول به المباشر — الهدف المباشر للفعل",examples:[{ru:"Я вижу дом.",ar:"أرى البيت."},{ru:"Я люблю музыку.",ar:"أحب الموسيقى."}],endings:[{gender:"مذكر(جماد)",sg:"-",pl:"-ы/-и"},{gender:"مذكر(حي)",sg:"-а/-я",pl:"-ов/-ей"},{gender:"مؤنث",sg:"-у/-ю",pl:"-ы/-и"}]},
  {case:"instrumental",color:"#9c27b0", titleAr:"حالة الإفادة — Творительный",    question:"بمن؟ بماذا؟",         desc:"الأداة أو الوسيلة أو الرفقة",examples:[{ru:"Я пишу ручкой.",ar:"أكتب بالقلم."},{ru:"С другом.",ar:"مع صديق."}],endings:[{gender:"مذكر",sg:"-ом/-ем",pl:"-ами/-ями"},{gender:"مؤنث",sg:"-ой/-ей",pl:"-ами/-ями"},{gender:"محايد",sg:"-ом/-ем",pl:"-ами/-ями"}]},
  {case:"prepositional",color:"#00bcd4",titleAr:"حالة الجر — Предложный",         question:"عن من؟ أين؟",         desc:"دائماً مع حروف الجر: в، на، о، при",examples:[{ru:"Я думаю о тебе.",ar:"أفكر فيك."},{ru:"Живу в Москве.",ar:"أسكن في موسكو."}],endings:[{gender:"مذكر",sg:"-е/-и",pl:"-ах/-ях"},{gender:"مؤنث",sg:"-е/-и",pl:"-ах/-ях"},{gender:"محايد",sg:"-е/-и",pl:"-ах/-ях"}]},
];

// Motion verbs — حقيقية من شاشة MotionVerbsScreen
const PREFIXES = [
  {key:"none",  prefix:"—",      icon:"🚶",color:"#4a9eff",meaningAr:"بدون بادئة — حركة أساسية",pairs:[{sv:"пойти",nsv:"идти",ar:"يذهب (مشياً)",en:"To go (on foot)"},{sv:"поехать",nsv:"ехать",ar:"يذهب (بمركبة)",en:"To go (by vehicle)"},{sv:"полететь",nsv:"летать",ar:"يطير",en:"To fly"}]},
  {key:"при",   prefix:"при-",   icon:"🏠",color:"#4caf50",meaningAr:"وصول، قدوم",pairs:[{sv:"прийти",nsv:"приходить",ar:"يصل مشياً",en:"To arrive on foot"},{sv:"приехать",nsv:"приезжать",ar:"يصل بمركبة",en:"To arrive by vehicle"},{sv:"прилететь",nsv:"прилетать",ar:"يصل طيراً",en:"To arrive by air"}]},
  {key:"у",     prefix:"у-",     icon:"🚪",color:"#f44336",meaningAr:"مغادرة، رحيل",pairs:[{sv:"уйти",nsv:"уходить",ar:"يغادر مشياً",en:"To leave on foot"},{sv:"уехать",nsv:"уезжать",ar:"يغادر بمركبة",en:"To leave by vehicle"},{sv:"улететь",nsv:"улетать",ar:"يغادر طيراً",en:"To fly away"}]},
  {key:"вы",    prefix:"вы-",    icon:"🚀",color:"#ff9800",meaningAr:"خروج من مكان",pairs:[{sv:"выйти",nsv:"выходить",ar:"يخرج مشياً",en:"To exit on foot"},{sv:"выехать",nsv:"выезжать",ar:"يخرج بمركبة",en:"To drive out"},{sv:"вылететь",nsv:"вылетать",ar:"يقلع",en:"To take off"}]},
  {key:"в",     prefix:"в-",     icon:"🏢",color:"#9c27b0",meaningAr:"دخول إلى مكان",pairs:[{sv:"войти",nsv:"входить",ar:"يدخل مشياً",en:"To enter on foot"},{sv:"въехать",nsv:"въезжать",ar:"يدخل بمركبة",en:"To drive in"},{sv:"влететь",nsv:"влетать",ar:"يدخل طيراً",en:"To fly in"}]},
  {key:"пере",  prefix:"пере-",  icon:"🌉",color:"#00bcd4",meaningAr:"عبور، انتقال",pairs:[{sv:"перейти",nsv:"переходить",ar:"يعبر مشياً",en:"To cross on foot"},{sv:"переехать",nsv:"переезжать",ar:"يعبر بمركبة",en:"To cross by vehicle"},{sv:"перелететь",nsv:"перелетать",ar:"يعبر طيراً",en:"To fly across"}]},
  {key:"по",    prefix:"по-",    icon:"🗺️",color:"#d4af37",meaningAr:"بداية حركة",pairs:[{sv:"пойти",nsv:"ходить",ar:"يبدأ بالمشي",en:"Start walking"},{sv:"поехать",nsv:"ездить",ar:"يبدأ بالسفر",en:"Start traveling"},{sv:"побежать",nsv:"бегать",ar:"يبدأ بالجري",en:"Start running"}]},
  {key:"до",    prefix:"до-",    icon:"🎯",color:"#e91e63",meaningAr:"الوصول إلى نهاية الطريق",pairs:[{sv:"дойти",nsv:"доходить",ar:"يصل مشياً",en:"Reach on foot"},{sv:"доехать",nsv:"доезжать",ar:"يصل بمركبة",en:"Reach by vehicle"},{sv:"долететь",nsv:"долетать",ar:"يصل طيراً",en:"Reach by air"}]},
];

// SRS Card States — من بنية SrsCard الحقيقية في التطبيق
// CardState: NEW, LEARNING, REVIEW, RELEARNING
// ReviewRating: AGAIN, HARD, GOOD, EASY  (FSRS-5)
const SRS_RATINGS = [
  {r:"again",label:"Again", labelAr:"من جديد",  color:"#f44336", emoji:"😣"},
  {r:"hard",  label:"Hard",  labelAr:"صعب",      color:"#ff9800", emoji:"😓"},
  {r:"good",  label:"Good",  labelAr:"جيد",      color:"#4a9eff", emoji:"😊"},
  {r:"easy",  label:"Easy",  labelAr:"سهل",      color:"#4caf50", emoji:"😄"},
];

// Phoneme categories — من شاشة PhonemeExplorerScreen
const PHONEME_GROUPS = [
  {id:"vowels",    titleAr:"الحروف المتحركة",    titleEn:"Vowels",          color:"#4a9eff",
    phonemes:[{ipa:"а",example:"мама",ar:"أ طويل"},{ipa:"е",example:"день",ar:"يَ"},{ipa:"и",example:"мир",ar:"إِي"},{ipa:"о",example:"дом",ar:"أو"},{ipa:"у",example:"буква",ar:"أو/وو"},{ipa:"ы",example:"рыба",ar:"إِ مميزة"},{ipa:"э",example:"это",ar:"إِ"},{ipa:"ю",example:"юг",ar:"يو"},{ipa:"я",example:"яблоко",ar:"يَا"},{ipa:"ё",example:"ёж",ar:"يو"}]},
  {id:"consonants",titleAr:"الحروف الساكنة",     titleEn:"Consonants",     color:"#e91e63",
    phonemes:[{ipa:"б",example:"банан",ar:"ب"},{ipa:"в",example:"вода",ar:"و/ف"},{ipa:"г",example:"год",ar:"غ/ك"},{ipa:"д",example:"дом",ar:"د"},{ipa:"ж",example:"жизнь",ar:"ج مفخمة"},{ipa:"з",example:"зима",ar:"ز"},{ipa:"к",example:"кот",ar:"ك"},{ipa:"л",example:"луна",ar:"ل"},{ipa:"м",example:"море",ar:"م"},{ipa:"н",example:"нос",ar:"ن"}]},
  {id:"soft",      titleAr:"التليين والتفخيم",   titleEn:"Soft/Hard Pairs", color:"#9c27b0",
    phonemes:[{ipa:"п/пь",example:"пол/поле",ar:"ب صلبة/لينة"},{ipa:"т/ть",example:"там/тема",ar:"ت صلبة/لينة"},{ipa:"н/нь",example:"нос/нет",ar:"ن صلبة/لينة"},{ipa:"л/ль",example:"луна/лес",ar:"ل صلبة/لينة"},{ipa:"р/рь",example:"рот/рис",ar:"ر صلبة/لينة"}]},
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
  const m={A1:"#4caf50",A2:"#ff9800",B1:"#f44336",B2:"#9c27b0",C1:"#e91e63",C2:"#d4af37"};
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
// FSRS-5 — محاكاة مبسّطة لحساب الفاصل الزمني (مستوحى من FsrsAlgorithm.kt)
function fsrsNextInterval(rating, currentInterval=1, stability=1){
  const multipliers={again:0.2, hard:0.8, good:1.4, easy:2.5};
  const base=Math.max(1, currentInterval * (multipliers[rating]||1));
  return Math.round(base * (0.9 + Math.random()*0.2));
}

// ══════════════════════════════════════════════════
//  SRS STATE — يعكس بنية SrsCard الحقيقية
// ══════════════════════════════════════════════════

const initSRS = ()=>({
  // CardState: NEW(0), LEARNING(1), REVIEW(2), RELEARNING(3)
  cards: WORDS.slice(0,20).map((w,i)=>({
    ...w,
    srsState: ['new','new','new','learning','learning','review'][Math.min(i%6,5)],
    due: i<8,
    stability: 1 + Math.random()*3,
    difficulty: 3 + Math.random()*4,
    interval: [0,0,0,1,3,7][Math.min(i%6,5)],
    reps: Math.floor(Math.random()*5),
  })),
  currentIdx:0,
  streak:7,
  totalXp: 1840,
  todayXp: 120,
  todayReviews:14,
  retentionRate: 91,
  leechCount: 3,
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
//  WORD CARD
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
            {word.frequency && <span style={{fontSize:11,color:"rgba(255,255,255,0.25)",fontFamily:"'JetBrains Mono',monospace"}}>#{word.frequency}</span>}
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
//  WORD DETAIL MODAL — يعكس شاشة WordDetailScreen
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
  const conj=word.conjugation;
  const decl=word.declension;
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
            {word.frequency&&<Badge color="rgba(255,255,255,0.4)">تكرار: {word.frequency}</Badge>}
          </div>
        </div>
        {/* Body */}
        <div style={{padding:"22px 28px"}}>
          {/* Meanings — يعكس جدول meanings */}
          <div style={{marginBottom:24}}>
            <div style={{fontSize:12,fontWeight:700,color:"#d4af37",letterSpacing:1,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              المعنى <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(212,175,55,0.3),transparent)"}}/>
            </div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"14px 18px"}}>
              <div style={{marginBottom:8}}>🇸🇦 <span style={{color:"rgba(255,255,255,0.85)",fontSize:15}}>{word.meaning_ar}</span></div>
              <div>🇬🇧 <span style={{color:"rgba(255,255,255,0.6)",fontSize:14}}>{word.meaning_en}</span></div>
            </div>
          </div>

          {/* Verb Conjugation — يعكس جدول verb_conjugations */}
          {conj&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f44336",letterSpacing:1,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                التصريف — {conj.infinitive} <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(244,67,54,0.3),transparent)"}}/>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr>
                      {["الضمير","المضارع","الماضي","الأمر"].map(h=>(
                        <th key={h} style={{background:"rgba(244,67,54,0.12)",color:"#f44336",padding:"8px 12px",textAlign:"center",border:"1px solid rgba(244,67,54,0.2)",fontSize:11,letterSpacing:0.5}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {pron:"أنا (я)",      pres:conj.pres1sg, past:conj.pastM,  imp:conj.impSg||"—"},
                      {pron:"أنتَ (ты)",    pres:conj.pres2sg, past:conj.pastM,  imp:conj.impSg||"—"},
                      {pron:"هو (он)",      pres:conj.pres3sg, past:conj.pastM,  imp:"—"},
                      {pron:"هي (она)",     pres:conj.pres3sg, past:conj.pastF,  imp:"—"},
                      {pron:"نحن (мы)",     pres:conj.pres1pl, past:conj.pastPl, imp:"—"},
                      {pron:"أنتم (вы)",   pres:conj.pres2pl, past:conj.pastPl, imp:conj.impPl||"—"},
                      {pron:"هم (они)",     pres:conj.pres3pl, past:conj.pastPl, imp:"—"},
                    ].map((row,i)=>(
                      <tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",fontSize:12}}>{row.pron}</td>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:"#f44336",textAlign:"center",fontWeight:600}}>{row.pres}</td>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:"rgba(255,255,255,0.6)",textAlign:"center"}}>{row.past}</td>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:"#ff9800",textAlign:"center"}}>{row.imp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Noun Declension — يعكس جدول noun_declensions */}
          {decl&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:"#4a9eff",letterSpacing:1,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                الإعراب — النموذج الكامل <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(74,158,255,0.3),transparent)"}}/>
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
                      {c:"الرفع — Им.",          sg:decl.singNom,  pl:decl.plurNom},
                      {c:"المضاف — Род.",         sg:decl.singGen,  pl:decl.plurGen},
                      {c:"غ.المباشر — Дат.",      sg:decl.singDat,  pl:decl.plurDat},
                      {c:"النصب — Вин.",          sg:decl.singAcc,  pl:decl.plurAcc},
                      {c:"الإفادة — Тв.",         sg:decl.singInst, pl:decl.plurInst},
                      {c:"الجر — Пр.",            sg:decl.singPrep, pl:decl.plurPrep},
                    ].map((row,i)=>(
                      <tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",fontSize:12}}>{row.c}</td>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:"#4a9eff",textAlign:"center",fontWeight:600}}>{row.sg||"—"}</td>
                        <td style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'JetBrains Mono',monospace",color:"rgba(255,255,255,0.6)",textAlign:"center"}}>{row.pl||"—"}</td>
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
  // قائمة التنقل — تعكس الشاشات الحقيقية في AppNavigation
  const items=[
    {id:"home",     ar:"الرئيسية",        en:"Home",          ru:"Главная"},
    {id:"categories",ar:"التصنيفات",      en:"Categories",    ru:"Категории"},
    {id:"srs",      ar:"المذاكرة الذكية",  en:"SRS Study",     ru:"Повторение"},
    {id:"grammar",  ar:"الإعراب",         en:"Grammar",       ru:"Грамматика"},
    {id:"motion",   ar:"أفعال الحركة",    en:"Motion Verbs",  ru:"Глаголы движения"},
    {id:"phonemes", ar:"النطق والصوتيات", en:"Pronunciation", ru:"Произношение"},
    {id:"favorites",ar:"المفضلة",         en:"Favorites",     ru:"Избранное"},
  ];
  const getLabel=(it)=>lang==="en"?it.en:lang==="ru"?it.ru:it.ar;
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:scrolled?"rgba(7,7,11,0.97)":"rgba(7,7,11,0.8)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"all 0.3s ease"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
        {/* Logo — اسم التطبيق الحقيقي */}
        <div onClick={()=>{setActive("home");setOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
          <span style={{fontSize:26}}>🇷🇺</span>
          <div>
            <div style={{fontSize:20,fontWeight:900,color:"#d4af37",fontFamily:"'JetBrains Mono',monospace",letterSpacing:2,lineHeight:1}}>RUSLEX</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:1,fontFamily:"'JetBrains Mono',monospace"}}>v{APP_VERSION}</div>
          </div>
        </div>
        {/* Desktop Links */}
        <div className="nav-desktop" style={{display:"flex",gap:2,alignItems:"center"}}>
          {items.map(it=>(
            <button key={it.id} onClick={()=>{setActive(it.id);setOpen(false);}} style={{
              background:active===it.id?"rgba(212,175,55,0.12)":"transparent",
              color:active===it.id?"#d4af37":"rgba(255,255,255,0.6)",
              border:"none",padding:"7px 12px",borderRadius:10,cursor:"pointer",
              fontSize:13,fontWeight:600,fontFamily:"'Tajawal',sans-serif",transition:"all 0.25s ease"
            }}>
              {getLabel(it)}
            </button>
          ))}
        </div>
        {/* Lang & Store */}
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
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="nav-desktop" style={{
            display:"inline-flex",alignItems:"center",gap:5,
            background:"rgba(76,175,80,0.1)",border:"1px solid rgba(76,175,80,0.25)",
            color:"rgba(76,175,80,0.9)",padding:"5px 12px",borderRadius:10,
            fontSize:12,fontWeight:600,fontFamily:"'Tajawal',sans-serif",
            textDecoration:"none",transition:"all 0.25s",marginRight:4
          }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(76,175,80,0.2)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(76,175,80,0.1)";}}>
            ▶ Google Play
          </a>
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="nav-desktop" style={{
            display:"inline-flex",alignItems:"center",gap:5,
            background:"rgba(212,175,55,0.07)",border:"1px solid rgba(212,175,55,0.2)",
            color:"rgba(212,175,55,0.8)",padding:"5px 12px",borderRadius:10,
            fontSize:12,fontWeight:600,fontFamily:"'Tajawal',sans-serif",
            textDecoration:"none",transition:"all 0.25s"
          }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,175,55,0.15)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(212,175,55,0.07)";}}>
            🔒 {lang==="en"?"Privacy":lang==="ru"?"Политика":"الخصوصية"}
          </a>
          <button className="nav-mobile-toggle" onClick={()=>setOpen(!open)} style={{background:"none",border:"none",color:"#d4af37",fontSize:22,cursor:"pointer",display:"none"}}>
            {open?"✕":"☰"}
          </button>
        </div>
      </div>
      {open&&(
        <div style={{padding:"8px 24px 20px",display:"flex",flexDirection:"column",gap:4,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          {items.map(it=>(
            <button key={it.id} onClick={()=>{setActive(it.id);setOpen(false);}} style={{
              background:active===it.id?"rgba(212,175,55,0.12)":"transparent",
              color:active===it.id?"#d4af37":"rgba(255,255,255,0.65)",
              border:"none",padding:"11px 16px",borderRadius:10,cursor:"pointer",
              fontSize:15,fontWeight:600,fontFamily:"'Tajawal',sans-serif",textAlign:"right",transition:"all 0.25s"
            }}>
              {lang==="en"?it.en:lang==="ru"?it.ru:it.ar}
            </button>
          ))}
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:6,color:"rgba(76,175,80,0.9)",padding:"11px 16px",borderRadius:10,fontSize:15,fontWeight:600,fontFamily:"'Tajawal',sans-serif",textDecoration:"none"}}>▶ {lang==="en"?"Get on Google Play":lang==="ru"?"Скачать в Google Play":"تحميل من Google Play"}</a>
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:6,color:"rgba(212,175,55,0.8)",padding:"11px 16px",borderRadius:10,fontSize:15,fontWeight:600,fontFamily:"'Tajawal',sans-serif",textDecoration:"none"}}>🔒 {lang==="en"?"Privacy Policy":lang==="ru"?"Политика конфиденциальности":"سياسة الخصوصية"}</a>
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
    ar:{
      badge:"📚 القاموس الروسي الاحترافي",
      title:"تعلّم الروسية\nبالطريقة الذكية",
      sub:"✦ RusLex — القاموس الروسي الشامل ✦",
      desc:"أكثر من 25,000 كلمة روسية مع المعاني بالعربية والإنجليزية، جداول التصريف والإعراب الكاملة، خوارزمية FSRS‑5 للتكرار المتباعد، دعم النطق الصوتي IPA، أفعال الحركة، والنطق التفاعلي.",
      btn1:"📂 استكشف التصنيفات",btn2:"🧠 ابدأ المذاكرة الذكية",
      w1:"كلمة روسية",w2:"حالة إعرابية",w3:"FSRS‑5",w4:"لغات مدعومة",
      features:[
        {icon:"📖",title:"قاموس غني 25K+",desc:"معاني بالعربية والإنجليزية، نطق IPA، تصريف الأفعال، وإعراب الأسماء الكامل",color:"#d4af37"},
        {icon:"🔁",title:"تكرار ذكي FSRS‑5",desc:"خوارزمية علمية تحسب الوقت الأمثل لمراجعة كل كلمة بناءً على أدائك الفعلي",color:"#4a9eff"},
        {icon:"📐",title:"نظام الإعراب الكامل",desc:"الحالات الست الإعرابية مع جداول التصريف الكاملة للأسماء والأفعال",color:"#9c27b0"},
        {icon:"🏃",title:"أفعال الحركة",desc:"أفعال الحركة الروسية مع جميع البادئات ومعانيها بشكل تفاعلي",color:"#ff9800"},
        {icon:"🎤",title:"النطق والصوتيات",desc:"مستكشف الصوتيات IPA، قسم الحركات والساكنات، تدريب على النطق",color:"#00bcd4"},
        {icon:"⬇️",title:"يعمل بدون إنترنت",desc:"قاعدة البيانات تُحمَّل مرة واحدة وتعمل بشكل كامل بدون اتصال بالإنترنت",color:"#4caf50"},
      ]
    },
    en:{
      badge:"📚 Professional Russian Dictionary",
      title:"Learn Russian\nThe Smart Way",
      sub:"✦ RusLex — Your Complete Russian Dictionary ✦",
      desc:"25,000+ Russian words with Arabic & English meanings, full conjugation & declension tables, FSRS‑5 spaced repetition, IPA pronunciation, motion verbs, and interactive phonetics.",
      btn1:"📂 Browse Categories",btn2:"🧠 Start Smart Study",
      w1:"Russian words",w2:"Grammar cases",w3:"FSRS‑5",w4:"Languages",
      features:[
        {icon:"📖",title:"Rich Dictionary 25K+",desc:"Arabic & English meanings, IPA pronunciation, full verb conjugation and noun declension tables",color:"#d4af37"},
        {icon:"🔁",title:"FSRS‑5 Smart Review",desc:"Science-based algorithm that calculates optimal review time based on your actual performance",color:"#4a9eff"},
        {icon:"📐",title:"Full Grammar System",desc:"All 6 grammatical cases with complete conjugation & declension tables for nouns and verbs",color:"#9c27b0"},
        {icon:"🏃",title:"Motion Verbs",desc:"Russian motion verbs with all prefixes and their meanings in an interactive format",color:"#ff9800"},
        {icon:"🎤",title:"Pronunciation & Phonetics",desc:"IPA phonetics explorer, vowels & consonants section, pronunciation training",color:"#00bcd4"},
        {icon:"⬇️",title:"Offline Ready",desc:"Database downloads once and works fully offline with no internet connection required",color:"#4caf50"},
      ]
    },
    ru:{
      badge:"📚 Профессиональный словарь",
      title:"Учись Русскому\nПо-Умному",
      sub:"✦ RusLex — Твой Русский Словарь ✦",
      desc:"Более 25,000 слов с переводом на арабский и английский, полные таблицы спряжения и склонения, алгоритм FSRS‑5, фонетика IPA, глаголы движения.",
      btn1:"📂 Категории",btn2:"🧠 Начать повторение",
      w1:"Слов в словаре",w2:"Падежей",w3:"FSRS‑5",w4:"Языков",
      features:[
        {icon:"📖",title:"Словарь 25K+",desc:"Перевод на арабский и английский, произношение IPA, спряжение глаголов, склонение существительных",color:"#d4af37"},
        {icon:"🔁",title:"FSRS‑5 повторение",desc:"Научный алгоритм рассчитывает оптимальное время повторения на основе вашего прогресса",color:"#4a9eff"},
        {icon:"📐",title:"Грамматика",desc:"Все 6 падежей с полными таблицами спряжения и склонения",color:"#9c27b0"},
        {icon:"🏃",title:"Глаголы движения",desc:"Глаголы движения со всеми приставками в интерактивном формате",color:"#ff9800"},
        {icon:"🎤",title:"Произношение",desc:"Проводник по фонетике IPA, гласные и согласные, тренировка произношения",color:"#00bcd4"},
        {icon:"⬇️",title:"Офлайн режим",desc:"База данных загружается один раз и работает полностью без интернета",color:"#4caf50"},
      ]
    },
  };
  const t=labels[lang]||labels.ar;
  return(
    <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 24px 60px",position:"relative",textAlign:"center"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(80px,16vw,170px)",fontWeight:900,color:"transparent",background:"linear-gradient(135deg,rgba(212,175,55,0.07),rgba(212,175,55,0.12),rgba(212,175,55,0.05))",WebkitBackgroundClip:"text",backgroundClip:"text",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-55%)",pointerEvents:"none",userSelect:"none",whiteSpace:"nowrap",letterSpacing:-5,lineHeight:1}}>
        РУССКИЙ
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:880,width:"100%"}}>
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
          <p style={{fontSize:16,color:"rgba(255,255,255,0.55)",margin:"0 auto 40px",maxWidth:600,lineHeight:1.85}}>
            {t.desc}
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:14,maxWidth:620,margin:"0 auto 40px"}}>
            <StatBox icon="📖" value="+25K" label={t.w1} color="#d4af37"/>
            <StatBox icon="🎯" value="6" label={t.w2} color="#4a9eff"/>
            <StatBox icon="🔁" value={t.w3} label="Algorithm" color="#9c27b0"/>
            <StatBox icon="🌍" value="3" label={t.w4} color="#4caf50"/>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
            <Btn primary onClick={()=>setActive("categories")}>{t.btn1}</Btn>
            <Btn outline onClick={()=>setActive("srs")}>{t.btn2}</Btn>
          </div>
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" style={{
            display:"inline-flex",alignItems:"center",gap:8,
            color:"rgba(76,175,80,0.85)",fontSize:14,fontWeight:600,
            fontFamily:"'Tajawal',sans-serif",textDecoration:"none",
            padding:"10px 22px",borderRadius:12,border:"1px solid rgba(76,175,80,0.25)",
            background:"rgba(76,175,80,0.08)",transition:"all 0.3s"
          }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(76,175,80,0.15)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(76,175,80,0.08)";}}>
            ▶ {lang==="en"?"Download on Google Play":lang==="ru"?"Скачать в Google Play":"تحميل من Google Play"}
          </a>
        </FadeIn>
      </div>

      {/* Feature grid */}
      <div style={{maxWidth:1200,width:"100%",padding:"60px 0 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:18}}>
          {t.features.map((f,i)=>(
            <FadeIn key={i} delay={0.6+i*0.07}>
              <Card gold={i===0} style={{textAlign:"center",padding:"32px 22px",height:"100%"}}>
                <div style={{fontSize:40,marginBottom:14}}>{f.icon}</div>
                <h3 style={{fontSize:16,fontWeight:800,color:f.color,margin:"0 0 10px",fontFamily:"'Tajawal',sans-serif"}}>{f.title}</h3>
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
  const[search,setSearch]=useState("");
  const getCatName=(c)=>lang==="en"?c.nameEn:lang==="ru"?c.nameRu:c.nameAr;
  const catWords=selectedCat
    ?WORDS.filter(w=>w.categoryId===selectedCat.id)
          .filter(w=>!search||(w.word.includes(search)||getMeaning(w,lang).includes(search)))
    :[];
  return(
    <section style={{padding:"80px 24px",maxWidth:1200,margin:"0 auto"}}>
      <SectionTitle
        title={lang==="en"?"Categories":lang==="ru"?"Категории":"التصنيفات"}
        sub={lang==="en"?"Browse 25,000+ words organized by topic":lang==="ru"?"25,000+ слов по темам":"تصفّح أكثر من 25,000 كلمة مُنظَّمة حسب الموضوع"}
        icon="📂"
      />
      {!selectedCat&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:16}}>
          {CATEGORIES.map((cat,i)=>(
            <FadeIn key={cat.id} delay={i*0.03}>
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
                  {cat.count.toLocaleString()}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
      {selectedCat&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22,flexWrap:"wrap"}}>
            <button onClick={()=>{setSelectedCat(null);setSearch("");}} style={{
              background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",
              color:"#fff",padding:"8px 18px",borderRadius:10,cursor:"pointer",
              fontSize:14,fontWeight:600,fontFamily:"'Tajawal',sans-serif",
              display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.2s"
            }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
              ← {lang==="en"?"Back":lang==="ru"?"Назад":"رجوع"}
            </button>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:32}}>{selectedCat.icon}</span>
              <h3 style={{fontSize:22,fontWeight:800,color:selectedCat.color,margin:0,fontFamily:"'Tajawal',sans-serif"}}>{getCatName(selectedCat)}</h3>
              <Badge color={selectedCat.color}>{catWords.length} {lang==="en"?"words":lang==="ru"?"слов":"كلمة"}</Badge>
            </div>
          </div>
          {/* Search within category */}
          <div style={{marginBottom:20}}>
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={lang==="en"?"Search in category...":lang==="ru"?"Поиск...":"ابحث في التصنيف..."}
              style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 18px",color:"#fff",fontSize:14,fontFamily:"'Tajawal',sans-serif",outline:"none",boxSizing:"border-box",direction:"rtl"}}
            />
          </div>
          {catWords.length>0
            ?catWords.map(w=><FadeIn key={w.id}><WordCard word={w} lang={lang} favorites={favorites} onToggleFav={onToggleFav} onOpen={onOpenWord}/></FadeIn>)
            :<div style={{textAlign:"center",padding:"60px 24px",color:"rgba(255,255,255,0.3)",fontSize:16}}>
              <div style={{fontSize:64,marginBottom:16,opacity:0.2}}>📭</div>
              {lang==="en"?"No words found":lang==="ru"?"Слова не найдены":"لا توجد كلمات"}
            </div>
          }
        </div>
      )}
    </section>
  );
}

// ══════════════════════════════════════════════════
//  SRS SECTION — يعكس SrsDashboardScreen + SrsStudyScreen
//  بما في ذلك: FSRS-5, XP, Streak, Leech, Skill Performance
// ══════════════════════════════════════════════════

function SRS({lang}){
  const[srs,setSrs]=useState(initSRS);
  const[revealed,setRevealed]=useState(false);
  const[tab,setTab]=useState("study"); // study | dashboard

  const dueCards=srs.cards.filter(c=>c.due||c.srsState==='new'||c.srsState==='learning');
  const mastered=srs.cards.filter(c=>c.srsState==='review').length;
  const newCount=srs.cards.filter(c=>c.srsState==='new').length;
  const learningCount=srs.cards.filter(c=>c.srsState==='learning').length;
  const total=srs.cards.length;
  const currentCard=dueCards[Math.min(srs.currentIdx,dueCards.length-1)];
  const readyToStudy=dueCards.length;

  function revealCard(){setRevealed(true);}
  function rateCard(rating){
    setSrs(prev=>{
      const cards=[...prev.cards];
      const cardIdx=cards.findIndex(c=>c.id===currentCard?.id);
      if(cardIdx>=0){
        const card=cards[cardIdx];
        const newInterval=fsrsNextInterval(rating, card.interval, card.stability);
        const newState=rating==='easy'||rating==='good'?'review':rating==='hard'?'learning':'new';
        const xpGain={again:1,hard:3,good:5,easy:8}[rating]||0;
        cards[cardIdx]={...card,due:false,srsState:newState,interval:newInterval,reps:card.reps+1};
        const newDue=cards.filter(c=>c.due||c.srsState==='new'||c.srsState==='learning');
        const nextIdx=prev.currentIdx+1>=newDue.length?0:prev.currentIdx+1;
        return{...prev,cards,currentIdx:nextIdx,todayReviews:prev.todayReviews+1,todayXp:prev.todayXp+xpGain,totalXp:prev.totalXp+xpGain};
      }
      return prev;
    });
    setRevealed(false);
  }

  const t={
    ar:{
      dashboard:"لوحة التحكم", study:"المذاكرة",
      totalCards:"إجمالي البطاقات", due:"للمراجعة الآن", mastered:"كلمات متقنة",
      streak:"سلسلة الأيام", retention:"نسبة الاحتفاظ", todayXp:"XP اليوم",
      totalXp:"إجمالي XP", leech:"كلمات صعبة", newCards:"جديدة", learning:"قيد التعلم",
      session:"جلسة مراجعة", reveal:"اضغط لإظهار المعنى", allDone:"أحسنت! لا مراجعات اليوم",
      fsrsInfo:"خوارزمية FSRS‑5 تحسب الوقت الأمثل للمراجعة",
    },
    en:{
      dashboard:"Dashboard", study:"Study",
      totalCards:"Total Cards", due:"Due Now", mastered:"Mastered",
      streak:"Day Streak", retention:"Retention", todayXp:"Today XP",
      totalXp:"Total XP", leech:"Leech Cards", newCards:"New", learning:"Learning",
      session:"Study Session", reveal:"Tap to reveal", allDone:"All done! No reviews today",
      fsrsInfo:"FSRS‑5 algorithm calculates optimal review intervals",
    },
    ru:{
      dashboard:"Дашборд", study:"Учёба",
      totalCards:"Всего карточек", due:"К повторению", mastered:"Изученных",
      streak:"Серия дней", retention:"Запоминаемость", todayXp:"XP сегодня",
      totalXp:"Всего XP", leech:"Сложные слова", newCards:"Новых", learning:"Изучается",
      session:"Сессия повторения", reveal:"Нажмите, чтобы показать", allDone:"Готово! Нет повторений сегодня",
      fsrsInfo:"Алгоритм FSRS‑5 рассчитывает оптимальные интервалы",
    },
  }[lang]||{};

  const statItems=[
    {label:t.totalCards, val:total,          color:"#4a9eff",  icon:"🃏"},
    {label:t.newCards,   val:newCount,        color:"#00bcd4",  icon:"✨"},
    {label:t.learning,   val:learningCount,   color:"#ff9800",  icon:"📚"},
    {label:t.mastered,   val:mastered,        color:"#4caf50",  icon:"✅"},
    {label:t.streak,     val:`🔥${srs.streak}`,color:"#ff6b35", icon:"🔥"},
    {label:t.todayXp,    val:`⚡${srs.todayXp}`,color:"#d4af37",icon:"⚡"},
    {label:t.totalXp,    val:srs.totalXp,     color:"#9c27b0",  icon:"🏆"},
    {label:t.leech,      val:srs.leechCount,  color:"#e91e63",  icon:"🔴"},
  ];

  return(
    <section style={{padding:"80px 24px",maxWidth:900,margin:"0 auto"}}>
      <SectionTitle
        title={lang==="en"?"Spaced Repetition (SRS)":lang==="ru"?"Интервальное повторение":"المذاكرة المتباعدة (SRS)"}
        sub={t.fsrsInfo}
        icon="🧠"
      />

      {/* Tab switch */}
      <div style={{display:"flex",gap:8,marginBottom:28,borderBottom:"1px solid rgba(255,255,255,0.07)",paddingBottom:0}}>
        {["dashboard","study"].map(tabKey=>(
          <button key={tabKey} onClick={()=>setTab(tabKey)} style={{
            background:"none",border:"none",cursor:"pointer",
            padding:"12px 22px",fontSize:15,fontWeight:700,
            fontFamily:"'Tajawal',sans-serif",
            color:tab===tabKey?"#d4af37":"rgba(255,255,255,0.5)",
            borderBottom:tab===tabKey?"2px solid #d4af37":"2px solid transparent",
            transition:"all 0.25s",marginBottom:-1
          }}>{tabKey==="dashboard"?t.dashboard:t.study}</button>
        ))}
      </div>

      {tab==="dashboard"&&(
        <>
          {/* Stats grid */}
          <FadeIn>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:24}}>
              {statItems.map((s,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"20px",textAlign:"center"}}>
                  <div style={{fontSize:28,marginBottom:4}}>{s.icon}</div>
                  <div style={{fontSize:30,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:s.color,lineHeight:1.1}}>{s.val}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:6,fontFamily:"'Tajawal',sans-serif"}}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Retention + Streak bar */}
          <FadeIn delay={0.1}>
            <Card gold style={{marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,flexWrap:"wrap",padding:"22px 28px"}}>
              <div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:4}}>{t.retention}</div>
                <div style={{fontSize:32,fontWeight:900,color:"#d4af37",fontFamily:"'JetBrains Mono',monospace"}}>{srs.retentionRate}%</div>
              </div>
              <div style={{flex:1,minWidth:180}}>
                <div style={{background:"rgba(255,255,255,0.08)",borderRadius:50,height:10,overflow:"hidden"}}>
                  <div style={{width:`${srs.retentionRate}%`,height:"100%",background:"linear-gradient(90deg,#d4af37,#e8cc6a)",borderRadius:50}}/>
                </div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:6,fontFamily:"'JetBrains Mono',monospace"}}>FSRS‑5 • Desired Retention 90%</div>
              </div>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:50,fontSize:15,fontWeight:800,background:"rgba(255,107,53,0.12)",color:"#ff6b35",border:"1px solid rgba(255,107,53,0.25)"}}>
                🔥 {srs.streak} {lang==="en"?"days":lang==="ru"?"дней":"يوم"}
              </div>
            </Card>
          </FadeIn>

          {/* Aspect pairs teaser */}
          <FadeIn delay={0.2}>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.7)",marginBottom:12,fontFamily:"'Tajawal',sans-serif"}}>
                {lang==="en"?"Aspect Pairs (Perfective / Imperfective)":lang==="ru"?"Видовые пары (сов./несов.)":"أزواج الأفعال (الكامل / الناقص)"}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {ASPECT_PAIRS_EXAMPLES.map((ap,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#4caf50",fontSize:13,fontWeight:700}}>{ap.perfective}</span>
                    <span style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>↔</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#f44336",fontSize:13,fontWeight:700}}>{ap.imperfective}</span>
                    <span style={{color:"rgba(255,255,255,0.4)",fontSize:12,fontFamily:"'Tajawal',sans-serif"}}>{lang==="en"?ap.en:ap.ar}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Btn primary onClick={()=>setTab("study")} full>
              {lang==="en"?`Start Studying (${readyToStudy} cards)`:lang==="ru"?`Начать (${readyToStudy} карточек)`:`ابدأ المذاكرة (${readyToStudy} بطاقة)`}
            </Btn>
          </FadeIn>
        </>
      )}

      {tab==="study"&&(
        <FadeIn>
          {dueCards.length===0?(
            <div style={{textAlign:"center",padding:"80px 24px"}}>
              <div style={{fontSize:80,marginBottom:20,opacity:0.8}}>🎉</div>
              <div style={{fontSize:22,color:"rgba(255,255,255,0.7)",fontFamily:"'Tajawal',sans-serif"}}>{t.allDone}</div>
              <div style={{marginTop:20}}>
                <Btn outline onClick={()=>setTab("dashboard")}>{t.dashboard}</Btn>
              </div>
            </div>
          ):(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:8}}>
                <h3 style={{fontSize:17,fontWeight:700,color:"rgba(255,255,255,0.8)",margin:0,fontFamily:"'Tajawal',sans-serif"}}>{t.session}</h3>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontFamily:"'JetBrains Mono',monospace"}}>{Math.min(srs.currentIdx+1,dueCards.length)} / {dueCards.length}</span>
                  <Badge color="#ff6b35">🔥 {srs.streak}</Badge>
                  <Badge color="#d4af37">⚡ {srs.todayXp} XP</Badge>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:50,height:4,marginBottom:24,overflow:"hidden"}}>
                <div style={{width:`${((srs.currentIdx)/dueCards.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#d4af37,#4caf50)",borderRadius:50,transition:"width 0.4s ease"}}/>
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
                    <div style={{fontSize:52,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:"#fff",marginBottom:4}}>{currentCard.word}</div>
                    {currentCard.ipa&&<div style={{fontSize:14,color:"rgba(212,175,55,0.6)",fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>{currentCard.ipa}</div>}
                    <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}>
                      <Badge color={getLevelColor(currentCard.level)}>{currentCard.level}</Badge>
                      <Badge color={getPosColor(currentCard.pos)}>{getPosLabel(currentCard.pos,lang)}</Badge>
                      <Badge color="rgba(255,255,255,0.3)" bg="rgba(255,255,255,0.04)">
                        {currentCard.srsState} · ×{currentCard.reps}
                      </Badge>
                    </div>
                    {!revealed&&<div style={{fontSize:14,color:"rgba(255,255,255,0.4)",fontFamily:"'Tajawal',sans-serif"}}>{t.reveal}</div>}
                    {revealed&&(
                      <>
                        <div style={{fontSize:24,color:"#d4af37",fontWeight:700,marginBottom:8,fontFamily:"'Tajawal',sans-serif"}}>{getMeaning(currentCard,lang)}</div>
                        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:32,fontFamily:"'JetBrains Mono',monospace"}}>
                          interval: {currentCard.interval}d · stability: {currentCard.stability.toFixed(1)}
                        </div>
                        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                          {SRS_RATINGS.map(({r,label,labelAr,color,emoji})=>(
                            <button key={r} onClick={(e)=>{e.stopPropagation();rateCard(r);}} style={{
                              padding:"12px 22px",borderRadius:12,border:`1px solid ${color}44`,
                              background:`${color}18`,color,
                              fontSize:14,fontWeight:700,fontFamily:"'Tajawal',sans-serif",cursor:"pointer",
                              transition:"all 0.25s",display:"flex",flexDirection:"column",alignItems:"center",gap:2
                            }}
                              onMouseEnter={e=>{e.currentTarget.style.background=`${color}30`;e.currentTarget.style.transform="translateY(-2px)";}}
                              onMouseLeave={e=>{e.currentTarget.style.background=`${color}18`;e.currentTarget.style.transform="none";}}>
                              <span style={{fontSize:18}}>{emoji}</span>
                              <span>{lang==="en"?label:labelAr}</span>
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
      )}
    </section>
  );
}

// ══════════════════════════════════════════════════
//  GRAMMAR SECTION — يعكس DeclensionScreen
// ══════════════════════════════════════════════════

function Grammar({lang}){
  const[filter,setFilter]=useState("all");
  const lessons=filter==="all"?DECL_LESSONS:DECL_LESSONS.filter(l=>l.case===filter);
  const chips=[
    {key:"all",label:lang==="en"?"All":lang==="ru"?"Все":"الكل",color:"#2196f3"},
    {key:"nominative",  label:"Именительный (Ном.)",  color:"#2196f3"},
    {key:"genitive",    label:"Родительный (Род.)",   color:"#e91e63"},
    {key:"dative",      label:"Дательный (Дат.)",     color:"#4caf50"},
    {key:"accusative",  label:"Винительный (Вин.)",   color:"#ff9800"},
    {key:"instrumental",label:"Творительный (Тв.)",   color:"#9c27b0"},
    {key:"prepositional",label:"Предложный (Пр.)",    color:"#00bcd4"},
  ];
  return(
    <section style={{padding:"80px 24px",maxWidth:1100,margin:"0 auto"}}>
      <SectionTitle
        title={lang==="en"?"Russian Declension System":lang==="ru"?"Система падежей":"نظام الإعراب الروسي"}
        sub={lang==="en"?"The 6 grammatical cases with full endings tables":lang==="ru"?"6 падежей с полными таблицами окончаний":"الحالات الست الإعرابية مع جداول النهايات الكاملة"}
        icon="📐"
      />
      <FadeIn>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:32}}>
          {chips.map(c=>(
            <button key={c.key} onClick={()=>setFilter(c.key)} style={{
              padding:"6px 14px",borderRadius:50,fontSize:11,fontWeight:700,cursor:"pointer",
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
              <div style={{fontSize:18,fontWeight:800,color:l.color,fontFamily:"'JetBrains Mono',monospace"}}>{l.titleAr}</div>
            </div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:6,fontFamily:"'Tajawal',sans-serif"}}>{l.question}</div>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:14,lineHeight:1.7,marginBottom:20,fontFamily:"'Tajawal',sans-serif"}}>{l.desc}</p>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,color:l.color,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>
                {lang==="en"?"Examples":lang==="ru"?"Примеры":"أمثلة"}
              </div>
              {l.examples.map((ex,j)=>(
                <div key={j} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 16px",marginBottom:8,borderRight:`2px solid ${l.color}55`,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:600,color:"#fff"}}>{ex.ru}</div>
                  <button onClick={()=>speak(ex.ru)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",fontSize:12,padding:"0 4px",transition:"color 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.color="#d4af37"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}>🔊</button>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontFamily:"'Tajawal',sans-serif"}}>{ex.ar}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,fontWeight:700,color:l.color,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>
              {lang==="en"?"Endings":lang==="ru"?"Окончания":"النهايات"}
            </div>
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
//  MOTION VERBS SECTION — يعكس MotionVerbsScreen
// ══════════════════════════════════════════════════

function Motion({lang}){
  const[activeKey,setActiveKey]=useState(null);
  const activePref=PREFIXES.find(p=>p.key===activeKey);
  return(
    <section style={{padding:"80px 24px",maxWidth:1100,margin:"0 auto"}}>
      <SectionTitle
        title={lang==="en"?"Motion Verbs":lang==="ru"?"Глаголы движения":"أفعال الحركة"}
        sub={lang==="en"?"Russian motion verbs with prefixes — perfective & imperfective pairs":lang==="ru"?"Глаголы движения с приставками — пары совершенного и несовершенного вида":"أفعال الحركة الروسية مع البادئات — الفعل الكامل والناقص"}
        icon="🏃"
      />
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
      {activePref&&(
        <FadeIn>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
              <button onClick={()=>setActiveKey(null)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"7px 16px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Tajawal',sans-serif",transition:"all 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>← {lang==="en"?"All":lang==="ru"?"Все":"الكل"}</button>
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
//  PHONEMES SECTION — يعكس PhonemeExplorerScreen
// ══════════════════════════════════════════════════

function Phonemes({lang}){
  const[activeGroup,setActiveGroup]=useState("vowels");
  const group=PHONEME_GROUPS.find(g=>g.id===activeGroup)||PHONEME_GROUPS[0];
  return(
    <section style={{padding:"80px 24px",maxWidth:1100,margin:"0 auto"}}>
      <SectionTitle
        title={lang==="en"?"Pronunciation & Phonetics":lang==="ru"?"Произношение и фонетика":"النطق والصوتيات"}
        sub={lang==="en"?"IPA phonetics explorer — vowels, consonants, soft/hard pairs":lang==="ru"?"Проводник по фонетике IPA — гласные, согласные, твёрдые/мягкие пары":"مستكشف الصوتيات IPA — الحروف المتحركة والساكنة والأزواج الصلبة/اللينة"}
        icon="🎤"
      />
      <FadeIn>
        <div style={{display:"flex",gap:10,marginBottom:32,flexWrap:"wrap"}}>
          {PHONEME_GROUPS.map(g=>(
            <button key={g.id} onClick={()=>setActiveGroup(g.id)} style={{
              padding:"8px 20px",borderRadius:50,fontSize:13,fontWeight:700,cursor:"pointer",
              background:activeGroup===g.id?`${g.color}22`:"rgba(255,255,255,0.04)",
              color:activeGroup===g.id?g.color:"rgba(255,255,255,0.55)",
              border:activeGroup===g.id?`1px solid ${g.color}55`:"1px solid rgba(255,255,255,0.08)",
              fontFamily:"'Tajawal',sans-serif",transition:"all 0.25s"
            }}>
              {lang==="en"?g.titleEn:g.titleAr}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:12}}>
          {group.phonemes.map((ph,i)=>(
            <FadeIn key={i} delay={i*0.03}>
              <div
                onClick={()=>speak(ph.example)}
                style={{
                  background:"rgba(255,255,255,0.04)",border:`1px solid ${group.color}33`,
                  borderRadius:16,padding:"20px 14px",textAlign:"center",cursor:"pointer",
                  transition:"all 0.3s"
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${group.color}18`;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 8px 24px ${group.color}22`;}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}
              >
                <div style={{fontSize:32,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:group.color,marginBottom:8}}>{ph.ipa}</div>
                <div style={{fontSize:13,fontFamily:"'JetBrains Mono',monospace",color:"rgba(255,255,255,0.65)",marginBottom:4}}>{ph.example}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontFamily:"'Tajawal',sans-serif"}}>{ph.ar}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",marginTop:4}}>🔊 اضغط للنطق</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div style={{marginTop:32,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"20px 24px"}}>
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)",marginBottom:12,fontFamily:"'Tajawal',sans-serif"}}>
            {lang==="en"?"IPA Quick Reference":lang==="ru"?"Краткий справочник IPA":"مرجع IPA السريع"}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {["а→[a]","е→[je]","ё→[jo]","и→[i]","о→[o]","у→[u]","ы→[ɨ]","э→[e]","ю→[ju]","я→[ja]","ж→[ʐ]","ш→[ʂ]","щ→[ɕ]","ч→[tɕ]","ц→[ts]","х→[x]","й→[j]"].map(s=>(
              <span key={s} style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#d4af37",background:"rgba(212,175,55,0.08)",padding:"4px 10px",borderRadius:8,border:"1px solid rgba(212,175,55,0.2)"}}>{s}</span>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

// ══════════════════════════════════════════════════
//  FAVORITES SECTION — يعكس FavoritesScreen
// ══════════════════════════════════════════════════

function Favorites({lang,favorites,onToggleFav,onOpenWord}){
  const favWords=WORDS.filter(w=>favorites.has(w.id));
  return(
    <section style={{padding:"80px 24px",maxWidth:780,margin:"0 auto"}}>
      <SectionTitle title={lang==="en"?"Favorites":lang==="ru"?"Избранное":"المفضلة"} icon="❤️"/>
      {favWords.length===0?(
        <div style={{textAlign:"center",padding:"80px 24px"}}>
          <div style={{fontSize:80,opacity:0.15,marginBottom:22}}>🤍</div>
          <div style={{fontSize:17,color:"rgba(255,255,255,0.35)",fontFamily:"'Tajawal',sans-serif"}}>
            {lang==="en"?"No favorites yet — tap ❤️ on any word":lang==="ru"?"Избранного нет — нажмите ❤️ на любое слово":"لا توجد مفضلة بعد — اضغط ❤️ على أي كلمة"}
          </div>
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
      <div style={{color:"#d4af37",fontSize:17,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",letterSpacing:2,marginBottom:4}}>RUSLEX</div>
      <div style={{color:"rgba(255,255,255,0.25)",fontSize:12,fontFamily:"'JetBrains Mono',monospace",marginBottom:16}}>v{APP_VERSION} · {PACKAGE_NAME}</div>
      <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap",marginBottom:16}}>
        <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" style={{
          display:"inline-flex",alignItems:"center",gap:6,
          color:"rgba(76,175,80,0.85)",fontSize:14,fontWeight:600,
          fontFamily:"'Tajawal',sans-serif",textDecoration:"none",
          padding:"8px 18px",borderRadius:10,
          border:"1px solid rgba(76,175,80,0.25)",background:"rgba(76,175,80,0.08)",
          transition:"color 0.2s"
        }}
          onMouseEnter={e=>e.currentTarget.style.color="rgba(76,175,80,1)"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(76,175,80,0.85)"}>
          ▶ Google Play
        </a>
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" style={{
          display:"inline-flex",alignItems:"center",gap:6,
          color:"rgba(212,175,55,0.75)",fontSize:14,fontWeight:600,
          fontFamily:"'Tajawal',sans-serif",textDecoration:"none",
          transition:"color 0.2s",padding:"8px 18px",borderRadius:10,
          border:"1px solid rgba(212,175,55,0.2)",background:"rgba(212,175,55,0.06)"
        }}
          onMouseEnter={e=>e.currentTarget.style.color="#d4af37"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(212,175,55,0.75)"}>
          🔒 {lang==="en"?"Privacy Policy":lang==="ru"?"Политика конфиденциальности":"سياسة الخصوصية"}
        </a>
      </div>
      <div style={{color:"rgba(255,255,255,0.25)",fontSize:13,fontFamily:"'Tajawal',sans-serif"}}>
        © 2026 <span style={{color:"#d4af37"}}>RusLex</span> · {lang==="en"?"Comprehensive Russian Dictionary | Built with ❤️ for Arabic learners":lang==="ru"?"Полный словарь русского языка | Создано с ❤️":"القاموس الروسي الشامل | صُمِّم بـ ❤️ للمتعلمين العرب"}
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
      if(next.has(id)){next.delete(id);showToast(lang==="en"?"Removed from favorites":lang==="ru"?"Удалено из избранного":"تم الإزالة من المفضلة","💔");}
      else{next.add(id);showToast(lang==="en"?"Added to favorites":lang==="ru"?"Добавлено в избранное":"تمت الإضافة للمفضلة","❤️");}
      return next;
    });
  }

  const renderSection=()=>{
    switch(active){
      case"categories":return<Categories lang={lang} favorites={favorites} onToggleFav={toggleFav} onOpenWord={setModalWord}/>;
      case"srs":       return<SRS lang={lang}/>;
      case"grammar":   return<Grammar lang={lang}/>;
      case"motion":    return<Motion lang={lang}/>;
      case"phonemes":  return<Phonemes lang={lang}/>;
      case"favorites": return<Favorites lang={lang} favorites={favorites} onToggleFav={toggleFav} onOpenWord={setModalWord}/>;
      default:         return<Hero setActive={setActive} lang={lang}/>;
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
        @media(max-width:900px){
          .nav-desktop{display:none !important;}
          .nav-mobile-toggle{display:block !important;}
        }
        @media(min-width:901px){
          .nav-mobile-toggle{display:none !important;}
        }
        section{overflow:hidden;width:100%;box-sizing:border-box;}
        img,iframe,video{max-width:100%;box-sizing:border-box;}
        input:focus{border-color:rgba(212,175,55,0.4) !important;box-shadow:0 0 0 3px rgba(212,175,55,0.1);}
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
