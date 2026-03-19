import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const USD_RATE = 3.65;
const MONTHLY_TARGET = 78000000;
const fmt = n => (!n || n === 0) ? "—" : "₪" + Number(n).toLocaleString("he-IL", { maximumFractionDigits: 0 });
const toILS = r => r.cur === "USD" ? r.amt * USD_RATE : r.amt;
const COLORS = ["#6366f1","#22d3ee","#10b981","#f59e0b","#f43f5e","#a78bfa","#34d399","#fb923c"];
const STATUS_COLOR = {"ממתין לפרעון":"#22d3ee","ממתין לתשלום":"#6366f1","אישור לקוח":"#f59e0b","נעילת חשבוניות":"#94a3b8","אישור מממן":"#a78bfa"};
const PROB_COLOR = {"גבוהה":"#10b981","גבוה":"#10b981","בינונית":"#f59e0b","בינוני":"#f59e0b","נמוכה":"#f43f5e","נמוך":"#f43f5e"};
const PROB_W = {"גבוהה":0.85,"גבוה":0.85,"בינונית":0.5,"בינוני":0.5,"נמוכה":0.2,"נמוך":0.2};

const raw = [
  {id:1447,client:"אלקטרה קמעונאות",supplier:"סינודן",funder:"דיסקונט",status:"ממתין לפרעון",amt:135329.83,cur:"ILS"},
  {id:1445,client:"אלקטרה קמעונאות",supplier:"מובייל בי.די.",funder:"דיסקונט",status:"ממתין לפרעון",amt:150632.2,cur:"ILS"},
  {id:1440,client:"אלקטרה קמעונאות",supplier:"מומדיה סחר",funder:"דיסקונט",status:"ממתין לפרעון",amt:118005.88,cur:"ILS"},
  {id:1444,client:"אלקטרה קמעונאות",supplier:"מובייל בי.די.",funder:"דיסקונט",status:"ממתין לפרעון",amt:635651.58,cur:"ILS"},
  {id:1443,client:"אלקטרה קמעונאות",supplier:"מובייל בי.די.",funder:"דיסקונט",status:"ממתין לפרעון",amt:1412932.87,cur:"ILS"},
  {id:1446,client:"אלקטרה קמעונאות",supplier:"סינודן",funder:"דיסקונט",status:"ממתין לפרעון",amt:234512.91,cur:"ILS"},
  {id:1439,client:"אלקטרה קמעונאות",supplier:"מומדיה סחר",funder:"דיסקונט",status:"ממתין לפרעון",amt:75241.68,cur:"ILS"},
  {id:1441,client:"אלקטרה קמעונאות",supplier:"ש.ה.ב חשמל",funder:"דיסקונט",status:"ממתין לפרעון",amt:1534,cur:"ILS"},
  {id:1438,client:"קבוצת גולף",supplier:"קרגל",funder:"דיסקונט",status:"ממתין לפרעון",amt:76164.04,cur:"ILS"},
  {id:1442,client:"אפקון בקרה",supplier:"שריון תשתיות",funder:"דיסקונט",status:"ממתין לפרעון",amt:173944.45,cur:"ILS"},
  {id:1454,client:"אדמה אגן",supplier:"קרולף",funder:"דיסקונט",status:"ממתין לפרעון",amt:24900,cur:"USD"},
  {id:1452,client:"אדמה אגן",supplier:"י.כ. יהלום",funder:"דיסקונט",status:"ממתין לפרעון",amt:94742.52,cur:"ILS"},
  {id:1453,client:"אדמה אגן",supplier:"הרן שינוע מטענים",funder:"דיסקונט",status:"ממתין לפרעון",amt:379046.68,cur:"ILS"},
  {id:1459,client:"אלקטרה קמעונאות",supplier:"קנט-לי",funder:"דיסקונט",status:"ממתין לפרעון",amt:403.01,cur:"ILS"},
  {id:1457,client:"אלקטרה קמעונאות",supplier:"קנט-לי",funder:"דיסקונט",status:"ממתין לפרעון",amt:143142.89,cur:"ILS"},
  {id:1456,client:"אדמה מכתשים",supplier:"א.ש. אמירים",funder:"דיסקונט",status:"ממתין לפרעון",amt:101913.46,cur:"ILS"},
  {id:1455,client:"אדמה מכתשים",supplier:"אנגיפלס פלסטיקה",funder:"דיסקונט",status:"ממתין לפרעון",amt:1758.2,cur:"ILS"},
  {id:1458,client:"אלקטרה קמעונאות",supplier:"קנט-לי",funder:"דיסקונט",status:"ממתין לפרעון",amt:56323.13,cur:"ILS"},
  {id:1466,client:"אלקטרה קמעונאות",supplier:"קמפוס לדפוס",funder:"דיסקונט",status:"ממתין לפרעון",amt:48474.28,cur:"ILS"},
  {id:1468,client:"אלקטרה קמעונאות",supplier:"קמפוס לדפוס",funder:"דיסקונט",status:"ממתין לתשלום",amt:183372,cur:"ILS"},
  {id:1469,client:"אלקטרה קמעונאות",supplier:"ש.ה.ב חשמל",funder:"דיסקונט",status:"ממתין לתשלום",amt:7327.8,cur:"ILS"},
  {id:1470,client:"אפקון בקרה",supplier:"נור מ.ש.",funder:"דיסקונט",status:"ממתין לתשלום",amt:353849.26,cur:"ILS"},
  {id:1471,client:"א.ל ספורט",supplier:"ש.ה.ב חשמל",funder:"דיסקונט",status:"ממתין לתשלום",amt:4082.8,cur:"ILS"},
  {id:1473,client:"אלקטרה קמעונאות",supplier:"דורי הום",funder:"דיסקונט",status:"ממתין לתשלום",amt:25720.98,cur:"ILS"},
  {id:1472,client:"אפקון החזקות",supplier:"גרינליף מערכות",funder:"דיסקונט",status:"ממתין לתשלום",amt:2360000,cur:"ILS"},
  {id:1372,client:"אלקטרה קמעונאות",supplier:"יעד סחר ומיתוג",funder:"דיסקונט",status:"ממתין לפרעון",amt:3191.99,cur:"ILS"},
  {id:1371,client:"אלקטרה קמעונאות",supplier:"יעד סחר ומיתוג",funder:"דיסקונט",status:"ממתין לפרעון",amt:89042.98,cur:"ILS"},
  {id:1378,client:"אדמה אגן",supplier:"הרן שינוע מטענים",funder:"דיסקונט",status:"ממתין לפרעון",amt:341709.12,cur:"ILS"},
  {id:1373,client:"אלקטרה קמעונאות",supplier:"י.א סחר",funder:"דיסקונט",status:"ממתין לפרעון",amt:25821.5,cur:"ILS"},
  {id:1382,client:"יס",supplier:"אחלה טי.וי",funder:"דיסקונט",status:"ממתין לפרעון",amt:2560632,cur:"ILS"},
  {id:1377,client:"אדמה אגן",supplier:"קרולף",funder:"דיסקונט",status:"ממתין לפרעון",amt:27140,cur:"USD"},
  {id:1390,client:"אלקטרה קמעונאות",supplier:"טלגיא אחזקות",funder:"דיסקונט",status:"ממתין לפרעון",amt:148919.98,cur:"ILS"},
  {id:1392,client:"אלקטרה קמעונאות",supplier:"או.אי.גי. שיווק",funder:"דיסקונט",status:"ממתין לפרעון",amt:153315.14,cur:"ILS"},
  {id:1370,client:"אלקטרה מוצרי צריכה",supplier:"אור אבטחת איכות",funder:"דיסקונט",status:"ממתין לפרעון",amt:1888,cur:"ILS"},
  {id:1396,client:"אדמה אגן",supplier:"משרד להובלה חוף אשדוד",funder:"דיסקונט",status:"ממתין לפרעון",amt:731025,cur:"ILS"},
  {id:1376,client:"גוד פארם",supplier:"גורי ע.ע.ע.",funder:"דיסקונט",status:"ממתין לפרעון",amt:676938.64,cur:"ILS"},
  {id:1402,client:"אדמה מכתשים",supplier:"אנגיפלס פלסטיקה",funder:"דיסקונט",status:"ממתין לפרעון",amt:117291.53,cur:"ILS"},
  {id:1405,client:"אדמה מכתשים",supplier:"משרד להובלה חוף אשדוד",funder:"דיסקונט",status:"ממתין לפרעון",amt:22595,cur:"ILS"},
  {id:1408,client:"אלקטרה קמעונאות",supplier:"אלפא רעות",funder:"דיסקונט",status:"ממתין לפרעון",amt:11800,cur:"ILS"},
  {id:1409,client:"אלקטרה קמעונאות",supplier:"קריסטלינו",funder:"דיסקונט",status:"ממתין לפרעון",amt:564639,cur:"ILS"},
  {id:1411,client:"אלקטרה קמעונאות",supplier:"קריסטלינו",funder:"דיסקונט",status:"ממתין לפרעון",amt:1782149.24,cur:"ILS"},
  {id:1412,client:"רמי שבירו",supplier:"הבונים אחים זועבי",funder:"דיסקונט",status:"ממתין לפרעון",amt:774211.29,cur:"ILS"},
  {id:1410,client:"אלקטרה קמעונאות",supplier:"קריסטלינו",funder:"דיסקונט",status:"ממתין לפרעון",amt:6079027.73,cur:"ILS"},
  {id:1415,client:"אלקטרה קמעונאות",supplier:"קנט-לי",funder:"דיסקונט",status:"ממתין לפרעון",amt:1209.44,cur:"ILS"},
  {id:1414,client:"אלקטרה קמעונאות",supplier:"קנט-לי",funder:"דיסקונט",status:"ממתין לפרעון",amt:329139.2,cur:"ILS"},
  {id:1413,client:"אלקטרה קמעונאות",supplier:"קנט-לי",funder:"דיסקונט",status:"ממתין לפרעון",amt:169571.01,cur:"ILS"},
  {id:1426,client:"אלקטרה קמעונאות",supplier:"רונלייט טכ",funder:"דיסקונט",status:"ממתין לפרעון",amt:113535.35,cur:"ILS"},
  {id:1401,client:"אלתא מערכות",supplier:"DCX-CHOL",funder:"דיסקונט",status:"ממתין לפרעון",amt:136320,cur:"USD"},
  {id:1427,client:"אלקטרה קמעונאות",supplier:"רונלייט טכ",funder:"דיסקונט",status:"ממתין לפרעון",amt:772498.04,cur:"ILS"},
  {id:1424,client:"קבוצת גולף",supplier:"ארזואן הסעות",funder:"דיסקונט",status:"ממתין לפרעון",amt:87580,cur:"ILS"},
  {id:1430,client:"אלקטרה קמעונאות",supplier:"שאוליאן סחר",funder:"דיסקונט",status:"ממתין לפרעון",amt:797363.56,cur:"ILS"},
  {id:1428,client:"גוד פארם",supplier:"אודם קוסמטיקה",funder:"דיסקונט",status:"ממתין לפרעון",amt:166177.08,cur:"ILS"},
  {id:1432,client:"רותם אמפרט",supplier:"חיים ישראלי ובניו",funder:"לאומי",status:"ממתין לפרעון",amt:896929.24,cur:"ILS"},
  {id:1431,client:"רותם אמפרט",supplier:"חיים ישראלי ובניו",funder:"לאומי",status:"ממתין לפרעון",amt:2620535.07,cur:"ILS"},
  {id:1433,client:"אפקון בקרה",supplier:"פלבר ניהול",funder:"דיסקונט",status:"ממתין לפרעון",amt:1586950.52,cur:"ILS"},
  {id:1449,client:"אלתא מערכות",supplier:"DCX-CHOL",funder:"דיסקונט",status:"נעילת חשבוניות",amt:186320,cur:"USD"},
  {id:1425,client:"א.א. מחלב",supplier:"הובלות עבדאללה",funder:"נימבל",status:"ממתין לפרעון",amt:94400,cur:"ILS"},
  {id:1400,client:"א.א. מחלב",supplier:"חוגיראת אמיר",funder:"נימבל",status:"ממתין לפרעון",amt:28886.4,cur:"ILS"},
  {id:1399,client:"א.א. מחלב",supplier:"זיתון חוסם",funder:"נימבל",status:"ממתין לפרעון",amt:92512,cur:"ILS"},
  {id:1423,client:"יהודה רשתות פלדה",supplier:"מטיילי ירון בר",funder:"נימבל",status:"ממתין לפרעון",amt:115202.93,cur:"ILS"},
  {id:1420,client:"עיריית באר שבע",supplier:"מטיילי ירון בר",funder:"נימבל",status:"ממתין לפרעון",amt:475960.56,cur:"ILS"},
  {id:1422,client:"יהודה פלדות",supplier:"מטיילי ירון בר",funder:"נימבל",status:"ממתין לפרעון",amt:136529.78,cur:"ILS"},
  {id:1397,client:"א.א. מחלב",supplier:"י.פ הובלות",funder:"נימבל",status:"ממתין לפרעון",amt:472283,cur:"ILS"},
  {id:1421,client:"יהודה גדרות",supplier:"מטיילי ירון בר",funder:"נימבל",status:"ממתין לפרעון",amt:47733.36,cur:"ILS"},
  {id:1467,client:"א.א. מחלב",supplier:"תו בי לי הובלות",funder:"נימבל",status:"ממתין לתשלום",amt:154344,cur:"ILS"},
  {id:1419,client:"א.א. מחלב",supplier:"בדראן חאלד",funder:"נימבל",status:"ממתין לפרעון",amt:27092.8,cur:"ILS"},
  {id:1387,client:"א.א. מחלב",supplier:"גבארה מוחמד",funder:"נימבל",status:"ממתין לפרעון",amt:30774,cur:"ILS"},
  {id:1395,client:"א.א. מחלב",supplier:"הובלות אסיה",funder:"נימבל",status:"ממתין לפרעון",amt:31340.8,cur:"ILS"},
  {id:1394,client:"קבוצת גולף",supplier:"עזאם אחמד",funder:"נימבל",status:"ממתין לפרעון",amt:76145.4,cur:"ILS"},
  {id:1393,client:"א.א. מחלב",supplier:"אבו גומעה עלי",funder:"נימבל",status:"ממתין לפרעון",amt:55082.4,cur:"ILS"},
  {id:1391,client:"א.א. מחלב",supplier:"אבו אלהווא",funder:"נימבל",status:"ממתין לפרעון",amt:63059.2,cur:"ILS"},
  {id:1389,client:"א.א. מחלב",supplier:"הובלות גובראן",funder:"נימבל",status:"ממתין לפרעון",amt:19021.6,cur:"ILS"},
  {id:1386,client:"א.א. מחלב",supplier:"סייד מחמד",funder:"נימבל",status:"ממתין לפרעון",amt:33040,cur:"ILS"},
  {id:1385,client:"א.א. מחלב",supplier:"עבודות קרינאוי",funder:"נימבל",status:"ממתין לפרעון",amt:13197,cur:"ILS"},
  {id:1383,client:"א.א. מחלב",supplier:"אבו לילה נדאל",funder:"נימבל",status:"ממתין לפרעון",amt:33606.4,cur:"ILS"},
  {id:1384,client:"א.א. מחלב",supplier:"מסארוה יאזן",funder:"נימבל",status:"ממתין לפרעון",amt:33984,cur:"ILS"},
  {id:1436,client:"א.א. מחלב",supplier:"סייד מחמד",funder:"נימבל",status:"ממתין לפרעון",amt:8260,cur:"ILS"},
  {id:1381,client:"א.א. מחלב",supplier:"א.מ הובלות",funder:"נימבל",status:"ממתין לפרעון",amt:55602,cur:"ILS"},
  {id:1451,client:"א.א. מחלב",supplier:"מועתז דרבאס",funder:"נימבל",status:"ממתין לפרעון",amt:14820,cur:"ILS"},
  {id:1406,client:"א.א. מחלב",supplier:"א.נ קונברטו",funder:"נימבל",status:"ממתין לפרעון",amt:50000,cur:"ILS"},
  {id:1403,client:"א.א. מחלב",supplier:"שווא מוסטפא",funder:"נימבל",status:"ממתין לפרעון",amt:19163,cur:"ILS"},
  {id:1429,client:"קבוצת גולף",supplier:"א.ס פרוייקטים",funder:"נימבל",status:"ממתין לפרעון",amt:118000,cur:"ILS"},
  {id:1461,client:"א.א. מחלב",supplier:"בדראן חאלד",funder:"נימבל",status:"ממתין לפרעון",amt:6773.2,cur:"ILS"},
  {id:1477,client:"מועצה מקומית חורפיש",supplier:"סמ - גד בנייה",funder:"מרכנתיל",status:"אישור מממן",amt:938476.2,cur:"ILS"},
  {id:1450,client:"אלתא מערכות",supplier:"DCX-CHOL",funder:"דיסקונט",status:"נעילת חשבוניות",amt:136320,cur:"USD"},
  {id:1448,client:"אלתא מערכות",supplier:"DCX-CHOL",funder:"דיסקונט",status:"נעילת חשבוניות",amt:136320,cur:"USD"},
  {id:1475,client:"התעשיה האוירית",supplier:"טאק תעשיות",funder:"דיסקונט",status:"אישור לקוח",amt:3080,cur:"ILS"},
  {id:1476,client:"התעשיה האוירית",supplier:"טאק תעשיות",funder:"דיסקונט",status:"אישור לקוח",amt:75900,cur:"ILS"},
  {id:1474,client:"התעשיה האוירית",supplier:"טאק תעשיות",funder:"דיסקונט",status:"אישור לקוח",amt:79592.4,cur:"ILS"},
  {id:1460,client:"התעשיה האוירית",supplier:"ביו פרמקס גרופ",funder:"דיסקונט",status:"אישור לקוח",amt:8210071.84,cur:"ILS"},
  {id:1465,client:"התעשיה האוירית",supplier:"קמפוס לדפוס",funder:"דיסקונט",status:"אישור לקוח",amt:13918.1,cur:"ILS"},
  {id:1464,client:"התעשיה האוירית",supplier:"קמפוס לדפוס",funder:"דיסקונט",status:"נעילת חשבוניות",amt:1286.2,cur:"ILS"},
];

