"use strict";
// Protezione: l'app non può essere mostrata dentro pagine di altri siti (clickjacking).
if (window.top !== window.self) {
  document.documentElement.style.display = "none";
  try { window.top.location = window.self.location.href; } catch (e) {}
}
const DIS = [
  {id:"motoria", label:"Motoria", ico:"♿"},
  {id:"visiva", label:"Visiva", ico:"◉"},
  {id:"uditiva", label:"Uditiva", ico:"≋"},
  {id:"intellettiva", label:"Intellettiva / relazionale", ico:"✱"}
];
const ALL = DIS.map(d=>d.id);

const CRIT = [
  {id:"ingresso", label:"Ingresso senza gradini o con rampa", dis:["motoria"]},
  {id:"spogliatoi", label:"Spogliatoi e bagni accessibili", dis:["motoria"]},
  {id:"attrezzi", label:"Attrezzi o ausili adattati", dis:["motoria","visiva"]},
  {id:"parcheggio", label:"Parcheggio riservato vicino", dis:["motoria"]},
  {id:"tattili", label:"Percorsi tattili e segnaletica in braille", dis:["visiva"]},
  {id:"visivo", label:"Avvisi visivi e istruttore che conosce la LIS", dis:["uditiva"]},
  {id:"easy", label:"Istruzioni semplici, con immagini, ambiente tranquillo", dis:["intellettiva"]},
  {id:"staff", label:"Istruttori formati sulla disabilità", dis:ALL}
];

