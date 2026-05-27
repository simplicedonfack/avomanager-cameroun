import { useState, useEffect } from "react";

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

// ─── MODULE : Interventions ──────────────────────────────────────────────────
function TreatmentsModule({ treatments, setTreatments, species, sitesList }) {
  const [form, setForm] = useState({ date:"", site:"", species:"Tous", type:"", product:"", qty:"", unit:"kg", notes:"" });

  const save = () => {
    if (!form.date||!form.site||!form.type) return;
    setTreatments([...treatments, { ...form, id:Date.now(), qty:+form.qty }]);
    setForm({ date:"", site:"", species:"Tous", type:"", product:"", qty:"", unit:"kg", notes:"" });
  };

  const exportRows = [...treatments].sort((a,b)=>b.date.localeCompare(a.date))
    .map(t=>[t.date,t.site,t.species,t.type,t.product||"—",t.qty?`${t.qty} ${t.unit}`:"—",t.notes||"—"]);

  const typeIcon = { Engrais:"🌿", Taille:"✂️", Irrigation:"💧", Traitement:"🧪", Autre:"📝" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <ExportBar title="Interventions" headers={["Date","Site","Espèce","Type","Produit","Quantité","Notes"]} rows={exportRows} filename="interventions" />
      <Card>
        <h3 style={sectionTitle}>➕ Enregistrer une intervention</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
          <Input label="Date" type="date" value={form.date} onChange={v=>setForm({...form,date:v})} />
          <Input label="Site" value={form.site} onChange={v=>setForm({...form,site:v})} optObjects={siteOptions(sitesList)} />
          <Input label="Espèce concernée" value={form.species} onChange={v=>setForm({...form,species:v})} options={["Tous",...species.map(s=>s.name)]} />
          <Input label="Type" value={form.type} onChange={v=>setForm({...form,type:v})} options={["Engrais","Traitement","Irrigation","Taille","Autre"]} />
          <Input label="Produit / Détail" value={form.product} onChange={v=>setForm({...form,product:v})} />
          <Input label="Quantité" type="number" value={form.qty} onChange={v=>setForm({...form,qty:v})} />
          <Input label="Unité" value={form.unit} onChange={v=>setForm({...form,unit:v})} options={["kg","L","sacs","—"]} />
          <Input label="Notes" value={form.notes} onChange={v=>setForm({...form,notes:v})} />
        </div>
        <div style={{ marginTop:14 }}><Btn onClick={save}>Enregistrer</Btn></div>
      </Card>
      <Card>
        <h3 style={sectionTitle}>📋 Historique ({treatments.length})</h3>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:C.sand }}>
                {["Date","Site","Espèce","Type","Produit","Quantité","Notes",""].map(h=>(
                  <th key={h} style={{ padding:"10px 11px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...treatments].sort((a,b)=>b.date.localeCompare(a.date)).map((t,i)=>(
                <tr key={t.id} style={{ background:i%2===0?C.white:C.cream }}>
                  <td style={td}>{t.date}</td>
                  <td style={td}>{siteLabel(t.site, sitesList)}</td>
                  <td style={td}>{t.species}</td>
                  <td style={td}>{typeIcon[t.type]||"📝"} {t.type}</td>
                  <td style={td}>{t.product||"—"}</td>
                  <td style={td}>{t.qty?`${t.qty} ${t.unit}`:"—"}</td>
                  <td style={{ ...td, color:C.muted }}>{t.notes||"—"}</td>
                  <td style={td}><Btn small variant="danger" onClick={()=>setTreatments(treatments.filter(x=>x.id!==t.id))}>🗑️</Btn></td>
                </tr>
              ))}
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

function HRChargesModule({ staff, setStaff, tempWork, setTempWork, charges, setCharges, sitesList }) {
  const [subTab, setSubTab] = useState("dashboard_rh");
  const [sForm, setSForm] = useState({ name:"", role:"", site:"", salary:"", startDate:"", status:"Actif", phone:"", notes:"" });
  const [editingS, setEditingS] = useState(null);
  const [tForm, setTForm] = useState({ date:"", site:"", task:"", nbWorkers:"", nbDays:"", dailyRate:"", notes:"" });
  const [cForm, setCForm] = useState({ date:"", category:"", label:"", site:"Tous", amount:"", paid:false, notes:"" });
  const [editingC, setEditingC] = useState(null);

  const monthlyPayroll = staff.filter(s=>s.status==="Actif").reduce((s,e)=>s+e.salary,0);
  const totalTempCost  = tempWork.reduce((s,t)=>s+t.total,0);
  const unpaidCharges  = charges.filter(c=>!c.paid).reduce((s,c)=>s+c.amount,0);

  const saveStaff = () => {
    if (!sForm.name||!sForm.role||!sForm.salary) return;
    const entry = { ...sForm, id:editingS||Date.now(), salary:+sForm.salary };
    setStaff(editingS?staff.map(s=>s.id===editingS?entry:s):[...staff,entry]);
    setEditingS(null); setSForm({ name:"", role:"", site:"", salary:"", startDate:"", status:"Actif", phone:"", notes:"" });
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

  const exportStaffRows = staff.map(s=>[s.name,s.role,s.site,s.salary,s.startDate,s.status,s.phone||"—"]);
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
        <StatCard icon="📋" label="Charges enregistrées" value={`${(charges.reduce((s,c)=>s+c.amount,0)/1000).toFixed(0)}K`} color="#FCE7F3" />
        <StatCard icon="⚠️" label="Charges impayées" value={`${(unpaidCharges/1000).toFixed(0)}K`} color="#FEE2E2" />
      </div>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", borderBottom:`2px solid ${C.sand}` }}>
        {subTabs.map(t=>(
          <button key={t.id} onClick={()=>setSubTab(t.id)} style={{ background:subTab===t.id?C.green:"transparent", color:subTab===t.id?C.white:C.forest, border:"none", borderRadius:"8px 8px 0 0", padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FONT }}>{t.label}</button>
        ))}
      </div>

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
                    <span style={{ fontWeight:600 }}>{s.code} — {s.name} <span style={{ color:C.muted, fontWeight:400 }}>({nb} pers.)</span></span>
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
            <h3 style={sectionTitle}>📋 Charges par catégorie</h3>
            {CHARGE_CATEGORIES.map(cat=>{
              const amt = charges.filter(c=>c.category===cat).reduce((s,c)=>s+c.amount,0);
              return amt>0?(
                <div key={cat} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.sand}`, fontFamily:FONT, fontSize:13 }}>
                  <span>{cat}</span>
                  <span style={{ fontWeight:700, color:C.bark }}>{amt.toLocaleString()} F</span>
                </div>
              ):null;
            })}
          </Card>
        </div>
      )}

      {subTab==="permanent" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <ExportBar title="Personnel Permanent" headers={["Nom","Poste","Site","Salaire/mois","Embauche","Statut","Tél."]} rows={exportStaffRows} extraInfo={[{label:"Masse salariale",val:monthlyPayroll.toLocaleString()+" FCFA/mois"}]} filename="personnel" />
          <Card>
            <h3 style={sectionTitle}>{editingS?"✏️ Modifier":"➕ Ajouter un employé"}</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
              <Input label="Nom complet" value={sForm.name} onChange={v=>setSForm({...sForm,name:v})} />
              <Input label="Poste" value={sForm.role} onChange={v=>setSForm({...sForm,role:v})} options={ROLES} />
              <Input label="Site affecté" value={sForm.site} onChange={v=>setSForm({...sForm,site:v})} optObjects={[...siteOptions(sitesList),{value:"Tous sites",label:"Tous sites"}]} />
              <Input label="Salaire mensuel (FCFA)" type="number" value={sForm.salary} onChange={v=>setSForm({...sForm,salary:v})} />
              <Input label="Date embauche" type="date" value={sForm.startDate} onChange={v=>setSForm({...sForm,startDate:v})} />
              <Input label="Téléphone" value={sForm.phone} onChange={v=>setSForm({...sForm,phone:v})} />
              <Input label="Statut" value={sForm.status} onChange={v=>setSForm({...sForm,status:v})} options={["Actif","Congé","Suspendu","Parti"]} />
            </div>
            <div style={{ marginTop:14, display:"flex", gap:10 }}>
              <Btn onClick={saveStaff}>{editingS?"Enregistrer":"Ajouter"}</Btn>
              {editingS&&<Btn variant="secondary" onClick={()=>{setEditingS(null);setSForm({name:"",role:"",site:"",salary:"",startDate:"",status:"Actif",phone:"",notes:""});}}>Annuler</Btn>}
            </div>
          </Card>
          <Card>
            <h3 style={sectionTitle}>👷 Personnel — {monthlyPayroll.toLocaleString()} FCFA/mois</h3>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.sand }}>
                    {["Nom","Poste","Site","Salaire/mois","Embauche","Statut",""].map(h=>(
                      <th key={h} style={{ padding:"10px 11px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s,i)=>(
                    <tr key={s.id} style={{ background:i%2===0?C.white:C.cream }}>
                      <td style={{ ...td, fontWeight:700 }}>{s.name}</td>
                      <td style={td}><Badge color="amber">{s.role}</Badge></td>
                      <td style={td}>{s.site}</td>
                      <td style={{ ...td, fontWeight:700 }}>{s.salary.toLocaleString()} F</td>
                      <td style={td}>{s.startDate}</td>
                      <td style={td}><Badge color={s.status==="Actif"?"green":"amber"}>{s.status}</Badge></td>
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
          </Card>
        </div>
      )}

      {subTab==="temp" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <ExportBar title="Main d'Oeuvre Temporaire" headers={["Date","Site","Tâche","Personnes","Jours","Taux/j","Total"]} rows={exportTempRows} extraInfo={[{label:"Total",val:totalTempCost.toLocaleString()+" FCFA"}]} filename="mo_temporaire" />
          <Card>
            <h3 style={sectionTitle}>➕ Enregistrer une prestation</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
              <Input label="Date" type="date" value={tForm.date} onChange={v=>setTForm({...tForm,date:v})} />
              <Input label="Site" value={tForm.site} onChange={v=>setTForm({...tForm,site:v})} optObjects={siteOptions(sitesList)} />
              <Input label="Tâche" value={tForm.task} onChange={v=>setTForm({...tForm,task:v})} options={TASKS_TEMP} />
              <Input label="Nb personnes" type="number" value={tForm.nbWorkers} onChange={v=>setTForm({...tForm,nbWorkers:v})} />
              <Input label="Nb jours" type="number" value={tForm.nbDays} onChange={v=>setTForm({...tForm,nbDays:v})} />
              <Input label="Taux journalier (FCFA)" type="number" value={tForm.dailyRate} onChange={v=>setTForm({...tForm,dailyRate:v})} />
              <Input label="Notes" value={tForm.notes} onChange={v=>setTForm({...tForm,notes:v})} />
            </div>
            {tForm.nbWorkers&&tForm.nbDays&&tForm.dailyRate&&(
              <div style={{ marginTop:10, padding:"8px 14px", background:"#DBEAFE", borderRadius:8, fontFamily:FONT, fontSize:13, fontWeight:600, color:"#1E40AF" }}>
                💡 Total : {(+tForm.nbWorkers * +tForm.nbDays * +tForm.dailyRate).toLocaleString()} FCFA
              </div>
            )}
            <div style={{ marginTop:14 }}><Btn onClick={saveTempWork}>Enregistrer</Btn></div>
          </Card>
          <Card>
            <h3 style={sectionTitle}>👥 Historique — Total : {totalTempCost.toLocaleString()} FCFA</h3>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.sand }}>
                    {["Date","Site","Tâche","Pers.","Jours","Taux/j","Total",""].map(h=>(
                      <th key={h} style={{ padding:"10px 11px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...tempWork].sort((a,b)=>b.date.localeCompare(a.date)).map((t,i)=>(
                    <tr key={t.id} style={{ background:i%2===0?C.white:C.cream }}>
                      <td style={td}>{t.date}</td>
                      <td style={td}>{t.site}</td>
                      <td style={td}><Badge color="amber">{t.task}</Badge></td>
                      <td style={{ ...td, textAlign:"center" }}>{t.nbWorkers}</td>
                      <td style={{ ...td, textAlign:"center" }}>{t.nbDays}</td>
                      <td style={td}>{t.dailyRate.toLocaleString()} F</td>
                      <td style={{ ...td, fontWeight:700 }}>{t.total.toLocaleString()} F</td>
                      <td style={td}><Btn small variant="danger" onClick={()=>setTempWork(tempWork.filter(x=>x.id!==t.id))}>🗑️</Btn></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {subTab==="charges" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <ExportBar title="Charges d'Exploitation" headers={["Date","Catégorie","Libellé","Site","Montant","Statut","Notes"]} rows={exportChargeRows} extraInfo={[{label:"Total",val:charges.reduce((s,c)=>s+c.amount,0).toLocaleString()+" FCFA"},{label:"Impayé",val:unpaidCharges.toLocaleString()+" FCFA"}]} filename="charges" />
          <Card>
            <h3 style={sectionTitle}>{editingC?"✏️ Modifier":"➕ Saisir une charge"}</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
              <Input label="Date" type="date" value={cForm.date} onChange={v=>setCForm({...cForm,date:v})} />
              <Input label="Catégorie" value={cForm.category} onChange={v=>setCForm({...cForm,category:v})} options={CHARGE_CATEGORIES} />
              <Input label="Libellé" value={cForm.label} onChange={v=>setCForm({...cForm,label:v})} />
              <Input label="Site" value={cForm.site} onChange={v=>setCForm({...cForm,site:v})} optObjects={[...siteOptions(sitesList),{value:"Tous",label:"Tous sites"}]} />
              <Input label="Montant (FCFA)" type="number" value={cForm.amount} onChange={v=>setCForm({...cForm,amount:v})} />
              <Input label="Notes / Fournisseur" value={cForm.notes} onChange={v=>setCForm({...cForm,notes:v})} />
            </div>
            <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:10 }}>
              <label style={{ fontSize:13, display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontFamily:FONT }}>
                <input type="checkbox" checked={cForm.paid} onChange={e=>setCForm({...cForm,paid:e.target.checked})} />
                Déjà payé / décaissé
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
                <thead>
                  <tr style={{ background:C.sand }}>
                    {["Date","Catégorie","Libellé","Site","Montant","Statut","Notes",""].map(h=>(
                      <th key={h} style={{ padding:"10px 11px", textAlign:"left", fontWeight:700, color:C.forest, fontFamily:FONT, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...charges].sort((a,b)=>b.date.localeCompare(a.date)).map((c,i)=>(
                    <tr key={c.id} style={{ background:i%2===0?C.white:C.cream }}>
                      <td style={td}>{c.date}</td>
                      <td style={td}><Badge color="amber">{c.category}</Badge></td>
                      <td style={{ ...td, fontWeight:600 }}>{c.label}</td>
                      <td style={td}>{c.site}</td>
                      <td style={{ ...td, fontWeight:700 }}>{c.amount.toLocaleString()} F</td>
                      <td style={td}>
                        <span onClick={()=>setCharges(charges.map(x=>x.id===c.id?{...x,paid:!x.paid}:x))} style={{ cursor:"pointer" }}>
                          <Badge color={c.paid?"green":"amber"}>{c.paid?"✅ Payé":"⏳ À payer"}</Badge>
                        </span>
                      </td>
                      <td style={{ ...td, color:C.muted }}>{c.notes||"—"}</td>
                      <td style={td}>
                        <div style={{ display:"flex", gap:5 }}>
                          <Btn small variant="secondary" onClick={()=>{setCForm({...c,amount:String(c.amount)});setEditingC(c.id);}}>✏️</Btn>
                          <Btn small variant="danger" onClick={()=>setCharges(charges.filter(x=>x.id!==c.id))}>🗑️</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {subTab==="synthese" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
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
                    <span style={{ fontWeight:700 }}>{x.amount.toLocaleString()} F <span style={{ color:C.muted, fontWeight:400 }}>({pct.toFixed(1)}%)</span></span>
                  </div>
                  <div style={{ height:7, background:C.sand, borderRadius:4 }}>
                    <div style={{ height:7, width:`${pct}%`, background:x.color, borderRadius:4 }} />
                  </div>
                </div>
              );
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
function loadLS(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── Supabase ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ftlkhqwtlrxyolfwhdyq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bGtocXd0bHJ4eW9sZndoZHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjUwMTgsImV4cCI6MjA5NTQ0MTAxOH0.KUpVjPE9HhHjWwFfj0p-jsdFQgIKXxi_G3X9YathOaQ";

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
const TABS = [
  { id:"dashboard",      label:"Tableau de bord",    icon:"📊" },
  { id:"sites",          label:"Sites",              icon:"📍" },
  { id:"species",        label:"Espèces",            icon:"🌿" },
  { id:"trees",          label:"Parcelles",          icon:"🌳" },
  { id:"selected",       label:"Sélection",          icon:"⭐" },
  { id:"nursery",        label:"Pépinière",          icon:"🌱" },
  { id:"harvest",        label:"Récoltes",           icon:"🧺" },
  { id:"sales",          label:"Ventes",             icon:"💰" },
  { id:"treatments",     label:"Interventions",      icon:"🌿" },
  { id:"hr",             label:"RH & Charges",       icon:"👷" },
  { id:"pnl",            label:"Compte Exploit.",    icon:"📄" },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
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

  const allLoading = [treesDB,harvestsDB,salesDB,treatsDB,nurseryDB,graftingsDB,staffDB,tempDB,chargesDB].some(d=>d.loading);
  const allSynced  = [treesDB,harvestsDB,salesDB,treatsDB,nurseryDB,graftingsDB,staffDB,tempDB,chargesDB].every(d=>d.synced);

  // Espèces, sites, arbres sélectionnés → localStorage uniquement
  const [species,       setSpeciesRaw]  = useState(()=>loadLS("vs_species",      initialSpecies));
  const [sitesList,     setSitesRaw]    = useState(()=>loadLS("vs_sites_list",   initialSitesList));
  const [selectedTrees, setSelRaw]      = useState(()=>loadLS("vs_selected",     initialSelectedTrees));

  const flash = () => { setSaveStatus("saved"); setTimeout(()=>setSaveStatus(""),2500); };
  const setSpecies       = v => { setSpeciesRaw(v);  saveLS("vs_species",    v); flash(); };

  // Ajoute une variété à une espèce depuis n'importe quel formulaire
  const handleAddVariety = (speciesName, newVariety) => {
    const updated = species.map(s =>
      s.name === speciesName && !s.varieties.includes(newVariety)
        ? { ...s, varieties: [...s.varieties, newVariety] }
        : s
    );
    setSpecies(updated);
  };
  const setSitesList     = v => { setSitesRaw(v);    saveLS("vs_sites_list", v); flash(); };
  const setSelectedTrees = v => { setSelRaw(v);      saveLS("vs_selected",   v); flash(); };

  // Wrappers setState-compatible pour modules existants
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
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.forest} 0%, ${C.green} 60%, ${C.ocre} 100%)`, padding:"16px 24px 0", boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
            {/* Logo Vegesoft */}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, backdropFilter:"blur(4px)" }}>🌿</div>
              <div>
                <div style={{ color:C.white, fontSize:22, fontWeight:800, letterSpacing:-0.5, fontFamily:FONT, lineHeight:1 }}>Vegesoft</div>
                <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11, fontFamily:FONT }}>Gestion de vergers tropicaux</div>
              </div>
            </div>
            <div style={{ flex:1 }} />
            {/* Badge connexion */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
              <div style={{ background:allSynced?"#D1FAE5":allLoading?"rgba(255,255,255,0.2)":"#FEF3C7", color:allSynced?"#065F46":allLoading?"rgba(255,255,255,0.9)":"#92400E", padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700, fontFamily:FONT, transition:"all 0.4s" }}>
                {allLoading?"⏳ Connexion...":allSynced?"☁️ Synchro OK":"⚠️ Mode local"}
              </div>
              {saveStatus==="saved"&&<div style={{ background:"#D1FAE5", color:"#065F46", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, fontFamily:FONT }}>✅ Sauvegardé</div>}
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display:"flex", gap:2, overflowX:"auto", scrollbarWidth:"none" }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?"rgba(255,255,255,0.95)":"transparent", color:tab===t.id?C.forest:"rgba(255,255,255,0.8)", border:"none", borderRadius:"8px 8px 0 0", padding:"8px 13px", fontSize:12, fontWeight:tab===t.id?700:500, cursor:"pointer", whiteSpace:"nowrap", fontFamily:FONT, transition:"all 0.15s" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"24px 16px" }}>
        {allLoading&&(
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:60, color:C.muted }}>
            <div style={{ fontSize:36 }}>⏳</div>
            <div>
              <div style={{ fontWeight:700, fontSize:16, fontFamily:FONT }}>Connexion à Supabase...</div>
              <div style={{ fontSize:13, fontFamily:FONT }}>Chargement de vos données</div>
            </div>
          </div>
        )}
        {!allLoading&&<>
          {tab==="dashboard"  && <Dashboard     trees={treesDB.rows} harvests={harvestsDB.rows} sales={salesDB.rows} treatments={treatsDB.rows} species={species} />}
          {tab==="sites"      && <SitesModule   sitesList={sitesList} setSitesList={setSitesList} />}
          {tab==="species"    && <SpeciesModule  species={species} setSpecies={setSpecies} />}
          {tab==="trees"      && <TreesModule    trees={treesDB.rows} setTrees={setTrees} species={species} sitesList={sitesList} onAddVariety={handleAddVariety} />}
          {tab==="selected"   && <SelectedTreesModule selectedTrees={selectedTrees} setSelectedTrees={setSelectedTrees} sitesList={sitesList} species={species} />}
          {tab==="nursery"    && <NurseryModule  batches={nurseryDB.rows} setBatches={setBatches} graftings={graftingsDB.rows} setGraftings={setGraftings} species={species} sitesList={sitesList} />}
          {tab==="harvest"    && <HarvestModule  harvests={harvestsDB.rows} setHarvests={setHarvests} species={species} sitesList={sitesList} onAddVariety={handleAddVariety} />}
          {tab==="sales"      && <SalesModule    sales={salesDB.rows} setSales={setSales} species={species} sitesList={sitesList} onAddVariety={handleAddVariety} />}
          {tab==="treatments" && <TreatmentsModule treatments={treatsDB.rows} setTreatments={setTreatments} species={species} sitesList={sitesList} />}
          {tab==="hr"         && <HRChargesModule staff={staffDB.rows} setStaff={setStaff} tempWork={tempDB.rows} setTempWork={setTempWork} charges={chargesDB.rows} setCharges={setCharges} sitesList={sitesList} />}
          {tab==="pnl"        && <PnLModule      sales={salesDB.rows} harvests={harvestsDB.rows} staff={staffDB.rows} tempWork={tempDB.rows} charges={chargesDB.rows} />}
        </>}
      </div>
    </div>
  );
}
