/* Darkstar Filamenti — gestionale filamenti per stampa 3D / 3D printing filament manager
 * Funziona da file statico (dati nel localStorage) oppure come artifact su claude.ai (archivio online).
 */
(()=>{
/* ---------- costanti ---------- */
const MAT={PLA:1.24,"PLA-CF":1.30,PETG:1.27,"PETG-CF":1.30,ABS:1.04,ASA:1.07,TPU:1.21,PA:1.14,"PA-CF":1.20,PC:1.20,PVA:1.23,HIPS:1.04};
const HYGRO=new Set(["PETG","PETG-CF","TPU","PA","PA-CF","PC","PVA"]);
const KINDS=["shelf","drybox","drawer","vacuum","printer"];
const KIND_ALIAS={"Scaffale":"shelf","Dry box":"drybox","Cassetto":"drawer","Sottovuoto":"vacuum","Su stampante":"printer"};
const kindKey=k=>KIND_ALIAS[k]||k||"shelf";
const PRINTERS=["Core One","Mini+","other"];
const STORE_KEY="darkstar-filamenti:v1";
const LANG_KEY="darkstar-filamenti:lang";
const THEME_KEY="darkstar-filamenti:theme";

/* ---------- traduzioni / translations ---------- */
const I18N={
it:{
  appName:"Filamenti",themeAuto:"Tema: automatico (segue il dispositivo)",themeLight:"Tema: chiaro",themeDark:"Tema: scuro",docTitle:"Darkstar Filamenti",langSwitch:"EN",langLabel:"Switch to English",
  newSpool:"+ Nuova bobina",logUsage:"Registra consumo",
  tabSpools:"Bobine",tabStorage:"Magazzini",tabUsage:"Consumi",tabTools:"Strumenti",summary:"Riepilogo",
  stAvail:"Disponibile",stValue:"Valore a magazzino",stLow:"In esaurimento",stDry:"Da essiccare",unitSpools:"bobine",
  sFinished:"Finita",sEmpty:"Vuota",sLow:"In esaurimento",sDry:"Da essiccare",sExample:"Esempio",
  noLocation:"Senza ubicazione",loading:"Caricamento archivio…",
  emptySpoolsH:"Nessuna bobina a magazzino",emptySpoolsP:"Aggiungi la prima bobina con marca, materiale, colore e peso. Il residuo scende da solo ogni volta che registri una stampa.",
  loadEx:"Carica dati di esempio",exBanner:"Le voci con il bollino “Esempio” servono solo a mostrare come funziona. Quando inserisci le tue bobine puoi toglierle.",clearEx:"Elimina esempi",
  searchPh:"Cerca codice, marca, colore…",search:"Cerca",allMat:"Tutti i materiali",allLoc:"Tutte le ubicazioni",
  sortCode:"Per codice",sortRem:"Per residuo",sortMat:"Per materiale",sortBy:"Ordina",showDone:"Mostra finite",
  filterLow:"Filtro: in esaurimento",filterDry:"Filtro: da essiccare",clearFilter:"Togli filtro",noMatch:"Nessuna bobina corrisponde ai filtri.",
  locsH:"Magazzini",locsSub:"Scaffali, dry box e cassetti dove tieni le bobine.",newLoc:"+ Nuova ubicazione",edit:"Modifica",emptyBox:"Vuoto",
  noLocsH:"Nessuna ubicazione",noLocsP:"Crea un’ubicazione per ogni posto fisico, per esempio “Scaffale A” o “Dry box 1”. Le bobine in dry box hanno un intervallo di essiccazione doppio.",
  toSort:"Da sistemare",unplaced:"{n} bobine senza ubicazione",
  usageH:"Consumi",usageSub:"Ogni stampa registrata scala i grammi dalla bobina e calcola il costo.",weekly:"Grammi a settimana · ultime 8",chartAria:"Grammi consumati per settimana, ultime 8 settimane",
  last30:"Ultimi 30 giorni",matCost:"Costo materiale",prints:"Stampe",noUsage30:"Nessun consumo negli ultimi 30 giorni.",recent:"Ultime stampe",
  thDate:"Data",thJob:"Lavoro",thSpool:"Bobina",thPrinter:"Stampante",thGrams:"Grammi",thCost:"Costo",deletedSpool:"eliminata",
  undo:"Annulla",undoTitle:"Annulla e restituisci i grammi alla bobina",noUsage:"Ancora nessuna stampa registrata. Dopo ogni stampa inserisci i grammi che ti indica PrusaSlicer.",
  costH:"Costo stampa",spool:"Bobina",manualPrice:"Prezzo manuale",pricePerKg:"Prezzo €/kg",gramsSlicer:"Grammi da PrusaSlicer",hours:"Ore di stampa",energy:"Energia €/ora",energyHint:"Core One ≈ 0,12 kWh/h",material:"Materiale",total:"Totale",
  convH:"Metri ↔ grammi",diameter:"Diametro",metres:"Metri",grams:"Grammi",convInfo:"{g} g per metro · densità {d} g/cm³ · una bobina da 1 kg ≈ {m} m",
  weighH:"Pesata bobina",weighP:"Metti la bobina sulla bilancia: il residuo è il peso lordo meno la tara della bobina vuota.",gross:"Peso lordo (g)",tare:"Tara (g)",updateRem:"Aggiorna residuo",
  alertsH:"Avvisi",lowTh:"Soglia esaurimento (g)",dryDays:"Giorni prima di essiccare",dryHint:"Doppi in dry box o sottovuoto",saveAlerts:"Salva avvisi",hygro:"Materiali che assorbono umidità: {list}.",
  backupH:"Backup",backupLocal:"I dati restano in questo browser. Esporta un file JSON per tenerne una copia o per spostarli su un altro computer.",backupOnline:"I dati sono salvati online in questa pagina. Esporta un file JSON per tenerne una copia o per usarli nella versione GitHub.",
  exportB:"Esporta backup",importB:"Importa backup",importWarn:"L’importazione sostituisce tutti i dati attuali.",
  newSpoolH:"Nuova bobina",editSpoolH:"Modifica {c}",code:"Codice",brand:"Marca",brandPh:"Prusament, Polymaker…",colorName:"Nome colore",colorNamePh:"Galaxy Black",color:"Colore",pickColor:"Scegli colore",colorCode:"Codice colore",
  net:"Peso netto (g)",rem:"Residuo (g)",tareSpool:"Tara bobina vuota (g)",price:"Prezzo pagato (€)",location:"Ubicazione",opened:"Aperta il",dried:"Ultima essiccazione",notes:"Note",notesPh:"Temperature, profilo PrusaSlicer, fornitore…",
  cancel:"Annulla",addSpool:"Aggiungi bobina",save:"Salva",close:"Chiudi",added:"{c} aggiunta",saved:"{c} salvata",
  kRemaining:"Residuo",kMetres:"Metri circa",kFull:"Pieno",kPerKg:"€/kg",kLocation:"Ubicazione",kDiameter:"Diametro",kOpened:"Aperta",kDried:"Essiccata",kUsed:"Usati finora",
  logPrint:"Registra stampa",jobOpt:"Lavoro (facoltativo)",subtract:"Scala grammi",weighing:"Pesata",grossPh:"Peso lordo g",tareInfo:"Tara {t}",tareUnset:"non impostata",
  history:"Storico",noHist:"Nessuna stampa registrata con questa bobina.",del:"Elimina",confirmDel:"Conferma eliminazione",driedToday:"Essiccata oggi",markDone:"Segna finita",reactivate:"Riattiva",rebuy:"Ricompra uguale",
  tReactivated:"Bobina riattivata",tDone:"Bobina segnata come finita",tDried:"Essiccazione registrata",tRemUpd:"Residuo aggiornato: {g} g",tDeleted:"{c} eliminata",
  tEnterGrams:"Inserisci i grammi usati.",tSubtracted:"{g} g scalati da {c}",tLowSuffix:" · in esaurimento",tAddSpoolFirst:"Aggiungi prima una bobina.",
  logUsageH:"Registra consumo",qty:"Quantità",unit:"Unità",jobPh:"Supporto dischi flex",job:"Lavoro",printer:"Stampante",date:"Data",usageInfo:"{g} g · costo {c} · resteranno {r} g",subtractFrom:"Scala dalla bobina",
  newLocH:"Nuova ubicazione",editLocH:"Modifica ubicazione",name:"Nome",namePh:"Scaffale A",kind:"Tipo",locNotesPh:"Igrometro, gel di silice cambiato il…",create:"Crea",delWithN:"Elimina ({n} bobine restano senza ubicazione)",
  tLocCreated:"Ubicazione creata",tLocSaved:"Ubicazione salvata",tLocDeleted:"Ubicazione eliminata",
  k_shelf:"Scaffale",k_drybox:"Dry box",k_drawer:"Cassetto",k_vacuum:"Sottovuoto",k_printer:"Su stampante",other:"Altro",
  tExRemoved:"Esempi eliminati",tExLoaded:"Dati di esempio caricati",tExported:"Backup esportato",tImported:"Backup importato: {n} bobine",tImporting:"Importazione in corso…",tBadBackup:"Il file non è un backup valido di Darkstar Filamenti.",
  tWeighNeed:"Scegli la bobina e inserisci il peso lordo.",tWeighed:"{c} aggiornata: {g} g",tAlertsSaved:"Avvisi salvati",
  tSaveFail:"Salvataggio non riuscito. Controlla la connessione e riprova.",tQuota:"Archivio pieno: elimina qualche consumo vecchio e riprova.",tReadonly:"Archivio in sola lettura.",
  bannerBlocked:"Questo browser blocca il salvataggio locale: le modifiche si perdono alla chiusura. Usa Esporta backup in Strumenti.",
  exLoc1:"Scaffale A",exLoc2Notes:"Igrometro interno, gel di silice",exNotes1:"215 °C / piatto 60 °C",exNotes4:"Stampare lento, 25 mm/s",exNotes5:"Sigillata",exColor2:"Arancione",exColor4:"Trasparente",
  exJob1:"Supporto dischi flex",exJob2:"Staffe quadro elettrico",exJob3:"Organizer cavi",exJob4:"Piedini antivibranti"
},
en:{
  appName:"Filament",themeAuto:"Theme: automatic (follows your device)",themeLight:"Theme: light",themeDark:"Theme: dark",docTitle:"Darkstar Filament",langSwitch:"IT",langLabel:"Passa all’italiano",
  newSpool:"+ New spool",logUsage:"Log usage",
  tabSpools:"Spools",tabStorage:"Storage",tabUsage:"Usage",tabTools:"Tools",summary:"Summary",
  stAvail:"Available",stValue:"Stock value",stLow:"Running low",stDry:"Needs drying",unitSpools:"spools",
  sFinished:"Finished",sEmpty:"Empty",sLow:"Running low",sDry:"Needs drying",sExample:"Example",
  noLocation:"No location",loading:"Loading…",
  emptySpoolsH:"No spools in stock",emptySpoolsP:"Add your first spool with brand, material, colour and weight. The remaining weight goes down every time you log a print.",
  loadEx:"Load sample data",exBanner:"Items tagged “Example” only show how the app works. Remove them once you add your own spools.",clearEx:"Remove examples",
  searchPh:"Search code, brand, colour…",search:"Search",allMat:"All materials",allLoc:"All locations",
  sortCode:"By code",sortRem:"By remaining",sortMat:"By material",sortBy:"Sort",showDone:"Show finished",
  filterLow:"Filter: running low",filterDry:"Filter: needs drying",clearFilter:"Clear filter",noMatch:"No spools match the filters.",
  locsH:"Storage",locsSub:"Shelves, dry boxes and drawers where your spools live.",newLoc:"+ New location",edit:"Edit",emptyBox:"Empty",
  noLocsH:"No locations",noLocsP:"Create one location per physical place, such as “Shelf A” or “Dry box 1”. Spools in a dry box get twice the drying interval.",
  toSort:"To sort",unplaced:"{n} spools without a location",
  usageH:"Usage",usageSub:"Each logged print subtracts grams from the spool and works out the cost.",weekly:"Grams per week · last 8",chartAria:"Grams used per week, last 8 weeks",
  last30:"Last 30 days",matCost:"Material cost",prints:"Prints",noUsage30:"No usage in the last 30 days.",recent:"Recent prints",
  thDate:"Date",thJob:"Job",thSpool:"Spool",thPrinter:"Printer",thGrams:"Grams",thCost:"Cost",deletedSpool:"deleted",
  undo:"Undo",undoTitle:"Undo and give the grams back to the spool",noUsage:"No prints logged yet. After each print, enter the grams PrusaSlicer reports.",
  costH:"Print cost",spool:"Spool",manualPrice:"Manual price",pricePerKg:"Price €/kg",gramsSlicer:"Grams from PrusaSlicer",hours:"Print hours",energy:"Energy €/hour",energyHint:"Core One ≈ 0.12 kWh/h",material:"Material",total:"Total",
  convH:"Metres ↔ grams",diameter:"Diameter",metres:"Metres",grams:"Grams",convInfo:"{g} g per metre · density {d} g/cm³ · a 1 kg spool ≈ {m} m",
  weighH:"Weigh a spool",weighP:"Put the spool on the scale: the filament left is the gross weight minus the empty spool.",gross:"Gross weight (g)",tare:"Tare (g)",updateRem:"Update remaining",
  alertsH:"Alerts",lowTh:"Low-stock threshold (g)",dryDays:"Days before drying",dryHint:"Doubled in a dry box or vacuum bag",saveAlerts:"Save alerts",hygro:"Moisture-sensitive materials: {list}.",
  backupH:"Backup",backupLocal:"Your data stays in this browser. Export a JSON file to keep a copy or move it to another computer.",backupOnline:"Your data is saved online with this page. Export a JSON file to keep a copy or use it in the GitHub version.",
  exportB:"Export backup",importB:"Import backup",importWarn:"Importing replaces all current data.",
  newSpoolH:"New spool",editSpoolH:"Edit {c}",code:"Code",brand:"Brand",brandPh:"Prusament, Polymaker…",colorName:"Colour name",colorNamePh:"Galaxy Black",color:"Colour",pickColor:"Pick colour",colorCode:"Colour code",
  net:"Net weight (g)",rem:"Remaining (g)",tareSpool:"Empty spool weight (g)",price:"Price paid (€)",location:"Location",opened:"Opened on",dried:"Last dried",notes:"Notes",notesPh:"Temperatures, PrusaSlicer profile, supplier…",
  cancel:"Cancel",addSpool:"Add spool",save:"Save",close:"Close",added:"{c} added",saved:"{c} saved",
  kRemaining:"Remaining",kMetres:"Approx. metres",kFull:"Full",kPerKg:"€/kg",kLocation:"Location",kDiameter:"Diameter",kOpened:"Opened",kDried:"Dried",kUsed:"Used so far",
  logPrint:"Log a print",jobOpt:"Job (optional)",subtract:"Subtract grams",weighing:"Weigh",grossPh:"Gross weight g",tareInfo:"Tare {t}",tareUnset:"not set",
  history:"History",noHist:"No prints logged with this spool.",del:"Delete",confirmDel:"Confirm delete",driedToday:"Dried today",markDone:"Mark finished",reactivate:"Reactivate",rebuy:"Buy again",
  tReactivated:"Spool reactivated",tDone:"Spool marked as finished",tDried:"Drying logged",tRemUpd:"Remaining updated: {g} g",tDeleted:"{c} deleted",
  tEnterGrams:"Enter the grams used.",tSubtracted:"{g} g subtracted from {c}",tLowSuffix:" · running low",tAddSpoolFirst:"Add a spool first.",
  logUsageH:"Log usage",qty:"Amount",unit:"Unit",jobPh:"Grinder disc holder",job:"Job",printer:"Printer",date:"Date",usageInfo:"{g} g · cost {c} · {r} g left",subtractFrom:"Subtract from spool",
  newLocH:"New location",editLocH:"Edit location",name:"Name",namePh:"Shelf A",kind:"Type",locNotesPh:"Hygrometer, silica gel changed on…",create:"Create",delWithN:"Delete ({n} spools will have no location)",
  tLocCreated:"Location created",tLocSaved:"Location saved",tLocDeleted:"Location deleted",
  k_shelf:"Shelf",k_drybox:"Dry box",k_drawer:"Drawer",k_vacuum:"Vacuum bag",k_printer:"On printer",other:"Other",
  tExRemoved:"Examples removed",tExLoaded:"Sample data loaded",tExported:"Backup exported",tImported:"Backup imported: {n} spools",tImporting:"Importing…",tBadBackup:"This file is not a valid Darkstar Filament backup.",
  tWeighNeed:"Pick a spool and enter the gross weight.",tWeighed:"{c} updated: {g} g",tAlertsSaved:"Alerts saved",
  tSaveFail:"Couldn’t save. Check your connection and try again.",tQuota:"Storage is full: delete some old usage entries and try again.",tReadonly:"This archive is read-only.",
  bannerBlocked:"This browser blocks local storage: changes are lost when you close it. Use Export backup in Tools.",
  exLoc1:"Shelf A",exLoc2Notes:"Hygrometer inside, silica gel",exNotes1:"215 °C / bed 60 °C",exNotes4:"Print slow, 25 mm/s",exNotes5:"Sealed",exColor2:"Orange",exColor4:"Clear",
  exJob1:"Grinder disc holder",exJob2:"Electrical panel brackets",exJob3:"Cable organiser",exJob4:"Anti-vibration feet"
}};
let lang="it";
try{const l=localStorage.getItem(LANG_KEY);lang=l||((navigator.language||"it").toLowerCase().startsWith("it")?"it":"en")}catch(e){lang=(navigator.language||"it").toLowerCase().startsWith("it")?"it":"en"}
if(!I18N[lang])lang="en";
const t=(k,v)=>{let s=(I18N[lang][k]??I18N.it[k]??k);if(v)for(const x in v)s=s.split("{"+x+"}").join(v[x]);return s};
const loc=()=>lang==="it"?"it-IT":"en-GB";


/* ---------- tema chiaro / scuro ---------- */
const hostTheme=document.documentElement.getAttribute("data-theme");
let theme="auto";
try{const v=localStorage.getItem(THEME_KEY);if(v==="light"||v==="dark")theme=v}catch(e){}
const ICONS={
  auto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
  light:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  dark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'
};
function applyTheme(){
  const root=document.documentElement;
  if(theme==="auto"){hostTheme?root.setAttribute("data-theme",hostTheme):root.removeAttribute("data-theme")}
  else root.setAttribute("data-theme",theme);
}
applyTheme();

/* ---------- stato ---------- */
const S={spools:[],locations:[],usage:[],settings:{lowThreshold:150,dryDays:45},loaded:false};
const ui={tab:"bobine",q:"",mat:"",loc:"",showDone:false,sort:"code",quick:""};
try{const tb=localStorage.getItem("dsf-tab");if(tb)ui.tab=tb}catch(e){}

/* ---------- utilità ---------- */
const $=s=>document.querySelector(s);
const h=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
const daysSince=iso=>iso?Math.floor((Date.now()-new Date(iso+"T12:00:00").getTime())/864e5):null;
const fmtG=g=>Math.round(g).toLocaleString(loc());
const fmtKg=g=>(g/1000).toLocaleString(loc(),{minimumFractionDigits:1,maximumFractionDigits:1});
const fmtN=(n,d)=>n.toLocaleString(loc(),{minimumFractionDigits:d,maximumFractionDigits:d});
const eur=v=>v.toLocaleString(loc(),{style:"currency",currency:"EUR"});
const fmtDate=iso=>iso?new Date(iso+"T12:00:00").toLocaleDateString(loc(),{day:"2-digit",month:"short",year:"numeric"}):"—";
const newId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const gPerM=(mat,dia=1.75)=>Math.PI*Math.pow(dia/20,2)*100*(MAT[mat]||1.24);
const perKg=s=>s.price&&s.netWeight?s.price/(s.netWeight/1000):0;
const locName=id=>(S.locations.find(l=>l.id===id)||{}).name||t("noLocation");
const spoolById=id=>S.spools.find(s=>s.id===id);
const label=s=>[s.brand,s.colorName].filter(Boolean).join(" ")||s.material;
const printerName=p=>p==="other"||p==="Altro"?t("other"):p;
const strip=o=>{const{id,...r}=o;return r};
const sortLocs=()=>S.locations.sort((a,b)=>String(a.name).localeCompare(String(b.name)));
function toast(msg){const el=$("#toast");el.textContent=msg;el.hidden=false;clearTimeout(toast.tm);toast.tm=setTimeout(()=>el.hidden=true,2600)}

/* ---------- archivio: locale oppure online ---------- */
const store={
  mode:"local",db:null,canWrite:true,localOk:true,downloads:null,
  persist(){
    if(this.mode!=="local")return;
    try{localStorage.setItem(STORE_KEY,JSON.stringify({version:1,spools:S.spools,locations:S.locations,usage:S.usage,settings:S.settings}))}
    catch(e){if(this.localOk){this.localOk=false;showBanner(t("bannerBlocked"))}}
  },
  loadLocal(){
    try{const raw=localStorage.getItem(STORE_KEY);if(raw)applyData(JSON.parse(raw))}catch(e){this.localOk=false}
  },
  err(e){
    if(e&&e.code==="quota_exceeded")return t("tQuota");
    if(e&&e.code==="invalid_argument"){this.canWrite=false;render();return t("tReadonly")}
    return t("tSaveFail");
  },
  async put(col,id,data){
    if(!this.canWrite){toast(t("tReadonly"));throw new Error("ro")}
    if(this.mode==="db"){try{await this.db.collection(col).doc(id).set(data)}catch(e){toast(this.err(e));throw e}return}
    const arr=S[col],i=arr.findIndex(x=>x.id===id),r={id,...data};i>=0?arr[i]=r:arr.push(r);
    if(col==="locations")sortLocs();this.persist();render();
  },
  async del(col,id){
    if(this.mode==="db"){try{await this.db.collection(col).doc(id).delete()}catch(e){toast(this.err(e));throw e}return}
    S[col]=S[col].filter(x=>x.id!==id);this.persist();render();
  },
  async saveSettings(st){
    if(this.mode==="db"){try{await this.db.doc("settings/main").set(st)}catch(e){toast(this.err(e));throw e}return}
    S.settings=st;this.persist();render();
  },
  async replaceAll(d){
    if(this.mode!=="db"){applyData(d);sortLocs();this.persist();render();return}
    for(const col of ["usage","spools","locations"]){for(const x of [...S[col]])await this.del(col,x.id)}
    for(const col of ["locations","spools","usage"]){for(const x of (d[col]||[])){if(x&&x.id)await this.put(col,String(x.id),strip(x))}}
    if(d.settings)await this.saveSettings({...S.settings,...d.settings});
  }
};
function applyData(d){
  S.spools=Array.isArray(d.spools)?d.spools:[];
  S.locations=Array.isArray(d.locations)?d.locations:[];
  S.usage=Array.isArray(d.usage)?d.usage:[];
  S.settings={lowThreshold:150,dryDays:45,...(d.settings||{})};
}
function showBanner(msg){const b=$("#banner");b.hidden=false;b.className="banner";b.textContent=msg}

/* ---------- stato bobina ---------- */
function needsDry(s){
  if(s.status==="finita"||!HYGRO.has(s.material)||!s.opened)return false;
  const ref=s.dried&&s.dried>s.opened?s.dried:s.opened;
  const l=S.locations.find(x=>x.id===s.locationId);const k=l&&kindKey(l.kind);
  const limit=k==="drybox"||k==="vacuum"?S.settings.dryDays*2:S.settings.dryDays;
  return daysSince(ref)>limit;
}
function status(s){
  if(s.status==="finita")return [[t("sFinished"),"ex"]];
  const out=[];
  if(s.remaining<=0)out.push([t("sEmpty"),"crit"]);
  else if(s.remaining<S.settings.lowThreshold)out.push([t("sLow"),"crit"]);
  if(needsDry(s))out.push([t("sDry"),"warn"]);
  if(s.example)out.push([t("sExample"),"ex"]);
  return out;
}
const active=()=>S.spools.filter(s=>s.status!=="finita");
const nextCode=()=>{const n=S.spools.map(s=>parseInt(String(s.code||"").replace(/\D/g,""))||0);return "F-"+String((n.length?Math.max(...n):0)+1).padStart(3,"0")};

/* ---------- testi statici ---------- */
function applyStatic(){
  document.documentElement.lang=lang;
  document.title=t("docTitle");
  document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
  const p=$(".plate");if(p)p.setAttribute("aria-label",t("docTitle"));
  const lb=$("#lang-btn");if(lb){lb.textContent=t("langSwitch");lb.setAttribute("aria-label",t("langLabel"));lb.title=t("langLabel")}
  const st=$("#stats");if(st)st.setAttribute("aria-label",t("summary"));
  const tb=$("#theme-btn");if(tb){const k={auto:"themeAuto",light:"themeLight",dark:"themeDark"}[theme];tb.innerHTML=ICONS[theme];tb.setAttribute("aria-label",t(k));tb.title=t(k)}
}

/* ---------- render ---------- */
function render(){
  applyStatic();
  document.querySelectorAll("#tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===ui.tab));
  $("#c-bobine").textContent=active().length||"";
  $("#c-mag").textContent=S.locations.length||"";
  document.querySelectorAll(".top-actions [data-act]").forEach(b=>b.disabled=!store.canWrite||!S.loaded);
  renderStats();
  $("#view").innerHTML={bobine:viewSpools,magazzini:viewLocations,consumi:viewUsage,strumenti:viewTools}[ui.tab]();
  if(ui.tab==="strumenti")bindTools();
}

function renderStats(){
  const a=active();
  const g=a.reduce((x,s)=>x+Math.max(0,s.remaining||0),0);
  const val=a.reduce((x,s)=>x+perKg(s)*Math.max(0,s.remaining||0)/1000,0);
  const low=a.filter(s=>s.remaining<S.settings.lowThreshold).length;
  const dry=a.filter(needsDry).length;
  $("#stats").innerHTML=`
    <button class="stat" data-quick=""><span class="lbl">${t("stAvail")}</span><span class="val num">${fmtKg(g)}<small>kg</small></span></button>
    <button class="stat" data-quick=""><span class="lbl">${t("stValue")}</span><span class="val num">${eur(val)}</span></button>
    <button class="stat ${low?"is-crit":""}" data-quick="low"><span class="lbl">${t("stLow")}</span><span class="val num">${low}<small>${t("unitSpools")}</small></span></button>
    <button class="stat ${dry?"is-warn":""}" data-quick="dry"><span class="lbl">${t("stDry")}</span><span class="val num">${dry}<small>${t("unitSpools")}</small></span></button>`;
}

function spoolCard(s){
  const pct=s.netWeight?Math.max(0,Math.min(100,(s.remaining/s.netWeight)*100)):0;
  return `<button class="spool ${s.status==="finita"?"done":""}" data-open="${h(s.id)}">
    <div class="ring" style="--c:${h(s.colorHex||"#888")};--p:${pct.toFixed(1)}"><span><span>${fmtG(Math.max(0,s.remaining||0))}<small>g</small></span></span></div>
    <div class="meta">
      <div class="code">${h(s.code)} · ${h(s.material)}${s.diameter&&s.diameter!=1.75?" · "+h(fmtN(s.diameter,2))+" mm":""}</div>
      <h3>${h(label(s))}</h3>
      <div class="chips"><span class="chip">${h(locName(s.locationId))}</span>${status(s).map(([x,c])=>`<span class="pill ${c}">${x}</span>`).join("")}</div>
    </div></button>`;
}

function viewSpools(){
  if(!S.loaded)return `<div class="empty"><p>${t("loading")}</p></div>`;
  if(!S.spools.length)return `<div class="empty"><h3>${t("emptySpoolsH")}</h3><p>${t("emptySpoolsP")}</p>${store.canWrite?`<div class="row" style="justify-content:center"><button class="btn primary" data-act="new-spool">${t("newSpool")}</button><button class="btn" data-act="load-ex">${t("loadEx")}</button></div>`:""}</div>`;
  const mats=[...new Set(S.spools.map(s=>s.material))].sort();
  let list=S.spools.filter(s=>ui.showDone||s.status!=="finita");
  if(ui.q){const q=ui.q.toLowerCase();list=list.filter(s=>[s.code,s.brand,s.material,s.colorName,s.notes,locName(s.locationId)].join(" ").toLowerCase().includes(q))}
  if(ui.mat)list=list.filter(s=>s.material===ui.mat);
  if(ui.loc)list=list.filter(s=>(s.locationId||"_none")===ui.loc);
  if(ui.quick==="low")list=list.filter(s=>s.status!=="finita"&&s.remaining<S.settings.lowThreshold);
  if(ui.quick==="dry")list=list.filter(needsDry);
  const sorters={code:(a,b)=>String(a.code).localeCompare(String(b.code),undefined,{numeric:true}),rem:(a,b)=>a.remaining-b.remaining,mat:(a,b)=>a.material.localeCompare(b.material)||label(a).localeCompare(label(b))};
  list.sort(sorters[ui.sort]);
  const hasEx=S.spools.some(s=>s.example)||S.locations.some(l=>l.example)||S.usage.some(u=>u.example);
  return `
  ${hasEx&&store.canWrite?`<div class="banner row" style="justify-content:space-between">${t("exBanner")}<button class="btn sm" data-act="clear-ex">${t("clearEx")}</button></div>`:""}
  <div class="toolbar">
    <input type="search" id="f-q" placeholder="${h(t("searchPh"))}" value="${h(ui.q)}" aria-label="${h(t("search"))}">
    <select id="f-mat" aria-label="${h(t("material"))}"><option value="">${t("allMat")}</option>${mats.map(m=>`<option ${ui.mat===m?"selected":""}>${h(m)}</option>`).join("")}</select>
    <select id="f-loc" aria-label="${h(t("location"))}"><option value="">${t("allLoc")}</option>${S.locations.map(l=>`<option value="${h(l.id)}" ${ui.loc===l.id?"selected":""}>${h(l.name)}</option>`).join("")}<option value="_none" ${ui.loc==="_none"?"selected":""}>${t("noLocation")}</option></select>
    <select id="f-sort" aria-label="${h(t("sortBy"))}"><option value="code" ${ui.sort==="code"?"selected":""}>${t("sortCode")}</option><option value="rem" ${ui.sort==="rem"?"selected":""}>${t("sortRem")}</option><option value="mat" ${ui.sort==="mat"?"selected":""}>${t("sortMat")}</option></select>
    <label class="chk"><input type="checkbox" id="f-done" ${ui.showDone?"checked":""}> ${t("showDone")}</label>
  </div>
  ${ui.quick?`<div class="row"><span class="pill ${ui.quick==="low"?"crit":"warn"}">${ui.quick==="low"?t("filterLow"):t("filterDry")}</span><button class="btn sm ghost" data-quick="">${t("clearFilter")}</button></div>`:""}
  ${list.length?`<div class="grid">${list.map(spoolCard).join("")}</div>`:`<div class="empty"><p>${t("noMatch")}</p></div>`}`;
}

function viewLocations(){
  if(!S.loaded)return `<div class="empty"><p>${t("loading")}</p></div>`;
  const cards=S.locations.map(l=>{
    const sp=active().filter(s=>s.locationId===l.id);
    const g=sp.reduce((x,s)=>x+Math.max(0,s.remaining||0),0);
    return `<div class="panel loc">
      <div class="loc-h"><div><div class="loc-kind">${t("k_"+kindKey(l.kind))}</div><h3>${h(l.name)}</h3></div>${store.canWrite?`<button class="btn sm ghost" data-editloc="${h(l.id)}">${t("edit")}</button>`:""}</div>
      <div class="loc-num"><span><b>${sp.length}</b>${t("unitSpools")}</span><span><b>${fmtKg(g)}</b>kg</span>${l.example?`<span class="pill ex">${t("sExample")}</span>`:""}</div>
      ${sp.length?`<div class="swatches">${sp.map(s=>`<button class="sw" style="background:${h(s.colorHex||"#888")}" title="${h(s.code+" · "+s.material+" "+label(s))}" aria-label="${h(s.code+" "+label(s))}" data-open="${h(s.id)}"></button>`).join("")}</div>`:`<span class="hint">${t("emptyBox")}</span>`}
      ${l.notes?`<div class="hint">${h(l.notes)}</div>`:""}
    </div>`}).join("");
  const none=active().filter(s=>!s.locationId||!S.locations.some(l=>l.id===s.locationId));
  return `<div class="sec-h"><div><h2>${t("locsH")}</h2><p>${t("locsSub")}</p></div>${store.canWrite?`<button class="btn primary" data-act="new-loc">${t("newLoc")}</button>`:""}</div>
  ${S.locations.length?`<div class="grid" style="margin-top:14px">${cards}</div>`:`<div class="empty" style="margin-top:14px"><h3>${t("noLocsH")}</h3><p>${t("noLocsP")}</p></div>`}
  ${none.length?`<div class="panel" style="margin-top:14px"><div class="loc-kind">${t("toSort")}</div><h3 style="margin:2px 0 8px;font-size:16px">${t("unplaced",{n:none.length})}</h3><div class="swatches">${none.map(s=>`<button class="sw" style="background:${h(s.colorHex||"#888")}" title="${h(s.code+" "+label(s))}" aria-label="${h(s.code)}" data-open="${h(s.id)}"></button>`).join("")}</div></div>`:""}`;
}

function weekStart(d){const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
function viewUsage(){
  if(!S.loaded)return `<div class="empty"><p>${t("loading")}</p></div>`;
  const ws=weekStart(new Date()),weeks=[];
  for(let i=7;i>=0;i--){const s=new Date(ws);s.setDate(s.getDate()-7*i);weeks.push({s,g:0})}
  S.usage.forEach(u=>{const d=new Date(u.date+"T12:00:00");for(let i=weeks.length-1;i>=0;i--){if(d>=weeks[i].s){const e=new Date(weeks[i].s);e.setDate(e.getDate()+7);if(d<e)weeks[i].g+=u.grams;break}}});
  const max=Math.max(100,...weeks.map(w=>w.g));
  const step=Math.pow(10,Math.floor(Math.log10(max)));const nice=Math.ceil(max/step)*step;
  const W=560,H=200,L=44,B=24,T=12,bw=(W-L-8)/8;
  const y=v=>T+(H-T-B)*(1-v/nice);
  const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${h(t("chartAria"))}">
    ${[0,nice/2,nice].map(v=>`<line x1="${L}" x2="${W-4}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${fmtG(v)}</text>`).join("")}
    ${weeks.map((w,i)=>{const x=L+4+i*bw,hh=y(0)-y(w.g);return `<rect x="${x+bw*.18}" y="${y(w.g)}" width="${bw*.64}" height="${Math.max(0,hh)}" rx="2" fill="${i===7?"var(--accent)":"var(--muted)"}" opacity="${i===7?1:.55}"><title>${fmtG(w.g)} g</title></rect><text x="${x+bw/2}" y="${H-6}" text-anchor="middle">${w.s.getDate()}/${w.s.getMonth()+1}</text>`}).join("")}
  </svg>`;
  const since=new Date();since.setDate(since.getDate()-30);
  const last30=S.usage.filter(u=>new Date(u.date+"T12:00:00")>=since);
  const byMat={};last30.forEach(u=>{const s=spoolById(u.spoolId);const m=(s&&s.material)||u.material||"?";byMat[m]=(byMat[m]||0)+u.grams});
  const mats=Object.entries(byMat).sort((a,b)=>b[1]-a[1]);const mmax=Math.max(1,...mats.map(m=>m[1]));
  const tot30=last30.reduce((x,u)=>x+u.grams,0),cost30=last30.reduce((x,u)=>x+(u.cost||0),0);
  const recent=[...S.usage].sort((a,b)=>(b.date+b.createdAt).localeCompare(a.date+a.createdAt)).slice(0,40);
  return `<div class="sec-h"><div><h2>${t("usageH")}</h2><p>${t("usageSub")}</p></div>${store.canWrite?`<button class="btn primary" data-act="log-quick">${t("logUsage")}</button>`:""}</div>
  <div class="cols" style="margin-top:14px">
    <div class="panel chart"><div class="loc-kind" style="margin-bottom:6px">${t("weekly")}</div>${svg}</div>
    <div class="panel" style="display:flex;flex-direction:column;gap:14px">
      <div class="row" style="gap:28px"><div><div class="loc-kind">${t("last30")}</div><div class="result num">${fmtKg(tot30)} <small>kg</small></div></div><div><div class="loc-kind">${t("matCost")}</div><div class="result num">${eur(cost30)}</div></div><div><div class="loc-kind">${t("prints")}</div><div class="result num">${last30.length}</div></div></div>
      <div class="mat-bars">${mats.length?mats.map(([m,g])=>`<div class="mat-bar"><span class="num">${h(m)}</span><div class="track"><div class="fill" style="width:${(g/mmax*100).toFixed(1)}%"></div></div><span class="num" style="text-align:right">${fmtG(g)} g</span></div>`).join(""):`<span class="hint">${t("noUsage30")}</span>`}</div>
    </div>
  </div>
  <div class="panel" style="margin-top:16px"><div class="loc-kind" style="margin-bottom:6px">${t("recent")}</div>
  ${recent.length?`<div class="tbl-wrap"><table><thead><tr><th>${t("thDate")}</th><th>${t("thJob")}</th><th>${t("thSpool")}</th><th>${t("thPrinter")}</th><th class="r">${t("thGrams")}</th><th class="r">${t("thCost")}</th><th></th></tr></thead><tbody>
  ${recent.map(u=>{const s=spoolById(u.spoolId);return `<tr><td class="num">${fmtDate(u.date)}</td><td>${h(u.job||"—")}${u.example?` <span class="pill ex">${t("sExample")}</span>`:""}</td><td>${s?`<span class="dot" style="background:${h(s.colorHex)}"></span>${h(s.code)} ${h(s.material)}`:`<span class="hint">${t("deletedSpool")}</span>`}</td><td>${h(printerName(u.printer||""))}</td><td class="r num">${fmtG(u.grams)}</td><td class="r num">${u.cost?eur(u.cost):"—"}</td><td class="r">${store.canWrite?`<button class="btn sm ghost" data-undo="${h(u.id)}" title="${h(t("undoTitle"))}">${t("undo")}</button>`:""}</td></tr>`}).join("")}
  </tbody></table></div>`:`<div class="empty"><p>${t("noUsage")}</p></div>`}</div>`;
}

function spoolOptions(sel){
  return active().sort((a,b)=>String(a.code).localeCompare(String(b.code),undefined,{numeric:true})).map(s=>`<option value="${h(s.id)}" ${sel===s.id?"selected":""}>${h(s.code)} · ${h(s.material)} ${h(label(s))} (${fmtG(s.remaining)} g)</option>`).join("");
}
function viewTools(){
  const cw=store.canWrite?"":"disabled";
  return `<div class="cols">
    <div class="panel" style="display:flex;flex-direction:column;gap:12px">
      <div class="sec-h"><h2>${t("costH")}</h2></div>
      <form class="f" id="t-cost" onsubmit="return false">
        <label class="full">${t("spool")}<select id="tc-spool"><option value="">${t("manualPrice")}</option>${spoolOptions()}</select></label>
        <label>${t("pricePerKg")}<input type="number" id="tc-kg" step="0.01" min="0" value="25"></label>
        <label>${t("gramsSlicer")}<input type="number" id="tc-g" step="0.1" min="0" value="48"></label>
        <label>${t("hours")}<input type="number" id="tc-h" step="0.1" min="0" value="3"></label>
        <label>${t("energy")}<input type="number" id="tc-e" step="0.01" min="0" value="0.04"><span class="hint">${t("energyHint")}</span></label>
      </form>
      <div class="row" style="gap:28px;align-items:flex-end"><div><div class="loc-kind">${t("material")}</div><div class="result num" id="tc-mat">—</div></div><div><div class="loc-kind">${t("total")}</div><div class="result num" id="tc-tot">—</div></div></div>
    </div>
    <div class="panel" style="display:flex;flex-direction:column;gap:12px">
      <div class="sec-h"><h2>${t("convH")}</h2></div>
      <form class="f" id="t-conv" onsubmit="return false">
        <label>${t("material")}<select id="cv-mat">${Object.keys(MAT).map(m=>`<option>${m}</option>`).join("")}</select></label>
        <label>${t("diameter")}<select id="cv-dia"><option value="1.75">${fmtN(1.75,2)} mm</option><option value="2.85">${fmtN(2.85,2)} mm</option></select></label>
        <label>${t("metres")}<input type="number" id="cv-m" step="0.01" min="0" value="10"></label>
        <label>${t("grams")}<input type="number" id="cv-g" step="0.1" min="0"></label>
      </form>
      <div class="hint" id="cv-info"></div>
    </div>
    <div class="panel" style="display:flex;flex-direction:column;gap:12px">
      <div class="sec-h"><h2>${t("weighH")}</h2></div>
      <p class="hint" style="margin:0">${t("weighP")}</p>
      <form class="f" id="t-weigh">
        <label class="full">${t("spool")}<select id="tw-spool">${spoolOptions()}</select></label>
        <label>${t("gross")}<input type="number" id="tw-gross" step="1" min="0"></label>
        <label>${t("tare")}<input type="number" id="tw-tare" step="1" min="0"></label>
        <div class="full row"><span class="result num" id="tw-res">—</span><button class="btn primary" type="submit" ${cw}>${t("updateRem")}</button></div>
      </form>
    </div>
    <div class="panel" style="display:flex;flex-direction:column;gap:12px">
      <div class="sec-h"><h2>${t("alertsH")}</h2></div>
      <form class="f" id="t-set">
        <label>${t("lowTh")}<input type="number" id="ts-low" min="0" step="10" value="${S.settings.lowThreshold}"></label>
        <label>${t("dryDays")}<input type="number" id="ts-dry" min="1" step="1" value="${S.settings.dryDays}"><span class="hint">${t("dryHint")}</span></label>
        <div class="full"><button class="btn" type="submit" ${cw}>${t("saveAlerts")}</button></div>
      </form>
      <p class="hint" style="margin:0">${t("hygro",{list:[...HYGRO].join(", ")})}</p>
    </div>
    <div class="panel" style="display:flex;flex-direction:column;gap:12px">
      <div class="sec-h"><h2>${t("backupH")}</h2></div>
      <p class="hint" style="margin:0">${store.mode==="db"?t("backupOnline"):t("backupLocal")}</p>
      <div class="row">
        <button class="btn primary" id="bk-export" type="button" ${store.mode==="db"&&!store.downloads?"hidden":""}>${t("exportB")}</button>
        ${store.canWrite?`<label class="btn" for="bk-file">${t("importB")}</label><input type="file" id="bk-file" accept="application/json,.json" hidden>`:""}
      </div>
      <p class="hint" style="margin:0">${t("importWarn")}</p>
    </div>
  </div>`;
}
function bindTools(){
  const v=id=>parseFloat($(id).value)||0;
  const costUpd=()=>{const m=v("#tc-kg")*v("#tc-g")/1000;$("#tc-mat").textContent=eur(m);$("#tc-tot").textContent=eur(m+v("#tc-h")*v("#tc-e"))};
  ["#tc-kg","#tc-g","#tc-h","#tc-e"].forEach(i=>$(i).addEventListener("input",costUpd));
  $("#tc-spool").addEventListener("change",()=>{const sp=spoolById($("#tc-spool").value);if(sp&&perKg(sp))$("#tc-kg").value=perKg(sp).toFixed(2);costUpd()});costUpd();
  const gpm=()=>gPerM($("#cv-mat").value,parseFloat($("#cv-dia").value));
  const info=()=>{$("#cv-info").textContent=t("convInfo",{g:fmtN(gpm(),2),d:fmtN(MAT[$("#cv-mat").value],2),m:fmtG(1000/gpm())})};
  const fromM=()=>{$("#cv-g").value=(v("#cv-m")*gpm()).toFixed(1);info()},fromG=()=>{$("#cv-m").value=(v("#cv-g")/gpm()).toFixed(2);info()};
  $("#cv-m").addEventListener("input",fromM);$("#cv-g").addEventListener("input",fromG);$("#cv-mat").addEventListener("change",fromM);$("#cv-dia").addEventListener("change",fromM);fromM();
  const wsp=()=>spoolById($("#tw-spool").value);
  const wcalc=()=>{$("#tw-res").textContent=$("#tw-gross").value?fmtG(Math.max(0,v("#tw-gross")-v("#tw-tare")))+" g":"—"};
  const wfill=()=>{const s=wsp();$("#tw-tare").value=s?(s.tare??""):"";wcalc()};
  $("#tw-spool").addEventListener("change",wfill);$("#tw-gross").addEventListener("input",wcalc);$("#tw-tare").addEventListener("input",wcalc);wfill();
  $("#t-weigh").addEventListener("submit",async e=>{e.preventDefault();const s=wsp();if(!s||!$("#tw-gross").value)return toast(t("tWeighNeed"));
    const r=Math.max(0,Math.round(v("#tw-gross")-v("#tw-tare")));try{await store.put("spools",s.id,{...strip(s),remaining:r,tare:v("#tw-tare")});toast(t("tWeighed",{c:s.code,g:fmtG(r)}))}catch(er){}});
  $("#t-set").addEventListener("submit",async e=>{e.preventDefault();try{await store.saveSettings({lowThreshold:v("#ts-low"),dryDays:Math.max(1,v("#ts-dry"))});toast(t("tAlertsSaved"))}catch(er){}});
  $("#bk-export").addEventListener("click",exportBackup);
  const bf=$("#bk-file");if(bf)bf.addEventListener("change",e=>{const f=e.target.files[0];if(f)importBackup(f);e.target.value=""});
}

/* ---------- finestre ---------- */
const dlg=$("#dlg");
function openDlg(html,onBind){dlg.innerHTML=html;if(!dlg.open)dlg.showModal();onBind&&onBind()}
dlg.addEventListener("click",e=>{if(e.target===dlg||e.target.closest(".x"))dlg.close()});
const closeBtn=()=>`<button class="x" aria-label="${h(t("close"))}">×</button>`;

function spoolForm(s,dup){
  const isNew=!s||dup;
  const d=s?{...s}:{material:"PLA",diameter:1.75,netWeight:1000,remaining:1000,tare:250,colorHex:"#2b2b2b",opened:"",dried:"",price:""};
  if(dup){d.remaining=d.netWeight;d.opened="";d.dried="";d.code=nextCode()}
  const code=isNew&&!dup?nextCode():d.code;
  openDlg(`<div class="dlg-h"><h2>${isNew?t("newSpoolH"):t("editSpoolH",{c:h(d.code)})}</h2>${closeBtn()}</div>
  <form class="f dlg-b" id="sf" style="display:grid">
    <label>${t("code")}<input type="text" id="sf-code" value="${h(code)}" required></label>
    <label>${t("brand")}<input type="text" id="sf-brand" value="${h(d.brand)}" placeholder="${h(t("brandPh"))}" list="brands"></label>
    <datalist id="brands">${[...new Set(S.spools.map(x=>x.brand).filter(Boolean))].map(b=>`<option value="${h(b)}">`).join("")}</datalist>
    <label>${t("material")}<select id="sf-mat">${Object.keys(MAT).map(m=>`<option ${d.material===m?"selected":""}>${m}</option>`).join("")}</select></label>
    <label>${t("diameter")}<select id="sf-dia"><option value="1.75" ${d.diameter!=2.85?"selected":""}>${fmtN(1.75,2)} mm</option><option value="2.85" ${d.diameter==2.85?"selected":""}>${fmtN(2.85,2)} mm</option></select></label>
    <label>${t("colorName")}<input type="text" id="sf-cname" value="${h(d.colorName)}" placeholder="${h(t("colorNamePh"))}"></label>
    <label>${t("color")}<div class="color-in"><input type="color" id="sf-hex" value="${h(d.colorHex||"#2b2b2b")}" aria-label="${h(t("pickColor"))}"><input type="text" id="sf-hext" value="${h(d.colorHex||"#2b2b2b")}" aria-label="${h(t("colorCode"))}"></div></label>
    <label>${t("net")}<input type="number" id="sf-net" min="1" step="1" value="${h(d.netWeight)}" required></label>
    <label>${t("rem")}<input type="number" id="sf-rem" min="0" step="1" value="${h(d.remaining)}" required></label>
    <label>${t("tareSpool")}<input type="number" id="sf-tare" min="0" step="1" value="${h(d.tare)}"></label>
    <label>${t("price")}<input type="number" id="sf-price" min="0" step="0.01" value="${h(d.price)}"></label>
    <label>${t("location")}<select id="sf-loc"><option value="">${t("noLocation")}</option>${S.locations.map(l=>`<option value="${h(l.id)}" ${d.locationId===l.id?"selected":""}>${h(l.name)}</option>`).join("")}</select></label>
    <label>${t("opened")}<input type="date" id="sf-open" value="${h(d.opened)}"></label>
    <label>${t("dried")}<input type="date" id="sf-dry" value="${h(d.dried)}"></label>
    <label class="full">${t("notes")}<textarea id="sf-notes" placeholder="${h(t("notesPh"))}">${h(d.notes)}</textarea></label>
  </form>
  <div class="dlg-f"><span></span><div class="row"><button class="btn ghost x" type="button">${t("cancel")}</button><button class="btn primary" form="sf" type="submit">${isNew?t("addSpool"):t("save")}</button></div></div>`,()=>{
    const hx=$("#sf-hex"),ht=$("#sf-hext");hx.addEventListener("input",()=>ht.value=hx.value);ht.addEventListener("input",()=>{if(/^#[0-9a-f]{6}$/i.test(ht.value))hx.value=ht.value});
    $("#sf-net").addEventListener("change",()=>{if(isNew&&!dup)$("#sf-rem").value=$("#sf-net").value});
    $("#sf").addEventListener("submit",async e=>{e.preventDefault();
      const n=id=>{const x=parseFloat($(id).value);return isNaN(x)?null:x};
      const rec={code:$("#sf-code").value.trim(),brand:$("#sf-brand").value.trim(),material:$("#sf-mat").value,diameter:parseFloat($("#sf-dia").value),
        colorName:$("#sf-cname").value.trim(),colorHex:/^#[0-9a-f]{6}$/i.test(ht.value)?ht.value:hx.value,netWeight:n("#sf-net")||1000,remaining:n("#sf-rem")??0,
        tare:n("#sf-tare"),price:n("#sf-price"),locationId:$("#sf-loc").value,opened:$("#sf-open").value,dried:$("#sf-dry").value,notes:$("#sf-notes").value.trim(),
        status:(s&&!dup&&s.status)||"attiva",example:!!(s&&!dup&&s.example),createdAt:(s&&!dup&&s.createdAt)||new Date().toISOString()};
      try{await store.put("spools",isNew?newId():s.id,rec);dlg.close();toast(isNew?t("added",{c:rec.code}):t("saved",{c:rec.code}))}catch(er){}
    });
  });
}

function spoolDetail(id){
  const s=spoolById(id);if(!s)return;
  const hist=S.usage.filter(u=>u.spoolId===id).sort((a,b)=>(b.date+b.createdAt).localeCompare(a.date+a.createdAt));
  const used=hist.reduce((x,u)=>x+u.grams,0);
  const st=status(s);const pct=s.netWeight?Math.max(0,Math.min(100,s.remaining/s.netWeight*100)):0;
  const meters=Math.max(0,s.remaining)/gPerM(s.material,s.diameter);
  const cw=store.canWrite;
  openDlg(`<div class="dlg-h"><div class="ring" style="--c:${h(s.colorHex)};--p:${pct.toFixed(1)};width:52px;height:52px"><span></span></div><h2>${h(s.code)} · ${h(s.material)}<br><span style="font:500 15px var(--f-body);text-transform:none;letter-spacing:0;color:var(--muted)">${h(label(s))}</span></h2>${closeBtn()}</div>
  <div class="dlg-b">
    ${st.length?`<div class="chips">${st.map(([x,c])=>`<span class="pill ${c}">${x}</span>`).join("")}</div>`:""}
    <dl class="kv" style="margin:0">
      <div><dt>${t("kRemaining")}</dt><dd>${fmtG(Math.max(0,s.remaining))} g</dd></div>
      <div><dt>${t("kMetres")}</dt><dd>${fmtG(meters)} m</dd></div>
      <div><dt>${t("kFull")}</dt><dd>${fmtG(s.netWeight)} g</dd></div>
      <div><dt>${t("kPerKg")}</dt><dd>${perKg(s)?eur(perKg(s)):"—"}</dd></div>
      <div><dt>${t("kLocation")}</dt><dd style="font-family:var(--f-body)">${h(locName(s.locationId))}</dd></div>
      <div><dt>${t("kDiameter")}</dt><dd>${fmtN(s.diameter||1.75,2)} mm</dd></div>
      <div><dt>${t("kOpened")}</dt><dd>${fmtDate(s.opened)}</dd></div>
      <div><dt>${t("kDried")}</dt><dd>${fmtDate(s.dried)}</dd></div>
      <div><dt>${t("kUsed")}</dt><dd>${fmtG(used)} g</dd></div>
    </dl>
    ${s.notes?`<p style="margin:0;white-space:pre-wrap">${h(s.notes)}</p>`:""}
    ${cw&&s.status!=="finita"?`<div class="quick">
      <form class="panel" id="q-use"><h4>${t("logPrint")}</h4><div class="row"><input type="number" id="qu-g" min="0.1" step="0.1" placeholder="${h(t("grams"))}" required aria-label="${h(t("grams"))}"><select id="qu-p" aria-label="${h(t("printer"))}">${PRINTERS.map(p=>`<option value="${h(p)}">${h(printerName(p))}</option>`).join("")}</select></div><input type="text" id="qu-j" placeholder="${h(t("jobOpt"))}" aria-label="${h(t("job"))}"><button class="btn primary sm" type="submit">${t("subtract")}</button></form>
      <form class="panel" id="q-w"><h4>${t("weighing")}</h4><div class="row"><input type="number" id="qw-g" min="0" step="1" placeholder="${h(t("grossPh"))}" required aria-label="${h(t("gross"))}"></div><span class="hint">${t("tareInfo",{t:s.tare!=null?fmtG(s.tare)+" g":t("tareUnset")})}</span><button class="btn sm" type="submit">${t("updateRem")}</button></form>
    </div>`:""}
    <div><div class="loc-kind" style="margin-bottom:4px">${t("history")}</div>${hist.length?`<div class="tbl-wrap"><table><tbody>${hist.slice(0,12).map(u=>`<tr><td class="num">${fmtDate(u.date)}</td><td>${h(u.job||"—")}</td><td>${h(printerName(u.printer||""))}</td><td class="r num">${fmtG(u.grams)} g</td></tr>`).join("")}</tbody></table></div>`:`<span class="hint">${t("noHist")}</span>`}</div>
  </div>
  ${cw?`<div class="dlg-f"><div class="row"><button class="btn danger" id="d-del">${t("del")}</button></div><div class="row">
    ${s.status!=="finita"&&HYGRO.has(s.material)?`<button class="btn" id="d-dry">${t("driedToday")}</button>`:""}
    <button class="btn" id="d-fin">${s.status==="finita"?t("reactivate"):t("markDone")}</button>
    <button class="btn" id="d-dup">${t("rebuy")}</button>
    <button class="btn primary" id="d-edit">${t("edit")}</button></div></div>`:""}`,()=>{
    if(!cw)return;
    const save=async(patch,msg)=>{try{await store.put("spools",s.id,{...strip(s),...patch});toast(msg);spoolDetail(s.id)}catch(e){}};
    $("#d-edit").onclick=()=>spoolForm(s);
    $("#d-dup").onclick=()=>spoolForm(s,true);
    $("#d-fin").onclick=()=>save({status:s.status==="finita"?"attiva":"finita"},s.status==="finita"?t("tReactivated"):t("tDone"));
    const dd=$("#d-dry");if(dd)dd.onclick=()=>save({dried:today()},t("tDried"));
    const db_=$("#d-del");db_.onclick=async()=>{if(!db_.classList.contains("armed")){db_.classList.add("armed");db_.textContent=t("confirmDel");return}
      try{await store.del("spools",s.id);dlg.close();toast(t("tDeleted",{c:s.code}))}catch(e){}};
    const qu=$("#q-use");if(qu)qu.addEventListener("submit",async e=>{e.preventDefault();await logUsage(s.id,parseFloat($("#qu-g").value),$("#qu-j").value,$("#qu-p").value,today());spoolDetail(s.id)});
    const qw=$("#q-w");if(qw)qw.addEventListener("submit",e=>{e.preventDefault();const r=Math.max(0,Math.round(parseFloat($("#qw-g").value)-(s.tare||0)));save({remaining:r},t("tRemUpd",{g:fmtG(r)}))});
  });
}

async function logUsage(spoolId,grams,job,printer,date){
  const s=spoolById(spoolId);if(!s||!(grams>0))return toast(t("tEnterGrams"));
  const rem=Math.max(0,(s.remaining||0)-grams);
  const u={spoolId,grams,job:(job||"").trim(),printer,date,cost:+(perKg(s)*grams/1000).toFixed(2),material:s.material,createdAt:new Date().toISOString()};
  try{await store.put("usage",newId(),u);await store.put("spools",s.id,{...strip(s),remaining:rem});
    toast(t("tSubtracted",{g:fmtG(grams),c:s.code})+(rem<S.settings.lowThreshold?t("tLowSuffix"):""))}catch(e){}
}

function usageForm(preId){
  if(!active().length)return toast(t("tAddSpoolFirst"));
  let mode="g";
  openDlg(`<div class="dlg-h"><h2>${t("logUsageH")}</h2>${closeBtn()}</div>
  <form class="f dlg-b" id="uf" style="display:grid">
    <label class="full">${t("spool")}<select id="uf-s">${spoolOptions(preId)}</select></label>
    <label>${t("qty")}<input type="number" id="uf-q" min="0.1" step="0.1" required></label>
    <label>${t("unit")}<div class="seg" role="group"><button type="button" data-u="g" aria-pressed="true">${t("grams")}</button><button type="button" data-u="m" aria-pressed="false">${t("metres")}</button></div></label>
    <label>${t("job")}<input type="text" id="uf-j" placeholder="${h(t("jobPh"))}"></label>
    <label>${t("printer")}<select id="uf-p">${PRINTERS.map(p=>`<option value="${h(p)}">${h(printerName(p))}</option>`).join("")}</select></label>
    <label>${t("date")}<input type="date" id="uf-d" value="${today()}"></label>
    <div class="full hint" id="uf-info"></div>
  </form>
  <div class="dlg-f"><span></span><div class="row"><button class="btn ghost x" type="button">${t("cancel")}</button><button class="btn primary" form="uf" type="submit">${t("subtractFrom")}</button></div></div>`,()=>{
    const info=()=>{const s=spoolById($("#uf-s").value);const q=parseFloat($("#uf-q").value)||0;if(!s)return;
      const g=mode==="m"?q*gPerM(s.material,s.diameter):q;$("#uf-info").textContent=t("usageInfo",{g:fmtG(g),c:eur(perKg(s)*g/1000),r:fmtG(Math.max(0,s.remaining-g))})};
    document.querySelectorAll("#uf .seg button").forEach(b=>b.onclick=()=>{mode=b.dataset.u;document.querySelectorAll("#uf .seg button").forEach(x=>x.setAttribute("aria-pressed",x===b));info()});
    $("#uf-s").onchange=info;$("#uf-q").oninput=info;info();
    $("#uf").addEventListener("submit",async e=>{e.preventDefault();const s=spoolById($("#uf-s").value);const q=parseFloat($("#uf-q").value);
      const g=+(mode==="m"?q*gPerM(s.material,s.diameter):q).toFixed(1);await logUsage(s.id,g,$("#uf-j").value,$("#uf-p").value,$("#uf-d").value||today());dlg.close()});
  });
}

function locForm(l){
  const isNew=!l;const d=l||{name:"",kind:"shelf",notes:""};
  const inside=l?S.spools.filter(s=>s.locationId===l.id).length:0;
  openDlg(`<div class="dlg-h"><h2>${isNew?t("newLocH"):t("editLocH")}</h2>${closeBtn()}</div>
  <form class="f dlg-b" id="lf" style="display:grid">
    <label>${t("name")}<input type="text" id="lf-n" value="${h(d.name)}" placeholder="${h(t("namePh"))}" required></label>
    <label>${t("kind")}<select id="lf-k">${KINDS.map(k=>`<option value="${k}" ${kindKey(d.kind)===k?"selected":""}>${t("k_"+k)}</option>`).join("")}</select></label>
    <label class="full">${t("notes")}<textarea id="lf-no" placeholder="${h(t("locNotesPh"))}">${h(d.notes)}</textarea></label>
  </form>
  <div class="dlg-f"><div>${l?`<button class="btn danger" id="lf-del">${t("del")}</button>`:""}</div><div class="row"><button class="btn ghost x" type="button">${t("cancel")}</button><button class="btn primary" form="lf" type="submit">${isNew?t("create"):t("save")}</button></div></div>`,()=>{
    $("#lf").addEventListener("submit",async e=>{e.preventDefault();const rec={name:$("#lf-n").value.trim(),kind:$("#lf-k").value,notes:$("#lf-no").value.trim(),example:!!(l&&l.example)};
      try{await store.put("locations",l?l.id:newId(),rec);dlg.close();toast(isNew?t("tLocCreated"):t("tLocSaved"))}catch(er){}});
    const b=$("#lf-del");if(b)b.onclick=async()=>{if(!b.classList.contains("armed")){b.classList.add("armed");b.textContent=inside?t("delWithN",{n:inside}):t("confirmDel");return}
      try{await store.del("locations",l.id);dlg.close();toast(t("tLocDeleted"))}catch(er){}};
  });
}

/* ---------- esempi ---------- */
async function clearExamples(){
  const ex=[...S.usage.filter(x=>x.example).map(x=>["usage",x.id]),...S.spools.filter(x=>x.example).map(x=>["spools",x.id]),...S.locations.filter(x=>x.example).map(x=>["locations",x.id])];
  for(const [c,i] of ex){try{await store.del(c,i)}catch(e){return}}
  toast(t("tExRemoved"));
}
async function loadExamples(){
  const ago=n=>{const d=new Date();d.setDate(d.getDate()-n);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
  const now=new Date().toISOString();
  const sp=(code,brand,material,colorName,colorHex,netWeight,remaining,tare,price,locationId,opened,dried,notes)=>({code,brand,material,diameter:1.75,colorName,colorHex,netWeight,remaining,tare,price,locationId,opened,dried,notes,status:"attiva",example:true,createdAt:now});
  const us=(spoolId,grams,job,printer,n,cost,material)=>({spoolId,grams,job,printer,date:ago(n),cost,material,example:true,createdAt:now});
  const data={
    locations:{exloc1:{name:t("exLoc1"),kind:"shelf",notes:"",example:true},exloc2:{name:"Dry box 1",kind:"drybox",notes:t("exLoc2Notes"),example:true}},
    spools:{
      exsp1:sp("F-001","Prusament","PLA","Galaxy Black","#2b2d33",1000,640,250,29.99,"exloc1",ago(45),"",t("exNotes1")),
      exsp2:sp("F-002","Polymaker","PETG",t("exColor2"),"#f07a1a",1000,120,140,24.5,"exloc1",ago(90),ago(68),""),
      exsp3:sp("F-003","Prusament","PETG","Jet Black","#151515",1000,880,250,27.99,"exloc2",ago(16),ago(16),""),
      exsp4:sp("F-004","Polymaker","TPU",t("exColor4"),"#d9e6ec",750,520,180,31,"",ago(63),"",t("exNotes4")),
      exsp5:sp("F-005","Prusament","ASA","Signal White","#f2f2ee",850,850,250,32.99,"exloc1","","",t("exNotes5"))},
    usage:{exu1:us("exsp1",96,t("exJob1"),"Core One",5,2.88,"PLA"),exu2:us("exsp3",120,t("exJob2"),"Core One",2,3.36,"PETG"),exu3:us("exsp2",210,t("exJob3"),"Mini+",14,5.15,"PETG"),exu4:us("exsp4",35,t("exJob4"),"Mini+",21,1.45,"TPU")}
  };
  try{for(const col of ["locations","spools","usage"])for(const [id,rec] of Object.entries(data[col]))await store.put(col,id,rec);toast(t("tExLoaded"))}catch(e){}
}

/* ---------- backup ---------- */
async function exportBackup(){
  const data=JSON.stringify({app:"darkstar-filamenti",version:1,exportedAt:new Date().toISOString(),spools:S.spools,locations:S.locations,usage:S.usage,settings:S.settings},null,2);
  const filename=`filamenti-backup-${today()}.json`;
  if(store.downloads){try{const r=await store.downloads.save({filename,data});if(r!=="cancelled")toast(t("tExported"))}catch(e){toast(t("tSaveFail"))}return}
  const url=URL.createObjectURL(new Blob([data],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);toast(t("tExported"));
}
function importBackup(file){
  const r=new FileReader();
  r.onload=async()=>{let d;try{d=JSON.parse(r.result);if(!Array.isArray(d.spools))throw new Error("format")}catch(e){return toast(t("tBadBackup"))}
    toast(t("tImporting"));try{await store.replaceAll(d);toast(t("tImported",{n:(d.spools||[]).length}))}catch(e){}};
  r.readAsText(file);
}

/* ---------- eventi ---------- */
document.addEventListener("click",e=>{
  const el=e.target.closest("[data-tab],[data-act],[data-open],[data-quick],[data-editloc],[data-undo],#lang-btn,#theme-btn");if(!el)return;
  if(el.id==="theme-btn"){theme={auto:"light",light:"dark",dark:"auto"}[theme];try{theme==="auto"?localStorage.removeItem(THEME_KEY):localStorage.setItem(THEME_KEY,theme)}catch(er){}applyTheme();applyStatic();return}
  if(el.id==="lang-btn"){lang=lang==="it"?"en":"it";try{localStorage.setItem(LANG_KEY,lang)}catch(er){}if(dlg.open)dlg.close();render();return}
  if(el.dataset.tab){ui.tab=el.dataset.tab;try{localStorage.setItem("dsf-tab",ui.tab)}catch(er){}render();return}
  if(el.dataset.open){spoolDetail(el.dataset.open);return}
  if(el.dataset.editloc){locForm(S.locations.find(l=>l.id===el.dataset.editloc));return}
  if("quick" in el.dataset){ui.quick=el.dataset.quick;ui.tab="bobine";render();return}
  if(el.dataset.undo){const u=S.usage.find(x=>x.id===el.dataset.undo);if(!u)return;const s=spoolById(u.spoolId);
    (async()=>{try{await store.del("usage",u.id);if(s)await store.put("spools",s.id,{...strip(s),remaining:Math.min(s.netWeight,(s.remaining||0)+u.grams)});toast(t("undo")+" ✓")}catch(er){}})();return}
  const a=el.dataset.act;
  if(a==="load-ex")loadExamples();else if(a==="new-spool")spoolForm();else if(a==="log-quick")usageForm();else if(a==="new-loc")locForm();else if(a==="clear-ex")clearExamples();
});
document.addEventListener("input",e=>{if(e.target.id==="f-q"){ui.q=e.target.value;const pos=e.target.selectionStart;render();const i=$("#f-q");i.focus();i.setSelectionRange(pos,pos)}});
document.addEventListener("change",e=>{const id=e.target.id;
  if(id==="f-mat")ui.mat=e.target.value;else if(id==="f-loc")ui.loc=e.target.value;else if(id==="f-sort")ui.sort=e.target.value;else if(id==="f-done")ui.showDone=e.target.checked;else return;render()});

/* ---------- avvio ---------- */
function startLocal(){
  store.mode="local";store.loadLocal();sortLocs();S.loaded=true;
  if(!store.localOk)showBanner(t("bannerBlocked"));
  render();
}
async function startOnline(){
  let db=null;
  try{db=await window.claude.use("db")}catch(e){db=null}
  if(!db){startLocal();return}
  store.mode="db";store.db=db;
  try{store.downloads=await window.claude.use("downloads")}catch(e){store.downloads=null}
  try{const user=await window.claude.use("user");if(user&&user.can){const c=await user.can("data.write");if(c===false)store.canWrite=false}}catch(e){}
  const got=new Set();const ready=k=>{got.add(k);if(got.size>=3)S.loaded=true;render()};
  const onErr=e=>{if(e&&e.code==="revoked"){store.canWrite=false;render()}};
  db.collection("spools").onSnapshot(s=>{S.spools=s.docs.map(d=>({id:d.id,...d.data()}));ready("s")},onErr);
  db.collection("locations").onSnapshot(s=>{S.locations=s.docs.map(d=>({id:d.id,...d.data()}));sortLocs();ready("l")},onErr);
  db.collection("usage").orderBy("date","desc").limit(1000).onSnapshot(s=>{S.usage=s.docs.map(d=>({id:d.id,...d.data()}));ready("u")},onErr);
  db.doc("settings/main").onSnapshot(d=>{if(d.exists)S.settings={...S.settings,...d.data()};render()},onErr);
}
render();
const hasClaude=()=>window.claude&&typeof window.claude.use==="function";
if(hasClaude())startOnline();
else if(window.self!==window.top){let n=0;const iv=setInterval(()=>{if(hasClaude()){clearInterval(iv);startOnline()}else if(++n>8){clearInterval(iv);startLocal()}},100)}
else startLocal();
})();