// Luoghi reali da fonti pubbliche. Coordinate approssimative (prototipo).
// Luoghi reali da fonti pubbliche. Coordinate approssimative.
const PLACES = [
  // ---- Torino città ----
  {id:"cip", comune:"Torino", name:"Comitato Paralimpico – Piemonte", kind:"Orientamento e corsi di avviamento",
   addr:"Via Giordano Bruno 191, Torino", lat:45.031, lon:7.648, sports:["multisport"], dis:ALL,
   desc:"Ente che coordina lo sport paralimpico in Piemonte. Organizza corsi di avviamento alle discipline paralimpiche per chi non è ancora tesserato. Buon punto di partenza per capire quale sport fa per te, anche in provincia.",
   src:"Regione Piemonte; CIP Piemonte, avviso corsi 2026", contact:"piemonte@comitatoparalimpico.it"},
  {id:"hbtorino", comune:"Torino", name:"Handibasket Torino (HB Torino UICEP)", kind:"Squadra di basket in carrozzina",
   addr:"Via Cavalli 38, Torino (sede)", lat:45.075, lon:7.651, approx:true, sports:["basket"], dis:["motoria"],
   desc:"Associazione Sport Disabili Handibasket Torino. Squadra che gioca nel campionato italiano di Serie B di basket in carrozzina. In passato le partite casalinghe si giocavano nella palestra di via Moncrivello 8: da confermare.",
   src:"Regione Piemonte; disabili.com; VareseNews"},
  {id:"sportdipiu", comune:"Torino", name:"Sportdipiù – Associazione Sport Disabili Piemonte", kind:"Associazione sportiva",
   addr:"Via Cernaia 24, Torino (sede)", lat:45.0705, lon:7.672, sports:["hockey","multisport"], dis:["motoria"],
   desc:"Associazione torinese impegnata nella diffusione del para ice hockey e dello sport per persone con disabilità.",
   src:"Regione Piemonte; Avvenire"},
  {id:"nuoto3", comune:"Torino", name:"Nuoto per persone con disabilità – Circoscrizione 3", kind:"Progetto di associazioni con il Comune",
   addr:"Circoscrizione 3 (San Paolo, Cenisia, Pozzo Strada, Cit Turin, Borgata Lesna)", lat:45.066, lon:7.640, approx:true, sports:["nuoto"], dis:ALL,
   desc:"Rete di associazioni Pandha, Fuori Onda, Paideia e Senza Limiti con l'Assessorato allo Sport. Circa 400 partecipanti, alcuni atleti agonisti. Piscina esatta da confermare.",
   src:"Comune di Torino, Circoscrizione 3"},
  {id:"acli", comune:"Torino", name:"US Acli Torino – \"Sport per tutti secondo ciascuno\"", kind:"Progetto sportivo, Circoscrizione 7",
   addr:"Via Perrone 3 bis, Torino (sede)", lat:45.0725, lon:7.6705, sports:["multisport"], dis:["motoria","intellettiva"],
   desc:"Progetto finanziato dalla Circoscrizione 7 nel 2026 per persone con disabilità fisica e intellettiva. Massimo 20 partecipanti.",
   src:"Comune di Torino, Circoscrizione 7, 2026"},
  {id:"acli-nuoto", comune:"Torino", name:"US Acli Torino – nuoto alla Piscina Franzoj", kind:"Corso di nuoto, Circoscrizione 4",
   addr:"Piscina Franzoj, Strada Antica di Collegno 211, Torino", lat:45.0862, lon:7.6215, approx:true, sports:["nuoto"], dis:ALL,
   desc:"Inserimento di persone con disabilità nelle attività di nuoto, stagione ottobre 2025 – maggio 2026. Posti limitati (circa 5 persone).",
   src:"Comune di Torino, Circoscrizione 4"},
  {id:"giuco", comune:"Torino", name:"GiuCo '97", kind:"Associazione sportiva",
   addr:"Zona Porta Palazzo, Torino", lat:45.079, lon:7.683, approx:true, sports:["calcio","multisport"], dis:ALL,
   desc:"Associazione ispirata al Cottolengo con la missione di permettere a tutti di fare sport.",
   src:"Avvenire"},
  {id:"insuperabili", comune:"Torino", name:"Insuperabili", kind:"Scuole calcio inclusive",
   addr:"Torino (sedi da confermare)", sports:["calcio"], dis:ALL,
   desc:"Nata a Torino, fa giocare a calcio bambini, ragazzi e adulti con disabilità fisico-motoria, cognitivo-relazionale, comportamentale e sensoriale.",
   src:"Superabile (INAIL)"},
  {id:"paideia", comune:"Torino", name:"Bike sharing accessibile – Fondazione Paideia", kind:"Biciclette adattate",
   addr:"Lungo il Po, Torino (punto esatto da confermare)", lat:45.054, lon:7.686, approx:true, sports:["ciclismo"], dis:ALL,
   desc:"Biciclette adattate per bambini e famiglie con disabilità sui percorsi ciclabili della città. Volontari e istruttori di Paideia Sport aiutano a scegliere la bici adatta.",
   src:"disabili.com"},
  {id:"cus", comune:"Torino", name:"CUS Torino", kind:"Centro universitario sportivo",
   addr:"Via Paolo Braccini 1, Torino", lat:45.064, lon:7.656, sports:["multisport"], dis:[],
   desc:"Segnalato da Turismo Torino tra le realtà di sport accessibile. Discipline adattate da verificare.",
   src:"Turismo Torino"},
  {id:"asti", comune:"Torino", name:"Palazzetto dello Sport Gianni Asti", kind:"Impianto comunale",
   addr:"Parco Ruffini, Torino", lat:45.0597, lon:7.6418, sports:["multisport"], dis:[],
   desc:"Impianto gestito direttamente dalla Città. Accessibilità non ancora rilevata.",
   src:"Città di Torino, impianti sportivi"},
  {id:"nebiolo", comune:"Torino", name:"Stadio di Atletica Primo Nebiolo", kind:"Impianto comunale",
   addr:"Parco Ruffini, Torino", lat:45.0578, lon:7.6455, sports:["atletica"], dis:[],
   desc:"Impianto gestito direttamente dalla Città. Accessibilità non ancora rilevata.",
   src:"Città di Torino, impianti sportivi"},
  {id:"monumentale", comune:"Torino", name:"Piscina Stadio Monumentale", kind:"Impianto comunale",
   addr:"Zona Stadio Olimpico, Torino", lat:45.043, lon:7.649, approx:true, sports:["nuoto"], dis:[],
   desc:"Impianto gestito direttamente dalla Città. Accessibilità non ancora rilevata.",
   src:"Città di Torino, impianti sportivi"},
  {id:"tazzoli", comune:"Torino", name:"Palazzo del Ghiaccio Tazzoli", kind:"Impianto comunale",
   addr:"Via San Remo, Torino", lat:45.035, lon:7.624, approx:true, sports:["hockey"], dis:[],
   desc:"Impianto gestito direttamente dalla Città. Accessibilità non ancora rilevata.",
   src:"Città di Torino, impianti sportivi"},
  // ---- Provincia ----
  {id:"freewhite", comune:"Sestriere", name:"Freewhite – Sestriere Sport Disabili", kind:"Scuola di sci adattato",
   addr:"Via Pinerolo 17, Sestriere", lat:44.957, lon:6.880, sports:["sci"], dis:ALL,
   desc:"Corsi di sci alpino sitting (monosci) e standing, anche gratuiti di avviamento, per persone con disabilità fisico-motoria anche grave, dai 6 ai 65 anni. Anche snowboard e corsi di perfezionamento. Attività stagionale, da dicembre.",
   src:"Regione Piemonte; disabili.com"},
  {id:"assam", comune:"Chieri", name:"ASD A.S.S.A.M. – \"Diversamente sport\"", kind:"Associazione sportiva",
   addr:"Via Monginevro 2, Chieri", lat:45.010, lon:7.818, approx:true, sports:["multisport"], dis:[],
   desc:"Progetto sportivo per persone con disabilità finanziato dalla Regione Piemonte (elenco 2016). Verificare se l'attività è ancora attiva e per quali disabilità.",
   src:"Regione Piemonte, progetti disabili 2016"},
  {id:"judochieri", comune:"Chieri", name:"Arti marziali Jigoro Kano – \"Buon Judo a tutti\"", kind:"Judo adattato",
   addr:"Via Vittorio Emanuele 63, Chieri", lat:45.012, lon:7.824, approx:true, sports:["judo"], dis:[],
   desc:"Progetto di judo per persone con disabilità finanziato dalla Regione Piemonte (elenco 2017). Verificare se l'attività è ancora attiva.",
   src:"Regione Piemonte, progetti disabili 2017"},
  {id:"sottosotto", comune:"San Mauro Torinese", name:"ASD Sotto sotto – \"Un'esperienza di apnea\"", kind:"Apnea e attività subacquee",
   addr:"Via Bartolomeo Elia 8/a, San Mauro Torinese", lat:45.103, lon:7.766, approx:true, sports:["acqua"], dis:[],
   desc:"Progetto di apnea per persone con disabilità finanziato dalla Regione Piemonte (elenco 2017). Verificare se l'attività è ancora attiva.",
   src:"Regione Piemonte, progetti disabili 2017"},
  {id:"pagaiando", comune:"Moncalieri", name:"\"Pagaiando al buio\" – canoa per persone cieche", kind:"Progetto di canoa",
   addr:"Moncalieri (associazione e luogo da confermare)", lat:44.999, lon:7.683, approx:true, sports:["canoa"], dis:["visiva"],
   desc:"Progetto di canoa per persone cieche e ipovedenti finanziato dalla Regione Piemonte (elenco 2017). Nome dell'associazione e luogo da confermare.",
   src:"Regione Piemonte, progetti disabili 2017"},
  {id:"nessunoescluso", comune:"Villafranca Piemonte", name:"Nessuno escluso ASD", kind:"Equitazione e riabilitazione equestre",
   addr:"Frazione San Luca 27, Villafranca Piemonte", lat:44.780, lon:7.500, approx:true, sports:["equitazione"], dis:["intellettiva"],
   desc:"Percorso di riabilitazione equestre per bambini con autismo insieme a bambini senza disabilità (progetto regionale, elenco 2017). Verificare se l'attività è ancora attiva.",
   src:"Regione Piemonte, progetti disabili 2017"},
  // ---- Cintura ovest e dintorni ----
  {id:"oasi-rivalta", comune:"Rivalta di Torino", name:"O.A.S.I. Laura Vicuna – basket unificato", kind:"Centro sportivo",
   addr:"Via Laura Vicuna 8, Rivalta di Torino", lat:45.033, lon:7.525, approx:true, sports:["basket"], dis:["intellettiva"],
   desc:"Ha ospitato nel 2025 un torneo di basket unificato, con squadre di giocatori con e senza disabilità, tra cui Pandha Torino. Verificare se ci sono attività inclusive durante tutto l'anno.",
   src:"Tuttosport, marzo 2025"},
  {id:"audido", comune:"Alpignano", name:"Team Audido – sci club", kind:"Sci club con atleti Special Olympics",
   addr:"Alpignano (sede da confermare)", sports:["sci"], dis:["intellettiva"],
   desc:"Sci club di Alpignano con atleti con disabilità intellettiva che partecipano ai Giochi Special Olympics. Contatti e luoghi di allenamento da confermare.",
   src:"disabili.com"},
  {id:"piscina-grugliasco", comune:"Grugliasco", name:"Piscina comunale di Grugliasco (Rari Nantes Torino)", kind:"Impianto comunale",
   addr:"Corso Torino 82, Grugliasco", lat:45.0645, lon:7.5905, approx:true, sports:["nuoto"], dis:[],
   desc:"Piscina comunale gestita da Rari Nantes Torino. Corsi specifici per persone con disabilità e accessibilità non ancora rilevati.",
   src:"Regione Piemonte, progetto famiglie Grugliasco 2024"},
  {id:"juve-vinovo", comune:"Vinovo", name:"Juventus – Calcio integrato giovanile", kind:"Progetto di calcio integrato",
   addr:"Allianz Training Center, Vinovo", lat:44.955, lon:7.632, approx:true, sports:["calcio"], dis:[],
   desc:"Progetto \"Passaggi di inclusione\" di calcio integrato giovanile, con ragazzi con e senza disabilità. La Juventus ha anche una squadra paralimpica, Juventus One. Modalità di accesso da verificare.",
   src:"juventus.com"},
  {id:"sciabile", comune:"Sauze d'Oulx", name:"SciAbile – Sci Club Sportinia", kind:"Scuola di sci adattato",
   addr:"Piazza Assietta 4, Sauze d'Oulx", lat:45.027, lon:6.859, approx:true, sports:["sci"], dis:ALL,
   desc:"Scuola di sci per persone con disabilità con ausili come mono-sci, bi-sci, tandem-ski e \"go to ski\" per sciare in piedi. Attività stagionale.",
   src:"Regione Piemonte; techprincess.it; motorbox.com"}
];

