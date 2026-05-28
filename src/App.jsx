import { useState, useEffect, useRef } from "react";

// ─── Palette Vert forêt & Ocre africain ─────────────────────────────────────
const C = {
  forest:  "#1A3A2A",   // Vert forêt profond
  green:   "#2E5E3E",   // Vert moyen
  sage:    "#4E8B62",   // Vert sauge
  mint:    "#7FBF8E",   // Vert menthe
  ocre:    "#C07830",   // Ocre africain
  amber:   "#E09040",   // Ambre chaud
  sand:    "#F0D8A8",   // Sable clair
  cream:   "#FBF5E6",   // Crème chaud
  bark:    "#7A4828",   // Ecorce
  text:    "#1A1A1A",
  muted:   "#6B7280",
  white:   "#FFFFFF",
  danger:  "#DC2626",
  info:    "#1D6FA6",
};

// ─── Police Google Fonts (Poppins) ───────────────────────────────────────────
const FONT = "'Poppins', 'Segoe UI', Arial, sans-serif";

function loadLS(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}


// ─── Espèces fruitières par défaut ───────────────────────────────────────────
const initialSpecies = [
  { id: 1, name: "Avocatier",   emoji: "🥑", color: "#2E5E3E", varieties: ["Hass","Fuerte","Polog","Both 7","Locale"] },
  { id: 2, name: "Goyavier",    emoji: "🍈", color: "#C07830", varieties: ["Goyave rouge","Goyave blanche","Goyave rose"] },
  { id: 3, name: "Safoutier",   emoji: "🫒", color: "#4E8B62", varieties: ["Safou local","Safou amélioré"] },
  { id: 4, name: "Manguier",    emoji: "🥭", color: "#E09040", varieties: ["Kent","Keitt","Amélie","Valencia"] },
  { id: 5, name: "Colatier",    emoji: "🌰", color: "#7A4828", varieties: ["Cola nitida","Cola acuminata"] },
  { id: 6, name: "Nonier",      emoji: "🍋", color: "#C0A020", varieties: ["Morinda citrifolia"] },
];

const SITES = ["Site A", "Site B", "Site C"];

// Helper : affiche "Site A — Plantation Mbankomo"
function siteLabel(code, sitesList) {
  if (!sitesList) return code;
  const s = sitesList.find(x => x.code === code);
  return s ? `${s.code} — ${s.name}` : code;
}
// Options pour les selects de site
function siteOptions(sitesList) {
  return sitesList.map(s => ({ value: s.code, label: `${s.code} — ${s.name}` }));
}

// ─── Sites ───────────────────────────────────────────────────────────────────
const initialSitesList = [
  { code: "Site A", name: "Plantation Mbankomo", latDec: 3.8480, lngDec: 11.5021, notes: "" },
  { code: "Site B", name: "Plantation Ngousso",  latDec: 3.8712, lngDec: 11.5234, notes: "" },
  { code: "Site C", name: "Plantation Olembe",   latDec: 3.9102, lngDec: 11.4987, notes: "" },
];

// ─── Données initiales ───────────────────────────────────────────────────────
const initialTrees = [
  { id: 1, site: "Site A", species: "Avocatier",  variety: "Hass",        count: 600, plantDate: "2018-03-01", status: "Production" },
  { id: 2, site: "Site A", species: "Avocatier",  variety: "Fuerte",      count: 400, plantDate: "2019-06-15", status: "Production" },
  { id: 3, site: "Site B", species: "Avocatier",  variety: "Polog",       count: 800, plantDate: "2020-01-10", status: "Croissance" },
  { id: 4, site: "Site B", species: "Avocatier",  variety: "Both 7",      count: 700, plantDate: "2017-09-20", status: "Production" },
  { id: 5, site: "Site C", species: "Manguier",   variety: "Kent",        count: 200, plantDate: "2019-04-05", status: "Production" },
  { id: 6, site: "Site C", species: "Safoutier",  variety: "Safou local", count: 150, plantDate: "2018-07-12", status: "Production" },
  { id: 7, site: "Site A", species: "Goyavier",   variety: "Goyave rouge",count: 100, plantDate: "2021-02-28", status: "Croissance" },
];

const initialHarvests = [
  { id: 1, date: "2024-03-10", site: "Site A", species: "Avocatier", variety: "Hass",   qty: 1200, unit: "kg", notes: "Bonne qualité" },
  { id: 2, date: "2024-03-18", site: "Site B", species: "Avocatier", variety: "Both 7", qty: 980,  unit: "kg", notes: "" },
  { id: 3, date: "2024-04-05", site: "Site C", species: "Manguier",  variety: "Kent",   qty: 450,  unit: "kg", notes: "Bonne saison" },
  { id: 4, date: "2024-04-15", site: "Site A", species: "Goyavier",  variety: "Goyave rouge", qty: 180, unit: "kg", notes: "" },
];

const initialSales = [
  { id: 1, date: "2024-03-12", buyer: "Marché Bafoussam",   qty: 500, price: 350, species: "Avocatier", variety: "Hass",   paid: true },
  { id: 2, date: "2024-03-20", buyer: "Exportateur Douala", qty: 900, price: 480, species: "Avocatier", variety: "Both 7", paid: true },
  { id: 3, date: "2024-04-08", buyer: "Marché Yaoundé",     qty: 300, price: 250, species: "Manguier",  variety: "Kent",   paid: false },
];

const initialTreatments = [
  { id: 1, date: "2024-02-15", site: "Site A", species: "Avocatier", type: "Engrais",    product: "NPK 20-10-10", qty: 50, unit: "kg", notes: "" },
  { id: 2, date: "2024-03-01", site: "Site B", species: "Tous",      type: "Irrigation", product: "—",            qty: 0,  unit: "",   notes: "Début saison sèche" },
  { id: 3, date: "2024-03-20", site: "Site C", species: "Manguier",  type: "Traitement", product: "Fongicide",    qty: 10, unit: "L",  notes: "" },
];

const initialNurseryBatches = [
  { id: 1, name: "Lot P-2024-01", startDate: "2024-01-10", site: "Site A", species: "Avocatier", variety: "Hass",   qtySeeds: 200, qtyAlive: 185, stage: "Prêt à greffer", notes: "" },
  { id: 2, name: "Lot P-2024-02", startDate: "2024-02-05", site: "Site B", species: "Manguier",  variety: "Kent",   qtySeeds: 100, qtyAlive: 88,  stage: "Germination",    notes: "" },
];

const initialGraftings = [
  { id: 1, date: "2024-03-15", batchId: 1, batchName: "Lot P-2024-01", technique: "Fente", rootstock: "Locale", scion: "Hass", qtyGrafted: 150, qtySuccess: 132, checkDate: "2024-04-15", status: "Succès contrôlé", destination: "Plantation Site A", notes: "" },
];

const initialPermanentStaff = [
  { id: 1, name: "Jean-Baptiste Mballa", role: "Chef de site",     site: "Site A", salary: 85000, startDate: "2018-03-01", status: "Actif", phone: "", notes: "" },
  { id: 2, name: "Paul Etoga",           role: "Greffeur",         site: "Site A", salary: 65000, startDate: "2019-01-10", status: "Actif", phone: "", notes: "" },
  { id: 3, name: "Suzanne Nkoa",         role: "Ouvrière agricole",site: "Site B", salary: 55000, startDate: "2020-06-15", status: "Actif", phone: "", notes: "" },
  { id: 4, name: "Marie Abega",          role: "Ouvrière agricole",site: "Site C", salary: 55000, startDate: "2021-04-01", status: "Actif", phone: "", notes: "" },
];

const initialTempWork = [
  { id: 1, date: "2024-03-10", site: "Site A", task: "Récolte",    nbWorkers: 12, nbDays: 2, dailyRate: 3000, total: 72000,  notes: "" },
  { id: 2, date: "2024-03-20", site: "Site B", task: "Désherbage", nbWorkers: 8,  nbDays: 3, dailyRate: 2500, total: 60000,  notes: "" },
];

const CHARGE_CATEGORIES = [
  "Intrants agricoles","Carburant & transport","Matériel & équipements",
  "Entretien & réparations","Irrigation & eau","Emballage & stockage",
  "Frais santé végétale","Location terrain","Impôts & taxes",
  "Certification & normes","Communication & divers","Amortissements",
];

const initialCharges = [
  { id: 1, date: "2024-01-15", category: "Intrants agricoles",    label: "NPK 20-10-10", site: "Site A", amount: 125000, paid: true,  notes: "" },
  { id: 2, date: "2024-02-10", category: "Carburant & transport", label: "Gasoil",        site: "Site B", amount: 45000,  paid: true,  notes: "" },
  { id: 3, date: "2024-03-05", category: "Emballage & stockage",  label: "Caisses bois",  site: "Site A", amount: 60000,  paid: false, notes: "" },
];

const initialSelectedTrees = [
  { id: 1, ref: "ARB-A-001", site: "Site A", species: "Avocatier", variety: "Hass", year: 2016, latDec: 3.84803, lngDec: 11.50215, reason: "Production exceptionnelle", notes: "120kg/an", status: "Actif" },
];