const pipeline = [
  {manager:"כללי",client:"א.א. מחלב",supplier:"ד.נ מישלוחים",type:"ריברס",supStatus:"פעיל",expected:5664,prob:"בינונית"},
  {manager:"כללי",client:"אלקטרה קמעונאות",supplier:"ברימאג דיגיטל",type:"ריברס",supStatus:"פעיל",expected:5000000,prob:"בינונית"},
  {manager:"כללי",client:"אלקטרה קמעונאות",supplier:"שריג אלקטריק",type:"ריברס",supStatus:"פעיל",expected:5000000,prob:"בינונית"},
  {manager:"כללי",client:"אלקטרה קמעונאות",supplier:"קריסטלינו",type:"ריברס",supStatus:"פעיל",expected:1606990.86,prob:"בינונית"},
  {manager:"כללי",client:"אלקטרה קמעונאות",supplier:"סלימפרייס",type:"ריברס",supStatus:"פעיל",expected:361335.74,prob:"בינונית"},
  {manager:"כללי",client:"אלקטרה קמעונאות",supplier:"ניו ויזן הום",type:"ריברס",supStatus:"פעיל",expected:300000,prob:"בינונית"},
  {manager:"כללי",client:"שבירו",supplier:"בנק האבן",type:"ריברס",supStatus:"פעיל",expected:600000,prob:"בינונית"},
  {manager:"ליאון",client:"פארמה דיל",supplier:"ארגניה",type:"ריברס",supStatus:"פעיל",expected:500000,prob:"נמוכה"},
  {manager:"ליאון",client:"פארמה דיל",supplier:"לה בוטה",type:"ריברס",supStatus:"פעיל",expected:300000,prob:"נמוכה"},
  {manager:"ליאון",client:"תומר גלפנד",supplier:"דאינזון דמיטרי",type:"ריברס",supStatus:"בתהליך",expected:150000,prob:"נמוכה"},
  {manager:"אבי",client:"מילניום ולפמן",supplier:"משה כהן הובלות",type:"ריברס",supStatus:"פעיל",expected:45000,prob:"בינוני"},
  {manager:"אבי",client:"מילניום ולפמן",supplier:"מכולנוע",type:"ריברס",supStatus:"פעיל",expected:80000,prob:"בינוני"},
  {manager:"אבי",client:"מילניום ולפמן",supplier:"עידן 88",type:"ריברס",supStatus:"פעיל",expected:155000,prob:"בינוני"},
  {manager:"אבי",client:"שביט",supplier:"יונייטדקולור",type:"ריברס",supStatus:"פעיל",expected:64000,prob:"בינוני"},
  {manager:"אבי",client:"ל.ו תשתיות",supplier:"ל.ו תשתיות",type:"פקטורינג",supStatus:"פעיל",expected:1000000,prob:"גבוהה"},
  {manager:"אבי",client:"עפר השרון",supplier:"עפר השרון",type:"פקטורינג",supStatus:"פעיל",expected:16000000,prob:"בינוני"},
  {manager:"אבי",client:"שביט",supplier:"ירון בר",type:"ריברס",supStatus:"פעיל",expected:45000,prob:"בינוני"},
  {manager:"אבי",client:"תומר גלדפלד",supplier:"כח עבודה לתת",type:"ריברס",supStatus:"פעיל",expected:150000,prob:"גבוה"},
];