const CINTURA_OVEST = ["Collegno","Grugliasco","Rivoli","Rivalta di Torino","Alpignano","Pianezza","Venaria Reale","Druento","Orbassano","Beinasco","Rosta","Villarbasse","Bruino","Piossasco"];

const SPORTS = [
  {id:"nuoto",label:"Nuoto"},{id:"calcio",label:"Calcio"},{id:"basket",label:"Basket (anche in carrozzina)"},
  {id:"atletica",label:"Atletica"},{id:"ciclismo",label:"Ciclismo"},{id:"sci",label:"Sci"},
  {id:"hockey",label:"Hockey su ghiaccio"},{id:"judo",label:"Judo"},{id:"canoa",label:"Canoa"},
  {id:"acqua",label:"Apnea"},{id:"equitazione",label:"Equitazione"},{id:"multisport",label:"Più sport"}
];

const state = {dis:new Set(), sport:new Set(), zona:"", sel:null, view:"list"};
// ---- Segnalazioni condivise (Supabase). Le nuove segnalazioni restano "in attesa" finché non vengono approvate.
const SUPA_URL = "https://bdutfhmmigdkwwupnwoi.supabase.co";
const SUPA_KEY = "sb_publishable_Wc8k-L3JfOzOwh5XX2h3-A_wylqimp9";   // chiave pubblica: protetta dalle regole del database
const SHARED_ON = !!(SUPA_URL && SUPA_KEY);
function supaHeaders(extra){
  const h = {"apikey": SUPA_KEY, "Content-Type": "application/json"};
  if(!SUPA_KEY.startsWith("sb_publishable_")) h["Authorization"] = "Bearer " + SUPA_KEY;
  return Object.assign(h, extra||{});
}
let community = {};            // place_id -> {crit:{id:{si,no}}, stars:[], comments:[]}
let communityState = SHARED_ON ? "loading" : "off";
let sent = {};
try{ sent = JSON.parse(localStorage.getItem("ssb-sent")||"{}"); }catch(e){ sent = {}; }
function saveSent(){ try{ localStorage.setItem("ssb-sent", JSON.stringify(sent)); }catch(e){} }