// ─── GPS Utilities ───────────────────────────────────────────────────────────
function decToDMS(deg, isLat) {
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const mFull = (abs - d) * 60;
  const m = Math.floor(mFull);
  const s = ((mFull - m) * 60).toFixed(1);
  const dir = isLat ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
  return `${d}°${m}'${s}"${dir}`;
}
function dmsToDec(dms) {
  try {
    const clean = dms.replace(/[°'"]/g, " ").trim();
    const parts = clean.split(/\s+/);
    const d = parseFloat(parts[0]);
    const m = parseFloat(parts[1]) || 0;
    const s = parseFloat(parts[2]) || 0;
    const dir = parts[3] || "";
    let dec = d + m / 60 + s / 3600;
    if (dir === "S" || dir === "W") dec = -dec;
    return isNaN(dec) ? null : +dec.toFixed(6);
  } catch { return null; }
}
function formatGPS(lat, lng) { return lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "—"; }
function formatDMS(lat, lng) { return lat && lng ? `${decToDMS(lat, true)} ${decToDMS(lng, false)}` : "—"; }

// ─── Export Utilities ────────────────────────────────────────────────────────
function exportCSV(filename, headers, rows) {
  const lines = [headers.join(";"), ...rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";"))];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename + ".csv"; a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(title, headers, rows, extraInfo = []) {
  const w = window.open("", "_blank");
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
    body{font-family:'Poppins',Arial,sans-serif;font-size:11px;color:#1a1a1a;margin:24px;}
    h1{color:#1A3A2A;font-size:18px;margin-bottom:2px;}
    .sub{color:#6B7280;font-size:10px;margin-bottom:12px;}
    .info{background:#F0F7F2;padding:8px 14px;border-radius:6px;margin-bottom:14px;font-size:10px;border-left:4px solid #4E8B62;}
    table{width:100%;border-collapse:collapse;}
    th{background:#1A3A2A;color:#fff;padding:8px 10px;text-align:left;font-size:10px;font-weight:600;}
    td{padding:6px 10px;border-bottom:1px solid #F0D8A8;font-size:10px;}
    tr:nth-child(even) td{background:#FBF5E6;}
    .footer{margin-top:20px;font-size:9px;color:#9CA3AF;border-top:1px solid #eee;padding-top:8px;}
    @media print{button{display:none;}}
  `;
  const infoHTML = extraInfo.map(i => `<span><strong>${i.label}:</strong> ${i.val}</span>`).join(" &nbsp;·&nbsp; ");
  const headerHTML = headers.map(h => `<th>${h}</th>`).join("");
  const rowsHTML = rows.map(r => `<tr>${r.map(c => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>${styles}</style></head>
  <body>
  <button onclick="window.print()" style="background:#1A3A2A;color:#fff;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;margin-bottom:14px;font-size:12px;font-family:Poppins,sans-serif;">🖨️ Imprimer / PDF</button>
  <h1>🌿 Vegesoft — ${title}</h1>
  <div class="sub">Exporté le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</div>
  ${infoHTML ? `<div class="info">${infoHTML}</div>` : ""}
  <table><thead><tr>${headerHTML}</tr></thead><tbody>${rowsHTML}</tbody></table>
  <div class="footer">Vegesoft — Gestion de vergers tropicaux</div>
  </body></html>`);
  w.document.close();
}

// ─── Base Components ─────────────────────────────────────────────────────────
const inputStyle = {
  border: `1.5px solid ${C.sand}`, borderRadius: 8, padding: "10px 12px",
  fontSize: 13, color: C.text, background: C.white, outline: "none", fontFamily: FONT,
  width: "100%", boxSizing: "border-box", height: 42,
};

const Badge = ({ color, children }) => {
  const map = { green: ["#D1FAE5","#065F46"], amber: ["#FEF3C7","#92400E"], red: ["#FEE2E2","#991B1B"], blue: ["#DBEAFE","#1E40AF"] };
  const [bg, fg] = map[color] || ["#F3F4F6", "#374151"];
  return <span style={{ background: bg, color: fg, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: FONT }}>{children}</span>;
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.white, borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", ...style }}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color }) => (
  <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <div style={{ width: 50, height: 50, borderRadius: 12, background: color || C.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.forest, lineHeight: 1.1, fontFamily: FONT }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: FONT }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT }}>{sub}</div>}
    </div>
  </Card>
);

const Input = ({ label, value, onChange, type = "text", options, optObjects }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: FONT }}>{label}</label>
    {(options || optObjects) ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        <option value="">-- Choisir --</option>
        {optObjects
          ? optObjects.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
          : options.map(o => <option key={o} value={o}>{o}</option>)
        }
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
    )}
  </div>
);

// Champ variété avec ajout inline
const VarietyInput = ({ label, value, onChange, species, speciesName, onAddVariety }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newV, setNewV] = useState("");
  const sp = species ? species.find(s => s.name === speciesName) : null;
  const varieties = sp ? sp.varieties : [];

  const handleAdd = () => {
    if (!newV.trim()) return;
    if (onAddVariety) onAddVariety(speciesName, newV.trim());
    onChange(newV.trim());
    setNewV(""); setShowAdd(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: FONT }}>{label}</label>
      <div style={{ display: "flex", gap: 6 }}>
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
          <option value="">-- Choisir --</option>
          {varieties.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <button onClick={() => setShowAdd(!showAdd)} title="Ajouter une variété" style={{ background: C.ocre, color: C.white, border: "none", borderRadius: 8, padding: "0 12px", cursor: "pointer", fontSize: 16, fontFamily: FONT }}>+</button>
      </div>
      {showAdd && (
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <input value={newV} onChange={e => setNewV(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} placeholder="Nom de la nouvelle variété..." style={{ ...inputStyle, flex: 1, fontSize: 12 }} />
          <button onClick={handleAdd} style={{ background: C.green, color: C.white, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: FONT }}>✓ Ajouter</button>
          <button onClick={() => setShowAdd(false)} style={{ background: C.sand, color: C.forest, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontFamily: FONT }}>✕</button>
        </div>
      )}
    </div>
  );
};

const Btn = ({ children, onClick, variant = "primary", small }) => {
  const styles = {
    primary:   { bg: C.green,  fg: C.white },
    secondary: { bg: C.sand,   fg: C.forest },
    danger:    { bg: C.danger, fg: C.white },
    ocre:      { bg: C.ocre,   fg: C.white },
  };
  const { bg, fg } = styles[variant] || styles.primary;
  return (
    <button onClick={onClick} style={{
      background: bg, color: fg, border: "none", borderRadius: 8,
      padding: small ? "5px 12px" : "9px 20px",
      fontSize: small ? 11 : 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
    }}>{children}</button>
  );
};

const ExportBar = ({ title, headers, rows, extraInfo = [], filename }) => (
  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginBottom: 10 }}>
    <button onClick={() => exportPDF(title, headers, rows, extraInfo)} style={{ background: C.danger, color: C.white, border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>📄 PDF</button>
    <button onClick={() => exportCSV(filename || title, headers, rows)} style={{ background: C.forest, color: C.white, border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>📊 Excel/CSV</button>
  </div>
);

const sectionTitle = { margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.forest, paddingBottom: 10, borderBottom: `2px solid ${C.sand}`, fontFamily: FONT };
const td = { padding: "9px 11px", verticalAlign: "middle", fontFamily: FONT, fontSize: 13 };

// ─── MODULE : Gestion Espèces & Variétés ────────────────────────────────────
function SpeciesModule({ species, setSpecies }) {
  const [form, setForm] = useState({ name: "", emoji: "🌳", color: C.green, varieties: "" });
  const [editing, setEditing] = useState(null);
  const [newVariety, setNewVariety] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const save = () => {
    if (!form.name) return;
    const entry = {
      ...form,
      id: editing || Date.now(),
      varieties: typeof form.varieties === "string"
        ? form.varieties.split(",").map(v => v.trim()).filter(Boolean)
        : form.varieties,
    };
    setSpecies(editing ? species.map(s => s.id === editing ? entry : s) : [...species, entry]);
    setEditing(null);
    setForm({ name: "", emoji: "🌳", color: C.green, varieties: "" });
  };

  const edit = (s) => {
    setForm({ ...s, varieties: s.varieties.join(", ") });
    setEditing(s.id);
  };

  const del = (id) => setSpecies(species.filter(s => s.id !== id));

  const addVariety = (sp) => {
    if (!newVariety.trim()) return;
    setSpecies(species.map(s => s.id === sp.id ? { ...s, varieties: [...s.varieties, newVariety.trim()] } : s));
    setNewVariety("");
  };

  const delVariety = (spId, v) => {
    setSpecies(species.map(s => s.id === spId ? { ...s, varieties: s.varieties.filter(x => x !== v) } : s));
  };

  const EMOJIS = ["🌳","🥑","🍈","🫒","🥭","🌰","🍋","🍊","🍌","🍍","🌴","🌿"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <h3 style={sectionTitle}>{editing ? "✏️ Modifier l'espèce" : "➕ Ajouter une espèce fruitière"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          <Input label="Nom de l'espèce" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: FONT }}>Emoji</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setForm({ ...form, emoji: e })} style={{
                  fontSize: 20, background: form.emoji === e ? C.sand : "transparent",
                  border: form.emoji === e ? `2px solid ${C.ocre}` : "2px solid transparent",
                  borderRadius: 8, padding: "2px 6px", cursor: "pointer",
                }}>{e}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: FONT }}>Couleur</label>
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
              style={{ width: 60, height: 38, border: "none", cursor: "pointer", borderRadius: 8 }} />
          </div>
          <Input label="Variétés initiales (séparées par virgules)" value={typeof form.varieties === "string" ? form.varieties : form.varieties.join(", ")} onChange={v => setForm({ ...form, varieties: v })} />
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <Btn onClick={save}>{editing ? "Enregistrer" : "Ajouter l'espèce"}</Btn>
          {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm({ name: "", emoji: "🌳", color: C.green, varieties: "" }); }}>Annuler</Btn>}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        {species.map(sp => (
          <Card key={sp.id} style={{ borderTop: `4px solid ${sp.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>{sp.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, fontFamily: FONT, color: C.forest }}>{sp.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT }}>{sp.varieties.length} variété(s)</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn small variant="secondary" onClick={() => edit(sp)}>✏️</Btn>
                <Btn small variant="danger" onClick={() => del(sp.id)}>🗑️</Btn>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {sp.varieties.map(v => (
                <span key={v} style={{ background: C.cream, border: `1px solid ${C.sand}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
                  {v}
                  <span onClick={() => delVariety(sp.id, v)} style={{ cursor: "pointer", color: C.danger, fontWeight: 700, fontSize: 12 }}>×</span>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={selectedId === sp.id ? newVariety : ""} onFocus={() => setSelectedId(sp.id)}
                onChange={e => setNewVariety(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addVariety(sp)}
                placeholder="Ajouter une variété..."
                style={{ ...inputStyle, flex: 1, fontSize: 12, padding: "6px 10px" }} />
              <Btn small variant="ocre" onClick={() => addVariety(sp)}>+ Ajouter</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── MODULE : Tableau de bord ────────────────────────────────────────────────
function Dashboard({ trees, harvests, sales, treatments, species }) {
  const totalTrees   = trees.reduce((s, t) => s + t.count, 0);
  const totalHarvest = harvests.reduce((s, h) => s + h.qty, 0);
  const totalRevenue = sales.reduce((s, v) => s + v.qty * v.price, 0);
  const unpaid       = sales.filter(s => !s.paid).reduce((s, v) => s + v.qty * v.price, 0);

  const bySite = SITES.map(s => ({
    name: s, count: trees.filter(t => t.site === s).reduce((a, t) => a + t.count, 0),
  }));

  const bySpecies = species.map(sp => ({
    sp,
    count:   trees.filter(t => t.species === sp.name).reduce((s, t) => s + t.count, 0),
    harvest: harvests.filter(h => h.species === sp.name).reduce((s, h) => s + h.qty, 0),
    revenue: sales.filter(v => v.species === sp.name).reduce((s, v) => s + v.qty * v.price, 0),
  })).filter(x => x.count > 0);

  const lastTreatments = [...treatments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPIs globaux */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 }}>
        <StatCard icon="🌳" label="Arbres fruitiers" value={totalTrees.toLocaleString()} sub={`${species.length} espèces`} color="#D1FAE5" />
        <StatCard icon="🧺" label="Récoltes totales" value={`${totalHarvest.toLocaleString()} kg`} sub={`${harvests.length} sessions`} color="#FEF9C3" />
        <StatCard icon="💰" label="Revenus totaux" value={`${(totalRevenue/1000).toFixed(0)}K FCFA`} color="#DBEAFE" />
        <StatCard icon="⚠️" label="Impayés" value={`${(unpaid/1000).toFixed(0)}K FCFA`} color="#FEE2E2" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        {/* Répartition par espèce */}
        <Card>
          <h3 style={sectionTitle}>🌿 Répartition par espèce</h3>
          {bySpecies.map(({ sp, count, harvest, revenue }) => {
            const pct = totalTrees > 0 ? Math.round((count / totalTrees) * 100) : 0;
            return (
              <div key={sp.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600 }}>{sp.emoji} {sp.name}</span>
                  <span style={{ fontFamily: FONT, fontSize: 12, color: C.muted }}>{count.toLocaleString()} arbres · {pct}%</span>
                </div>
                <div style={{ height: 8, background: C.sand, borderRadius: 4 }}>
                  <div style={{ height: 8, width: `${pct}%`, background: sp.color, borderRadius: 4 }} />
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 11, color: C.muted, fontFamily: FONT }}>
                  <span>🧺 {harvest.toLocaleString()} kg</span>
                  <span>💰 {(revenue/1000).toFixed(0)}K FCFA</span>
                </div>
              </div>
            );
          })}
        </Card>

        {/* Arbres par site */}
        <Card>
          <h3 style={sectionTitle}>📍 Arbres par site</h3>
          {bySite.map(s => (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4, fontFamily: FONT }}>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span style={{ color: C.green, fontWeight: 700 }}>{s.count.toLocaleString()} arbres</span>
              </div>
              <div style={{ height: 7, background: C.sand, borderRadius: 4 }}>
                <div style={{ height: 7, width: `${totalTrees > 0 ? (s.count/totalTrees)*100 : 0}%`, background: C.sage, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Dernières interventions */}
        <Card>
          <h3 style={sectionTitle}>📋 Dernières interventions</h3>
          {lastTreatments.map(t => (
            <div key={t.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.sand}` }}>
              <div style={{ fontSize: 20 }}>
                {t.type === "Engrais" ? "🌿" : t.type === "Taille" ? "✂️" : t.type === "Irrigation" ? "💧" : "🧪"}
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600 }}>{t.type} — {t.site}</div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted }}>{t.date} · {t.species}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Tuiles par espèce */}
      <div>
        <h3 style={{ ...sectionTitle, borderBottom: "none", marginBottom: 12 }}>🍃 Détail par espèce fruitière</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {bySpecies.map(({ sp, count, harvest, revenue }) => (
            <div key={sp.id} style={{ background: C.white, borderRadius: 14, padding: 16, borderLeft: `5px solid ${sp.color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{sp.emoji}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.forest, marginBottom: 8 }}>{sp.name}</div>
              <div style={{ fontFamily: FONT, fontSize: 12, lineHeight: 2 }}>
                <div>🌳 <strong>{count.toLocaleString()}</strong> arbres</div>
                <div>🧺 <strong>{harvest.toLocaleString()} kg</strong> récoltés</div>
                <div>💰 <strong>{(revenue/1000).toFixed(0)}K FCFA</strong> de ventes</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MODULE : Parcelles ──────────────────────────────────────────────────────
const TREE_STATUSES = ["Démarrage","Croissance","Production","Vieillissant","Remplacement"];

function TreesModule({ trees, setTrees, species, sitesList, onAddVariety }) {
  const emptyForm = { site: "", species: "", variety: "", count: "", plantDate: "", status: "Démarrage", notes: "" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [filterSpecies, setFilterSpecies] = useState("");
  const [filterSite, setFilterSite] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list | grouped

  const save = () => {
    if (!form.site || !form.species || !form.count) return;
    const entry = { ...form, id: editing || Date.now(), count: +form.count };
    setTrees(editing ? trees.map(t => t.id === editing ? entry : t) : [...trees, entry]);
    setEditing(null); setForm(emptyForm);
  };

  const filtered = trees
    .filter(t => !filterSpecies || t.species === filterSpecies)
    .filter(t => !filterSite || t.site === filterSite);

  // Regroupement par site pour vue groupée
  const groupedBySite = sitesList.map(s => ({
    site: s,
    trees: filtered.filter(t => t.site === s.code),
    totalCount: filtered.filter(t => t.site === s.code).reduce((sum, t) => sum + t.count, 0),
  })).filter(g => g.trees.length > 0);

  const exportRows = filtered.map(t => [
    siteLabel(t.site, sitesList), t.species, t.variety, t.count, t.plantDate || "", t.status, t.notes || "—"
  ]);

  const statusColor = s => s === "Production" ? "green" : s === "Démarrage" || s === "Remplacement" ? "blue" : "amber";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ExportBar title="Parcelles" headers={["Site","Espèce","Variété","Nb arbres","Date plantation","Statut","Notes"]} rows={exportRows} filename="parcelles"
        extraInfo={[{label:"Total arbres",val:filtered.reduce((s,t)=>s+t.count,0).toLocaleString()}]} />

      <Card>
        <h3 style={sectionTitle}>{editing ? "✏️ Modifier la parcelle" : "➕ Ajouter une ligne de parcelle"}</h3>
        <div style={{ marginBottom: 10, padding: "8px 12px", background: "#EFF6FF", borderRadius: 8, fontSize: 12, fontFamily: FONT, color: "#1E40AF" }}>
          💡 Sur un même site, ajoutez une ligne par espèce et par variété.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          <Input label="Site" value={form.site} onChange={v => setForm({ ...form, site: v })}
            optObjects={siteOptions(sitesList)} />
          <Input label="Espèce" value={form.species} onChange={v => setForm({ ...form, species: v, variety: "" })}
            options={species.map(s => s.name)} />
          <VarietyInput label="Variété" value={form.variety} onChange={v => setForm({ ...form, variety: v })}
            species={species} speciesName={form.species} onAddVariety={onAddVariety} />
          <Input label="Nombre d'arbres" type="number" value={form.count} onChange={v => setForm({ ...form, count: v })} />
          <Input label="Date de plantation" type="date" value={form.plantDate} onChange={v => setForm({ ...form, plantDate: v })} />
          <Input label="Statut" value={form.status} onChange={v => setForm({ ...form, status: v })} options={TREE_STATUSES} />
          <Input label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <Btn onClick={save}>{editing ? "Enregistrer" : "Ajouter"}</Btn>
          {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm(emptyForm); }}>Annuler</Btn>}
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
          <h3 style={{ ...sectionTitle, flex: 1, marginBottom: 0, borderBottom: "none" }}>
            🌳 Parcelles — {filtered.reduce((s,t)=>s+t.count,0).toLocaleString()} arbres
          </h3>
          <div style={{ display: "flex", gap: 6 }}>
            {[{id:"list",label:"📋 Liste"},{id:"grouped",label:"📍 Par site"}].map(v=>(
              <button key={v.id} onClick={()=>setViewMode(v.id)} style={{ background:viewMode===v.id?C.green:C.sand, color:viewMode===v.id?C.white:C.forest, border:"none", borderRadius:7, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>{v.label}</button>
            ))}
          </div>
          <select value={filterSpecies} onChange={e => setFilterSpecies(e.target.value)} style={{ ...inputStyle, width: 150 }}>
            <option value="">Toutes espèces</option>
            {species.map(s => <option key={s.id} value={s.name}>{s.emoji} {s.name}</option>)}
          </select>
          <select value={filterSite} onChange={e => setFilterSite(e.target.value)} style={{ ...inputStyle, width: 160 }}>
            <option value="">Tous sites</option>
            {sitesList.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
          </select>
        </div>

        {viewMode === "list" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.sand }}>
                  {["Site","Espèce","Variété","Arbres","Date plantation","Statut","Notes",""].map(h => (
                    <th key={h} style={{ padding: "10px 11px", textAlign: "left", fontWeight: 700, color: C.forest, fontFamily: FONT, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const sp = species.find(s => s.name === t.species);
                  return (
                    <tr key={t.id} style={{ background: i%2===0 ? C.white : C.cream }}>
                      <td style={td}>{siteLabel(t.site, sitesList)}</td>
                      <td style={td}>{sp ? `${sp.emoji} ${t.species}` : t.species}</td>
                      <td style={td}><Badge color="green">{t.variety}</Badge></td>
                      <td style={{ ...td, fontWeight: 700 }}>{t.count.toLocaleString()}</td>
                      <td style={td}>{t.plantDate || "—"}</td>
                      <td style={td}><Badge color={statusColor(t.status)}>{t.status}</Badge></td>
                      <td style={{ ...td, color: C.muted, fontSize: 11 }}>{t.notes || "—"}</td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <Btn small variant="secondary" onClick={() => { setForm({ ...t, count: String(t.count) }); setEditing(t.id); }}>✏️</Btn>
                          <Btn small variant="danger" onClick={() => setTrees(trees.filter(x => x.id !== t.id))}>🗑️</Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === "grouped" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {groupedBySite.map(({ site, trees: siteTrees, totalCount }) => {
              const speciesSummary = [...new Set(siteTrees.map(t => t.species))];
              return (
                <div key={site.code} style={{ border: `2px solid ${C.sand}`, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ background: C.forest, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ color: C.white, fontWeight: 700, fontSize: 14, fontFamily: FONT }}>{site.code} — {site.name}</span>
                      <span style={{ color: C.mint, fontSize: 12, marginLeft: 12, fontFamily: FONT }}>{speciesSummary.length} espèce(s)</span>
                    </div>
                    <span style={{ color: C.sand, fontWeight: 700, fontFamily: FONT }}>{totalCount.toLocaleString()} arbres</span>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: C.sand }}>
                        {["Espèce","Variété","Arbres","Date plantation","Statut",""].map(h => (
                          <th key={h} style={{ padding: "8px 11px", textAlign: "left", fontWeight: 700, color: C.forest, fontFamily: FONT, fontSize: 11 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {siteTrees.map((t, i) => {
                        const sp = species.find(s => s.name === t.species);
                        return (
                          <tr key={t.id} style={{ background: i%2===0 ? C.white : C.cream }}>
                            <td style={td}>{sp ? `${sp.emoji} ${t.species}` : t.species}</td>
                            <td style={td}><Badge color="green">{t.variety}</Badge></td>
                            <td style={{ ...td, fontWeight: 700 }}>{t.count.toLocaleString()}</td>
                            <td style={td}>{t.plantDate || "—"}</td>
                            <td style={td}><Badge color={statusColor(t.status)}>{t.status}</Badge></td>
                            <td style={td}>
                              <div style={{ display: "flex", gap: 5 }}>
                                <Btn small variant="secondary" onClick={() => { setForm({ ...t, count: String(t.count) }); setEditing(t.id); setViewMode("list"); }}>✏️</Btn>
                                <Btn small variant="danger" onClick={() => setTrees(trees.filter(x => x.id !== t.id))}>🗑️</Btn>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── MODULE : Récoltes ───────────────────────────────────────────────────────
function HarvestModule({ harvests, setHarvests, species, sitesList, onAddVariety }) {
  const [form, setForm] = useState({ date: "", site: "", species: "", variety: "", qty: "", unit: "kg", notes: "" });

  const currentSpecies = species.find(s => s.name === form.species);
  const varietyOptions = currentSpecies ? currentSpecies.varieties : [];

  const save = () => {
    if (!form.date || !form.site || !form.qty) return;
    setHarvests([...harvests, { ...form, id: Date.now(), qty: +form.qty }]);
    setForm({ date: "", site: "", species: "", variety: "", qty: "", unit: "kg", notes: "" });
  };

  const exportRows = [...harvests].sort((a,b)=>b.date.localeCompare(a.date))
    .map(h => [h.date, h.site, h.species, h.variety, h.qty, h.unit, h.notes||"—"]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ExportBar title="Récoltes" headers={["Date","Site","Espèce","Variété","Quantité","Unité","Notes"]} rows={exportRows} filename="recoltes" />
      <Card>
        <h3 style={sectionTitle}>➕ Enregistrer une récolte</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          <Input label="Date" type="date" value={form.date} onChange={v => setForm({...form, date:v})} />
          <Input label="Site" value={form.site} onChange={v => setForm({...form, site:v})} optObjects={siteOptions(sitesList)} />
          <Input label="Espèce" value={form.species} onChange={v => setForm({...form, species:v, variety:""})} options={species.map(s=>s.name)} />
          <VarietyInput label="Variété" value={form.variety} onChange={v => setForm({...form, variety:v})} species={species} speciesName={form.species} onAddVariety={onAddVariety} />
          <Input label="Quantité (kg)" type="number" value={form.qty} onChange={v => setForm({...form, qty:v})} />
          <Input label="Notes" value={form.notes} onChange={v => setForm({...form, notes:v})} />
        </div>
        <div style={{ marginTop: 14 }}><Btn onClick={save}>Enregistrer</Btn></div>
      </Card>
      <Card>
        <h3 style={sectionTitle}>🧺 Historique — Total : {harvests.reduce((s,h)=>s+h.qty,0).toLocaleString()} kg</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.sand }}>
                {["Date","Site","Espèce","Variété","Quantité","Notes",""].map(h => (
                  <th key={h} style={{ padding:"10px 11px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...harvests].sort((a,b)=>b.date.localeCompare(a.date)).map((h,i) => {
                const sp = species.find(s=>s.name===h.species);
                return (
                  <tr key={h.id} style={{ background: i%2===0?C.white:C.cream }}>
                    <td style={td}>{h.date}</td>
                    <td style={td}>{siteLabel(h.site, sitesList)}</td>
                    <td style={td}>{sp?`${sp.emoji} ${h.species}`:h.species}</td>
                    <td style={td}><Badge color="green">{h.variety}</Badge></td>
                    <td style={{ ...td, fontWeight:700 }}>{h.qty.toLocaleString()} kg</td>
                    <td style={{ ...td, color:C.muted }}>{h.notes||"—"}</td>
                    <td style={td}><Btn small variant="danger" onClick={()=>setHarvests(harvests.filter(x=>x.id!==h.id))}>🗑️</Btn></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE : Ventes ─────────────────────────────────────────────────────────
function SalesModule({ sales, setSales, species, sitesList, onAddVariety }) {
  const [form, setForm] = useState({ date:"", buyer:"", species:"", variety:"", qty:"", price:"", paid:false, notes:"" });

  const currentSpecies = species.find(s => s.name === form.species);
  const varietyOptions = currentSpecies ? currentSpecies.varieties : [];

  const save = () => {
    if (!form.date||!form.buyer||!form.qty||!form.price) return;
    setSales([...sales, { ...form, id:Date.now(), qty:+form.qty, price:+form.price }]);
    setForm({ date:"", buyer:"", species:"", variety:"", qty:"", price:"", paid:false, notes:"" });
  };

  const totalRevenue = sales.reduce((s,v)=>s+v.qty*v.price,0);
  const totalPaid    = sales.filter(s=>s.paid).reduce((s,v)=>s+v.qty*v.price,0);

  const exportRows = [...sales].sort((a,b)=>b.date.localeCompare(a.date))
    .map(v=>[v.date,v.buyer,v.species,v.variety,v.qty,v.price,(v.qty*v.price).toLocaleString(),v.paid?"Payé":"En attente"]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <ExportBar title="Ventes" headers={["Date","Acheteur","Espèce","Variété","Qté","Prix/kg","Total","Statut"]} rows={exportRows} filename="ventes" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
        <StatCard icon="💰" label="Total revenus" value={`${(totalRevenue/1000).toFixed(0)}K FCFA`} color="#DBEAFE" />
        <StatCard icon="✅" label="Encaissé" value={`${(totalPaid/1000).toFixed(0)}K FCFA`} color="#D1FAE5" />
        <StatCard icon="⏳" label="En attente" value={`${((totalRevenue-totalPaid)/1000).toFixed(0)}K FCFA`} color="#FEF3C7" />
      </div>
      <Card>
        <h3 style={sectionTitle}>➕ Enregistrer une vente</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
          <Input label="Date" type="date" value={form.date} onChange={v=>setForm({...form,date:v})} />
          <Input label="Acheteur" value={form.buyer} onChange={v=>setForm({...form,buyer:v})} />
          <Input label="Espèce" value={form.species} onChange={v=>setForm({...form,species:v,variety:""})} options={species.map(s=>s.name)} />
          <VarietyInput label="Variété" value={form.variety} onChange={v=>setForm({...form,variety:v})} species={species} speciesName={form.species} onAddVariety={onAddVariety} />
          <Input label="Quantité (kg)" type="number" value={form.qty} onChange={v=>setForm({...form,qty:v})} />
          <Input label="Prix / kg (FCFA)" type="number" value={form.price} onChange={v=>setForm({...form,price:v})} />
        </div>
        {form.qty && form.price && (
          <div style={{ marginTop:10, padding:"8px 14px", background:"#EFF6FF", borderRadius:8, fontFamily:FONT, fontSize:13, fontWeight:600, color:"#1E40AF" }}>
            💡 Total : {(+form.qty * +form.price).toLocaleString()} FCFA
          </div>
        )}
        <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:10 }}>
          <label style={{ fontSize:13, display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontFamily:FONT }}>
            <input type="checkbox" checked={form.paid} onChange={e=>setForm({...form,paid:e.target.checked})} />
            Déjà payé
          </label>
        </div>
        <div style={{ marginTop:12 }}><Btn onClick={save}>Enregistrer</Btn></div>
      </Card>
      <Card>
        <h3 style={sectionTitle}>📦 Historique des ventes</h3>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:C.sand }}>
                {["Date","Acheteur","Espèce","Variété","Qté","Prix/kg","Total","Statut",""].map(h=>(
                  <th key={h} style={{ padding:"10px 11px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...sales].sort((a,b)=>b.date.localeCompare(a.date)).map((v,i)=>{
                const sp = species.find(s=>s.name===v.species);
                return (
                  <tr key={v.id} style={{ background:i%2===0?C.white:C.cream }}>
                    <td style={td}>{v.date}</td>
                    <td style={{ ...td, fontWeight:600 }}>{v.buyer}</td>
                    <td style={td}>{sp?`${sp.emoji} ${v.species}`:v.species}</td>
                    <td style={td}><Badge color="green">{v.variety}</Badge></td>
                    <td style={td}>{v.qty} kg</td>
                    <td style={td}>{v.price} F</td>
                    <td style={{ ...td, fontWeight:700 }}>{(v.qty*v.price).toLocaleString()} F</td>
                    <td style={td}>
                      <span onClick={()=>setSales(sales.map(s=>s.id===v.id?{...s,paid:!s.paid}:s))} style={{ cursor:"pointer" }}>
                        <Badge color={v.paid?"green":"amber"}>{v.paid?"✅ Payé":"⏳ Attente"}</Badge>
                      </span>
                    </td>
                    <td style={td}><Btn small variant="danger" onClick={()=>setSales(sales.filter(s=>s.id!==v.id))}>🗑️</Btn></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE : Interventions (enrichi) ────────────────────────────────────────
function TreatmentsModule({ treatments, setTreatments, species, sitesList, staff }) {
  const emptyForm = { dateStart:"", dateEnd:"", site:"", species:"Tous", type:"", product:"", qty:"", unit:"kg", responsible:"", notes:"" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [filterType, setFilterType] = useState("");

  const activeStaff = staff.filter(s => s.status === "Actif");

  const duration = (start, end) => {
    if (!start || !end) return null;
    const d = Math.round((new Date(end) - new Date(start)) / (24*60*60*1000));
    return d >= 0 ? d : null;
  };

  const save = () => {
    if (!form.dateStart || !form.site || !form.type) return;
    const entry = { ...form, id: editing || Date.now(), qty: +form.qty };
    setTreatments(editing ? treatments.map(t => t.id === editing ? entry : t) : [...treatments, entry]);
    setEditing(null); setForm(emptyForm);
  };

  const filtered = treatments.filter(t => !filterType || t.type === filterType);
  const typeIcon = { Engrais:"🌿", Taille:"✂️", Irrigation:"💧", Traitement:"🧪", Récolte:"🧺", Transport:"🚛", Formation:"📚", Autre:"📝" };

  const exportRows = filtered.map(t => [
    t.dateStart, t.dateEnd||"—", siteLabel(t.site,sitesList), t.species, t.type,
    t.product||"—", t.qty?`${t.qty} ${t.unit}`:"—", t.responsible||"—",
    duration(t.dateStart,t.dateEnd)!==null?`${duration(t.dateStart,t.dateEnd)} j`:"—", t.notes||"—"
  ]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <ExportBar title="Interventions" headers={["Début","Fin","Site","Espèce","Type","Produit","Quantité","Responsable","Durée","Notes"]} rows={exportRows} filename="interventions" />
      <Card>
        <h3 style={sectionTitle}>{editing ? "✏️ Modifier" : "➕ Enregistrer une intervention"}</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
          <Input label="Date de début" type="date" value={form.dateStart} onChange={v=>setForm({...form,dateStart:v})} />
          <Input label="Date de fin" type="date" value={form.dateEnd} onChange={v=>setForm({...form,dateEnd:v})} />
          <Input label="Site" value={form.site} onChange={v=>setForm({...form,site:v})} optObjects={siteOptions(sitesList)} />
          <Input label="Espèce concernée" value={form.species} onChange={v=>setForm({...form,species:v})} options={["Tous",...species.map(s=>s.name)]} />
          <Input label="Type d'intervention" value={form.type} onChange={v=>setForm({...form,type:v})} options={["Engrais","Traitement phytosanitaire","Irrigation","Taille","Récolte","Désherbage","Transport","Formation","Entretien","Autre"]} />
          <Input label="Produit / Détail" value={form.product} onChange={v=>setForm({...form,product:v})} />
          <Input label="Quantité" type="number" value={form.qty} onChange={v=>setForm({...form,qty:v})} />
          <Input label="Unité" value={form.unit} onChange={v=>setForm({...form,unit:v})} options={["kg","L","sacs","ha","—"]} />
          <Input label="Responsable de l'intervention" value={form.responsible} onChange={v=>setForm({...form,responsible:v})}
            optObjects={[{value:"",label:"-- Choisir --"},...activeStaff.map(s=>({value:s.name,label:`${s.name} (${s.role})`})),{value:"Autre",label:"Autre"}]} />
          <div style={{ gridColumn:"1/-1" }}>
            <Input label="Notes / Observations" value={form.notes} onChange={v=>setForm({...form,notes:v})} />
          </div>
        </div>
        {form.dateStart && form.dateEnd && duration(form.dateStart,form.dateEnd) !== null && (
          <div style={{ marginTop:10, padding:"8px 14px", background:"#EFF6FF", borderRadius:8, fontFamily:FONT, fontSize:13, fontWeight:600, color:"#1E40AF" }}>
            ⏱️ Durée : {duration(form.dateStart,form.dateEnd)} jour(s)
          </div>
        )}
        <div style={{ marginTop:14, display:"flex", gap:10 }}>
          <Btn onClick={save}>{editing?"Enregistrer":"Ajouter"}</Btn>
          {editing && <Btn variant="secondary" onClick={()=>{setEditing(null);setForm(emptyForm);}}>Annuler</Btn>}
        </div>
      </Card>
      <Card>
        <div style={{ display:"flex", gap:12, marginBottom:14, flexWrap:"wrap", alignItems:"flex-end" }}>
          <h3 style={{ ...sectionTitle, flex:1, marginBottom:0, borderBottom:"none" }}>📋 Historique ({filtered.length})</h3>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ ...inputStyle, width:160 }}>
            <option value="">Tous types</option>
            {["Engrais","Traitement phytosanitaire","Irrigation","Taille","Récolte","Désherbage","Transport","Formation","Entretien","Autre"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:C.sand }}>
                {["Début","Fin","Durée","Site","Espèce","Type","Produit","Qté","Responsable","Notes",""].map(h=>(
                  <th key={h} style={{ padding:"9px 10px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:11, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...filtered].sort((a,b)=>b.dateStart.localeCompare(a.dateStart)).map((t,i)=>{
                const dur = duration(t.dateStart, t.dateEnd);
                return (
                  <tr key={t.id} style={{ background:i%2===0?C.white:C.cream }}>
                    <td style={td}>{t.dateStart}</td>
                    <td style={td}>{t.dateEnd||"—"}</td>
                    <td style={td}>{dur!==null?<Badge color="green">{dur}j</Badge>:"—"}</td>
                    <td style={td}>{siteLabel(t.site,sitesList)}</td>
                    <td style={td}>{t.species}</td>
                    <td style={td}>{typeIcon[t.type]||"📝"} {t.type}</td>
                    <td style={td}>{t.product||"—"}</td>
                    <td style={td}>{t.qty?`${t.qty} ${t.unit}`:"—"}</td>
                    <td style={{ ...td, fontWeight:600 }}>{t.responsible||"—"}</td>
                    <td style={{ ...td, color:C.muted, fontSize:11 }}>{t.notes||"—"}</td>
                    <td style={td}>
                      <div style={{ display:"flex", gap:5 }}>
                        <Btn small variant="secondary" onClick={()=>{setForm({...t,qty:String(t.qty)});setEditing(t.id);}}>✏️</Btn>
                        <Btn small variant="danger" onClick={()=>setTreatments(treatments.filter(x=>x.id!==t.id))}>🗑️</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE : Pépinière & Greffage ───────────────────────────────────────────
const STAGES = ["Semis","Germination","Levée","Croissance porte-greffe","Prêt à greffer","Greffé","Sevré","Prêt à planter"];
const GRAFT_TECHNIQUES = ["Fente","Écusson","Approche","Couronne","Chip budding"];
const GRAFT_STATUSES = ["En attente contrôle","Succès contrôlé","Échec partiel","Échec total","Planté","Vendu"];

function NurseryModule({ batches, setBatches, graftings, setGraftings, species, sitesList }) {
  const [subTab, setSubTab] = useState("batches");
  const [bForm, setBForm] = useState({ name:"", startDate:"", site:"", species:"", variety:"", qtySeeds:"", qtyAlive:"", stage:"Semis", notes:"" });
  const [gForm, setGForm] = useState({ date:"", batchId:"", technique:"", rootstock:"Locale", scion:"", qtyGrafted:"", qtySuccess:"", checkDate:"", status:"En attente contrôle", destination:"", notes:"" });

  const currentSpeciesBatch = species.find(s => s.name === bForm.species);
  const varietyOptBatch = currentSpeciesBatch ? currentSpeciesBatch.varieties : [];

  const saveBatch = () => {
    if (!bForm.name||!bForm.startDate||!bForm.site) return;
    setBatches([...batches, { ...bForm, id:Date.now(), qtySeeds:+bForm.qtySeeds, qtyAlive:+bForm.qtyAlive }]);
    setBForm({ name:"", startDate:"", site:"", species:"", variety:"", qtySeeds:"", qtyAlive:"", stage:"Semis", notes:"" });
  };

  const saveGraft = () => {
    if (!gForm.date||!gForm.technique||!gForm.qtyGrafted) return;
    const batch = batches.find(b=>b.id===+gForm.batchId);
    setGraftings([...graftings, { ...gForm, id:Date.now(), batchName:batch?batch.name:"—", qtyGrafted:+gForm.qtyGrafted, qtySuccess:+gForm.qtySuccess||0 }]);
    setGForm({ date:"", batchId:"", technique:"", rootstock:"Locale", scion:"", qtyGrafted:"", qtySuccess:"", checkDate:"", status:"En attente contrôle", destination:"", notes:"" });
  };

  const exportBatchRows = batches.map(b=>[b.name,b.startDate,b.site,b.species,b.variety,b.qtySeeds,b.qtyAlive,b.stage,b.notes||"—"]);
  const exportGraftRows = graftings.map(g=>[g.date,g.batchName,g.technique,g.rootstock,g.scion,g.qtyGrafted,g.qtySuccess||"—",g.status,g.destination||"—"]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", borderBottom:`2px solid ${C.sand}` }}>
        {[{id:"batches",label:"🌱 Lots"},{id:"graftings",label:"✂️ Greffages"},{id:"timeline",label:"📅 Suivi"}].map(t=>(
          <button key={t.id} onClick={()=>setSubTab(t.id)} style={{ background:subTab===t.id?C.green:"transparent", color:subTab===t.id?C.white:C.forest, border:"none", borderRadius:"8px 8px 0 0", padding:"8px 18px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>{t.label}</button>
        ))}
      </div>

      {subTab==="batches" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <ExportBar title="Lots Pépinière" headers={["Lot","Date semis","Site","Espèce","Variété","Graines","Vivants","Stade","Notes"]} rows={exportBatchRows} filename="pepiniere" />
          <Card>
            <h3 style={sectionTitle}>➕ Nouveau lot</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
              <Input label="Nom du lot" value={bForm.name} onChange={v=>setBForm({...bForm,name:v})} />
              <Input label="Date semis" type="date" value={bForm.startDate} onChange={v=>setBForm({...bForm,startDate:v})} />
              <Input label="Site" value={bForm.site} onChange={v=>setBForm({...bForm,site:v})} optObjects={siteOptions(sitesList)} />
              <Input label="Espèce" value={bForm.species} onChange={v=>setBForm({...bForm,species:v,variety:""})} options={species.map(s=>s.name)} />
              <Input label="Variété" value={bForm.variety} onChange={v=>setBForm({...bForm,variety:v})} options={varietyOptBatch} />
              <Input label="Graines semées" type="number" value={bForm.qtySeeds} onChange={v=>setBForm({...bForm,qtySeeds:v})} />
              <Input label="Plants vivants" type="number" value={bForm.qtyAlive} onChange={v=>setBForm({...bForm,qtyAlive:v})} />
              <Input label="Stade" value={bForm.stage} onChange={v=>setBForm({...bForm,stage:v})} options={STAGES} />
              <Input label="Notes" value={bForm.notes} onChange={v=>setBForm({...bForm,notes:v})} />
            </div>
            <div style={{ marginTop:14 }}><Btn onClick={saveBatch}>Ajouter</Btn></div>
          </Card>
          <Card>
            <h3 style={sectionTitle}>🪴 Lots en cours ({batches.length})</h3>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.sand }}>
                    {["Lot","Date","Site","Espèce","Variété","Graines","Vivants","Survie","Stade",""].map(h=>(
                      <th key={h} style={{ padding:"10px 11px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b,i)=>{
                    const survie = b.qtySeeds>0?Math.round(b.qtyAlive/b.qtySeeds*100):0;
                    const sp = species.find(s=>s.name===b.species);
                    return (
                      <tr key={b.id} style={{ background:i%2===0?C.white:C.cream }}>
                        <td style={{ ...td, fontWeight:700 }}>{b.name}</td>
                        <td style={td}>{b.startDate}</td>
                        <td style={td}>{b.site}</td>
                        <td style={td}>{sp?`${sp.emoji} ${b.species}`:b.species}</td>
                        <td style={td}><Badge color="green">{b.variety}</Badge></td>
                        <td style={td}>{b.qtySeeds}</td>
                        <td style={{ ...td, fontWeight:700 }}>{b.qtyAlive}</td>
                        <td style={td}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:40, height:6, background:C.sand, borderRadius:3 }}>
                              <div style={{ height:6, width:`${survie}%`, background:survie>=80?C.sage:C.amber, borderRadius:3 }} />
                            </div>
                            <span style={{ fontSize:11, fontFamily:FONT }}>{survie}%</span>
                          </div>
                        </td>
                        <td style={td}><Badge color={b.stage==="Prêt à planter"||b.stage==="Prêt à greffer"?"green":"amber"}>{b.stage}</Badge></td>
                        <td style={td}><Btn small variant="danger" onClick={()=>setBatches(batches.filter(x=>x.id!==b.id))}>🗑️</Btn></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {subTab==="graftings" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <ExportBar title="Greffages" headers={["Date","Lot","Technique","Porte-greffe","Greffon","Greffés","Reprises","Statut","Destination"]} rows={exportGraftRows} filename="greffages" />
          <Card>
            <h3 style={sectionTitle}>➕ Enregistrer un greffage</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
              <Input label="Date" type="date" value={gForm.date} onChange={v=>setGForm({...gForm,date:v})} />
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: FONT }}>Lot source</label>
                <select value={gForm.batchId} onChange={e=>setGForm({...gForm,batchId:e.target.value})} style={inputStyle}>
                  <option value="">-- Choisir --</option>
                  {batches.map(b=><option key={b.id} value={b.id}>{b.name} ({b.qtyAlive} plants)</option>)}
                </select>
              </div>
              <Input label="Technique" value={gForm.technique} onChange={v=>setGForm({...gForm,technique:v})} options={GRAFT_TECHNIQUES} />
              <Input label="Porte-greffe" value={gForm.rootstock} onChange={v=>setGForm({...gForm,rootstock:v})} />
              <Input label="Greffon (variété)" value={gForm.scion} onChange={v=>setGForm({...gForm,scion:v})} />
              <Input label="Nb greffés" type="number" value={gForm.qtyGrafted} onChange={v=>setGForm({...gForm,qtyGrafted:v})} />
              <Input label="Nb reprises" type="number" value={gForm.qtySuccess} onChange={v=>setGForm({...gForm,qtySuccess:v})} />
              <Input label="Date contrôle" type="date" value={gForm.checkDate} onChange={v=>setGForm({...gForm,checkDate:v})} />
              <Input label="Statut" value={gForm.status} onChange={v=>setGForm({...gForm,status:v})} options={GRAFT_STATUSES} />
              <Input label="Destination" value={gForm.destination} onChange={v=>setGForm({...gForm,destination:v})} options={["Plantation Site A","Plantation Site B","Plantation Site C","Vente","Don","Autre"]} />
              <Input label="Notes" value={gForm.notes} onChange={v=>setGForm({...gForm,notes:v})} />
            </div>
            <div style={{ marginTop:14 }}><Btn onClick={saveGraft}>Enregistrer</Btn></div>
          </Card>
          <Card>
            <h3 style={sectionTitle}>✂️ Historique greffages</h3>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.sand }}>
                    {["Date","Lot","Technique","PG","Greffon","Greffés","Reprises","Taux","Statut",""].map(h=>(
                      <th key={h} style={{ padding:"9px 10px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...graftings].sort((a,b)=>b.date.localeCompare(a.date)).map((g,i)=>{
                    const rate = g.qtyGrafted>0&&g.qtySuccess>0?Math.round(g.qtySuccess/g.qtyGrafted*100):null;
                    return (
                      <tr key={g.id} style={{ background:i%2===0?C.white:C.cream }}>
                        <td style={td}>{g.date}</td>
                        <td style={{ ...td, fontSize:11 }}>{g.batchName}</td>
                        <td style={td}><Badge color="amber">{g.technique}</Badge></td>
                        <td style={td}>{g.rootstock}</td>
                        <td style={td}><Badge color="green">{g.scion}</Badge></td>
                        <td style={{ ...td, fontWeight:700 }}>{g.qtyGrafted}</td>
                        <td style={td}>{g.qtySuccess||"—"}</td>
                        <td style={td}>{rate!==null?<span style={{ fontWeight:700, color:rate>=80?"#065F46":"#92400E" }}>{rate}%</span>:"—"}</td>
                        <td style={td}><Badge color={g.status==="Succès contrôlé"?"green":g.status.includes("Échec")?"red":"amber"}>{g.status}</Badge></td>
                        <td style={td}><Btn small variant="danger" onClick={()=>setGraftings(graftings.filter(x=>x.id!==g.id))}>🗑️</Btn></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {subTab==="timeline" && (
        <Card>
          <h3 style={sectionTitle}>📅 Suivi par lot</h3>
          {batches.map(b=>{
            const bGrafts = graftings.filter(g=>String(g.batchId)===String(b.id));
            const stageIdx = STAGES.indexOf(b.stage);
            return (
              <div key={b.id} style={{ marginBottom:24, paddingBottom:20, borderBottom:`1px solid ${C.sand}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div>
                    <span style={{ fontWeight:700, fontSize:14, fontFamily:FONT, color:C.forest }}>{b.name}</span>
                    <span style={{ marginLeft:10, fontSize:12, color:C.muted, fontFamily:FONT }}>{b.site} · {b.species} · {b.startDate}</span>
                  </div>
                  <Badge color="green">{b.qtyAlive} plants</Badge>
                </div>
                <div style={{ display:"flex", gap:0, marginBottom:12 }}>
                  {STAGES.map((s,idx)=>(
                    <div key={s} style={{ flex:1, height:8, background:idx<stageIdx?C.sage:idx===stageIdx?C.ocre:C.sand, borderRadius:idx===0?"4px 0 0 4px":idx===STAGES.length-1?"0 4px 4px 0":0, borderRight:idx<STAGES.length-1?"2px solid white":"none" }} />
                  ))}
                </div>
                <div style={{ fontSize:11, fontFamily:FONT, color:C.ocre, fontWeight:600, marginBottom:8 }}>▲ Stade actuel : {b.stage}</div>
                {bGrafts.length>0?(
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {bGrafts.map(g=>{
                      const rate = g.qtySuccess>0?Math.round(g.qtySuccess/g.qtyGrafted*100):null;
                      return (
                        <div key={g.id} style={{ background:C.cream, borderRadius:10, padding:"8px 12px", fontSize:12, fontFamily:FONT, borderLeft:`4px solid ${g.status==="Succès contrôlé"?C.sage:C.amber}` }}>
                          <div style={{ fontWeight:700 }}>{g.date} · {g.technique}</div>
                          <div style={{ color:C.muted }}>{g.rootstock} → {g.scion} · {g.qtyGrafted} greffés{rate!==null?` · ${rate}% reprise`:""}</div>
                        </div>
                      );
                    })}
                  </div>
                ):(
                  <div style={{ fontSize:12, color:C.muted, fontStyle:"italic", fontFamily:FONT }}>Aucun greffage enregistré.</div>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

// ─── MODULE : RH & Charges ───────────────────────────────────────────────────
const ROLES = ["Chef de site","Greffeur","Responsable pépinière","Chauffeur","Magasinier","Comptable","Ouvrière agricole","Ouvrier agricole","Gardien","Autre"];
const TASKS_TEMP = ["Récolte","Désherbage","Application engrais","Taille","Greffage","Semis pépinière","Irrigation manuelle","Transport","Conditionnement","Autre"];
// ─── MODULE : RH & Charges (enrichi) ─────────────────────────────────────────

const StaffCard = ({ s, onEdit, onDelete }) => (
  <div style={{ background:C.white, borderRadius:14, padding:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderTop:`4px solid ${s.status==="Actif"?C.green:C.amber}` }}>
    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
      {/* Photo ou avatar */}
      <div style={{ flexShrink:0 }}>
        {s.photoUrl ? (
          <img src={s.photoUrl} alt={s.name} style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", border:`3px solid ${C.sand}` }} onError={e=>e.target.style.display="none"} />
        ) : (
          <div style={{ width:56, height:56, borderRadius:"50%", background:C.sand, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, border:`3px solid ${C.mint}` }}>👤</div>
        )}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:FONT, fontWeight:800, fontSize:15, color:C.forest }}>{s.name}</div>
        <div style={{ fontFamily:FONT, fontSize:12, color:C.muted }}>{s.role} · {s.site}</div>
        <div style={{ fontFamily:FONT, fontSize:12, color:C.forest, fontWeight:600, marginTop:2 }}>{s.salary?.toLocaleString()} FCFA/mois</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end" }}>
        <Badge color={s.status==="Actif"?"green":"amber"}>{s.status}</Badge>
        <div style={{ display:"flex", gap:4, marginTop:4 }}>
          <Btn small variant="secondary" onClick={onEdit}>✏️</Btn>
          <Btn small variant="danger" onClick={onDelete}>🗑️</Btn>
        </div>
      </div>
    </div>
    {/* Infos complémentaires */}
    <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:8, fontSize:11, fontFamily:FONT }}>
      {s.phone && <span style={{ background:C.cream, padding:"3px 8px", borderRadius:6 }}>📱 {s.phone}</span>}
      {s.startDate && <span style={{ background:C.cream, padding:"3px 8px", borderRadius:6 }}>📅 Depuis {s.startDate}</span>}
      {s.cniNum && <span style={{ background:C.cream, padding:"3px 8px", borderRadius:6 }}>🪪 CNI: {s.cniNum}</span>}
    </div>
    {/* Liens documents */}
    <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:8 }}>
      {s.cniUrl && <a href={s.cniUrl} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.green, fontFamily:FONT, fontWeight:600, textDecoration:"none" }}>🪪 Voir CNI</a>}
      {s.photoUrl && <a href={s.photoUrl} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.green, fontFamily:FONT, fontWeight:600, textDecoration:"none" }}>🖼️ Photo</a>}
      {s.doc1Url && <a href={s.doc1Url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.green, fontFamily:FONT, fontWeight:600, textDecoration:"none" }}>📎 {s.doc1Label||"Document 1"}</a>}
      {s.doc2Url && <a href={s.doc2Url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.green, fontFamily:FONT, fontWeight:600, textDecoration:"none" }}>📎 {s.doc2Label||"Document 2"}</a>}
    </div>
    {s.notes && <div style={{ marginTop:6, fontSize:11, color:C.muted, fontStyle:"italic", fontFamily:FONT }}>{s.notes}</div>}
  </div>
);

function HRChargesModule({ staff, setStaff, tempWork, setTempWork, charges, setCharges, sitesList, token }) {
  const [subTab, setSubTab] = useState("dashboard_rh");
  const emptyStaff = { name:"", role:"", site:"", salary:"", startDate:"", status:"Actif", phone:"", cniNum:"", cniUrl:"", photoUrl:"", doc1Url:"", doc1Label:"", doc2Url:"", doc2Label:"", notes:"" };
  const [sForm, setSForm] = useState(emptyStaff);
  const [editingS, setEditingS] = useState(null);
  const [tForm, setTForm] = useState({ date:"", site:"", task:"", nbWorkers:"", nbDays:"", dailyRate:"", notes:"" });
  const [cForm, setCForm] = useState({ date:"", category:"", label:"", site:"Tous", amount:"", paid:false, notes:"" });
  const [editingC, setEditingC] = useState(null);
  const [staffView, setStaffView] = useState("cards"); // cards | table

  const monthlyPayroll = staff.filter(s=>s.status==="Actif").reduce((s,e)=>s+e.salary,0);
  const totalTempCost  = tempWork.reduce((s,t)=>s+t.total,0);
  const unpaidCharges  = charges.filter(c=>!c.paid).reduce((s,c)=>s+c.amount,0);

  const saveStaff = () => {
    if (!sForm.name||!sForm.role||!sForm.salary) return;
    const entry = { ...sForm, id:editingS||Date.now(), salary:+sForm.salary };
    setStaff(editingS?staff.map(s=>s.id===editingS?entry:s):[...staff,entry]);
    setEditingS(null); setSForm(emptyStaff);
  };
  const saveTempWork = () => {
    if (!tForm.date||!tForm.task||!tForm.nbWorkers||!tForm.dailyRate) return;
    const total = +tForm.nbWorkers * +tForm.nbDays * +tForm.dailyRate;
    setTempWork([...tempWork, { ...tForm, id:Date.now(), nbWorkers:+tForm.nbWorkers, nbDays:+tForm.nbDays, dailyRate:+tForm.dailyRate, total }]);
    setTForm({ date:"", site:"", task:"", nbWorkers:"", nbDays:"", dailyRate:"", notes:"" });
  };
  const saveCharge = () => {
    if (!cForm.date||!cForm.category||!cForm.amount) return;
    const entry = { ...cForm, id:editingC||Date.now(), amount:+cForm.amount };
    setCharges(editingC?charges.map(c=>c.id===editingC?entry:c):[...charges,entry]);
    setEditingC(null); setCForm({ date:"", category:"", label:"", site:"Tous", amount:"", paid:false, notes:"" });
  };

  const exportStaffRows = staff.map(s=>[s.name,s.role,s.site,s.salary,s.startDate,s.status,s.phone||"—",s.cniNum||"—"]);
  const exportTempRows  = [...tempWork].sort((a,b)=>b.date.localeCompare(a.date)).map(t=>[t.date,t.site,t.task,t.nbWorkers,t.nbDays,t.dailyRate,t.total]);
  const exportChargeRows= [...charges].sort((a,b)=>b.date.localeCompare(a.date)).map(c=>[c.date,c.category,c.label,c.site,c.amount,c.paid?"Payé":"À payer",c.notes||"—"]);

  const subTabs = [
    {id:"dashboard_rh",label:"📊 Vue RH"},
    {id:"permanent",   label:"👷 Permanents"},
    {id:"temp",        label:"👥 Temporaires"},
    {id:"charges",     label:"📋 Charges"},
    {id:"synthese",    label:"💹 Synthèse"},
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
        <StatCard icon="👷" label="Masse salariale/mois" value={`${(monthlyPayroll/1000).toFixed(0)}K`} sub={`${staff.filter(s=>s.status==="Actif").length} permanents`} color="#DBEAFE" />
        <StatCard icon="👥" label="MO temporaire total" value={`${(totalTempCost/1000).toFixed(0)}K`} color="#FEF9C3" />
        <StatCard icon="📋" label="Charges totales" value={`${(charges.reduce((s,c)=>s+c.amount,0)/1000).toFixed(0)}K`} color="#FCE7F3" />
        <StatCard icon="⚠️" label="Impayées" value={`${(unpaidCharges/1000).toFixed(0)}K`} color="#FEE2E2" />
      </div>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", borderBottom:`2px solid ${C.sand}` }}>
        {subTabs.map(t=>(
          <button key={t.id} onClick={()=>setSubTab(t.id)} style={{ background:subTab===t.id?C.green:"transparent", color:subTab===t.id?C.white:C.forest, border:"none", borderRadius:"8px 8px 0 0", padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>{t.label}</button>
        ))}
      </div>

      {/* ── Dashboard RH ── */}
      {subTab==="dashboard_rh" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          <Card>
            <h3 style={sectionTitle}>👷 Masse salariale par site</h3>
            {sitesList.map(s=>{
              const siteSalary = staff.filter(x=>x.site===s.code&&x.status==="Actif").reduce((sum,x)=>sum+x.salary,0);
              const nb = staff.filter(x=>x.site===s.code&&x.status==="Actif").length;
              return (
                <div key={s.code} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4, fontFamily:FONT }}>
                    <span style={{ fontWeight:600 }}>{s.code} — {s.name} <span style={{ color:C.muted, fontWeight:400 }}>({nb})</span></span>
                    <span style={{ fontWeight:700, color:C.forest }}>{siteSalary.toLocaleString()} F</span>
                  </div>
                  <div style={{ height:7, background:C.sand, borderRadius:4 }}>
                    <div style={{ height:7, width:`${monthlyPayroll>0?(siteSalary/monthlyPayroll)*100:0}%`, background:C.sage, borderRadius:4 }} />
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop:12, padding:"10px 14px", background:C.sand, borderRadius:10, display:"flex", justifyContent:"space-between", fontFamily:FONT }}>
              <span style={{ fontWeight:700, color:C.forest }}>TOTAL MENSUEL</span>
              <span style={{ fontWeight:800, fontSize:15, color:C.forest }}>{monthlyPayroll.toLocaleString()} FCFA</span>
            </div>
          </Card>
          <Card>
            <h3 style={sectionTitle}>📋 Top charges par catégorie</h3>
            {CHARGE_CATEGORIES.map(cat=>{
              const amt = charges.filter(c=>c.category===cat).reduce((s,c)=>s+c.amount,0);
              return amt>0?(
                <div key={cat} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.sand}`, fontFamily:FONT, fontSize:13 }}>
                  <span>{cat}</span><span style={{ fontWeight:700, color:C.bark }}>{amt.toLocaleString()} F</span>
                </div>
              ):null;
            })}
          </Card>
        </div>
      )}

      {/* ── Permanents ── */}
      {subTab==="permanent" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <ExportBar title="Personnel Permanent" headers={["Nom","Poste","Site","Salaire","Embauche","Statut","Tél.","CNI"]} rows={exportStaffRows} extraInfo={[{label:"Masse salariale",val:monthlyPayroll.toLocaleString()+" FCFA/mois"}]} filename="personnel" />
          <Card>
            <h3 style={sectionTitle}>{editingS?"✏️ Modifier l'employé":"➕ Ajouter un employé permanent"}</h3>
            {/* Info URL */}
            <div style={{ marginBottom:12, padding:"8px 12px", background:"#EFF6FF", borderRadius:8, fontSize:12, fontFamily:FONT, color:"#1E40AF" }}>
              💡 Pour les photos et documents : colle le lien de partage Google Drive, Dropbox ou tout autre service cloud.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
              <Input label="Nom complet" value={sForm.name} onChange={v=>setSForm({...sForm,name:v})} />
              <Input label="Poste / Rôle" value={sForm.role} onChange={v=>setSForm({...sForm,role:v})} options={ROLES} />
              <Input label="Site affecté" value={sForm.site} onChange={v=>setSForm({...sForm,site:v})} optObjects={[...siteOptions(sitesList),{value:"Tous sites",label:"Tous sites"}]} />
              <Input label="Salaire mensuel (FCFA)" type="number" value={sForm.salary} onChange={v=>setSForm({...sForm,salary:v})} />
              <Input label="Date d'embauche" type="date" value={sForm.startDate} onChange={v=>setSForm({...sForm,startDate:v})} />
              <Input label="Téléphone" value={sForm.phone} onChange={v=>setSForm({...sForm,phone:v})} />
              <Input label="Statut" value={sForm.status} onChange={v=>setSForm({...sForm,status:v})} options={["Actif","Congé","Suspendu","Parti"]} />
              <Input label="Numéro CNI" value={sForm.cniNum} onChange={v=>setSForm({...sForm,cniNum:v})} />
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12, fontWeight:600, color:C.muted, fontFamily:FONT }}>Photo (depuis téléphone/ordinateur)</label>
                <FileUpload folder="staff/photos" token={token} accept="image/*" currentUrl={sForm.photoUrl}
                  onUploaded={(url) => setSForm(f => ({...f, photoUrl:url}))} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12, fontWeight:600, color:C.muted, fontFamily:FONT }}>Scan CNI (photo ou PDF)</label>
                <FileUpload folder="staff/cni" token={token} accept="image/*,.pdf" currentUrl={sForm.cniUrl}
                  onUploaded={(url) => setSForm(f => ({...f, cniUrl:url}))} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12, fontWeight:600, color:C.muted, fontFamily:FONT }}>Document 1 (contrat, attestation...)</label>
                <FileUpload folder="staff/docs" token={token} accept="*" currentUrl={sForm.doc1Url}
                  onUploaded={(url, name) => setSForm(f => ({...f, doc1Url:url, doc1Label:name||f.doc1Label||"Document 1"}))} />
              </div>
              <Input label="Libellé document 1" value={sForm.doc1Label} onChange={v=>setSForm({...sForm,doc1Label:v})} />
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12, fontWeight:600, color:C.muted, fontFamily:FONT }}>Document 2</label>
                <FileUpload folder="staff/docs" token={token} accept="*" currentUrl={sForm.doc2Url}
                  onUploaded={(url, name) => setSForm(f => ({...f, doc2Url:url, doc2Label:name||f.doc2Label||"Document 2"}))} />
              </div>
              <Input label="Libellé document 2" value={sForm.doc2Label} onChange={v=>setSForm({...sForm,doc2Label:v})} />
              <div style={{ gridColumn:"1/-1" }}>
                <Input label="Notes" value={sForm.notes} onChange={v=>setSForm({...sForm,notes:v})} />
              </div>
            </div>
            <div style={{ marginTop:14, display:"flex", gap:10 }}>
              <Btn onClick={saveStaff}>{editingS?"Enregistrer":"Ajouter"}</Btn>
              {editingS&&<Btn variant="secondary" onClick={()=>{setEditingS(null);setSForm(emptyStaff);}}>Annuler</Btn>}
            </div>
          </Card>
          <Card>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h3 style={{ ...sectionTitle, marginBottom:0, borderBottom:"none" }}>👷 Personnel ({staff.length}) — {monthlyPayroll.toLocaleString()} FCFA/mois</h3>
              <div style={{ display:"flex", gap:6 }}>
                {[{id:"cards",label:"🪪 Fiches"},{id:"table",label:"📋 Tableau"}].map(v=>(
                  <button key={v.id} onClick={()=>setStaffView(v.id)} style={{ background:staffView===v.id?C.green:C.sand, color:staffView===v.id?C.white:C.forest, border:"none", borderRadius:7, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>{v.label}</button>
                ))}
              </div>
            </div>
            {staffView==="cards" ? (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                {staff.map(s=>(
                  <StaffCard key={s.id} s={s}
                    onEdit={()=>{setSForm({...s,salary:String(s.salary)});setEditingS(s.id);}}
                    onDelete={()=>setStaff(staff.filter(x=>x.id!==s.id))} />
                ))}
              </div>
            ) : (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:C.sand }}>
                      {["Photo","Nom","Poste","Site","Salaire/mois","CNI","Embauche","Statut","Docs",""].map(h=>(
                        <th key={h} style={{ padding:"9px 10px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:11, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s,i)=>(
                      <tr key={s.id} style={{ background:i%2===0?C.white:C.cream }}>
                        <td style={td}>
                          {s.photoUrl
                            ? <img src={s.photoUrl} alt="" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
                            : <div style={{ width:36, height:36, borderRadius:"50%", background:C.sand, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>👤</div>
                          }
                        </td>
                        <td style={{ ...td, fontWeight:700 }}>{s.name}</td>
                        <td style={td}><Badge color="amber">{s.role}</Badge></td>
                        <td style={td}>{s.site}</td>
                        <td style={{ ...td, fontWeight:700 }}>{s.salary?.toLocaleString()} F</td>
                        <td style={{ ...td, fontSize:11 }}>{s.cniNum||"—"}</td>
                        <td style={td}>{s.startDate}</td>
                        <td style={td}><Badge color={s.status==="Actif"?"green":"amber"}>{s.status}</Badge></td>
                        <td style={td}>
                          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                            {s.cniUrl&&<a href={s.cniUrl} target="_blank" rel="noreferrer" style={{ fontSize:10, color:C.green, textDecoration:"none", fontWeight:600 }}>🪪 CNI</a>}
                            {s.doc1Url&&<a href={s.doc1Url} target="_blank" rel="noreferrer" style={{ fontSize:10, color:C.green, textDecoration:"none", fontWeight:600 }}>📎</a>}
                          </div>
                        </td>
                        <td style={td}>
                          <div style={{ display:"flex", gap:5 }}>
                            <Btn small variant="secondary" onClick={()=>{setSForm({...s,salary:String(s.salary)});setEditingS(s.id);}}>✏️</Btn>
                            <Btn small variant="danger" onClick={()=>setStaff(staff.filter(x=>x.id!==s.id))}>🗑️</Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── Temporaires ── */}
      {subTab==="temp" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <ExportBar title="Main d'Oeuvre Temporaire" headers={["Date","Site","Tâche","Pers.","Jours","Taux/j","Total"]} rows={exportTempRows} extraInfo={[{label:"Total",val:totalTempCost.toLocaleString()+" FCFA"}]} filename="mo_temporaire" />
          <Card>
            <h3 style={sectionTitle}>➕ Enregistrer une prestation temporaire</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
              <Input label="Date" type="date" value={tForm.date} onChange={v=>setTForm({...tForm,date:v})} />
              <Input label="Site" value={tForm.site} onChange={v=>setTForm({...tForm,site:v})} optObjects={siteOptions(sitesList)} />
              <Input label="Tâche effectuée" value={tForm.task} onChange={v=>setTForm({...tForm,task:v})} options={TASKS_TEMP} />
              <Input label="Nb personnes" type="number" value={tForm.nbWorkers} onChange={v=>setTForm({...tForm,nbWorkers:v})} />
              <Input label="Nb jours" type="number" value={tForm.nbDays} onChange={v=>setTForm({...tForm,nbDays:v})} />
              <Input label="Taux journalier (FCFA)" type="number" value={tForm.dailyRate} onChange={v=>setTForm({...tForm,dailyRate:v})} />
              <Input label="Notes" value={tForm.notes} onChange={v=>setTForm({...tForm,notes:v})} />
            </div>
            {tForm.nbWorkers&&tForm.nbDays&&tForm.dailyRate&&(
              <div style={{ marginTop:10, padding:"8px 14px", background:"#DBEAFE", borderRadius:8, fontFamily:FONT, fontSize:13, fontWeight:600, color:"#1E40AF" }}>
                💡 Total calculé : {(+tForm.nbWorkers * +tForm.nbDays * +tForm.dailyRate).toLocaleString()} FCFA
              </div>
            )}
            <div style={{ marginTop:14 }}><Btn onClick={saveTempWork}>Enregistrer</Btn></div>
          </Card>
          <Card>
            <h3 style={sectionTitle}>👥 Historique MO temporaire — Total : {totalTempCost.toLocaleString()} FCFA</h3>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:C.sand }}>{["Date","Site","Tâche","Pers.","Jours","Taux/j","Total",""].map(h=><th key={h} style={{ padding:"9px 10px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:11, whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
                <tbody>{[...tempWork].sort((a,b)=>b.date.localeCompare(a.date)).map((t,i)=>(
                  <tr key={t.id} style={{ background:i%2===0?C.white:C.cream }}>
                    <td style={td}>{t.date}</td><td style={td}>{siteLabel(t.site,sitesList)}</td>
                    <td style={td}><Badge color="amber">{t.task}</Badge></td>
                    <td style={{ ...td, textAlign:"center" }}>{t.nbWorkers}</td>
                    <td style={{ ...td, textAlign:"center" }}>{t.nbDays}</td>
                    <td style={td}>{t.dailyRate.toLocaleString()} F</td>
                    <td style={{ ...td, fontWeight:700 }}>{t.total.toLocaleString()} F</td>
                    <td style={td}><Btn small variant="danger" onClick={()=>setTempWork(tempWork.filter(x=>x.id!==t.id))}>🗑️</Btn></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── Charges ── */}
      {subTab==="charges" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <ExportBar title="Charges" headers={["Date","Catégorie","Libellé","Site","Montant","Statut","Notes"]} rows={exportChargeRows} extraInfo={[{label:"Total",val:charges.reduce((s,c)=>s+c.amount,0).toLocaleString()+" FCFA"}]} filename="charges" />
          <Card>
            <h3 style={sectionTitle}>{editingC?"✏️ Modifier":"➕ Saisir une charge"}</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
              <Input label="Date" type="date" value={cForm.date} onChange={v=>setCForm({...cForm,date:v})} />
              <Input label="Catégorie" value={cForm.category} onChange={v=>setCForm({...cForm,category:v})} options={CHARGE_CATEGORIES} />
              <Input label="Libellé" value={cForm.label} onChange={v=>setCForm({...cForm,label:v})} />
              <Input label="Site" value={cForm.site} onChange={v=>setCForm({...cForm,site:v})} optObjects={[...siteOptions(sitesList),{value:"Tous",label:"Tous sites"}]} />
              <Input label="Montant (FCFA)" type="number" value={cForm.amount} onChange={v=>setCForm({...cForm,amount:v})} />
              <Input label="Notes / Fournisseur" value={cForm.notes} onChange={v=>setCForm({...cForm,notes:v})} />
            </div>
            <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:10 }}>
              <label style={{ fontSize:13, display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontFamily:FONT }}>
                <input type="checkbox" checked={cForm.paid} onChange={e=>setCForm({...cForm,paid:e.target.checked})} /> Déjà payé
              </label>
            </div>
            <div style={{ marginTop:14, display:"flex", gap:10 }}>
              <Btn onClick={saveCharge}>{editingC?"Enregistrer":"Ajouter"}</Btn>
              {editingC&&<Btn variant="secondary" onClick={()=>{setEditingC(null);setCForm({date:"",category:"",label:"",site:"Tous",amount:"",paid:false,notes:""});}}>Annuler</Btn>}
            </div>
          </Card>
          <Card>
            <h3 style={sectionTitle}>📋 Journal des charges</h3>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:C.sand }}>{["Date","Catégorie","Libellé","Site","Montant","Statut","Notes",""].map(h=><th key={h} style={{ padding:"9px 10px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:11, whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
                <tbody>{[...charges].sort((a,b)=>b.date.localeCompare(a.date)).map((c,i)=>(
                  <tr key={c.id} style={{ background:i%2===0?C.white:C.cream }}>
                    <td style={td}>{c.date}</td>
                    <td style={td}><Badge color="amber">{c.category}</Badge></td>
                    <td style={{ ...td, fontWeight:600 }}>{c.label}</td>
                    <td style={td}>{c.site}</td>
                    <td style={{ ...td, fontWeight:700 }}>{c.amount.toLocaleString()} F</td>
                    <td style={td}><span onClick={()=>setCharges(charges.map(x=>x.id===c.id?{...x,paid:!x.paid}:x))} style={{ cursor:"pointer" }}><Badge color={c.paid?"green":"amber"}>{c.paid?"✅ Payé":"⏳ À payer"}</Badge></span></td>
                    <td style={{ ...td, color:C.muted, fontSize:11 }}>{c.notes||"—"}</td>
                    <td style={td}><div style={{ display:"flex", gap:5 }}><Btn small variant="secondary" onClick={()=>{setCForm({...c,amount:String(c.amount)});setEditingC(c.id);}}>✏️</Btn><Btn small variant="danger" onClick={()=>setCharges(charges.filter(x=>x.id!==c.id))}>🗑️</Btn></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── Synthèse ── */}
      {subTab==="synthese" && (
        <Card>
          <h3 style={sectionTitle}>💹 Structure des coûts</h3>
          {[
            { label:"Personnel permanent", amount:monthlyPayroll*12, color:"#3B82F6" },
            { label:"MO temporaire", amount:totalTempCost, color:C.amber },
            ...CHARGE_CATEGORIES.map((cat,i)=>({ label:cat, amount:charges.filter(c=>c.category===cat).reduce((s,c)=>s+c.amount,0), color:`hsl(${120+i*20},50%,45%)` }))
          ].filter(x=>x.amount>0).map(x=>{
            const total = monthlyPayroll*12+totalTempCost+charges.reduce((s,c)=>s+c.amount,0);
            const pct = total>0?(x.amount/total*100):0;
            return (
              <div key={x.label} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3, fontFamily:FONT }}>
                  <span>{x.label}</span>
                  <span style={{ fontWeight:700 }}>{x.amount.toLocaleString()} F ({pct.toFixed(1)}%)</span>
                </div>
                <div style={{ height:7, background:C.sand, borderRadius:4 }}>
                  <div style={{ height:7, width:`${pct}%`, background:x.color, borderRadius:4 }} />
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

// ─── MODULE : 📦 Actifs & Stocks ─────────────────────────────────────────────

// ── Catégories d'actifs
const ASSET_CATEGORIES = {
  "Matériel roulant":    { icon:"🚜", items:["Tracteur","Motopompe","Véhicule pick-up","Moto","Remorque","Groupe électrogène","Autre"] },
  "Équipement fixe":     { icon:"🏭", items:["Serre","Bâtiment stockage","Forage","Château d'eau","Clôture","Autre"] },
  "Petit matériel":      { icon:"🔧", items:["Machette","Houe","Sécateur","Plantoir","Pulvérisateur","Tronçonneuse","Arrosoir","Brouette","Pelle","Pioche","Autre"] },
  "EPI":                 { icon:"🦺", items:["Tenue de travail","Bottes","Gants","Casque","Lunettes","Masque","Tablier","Autre"] },
  "Intrants agricoles":  { icon:"🌿", items:["Engrais NPK","Engrais foliaire","Engrais granulé","Fumier/Compost","Biofertilisant","Insecticide","Fongicide","Herbicide","Nématicide","Autre"] },
  "Semences & Plants":   { icon:"🌱", items:["Semences","Plants greffés","Porte-greffe","Autre"] },
  "Emballage":           { icon:"📦", items:["Caisses bois","Caisses plastique","Sacs","Filets","Cartons","Autre"] },
  "Outillage bureau":    { icon:"💼", items:["Ordinateur","Imprimante","Tablette","Téléphone","GPS","Balance","Autre"] },
};

const ASSET_STATUSES = ["Disponible","En service","En maintenance","Hors service","Mis au rebut","Introuvable","Prêté"];
const STOCK_UNITS = ["kg","L","sacs","unités","bottes","rouleaux","m","m²"];

// Données initiales actifs
const initialAssets = [
  { id:1, ref:"MAT-001", category:"Matériel roulant", item:"Tracteur", brand:"Massey Ferguson", model:"MF 135", site:"Site A", qty:1, unit:"unités", purchaseDate:"2019-03-15", purchaseValue:8500000, currentValue:5000000, status:"En service", responsible:"Jean-Baptiste Mballa", serialNum:"MF135-CAM-019", notes:"Révision annuelle mars", docUrl:"", lastInventory:"2024-01-15" },
  { id:2, ref:"EPI-001", category:"EPI", item:"Tenue de travail", brand:"", model:"", site:"Site A", qty:5, unit:"unités", purchaseDate:"2023-06-01", purchaseValue:75000, currentValue:40000, status:"Disponible", responsible:"", serialNum:"", notes:"Tailles M et L", docUrl:"", lastInventory:"2024-01-15", assignedTo:"" },
  { id:3, ref:"INT-001", category:"Intrants agricoles", item:"Engrais NPK", brand:"SoilFert", model:"20-10-10", site:"Site A", qty:200, unit:"kg", purchaseDate:"2024-02-01", purchaseValue:50000, currentValue:50000, status:"Disponible", responsible:"", serialNum:"", notes:"Stock actuel", docUrl:"", lastInventory:"2024-02-01", minStock:50 },
];

// Données mouvements de stock
const initialStockMoves = [
  { id:1, date:"2024-02-15", assetId:3, assetRef:"INT-001", type:"Sortie", qty:50, unit:"kg", site:"Site A", operator:"Paul Etoga", reason:"Application parcelle Hass", notes:"" },
];

function AssetsModule({ sitesList, staff, token }) {
  const [assets, setAssets]         = useState(()=>loadLS("vs_assets", initialAssets));
  const [stockMoves, setStockMoves] = useState(()=>loadLS("vs_stock_moves", initialStockMoves));
  const [subTab, setSubTab]         = useState("inventory");
  const [filterCat, setFilterCat]   = useState("");
  const [filterSite, setFilterSite] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const emptyAsset = { ref:"", category:"", item:"", brand:"", model:"", site:"", qty:"1", unit:"unités", purchaseDate:"", purchaseValue:"", currentValue:"", status:"Disponible", responsible:"", serialNum:"", notes:"", docUrl:"", lastInventory:"", minStock:"", assignedTo:"" };
  const [form, setForm] = useState(emptyAsset);
  const [editing, setEditing] = useState(null);

  const emptyMove = { date:"", assetId:"", type:"Sortie", qty:"", unit:"", operator:"", reason:"", notes:"" };
  const [moveForm, setMoveForm] = useState(emptyMove);

  const activeStaff = staff.filter(s => s.status === "Actif");

  // Save helpers
  const saveAsset = () => {
    if (!form.ref||!form.category||!form.item||!form.site) return;
    const entry = { ...form, id:editing||Date.now(), qty:+form.qty, purchaseValue:+form.purchaseValue||0, currentValue:+form.currentValue||0, minStock:+form.minStock||0 };
    const updated = editing?assets.map(a=>a.id===editing?entry:a):[...assets,entry];
    setAssets(updated); saveLS("vs_assets",updated); setEditing(null); setForm(emptyAsset);
  };
  const delAsset = id => { const u=assets.filter(a=>a.id!==id); setAssets(u); saveLS("vs_assets",u); };

  const saveMove = () => {
    if (!moveForm.date||!moveForm.assetId||!moveForm.qty) return;
    const asset = assets.find(a=>a.id===+moveForm.assetId);
    if (!asset) return;
    const delta = moveForm.type==="Entrée"?+moveForm.qty:-+moveForm.qty;
    const newQty = Math.max(0, asset.qty + delta);
    const updAssets = assets.map(a=>a.id===+moveForm.assetId?{...a,qty:newQty}:a);
    const entry = { ...moveForm, id:Date.now(), assetRef:asset.ref, qty:+moveForm.qty, unit:asset.unit };
    const updMoves = [...stockMoves, entry];
    setAssets(updAssets); saveLS("vs_assets",updAssets);
    setStockMoves(updMoves); saveLS("vs_stock_moves",updMoves);
    setMoveForm(emptyMove);
  };

  // Filtered assets
  const filtered = assets
    .filter(a=>!filterCat||a.category===filterCat)
    .filter(a=>!filterSite||a.site===filterSite)
    .filter(a=>!filterStatus||a.status===filterStatus);

  // Alerts: low stock
  const lowStockAlerts = assets.filter(a=>a.minStock>0&&a.qty<=a.minStock);
  const totalValue = assets.reduce((s,a)=>s+a.currentValue,0);
  const totalPurchase = assets.reduce((s,a)=>s+a.purchaseValue,0);

  // Export
  const exportRows = filtered.map(a=>[a.ref,a.category,a.item,a.brand||"—",a.model||"—",siteLabel(a.site,sitesList),a.qty,a.unit,a.status,a.purchaseDate||"—",(a.purchaseValue||0).toLocaleString(),(a.currentValue||0).toLocaleString(),a.responsible||"—",a.serialNum||"—",a.lastInventory||"—",a.notes||"—"]);

  const statusColor = s => {
    if(s==="Disponible"||s==="En service") return "green";
    if(s==="En maintenance"||s==="Prêté") return "amber";
    return "red";
  };

  const subTabs = [
    {id:"inventory", label:"📦 Inventaire"},
    {id:"stocks",    label:"🔄 Mouvements"},
    {id:"epi",       label:"🦺 EPI"},
    {id:"dashboard", label:"📊 Tableau"},
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
        <StatCard icon="📦" label="Total actifs" value={assets.length} sub="articles" color="#DBEAFE" />
        <StatCard icon="💰" label="Valeur actuelle" value={`${(totalValue/1000000).toFixed(1)}M`} sub="FCFA" color="#D1FAE5" />
        <StatCard icon="📉" label="Dépréciation" value={`${totalPurchase>0?Math.round((1-totalValue/totalPurchase)*100):0}%`} sub="depuis achat" color="#FEF9C3" />
        <StatCard icon="⚠️" label="Stocks bas" value={lowStockAlerts.length} sub="alertes" color={lowStockAlerts.length>0?"#FEE2E2":"#D1FAE5"} />
        <StatCard icon="🚫" label="Hors service" value={assets.filter(a=>["Hors service","Mis au rebut"].includes(a.status)).length} sub="actifs" color="#FEE2E2" />
      </div>

      {/* Alertes stock bas */}
      {lowStockAlerts.length>0&&(
        <Card style={{ border:`2px solid ${C.danger}` }}>
          <h3 style={{ ...sectionTitle, color:C.danger, borderColor:C.danger }}>⚠️ Stocks bas ({lowStockAlerts.length})</h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {lowStockAlerts.map(a=>(
              <div key={a.id} style={{ background:"#FEF2F2", borderRadius:10, padding:"8px 14px", borderLeft:`4px solid ${C.danger}` }}>
                <div style={{ fontFamily:FONT, fontWeight:700, fontSize:13 }}>{a.ref} — {a.item}</div>
                <div style={{ fontFamily:FONT, fontSize:12, color:C.danger }}>Stock : {a.qty} {a.unit} (min : {a.minStock})</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sous-onglets */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", borderBottom:`2px solid ${C.sand}` }}>
        {subTabs.map(t=>(
          <button key={t.id} onClick={()=>setSubTab(t.id)} style={{ background:subTab===t.id?C.green:"transparent", color:subTab===t.id?C.white:C.forest, border:"none", borderRadius:"8px 8px 0 0", padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>{t.label}</button>
        ))}
      </div>

      {/* ── INVENTAIRE ── */}
      {subTab==="inventory" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <ExportBar title="Inventaire Actifs" headers={["Réf","Catégorie","Article","Marque","Modèle","Site","Qté","Unité","Statut","Achat","Val. achat","Val. actuelle","Responsable","N° série","Dernier inv.","Notes"]} rows={exportRows} filename="inventaire_actifs" />
          <Card>
            <h3 style={sectionTitle}>{editing?"✏️ Modifier":"➕ Ajouter un actif"}</h3>
            <div style={{ marginBottom:10, padding:"8px 12px", background:"#EFF6FF", borderRadius:8, fontSize:12, fontFamily:FONT, color:"#1E40AF" }}>
              💡 Pour les pièces jointes (factures, photos) : colle le lien de partage Google Drive ou Dropbox.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
              <Input label="Référence unique" value={form.ref} onChange={v=>setForm({...form,ref:v})} />
              <Input label="Catégorie" value={form.category} onChange={v=>setForm({...form,category:v,item:""})} options={Object.keys(ASSET_CATEGORIES)} />
              <Input label="Article / Type" value={form.item} onChange={v=>setForm({...form,item:v})}
                options={form.category&&ASSET_CATEGORIES[form.category]?ASSET_CATEGORIES[form.category].items:[]} />
              <Input label="Marque" value={form.brand} onChange={v=>setForm({...form,brand:v})} />
              <Input label="Modèle / Référence" value={form.model} onChange={v=>setForm({...form,model:v})} />
              <Input label="Numéro de série" value={form.serialNum} onChange={v=>setForm({...form,serialNum:v})} />
              <Input label="Site" value={form.site} onChange={v=>setForm({...form,site:v})} optObjects={siteOptions(sitesList)} />
              <Input label="Quantité" type="number" value={form.qty} onChange={v=>setForm({...form,qty:v})} />
              <Input label="Unité" value={form.unit} onChange={v=>setForm({...form,unit:v})} options={STOCK_UNITS} />
              <Input label="Stock mini (alerte)" type="number" value={form.minStock} onChange={v=>setForm({...form,minStock:v})} />
              <Input label="Date d'achat" type="date" value={form.purchaseDate} onChange={v=>setForm({...form,purchaseDate:v})} />
              <Input label="Valeur d'achat (FCFA)" type="number" value={form.purchaseValue} onChange={v=>setForm({...form,purchaseValue:v})} />
              <Input label="Valeur actuelle estimée (FCFA)" type="number" value={form.currentValue} onChange={v=>setForm({...form,currentValue:v})} />
              <Input label="Statut" value={form.status} onChange={v=>setForm({...form,status:v})} options={ASSET_STATUSES} />
              <Input label="Responsable / Affecté à" value={form.responsible} onChange={v=>setForm({...form,responsible:v})}
                optObjects={[{value:"",label:"-- Choisir --"},...activeStaff.map(s=>({value:s.name,label:`${s.name} (${s.role})`})),{value:"Autre",label:"Autre"}]} />
              <Input label="Date dernier inventaire" type="date" value={form.lastInventory} onChange={v=>setForm({...form,lastInventory:v})} />
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12, fontWeight:600, color:C.muted, fontFamily:FONT }}>Pièce jointe (facture, photo...)</label>
                <FileUpload folder="actifs" token={token} accept="*" currentUrl={form.docUrl}
                  onUploaded={(url, name) => setForm(f => ({...f, docUrl:url, docName:name||"Document"}))} />
                {form.docUrl && <div style={{ fontSize:11, color:C.green, fontFamily:FONT }}>✅ {form.docName||"Fichier joint"}</div>}
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <Input label="Commentaires" value={form.notes} onChange={v=>setForm({...form,notes:v})} />
              </div>
            </div>
            <div style={{ marginTop:14, display:"flex", gap:10 }}>
              <Btn onClick={saveAsset}>{editing?"Enregistrer":"Ajouter"}</Btn>
              {editing&&<Btn variant="secondary" onClick={()=>{setEditing(null);setForm(emptyAsset);}}>Annuler</Btn>}
            </div>
          </Card>

          {/* Filtres */}
          <Card>
            <div style={{ display:"flex", gap:12, marginBottom:14, flexWrap:"wrap", alignItems:"flex-end" }}>
              <h3 style={{ ...sectionTitle, flex:1, marginBottom:0, borderBottom:"none" }}>📦 Inventaire ({filtered.length} actifs)</h3>
              <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{ ...inputStyle, width:180 }}>
                <option value="">Toutes catégories</option>
                {Object.entries(ASSET_CATEGORIES).map(([cat,v])=><option key={cat} value={cat}>{v.icon} {cat}</option>)}
              </select>
              <select value={filterSite} onChange={e=>setFilterSite(e.target.value)} style={{ ...inputStyle, width:160 }}>
                <option value="">Tous sites</option>
                {sitesList.map(s=><option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
              </select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ ...inputStyle, width:150 }}>
                <option value="">Tous statuts</option>
                {ASSET_STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Groupé par catégorie */}
            {Object.entries(ASSET_CATEGORIES).map(([cat, catDef]) => {
              const catAssets = filtered.filter(a=>a.category===cat);
              if (catAssets.length===0) return null;
              return (
                <div key={cat} style={{ marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, padding:"6px 12px", background:C.sand, borderRadius:8 }}>
                    <span style={{ fontSize:18 }}>{catDef.icon}</span>
                    <span style={{ fontFamily:FONT, fontWeight:700, fontSize:14, color:C.forest }}>{cat}</span>
                    <span style={{ fontFamily:FONT, fontSize:12, color:C.muted }}>({catAssets.length} articles — Valeur : {catAssets.reduce((s,a)=>s+a.currentValue,0).toLocaleString()} FCFA)</span>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead>
                        <tr style={{ background:"#F9FAFB" }}>
                          {["Réf","Article","Marque/Modèle","Site","Qté","Valeur achat","Valeur actuelle","Statut","Responsable","P.J.",""].map(h=>(
                            <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:11, whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {catAssets.map((a,i)=>(
                          <tr key={a.id} style={{ background:i%2===0?C.white:C.cream, borderLeft:a.qty<=a.minStock&&a.minStock>0?`3px solid ${C.danger}`:"3px solid transparent" }}>
                            <td style={{ ...td, fontWeight:700, color:C.forest, fontSize:12 }}>{a.ref}</td>
                            <td style={{ ...td, fontWeight:600 }}>{a.item}</td>
                            <td style={{ ...td, fontSize:11, color:C.muted }}>{[a.brand,a.model].filter(Boolean).join(" ")||"—"}</td>
                            <td style={td}>{siteLabel(a.site,sitesList)}</td>
                            <td style={{ ...td, fontWeight:700, color:a.qty<=a.minStock&&a.minStock>0?C.danger:C.text }}>
                              {a.qty} {a.unit}
                              {a.minStock>0&&<span style={{ fontSize:10, color:C.muted }}> (min:{a.minStock})</span>}
                            </td>
                            <td style={td}>{a.purchaseValue?a.purchaseValue.toLocaleString()+" F":"—"}</td>
                            <td style={{ ...td, fontWeight:600 }}>{a.currentValue?a.currentValue.toLocaleString()+" F":"—"}</td>
                            <td style={td}><Badge color={statusColor(a.status)}>{a.status}</Badge></td>
                            <td style={{ ...td, fontSize:11 }}>{a.responsible||"—"}</td>
                            <td style={td}>
                              {a.docUrl&&<a href={a.docUrl} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.green, fontWeight:600, textDecoration:"none" }}>📎 Voir</a>}
                            </td>
                            <td style={td}>
                              <div style={{ display:"flex", gap:5 }}>
                                <Btn small variant="secondary" onClick={()=>{setForm({...a,qty:String(a.qty),purchaseValue:String(a.purchaseValue),currentValue:String(a.currentValue),minStock:String(a.minStock)});setEditing(a.id);}}>✏️</Btn>
                                <Btn small variant="danger" onClick={()=>delAsset(a.id)}>🗑️</Btn>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* ── MOUVEMENTS STOCK ── */}
      {subTab==="stocks" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card>
            <h3 style={sectionTitle}>🔄 Enregistrer un mouvement de stock</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
              <Input label="Date" type="date" value={moveForm.date} onChange={v=>setMoveForm({...moveForm,date:v})} />
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12, fontWeight:600, color:C.muted, fontFamily:FONT }}>Article</label>
                <select value={moveForm.assetId} onChange={e=>setMoveForm({...moveForm,assetId:e.target.value})} style={inputStyle}>
                  <option value="">-- Choisir --</option>
                  {assets.filter(a=>["Intrants agricoles","Semences & Plants","Emballage","EPI","Petit matériel"].includes(a.category)).map(a=>(
                    <option key={a.id} value={a.id}>{a.ref} — {a.item} ({a.qty} {a.unit})</option>
                  ))}
                </select>
              </div>
              <Input label="Type" value={moveForm.type} onChange={v=>setMoveForm({...moveForm,type:v})} options={["Entrée","Sortie","Retour","Perte","Ajustement"]} />
              <Input label="Quantité" type="number" value={moveForm.qty} onChange={v=>setMoveForm({...moveForm,qty:v})} />
              <Input label="Opérateur" value={moveForm.operator} onChange={v=>setMoveForm({...moveForm,operator:v})}
                optObjects={[{value:"",label:"-- Choisir --"},...activeStaff.map(s=>({value:s.name,label:s.name}))]} />
              <Input label="Motif / Destination" value={moveForm.reason} onChange={v=>setMoveForm({...moveForm,reason:v})} />
              <Input label="Notes" value={moveForm.notes} onChange={v=>setMoveForm({...moveForm,notes:v})} />
            </div>
            {moveForm.assetId && moveForm.qty && (
              <div style={{ marginTop:10, padding:"8px 14px", background:"#EFF6FF", borderRadius:8, fontFamily:FONT, fontSize:13, fontWeight:600, color:"#1E40AF" }}>
                {(() => {
                  const a = assets.find(x=>x.id===+moveForm.assetId);
                  if (!a) return "";
                  const delta = moveForm.type==="Entrée"?+moveForm.qty:-+moveForm.qty;
                  const newQty = Math.max(0, a.qty + delta);
                  return `📦 Stock actuel : ${a.qty} ${a.unit} → Après : ${newQty} ${a.unit}`;
                })()}
              </div>
            )}
            <div style={{ marginTop:14 }}><Btn onClick={saveMove}>Enregistrer le mouvement</Btn></div>
          </Card>

          <Card>
            <h3 style={sectionTitle}>📋 Historique des mouvements ({stockMoves.length})</h3>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.sand }}>
                    {["Date","Référence","Article","Type","Quantité","Opérateur","Motif",""].map(h=>(
                      <th key={h} style={{ padding:"9px 10px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:11, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...stockMoves].sort((a,b)=>b.date.localeCompare(a.date)).map((m,i)=>(
                    <tr key={m.id} style={{ background:i%2===0?C.white:C.cream }}>
                      <td style={td}>{m.date}</td>
                      <td style={{ ...td, fontWeight:700, color:C.forest }}>{m.assetRef}</td>
                      <td style={td}>{assets.find(a=>a.id===+m.assetId)?.item||"—"}</td>
                      <td style={td}><Badge color={m.type==="Entrée"?"green":m.type==="Perte"?"red":"amber"}>{m.type}</Badge></td>
                      <td style={{ ...td, fontWeight:700 }}>{m.type==="Entrée"?"+":"-"}{m.qty} {m.unit}</td>
                      <td style={td}>{m.operator||"—"}</td>
                      <td style={{ ...td, color:C.muted, fontSize:11 }}>{m.reason||"—"}</td>
                      <td style={td}><Btn small variant="danger" onClick={()=>{const u=stockMoves.filter(x=>x.id!==m.id);setStockMoves(u);saveLS("vs_stock_moves",u);}}>🗑️</Btn></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── EPI PAR TRAVAILLEUR ── */}
      {subTab==="epi" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card>
            <h3 style={sectionTitle}>🦺 EPI par travailleur</h3>
            {staff.filter(s=>s.status==="Actif").map(s=>{
              const epiAssets = assets.filter(a=>a.category==="EPI"&&a.responsible===s.name);
              return (
                <div key={s.id} style={{ marginBottom:14, padding:14, background:C.cream, borderRadius:12, borderLeft:`4px solid ${C.sage}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:C.sand, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                      {s.photoUrl?<img src={s.photoUrl} alt="" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover" }} onError={e=>e.target.style.display="none"} />:"👤"}
                    </div>
                    <div>
                      <div style={{ fontFamily:FONT, fontWeight:700, fontSize:14, color:C.forest }}>{s.name}</div>
                      <div style={{ fontFamily:FONT, fontSize:12, color:C.muted }}>{s.role} · {s.site}</div>
                    </div>
                  </div>
                  {epiAssets.length>0?(
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      {epiAssets.map(a=>(
                        <div key={a.id} style={{ background:C.white, borderRadius:8, padding:"6px 12px", fontSize:12, fontFamily:FONT, border:`1px solid ${C.sand}` }}>
                          <span style={{ fontWeight:600 }}>{a.item}</span>
                          <span style={{ color:C.muted }}> — {a.qty} {a.unit}</span>
                          <span style={{ marginLeft:6 }}><Badge color={statusColor(a.status)}>{a.status}</Badge></span>
                        </div>
                      ))}
                    </div>
                  ):(
                    <div style={{ fontFamily:FONT, fontSize:12, color:C.muted, fontStyle:"italic" }}>Aucun EPI assigné. Modifie un actif EPI pour l'assigner à cet employé.</div>
                  )}
                </div>
              );
            })}
          </Card>
          <Card>
            <h3 style={sectionTitle}>🦺 EPI par site</h3>
            {sitesList.map(s=>{
              const siteEpi = assets.filter(a=>a.category==="EPI"&&a.site===s.code);
              if (siteEpi.length===0) return null;
              return (
                <div key={s.code} style={{ marginBottom:12 }}>
                  <div style={{ fontFamily:FONT, fontWeight:700, fontSize:14, color:C.forest, marginBottom:6 }}>{s.code} — {s.name}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {siteEpi.map(a=>(
                      <div key={a.id} style={{ background:C.cream, borderRadius:8, padding:"6px 12px", fontSize:12, fontFamily:FONT }}>
                        <span style={{ fontWeight:600 }}>{a.ref}</span> — {a.item} ({a.qty} {a.unit}) <Badge color={statusColor(a.status)}>{a.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* ── TABLEAU DE BORD ACTIFS ── */}
      {subTab==="dashboard" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          <Card>
            <h3 style={sectionTitle}>💰 Valeur par catégorie</h3>
            {Object.entries(ASSET_CATEGORIES).map(([cat, catDef]) => {
              const catAssets = assets.filter(a=>a.category===cat);
              const val = catAssets.reduce((s,a)=>s+a.currentValue,0);
              if (!val) return null;
              return (
                <div key={cat} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4, fontFamily:FONT }}>
                    <span>{catDef.icon} {cat} <span style={{ color:C.muted }}>({catAssets.length})</span></span>
                    <span style={{ fontWeight:700 }}>{val.toLocaleString()} F</span>
                  </div>
                  <div style={{ height:7, background:C.sand, borderRadius:4 }}>
                    <div style={{ height:7, width:`${totalValue>0?(val/totalValue)*100:0}%`, background:C.sage, borderRadius:4 }} />
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop:12, padding:"10px 14px", background:C.forest, borderRadius:10, display:"flex", justifyContent:"space-between", color:C.white, fontFamily:FONT }}>
              <span style={{ fontWeight:700 }}>Valeur totale</span>
              <span style={{ fontWeight:800 }}>{totalValue.toLocaleString()} FCFA</span>
            </div>
          </Card>

          <Card>
            <h3 style={sectionTitle}>📍 Actifs par site</h3>
            {sitesList.map(s=>{
              const siteAssets = assets.filter(a=>a.site===s.code);
              const siteVal = siteAssets.reduce((sum,a)=>sum+a.currentValue,0);
              return siteAssets.length>0?(
                <div key={s.code} style={{ marginBottom:12, padding:"10px 14px", background:C.cream, borderRadius:10 }}>
                  <div style={{ fontFamily:FONT, fontWeight:700, color:C.forest }}>{s.code} — {s.name}</div>
                  <div style={{ fontFamily:FONT, fontSize:12, color:C.muted, marginTop:4 }}>
                    {siteAssets.length} actifs · Valeur : {siteVal.toLocaleString()} FCFA
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
                    {ASSET_STATUSES.map(st=>{
                      const cnt = siteAssets.filter(a=>a.status===st).length;
                      return cnt>0?<span key={st} style={{ fontSize:10, fontFamily:FONT }}><Badge color={statusColor(st)}>{st}: {cnt}</Badge></span>:null;
                    })}
                  </div>
                </div>
              ):null;
            })}
          </Card>

          <Card>
            <h3 style={sectionTitle}>🔧 État du parc matériel</h3>
            {ASSET_STATUSES.map(st=>{
              const cnt = assets.filter(a=>a.status===st).length;
              const pct = assets.length>0?(cnt/assets.length)*100:0;
              return cnt>0?(
                <div key={st} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3, fontFamily:FONT }}>
                    <span><Badge color={statusColor(st)}>{st}</Badge></span>
                    <span style={{ fontWeight:700 }}>{cnt} actif(s) ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height:6, background:C.sand, borderRadius:3 }}>
                    <div style={{ height:6, width:`${pct}%`, background:st==="Disponible"||st==="En service"?C.sage:st==="Hors service"||st==="Mis au rebut"?C.danger:C.amber, borderRadius:3 }} />
                  </div>
                </div>
              ):null;
            })}
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── MODULE : Sites ───────────────────────────────────────────────────────────
function SitesModule({ sitesList, setSitesList }) {
  const emptyForm = { code:"", name:"", latDec:"", lngDec:"", notes:"" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [gpsMode, setGpsMode] = useState("decimal");
  const [dmsLat, setDmsLat] = useState(""); const [dmsLng, setDmsLng] = useState("");

  const convertDMS = () => {
    const lat = dmsToDec(dmsLat); const lng = dmsToDec(dmsLng);
    if (lat!==null&&lng!==null) { setForm(f=>({...f,latDec:String(lat),lngDec:String(lng)})); }
    else alert("Format DMS invalide. Exemple: 3 50 52.9 N");
  };

  const save = () => {
    if (!form.code||!form.name) return;
    const entry = { ...form, latDec:parseFloat(form.latDec)||0, lngDec:parseFloat(form.lngDec)||0 };
    setSitesList(editing?sitesList.map(s=>s.code===editing?entry:s):[...sitesList,entry]);
    setEditing(null); setForm(emptyForm); setDmsLat(""); setDmsLng("");
  };

  const exportRows = sitesList.map(s=>[s.code,s.name,s.latDec,s.lngDec,formatDMS(s.latDec,s.lngDec),s.notes]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <ExportBar title="Sites" headers={["Code","Nom","Latitude","Longitude","GPS DMS","Notes"]} rows={exportRows} filename="sites" />
      <Card>
        <h3 style={sectionTitle}>{editing?"✏️ Modifier":"➕ Ajouter un site"}</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
          <Input label="Code (ex: Site D)" value={form.code} onChange={v=>setForm({...form,code:v})} />
          <Input label="Nom du site" value={form.name} onChange={v=>setForm({...form,name:v})} />
          <Input label="Notes" value={form.notes} onChange={v=>setForm({...form,notes:v})} />
        </div>
        <div style={{ marginTop:14 }}>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:600, color:C.forest, alignSelf:"center", fontFamily:FONT }}>📍 GPS :</span>
            {["decimal","dms"].map(m=>(
              <button key={m} onClick={()=>setGpsMode(m)} style={{ background:gpsMode===m?C.green:C.sand, color:gpsMode===m?C.white:C.forest, border:"none", borderRadius:7, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>{m==="decimal"?"Décimal":"DMS"}</button>
            ))}
          </div>
          {gpsMode==="decimal"?(
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Latitude (ex: 3.848033)" value={form.latDec} onChange={v=>setForm({...form,latDec:v})} />
              <Input label="Longitude (ex: 11.502075)" value={form.lngDec} onChange={v=>setForm({...form,lngDec:v})} />
            </div>
          ):(
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:12, alignItems:"flex-end" }}>
              <Input label="Latitude DMS (ex: 3 50 52.9 N)" value={dmsLat} onChange={setDmsLat} />
              <Input label="Longitude DMS (ex: 11 30 7.5 E)" value={dmsLng} onChange={setDmsLng} />
              <Btn onClick={convertDMS} variant="secondary">Convertir</Btn>
            </div>
          )}
          {form.latDec&&form.lngDec&&(
            <div style={{ marginTop:8, padding:"7px 12px", background:"#EFF6FF", borderRadius:8, fontSize:12, fontFamily:FONT }}>
              Décimal : {formatGPS(+form.latDec,+form.lngDec)} &nbsp;|&nbsp; DMS : {formatDMS(+form.latDec,+form.lngDec)}
            </div>
          )}
        </div>
        <div style={{ marginTop:14, display:"flex", gap:10 }}>
          <Btn onClick={save}>{editing?"Enregistrer":"Ajouter"}</Btn>
          {editing&&<Btn variant="secondary" onClick={()=>{setEditing(null);setForm(emptyForm);}}>Annuler</Btn>}
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
        {sitesList.map(s=>(
          <div key={s.code} style={{ background:C.white, borderRadius:14, padding:16, borderLeft:`5px solid ${C.sage}`, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontWeight:800, fontSize:16, color:C.forest, fontFamily:FONT }}>{s.code}</div>
                <div style={{ fontWeight:600, fontSize:14, color:C.text, fontFamily:FONT }}>{s.name}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Btn small variant="secondary" onClick={()=>{setForm({...s,latDec:String(s.latDec),lngDec:String(s.lngDec)});setEditing(s.code);}}>✏️</Btn>
                <Btn small variant="danger" onClick={()=>setSitesList(sitesList.filter(x=>x.code!==s.code))}>🗑️</Btn>
              </div>
            </div>
            {s.latDec&&s.lngDec&&(
              <div style={{ marginTop:10, fontSize:12, lineHeight:1.8, fontFamily:FONT }}>
                <div>📐 Décimal : {formatGPS(s.latDec,s.lngDec)}</div>
                <div>🧭 DMS : {formatDMS(s.latDec,s.lngDec)}</div>
                <a href={`https://maps.google.com/?q=${s.latDec},${s.lngDec}`} target="_blank" rel="noreferrer" style={{ color:C.green, fontWeight:600, textDecoration:"none" }}>🗺️ Google Maps →</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODULE : Arbres Sélectionnés ────────────────────────────────────────────
function SelectedTreesModule({ selectedTrees, setSelectedTrees, sitesList, species }) {
  const emptyForm = { ref:"", site:"", species:"", variety:"", year:"", latDec:"", lngDec:"", reason:"", notes:"", status:"Actif" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [gpsMode, setGpsMode] = useState("decimal");
  const [dmsLat, setDmsLat] = useState(""); const [dmsLng, setDmsLng] = useState("");
  const [filterSite, setFilterSite] = useState(""); const [filterSpecies, setFilterSpecies] = useState("");

  const currentSpecies = species.find(s=>s.name===form.species);
  const varietyOptions = currentSpecies?currentSpecies.varieties:[];

  const convertDMS = () => {
    const lat = dmsToDec(dmsLat); const lng = dmsToDec(dmsLng);
    if (lat!==null&&lng!==null) setForm(f=>({...f,latDec:String(lat),lngDec:String(lng)}));
    else alert("Format DMS invalide");
  };

  const save = () => {
    if (!form.ref||!form.site||!form.species) return;
    const entry = { ...form, id:editing||Date.now(), latDec:parseFloat(form.latDec)||0, lngDec:parseFloat(form.lngDec)||0, year:+form.year };
    setSelectedTrees(editing?selectedTrees.map(t=>t.id===editing?entry:t):[...selectedTrees,entry]);
    setEditing(null); setForm(emptyForm); setDmsLat(""); setDmsLng("");
  };

  const filtered = selectedTrees
    .filter(t=>!filterSite||t.site===filterSite)
    .filter(t=>!filterSpecies||t.species===filterSpecies);

  const exportRows = filtered.map(t=>[t.ref,t.site,t.species,t.variety,t.year,t.latDec,t.lngDec,formatDMS(t.latDec,t.lngDec),t.reason,t.status,t.notes]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <ExportBar title="Arbres Sélectionnés" headers={["Réf","Site","Espèce","Variété","Année","Lat","Lng","GPS DMS","Motif","Statut","Notes"]} rows={exportRows} filename="arbres_selectionnes" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
        <StatCard icon="⭐" label="Pieds référencés" value={selectedTrees.length} sub="total" color="#FEF9C3" />
        <StatCard icon="📍" label="Géolocalisés" value={selectedTrees.filter(t=>t.latDec&&t.lngDec).length} color="#DBEAFE" />
        {species.slice(0,3).map(sp=>(
          <StatCard key={sp.id} icon={sp.emoji} label={sp.name} value={selectedTrees.filter(t=>t.species===sp.name).length} sub="pieds" color="#D1FAE5" />
        ))}
      </div>
      <Card>
        <h3 style={sectionTitle}>{editing?"✏️ Modifier":"⭐ Référencer un arbre"}</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
          <Input label="Référence (ex: ARB-A-004)" value={form.ref} onChange={v=>setForm({...form,ref:v})} />
          <Input label="Site" value={form.site} onChange={v=>setForm({...form,site:v})} optObjects={siteOptions(sitesList)} />
          <Input label="Espèce" value={form.species} onChange={v=>setForm({...form,species:v,variety:""})} options={species.map(s=>s.name)} />
          <Input label="Variété" value={form.variety} onChange={v=>setForm({...form,variety:v})} options={varietyOptions} />
          <Input label="Année plantation" type="number" value={form.year} onChange={v=>setForm({...form,year:v})} />
          <Input label="Motif de suivi (libre)" value={form.reason} onChange={v=>setForm({...form,reason:v})} />
          <Input label="Statut" value={form.status} onChange={v=>setForm({...form,status:v})} options={["Actif","En observation","Décédé","Retiré"]} />
          <div style={{ gridColumn:"1/-1" }}>
            <Input label="Notes / Observations" value={form.notes} onChange={v=>setForm({...form,notes:v})} />
          </div>
        </div>
        <div style={{ marginTop:14 }}>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:600, color:C.forest, alignSelf:"center", fontFamily:FONT }}>📍 GPS :</span>
            {["decimal","dms"].map(m=>(
              <button key={m} onClick={()=>setGpsMode(m)} style={{ background:gpsMode===m?C.green:C.sand, color:gpsMode===m?C.white:C.forest, border:"none", borderRadius:7, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>{m==="decimal"?"Décimal":"DMS"}</button>
            ))}
          </div>
          {gpsMode==="decimal"?(
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Latitude décimale" value={form.latDec} onChange={v=>setForm({...form,latDec:v})} />
              <Input label="Longitude décimale" value={form.lngDec} onChange={v=>setForm({...form,lngDec:v})} />
            </div>
          ):(
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:12, alignItems:"flex-end" }}>
              <Input label="Latitude DMS (ex: 3 50 52.9 N)" value={dmsLat} onChange={setDmsLat} />
              <Input label="Longitude DMS (ex: 11 30 7.5 E)" value={dmsLng} onChange={setDmsLng} />
              <Btn onClick={convertDMS} variant="secondary">Convertir</Btn>
            </div>
          )}
          {form.latDec&&form.lngDec&&(
            <div style={{ marginTop:8, padding:"7px 12px", background:"#EFF6FF", borderRadius:8, fontSize:12, fontFamily:FONT }}>
              Décimal : {formatGPS(+form.latDec,+form.lngDec)} | DMS : {formatDMS(+form.latDec,+form.lngDec)}
            </div>
          )}
        </div>
        <div style={{ marginTop:14, display:"flex", gap:10 }}>
          <Btn onClick={save}>{editing?"Enregistrer":"Référencer"}</Btn>
          {editing&&<Btn variant="secondary" onClick={()=>{setEditing(null);setForm(emptyForm);}}>Annuler</Btn>}
        </div>
      </Card>
      <Card>
        <div style={{ display:"flex", gap:12, marginBottom:14, flexWrap:"wrap", alignItems:"flex-end" }}>
          <h3 style={{ ...sectionTitle, flex:1, marginBottom:0, borderBottom:"none" }}>⭐ Registre ({filtered.length})</h3>
          <select value={filterSite} onChange={e=>setFilterSite(e.target.value)} style={{ ...inputStyle, width:130 }}>
            <option value="">Tous sites</option>
            {sitesList.map(s=><option key={s.code} value={s.code}>{s.code}</option>)}
          </select>
          <select value={filterSpecies} onChange={e=>setFilterSpecies(e.target.value)} style={{ ...inputStyle, width:140 }}>
            <option value="">Toutes espèces</option>
            {species.map(s=><option key={s.id} value={s.name}>{s.emoji} {s.name}</option>)}
          </select>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:C.sand }}>
                {["Réf","Site","Espèce","Variété","Année","GPS Décimal","GPS DMS","Motif","Statut",""].map(h=>(
                  <th key={h} style={{ padding:"9px 10px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:11, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t,i)=>{
                const sp = species.find(s=>s.name===t.species);
                return (
                  <tr key={t.id} style={{ background:i%2===0?C.white:C.cream }}>
                    <td style={{ ...td, fontWeight:800, color:C.forest, fontSize:12 }}>{t.ref}</td>
                    <td style={td}>{t.site}</td>
                    <td style={td}>{sp?`${sp.emoji} ${t.species}`:t.species}</td>
                    <td style={td}><Badge color="green">{t.variety}</Badge></td>
                    <td style={td}>{t.year}</td>
                    <td style={{ ...td, fontSize:11, fontFamily:"monospace" }}>{formatGPS(t.latDec,t.lngDec)}</td>
                    <td style={{ ...td, fontSize:11 }}>{formatDMS(t.latDec,t.lngDec)}</td>
                    <td style={{ ...td, fontSize:11 }}>{t.reason}</td>
                    <td style={td}><Badge color={t.status==="Actif"?"green":"amber"}>{t.status}</Badge></td>
                    <td style={td}>
                      <div style={{ display:"flex", gap:4 }}>
                        {t.latDec&&t.lngDec&&<a href={`https://maps.google.com/?q=${t.latDec},${t.lngDec}`} target="_blank" rel="noreferrer" style={{ fontSize:16, textDecoration:"none" }}>🗺️</a>}
                        <Btn small variant="secondary" onClick={()=>{setForm({...t,latDec:String(t.latDec),lngDec:String(t.lngDec),year:String(t.year)});setEditing(t.id);}}>✏️</Btn>
                        <Btn small variant="danger" onClick={()=>setSelectedTrees(selectedTrees.filter(x=>x.id!==t.id))}>🗑️</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE : Compte d'Exploitation ─────────────────────────────────────────
function PnLModule({ sales, harvests, staff, tempWork, charges }) {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [viewMode, setViewMode] = useState("annuel");
  const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

  const fy = arr => arr.filter(x=>x.date&&x.date.startsWith(year));
  const ySales=fy(sales); const yHarvests=fy(harvests); const yTemp=fy(tempWork); const yCharges=fy(charges);

  const revenuVentes   = ySales.reduce((s,v)=>s+v.qty*v.price,0);
  const totalRecolte   = yHarvests.reduce((s,h)=>s+h.qty,0);
  const totalVenduKg   = ySales.reduce((s,v)=>s+v.qty,0);
  const prixMoyen      = ySales.length>0?ySales.reduce((s,v)=>s+v.price,0)/ySales.length:0;
  const stockNonVendu  = Math.max(0,totalRecolte-totalVenduKg);
  const valorisationStock = Math.round(stockNonVendu*prixMoyen);
  const totalProduits  = revenuVentes+valorisationStock;

  const masseSal    = staff.filter(s=>s.status==="Actif").reduce((s,e)=>s+e.salary,0)*12;
  const cMOTemp     = yTemp.reduce((s,t)=>s+t.total,0);
  const cIntrants   = yCharges.filter(c=>c.category==="Intrants agricoles").reduce((s,c)=>s+c.amount,0);
  const cCarbu      = yCharges.filter(c=>c.category==="Carburant & transport").reduce((s,c)=>s+c.amount,0);
  const cMat        = yCharges.filter(c=>c.category==="Matériel & équipements").reduce((s,c)=>s+c.amount,0);
  const cEmb        = yCharges.filter(c=>c.category==="Emballage & stockage").reduce((s,c)=>s+c.amount,0);
  const cIrrig      = yCharges.filter(c=>c.category==="Irrigation & eau").reduce((s,c)=>s+c.amount,0);
  const cEnt        = yCharges.filter(c=>c.category==="Entretien & réparations").reduce((s,c)=>s+c.amount,0);
  const cTaxes      = yCharges.filter(c=>["Impôts & taxes","Certification & normes"].includes(c.category)).reduce((s,c)=>s+c.amount,0);
  const cDivers     = yCharges.filter(c=>["Communication & divers","Frais santé végétale","Amortissements"].includes(c.category)).reduce((s,c)=>s+c.amount,0);
  const totalCharges= masseSal+cMOTemp+cIntrants+cCarbu+cMat+cEmb+cIrrig+cEnt+cTaxes+cDivers;

  const MBA = totalProduits-cIntrants-cMOTemp-cCarbu-cEmb;
  const EBE = totalProduits-totalCharges+cDivers;
  const resultatNet = totalProduits-totalCharges;
  const margeNette = totalProduits>0?((resultatNet/totalProduits)*100).toFixed(1):0;
  const coutParKg = totalRecolte>0?Math.round(totalCharges/totalRecolte):0;
  const prixRevient = totalVenduKg>0?Math.round(totalCharges/totalVenduKg):0;

  const monthlyData = MONTHS.map((m,idx)=>{
    const k=`${year}-${String(idx+1).padStart(2,"0")}`;
    const rev=sales.filter(v=>v.date&&v.date.startsWith(k)).reduce((s,v)=>s+v.qty*v.price,0);
    const chg=charges.filter(c=>c.date&&c.date.startsWith(k)).reduce((s,c)=>s+c.amount,0);
    const tmp=tempWork.filter(t=>t.date&&t.date.startsWith(k)).reduce((s,t)=>s+t.total,0);
    const sal=staff.filter(s=>s.status==="Actif").reduce((s,e)=>s+e.salary,0);
    return { m, rev, cout:chg+tmp+sal, result:rev-chg-tmp-sal };
  });
  const maxM = Math.max(...monthlyData.map(d=>Math.max(d.rev,d.cout)),1);
  const rc = resultatNet>=0?"#065F46":"#DC2626";
  const rb = resultatNet>=0?"#D1FAE5":"#FEE2E2";

  const Row = ({ label, amount, indent, bold, highlight, separator, positive }) => (
    separator
      ? <tr><td colSpan={3} style={{ padding:"3px 0" }}><div style={{ borderTop:`1px solid ${C.sand}` }}/></td></tr>
      : <tr style={{ background:highlight?rb:"transparent" }}>
          <td style={{ padding:"7px 12px", fontSize:indent?12:13, paddingLeft:indent?28:12, color:indent?C.muted:C.text, fontWeight:bold?800:400, fontFamily:FONT }}>{label}</td>
          <td style={{ padding:"7px 12px", textAlign:"right", fontSize:13, fontWeight:bold?800:600, fontFamily:FONT, color:highlight?rc:positive?"#065F46":C.text }}>
            {amount!==undefined?`${amount<0?"− ":""}${Math.abs(amount).toLocaleString()} FCFA`:""}
          </td>
          <td style={{ padding:"7px 12px", textAlign:"right", fontSize:11, color:C.muted, fontFamily:FONT }}>
            {amount!==undefined&&totalProduits>0?`${((Math.abs(amount)/totalProduits)*100).toFixed(1)}%`:""}
          </td>
        </tr>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <Card style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: FONT }}>Exercice</label>
          <select value={year} onChange={e=>setYear(e.target.value)} style={{ ...inputStyle, width:100 }}>
            {["2022","2023","2024","2025","2026"].map(y=><option key={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[{id:"annuel",label:"📄 Annuel"},{id:"mensuel",label:"📅 Mensuel"}].map(v=>(
            <button key={v.id} onClick={()=>setViewMode(v.id)} style={{ background:viewMode===v.id?C.green:C.sand, color:viewMode===v.id?C.white:C.forest, border:"none", borderRadius:8, padding:"8px 16px", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:FONT }}>{v.label}</button>
          ))}
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:10, flexWrap:"wrap" }}>
          <button onClick={()=>exportPDF(`Compte d'Exploitation ${year}`,
            ["Libellé","Montant (FCFA)","%CA"],
            [["TOTAL PRODUITS",totalProduits,"100%"],["Ventes",revenuVentes,""],["Stock valorisé",valorisationStock,""],
             ["TOTAL CHARGES",totalCharges,""],["Salaires",masseSal,""],["MO temp.",cMOTemp,""],["Intrants",cIntrants,""],
             ["Carburant",cCarbu,""],["Irrigation",cIrrig,""],["Emballage",cEmb,""],["Entretien",cEnt,""],
             ["Matériel",cMat,""],["Taxes",cTaxes,""],["Divers",cDivers,""],
             ["MBA",MBA,""],["EBE",EBE,""],
             [resultatNet>=0?"BÉNÉFICE NET":"DÉFICIT NET",resultatNet,margeNette+"%"]],
            [{label:"Exercice",val:year},{label:"CA",val:totalProduits.toLocaleString()+" FCFA"},
             {label:"Résultat",val:(resultatNet>=0?"+":"")+resultatNet.toLocaleString()+" FCFA"},{label:"Marge",val:margeNette+"%"}]
          )} style={{ background:C.danger, color:C.white, border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>📄 Export PDF</button>
          <button onClick={()=>exportCSV("compte_exploitation_"+year,["Libellé","Montant","% CA"],
            [["TOTAL PRODUITS",totalProduits,"100%"],["Ventes",revenuVentes,""],["TOTAL CHARGES",totalCharges,""],
             ["Salaires",masseSal,""],["MO temp.",cMOTemp,""],["Intrants",cIntrants,""],
             [resultatNet>=0?"BÉNÉFICE":"DÉFICIT",resultatNet,margeNette+"%"]]
          )} style={{ background:C.forest, color:C.white, border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>📊 Export CSV</button>
          {[{label:"Chiffre d'affaires",val:`${(totalProduits/1000).toFixed(0)}K FCFA`,bg:"#DBEAFE"},
            {label:"Résultat net",val:`${resultatNet>=0?"+":"−"}${(Math.abs(resultatNet)/1000).toFixed(0)}K`,bg:rb},
            {label:"Marge nette",val:`${margeNette}%`,bg:rb},
            {label:"Coût/kg",val:`${coutParKg} F`,bg:"#F3F4F6"},
          ].map(k=>(
            <div key={k.label} style={{ background:k.bg, borderRadius:10, padding:"7px 12px", textAlign:"center" }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.forest, fontFamily:FONT }}>{k.val}</div>
              <div style={{ fontSize:10, color:C.muted, fontFamily:FONT }}>{k.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {viewMode==="annuel"&&(
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:16 }}>
          <Card style={{ gridColumn:"1/-1" }}>
            <h3 style={sectionTitle}>📄 Compte d'Exploitation — Exercice {year}</h3>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.forest }}>
                    <th style={{ padding:"10px 12px", textAlign:"left", color:C.white, fontWeight:700, fontSize:12, fontFamily:FONT }}>Libellé</th>
                    <th style={{ padding:"10px 12px", textAlign:"right", color:C.white, fontWeight:700, fontSize:12, fontFamily:FONT }}>Montant (FCFA)</th>
                    <th style={{ padding:"10px 12px", textAlign:"right", color:C.mint, fontWeight:700, fontSize:12, fontFamily:FONT }}>% CA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background:"#EFF6FF" }}><td colSpan={3} style={{ padding:"8px 12px", fontWeight:700, fontSize:13, color:"#1D4ED8", fontFamily:FONT }}>▶ PRODUITS D'EXPLOITATION</td></tr>
                  <Row label="Ventes de fruits" amount={revenuVentes} indent />
                  <Row label={`Valorisation stock (${stockNonVendu} kg × ${Math.round(prixMoyen)} F/kg)`} amount={valorisationStock} indent />
                  <Row label="TOTAL PRODUITS" amount={totalProduits} bold positive />
                  <Row separator />
                  <tr style={{ background:"#FFF7ED" }}><td colSpan={3} style={{ padding:"8px 12px", fontWeight:700, fontSize:13, color:"#C2410C", fontFamily:FONT }}>▶ CHARGES D'EXPLOITATION</td></tr>
                  <tr style={{ background:"#F9FAFB" }}><td colSpan={3} style={{ padding:"5px 12px 2px", fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", fontFamily:FONT }}>Personnel</td></tr>
                  <Row label={`Salaires (${staff.filter(s=>s.status==="Actif").length} permanents × 12 mois)`} amount={masseSal} indent />
                  <Row label="Main d'œuvre temporaire" amount={cMOTemp} indent />
                  <Row separator />
                  <tr style={{ background:"#F9FAFB" }}><td colSpan={3} style={{ padding:"5px 12px 2px", fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", fontFamily:FONT }}>Charges opérationnelles</td></tr>
                  <Row label="Intrants agricoles" amount={cIntrants} indent />
                  <Row label="Carburant & transport" amount={cCarbu} indent />
                  <Row label="Irrigation & eau" amount={cIrrig} indent />
                  <Row label="Emballage & stockage" amount={cEmb} indent />
                  <Row label="Entretien & réparations" amount={cEnt} indent />
                  <Row label="Matériel & équipements" amount={cMat} indent />
                  <Row separator />
                  <tr style={{ background:"#F9FAFB" }}><td colSpan={3} style={{ padding:"5px 12px 2px", fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", fontFamily:FONT }}>Charges de structure</td></tr>
                  <Row label="Impôts, taxes & certifications" amount={cTaxes} indent />
                  <Row label="Communication, amortissements & divers" amount={cDivers} indent />
                  <Row separator />
                  <Row label="TOTAL CHARGES" amount={totalCharges} bold />
                  <Row separator />
                  <tr style={{ background:"#F0FDF4" }}><td colSpan={3} style={{ padding:"8px 12px", fontWeight:700, fontSize:13, color:"#166534", fontFamily:FONT }}>▶ SOLDES INTERMÉDIAIRES</td></tr>
                  <tr style={{ background:"#F0FDF4" }}>
                    <td style={{ padding:"7px 12px", fontSize:12, color:C.muted, fontStyle:"italic", fontFamily:FONT }}>Marge Brute Agricole</td>
                    <td style={{ padding:"7px 12px", textAlign:"right", fontWeight:700, color:MBA>=0?"#065F46":"#DC2626", fontFamily:FONT }}>{MBA.toLocaleString()} FCFA</td>
                    <td style={{ padding:"7px 12px", textAlign:"right", fontSize:11, color:C.muted, fontFamily:FONT }}>{totalProduits>0?`${(MBA/totalProduits*100).toFixed(1)}%`:""}</td>
                  </tr>
                  <tr style={{ background:"#F0FDF4" }}>
                    <td style={{ padding:"4px 12px 8px", fontSize:12, color:C.muted, fontStyle:"italic", fontFamily:FONT }}>Excédent Brut d'Exploitation</td>
                    <td style={{ padding:"4px 12px", textAlign:"right", fontWeight:700, color:EBE>=0?"#065F46":"#DC2626", fontFamily:FONT }}>{EBE.toLocaleString()} FCFA</td>
                    <td style={{ padding:"4px 12px", textAlign:"right", fontSize:11, color:C.muted, fontFamily:FONT }}>{totalProduits>0?`${(EBE/totalProduits*100).toFixed(1)}%`:""}</td>
                  </tr>
                  <Row separator />
                  <Row label={`RÉSULTAT NET ${year}  ${resultatNet>=0?"✅ BÉNÉFICE":"⚠️ DÉFICIT"}`} amount={resultatNet} bold highlight />
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h3 style={sectionTitle}>📊 Indicateurs clés</h3>
            {[
              {label:"Chiffre d'affaires",val:`${totalProduits.toLocaleString()} FCFA`,ok:true,icon:"💰"},
              {label:"Résultat net",val:`${resultatNet>=0?"+":""}${resultatNet.toLocaleString()} FCFA`,ok:resultatNet>=0,icon:resultatNet>=0?"✅":"⚠️"},
              {label:"Taux de marge nette",val:`${margeNette}%`,ok:+margeNette>=15,icon:"📈"},
              {label:"Total récolté",val:`${totalRecolte.toLocaleString()} kg`,ok:true,icon:"🧺"},
              {label:"Quantité vendue",val:`${totalVenduKg.toLocaleString()} kg`,ok:true,icon:"📦"},
              {label:"Prix moyen de vente",val:`${Math.round(prixMoyen).toLocaleString()} FCFA/kg`,ok:true,icon:"🏷️"},
              {label:"Coût de revient/kg",val:`${prixRevient.toLocaleString()} FCFA/kg`,ok:prixRevient<prixMoyen,icon:"⚙️"},
              {label:"Marge/kg vendu",val:`${(Math.round(prixMoyen)-prixRevient).toLocaleString()} FCFA/kg`,ok:prixMoyen>prixRevient,icon:"💹"},
            ].map(k=>(
              <div key={k.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${C.sand}` }}>
                <span style={{ fontSize:12, fontFamily:FONT }}>{k.icon} {k.label}</span>
                <span style={{ fontWeight:700, fontSize:12, color:k.ok?C.forest:"#DC2626", fontFamily:FONT }}>{k.val}</span>
              </div>
            ))}
          </Card>

          <Card>
            <h3 style={sectionTitle}>🥧 Structure des charges</h3>
            {[
              {label:"Personnel permanent",amount:masseSal,color:"#3B82F6"},
              {label:"MO temporaire",amount:cMOTemp,color:C.amber},
              {label:"Intrants agricoles",amount:cIntrants,color:"#10B981"},
              {label:"Transport",amount:cCarbu,color:"#6B7280"},
              {label:"Matériel",amount:cMat,color:"#8B5CF6"},
              {label:"Emballage",amount:cEmb,color:"#EC4899"},
              {label:"Irrigation",amount:cIrrig,color:"#06B6D4"},
              {label:"Entretien",amount:cEnt,color:C.ocre},
              {label:"Taxes & divers",amount:cTaxes+cDivers,color:"#9CA3AF"},
            ].filter(x=>x.amount>0).map(x=>{
              const pct=totalCharges>0?(x.amount/totalCharges*100):0;
              return (
                <div key={x.label} style={{ marginBottom:9 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3, fontFamily:FONT }}>
                    <span>{x.label}</span>
                    <span style={{ fontWeight:700 }}>{x.amount.toLocaleString()} F ({pct.toFixed(1)}%)</span>
                  </div>
                  <div style={{ height:6, background:C.sand, borderRadius:3 }}>
                    <div style={{ height:6, width:`${pct}%`, background:x.color, borderRadius:3 }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {viewMode==="mensuel"&&(
        <Card>
          <h3 style={sectionTitle}>📅 Évolution mensuelle {year}</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(12,1fr)", gap:4, textAlign:"center", fontSize:11, fontWeight:600, color:C.muted, fontFamily:FONT }}>
              {MONTHS.map(m=><div key={m}>{m}</div>)}
            </div>
            {[{label:"💰 Revenus",key:"rev",color:"#3B82F6"},{label:"📋 Charges",key:"cout",color:C.ocre}].map(row=>(
              <div key={row.key}>
                <div style={{ fontSize:12, fontWeight:600, color:row.color, margin:"6px 0 3px", fontFamily:FONT }}>{row.label}</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(12,1fr)", gap:4, alignItems:"flex-end", height:55 }}>
                  {monthlyData.map(d=>(
                    <div key={d.m} title={`${d.m}: ${d[row.key].toLocaleString()} F`} style={{ height:`${Math.max((d[row.key]/maxM)*100,d[row.key]>0?5:0)}%`, background:row.color, borderRadius:"3px 3px 0 0" }} />
                  ))}
                </div>
              </div>
            ))}
            <div style={{ fontSize:12, fontWeight:600, color:C.forest, margin:"12px 0 6px", fontFamily:FONT }}>📊 Résultat mensuel</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(12,1fr)", gap:4 }}>
              {monthlyData.map(d=>(
                <div key={d.m} style={{ textAlign:"center", padding:"3px 2px", borderRadius:5, fontSize:10, fontWeight:700, fontFamily:FONT, background:d.result>=0?"#D1FAE5":"#FEE2E2", color:d.result>=0?"#065F46":"#DC2626" }}>
                  {d.result>=0?"+":"−"}{Math.abs(d.result/1000).toFixed(0)}K
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(12,1fr)", gap:4, textAlign:"center", fontSize:11, color:C.muted, fontFamily:FONT }}>
              {MONTHS.map(m=><div key={m}>{m}</div>)}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── LocalStorage ─────────────────────────────────────────────────────────────
// ─── Supabase ─────────────────────────────────────────────────────────────────

// ─── Supabase Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ftlkhqwtlrxyolfwhdyq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bGtocXd0bHJ4eW9sZndoZHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjUwMTgsImV4cCI6MjA5NTQ0MTAxOH0.KUpVjPE9HhHjWwFfj0p-jsdFQgIKXxi_G3X9YathOaQ";

// ─── Auth API ─────────────────────────────────────────────────────────────────
const Auth = {
  signIn: async (email, password) => {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || "Erreur de connexion");
    return data; // { access_token, refresh_token, user }
  },

  signOut: async (token) => {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` },
    });
  },

  getUser: async (token) => {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  },

  inviteUser: async (email, token) => {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/invite`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Erreur invitation");
    return res.json();
  },

  resetPassword: async (email) => {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.ok;
  },
};

// ─── Storage API ──────────────────────────────────────────────────────────────
const BUCKET = "vegesoft-docs";

const Storage = {
  upload: async (file, path, token) => {
    const formData = new FormData();
    formData.append("", file);
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Upload échoué: ${err}`);
    }
    return `${SUPABASE_URL}/storage/v1/object/authenticated/${BUCKET}/${path}`;
  },

  getUrl: (path, token) =>
    `${SUPABASE_URL}/storage/v1/object/authenticated/${BUCKET}/${path}`,

  list: async (prefix, token) => {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prefix, limit: 100 }),
    });
    return res.ok ? res.json() : [];
  },

  delete: async (paths, token) => {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
      method: "DELETE",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prefixes: paths }),
    });
  },
};

// ─── Composant FileUpload ─────────────────────────────────────────────────────
function FileUpload({ label, folder, token, onUploaded, accept = "*", currentUrl, small }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { setError("Fichier trop grand (max 20 Mo)"); return; }
    setUploading(true); setError("");
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2,6)}.${ext}`;
      const url = await Storage.upload(file, path, token);
      onUploaded(url, file.name);
    } catch (err) {
      setError("Erreur upload: " + err.message);
    }
    setUploading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: FONT }}>{label}</label>}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            background: uploading ? C.sand : C.ocre, color: C.white, border: "none",
            borderRadius: 8, padding: small ? "6px 12px" : "8px 16px",
            fontSize: small ? 11 : 12, fontWeight: 600, cursor: uploading ? "default" : "pointer",
            fontFamily: FONT, display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {uploading ? "⏳ Envoi..." : "📎 Choisir un fichier"}
        </button>
        {currentUrl && (
          <a href={currentUrl} target="_blank" rel="noreferrer"
            style={{ fontSize: 12, color: C.green, fontWeight: 600, textDecoration: "none", fontFamily: FONT }}>
            👁️ Voir le fichier
          </a>
        )}
        <input ref={inputRef} type="file" accept={accept} onChange={handle} style={{ display: "none" }} />
      </div>
      {error && <div style={{ fontSize: 11, color: C.danger, fontFamily: FONT }}>{error}</div>}
    </div>
  );
}

// ─── Composant DocumentsList ──────────────────────────────────────────────────
function DocumentsList({ docs, onDelete }) {
  if (!docs || docs.length === 0) return (
    <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted, fontStyle: "italic" }}>Aucun document joint</div>
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {docs.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: C.cream, border: `1px solid ${C.sand}`, borderRadius: 8, padding: "5px 10px" }}>
          <span style={{ fontSize: 16 }}>
            {d.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "🖼️" : d.name?.match(/\.pdf$/i) ? "📄" : "📎"}
          </span>
          <a href={d.url} target="_blank" rel="noreferrer"
            style={{ fontSize: 12, color: C.forest, fontWeight: 600, textDecoration: "none", fontFamily: FONT, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {d.name || "Document"}
          </a>
          {onDelete && (
            <button onClick={() => onDelete(i)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page de Connexion ────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Email et mot de passe requis"); return; }
    setLoading(true); setError("");
    try {
      const data = await Auth.signIn(email, password);
      localStorage.setItem("vs_token", data.access_token);
      localStorage.setItem("vs_refresh", data.refresh_token);
      localStorage.setItem("vs_user", JSON.stringify(data.user));
      onLogin(data.access_token, data.user);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!email) { setError("Entrez votre email"); return; }
    setLoading(true);
    const ok = await Auth.resetPassword(email);
    setLoading(false);
    if (ok) setResetSent(true);
    else setError("Erreur lors de l'envoi");
  };

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, ${C.forest} 0%, ${C.green} 50%, ${C.ocre} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      fontFamily: FONT,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ background: C.white, borderRadius: 20, padding: 40, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌿</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.forest, letterSpacing: -1 }}>Vegesoft</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Gestion de vergers tropicaux</div>
        </div>

        {resetSent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, color: C.forest, marginBottom: 8 }}>Email envoyé !</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Vérifiez votre boîte mail pour réinitialiser votre mot de passe.</div>
            <Btn onClick={() => { setResetMode(false); setResetSent(false); }}>Retour à la connexion</Btn>
          </div>
        ) : resetMode ? (
          <>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.forest, marginBottom: 20 }}>🔑 Réinitialiser le mot de passe</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input label="Votre email" type="email" value={email} onChange={setEmail} />
              {error && <div style={{ color: C.danger, fontSize: 13, fontFamily: FONT }}>{error}</div>}
              <Btn onClick={handleReset}>{loading ? "Envoi..." : "Envoyer le lien"}</Btn>
              <button onClick={() => setResetMode(false)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>← Retour</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.forest, marginBottom: 20 }}>Connexion</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input label="Email" type="email" value={email} onChange={setEmail} />
              <Input label="Mot de passe" type="password" value={password} onChange={setPassword} />
              {error && (
                <div style={{ background: "#FEF2F2", border: `1px solid #FECACA`, borderRadius: 8, padding: "10px 14px", color: C.danger, fontSize: 13, fontFamily: FONT }}>
                  ⚠️ {error}
                </div>
              )}
              <button
                onClick={handleLogin}
                disabled={loading}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  background: loading ? C.sand : `linear-gradient(135deg, ${C.forest}, ${C.green})`,
                  color: loading ? C.muted : C.white, border: "none", borderRadius: 12,
                  padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer",
                  fontFamily: FONT, width: "100%", transition: "all 0.2s",
                }}
              >
                {loading ? "⏳ Connexion..." : "Se connecter →"}
              </button>
              <button onClick={() => setResetMode(true)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: FONT, textDecoration: "underline" }}>
                Mot de passe oublié ?
              </button>
            </div>
          </>
        )}
        {/* Copyright sur login */}
        <div style={{ textAlign:"center", marginTop:24, fontSize:10, color:"rgba(255,255,255,0.45)", fontFamily:FONT }}>
          © 2026 Vegesoft · Simplice DONFACK KEMGMO
        </div>
      </div>
    </div>
  );
}

// ─── Page Gestion Utilisateurs ────────────────────────────────────────────────
function UsersModule({ token, currentUser }) {
  const [appUsers, setAppUsers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ email:"", full_name:"", role:"Lecteur", site:"", password:"" });
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");
  const [editingId, setEditingId] = useState(null);

  const USER_ROLES = ["Administrateur","Gestionnaire","Chef de site","Comptable","Lecteur"];

  const loadUsers = () => {
    fetch(`${SUPABASE_URL}/rest/v1/app_users?order=created_at.desc`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` },
    }).then(r => r.json())
      .then(data => { setAppUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const saveUser = async () => {
    if (!form.email || !form.full_name) { setMsg("❌ Email et nom requis"); return; }
    setSaving(true); setMsg("");
    try {
      if (editingId) {
        // Update existing user in app_users
        await fetch(`${SUPABASE_URL}/rest/v1/app_users?id=eq.${editingId}`, {
          method: "PATCH",
          headers: { "apikey":SUPABASE_KEY, "Authorization":`Bearer ${token}`, "Content-Type":"application/json" },
          body: JSON.stringify({ full_name:form.full_name, role:form.role, site:form.site }),
        });
        setMsg("✅ Utilisateur mis à jour");
        setEditingId(null);
      } else {
        // Create auth user via admin endpoint
        const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
          method: "POST",
          headers: { "apikey":SUPABASE_KEY, "Authorization":`Bearer ${token}`, "Content-Type":"application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password || "Vegesoft2026!",
            email_confirm: true,
          }),
        });
        if (!authRes.ok) {
          // Fallback: just add to app_users if auth user already exists
          const existingRes = await fetch(`${SUPABASE_URL}/rest/v1/app_users?email=eq.${encodeURIComponent(form.email)}`, {
            headers: { "apikey":SUPABASE_KEY, "Authorization":`Bearer ${token}` },
          });
          const existing = await existingRes.json();
          if (existing.length > 0) {
            setMsg("⚠️ Cet email existe déjà dans le système");
            setSaving(false); return;
          }
        }
        const authData = authRes.ok ? await authRes.json() : null;
        // Add to app_users
        await fetch(`${SUPABASE_URL}/rest/v1/app_users`, {
          method: "POST",
          headers: { "apikey":SUPABASE_KEY, "Authorization":`Bearer ${token}`, "Content-Type":"application/json", "Prefer":"return=representation" },
          body: JSON.stringify({
            id: authData?.id || undefined,
            email: form.email, full_name: form.full_name,
            role: form.role, site: form.site, active: true,
          }),
        });
        setMsg(`✅ Utilisateur ${form.email} créé avec mot de passe: ${form.password || "Vegesoft2026!"}`);
      }
      setForm({ email:"", full_name:"", role:"Lecteur", site:"", password:"" });
      loadUsers();
    } catch(err) {
      setMsg("❌ Erreur: " + err.message);
    }
    setSaving(false);
  };

  const syncFromAuth = async () => {
    setSaving(true); setMsg("⏳ Synchronisation...");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/app_users`, {
        headers: { "apikey":SUPABASE_KEY, "Authorization":`Bearer ${token}` },
      });
      const existing = await res.json();
      setAppUsers(Array.isArray(existing) ? existing : []);
      setMsg(`✅ ${existing.length} utilisateur(s) chargé(s)`);
    } catch(err) {
      setMsg("❌ " + err.message);
    }
    setSaving(false);
  };

  const updateRole = async (id, role) => {
    await fetch(`${SUPABASE_URL}/rest/v1/app_users?id=eq.${id}`, {
      method: "PATCH",
      headers: { "apikey":SUPABASE_KEY, "Authorization":`Bearer ${token}`, "Content-Type":"application/json" },
      body: JSON.stringify({ role }),
    });
    setAppUsers(appUsers.map(u => u.id===id ? {...u, role} : u));
  };

  const toggleActive = async (id, active) => {
    await fetch(`${SUPABASE_URL}/rest/v1/app_users?id=eq.${id}`, {
      method: "PATCH",
      headers: { "apikey":SUPABASE_KEY, "Authorization":`Bearer ${token}`, "Content-Type":"application/json" },
      body: JSON.stringify({ active }),
    });
    setAppUsers(appUsers.map(u => u.id===id ? {...u, active} : u));
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur de l'application ?")) return;
    await fetch(`${SUPABASE_URL}/rest/v1/app_users?id=eq.${id}`, {
      method: "DELETE",
      headers: { "apikey":SUPABASE_KEY, "Authorization":`Bearer ${token}` },
    });
    setAppUsers(appUsers.filter(u => u.id!==id));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
        <StatCard icon="👥" label="Utilisateurs" value={appUsers.length} sub="enregistrés" color="#DBEAFE" />
        <StatCard icon="✅" label="Actifs" value={appUsers.filter(u=>u.active).length} color="#D1FAE5" />
        <StatCard icon="🔐" label="Admins" value={appUsers.filter(u=>u.role==="Administrateur").length} color="#FEF9C3" />
      </div>

      {/* Formulaire ajout/modif */}
      <Card>
        <h3 style={sectionTitle}>{editingId ? "✏️ Modifier l'utilisateur" : "➕ Ajouter un membre de l'équipe"}</h3>
        <div style={{ marginBottom:10, padding:"8px 12px", background:"#EFF6FF", borderRadius:8, fontSize:12, fontFamily:FONT, color:"#1E40AF" }}>
          💡 L'utilisateur pourra se connecter avec l'email et le mot de passe définis ici.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
          <Input label="Email" type="email" value={form.email} onChange={v=>setForm({...form,email:v})} />
          <Input label="Nom complet" value={form.full_name} onChange={v=>setForm({...form,full_name:v})} />
          <Input label="Rôle" value={form.role} onChange={v=>setForm({...form,role:v})} options={USER_ROLES} />
          <Input label="Site affecté (optionnel)" value={form.site} onChange={v=>setForm({...form,site:v})} />
          {!editingId && (
            <Input label="Mot de passe initial" type="password" value={form.password} onChange={v=>setForm({...form,password:v})} />
          )}
        </div>
        {msg && (
          <div style={{ marginTop:10, padding:"8px 14px", background:msg.startsWith("✅")?"#D1FAE5":msg.startsWith("⚠️")?"#FEF3C7":"#FEE2E2", borderRadius:8, fontFamily:FONT, fontSize:13, color:msg.startsWith("✅")?"#065F46":msg.startsWith("⚠️")?"#92400E":C.danger }}>
            {msg}
          </div>
        )}
        <div style={{ marginTop:14, display:"flex", gap:10 }}>
          <Btn onClick={saveUser}>{saving?"⏳...":editingId?"Enregistrer":"Ajouter l'utilisateur"}</Btn>
          {editingId && <Btn variant="secondary" onClick={()=>{setEditingId(null);setForm({email:"",full_name:"",role:"Lecteur",site:"",password:""});}}>Annuler</Btn>}
          <Btn variant="secondary" onClick={syncFromAuth}>🔄 Rafraîchir la liste</Btn>
        </div>
      </Card>

      {/* Liste */}
      <Card>
        <h3 style={sectionTitle}>👥 Membres de l'équipe ({appUsers.length})</h3>
        {loading ? (
          <div style={{ textAlign:"center", padding:30, color:C.muted, fontFamily:FONT }}>⏳ Chargement...</div>
        ) : appUsers.length === 0 ? (
          <div style={{ textAlign:"center", padding:30, fontFamily:FONT }}>
            <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>Aucun utilisateur dans la liste.</div>
            <div style={{ fontSize:12, color:C.muted, background:C.cream, padding:"10px 16px", borderRadius:8, textAlign:"left" }}>
              💡 Si tu as déjà créé des utilisateurs via SQL, clique <strong>"🔄 Rafraîchir"</strong> ci-dessus, ou exécute ce SQL dans Supabase :
              <br/><br/>
              <code style={{ fontSize:10, background:"#F3F4F6", padding:"4px 8px", borderRadius:4, display:"block", marginTop:4 }}>
                INSERT INTO app_users (id, email, full_name, role, active)<br/>
                SELECT id, email, email, 'Administrateur', true FROM auth.users;
              </code>
            </div>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:C.sand }}>
                  {["Nom","Email","Rôle","Site","Statut","Actions"].map(h=>(
                    <th key={h} style={{ padding:"9px 11px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appUsers.map((u,i)=>(
                  <tr key={u.id} style={{ background:i%2===0?C.white:C.cream }}>
                    <td style={{ ...td, fontWeight:700 }}>{u.full_name||"—"}</td>
                    <td style={td}>{u.email}</td>
                    <td style={td}>
                      <select value={u.role} onChange={e=>updateRole(u.id,e.target.value)}
                        style={{ ...inputStyle, padding:"4px 8px", fontSize:12, height:"auto" }}>
                        {USER_ROLES.map(r=><option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td style={td}>{u.site||"—"}</td>
                    <td style={td}><Badge color={u.active?"green":"amber"}>{u.active?"Actif":"Inactif"}</Badge></td>
                    <td style={td}>
                      <div style={{ display:"flex", gap:5 }}>
                        <Btn small variant="secondary" onClick={()=>{setForm({email:u.email,full_name:u.full_name||"",role:u.role||"Lecteur",site:u.site||"",password:""});setEditingId(u.id);}}>✏️</Btn>
                        <Btn small variant={u.active?"danger":"secondary"} onClick={()=>toggleActive(u.id,!u.active)}>
                          {u.active?"Désactiver":"Réactiver"}
                        </Btn>
                        <Btn small variant="danger" onClick={()=>deleteUser(u.id)}>🗑️</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}


// ─── Helpers LocalStorage ─────────────────────────────────────────────────────


async function sbFetch(table, method="GET", body=null, filter="") {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filter}`;
  const headers = { "apikey":SUPABASE_KEY, "Authorization":`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", "Prefer":method==="POST"?"return=representation":method==="PATCH"?"return=representation":"" };
  const res = await fetch(url, { method, headers, body:body?JSON.stringify(body):null });
  if (!res.ok) throw new Error(await res.text());
  if (method==="DELETE"||res.status===204) return [];
  return res.json();
}

const DB = {
  list:   t     => sbFetch(t,"GET",null,"?order=created_at.asc"),
  insert: (t,r) => sbFetch(t,"POST",r),
  update: (t,id,r) => sbFetch(t,"PATCH",r,`?id=eq.${id}`),
  remove: (t,id) => sbFetch(t,"DELETE",null,`?id=eq.${id}`),
};

const MAPS = {
  trees:          { toDB:r=>({site:r.site,species:r.species,variety:r.variety,count:r.count,plant_date:r.plantDate||null,status:r.status,notes:r.notes||""}), fromDB:r=>({id:r.id,site:r.site,species:r.species,variety:r.variety,count:+r.count,plantDate:r.plant_date,status:r.status,notes:r.notes}) },
  harvests:       { toDB:r=>({date:r.date,site:r.site,species:r.species,variety:r.variety,qty:r.qty,unit:r.unit||"kg",notes:r.notes||""}), fromDB:r=>({id:r.id,date:r.date,site:r.site,species:r.species,variety:r.variety,qty:+r.qty,unit:r.unit,notes:r.notes}) },
  sales:          { toDB:r=>({date:r.date,buyer:r.buyer,species:r.species,variety:r.variety,qty:r.qty,price:r.price,paid:r.paid||false,notes:r.notes||""}), fromDB:r=>({id:r.id,date:r.date,buyer:r.buyer,species:r.species,variety:r.variety,qty:+r.qty,price:+r.price,paid:r.paid,notes:r.notes}) },
  treatments:     { toDB:r=>({date:r.date,site:r.site,species:r.species||"Tous",type:r.type,product:r.product||"",qty:r.qty||0,unit:r.unit||"",notes:r.notes||""}), fromDB:r=>({id:r.id,date:r.date,site:r.site,species:r.species,type:r.type,product:r.product,qty:+r.qty,unit:r.unit,notes:r.notes}) },
  nursery_batches:{ toDB:r=>({name:r.name,start_date:r.startDate,site:r.site,variety:r.variety,qty_seeds:r.qtySeeds,qty_alive:r.qtyAlive,stage:r.stage,notes:r.notes||""}), fromDB:r=>({id:r.id,name:r.name,startDate:r.start_date,site:r.site,species:r.species,variety:r.variety,qtySeeds:+r.qty_seeds,qtyAlive:+r.qty_alive,stage:r.stage,notes:r.notes}) },
  graftings:      { toDB:r=>({date:r.date,batch_name:r.batchName||"",technique:r.technique,rootstock:r.rootstock,scion:r.scion,qty_grafted:r.qtyGrafted,qty_success:r.qtySuccess||0,check_date:r.checkDate||null,status:r.status,destination:r.destination||"",notes:r.notes||""}), fromDB:r=>({id:r.id,date:r.date,batchName:r.batch_name,technique:r.technique,rootstock:r.rootstock,scion:r.scion,qtyGrafted:+r.qty_grafted,qtySuccess:+r.qty_success,checkDate:r.check_date,status:r.status,destination:r.destination,notes:r.notes}) },
  staff:          { toDB:r=>({name:r.name,role:r.role,site:r.site,salary:r.salary,start_date:r.startDate,status:r.status,phone:r.phone||"",notes:r.notes||""}), fromDB:r=>({id:r.id,name:r.name,role:r.role,site:r.site,salary:+r.salary,startDate:r.start_date,status:r.status,phone:r.phone,notes:r.notes}) },
  temp_work:      { toDB:r=>({date:r.date,site:r.site,task:r.task,nb_workers:r.nbWorkers,nb_days:r.nbDays,daily_rate:r.dailyRate,total:r.total,notes:r.notes||""}), fromDB:r=>({id:r.id,date:r.date,site:r.site,task:r.task,nbWorkers:+r.nb_workers,nbDays:+r.nb_days,dailyRate:+r.daily_rate,total:+r.total,notes:r.notes}) },
  charges:        { toDB:r=>({date:r.date,category:r.category,label:r.label,site:r.site||"Tous",amount:r.amount,paid:r.paid||false,notes:r.notes||""}), fromDB:r=>({id:r.id,date:r.date,category:r.category,label:r.label,site:r.site,amount:+r.amount,paid:r.paid,notes:r.notes}) },
  app_species:    { toDB:r=>({name:r.name,emoji:r.emoji||"🌳",color:r.color||"#2E5E3E",varieties:r.varieties||[]}), fromDB:r=>({id:r.id,name:r.name,emoji:r.emoji,color:r.color,varieties:Array.isArray(r.varieties)?r.varieties:[]}) },
  app_sites:      { toDB:r=>({code:r.code,name:r.name,lat_dec:r.latDec||0,lng_dec:r.lngDec||0,notes:r.notes||""}), fromDB:r=>({id:r.id,code:r.code,name:r.name,latDec:+r.lat_dec,lngDec:+r.lng_dec,notes:r.notes}) },
  selected_trees: { toDB:r=>({ref:r.ref,site:r.site,species:r.species,variety:r.variety,year:r.year||0,lat_dec:r.latDec||0,lng_dec:r.lngDec||0,reason:r.reason||"",notes:r.notes||"",status:r.status||"Actif"}), fromDB:r=>({id:r.id,ref:r.ref,site:r.site,species:r.species,variety:r.variety,year:r.year,latDec:+r.lat_dec,lngDec:+r.lng_dec,reason:r.reason,notes:r.notes,status:r.status}) },
};

function useSupabaseTable(tableName, lsKey, initialData) {
  const [rows, setRows] = useState(()=>loadLS(lsKey,initialData));
  const [synced, setSynced] = useState(false);
  const [loading, setLoading] = useState(true);
  const map = MAPS[tableName];

  useEffect(()=>{
    DB.list(tableName).then(data=>{
      const converted = data.map(map.fromDB);
      setRows(converted); saveLS(lsKey,converted); setSynced(true); setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  const add = async item => {
    try { const [saved]=await DB.insert(tableName,map.toDB(item)); const newItem=map.fromDB(saved); setRows(prev=>{const n=[...prev,newItem];saveLS(lsKey,n);return n;}); return newItem; }
    catch { const tmp={...item,id:"tmp_"+Date.now()}; setRows(prev=>{const n=[...prev,tmp];saveLS(lsKey,n);return n;}); return tmp; }
  };

  const update = async (id,item) => {
    try { const [saved]=await DB.update(tableName,id,map.toDB(item)); const updated=map.fromDB(saved); setRows(prev=>{const n=prev.map(r=>r.id===id?updated:r);saveLS(lsKey,n);return n;}); }
    catch { setRows(prev=>{const n=prev.map(r=>r.id===id?{...item,id}:r);saveLS(lsKey,n);return n;}); }
  };

  const remove = async id => {
    try{await DB.remove(tableName,id);}catch{}
    setRows(prev=>{const n=prev.filter(r=>r.id!==id);saveLS(lsKey,n);return n;});
  };

  return { rows, add, update, remove, loading, synced };
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

// ─── MODULE : 🗺️ Carte Interactive ──────────────────────────────────────────
function MapModule({ sitesList, selectedTrees, trees, species }) {
  const mapRef = useEffect(() => {}, []);
  const [mapReady, setMapReady] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const containerId = "vegesoft-map-" + Math.random().toString(36).substr(2,5);
  const [cid] = useState(containerId);

  useEffect(() => {
    // Load Leaflet dynamically
    if (window.L) { initMap(); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = initMap;
    document.head.appendChild(script);
  }, []);

  function initMap() {
    setTimeout(() => {
      const container = document.getElementById(cid);
      if (!container || container._leaflet_id) return;
      const center = sitesList.length > 0 && sitesList[0].latDec
        ? [sitesList[0].latDec, sitesList[0].lngDec]
        : [3.87, 11.52];
      const map = window.L.map(cid).setView(center, 13);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap", maxZoom: 19,
      }).addTo(map);

      // Sites markers (large green)
      sitesList.forEach(s => {
        if (!s.latDec || !s.lngDec) return;
        const totalTrees = trees.filter(t => t.site === s.code).reduce((sum, t) => sum + t.count, 0);
        const siteSpecies = [...new Set(trees.filter(t => t.site === s.code).map(t => t.species))];
        const icon = window.L.divIcon({
          className: "",
          html: `<div style="background:#1A3A2A;color:white;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid #7FBF8E;box-shadow:0 3px 10px rgba(0,0,0,0.3)">🌿</div>`,
          iconSize: [44, 44], iconAnchor: [22, 22],
        });
        window.L.marker([s.latDec, s.lngDec], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Poppins,sans-serif;min-width:180px">
              <div style="font-weight:800;font-size:14px;color:#1A3A2A;margin-bottom:6px">📍 ${s.code} — ${s.name}</div>
              <div style="font-size:12px;color:#374151">🌳 ${totalTrees.toLocaleString()} arbres</div>
              <div style="font-size:12px;color:#374151">🌿 ${siteSpecies.join(", ") || "—"}</div>
              ${s.notes ? `<div style="font-size:11px;color:#6B7280;margin-top:4px">${s.notes}</div>` : ""}
              <a href="https://maps.google.com/?q=${s.latDec},${s.lngDec}" target="_blank"
                style="display:inline-block;margin-top:8px;color:#2E5E3E;font-size:11px;font-weight:600">🗺️ Google Maps →</a>
            </div>
          `);
      });

      // Selected trees markers (colored by species)
      selectedTrees.forEach(t => {
        if (!t.latDec || !t.lngDec) return;
        const sp = species.find(s => s.name === t.species);
        const color = sp ? sp.color : "#C07830";
        const emoji = sp ? sp.emoji : "🌳";
        const icon = window.L.divIcon({
          className: "",
          html: `<div style="background:${color};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)">${emoji}</div>`,
          iconSize: [32, 32], iconAnchor: [16, 16],
        });
        window.L.marker([t.latDec, t.lngDec], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Poppins,sans-serif;min-width:160px">
              <div style="font-weight:800;font-size:13px;color:#1A3A2A">⭐ ${t.ref}</div>
              <div style="font-size:12px;color:#374151;margin-top:4px">${emoji} ${t.species} — ${t.variety}</div>
              <div style="font-size:12px;color:#374151">${t.site}</div>
              ${t.reason ? `<div style="font-size:11px;color:#6B7280;margin-top:4px">${t.reason}</div>` : ""}
              ${t.notes ? `<div style="font-size:11px;color:#6B7280">${t.notes}</div>` : ""}
            </div>
          `);
      });

      // Fit bounds to all markers
      const allPoints = [
        ...sitesList.filter(s => s.latDec && s.lngDec).map(s => [s.latDec, s.lngDec]),
        ...selectedTrees.filter(t => t.latDec && t.lngDec).map(t => [t.latDec, t.lngDec]),
      ];
      if (allPoints.length > 1) map.fitBounds(allPoints, { padding: [30, 30] });

      setMapReady(true);
      setMapInstance(map);
    }, 200);
  }

  const sitesWithGPS  = sitesList.filter(s => s.latDec && s.lngDec).length;
  const treesWithGPS  = selectedTrees.filter(t => t.latDec && t.lngDec).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
        <StatCard icon="📍" label="Sites géolocalisés" value={sitesWithGPS} sub={`sur ${sitesList.length} sites`} color="#D1FAE5" />
        <StatCard icon="⭐" label="Arbres géolocalisés" value={treesWithGPS} sub="pieds sélectionnés" color="#FEF9C3" />
        <StatCard icon="🌳" label="Total arbres" value={trees.reduce((s,t)=>s+t.count,0).toLocaleString()} color="#DBEAFE" />
      </div>

      {/* Légende */}
      <Card style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.forest }}>Légende :</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.forest, border: `3px solid ${C.mint}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🌿</div>
            <span style={{ fontFamily: FONT, fontSize: 12 }}>Site de plantation</span>
          </div>
          {species.slice(0, 4).map(sp => (
            <div key={sp.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: sp.color, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{sp.emoji}</div>
              <span style={{ fontFamily: FONT, fontSize: 12 }}>{sp.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Carte */}
      <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: `2px solid ${C.sand}` }}>
        <div id={cid} style={{ height: 500, width: "100%" }} />
      </div>

      {/* Avertissement si pas de GPS */}
      {sitesWithGPS === 0 && (
        <Card style={{ background: "#FEF9C3", border: `1px solid ${C.amber}` }}>
          <div style={{ fontFamily: FONT, fontSize: 13, color: "#92400E" }}>
            ⚠️ Aucun site n'a encore de coordonnées GPS. Va dans le module <strong>Sites</strong> pour ajouter les coordonnées GPS de tes plantations.
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── MODULE : 📈 Graphiques ──────────────────────────────────────────────────
function ChartsModule({ harvests, sales, charges, staff, tempWork, species, trees }) {
  const [period, setPeriod] = useState("2024");
  const [chartType, setChartType] = useState("recoltes"); // recoltes | revenus | charges | especes

  const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  const COLORS_CHART = ["#2E5E3E","#C07830","#4E8B62","#E09040","#7A4828","#1D6FA6","#7FBF8E","#F0D8A8"];

  // Données mensuelles récoltes
  const monthlyHarvest = MONTHS.map((m, idx) => {
    const key = `${period}-${String(idx+1).padStart(2,"0")}`;
    const total = harvests.filter(h => h.date && h.date.startsWith(key)).reduce((s,h) => s+h.qty, 0);
    const bySpecies = {};
    species.forEach(sp => {
      bySpecies[sp.name] = harvests.filter(h => h.date && h.date.startsWith(key) && h.species === sp.name).reduce((s,h) => s+h.qty, 0);
    });
    return { month: m, total, ...bySpecies };
  });

  // Données mensuelles revenus
  const monthlyRevenue = MONTHS.map((m, idx) => {
    const key = `${period}-${String(idx+1).padStart(2,"0")}`;
    const rev = sales.filter(v => v.date && v.date.startsWith(key)).reduce((s,v) => s+v.qty*v.price, 0);
    const chg = charges.filter(c => c.date && c.date.startsWith(key)).reduce((s,c) => s+c.amount, 0);
    const sal = staff.filter(s => s.status==="Actif").reduce((s,e) => s+e.salary, 0);
    const tmp = tempWork.filter(t => t.date && t.date.startsWith(key)).reduce((s,t) => s+t.total, 0);
    return { month: m, Revenus: rev, Charges: chg+sal+tmp, Résultat: rev-chg-sal-tmp };
  });

  // Répartition par espèce
  const speciesData = species.map(sp => ({
    name: sp.name,
    emoji: sp.emoji,
    color: sp.color,
    arbres: trees.filter(t => t.species === sp.name).reduce((s,t) => s+t.count, 0),
    recolte: harvests.filter(h => h.species === sp.name && h.date && h.date.startsWith(period)).reduce((s,h) => s+h.qty, 0),
    revenus: sales.filter(v => v.species === sp.name && v.date && v.date.startsWith(period)).reduce((s,v) => s+v.qty*v.price, 0),
  })).filter(s => s.arbres > 0);

  // Charges par catégorie
  const chargesData = [
    { name: "Salaires", value: staff.filter(s=>s.status==="Actif").reduce((s,e)=>s+e.salary,0)*12, color: "#3B82F6" },
    { name: "MO temp.", value: tempWork.filter(t=>t.date&&t.date.startsWith(period)).reduce((s,t)=>s+t.total,0), color: C.amber },
    { name: "Intrants", value: charges.filter(c=>c.category==="Intrants agricoles"&&c.date&&c.date.startsWith(period)).reduce((s,c)=>s+c.amount,0), color: C.sage },
    { name: "Transport", value: charges.filter(c=>c.category==="Carburant & transport"&&c.date&&c.date.startsWith(period)).reduce((s,c)=>s+c.amount,0), color: "#6B7280" },
    { name: "Autres", value: charges.filter(c=>!["Intrants agricoles","Carburant & transport"].includes(c.category)&&c.date&&c.date.startsWith(period)).reduce((s,c)=>s+c.amount,0), color: C.ocre },
  ].filter(d => d.value > 0);

  const totalCharges = chargesData.reduce((s,d) => s+d.value, 0);
  const maxHarvest = Math.max(...monthlyHarvest.map(m => m.total), 1);
  const maxRevenue = Math.max(...monthlyRevenue.map(m => Math.max(m.Revenus, m.Charges)), 1);
  const totalArbres = speciesData.reduce((s,d) => s+d.arbres, 0);

  const Bar = ({ height, color, label, value }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <div style={{ fontSize: 9, color: C.muted, fontFamily: FONT, marginBottom: 2, fontWeight: 600 }}>
        {value > 0 ? (value >= 1000 ? `${(value/1000).toFixed(0)}K` : value) : ""}
      </div>
      <div style={{ width: "80%", height: 120, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ width: "100%", height: `${height}%`, background: color, borderRadius: "4px 4px 0 0", minHeight: value > 0 ? 3 : 0, transition: "height 0.3s" }} />
      </div>
      <div style={{ fontSize: 9, color: C.muted, fontFamily: FONT, marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Contrôles */}
      <Card style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", padding: "14px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: FONT }}>Exercice</label>
          <select value={period} onChange={e => setPeriod(e.target.value)} style={{ ...inputStyle, width: 90 }}>
            {["2022","2023","2024","2025","2026"].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            {id:"recoltes",  label:"🧺 Récoltes"},
            {id:"revenus",   label:"💰 Revenus/Charges"},
            {id:"especes",   label:"🌿 Par espèce"},
            {id:"charges",   label:"📋 Structure charges"},
          ].map(t => (
            <button key={t.id} onClick={() => setChartType(t.id)} style={{
              background: chartType === t.id ? C.green : C.sand,
              color: chartType === t.id ? C.white : C.forest,
              border: "none", borderRadius: 8, padding: "8px 14px",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
            }}>{t.label}</button>
          ))}
        </div>
      </Card>

      {/* Graphique Récoltes mensuelles */}
      {chartType === "recoltes" && (
        <Card>
          <h3 style={sectionTitle}>🧺 Récoltes mensuelles {period} (kg)</h3>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 160, padding: "0 8px" }}>
            {monthlyHarvest.map((m, i) => (
              <Bar key={m.month} height={(m.total/maxHarvest)*100} color={C.sage} label={m.month} value={m.total} />
            ))}
          </div>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
            {speciesData.filter(s => s.recolte > 0).map(sp => (
              <div key={sp.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: C.cream, borderRadius: 10, borderLeft: `4px solid ${sp.color}` }}>
                <span style={{ fontSize: 20 }}>{sp.emoji}</span>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13 }}>{sp.name}</div>
                  <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted }}>{sp.recolte.toLocaleString()} kg récoltés</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Graphique Revenus vs Charges */}
      {chartType === "revenus" && (
        <Card>
          <h3 style={sectionTitle}>💰 Revenus vs Charges — {period}</h3>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            {[{color:C.green,label:"Revenus"},{color:C.ocre,label:"Charges"},{color:"#059669",label:"Résultat +"}].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: l.color }} />
                <span style={{ fontFamily: FONT, fontSize: 12 }}>{l.label}</span>
              </div>
            ))}
          </div>
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "flex", gap: 4, minWidth: 600, padding: "0 8px" }}>
              {monthlyRevenue.map(m => (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ width: "100%", height: 140, display: "flex", alignItems: "flex-end", gap: 1 }}>
                    <div style={{ flex: 1, height: `${(m.Revenus/maxRevenue)*100}%`, background: C.green, borderRadius: "3px 3px 0 0", minHeight: m.Revenus > 0 ? 2 : 0 }} title={`Revenus: ${m.Revenus.toLocaleString()} F`} />
                    <div style={{ flex: 1, height: `${(m.Charges/maxRevenue)*100}%`, background: C.ocre, borderRadius: "3px 3px 0 0", minHeight: m.Charges > 0 ? 2 : 0 }} title={`Charges: ${m.Charges.toLocaleString()} F`} />
                  </div>
                  <div style={{ fontSize: 9, color: m.Résultat >= 0 ? "#059669" : C.danger, fontWeight: 700, fontFamily: FONT }}>
                    {m.Résultat !== 0 ? `${m.Résultat >= 0 ? "+" : "−"}${Math.abs(m.Résultat/1000).toFixed(0)}K` : ""}
                  </div>
                  <div style={{ fontSize: 9, color: C.muted, fontFamily: FONT, fontWeight: 600 }}>{m.month}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              { label: "Total revenus", value: monthlyRevenue.reduce((s,m) => s+m.Revenus, 0), color: C.green },
              { label: "Total charges", value: monthlyRevenue.reduce((s,m) => s+m.Charges, 0), color: C.ocre },
              { label: "Résultat net", value: monthlyRevenue.reduce((s,m) => s+m.Résultat, 0), color: monthlyRevenue.reduce((s,m)=>s+m.Résultat,0)>=0?"#059669":C.danger },
            ].map(k => (
              <div key={k.label} style={{ textAlign: "center", padding: "12px", background: C.cream, borderRadius: 10, borderTop: `3px solid ${k.color}` }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: k.color }}>{(k.value/1000).toFixed(0)}K FCFA</div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted }}>{k.label}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Graphique Par espèce */}
      {chartType === "especes" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          <Card>
            <h3 style={sectionTitle}>🌳 Répartition des arbres par espèce</h3>
            {speciesData.map(sp => {
              const pct = totalArbres > 0 ? (sp.arbres/totalArbres)*100 : 0;
              return (
                <div key={sp.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: FONT, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{sp.emoji} {sp.name}</span>
                    <span style={{ color: C.muted }}>{sp.arbres.toLocaleString()} — {pct.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 10, background: C.sand, borderRadius: 5 }}>
                    <div style={{ height: 10, width: `${pct}%`, background: sp.color, borderRadius: 5 }} />
                  </div>
                </div>
              );
            })}
          </Card>
          <Card>
            <h3 style={sectionTitle}>🧺 Récoltes {period} par espèce</h3>
            {speciesData.map(sp => {
              const maxR = Math.max(...speciesData.map(s => s.recolte), 1);
              return (
                <div key={sp.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: FONT, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{sp.emoji} {sp.name}</span>
                    <span style={{ color: C.muted }}>{sp.recolte.toLocaleString()} kg</span>
                  </div>
                  <div style={{ height: 10, background: C.sand, borderRadius: 5 }}>
                    <div style={{ height: 10, width: `${(sp.recolte/maxR)*100}%`, background: sp.color, borderRadius: 5 }} />
                  </div>
                </div>
              );
            })}
          </Card>
          <Card>
            <h3 style={sectionTitle}>💰 Revenus {period} par espèce</h3>
            {speciesData.map(sp => {
              const maxRev = Math.max(...speciesData.map(s => s.revenus), 1);
              return (
                <div key={sp.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: FONT, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{sp.emoji} {sp.name}</span>
                    <span style={{ color: C.muted }}>{(sp.revenus/1000).toFixed(0)}K FCFA</span>
                  </div>
                  <div style={{ height: 10, background: C.sand, borderRadius: 5 }}>
                    <div style={{ height: 10, width: `${(sp.revenus/maxRev)*100}%`, background: sp.color, borderRadius: 5 }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* Structure des charges */}
      {chartType === "charges" && (
        <Card>
          <h3 style={sectionTitle}>📋 Structure des charges {period}</h3>
          {chargesData.length === 0 ? (
            <div style={{ fontFamily: FONT, color: C.muted, textAlign: "center", padding: 40 }}>Aucune charge enregistrée pour {period}</div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 160, marginBottom: 16, padding: "0 8px" }}>
                {chargesData.map(d => (
                  <div key={d.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 10, color: C.muted, fontFamily: FONT, marginBottom: 3 }}>{(d.value/1000).toFixed(0)}K</div>
                    <div style={{ width: "80%", height: `${(d.value/totalCharges)*100 * 1.5}px`, maxHeight: 130, background: d.color, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                    <div style={{ fontSize: 10, color: C.muted, fontFamily: FONT, marginTop: 4, textAlign: "center" }}>{d.name}</div>
                  </div>
                ))}
              </div>
              {chargesData.map(d => (
                <div key={d.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: FONT, marginBottom: 3 }}>
                    <span>{d.name}</span>
                    <span style={{ fontWeight: 700 }}>{d.value.toLocaleString()} FCFA ({((d.value/totalCharges)*100).toFixed(1)}%)</span>
                  </div>
                  <div style={{ height: 7, background: C.sand, borderRadius: 3 }}>
                    <div style={{ height: 7, width: `${(d.value/totalCharges)*100}%`, background: d.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: "10px 14px", background: C.forest, borderRadius: 10, display: "flex", justifyContent: "space-between", color: C.white, fontFamily: FONT }}>
                <span style={{ fontWeight: 700 }}>Total charges {period}</span>
                <span style={{ fontWeight: 800 }}>{totalCharges.toLocaleString()} FCFA</span>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}

// ─── MODULE : 🔔 Rappels & Alertes ──────────────────────────────────────────
function RemindersModule({ treatments, harvests, graftings, batches, staff }) {
  const [reminders, setReminders] = useState(() => loadLS("vs_reminders", []));
  const [form, setForm] = useState({ title: "", date: "", type: "Intervention", priority: "Normale", notes: "" });

  const saveReminder = () => {
    if (!form.title || !form.date) return;
    const entry = { ...form, id: Date.now(), done: false };
    const updated = [...reminders, entry];
    setReminders(updated);
    saveLS("vs_reminders", updated);
    setForm({ title: "", date: "", type: "Intervention", priority: "Normale", notes: "" });
  };

  const toggleDone = id => {
    const updated = reminders.map(r => r.id === id ? { ...r, done: !r.done } : r);
    setReminders(updated); saveLS("vs_reminders", updated);
  };

  const deleteReminder = id => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated); saveLS("vs_reminders", updated);
  };

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const in7Days = new Date(today.getTime() + 7*24*60*60*1000).toISOString().split("T")[0];
  const in30Days = new Date(today.getTime() + 30*24*60*60*1000).toISOString().split("T")[0];

  // Auto-alertes depuis les données de l'app
  const autoAlerts = [];

  // Greffages à contrôler
  graftings.filter(g => g.checkDate && g.status === "En attente contrôle" && g.checkDate >= todayStr && g.checkDate <= in30Days).forEach(g => {
    autoAlerts.push({ id: "graft-"+g.id, title: `Contrôle greffage — ${g.batchName}`, date: g.checkDate, type: "Greffage", priority: g.checkDate <= in7Days ? "Urgente" : "Normale", auto: true });
  });

  // Lots pépinière en retard de stade
  batches.filter(b => b.stage === "Prêt à greffer" || b.stage === "Prêt à planter").forEach(b => {
    autoAlerts.push({ id: "batch-"+b.id, title: `Lot ${b.name} — ${b.stage}`, date: todayStr, type: "Pépinière", priority: "Haute", auto: true });
  });

  // Contrats employés (si embauche > 3 ans)
  staff.filter(s => s.status === "Actif" && s.startDate).forEach(s => {
    const years = (today - new Date(s.startDate)) / (365.25*24*60*60*1000);
    if (years > 3) {
      autoAlerts.push({ id: "staff-"+s.id, title: `Révision contrat — ${s.name}`, date: todayStr, type: "RH", priority: "Normale", auto: true });
    }
  });

  const pending  = reminders.filter(r => !r.done && r.date >= todayStr).sort((a,b) => a.date.localeCompare(b.date));
  const overdue  = reminders.filter(r => !r.done && r.date < todayStr).sort((a,b) => a.date.localeCompare(b.date));
  const done     = reminders.filter(r => r.done).slice(-5);

  const priorityColor = p => p === "Urgente" ? "#DC2626" : p === "Haute" ? "#D97706" : C.green;
  const typeIcon = { Intervention:"🌿", Récolte:"🧺", Vente:"💰", Greffage:"✂️", Pépinière:"🌱", RH:"👷", Autre:"📌" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        <StatCard icon="⚠️" label="En retard" value={overdue.length} sub="à traiter" color="#FEE2E2" />
        <StatCard icon="🔔" label="À venir" value={pending.length} sub="rappels actifs" color="#FEF9C3" />
        <StatCard icon="🤖" label="Alertes auto" value={autoAlerts.length} sub="détectées" color="#DBEAFE" />
        <StatCard icon="✅" label="Complétés" value={reminders.filter(r=>r.done).length} sub="rappels" color="#D1FAE5" />
      </div>

      {/* Alertes automatiques */}
      {autoAlerts.length > 0 && (
        <Card style={{ border: `2px solid ${C.amber}` }}>
          <h3 style={{ ...sectionTitle, borderColor: C.amber }}>🤖 Alertes automatiques détectées</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {autoAlerts.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: a.priority === "Urgente" ? "#FEF2F2" : "#FFFBEB", borderRadius: 10, borderLeft: `4px solid ${priorityColor(a.priority)}` }}>
                <span style={{ fontSize: 20 }}>{typeIcon[a.type] || "📌"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13 }}>{a.title}</div>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted }}>{a.type} · {a.date}</div>
                </div>
                <Badge color={a.priority === "Urgente" ? "red" : "amber"}>{a.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Ajouter un rappel */}
      <Card>
        <h3 style={sectionTitle}>➕ Ajouter un rappel</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          <Input label="Titre du rappel" value={form.title} onChange={v => setForm({...form, title:v})} />
          <Input label="Date d'échéance" type="date" value={form.date} onChange={v => setForm({...form, date:v})} />
          <Input label="Type" value={form.type} onChange={v => setForm({...form, type:v})} options={["Intervention","Récolte","Vente","Greffage","Pépinière","RH","Autre"]} />
          <Input label="Priorité" value={form.priority} onChange={v => setForm({...form, priority:v})} options={["Normale","Haute","Urgente"]} />
          <div style={{ gridColumn: "1/-1" }}>
            <Input label="Notes" value={form.notes} onChange={v => setForm({...form, notes:v})} />
          </div>
        </div>
        <div style={{ marginTop: 14 }}><Btn onClick={saveReminder}>Ajouter le rappel</Btn></div>
      </Card>

      {/* En retard */}
      {overdue.length > 0 && (
        <Card style={{ border: `2px solid ${C.danger}` }}>
          <h3 style={{ ...sectionTitle, color: C.danger, borderColor: C.danger }}>⚠️ En retard ({overdue.length})</h3>
          {overdue.map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#FEF2F2", borderRadius: 10, marginBottom: 8, borderLeft: `4px solid ${C.danger}` }}>
              <span style={{ fontSize: 20 }}>{typeIcon[r.type] || "📌"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13 }}>{r.title}</div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: C.danger, fontWeight: 600 }}>Échéance dépassée : {r.date}</div>
                {r.notes && <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted }}>{r.notes}</div>}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn small variant="secondary" onClick={() => toggleDone(r.id)}>✅</Btn>
                <Btn small variant="danger" onClick={() => deleteReminder(r.id)}>🗑️</Btn>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* À venir */}
      <Card>
        <h3 style={sectionTitle}>🔔 Rappels à venir ({pending.length})</h3>
        {pending.length === 0 ? (
          <div style={{ fontFamily: FONT, color: C.muted, textAlign: "center", padding: 30 }}>Aucun rappel actif. Ajoutez-en un ci-dessus !</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pending.map(r => {
              const daysLeft = Math.round((new Date(r.date) - today) / (24*60*60*1000));
              const isUrgent = daysLeft <= 3;
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: isUrgent ? "#FFFBEB" : C.cream, borderRadius: 10, borderLeft: `4px solid ${priorityColor(r.priority)}` }}>
                  <span style={{ fontSize: 20 }}>{typeIcon[r.type] || "📌"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13 }}>{r.title}</div>
                    <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted }}>
                      {r.date} · {daysLeft === 0 ? "Aujourd'hui" : daysLeft === 1 ? "Demain" : `Dans ${daysLeft} jours`} · {r.type}
                    </div>
                    {r.notes && <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted }}>{r.notes}</div>}
                  </div>
                  <Badge color={r.priority === "Urgente" ? "red" : r.priority === "Haute" ? "amber" : "green"}>{r.priority}</Badge>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn small variant="secondary" onClick={() => toggleDone(r.id)}>✅</Btn>
                    <Btn small variant="danger" onClick={() => deleteReminder(r.id)}>🗑️</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Complétés récemment */}
      {done.length > 0 && (
        <Card>
          <h3 style={sectionTitle}>✅ Récemment complétés</h3>
          {done.map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", opacity: 0.6, borderBottom: `1px solid ${C.sand}` }}>
              <span style={{ fontSize: 16, textDecoration: "line-through" }}>{typeIcon[r.type] || "📌"} {r.title}</span>
              <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto", fontFamily: FONT }}>{r.date}</span>
              <Btn small variant="danger" onClick={() => deleteReminder(r.id)}>🗑️</Btn>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── TABS (with users) ────────────────────────────────────────────────────────
const TABS = [
  { id:"dashboard",   label:"Tableau de bord",  icon:"📊" },
  { id:"map",         label:"Carte",            icon:"🗺️" },
  { id:"charts",      label:"Graphiques",       icon:"📈" },
  { id:"reminders",   label:"Rappels",          icon:"🔔" },
  { id:"sites",       label:"Sites",            icon:"📍" },
  { id:"species",     label:"Espèces",          icon:"🌿" },
  { id:"trees",       label:"Parcelles",        icon:"🌳" },
  { id:"selected",    label:"Sélection",        icon:"⭐" },
  { id:"nursery",     label:"Pépinière",        icon:"🌱" },
  { id:"harvest",     label:"Récoltes",         icon:"🧺" },
  { id:"sales",       label:"Ventes",           icon:"💰" },
  { id:"treatments",  label:"Interventions",    icon:"🌿" },
  { id:"assets",      label:"Actifs & Stocks",  icon:"📦" },
  { id:"hr",          label:"RH & Charges",     icon:"👷" },
  { id:"pnl",         label:"Compte Exploit.",  icon:"📄" },
  { id:"users",       label:"Utilisateurs",     icon:"👥" },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
// ─── MainApp (authenticated) ─────────────────────────────────────────────────
function MainApp({ authToken, currentUser, onLogout }) {
  const [tab, setTab]       = useState("dashboard");
  const [saveStatus, setSaveStatus] = useState("");

  const treesDB     = useSupabaseTable("trees",          "vs_trees",    initialTrees);
  const harvestsDB  = useSupabaseTable("harvests",       "vs_harvests", initialHarvests);
  const salesDB     = useSupabaseTable("sales",          "vs_sales",    initialSales);
  const treatsDB    = useSupabaseTable("treatments",     "vs_treats",   initialTreatments);
  const nurseryDB   = useSupabaseTable("nursery_batches","vs_nursery",  initialNurseryBatches);
  const graftingsDB = useSupabaseTable("graftings",      "vs_grafts",   initialGraftings);
  const staffDB     = useSupabaseTable("staff",          "vs_staff",    initialPermanentStaff);
  const tempDB      = useSupabaseTable("temp_work",      "vs_temp",     initialTempWork);
  const chargesDB   = useSupabaseTable("charges",        "vs_charges",  initialCharges);

  const allLoading = [treesDB,harvestsDB,salesDB,treatsDB,nurseryDB,graftingsDB,staffDB,tempDB,chargesDB,speciesDB,sitesDB,selTreesDB].some(d=>d.loading);
  const allSynced  = [treesDB,harvestsDB,salesDB,treatsDB,nurseryDB,graftingsDB,staffDB,tempDB,chargesDB,speciesDB,sitesDB,selTreesDB].every(d=>d.synced);

  const speciesDB      = useSupabaseTable("app_species",    "vs_species",   initialSpecies);
  const sitesDB        = useSupabaseTable("app_sites",       "vs_sites_list", initialSitesList);
  const selTreesDB     = useSupabaseTable("selected_trees",  "vs_selected",   initialSelectedTrees);

  const flash = () => { setSaveStatus("saved"); setTimeout(()=>setSaveStatus(""),2500); };

  const wrapSetSimple = db => async valOrFn => {
    const newArr = typeof valOrFn==="function"?valOrFn(db.rows):valOrFn;
    const added   = newArr.filter(n=>!db.rows.find(o=>o.id===n.id));
    const removed = db.rows.filter(o=>!newArr.find(n=>n.id===o.id));
    const updated = newArr.filter(n=>{ const old=db.rows.find(o=>o.id===n.id); return old&&JSON.stringify(old)!==JSON.stringify(n); });
    for(const r of added)   await db.add(r);
    for(const r of removed) await db.remove(r.id);
    for(const r of updated) await db.update(r.id,r);
    flash();
  };

  const species       = speciesDB.rows;
  const sitesList     = sitesDB.rows;
  const selectedTrees = selTreesDB.rows;
  const setSpecies       = wrapSetSimple(speciesDB);
  const setSitesList     = wrapSetSimple(sitesDB);
  const setSelectedTrees = wrapSetSimple(selTreesDB);

  const handleAddVariety = async (speciesName, newVariety) => {
    const updated = species.map(s => s.name === speciesName && !s.varieties.includes(newVariety)
      ? { ...s, varieties: [...s.varieties, newVariety] } : s);
    await setSpecies(updated);
  };

  const wrapSet = db => async valOrFn => {
    const newArr = typeof valOrFn==="function"?valOrFn(db.rows):valOrFn;
    const added   = newArr.filter(n=>!db.rows.find(o=>o.id===n.id));
    const removed = db.rows.filter(o=>!newArr.find(n=>n.id===o.id));
    const updated = newArr.filter(n=>{ const old=db.rows.find(o=>o.id===n.id); return old&&JSON.stringify(old)!==JSON.stringify(n); });
    for(const r of added)   await db.add(r);
    for(const r of removed) await db.remove(r.id);
    for(const r of updated) await db.update(r.id,r);
    flash();
  };

  const setTrees      = wrapSet(treesDB);
  const setHarvests   = wrapSet(harvestsDB);
  const setSales      = wrapSet(salesDB);
  const setTreatments = wrapSet(treatsDB);
  const setBatches    = wrapSet(nurseryDB);
  const setGraftings  = wrapSet(graftingsDB);
  const setStaff      = wrapSet(staffDB);
  const setTempWork   = wrapSet(tempDB);
  const setCharges    = wrapSet(chargesDB);

  return (
    <div style={{ minHeight:"100vh", background:C.cream, fontFamily:FONT }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.forest} 0%, ${C.green} 60%, ${C.ocre} 100%)`, padding:"16px 24px 0", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:1400, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🌿</div>
              <div>
                <div style={{ color:C.white, fontSize:20, fontWeight:800, letterSpacing:-0.5, fontFamily:FONT, lineHeight:1 }}>Vegesoft</div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:10, fontFamily:FONT }}>Gestion de vergers tropicaux</div>
              </div>
            </div>
            <div style={{ flex:1 }} />
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ color:C.white, fontSize:12, fontWeight:600, fontFamily:FONT }}>{currentUser.email}</div>
                <div style={{ background:allSynced?"#D1FAE5":allLoading?"rgba(255,255,255,0.2)":"#FEF3C7", color:allSynced?"#065F46":allLoading?"rgba(255,255,255,0.9)":"#92400E", padding:"2px 10px", borderRadius:20, fontSize:10, fontWeight:700, fontFamily:FONT }}>
                  {allLoading?"⏳ Synchro...":allSynced?"☁️ Connecté":saveStatus==="saved"?"✅ Sauvegardé":"⚠️ Local"}
                </div>
              </div>
              <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.15)", color:C.white, border:"1px solid rgba(255,255,255,0.3)", borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>
                🚪 Déconnexion
              </button>
            </div>
          </div>
          <div style={{ display:"flex", gap:2, overflowX:"auto", scrollbarWidth:"none" }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?"rgba(255,255,255,0.95)":"transparent", color:tab===t.id?C.forest:"rgba(255,255,255,0.75)", border:"none", borderRadius:"8px 8px 0 0", padding:"8px 12px", fontSize:11, fontWeight:tab===t.id?700:500, cursor:"pointer", whiteSpace:"nowrap", fontFamily:FONT, transition:"all 0.15s" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:"0 auto", padding:"24px 16px" }}>
        {allLoading&&(
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:60, color:C.muted }}>
            <div style={{ fontSize:36 }}>⏳</div>
            <div>
              <div style={{ fontWeight:700, fontSize:16, fontFamily:FONT }}>Chargement des données...</div>
              <div style={{ fontSize:13, fontFamily:FONT, color:C.muted }}>Connexion à Supabase</div>
            </div>
          </div>
        )}
        {!allLoading&&<>
          {tab==="dashboard"  && <Dashboard     trees={treesDB.rows} harvests={harvestsDB.rows} sales={salesDB.rows} treatments={treatsDB.rows} species={species} />}
          {tab==="map"        && <MapModule      sitesList={sitesList} selectedTrees={selectedTrees} trees={treesDB.rows} species={species} />}
          {tab==="charts"     && <ChartsModule   harvests={harvestsDB.rows} sales={salesDB.rows} charges={chargesDB.rows} staff={staffDB.rows} tempWork={tempDB.rows} species={species} trees={treesDB.rows} />}
          {tab==="reminders"  && <RemindersModule treatments={treatsDB.rows} harvests={harvestsDB.rows} graftings={graftingsDB.rows} batches={nurseryDB.rows} staff={staffDB.rows} />}
          {tab==="sites"      && <SitesModule    sitesList={sitesList} setSitesList={setSitesList} />}
          {tab==="species"    && <SpeciesModule   species={species} setSpecies={setSpecies} />}
          {tab==="trees"      && <TreesModule     trees={treesDB.rows} setTrees={setTrees} species={species} sitesList={sitesList} onAddVariety={handleAddVariety} />}
          {tab==="selected"   && <SelectedTreesModule selectedTrees={selectedTrees} setSelectedTrees={setSelectedTrees} sitesList={sitesList} species={species} />}
          {tab==="nursery"    && <NurseryModule   batches={nurseryDB.rows} setBatches={setBatches} graftings={graftingsDB.rows} setGraftings={setGraftings} species={species} sitesList={sitesList} />}
          {tab==="harvest"    && <HarvestModule   harvests={harvestsDB.rows} setHarvests={setHarvests} species={species} sitesList={sitesList} onAddVariety={handleAddVariety} />}
          {tab==="sales"      && <SalesModule     sales={salesDB.rows} setSales={setSales} species={species} sitesList={sitesList} onAddVariety={handleAddVariety} />}
          {tab==="treatments" && <TreatmentsModule treatments={treatsDB.rows} setTreatments={setTreatments} species={species} sitesList={sitesList} staff={staffDB.rows} />}
          {tab==="assets"     && <AssetsModule    sitesList={sitesList} staff={staffDB.rows} token={authToken} />}
          {tab==="hr"         && <HRChargesModule staff={staffDB.rows} setStaff={setStaff} tempWork={tempDB.rows} setTempWork={setTempWork} charges={chargesDB.rows} setCharges={setCharges} sitesList={sitesList} token={authToken} />}
          {tab==="pnl"        && <PnLModule       sales={salesDB.rows} harvests={harvestsDB.rows} staff={staffDB.rows} tempWork={tempDB.rows} charges={chargesDB.rows} />}
          {tab==="users"      && <UsersModule     token={authToken} currentUser={currentUser} />}
        </>}
      </div>

      {/* Copyright */}
      <div style={{ textAlign:"center", padding:"14px 20px", borderTop:`1px solid ${C.sand}`, marginTop:20 }}>
        <div style={{ fontSize:10, color:C.muted, fontFamily:FONT, lineHeight:1.6 }}>
          {"© 2026 Vegesoft — Développé le 28 mai 2026 par "}
          <span style={{ color:C.forest, fontWeight:600 }}>{"Simplice DONFACK KEMGMO"}</span>
          {" · Tous droits réservés"}
        </div>
      </div>
    </div>
  );
}

// ─── App (auth shell) ─────────────────────────────────────────────────────────
export default function App() {
  const [authToken,    setAuthToken]    = useState(() => { try { return localStorage.getItem("vs_token") || ""; } catch { return ""; } });
  const [currentUser,  setCurrentUser]  = useState(() => { try { return JSON.parse(localStorage.getItem("vs_user") || "null"); } catch { return null; } });
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vs_token");
    if (!token) { setAuthChecking(false); return; }
    Auth.getUser(token).then(user => {
      if (user) { setAuthToken(token); setCurrentUser(user); }
      else {
        localStorage.removeItem("vs_token");
        localStorage.removeItem("vs_user");
        setAuthToken(""); setCurrentUser(null);
      }
      setAuthChecking(false);
    }).catch(() => setAuthChecking(false));
  }, []);

  const handleLogin = (token, user) => { setAuthToken(token); setCurrentUser(user); };

  const handleLogout = async () => {
    try { await Auth.signOut(authToken); } catch {}
    localStorage.removeItem("vs_token");
    localStorage.removeItem("vs_refresh");
    localStorage.removeItem("vs_user");
    setAuthToken(""); setCurrentUser(null);
  };

  if (authChecking) {
    return (
      <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, ${C.forest}, ${C.green})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT }}>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ textAlign:"center", color:C.white }}>
          <div style={{ fontSize:52, marginBottom:12 }}>🌿</div>
          <div style={{ fontSize:22, fontWeight:800 }}>Vegesoft</div>
          <div style={{ fontSize:13, opacity:0.6, marginTop:6 }}>Chargement...</div>
        </div>
      </div>
    );
  }

  if (!authToken || !currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <MainApp authToken={authToken} currentUser={currentUser} onLogout={handleLogout} />;
}