const active = raw.filter(r => r.status !== "נדחה" && r.amt > 0);
const totalAll = active.reduce((s,r) => s + toILS(r), 0);
const missing = MONTHLY_TARGET - totalAll;
const pctDone = (totalAll / MONTHLY_TARGET * 100).toFixed(1);
const TABS = ["סקירה","לפי תאגיד","לפי ספק","לפי מממן","Pipeline","כל הבקשות"];

export default function App() {
  const [tab, setTab] = useState("סקירה");
  const [clientFilter, setClientFilter] = useState("הכל");
  const [funderFilter, setFunderFilter] = useState("הכל");
  const [mgFilter, setMgFilter] = useState("הכל");

  const byClient = useMemo(() => {
    const m = {};
    active.forEach(r => {
      if (!m[r.client]) m[r.client] = {ils:0,usd:0,total:0,count:0};
      m[r.client].total += toILS(r);
      r.cur==="USD" ? m[r.client].usd+=r.amt : m[r.client].ils+=r.amt;
      m[r.client].count++;
    });
    return Object.entries(m).map(([name,v]) => ({name,...v})).sort((a,b) => b.total-a.total);
  },[]);

  const byFunder = useMemo(() => {
    const m = {};
    active.forEach(r => {
      if (!m[r.funder]) m[r.funder] = {total:0,count:0};
      m[r.funder].total += toILS(r);
      m[r.funder].count++;
    });
    return Object.entries(m).map(([name,v]) => ({name,...v})).sort((a,b) => b.total-a.total);
  },[]);

  const bySupplier = useMemo(() => {
    const m = {};
    active.forEach(r => {
      if (!m[r.supplier]) m[r.supplier] = {total:0,count:0,client:r.client,funder:r.funder};
      m[r.supplier].total += toILS(r);
      m[r.supplier].count++;
    });
    return Object.entries(m).map(([name,v]) => ({name,...v})).sort((a,b) => b.total-a.total);
  },[]);

  const byManagerPipeline = useMemo(() => {
    const m = {};
    pipeline.forEach(p => {
      if (!m[p.manager]) m[p.manager] = {total:0,weighted:0,count:0};
      m[p.manager].total += p.expected;
      m[p.manager].weighted += p.expected * (PROB_W[p.prob]||0.5);
      m[p.manager].count++;
    });
    return Object.entries(m).map(([name,v]) => ({name,...v}));
  },[]);

  const managers = ["הכל",...Array.from(new Set(pipeline.map(p=>p.manager)))];
  const clients = ["הכל",...Array.from(new Set(active.map(r=>r.client))).sort()];
  const funders = ["הכל",...Array.from(new Set(active.map(r=>r.funder)))];
  const filteredPipeline = mgFilter==="הכל" ? pipeline : pipeline.filter(p=>p.manager===mgFilter);
  const filteredAll = active.filter(r => (clientFilter==="הכל"||r.client===clientFilter) && (funderFilter==="הכל"||r.funder===funderFilter));
  const pipeTotal = filteredPipeline.reduce((s,p)=>s+p.expected,0);
  const pipeWeighted = filteredPipeline.reduce((s,p)=>s+p.expected*(PROB_W[p.prob]||0.5),0);

  const Btn = ({label,active:a,onClick,color="#6366f1"}) => (
    <button onClick={onClick} style={{padding:"5px 11px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:a?color:"#1e293b",color:a?"#fff":"#94a3b8"}}>{label}</button>
  );

  const KPI = ({label,val,color,icon,sub}) => (
    <div style={{background:"#1e293b",borderRadius:10,padding:14,borderRight:`3px solid ${color}`}}>
      <div style={{fontSize:17,marginBottom:3}}>{icon}</div>
      <div style={{fontSize:11,color:"#64748b",marginBottom:3}}>{label}</div>
      <div style={{fontSize:15,fontWeight:800,color}}>{val}</div>
      {sub && <div style={{fontSize:11,color:"#475569",marginTop:2}}>{sub}</div>}
    </div>
  );

  const TH = ({children}) => <th style={{padding:"8px 11px",textAlign:"right",fontWeight:600,fontSize:11,color:"#64748b",background:"#0f172a",whiteSpace:"nowrap"}}>{children}</th>;
  const TD = ({children,color,bold}) => <td style={{padding:"7px 11px",color:color||"#e2e8f0",fontWeight:bold?700:400,fontSize:11}}>{children}</td>;

  return (
    <div dir="rtl" style={{fontFamily:"'Segoe UI',Arial,sans-serif",background:"#0f172a",minHeight:"100vh",color:"#e2e8f0",padding:16}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:5,height:32,background:"linear-gradient(180deg,#6366f1,#22d3ee)",borderRadius:99}}/>
            <div>
              <div style={{fontSize:20,fontWeight:800,color:"#f8fafc"}}>דשבורד הקדמות</div>
              <div style={{fontSize:12,color:"#94a3b8"}}>מרץ 2026 | שע"ח: ₪{USD_RATE}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {TABS.map(t => <Btn key={t} label={t} active={tab===t} onClick={()=>setTab(t)}/>)}
          </div>
        </div>

        {tab==="סקירה" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
            <KPI label="יעד חודשי" val="₪78,000,000" color="#f59e0b" icon="🎯"/>
            <KPI label="הוקדם עד כה" val={fmt(totalAll)} color="#10b981" icon="✅" sub={`${pctDone}% מהיעד`}/>
            <KPI label="נשאר לחודש" val={fmt(missing)} color="#f43f5e" icon="⚡" sub={`${(100-parseFloat(pctDone)).toFixed(1)}% נותר`}/>
            <KPI label="בקשות פעילות" val={active.length} color="#6366f1" icon="📋" sub={`${byClient.length} תאגידים`}/>
          </div>
          <div style={{background:"#1e293b",borderRadius:10,padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,fontWeight:700}}>התקדמות מול יעד חודשי ₪78M</span>
              <span style={{fontSize:20,fontWeight:800,color:parseFloat(pctDone)>=80?"#10b981":parseFloat(pctDone)>=40?"#f59e0b":"#f43f5e"}}>{pctDone}%</span>
            </div>
            <div style={{background:"#334155",borderRadius:99,height:18,overflow:"hidden"}}>
              <div style={{width:`${Math.min(parseFloat(pctDone),100)}%`,height:"100%",background:"linear-gradient(90deg,#10b981,#22d3ee)",borderRadius:99}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginTop:5}}>
              <span style={{color:"#10b981",fontWeight:600}}>הושג: {fmt(totalAll)}</span>
              <span style={{color:"#f43f5e",fontWeight:600}}>חסר: {fmt(missing)}</span>
              <span style={{color:"#475569"}}>יעד: ₪78,000,000</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{background:"#1e293b",borderRadius:10,padding:14}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>לפי תאגיד (Top 8)</div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={byClient.slice(0,8)} layout="vertical" margin={{right:10}}>
                  <XAxis type="number" tick={{fill:"#64748b",fontSize:9}} tickFormatter={v=>`₪${(v/1000000).toFixed(1)}M`}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#94a3b8",fontSize:10}} width={115}/>
                  <Tooltip formatter={v=>fmt(v)} contentStyle={{background:"#0f172a",border:"none",borderRadius:8,fontSize:11}}/>
                  <Bar dataKey="total" radius={[0,4,4,0]}>
                    {byClient.slice(0,8).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:"#1e293b",borderRadius:10,padding:14}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>לפי מממן</div>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={byFunder} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={62} innerRadius={28} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} fontSize={10}>
                    {byFunder.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Pie>
                  <Tooltip formatter={v=>fmt(v)} contentStyle={{background:"#0f172a",border:"none",borderRadius:8,fontSize:11}}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:8}}>
                {byFunder.map((f,i)=>(
                  <div key={i} style={{background:"#0f172a",borderRadius:8,padding:"7px 10px",borderRight:`3px solid ${COLORS[i%COLORS.length]}`}}>
                    <div style={{fontSize:11,fontWeight:700,color:COLORS[i%COLORS.length]}}>{f.name}</div>
                    <div style={{fontSize:13,fontWeight:800,color:"#e2e8f0"}}>{fmt(f.total)}</div>
                    <div style={{fontSize:10,color:"#64748b"}}>{f.count} בקשות</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {tab==="לפי תאגיד" && (
          <div style={{background:"#1e293b",borderRadius:10,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr><TH>תאגיד</TH><TH>סה״כ ₪</TH><TH>סכום ₪</TH><TH>סכום $</TH><TH>מממנים</TH><TH>בקשות</TH></tr></thead>
              <tbody>
                {byClient.map((c,i)=>{
                  const fl=[...new Set(active.filter(r=>r.client===c.name).map(r=>r.funder))];
                  return <tr key={i} style={{borderBottom:"1px solid #243044",background:i%2===0?"#1e293b":"#1a2233"}}>
                    <TD bold>{c.name}</TD>
                    <TD color="#10b981" bold>{fmt(c.total)}</TD>
                    <TD color="#22d3ee">{c.ils>0?fmt(c.ils):"—"}</TD>
                    <TD color="#f59e0b">{c.usd>0?`$${Number(c.usd).toLocaleString("he-IL",{maximumFractionDigits:0})}`:"—"}</TD>
                    <TD color="#94a3b8">{fl.join(", ")}</TD>
                    <TD color="#64748b">{c.count}</TD>
                  </tr>;
                })}
              </tbody>
              <tfoot><tr style={{background:"#0f172a"}}>
                <td style={{padding:"9px 11px",fontWeight:800,fontSize:12}}>סה"כ</td>
                <td style={{padding:"9px 11px",color:"#10b981",fontWeight:800,fontSize:12}}>{fmt(totalAll)}</td>
                <td style={{padding:"9px 11px",color:"#22d3ee",fontSize:11}}>{fmt(active.filter(r=>r.cur==="ILS").reduce((s,r)=>s+r.amt,0))}</td>
                <td style={{padding:"9px 11px",color:"#f59e0b",fontSize:11}}>${Number(active.filter(r=>r.cur==="USD").reduce((s,r)=>s+r.amt,0)).toLocaleString("he-IL",{maximumFractionDigits:0})}</td>
                <td style={{padding:"9px 11px",color:"#64748b",fontSize:11}}>{byFunder.length} מממנים</td>
                <td style={{padding:"9px 11px",color:"#64748b",fontSize:11}}>{active.length}</td>
              </tr></tfoot>
            </table>
          </div>
        )}

        {tab==="לפי ספק" && <>
          <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
            {clients.map(c=><Btn key={c} label={c} active={clientFilter===c} onClick={()=>setClientFilter(c)}/>)}
          </div>
          <div style={{background:"#1e293b",borderRadius:10,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr><TH>ספק</TH><TH>לקוח</TH><TH>מממן</TH><TH>סה״כ ₪</TH><TH>בקשות</TH></tr></thead>
              <tbody>
                {bySupplier.filter(s=>clientFilter==="הכל"||s.client===clientFilter).map((s,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #243044",background:i%2===0?"#1e293b":"#1a2233"}}>
                    <TD bold>{s.name}</TD><TD color="#94a3b8">{s.client}</TD><TD color="#f59e0b">{s.funder}</TD>
                    <TD color="#10b981" bold>{fmt(s.total)}</TD><TD color="#64748b">{s.count}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {tab==="לפי מממן" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
            {byFunder.map((f,fi)=>{
              const byC={};
              active.filter(r=>r.funder===f.name).forEach(r=>{if(!byC[r.client])byC[r.client]={total:0,count:0};byC[r.client].total+=toILS(r);byC[r.client].count++;});
              return <div key={fi} style={{background:"#1e293b",borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"10px 14px",background:COLORS[fi%COLORS.length]+"33",borderBottom:`2px solid ${COLORS[fi%COLORS.length]}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:800,fontSize:14,color:COLORS[fi%COLORS.length]}}>🏦 {f.name}</span>
                  <div style={{textAlign:"left",fontSize:11}}>
                    <div style={{color:"#e2e8f0",fontWeight:700}}>{fmt(f.total)}</div>
                    <div style={{color:"#64748b"}}>{f.count} בקשות</div>
                  </div>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#0f172a"}}><TH>תאגיד</TH><TH>סכום</TH><TH>בקשות</TH></tr></thead>
                  <tbody>
                    {Object.entries(byC).sort((a,b)=>b[1].total-a[1].total).map(([c,v],i)=>(
                      <tr key={i} style={{borderBottom:"1px solid #243044"}}>
                        <TD>{c}</TD><TD color="#22d3ee" bold>{fmt(v.total)}</TD><TD color="#64748b">{v.count}</TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>;
            })}
          </div>
        )}

        {tab==="Pipeline" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
            <KPI label="צפי ברוטו" val={fmt(pipeline.reduce((s,p)=>s+p.expected,0))} color="#22d3ee" icon="📊" sub={`${pipeline.length} עסקאות`}/>
            <KPI label="צפי משוקלל" val={fmt(pipeline.reduce((s,p)=>s+p.expected*(PROB_W[p.prob]||0.5),0))} color="#6366f1" icon="🎲" sub="לפי הסתברות"/>
            <KPI label="חסר ליעד החודש" val={fmt(missing)} color="#f43f5e" icon="⚡" sub={`הושג: ${fmt(totalAll)}`}/>
          </div>
          <div style={{background:"#1e293b",borderRadius:10,padding:14,marginBottom:12}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>צפי לפי מנהל תיק</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={byManagerPipeline}>
                <XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11}}/>
                <YAxis tick={{fill:"#64748b",fontSize:10}} tickFormatter={v=>`₪${(v/1000000).toFixed(0)}M`}/>
                <Tooltip formatter={v=>fmt(v)} contentStyle={{background:"#0f172a",border:"none",borderRadius:8,fontSize:11}}/>
                <Bar dataKey="total" name="ברוטו" radius={[4,4,0,0]} opacity={0.4}>
                  {byManagerPipeline.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Bar>
                <Bar dataKey="weighted" name="משוקלל" radius={[4,4,0,0]}>
                  {byManagerPipeline.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,color:"#64748b"}}>מנהל:</span>
            {managers.map(m=><Btn key={m} label={m} active={mgFilter===m} onClick={()=>setMgFilter(m)}/>)}
          </div>
          <div style={{background:"#1e293b",borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"9px 14px",borderBottom:"1px solid #334155",display:"flex",justifyContent:"space-between",fontSize:12}}>
              <span style={{fontWeight:700}}>{filteredPipeline.length} עסקאות</span>
              <span>ברוטו: <span style={{color:"#22d3ee",fontWeight:700}}>{fmt(pipeTotal)}</span> | משוקלל: <span style={{color:"#6366f1",fontWeight:700}}>{fmt(pipeWeighted)}</span></span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr><TH>מנהל</TH><TH>לקוח</TH><TH>ספק</TH><TH>סוג</TH><TH>סטטוס</TH><TH>צפי השבוע</TH><TH>סבירות</TH></tr></thead>
              <tbody>
                {filteredPipeline.map((p,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #243044",background:i%2===0?"#1e293b":"#1a2233"}}>
                    <TD color="#94a3b8">{p.manager}</TD>
                    <TD>{p.client}</TD>
                    <TD color="#cbd5e1">{p.supplier}</TD>
                    <td style={{padding:"7px 11px"}}>
                      <span style={{background:p.type==="פקטורינג"?"#1e3a5f":"#2d1b69",color:p.type==="פקטורינג"?"#60a5fa":"#a78bfa",padding:"2px 7px",borderRadius:5,fontSize:10}}>{p.type}</span>
                    </td>
                    <td style={{padding:"7px 11px"}}>
                      <span style={{background:p.supStatus==="פעיל"?"#10b98122":"#f59e0b22",color:p.supStatus==="פעיל"?"#10b981":"#f59e0b",padding:"2px 7px",borderRadius:99,fontSize:10}}>{p.supStatus}</span>
                    </td>
                    <TD color="#22d3ee" bold>{fmt(p.expected)}</TD>
                    <td style={{padding:"7px 11px"}}>
                      <span style={{background:(PROB_COLOR[p.prob]||"#94a3b8")+"22",color:PROB_COLOR[p.prob]||"#94a3b8",padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:700}}>{p.prob}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr style={{background:"#0f172a"}}>
                <td colSpan={5} style={{padding:"8px 11px",fontWeight:700,fontSize:11}}>סה"כ</td>
                <td style={{padding:"8px 11px",color:"#22d3ee",fontWeight:700}}>{fmt(pipeTotal)}</td>
                <td style={{padding:"8px 11px",color:"#6366f1",fontSize:10}}>{fmt(pipeWeighted)} משוקלל</td>
              </tr></tfoot>
            </table>
          </div>
        </>}

        {tab==="כל הבקשות" && <>
          <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,color:"#64748b"}}>תאגיד:</span>
            {clients.map(c=><Btn key={c} label={c} active={clientFilter===c} onClick={()=>setClientFilter(c)}/>)}
          </div>
          <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,color:"#64748b"}}>מממן:</span>
            {funders.map(f=><Btn key={f} label={f} active={funderFilter===f} onClick={()=>setFunderFilter(f)} color="#22d3ee"/>)}
          </div>
          <div style={{background:"#1e293b",borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"9px 14px",borderBottom:"1px solid #334155",display:"flex",justifyContent:"space-between",fontSize:12}}>
              <span style={{fontWeight:700}}>{filteredAll.length} בקשות</span>
              <span style={{color:"#10b981",fontWeight:700}}>{fmt(filteredAll.reduce((s,r)=>s+toILS(r),0))}</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr><TH>מס'</TH><TH>לקוח</TH><TH>ספק</TH><TH>מממן</TH><TH>סטטוס</TH><TH>סכום חשבונית</TH><TH>מטבע</TH><TH>שווה ₪</TH></tr></thead>
                <tbody>
                  {filteredAll.map((r,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #243044",background:i%2===0?"#1e293b":"#1a2233"}}>
                      <TD color="#6366f1" bold>{r.id}</TD>
                      <TD bold>{r.client}</TD>
                      <TD color="#94a3b8">{r.supplier}</TD>
                      <TD color="#f59e0b">{r.funder}</TD>
                      <td style={{padding:"7px 11px"}}>
                        <span style={{background:(STATUS_COLOR[r.status]||"#94a3b8")+"22",color:STATUS_COLOR[r.status]||"#94a3b8",padding:"2px 7px",borderRadius:99,fontSize:10,fontWeight:700}}>{r.status}</span>
                      </td>
                      <TD color="#22d3ee" bold>{r.cur==="USD"?`$${Number(r.amt).toLocaleString("he-IL",{maximumFractionDigits:0})}`:fmt(r.amt)}</TD>
                      <td style={{padding:"7px 11px"}}><span style={{color:r.cur==="USD"?"#fbbf24":"#475569",fontSize:10,fontWeight:r.cur==="USD"?700:400}}>{r.cur}</span></td>
                      <TD color="#10b981" bold>{fmt(toILS(r))}</TD>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr style={{background:"#0f172a"}}>
                  <td colSpan={7} style={{padding:"8px 11px",fontWeight:800,fontSize:12}}>סה"כ ({filteredAll.length})</td>
                  <td style={{padding:"8px 11px",color:"#10b981",fontWeight:800,fontSize:12}}>{fmt(filteredAll.reduce((s,r)=>s+toILS(r),0))}</td>
                </tr></tfoot>
              </table>
            </div>
          </div>
        </>}

      </div>
    </div>
  );
}