async function loadCommunity(){
  if(!SHARED_ON) return;
  try{
    const r = await fetch(SUPA_URL + "/rest/v1/segnalazioni?select=place_id,criteri,commento,stelle,soprannome,created_at&order=created_at.desc&limit=2000", {headers: supaHeaders()});
    if(!r.ok) throw new Error(r.status);
    const rows = await r.json();
    community = {};
    rows.forEach(row=>{
      const c = community[row.place_id] || (community[row.place_id] = {crit:{}, stars:[], comments:[]});
      Object.entries(row.criteri||{}).forEach(([k,v])=>{
        if(v!=="si" && v!=="no") return;
        const x = c.crit[k] || (c.crit[k] = {si:0, no:0}); x[v]++;
      });
      if(row.stelle) c.stars.push(row.stelle);
      if(row.commento) c.comments.push({t:row.commento, n:row.soprannome||"", d:row.created_at});
    });
    communityState = "ok";
  }catch(e){ communityState = "error"; }
  render();
}

async function sendReport(payload){
  const r = await fetch(SUPA_URL + "/rest/v1/segnalazioni", {
    method:"POST", headers: supaHeaders({"Prefer":"return=minimal"}), body: JSON.stringify(payload)
  });
  if(!r.ok){
    let code = String(r.status);
    try{ const j = await r.json(); code = j.message || code; }catch(e){}
    throw new Error(code);
  }
}

const $ = s=>document.querySelector(s);
const esc = s=>String(s).replace(/[&<>"'`]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"}[c]));

function chip(container, items, set, withIco){
  container.innerHTML = "";
  items.forEach(it=>{
    const b = document.createElement("button");
    b.type="button"; b.className="chip"; b.setAttribute("aria-pressed","false");
    b.innerHTML = (withIco?`<span class="ico" aria-hidden="true">${it.ico}</span>`:"")+esc(it.label);
    b.onclick=()=>{ set.has(it.id)?set.delete(it.id):set.add(it.id); b.setAttribute("aria-pressed", set.has(it.id)); render(); };
    container.appendChild(b);
  });
}

function filtered(){
  return PLACES.filter(p=>{
    if(state.zona==="provincia" && p.comune==="Torino") return false;
    if(state.zona==="cintura-ovest" && !CINTURA_OVEST.includes(p.comune)) return false;
    if(state.zona && !["provincia","cintura-ovest"].includes(state.zona) && p.comune!==state.zona) return false;
    if(state.sport.size && !p.sports.some(s=>state.sport.has(s))) return false;
    if(state.dis.size){
      // impianti con accessibilità non rilevata restano visibili, segnalati come "da verificare"
      if(p.dis.length && ![...state.dis].every(d=>p.dis.includes(d))) return false;
    }
    return true;
  });
}

function status(p, cId){
  const x = community[p.id] && community[p.id].crit[cId];
  if(!x || (x.si===0 && x.no===0)) return {s:"nd", txt:"Da verificare"};
  const tot = x.si + x.no;
  const who = n => n===1 ? "1 persona" : n + " persone";
  if(x.si > x.no) return {s:"si", txt:`Sì · ${who(x.si)} su ${tot}`};
  if(x.no > x.si) return {s:"no", txt:`No · ${who(x.no)} su ${tot}`};
  return {s:"misto", txt:`Pareri diversi (${x.si} sì, ${x.no} no)`};
}
function starsAvg(p){
  const c = community[p.id]; if(!c || !c.stars.length) return null;
  return {avg: c.stars.reduce((a,b)=>a+b,0)/c.stars.length, n: c.stars.length};
}
function starText(v){ return "★".repeat(Math.round(v)) + "☆".repeat(5-Math.round(v)); }

function render(){
  const res = filtered();
  $("#count").textContent = res.length===1 ? "1 luogo trovato" : `${res.length} luoghi trovati`;
  const ul = $("#list"); ul.innerHTML="";
  if(!res.length){ ul.innerHTML = `<li class="empty">Nessun luogo con questi filtri. Prova a togliere uno sport o una disabilità.</li>`; }
  res.forEach(p=>{
    const li = document.createElement("li");
    const disTxt = p.dis.length ? (p.dis.length===4 ? "Tutte le disabilità" : p.dis.map(d=>DIS.find(x=>x.id===d).label).join(", ")) : "Disabilità accolte: da verificare";
    const sa = starsAvg(p), cm = community[p.id];
    const nRep = cm ? Math.max(cm.stars.length, cm.comments.length, ...Object.values(cm.crit).map(x=>x.si+x.no), 0) : 0;
    const rep = nRep
      ? `<span class="verif ok">${sa?`<span aria-hidden="true">${starText(sa.avg)}</span> ${sa.avg.toFixed(1).replace(".",",")} · `:""}${nRep===1?"1 segnalazione":nRep+" segnalazioni"} della community</span>`
      : `<span class="verif unk">Accessibilità da verificare</span>`;
    li.innerHTML = `<button class="card" type="button" ${state.sel===p.id?'aria-current="true"':""}>
      <h3>${esc(p.name)}</h3>
      <span class="meta">${esc(p.kind)} · ${esc(p.addr)}</span>
      <span class="tags">${p.sports.map(s=>`<span class="tag">${esc(SPORTS.find(x=>x.id===s).label)}</span>`).join("")}<span class="tag">${esc(disTxt)}</span></span>
      ${rep}</button>`;
    li.querySelector("button").onclick=()=>select(p.id, true);
    ul.appendChild(li);
  });
  drawMap(res);
  renderDetail();
}

// Mappa reale (Leaflet + OpenStreetMap). Se la mappa non carica (offline), resta l'elenco.
let map=null, layer=null, lastFit="";
function initMap(){
  if(map || typeof L==="undefined") return;
  map = L.map("map",{scrollWheelZoom:false}).setView([45.062,7.668],10);
  // OpenStreetMap richiede di sapere da quale sito arrivano le richieste: solo per le immagini della mappa
  // inviamo l'origine (https://sportaperto.com), mai la pagina precisa. Tutto il resto resta senza referrer.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19, referrerPolicy:"strict-origin",
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
  layer = L.layerGroup().addTo(map);
}
function drawMap(res){
  if(!map) return;
  layer.clearLayers();
  const pts=res.filter(p=>p.lat).map(p=>[p.lat,p.lon]);
  const key=pts.join("|");
  if(pts.length && key!==lastFit){ lastFit=key; map.fitBounds(pts,{padding:[30,30],maxZoom:14}); }
  res.filter(p=>p.lat).forEach(p=>{
    const sel = state.sel===p.id;
    const m = L.marker([p.lat,p.lon],{
      title:p.name, alt:p.name, keyboard:true,
      icon:L.divIcon({className:"", html:`<div class="pin ${sel?"sel":""}"></div>`, iconSize:sel?[32,32]:[26,26]})
    });
    m.on("click",()=>select(p.id,true));
    m.addTo(layer);
  });
}

function select(id, focus){
  state.sel=id; render();
  const pl=PLACES.find(x=>x.id===id); if(map && pl && pl.lat) map.panTo([pl.lat,pl.lon]);
  if(focus){ const t=$("#dTitle"); if(t){ t.focus({preventScroll:true}); if(window.innerWidth<900) t.scrollIntoView({behavior:"smooth",block:"start"}); } }
}

function renderDetail(){
  const box = $("#detail");
  const p = PLACES.find(x=>x.id===state.sel);
  if(!p){
    box.innerHTML = `<h2 id="dTitle" tabindex="-1">Scegli un luogo</h2>
    <p>Seleziona la tua disabilità e lo sport che ti interessa, poi apri un luogo per vedere:</p>
    <ul><li>se è accessibile, punto per punto;</li><li>come arrivarci con i mezzi;</li><li>chi contattare.</li></ul>
    <p class="note">Le voci di accessibilità mostrate dipendono dalla disabilità che scegli. Se non ne scegli nessuna, le vedi tutte.</p>`;
    return;
  }
  const want = state.dis.size ? [...state.dis] : ALL;
  const crits = CRIT.filter(c=>c.dis.some(d=>want.includes(d)));
  const dest = encodeURIComponent(p.addr.replace(/\(.*?\)/g,"").trim());
  const sa = starsAvg(p), cm = community[p.id];
  const comments = cm ? cm.comments.slice(0,5) : [];
  const fmt = d => { try{ return new Date(d).toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"}); }catch(e){ return ""; } };
  const pending = sent[p.id];
  box.innerHTML = `
    <h2 id="dTitle" tabindex="-1">${esc(p.name)}</h2>
    <p class="meta">${esc(p.kind)} · ${esc(p.addr)}${p.approx?" · posizione indicativa":""}</p>
    <p>${esc(p.desc)}</p>

    <h3>È accessibile?</h3>
    ${sa?`<p class="rating"><span aria-hidden="true">${starText(sa.avg)}</span> <strong>${sa.avg.toFixed(1).replace(".",",")} su 5</strong> · ${sa.n===1?"1 voto":sa.n+" voti"}</p>`:""}
    <ul class="crit">${crits.map(c=>{const st=status(p,c.id);return `<li><span>${esc(c.label)}</span><span class="st ${st.s}">${st.txt}</span></li>`}).join("")}</ul>
    ${communityState==="error"?`<p class="note">Non riesco a caricare le segnalazioni della community. Controlla la connessione e riprova più tardi.</p>`:""}

    ${comments.length?`<h3>Cosa dice chi ci è stato</h3>
    <ul class="comments">${comments.map(c=>`<li><p>${esc(c.t)}</p><p class="note">${c.n?esc(c.n)+" · ":""}${fmt(c.d)}</p></li>`).join("")}</ul>`:""}

    <h3>Come arrivarci</h3>
    <p>Percorso con i mezzi GTT, calcolato da Google Maps.</p>
    <div class="btns">
      <a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=transit" target="_blank" rel="noopener noreferrer">Percorso con i mezzi</a>
      ${p.contact?`<span class="btn ghost static">${esc(p.contact)}</span>`:""}
    </div>

    <h3>Ci sei stato? Racconta com'è</h3>
    ${!SHARED_ON ? `<p class="note">Le segnalazioni condivise stanno per arrivare: presto potrai raccontare com'è questo luogo a tutta la community.</p>` : `
    ${pending?`<p class="thanks" role="status">Hai già inviato una segnalazione per questo luogo. Grazie!</p>`:""}
    <form class="rep" id="repForm" novalidate>
      <p class="note">La tua segnalazione sarà visibile subito a tutti. Non scrivere dati personali tuoi o di altre persone: parole volgari, offensive o con riferimenti sessuali non sono permesse in nessuna lingua; i messaggi con link o numeri di telefono vengono controllati prima di essere pubblicati.</p>
      ${crits.map(c=>`<div class="row"><label for="r-${c.id}">${esc(c.label)}</label>
        <select id="r-${c.id}" name="${c.id}">
          <option value="nd" selected>Non so</option>
          <option value="si">Sì</option>
          <option value="no">No</option>
        </select></div>`).join("")}
      <fieldset class="stars"><legend>Come ti sei trovato? (facoltativo)</legend>
        ${[1,2,3,4,5].map(v=>`<input type="radio" name="stelle" id="st-${v}" value="${v}"><label for="st-${v}"><span aria-hidden="true">${"★".repeat(v)}</span><span class="sr">${v} ${v===1?"stella":"stelle"}</span></label>`).join("")}
      </fieldset>
      <label for="r-note">Commento (facoltativo, massimo 500 caratteri)</label>
      <textarea id="r-note" name="commento" maxlength="500" placeholder="Es. la rampa è sul retro, chiedere all'ingresso"></textarea>
      <label for="r-nick">Il tuo soprannome (facoltativo)</label>
      <input id="r-nick" name="soprannome" maxlength="40" autocomplete="nickname">
      <div class="hp" aria-hidden="true"><label for="r-web">Lascia vuoto</label><input id="r-web" name="sito" tabindex="-1" autocomplete="off"></div>
      <div class="consent"><input type="checkbox" name="ok" id="r-ok"><label for="r-ok">Ho letto l'<a href="info.html">informativa</a> e accetto che la segnalazione venga pubblicata</label></div>
      <p id="repMsg" role="alert" class="formmsg" hidden></p>
      <button class="btn" type="submit" id="repBtn">Invia segnalazione</button>
    </form>`}
    <p class="note">Fonte: ${esc(p.src)}</p>`;
  const form = $("#repForm");
  if(!form) return;
  form.addEventListener("submit", async e=>{
    e.preventDefault();
    const fd = new FormData(form), btn = $("#repBtn"), box = $("#repMsg");
    const msg = { set textContent(t){ box.textContent = t; box.hidden = !t; box.classList.toggle("info", t === "Invio in corso…"); } };
    if(fd.get("sito")) return;                                  // trappola anti-spam
    const criteri = {};
    crits.forEach(c=>{ const v = fd.get(c.id); if(v==="si" || v==="no") criteri[c.id] = v; });
    const commento = (fd.get("commento")||"").trim().slice(0,500);
    const stelle = parseInt(fd.get("stelle")||"0",10) || null;
    const soprannome = (fd.get("soprannome")||"").trim().slice(0,40);
    if(!Object.keys(criteri).length && !commento && !stelle){ msg.textContent = "Compila almeno una voce, un voto o un commento."; return; }
    if(!fd.get("ok")){ msg.textContent = "Per inviare, conferma di aver letto l'informativa."; $("#r-ok").focus(); return; }
    btn.disabled = true; msg.textContent = "Invio in corso…";
    try{
      await sendReport({place_id:p.id, criteri, commento: commento||null, stelle, soprannome: soprannome||null});
      sent[p.id] = Date.now(); saveSent();
      await loadCommunity();
      const t = $("#dTitle"); if(t){ t.insertAdjacentHTML("afterend",'<p class="thanks" role="status">Grazie! La tua segnalazione è pubblicata. Se contiene link o numeri di telefono, comparirà dopo un controllo.</p>'); }
    }catch(err){
      btn.disabled = false;
      const m = String(err && err.message || "");
      if(m.includes("PAROLE_NON_CONSENTITE")){
        msg.textContent = "Il testo contiene parole volgari, offensive o con riferimenti sessuali, che su Sport Aperto non sono permesse. Modifica il commento o il soprannome e riprova.";
        const f = $("#r-note"); if(f) f.focus();
      }else if(m.includes("TROPPE_SEGNALAZIONI")){
        msg.textContent = "Hai inviato molte segnalazioni in poco tempo, oppure ne arrivano troppe in questo momento. Riprova più tardi.";
      }else if(m.includes("DATI_NON_VALIDI")){
        msg.textContent = "Alcuni dati non sono validi. Ricarica la pagina e riprova.";
      }else{
        msg.textContent = "Invio non riuscito. Controlla la connessione e riprova tra qualche minuto.";
      }
    }
  });
}

// Tab elenco / mappa
function setView(v){
  state.view=v;
  $("#tabList").setAttribute("aria-selected", v==="list"); $("#tabMap").setAttribute("aria-selected", v==="map");
  $("#viewList").hidden = v!=="list"; $("#viewMap").hidden = v!=="map";
  if(v==="map"){ initMap(); if(map){ map.invalidateSize(); drawMap(filtered()); } }
}
$("#tabList").onclick=()=>setView("list"); $("#tabMap").onclick=()=>setView("map");

// Opzioni di lettura (ricordate sul dispositivo)
function toggle(btn, cls, key){
  const on = !document.documentElement.classList.contains(cls);
  document.documentElement.classList.toggle(cls,on); btn.setAttribute("aria-pressed",on);
  try{ localStorage.setItem(key, on?"1":"0"); }catch(e){}
}
[["#bigText","big","ssb-big"],["#hiCon","hc","ssb-hc"]].forEach(([s,c,k])=>{
  const b=$(s); b.onclick=()=>toggle(b,c,k);
  try{ if(localStorage.getItem(k)==="1"){ document.documentElement.classList.add(c); b.setAttribute("aria-pressed","true"); } }catch(e){}
});

(function(){
  const sel=$("#fZona");
  const comuni=[...new Set(PLACES.map(p=>p.comune))].filter(c=>c!=="Torino").sort((a,b)=>a.localeCompare(b,"it"));
  sel.innerHTML='<option value="">Torino e provincia</option><option value="Torino">Solo Torino città</option><option value="cintura-ovest">Cintura ovest di Torino</option><option value="provincia">Solo provincia</option>'+
    comuni.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
  sel.onchange=()=>{ state.zona=sel.value; render(); };
})();
chip($("#fDis"), DIS, state.dis, true);
chip($("#fSport"), SPORTS, state.sport, false);
state.sel = "cip";
render();
loadCommunity();
if("serviceWorker" in navigator && location.protocol==="https:"){
  navigator.serviceWorker.register("sw.js").catch(()=>{});
}
