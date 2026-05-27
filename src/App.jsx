import { useState, useEffect } from "react";

// ─── Palette & styles globaux ───────────────────────────────────────────────
const COLORS = {
  forest: "#1B4332",
  green: "#2D6A4F",
  lime: "#52B788",
  gold: "#D4A017",
  amber: "#F4A261",
  cream: "#FEFAE0",
  sand: "#E9EDC9",
  bark: "#6B4226",
  text: "#1A1A2E",
  muted: "#6B7280",
  white: "#FFFFFF",
};


const VARIETIES = ["Hass", "Fuerte", "Polog", "Both 7", "Locale"];

// ─── Sites enrichis (code + nom + GPS) ──────────────────────────────────────
const initialSitesList = [
  { code: "Site A", name: "Plantation Mbankomo",  latDec: 3.8480,  lngDec: 11.5021, notes: "Site principal, zone basse" },
  { code: "Site B", name: "Plantation Ngousso",   latDec: 3.8712,  lngDec: 11.5234, notes: "Terrain en pente douce" },
  { code: "Site C", name: "Plantation Olembe",    latDec: 3.9102,  lngDec: 11.4987, notes: "Zone haute, bonne exposition" },
];

// ─── Utilitaires GPS ─────────────────────────────────────────────────────────
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
  // Accepte formats: 3°50'52.9"N ou 3 50 52.9 N
  try {
    const clean = dms.replace(/[°'"]/g, " ").trim();
    const parts = clean.split(/\s+/);
    const d = parseFloat(parts[0]);
    const m = parseFloat(parts[1]) || 0;
    const s = parseFloat(parts[2]) || 0;
    const dir = parts[3] || parts[parts.length - 1];
    let dec = d + m / 60 + s / 3600;
    if (dir === "S" || dir === "W") dec = -dec;
    return isNaN(dec) ? null : +dec.toFixed(6);
  } catch { return null; }
}
function formatGPS(latDec, lngDec) {
  if (!latDec || !lngDec) return "—";
  return `${latDec.toFixed(6)}, ${lngDec.toFixed(6)}`;
}
function formatDMS(latDec, lngDec) {
  if (!latDec || !lngDec) return "—";
  return `${decToDMS(latDec, true)} ${decToDMS(lngDec, false)}`;
}

// ─── Export helpers ───────────────────────────────────────────────────────────
function exportCSV(filename, headers, rows) {
  const lines = [headers.join(";"), ...rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";"))];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename + ".csv";
  a.click(); URL.revokeObjectURL(url);
}

function exportPDF(title, headers, rows, extraInfo = []) {
  const w = window.open("", "_blank");
  const styles = `
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a2e; margin: 20px; }
    h1 { color: #1B4332; font-size: 18px; margin-bottom: 4px; }
    .meta { color: #6B7280; font-size: 10px; margin-bottom: 12px; }
    .info { background: #F0FDF4; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #1B4332; color: white; padding: 7px 8px; text-align: left; font-size: 10px; }
    td { padding: 6px 8px; border-bottom: 1px solid #E9EDC9; font-size: 10px; }
    tr:nth-child(even) td { background: #FAFAF5; }
    .footer { margin-top: 20px; font-size: 9px; color: #9CA3AF; border-top: 1px solid #eee; padding-top: 8px; }
    @media print { button { display: none; } }
  `;
  const infoHTML = extraInfo.map(i => `<div><strong>${i.label}:</strong> ${i.val}</div>`).join(" &nbsp;|&nbsp; ");
  const headerHTML = headers.map(h => `<th>${h}</th>`).join("");
  const rowsHTML = rows.map(r => `<tr>${r.map(c => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>${styles}</style></head>
  <body>
  <button onclick="window.print()" style="background:#1B4332;color:white;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;margin-bottom:12px;font-size:12px;">🖨️ Imprimer / Sauvegarder en PDF</button>
  <h1>🥑 AvoManager Cameroun — ${title}</h1>
  <div class="meta">Exporté le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</div>
  ${infoHTML ? `<div class="info">${infoHTML}</div>` : ""}
  <table><thead><tr>${headerHTML}</tr></thead><tbody>${rowsHTML}</tbody></table>
  <div class="footer">AvoManager Cameroun — Document généré automatiquement</div>
  </body></html>`);
  w.document.close();
}

// Bouton export réutilisable
function ExportBar({ title, headers, rows, extraInfo = [], filename }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginBottom: 10 }}>
      <button onClick={() => exportPDF(title, headers, rows, extraInfo)} style={{
        background: "#DC2626", color: "white", border: "none", borderRadius: 8,
        padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
      }}>📄 Export PDF</button>
      <button onClick={() => exportCSV(filename || title, headers, rows)} style={{
        background: "#065F46", color: "white", border: "none", borderRadius: 8,
        padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
      }}>📊 Export Excel/CSV</button>
    </div>
  );
}

const initialTrees = [
  { id: 1, site: "Site A", variety: "Hass", count: 600, year: 2018, status: "Production" },
  { id: 2, site: "Site A", variety: "Fuerte", count: 400, year: 2019, status: "Production" },
  { id: 3, site: "Site B", variety: "Polog", count: 800, year: 2020, status: "Croissance" },
  { id: 4, site: "Site B", variety: "Both 7", count: 700, year: 2017, status: "Production" },
  { id: 5, site: "Site C", variety: "Locale", count: 500, year: 2021, status: "Croissance" },
  { id: 6, site: "Site C", variety: "Hass", count: 400, year: 2016, status: "Production" },
];

const initialHarvests = [
  { id: 1, date: "2024-03-10", site: "Site A", variety: "Hass", qty: 1200, unit: "kg", notes: "Bonne qualité" },
  { id: 2, date: "2024-03-18", site: "Site B", variety: "Both 7", qty: 980, unit: "kg", notes: "" },
  { id: 3, date: "2024-04-02", site: "Site A", variety: "Fuerte", qty: 750, unit: "kg", notes: "Calibre moyen" },
  { id: 4, date: "2024-04-15", site: "Site C", variety: "Hass", qty: 1100, unit: "kg", notes: "Export qualité" },
];

const initialSales = [
  { id: 1, date: "2024-03-12", buyer: "Marché Bafoussam", qty: 500, unit: "kg", price: 350, variety: "Hass", paid: true },
  { id: 2, date: "2024-03-20", buyer: "Exportateur Douala", qty: 900, unit: "kg", price: 480, variety: "Both 7", paid: true },
  { id: 3, date: "2024-04-05", buyer: "Supermarché Yaoundé", qty: 400, unit: "kg", price: 520, variety: "Fuerte", paid: false },
  { id: 4, date: "2024-04-18", buyer: "Marché local", qty: 300, unit: "kg", price: 280, variety: "Hass", paid: true },
];

// Pépinières : lots de plants en cours de production
const initialNurseryBatches = [
  { id: 1, name: "Lot P-2024-01", startDate: "2024-01-10", site: "Site A", variety: "Hass", qtySeeds: 200, qtyAlive: 185, stage: "Prêt à greffer", notes: "Porte-greffe Locale vigoureux" },
  { id: 2, name: "Lot P-2024-02", startDate: "2024-02-05", site: "Site B", variety: "Fuerte", qtySeeds: 300, qtyAlive: 270, stage: "Germination", notes: "" },
  { id: 3, name: "Lot P-2024-03", startDate: "2024-03-01", site: "Site C", variety: "Both 7", qtySeeds: 150, qtyAlive: 140, stage: "Levée", notes: "Bonne germination" },
];

// Greffages : opérations de greffage réalisées
const initialGraftings = [
  { id: 1, date: "2024-03-15", batchId: 1, batchName: "Lot P-2024-01", technique: "Fente", rootstock: "Locale", scion: "Hass", qtyGrafted: 150, qtySuccess: 132, checkDate: "2024-04-15", status: "Succès contrôlé", destination: "Plantation Site A", notes: "Taux de reprise 88%" },
  { id: 2, date: "2024-04-01", batchId: 1, batchName: "Lot P-2024-01", technique: "Écusson", rootstock: "Locale", scion: "Fuerte", qtyGrafted: 30, qtySuccess: 0, checkDate: "2024-05-01", status: "En attente contrôle", destination: "Vente", notes: "" },
];

const initialTreatments = [
  { id: 1, date: "2024-02-15", site: "Site A", type: "Engrais", product: "NPK 20-10-10", qty: 50, unit: "kg", notes: "" },
  { id: 2, date: "2024-03-01", site: "Site B", type: "Irrigation", product: "—", qty: 0, unit: "", notes: "Début saison sèche" },
  { id: 3, date: "2024-03-20", site: "Site C", type: "Traitement", product: "Fongicide cuivre", qty: 20, unit: "L", notes: "Anthracnose" },
  { id: 4, date: "2024-04-10", site: "Site A", type: "Taille", product: "—", qty: 0, unit: "", notes: "Taille de formation" },
];

// ─── Main d'œuvre permanente ─────────────────────────────────────────────────
const initialPermanentStaff = [
  { id: 1, name: "Jean-Baptiste Mballa", role: "Chef de site", site: "Site A", salary: 85000, startDate: "2018-03-01", status: "Actif", phone: "6XX XXX XXX", notes: "" },
  { id: 2, name: "Suzanne Nkoa", role: "Ouvrière agricole", site: "Site B", salary: 55000, startDate: "2020-06-15", status: "Actif", phone: "", notes: "" },
  { id: 3, name: "Paul Etoga", role: "Greffeur", site: "Site A", salary: 65000, startDate: "2019-01-10", status: "Actif", phone: "", notes: "Spécialiste greffage" },
  { id: 4, name: "Marie Abega", role: "Ouvrière agricole", site: "Site C", salary: 55000, startDate: "2021-04-01", status: "Actif", phone: "", notes: "" },
];

// ─── Main d'œuvre temporaire ─────────────────────────────────────────────────
const initialTempWork = [
  { id: 1, date: "2024-03-10", site: "Site A", task: "Récolte", nbWorkers: 12, nbDays: 2, dailyRate: 3000, total: 72000, notes: "Récolte Hass" },
  { id: 2, date: "2024-03-20", site: "Site B", task: "Désherbage", nbWorkers: 8, nbDays: 3, dailyRate: 2500, total: 60000, notes: "" },
  { id: 3, date: "2024-04-05", site: "Site C", task: "Application engrais", nbWorkers: 5, nbDays: 1, dailyRate: 3000, total: 15000, notes: "" },
];

// ─── Charges exploitation ─────────────────────────────────────────────────────
const CHARGE_CATEGORIES = [
  "Intrants agricoles",
  "Carburant & transport",
  "Matériel & équipements",
  "Entretien & réparations",
  "Irrigation & eau",
  "Emballage & stockage",
  "Frais vétérinaires / santé végétale",
  "Location terrain",
  "Impôts & taxes",
  "Certification & normes",
  "Communication & divers",
  "Amortissements",
];

const initialCharges = [
  { id: 1, date: "2024-01-15", category: "Intrants agricoles", label: "NPK 20-10-10 (50 sacs)", site: "Site A", amount: 125000, paid: true, notes: "" },
  { id: 2, date: "2024-02-10", category: "Carburant & transport", label: "Gasoil groupe électrogène", site: "Site B", amount: 45000, paid: true, notes: "Pompe irrigation" },
  { id: 3, date: "2024-02-20", category: "Matériel & équipements", label: "Sécateurs et cisailles", site: "Tous", amount: 38000, paid: true, notes: "" },
  { id: 4, date: "2024-03-05", category: "Emballage & stockage", label: "Caisses en bois (100 unités)", site: "Site A", amount: 60000, paid: false, notes: "" },
  { id: 5, date: "2024-03-25", category: "Intrants agricoles", label: "Fongicide cuivre (20L)", site: "Site C", amount: 32000, paid: true, notes: "Traitement anthracnose" },
  { id: 6, date: "2024-04-01", category: "Carburant & transport", label: "Transport récolte Douala", site: "Site A", amount: 55000, paid: true, notes: "" },
];

// ─── Avocatiers sélectionnés ──────────────────────────────────────────────────
const initialSelectedTrees = [
  { id: 1, ref: "AVO-A-001", site: "Site A", variety: "Hass", year: 2016, latDec: 3.84803, lngDec: 11.50215, reason: "Performance de récolte exceptionnelle", notes: "Production moyenne 120kg/an", status: "Actif" },
  { id: 2, ref: "AVO-A-002", site: "Site A", variety: "Fuerte", year: 2017, latDec: 3.84756, lngDec: 11.50198, reason: "Qualité du fruit (calibre, goût)", notes: "Fruits de calibre A+", status: "Actif" },
  { id: 3, ref: "AVO-B-001", site: "Site B", variety: "Both 7", year: 2015, latDec: 3.87124, lngDec: 11.52341, reason: "Potentiel porte-greffe", notes: "Système racinaire exceptionnel", status: "Actif" },
];

// ─── Composants utilitaires ──────────────────────────────────────────────────
const Badge = ({ color, children }) => (
  <span style={{
    background: color === "green" ? "#D1FAE5" : color === "amber" ? "#FEF3C7" : "#F3F4F6",
    color: color === "green" ? "#065F46" : color === "amber" ? "#92400E" : "#374151",
    padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
  }}>{children}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: COLORS.white, borderRadius: 16, padding: 20,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)", ...style,
  }}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color }) => (
  <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{
      width: 52, height: 52, borderRadius: 14,
      background: color || COLORS.lime,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 24, flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.forest, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  </Card>
);

const Input = ({ label, value, onChange, type = "text", options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        <option value="">-- Choisir --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
    )}
  </div>
);

const inputStyle = {
  border: `1.5px solid ${COLORS.sand}`, borderRadius: 10, padding: "9px 12px",
  fontSize: 14, color: COLORS.text, background: COLORS.cream, outline: "none",
  fontFamily: "inherit",
};

const Btn = ({ children, onClick, variant = "primary", small }) => (
  <button onClick={onClick} style={{
    background: variant === "primary" ? COLORS.green : variant === "danger" ? "#EF4444" : COLORS.sand,
    color: variant === "primary" ? COLORS.white : variant === "danger" ? COLORS.white : COLORS.forest,
    border: "none", borderRadius: 10, padding: small ? "6px 14px" : "10px 22px",
    fontSize: small ? 12 : 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
    transition: "opacity 0.15s",
  }}>{children}</button>
);

// ─── MODULE : Tableau de bord ────────────────────────────────────────────────
function Dashboard({ trees, harvests, sales, treatments }) {
  const totalTrees = trees.reduce((s, t) => s + t.count, 0);
  const totalHarvest = harvests.reduce((s, h) => s + h.qty, 0);
  const totalRevenue = sales.reduce((s, v) => s + v.qty * v.price, 0);
  const unpaid = sales.filter(s => !s.paid).reduce((s, v) => s + v.qty * v.price, 0);
  const lastTreatments = [...treatments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  const bySite = SITES.map(s => ({
    name: s,
    count: trees.filter(t => t.site === s).reduce((a, t) => a + t.count, 0),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        <StatCard icon="🥑" label="Avocatiers" value={totalTrees.toLocaleString()} sub="sur 3 sites" color="#BBF7D0" />
        <StatCard icon="🧺" label="Récoltes" value={`${totalHarvest.toLocaleString()} kg`} sub={`${harvests.length} sessions`} color="#FEF9C3" />
        <StatCard icon="💰" label="Revenus" value={`${(totalRevenue / 1000).toFixed(0)}K FCFA`} sub="total ventes" color="#DBEAFE" />
        <StatCard icon="⚠️" label="Impayés" value={`${(unpaid / 1000).toFixed(0)}K FCFA`} sub="à encaisser" color="#FEE2E2" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <Card>
          <h3 style={sectionTitle}>🌳 Arbres par site</h3>
          {bySite.map(s => (
            <div key={s.name} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span style={{ color: COLORS.green, fontWeight: 700 }}>{s.count.toLocaleString()} arbres</span>
              </div>
              <div style={{ height: 8, background: COLORS.sand, borderRadius: 4 }}>
                <div style={{ height: 8, width: `${(s.count / totalTrees) * 100}%`, background: COLORS.lime, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h3 style={sectionTitle}>📋 Dernières interventions</h3>
          {lastTreatments.map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${COLORS.sand}` }}>
              <div style={{ fontSize: 20 }}>
                {t.type === "Engrais" ? "🌿" : t.type === "Taille" ? "✂️" : t.type === "Irrigation" ? "💧" : "🧪"}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.type} — {t.site}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{t.date} · {t.product !== "—" ? t.product : t.notes}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h3 style={sectionTitle}>📦 Dernières ventes</h3>
          {[...sales].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(v => (
            <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.sand}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{v.buyer}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{v.date} · {v.qty} kg · {v.variety}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.forest }}>{(v.qty * v.price).toLocaleString()} F</div>
                <Badge color={v.paid ? "green" : "amber"}>{v.paid ? "Payé" : "En attente"}</Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── MODULE : Arbres ─────────────────────────────────────────────────────────
function TreesModule({ trees, setTrees }) {
  const [form, setForm] = useState({ site: "", variety: "", count: "", year: "", status: "Croissance" });
  const [editing, setEditing] = useState(null);

  const save = () => {
    if (!form.site || !form.variety || !form.count) return;
    if (editing) {
      setTrees(trees.map(t => t.id === editing ? { ...form, id: editing, count: +form.count, year: +form.year } : t));
      setEditing(null);
    } else {
      setTrees([...trees, { ...form, id: Date.now(), count: +form.count, year: +form.year }]);
    }
    setForm({ site: "", variety: "", count: "", year: "", status: "Croissance" });
  };

  const edit = (t) => { setForm({ ...t, count: String(t.count), year: String(t.year) }); setEditing(t.id); };
  const del = (id) => setTrees(trees.filter(t => t.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <h3 style={sectionTitle}>{editing ? "✏️ Modifier la parcelle" : "➕ Ajouter une parcelle"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <Input label="Site" value={form.site} onChange={v => setForm({ ...form, site: v })} options={SITES} />
          <Input label="Variété" value={form.variety} onChange={v => setForm({ ...form, variety: v })} options={VARIETIES} />
          <Input label="Nombre d'arbres" type="number" value={form.count} onChange={v => setForm({ ...form, count: v })} />
          <Input label="Année plantation" type="number" value={form.year} onChange={v => setForm({ ...form, year: v })} />
          <Input label="Statut" value={form.status} onChange={v => setForm({ ...form, status: v })} options={["Croissance", "Production", "Vieillissant"]} />
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <Btn onClick={save}>{editing ? "Enregistrer" : "Ajouter"}</Btn>
          {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm({ site: "", variety: "", count: "", year: "", status: "Croissance" }); }}>Annuler</Btn>}
        </div>
      </Card>

      <ExportBar
        title="Parcelles"
        headers={["Site","Variété","Nb arbres","Année plantation","Statut","Notes"]}
        rows={trees.map(t=>[t.site,t.variety,t.count,t.year,t.status,t.notes||"—"])}
        extraInfo={[{label:"Total arbres",val:trees.reduce((s,t)=>s+t.count,0).toLocaleString()}]}
        filename="parcelles"
      />
      <Card>
        <h3 style={sectionTitle}>🌳 Mes parcelles ({trees.reduce((s, t) => s + t.count, 0).toLocaleString()} arbres)</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: COLORS.sand }}>
                {["Site", "Variété", "Arbres", "Plantation", "Statut", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.forest, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trees.map((t, i) => (
                <tr key={t.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                  <td style={td}>{t.site}</td>
                  <td style={td}><Badge color="green">{t.variety}</Badge></td>
                  <td style={{ ...td, fontWeight: 700 }}>{t.count.toLocaleString()}</td>
                  <td style={td}>{t.year}</td>
                  <td style={td}><Badge color={t.status === "Production" ? "green" : "amber"}>{t.status}</Badge></td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn small variant="secondary" onClick={() => edit(t)}>✏️</Btn>
                      <Btn small variant="danger" onClick={() => del(t.id)}>🗑️</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE : Récoltes ───────────────────────────────────────────────────────
function HarvestModule({ harvests, setHarvests }) {
  const [form, setForm] = useState({ date: "", site: "", variety: "", qty: "", unit: "kg", notes: "" });

  const save = () => {
    if (!form.date || !form.site || !form.qty) return;
    setHarvests([...harvests, { ...form, id: Date.now(), qty: +form.qty }]);
    setForm({ date: "", site: "", variety: "", qty: "", unit: "kg", notes: "" });
  };

  const del = (id) => setHarvests(harvests.filter(h => h.id !== id));
  const total = harvests.reduce((s, h) => s + h.qty, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <h3 style={sectionTitle}>➕ Enregistrer une récolte</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <Input label="Date" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
          <Input label="Site" value={form.site} onChange={v => setForm({ ...form, site: v })} options={SITES} />
          <Input label="Variété" value={form.variety} onChange={v => setForm({ ...form, variety: v })} options={VARIETIES} />
          <Input label="Quantité (kg)" type="number" value={form.qty} onChange={v => setForm({ ...form, qty: v })} />
          <Input label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
        </div>
        <div style={{ marginTop: 14 }}><Btn onClick={save}>Enregistrer</Btn></div>
      </Card>

      <ExportBar
        title="Récoltes"
        headers={["Date","Site","Variété","Quantité (kg)","Notes"]}
        rows={[...harvests].sort((a,b)=>b.date.localeCompare(a.date)).map(h=>[h.date,h.site,h.variety,h.qty,h.notes])}
        filename="recoltes"
      />
      <Card>
        <h3 style={sectionTitle}>🧺 Historique des récoltes — Total : {total.toLocaleString()} kg</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: COLORS.sand }}>
                {["Date", "Site", "Variété", "Quantité", "Notes", ""].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.forest }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...harvests].sort((a, b) => b.date.localeCompare(a.date)).map((h, i) => (
                <tr key={h.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                  <td style={td}>{h.date}</td>
                  <td style={td}>{h.site}</td>
                  <td style={td}><Badge color="green">{h.variety}</Badge></td>
                  <td style={{ ...td, fontWeight: 700 }}>{h.qty.toLocaleString()} kg</td>
                  <td style={{ ...td, color: COLORS.muted }}>{h.notes || "—"}</td>
                  <td style={td}><Btn small variant="danger" onClick={() => del(h.id)}>🗑️</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE : Ventes ─────────────────────────────────────────────────────────
function SalesModule({ sales, setSales }) {
  const [form, setForm] = useState({ date: "", buyer: "", qty: "", price: "", variety: "", paid: false });

  const save = () => {
    if (!form.date || !form.buyer || !form.qty || !form.price) return;
    setSales([...sales, { ...form, id: Date.now(), qty: +form.qty, price: +form.price }]);
    setForm({ date: "", buyer: "", qty: "", price: "", variety: "", paid: false });
  };

  const togglePaid = (id) => setSales(sales.map(s => s.id === id ? { ...s, paid: !s.paid } : s));
  const del = (id) => setSales(sales.filter(s => s.id !== id));

  const totalRevenue = sales.reduce((s, v) => s + v.qty * v.price, 0);
  const totalPaid = sales.filter(s => s.paid).reduce((s, v) => s + v.qty * v.price, 0);
  const totalUnpaid = totalRevenue - totalPaid;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <StatCard icon="💰" label="Total revenus" value={`${(totalRevenue / 1000).toFixed(0)}K FCFA`} color="#DBEAFE" />
        <StatCard icon="✅" label="Encaissé" value={`${(totalPaid / 1000).toFixed(0)}K FCFA`} color="#D1FAE5" />
        <StatCard icon="⏳" label="En attente" value={`${(totalUnpaid / 1000).toFixed(0)}K FCFA`} color="#FEF3C7" />
      </div>

      <Card>
        <h3 style={sectionTitle}>➕ Enregistrer une vente</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <Input label="Date" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
          <Input label="Acheteur" value={form.buyer} onChange={v => setForm({ ...form, buyer: v })} />
          <Input label="Variété" value={form.variety} onChange={v => setForm({ ...form, variety: v })} options={VARIETIES} />
          <Input label="Quantité (kg)" type="number" value={form.qty} onChange={v => setForm({ ...form, qty: v })} />
          <Input label="Prix / kg (FCFA)" type="number" value={form.price} onChange={v => setForm({ ...form, price: v })} />
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={form.paid} onChange={e => setForm({ ...form, paid: e.target.checked })} />
            Déjà payé
          </label>
        </div>
        <div style={{ marginTop: 12 }}><Btn onClick={save}>Enregistrer</Btn></div>
      </Card>

      <ExportBar
        title="Ventes"
        headers={["Date","Acheteur","Variété","Quantité (kg)","Prix/kg","Total (FCFA)","Statut"]}
        rows={[...sales].sort((a,b)=>b.date.localeCompare(a.date)).map(v=>[v.date,v.buyer,v.variety,v.qty,v.price,v.qty*v.price,v.paid?"Payé":"En attente"])}
        filename="ventes"
      />
      <Card>
        <h3 style={sectionTitle}>📦 Historique des ventes</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: COLORS.sand }}>
                {["Date", "Acheteur", "Variété", "Qté", "Prix/kg", "Total", "Statut", ""].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.forest, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...sales].sort((a, b) => b.date.localeCompare(a.date)).map((v, i) => (
                <tr key={v.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                  <td style={td}>{v.date}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{v.buyer}</td>
                  <td style={td}><Badge color="green">{v.variety}</Badge></td>
                  <td style={td}>{v.qty} kg</td>
                  <td style={td}>{v.price} F</td>
                  <td style={{ ...td, fontWeight: 700, color: COLORS.forest }}>{(v.qty * v.price).toLocaleString()} F</td>
                  <td style={td}>
                    <span onClick={() => togglePaid(v.id)} style={{ cursor: "pointer" }}>
                      <Badge color={v.paid ? "green" : "amber"}>{v.paid ? "✅ Payé" : "⏳ Attente"}</Badge>
                    </span>
                  </td>
                  <td style={td}><Btn small variant="danger" onClick={() => del(v.id)}>🗑️</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE : Traitements ────────────────────────────────────────────────────
function TreatmentsModule({ treatments, setTreatments }) {
  const [form, setForm] = useState({ date: "", site: "", type: "", product: "", qty: "", unit: "kg", notes: "" });

  const save = () => {
    if (!form.date || !form.site || !form.type) return;
    setTreatments([...treatments, { ...form, id: Date.now(), qty: +form.qty }]);
    setForm({ date: "", site: "", type: "", product: "", qty: "", unit: "kg", notes: "" });
  };

  const del = (id) => setTreatments(treatments.filter(t => t.id !== id));

  const typeIcon = { Engrais: "🌿", Taille: "✂️", Irrigation: "💧", Traitement: "🧪", Autre: "📝" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <h3 style={sectionTitle}>➕ Enregistrer une intervention</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <Input label="Date" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
          <Input label="Site" value={form.site} onChange={v => setForm({ ...form, site: v })} options={SITES} />
          <Input label="Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={["Engrais", "Traitement", "Irrigation", "Taille", "Autre"]} />
          <Input label="Produit / Détail" value={form.product} onChange={v => setForm({ ...form, product: v })} />
          <Input label="Quantité" type="number" value={form.qty} onChange={v => setForm({ ...form, qty: v })} />
          <Input label="Unité" value={form.unit} onChange={v => setForm({ ...form, unit: v })} options={["kg", "L", "sacs", "—"]} />
          <Input label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
        </div>
        <div style={{ marginTop: 14 }}><Btn onClick={save}>Enregistrer</Btn></div>
      </Card>

      <ExportBar
        title="Interventions"
        headers={["Date","Site","Type","Produit","Quantité","Notes"]}
        rows={[...treatments].sort((a,b)=>b.date.localeCompare(a.date)).map(t=>[t.date,t.site,t.type,t.product||"—",t.qty?`${t.qty} ${t.unit}`:"—",t.notes||"—"])}
        filename="interventions"
      />
      <Card>
        <h3 style={sectionTitle}>📋 Historique des interventions ({treatments.length})</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: COLORS.sand }}>
                {["Date", "Site", "Type", "Produit", "Quantité", "Notes", ""].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.forest }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...treatments].sort((a, b) => b.date.localeCompare(a.date)).map((t, i) => (
                <tr key={t.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                  <td style={td}>{t.date}</td>
                  <td style={td}>{t.site}</td>
                  <td style={td}>{typeIcon[t.type] || "📝"} {t.type}</td>
                  <td style={td}>{t.product || "—"}</td>
                  <td style={td}>{t.qty ? `${t.qty} ${t.unit}` : "—"}</td>
                  <td style={{ ...td, color: COLORS.muted }}>{t.notes || "—"}</td>
                  <td style={td}><Btn small variant="danger" onClick={() => del(t.id)}>🗑️</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE : Pépinière & Greffage ──────────────────────────────────────────
const STAGES = ["Semis", "Germination", "Levée", "Croissance porte-greffe", "Prêt à greffer", "Greffé", "Sevré", "Prêt à planter"];
const GRAFT_TECHNIQUES = ["Fente", "Écusson", "Approche", "Couronne", "Chip budding"];
const GRAFT_STATUSES = ["En attente contrôle", "Succès contrôlé", "Échec partiel", "Échec total", "Planté", "Vendu"];

function NurseryModule({ batches, setBatches, graftings, setGraftings }) {
  const [subTab, setSubTab] = useState("batches");
  const [batchForm, setBatchForm] = useState({ name: "", startDate: "", site: "", variety: "", qtySeeds: "", qtyAlive: "", stage: "Semis", notes: "" });
  const [graftForm, setGraftForm] = useState({ date: "", batchId: "", technique: "", rootstock: "Locale", scion: "", qtyGrafted: "", qtySuccess: "", checkDate: "", status: "En attente contrôle", destination: "", notes: "" });
  const [editingBatch, setEditingBatch] = useState(null);
  const [editingGraft, setEditingGraft] = useState(null);

  // ── Stats globales pépinière ──
  const totalSeeds = batches.reduce((s, b) => s + b.qtySeeds, 0);
  const totalAlive = batches.reduce((s, b) => s + b.qtyAlive, 0);
  const totalGrafted = graftings.reduce((s, g) => s + g.qtyGrafted, 0);
  const totalSuccess = graftings.reduce((s, g) => s + (g.qtySuccess || 0), 0);
  const successRate = totalGrafted > 0 ? Math.round((totalSuccess / totalGrafted) * 100) : 0;
  const readyToPlant = batches.filter(b => b.stage === "Prêt à planter").reduce((s, b) => s + b.qtyAlive, 0);

  // ── Sauvegarde lot ──
  const saveBatch = () => {
    if (!batchForm.name || !batchForm.startDate || !batchForm.site) return;
    const entry = { ...batchForm, id: editingBatch || Date.now(), qtySeeds: +batchForm.qtySeeds, qtyAlive: +batchForm.qtyAlive };
    setBatches(editingBatch ? batches.map(b => b.id === editingBatch ? entry : b) : [...batches, entry]);
    setEditingBatch(null);
    setBatchForm({ name: "", startDate: "", site: "", variety: "", qtySeeds: "", qtyAlive: "", stage: "Semis", notes: "" });
  };
  const editBatch = (b) => { setBatchForm({ ...b, qtySeeds: String(b.qtySeeds), qtyAlive: String(b.qtyAlive) }); setEditingBatch(b.id); setSubTab("batches"); };
  const delBatch = (id) => setBatches(batches.filter(b => b.id !== id));

  // ── Sauvegarde greffage ──
  const saveGraft = () => {
    if (!graftForm.date || !graftForm.technique || !graftForm.qtyGrafted) return;
    const batch = batches.find(b => b.id === +graftForm.batchId);
    const entry = { ...graftForm, id: editingGraft || Date.now(), batchName: batch ? batch.name : "—", qtyGrafted: +graftForm.qtyGrafted, qtySuccess: +graftForm.qtySuccess || 0 };
    setGraftings(editingGraft ? graftings.map(g => g.id === editingGraft ? entry : g) : [...graftings, entry]);
    setEditingGraft(null);
    setGraftForm({ date: "", batchId: "", technique: "", rootstock: "Locale", scion: "", qtyGrafted: "", qtySuccess: "", checkDate: "", status: "En attente contrôle", destination: "", notes: "" });
  };
  const editGraft = (g) => { setGraftForm({ ...g, qtyGrafted: String(g.qtyGrafted), qtySuccess: String(g.qtySuccess) }); setEditingGraft(g.id); setSubTab("graftings"); };
  const delGraft = (id) => setGraftings(graftings.filter(g => g.id !== id));

  const statusColor = (s) => {
    if (s === "Succès contrôlé" || s === "Planté") return "green";
    if (s === "Échec partiel" || s === "Échec total") return "red";
    return "amber";
  };
  const stageColor = (s) => {
    if (s === "Prêt à planter" || s === "Prêt à greffer") return "green";
    if (s === "Greffé" || s === "Sevré") return "blue";
    return "amber";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        <StatCard icon="🌱" label="Graines semées" value={totalSeeds.toLocaleString()} sub="total lots" color="#D1FAE5" />
        <StatCard icon="🪴" label="Plants vivants" value={totalAlive.toLocaleString()} sub={`${totalSeeds > 0 ? Math.round((totalAlive/totalSeeds)*100) : 0}% survie`} color="#DCFCE7" />
        <StatCard icon="✂️" label="Greffés" value={totalGrafted.toLocaleString()} sub={`${graftings.length} opérations`} color="#FEF9C3" />
        <StatCard icon="📈" label="Taux de reprise" value={`${successRate}%`} sub={`${totalSuccess} réussis`} color={successRate >= 80 ? "#D1FAE5" : "#FEE2E2"} />
        <StatCard icon="🌳" label="Prêts à planter" value={readyToPlant} sub="plants disponibles" color="#E0E7FF" />
      </div>

      {/* Sous-onglets */}
      <div style={{ display: "flex", gap: 8, borderBottom: `2px solid ${COLORS.sand}` }}>
        {[{ id: "batches", label: "🌱 Lots de pépinière" }, { id: "graftings", label: "✂️ Greffages" }, { id: "timeline", label: "📅 Suivi visuel" }].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            background: subTab === t.id ? COLORS.green : "transparent",
            color: subTab === t.id ? COLORS.white : COLORS.forest,
            border: "none", borderRadius: "8px 8px 0 0", padding: "8px 18px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── LOTS ── */}
      {subTab === "batches" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={sectionTitle}>{editingBatch ? "✏️ Modifier le lot" : "➕ Nouveau lot de pépinière"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              <Input label="Nom du lot" value={batchForm.name} onChange={v => setBatchForm({ ...batchForm, name: v })} />
              <Input label="Date de semis" type="date" value={batchForm.startDate} onChange={v => setBatchForm({ ...batchForm, startDate: v })} />
              <Input label="Site" value={batchForm.site} onChange={v => setBatchForm({ ...batchForm, site: v })} options={SITES} />
              <Input label="Variété cible" value={batchForm.variety} onChange={v => setBatchForm({ ...batchForm, variety: v })} options={VARIETIES} />
              <Input label="Nb graines semées" type="number" value={batchForm.qtySeeds} onChange={v => setBatchForm({ ...batchForm, qtySeeds: v })} />
              <Input label="Nb plants vivants" type="number" value={batchForm.qtyAlive} onChange={v => setBatchForm({ ...batchForm, qtyAlive: v })} />
              <Input label="Stade actuel" value={batchForm.stage} onChange={v => setBatchForm({ ...batchForm, stage: v })} options={STAGES} />
              <Input label="Notes" value={batchForm.notes} onChange={v => setBatchForm({ ...batchForm, notes: v })} />
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <Btn onClick={saveBatch}>{editingBatch ? "Enregistrer" : "Ajouter"}</Btn>
              {editingBatch && <Btn variant="secondary" onClick={() => { setEditingBatch(null); setBatchForm({ name: "", startDate: "", site: "", variety: "", qtySeeds: "", qtyAlive: "", stage: "Semis", notes: "" }); }}>Annuler</Btn>}
            </div>
          </Card>

          <ExportBar
            title="Lots Pépinière"
            headers={["Lot","Date semis","Site","Variété","Graines","Vivants","Survie %","Stade","Notes"]}
            rows={batches.map(b=>[b.name,b.startDate,b.site,b.variety,b.qtySeeds,b.qtyAlive,b.qtySeeds>0?Math.round(b.qtyAlive/b.qtySeeds*100)+"%" :"—",b.stage,b.notes||"—"])}
            filename="pepiniere_lots"
          />
          <Card>
            <h3 style={sectionTitle}>🪴 Lots en cours ({batches.length})</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: COLORS.sand }}>
                    {["Lot", "Date semis", "Site", "Variété", "Graines", "Vivants", "Survie", "Stade", "Notes", ""].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.forest, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b, i) => {
                    const survie = b.qtySeeds > 0 ? Math.round((b.qtyAlive / b.qtySeeds) * 100) : 0;
                    return (
                      <tr key={b.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                        <td style={{ ...td, fontWeight: 700 }}>{b.name}</td>
                        <td style={td}>{b.startDate}</td>
                        <td style={td}>{b.site}</td>
                        <td style={td}><Badge color="green">{b.variety}</Badge></td>
                        <td style={td}>{b.qtySeeds}</td>
                        <td style={{ ...td, fontWeight: 700, color: COLORS.forest }}>{b.qtyAlive}</td>
                        <td style={td}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 50, height: 7, background: COLORS.sand, borderRadius: 4 }}>
                              <div style={{ height: 7, width: `${survie}%`, background: survie >= 80 ? COLORS.lime : survie >= 60 ? COLORS.amber : "#EF4444", borderRadius: 4 }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600 }}>{survie}%</span>
                          </div>
                        </td>
                        <td style={td}><Badge color={stageColor(b.stage)}>{b.stage}</Badge></td>
                        <td style={{ ...td, color: COLORS.muted, fontSize: 12 }}>{b.notes || "—"}</td>
                        <td style={td}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <Btn small variant="secondary" onClick={() => editBatch(b)}>✏️</Btn>
                            <Btn small variant="danger" onClick={() => delBatch(b.id)}>🗑️</Btn>
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
      )}

      {/* ── GREFFAGES ── */}
      {subTab === "graftings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={sectionTitle}>{editingGraft ? "✏️ Modifier l'opération" : "➕ Enregistrer un greffage"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              <Input label="Date du greffage" type="date" value={graftForm.date} onChange={v => setGraftForm({ ...graftForm, date: v })} />
              <Input label="Lot source" value={graftForm.batchId} onChange={v => setGraftForm({ ...graftForm, batchId: v })}
                options={batches.map(b => b.id)} />
              {/* override select pour afficher le nom */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>Lot source</label>
                <select value={graftForm.batchId} onChange={e => setGraftForm({ ...graftForm, batchId: e.target.value })} style={inputStyle}>
                  <option value="">-- Choisir --</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.qtyAlive} plants)</option>)}
                </select>
              </div>
              <Input label="Technique" value={graftForm.technique} onChange={v => setGraftForm({ ...graftForm, technique: v })} options={GRAFT_TECHNIQUES} />
              <Input label="Porte-greffe" value={graftForm.rootstock} onChange={v => setGraftForm({ ...graftForm, rootstock: v })} options={VARIETIES} />
              <Input label="Greffon (variété)" value={graftForm.scion} onChange={v => setGraftForm({ ...graftForm, scion: v })} options={VARIETIES} />
              <Input label="Nb greffés" type="number" value={graftForm.qtyGrafted} onChange={v => setGraftForm({ ...graftForm, qtyGrafted: v })} />
              <Input label="Nb reprises (si contrôlé)" type="number" value={graftForm.qtySuccess} onChange={v => setGraftForm({ ...graftForm, qtySuccess: v })} />
              <Input label="Date contrôle prévue" type="date" value={graftForm.checkDate} onChange={v => setGraftForm({ ...graftForm, checkDate: v })} />
              <Input label="Statut" value={graftForm.status} onChange={v => setGraftForm({ ...graftForm, status: v })} options={GRAFT_STATUSES} />
              <Input label="Destination" value={graftForm.destination} onChange={v => setGraftForm({ ...graftForm, destination: v })} options={["Plantation Site A", "Plantation Site B", "Plantation Site C", "Vente", "Don", "Autre"]} />
              <Input label="Notes" value={graftForm.notes} onChange={v => setGraftForm({ ...graftForm, notes: v })} />
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <Btn onClick={saveGraft}>{editingGraft ? "Enregistrer" : "Ajouter"}</Btn>
              {editingGraft && <Btn variant="secondary" onClick={() => { setEditingGraft(null); setGraftForm({ date: "", batchId: "", technique: "", rootstock: "Locale", scion: "", qtyGrafted: "", qtySuccess: "", checkDate: "", status: "En attente contrôle", destination: "", notes: "" }); }}>Annuler</Btn>}
            </div>
          </Card>

          <ExportBar
            title="Greffages"
            headers={["Date","Lot","Technique","Porte-greffe","Greffon","Greffés","Reprises","Taux %","Contrôle","Statut","Destination","Notes"]}
            rows={[...graftings].sort((a,b)=>b.date.localeCompare(a.date)).map(g=>[g.date,g.batchName,g.technique,g.rootstock,g.scion,g.qtyGrafted,g.qtySuccess||"—",g.qtyGrafted>0&&g.qtySuccess>0?Math.round(g.qtySuccess/g.qtyGrafted*100)+"%":"—",g.checkDate||"—",g.status,g.destination||"—",g.notes||"—"])}
            filename="greffages"
          />
          <Card>
            <h3 style={sectionTitle}>✂️ Historique des greffages ({graftings.length} opérations)</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: COLORS.sand }}>
                    {["Date", "Lot", "Technique", "Porte-greffe", "Greffon", "Greffés", "Reprises", "Taux", "Contrôle", "Statut", "Destination", ""].map(h => (
                      <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontWeight: 700, color: COLORS.forest, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...graftings].sort((a, b) => b.date.localeCompare(a.date)).map((g, i) => {
                    const rate = g.qtyGrafted > 0 && g.qtySuccess > 0 ? Math.round((g.qtySuccess / g.qtyGrafted) * 100) : null;
                    return (
                      <tr key={g.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                        <td style={td}>{g.date}</td>
                        <td style={{ ...td, fontSize: 12 }}>{g.batchName}</td>
                        <td style={td}><Badge color="amber">{g.technique}</Badge></td>
                        <td style={td}>{g.rootstock}</td>
                        <td style={td}><Badge color="green">{g.scion}</Badge></td>
                        <td style={{ ...td, fontWeight: 700 }}>{g.qtyGrafted}</td>
                        <td style={td}>{g.qtySuccess > 0 ? g.qtySuccess : "—"}</td>
                        <td style={td}>
                          {rate !== null ? (
                            <span style={{ fontWeight: 700, color: rate >= 80 ? "#065F46" : rate >= 60 ? "#92400E" : "#DC2626" }}>{rate}%</span>
                          ) : "—"}
                        </td>
                        <td style={{ ...td, fontSize: 12 }}>{g.checkDate || "—"}</td>
                        <td style={td}><Badge color={statusColor(g.status)}>{g.status}</Badge></td>
                        <td style={{ ...td, fontSize: 12 }}>{g.destination || "—"}</td>
                        <td style={td}>
                          <div style={{ display: "flex", gap: 5 }}>
                            <Btn small variant="secondary" onClick={() => editGraft(g)}>✏️</Btn>
                            <Btn small variant="danger" onClick={() => delGraft(g.id)}>🗑️</Btn>
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
      )}

      {/* ── TIMELINE VISUELLE ── */}
      {subTab === "timeline" && (
        <Card>
          <h3 style={sectionTitle}>📅 Parcours de chaque lot</h3>
          {batches.map(b => {
            const batchGrafts = graftings.filter(g => String(g.batchId) === String(b.id));
            const stageIndex = STAGES.indexOf(b.stage);
            return (
              <div key={b.id} style={{ marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${COLORS.sand}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 15, color: COLORS.forest }}>{b.name}</span>
                    <span style={{ marginLeft: 10, fontSize: 12, color: COLORS.muted }}>{b.site} · {b.variety} · semé le {b.startDate}</span>
                  </div>
                  <Badge color="green">{b.qtyAlive} plants vivants</Badge>
                </div>

                {/* Barre de progression par stades */}
                <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
                  {STAGES.map((s, idx) => {
                    const done = idx < stageIndex;
                    const current = idx === stageIndex;
                    return (
                      <div key={s} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{
                          height: 10,
                          background: done ? COLORS.lime : current ? COLORS.gold : COLORS.sand,
                          borderRadius: idx === 0 ? "5px 0 0 5px" : idx === STAGES.length - 1 ? "0 5px 5px 0" : 0,
                          borderRight: idx < STAGES.length - 1 ? "2px solid white" : "none",
                        }} />
                        {current && (
                          <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.bark, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            ▲ {s}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Greffages liés */}
                {batchGrafts.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Greffages associés</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {batchGrafts.map(g => {
                        const rate = g.qtySuccess > 0 ? Math.round((g.qtySuccess / g.qtyGrafted) * 100) : null;
                        return (
                          <div key={g.id} style={{
                            background: COLORS.sand, borderRadius: 10, padding: "8px 14px", fontSize: 13,
                            borderLeft: `4px solid ${g.status === "Succès contrôlé" ? COLORS.lime : g.status.includes("Échec") ? "#EF4444" : COLORS.gold}`,
                          }}>
                            <div style={{ fontWeight: 700 }}>{g.date} · {g.technique}</div>
                            <div style={{ color: COLORS.muted, fontSize: 12 }}>
                              {g.rootstock} → {g.scion} · {g.qtyGrafted} greffés
                              {rate !== null && <span style={{ fontWeight: 700, color: rate >= 80 ? "#065F46" : "#92400E" }}> · {rate}% reprise</span>}
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.muted }}>{g.status} {g.destination ? `· ${g.destination}` : ""}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {batchGrafts.length === 0 && (
                  <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic" }}>Aucun greffage enregistré pour ce lot.</div>
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
const ROLES = ["Chef de site", "Greffeur", "Responsable pépinière", "Chauffeur", "Magasinier", "Comptable", "Ouvrière agricole", "Ouvrier agricole", "Gardien", "Autre"];
const TASKS_TEMP = ["Récolte", "Désherbage", "Application engrais", "Taille", "Greffage", "Semis pépinière", "Irrigation manuelle", "Transport", "Conditionnement", "Autre"];

function HRChargesModule({ staff, setStaff, tempWork, setTempWork, charges, setCharges }) {
  const [subTab, setSubTab] = useState("dashboard_rh");

  // ── formulaires
  const [sForm, setSForm] = useState({ name: "", role: "", site: "", salary: "", startDate: "", status: "Actif", phone: "", notes: "" });
  const [editingS, setEditingS] = useState(null);

  const [tForm, setTForm] = useState({ date: "", site: "", task: "", nbWorkers: "", nbDays: "", dailyRate: "", notes: "" });

  const [cForm, setCForm] = useState({ date: "", category: "", label: "", site: "Tous", amount: "", paid: false, notes: "" });
  const [editingC, setEditingC] = useState(null);

  // ── stats globales
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const monthlyPayroll = staff.filter(s => s.status === "Actif").reduce((sum, s) => sum + s.salary, 0);
  const monthlyTemp = tempWork.filter(t => t.date.startsWith(currentMonth)).reduce((s, t) => s + t.total, 0);
  const monthlyCharges = charges.filter(c => c.date.startsWith(currentMonth)).reduce((s, c) => s + c.amount, 0);
  const totalChargesYear = charges.filter(c => c.date.startsWith("2024")).reduce((s, c) => s + c.amount, 0);
  const unpaidCharges = charges.filter(c => !c.paid).reduce((s, c) => s + c.amount, 0);

  // ── Masse salariale permanente
  const saveStaff = () => {
    if (!sForm.name || !sForm.role || !sForm.salary) return;
    const entry = { ...sForm, id: editingS || Date.now(), salary: +sForm.salary };
    setStaff(editingS ? staff.map(s => s.id === editingS ? entry : s) : [...staff, entry]);
    setEditingS(null);
    setSForm({ name: "", role: "", site: "", salary: "", startDate: "", status: "Actif", phone: "", notes: "" });
  };
  const editStaff = (s) => { setSForm({ ...s, salary: String(s.salary) }); setEditingS(s.id); setSubTab("permanent"); };
  const delStaff = (id) => setStaff(staff.filter(s => s.id !== id));

  // ── Main d'œuvre temporaire
  const saveTempWork = () => {
    if (!tForm.date || !tForm.task || !tForm.nbWorkers || !tForm.dailyRate) return;
    const total = +tForm.nbWorkers * +tForm.nbDays * +tForm.dailyRate;
    setTempWork([...tempWork, { ...tForm, id: Date.now(), nbWorkers: +tForm.nbWorkers, nbDays: +tForm.nbDays, dailyRate: +tForm.dailyRate, total }]);
    setTForm({ date: "", site: "", task: "", nbWorkers: "", nbDays: "", dailyRate: "", notes: "" });
  };
  const delTempWork = (id) => setTempWork(tempWork.filter(t => t.id !== id));

  // ── Charges
  const saveCharge = () => {
    if (!cForm.date || !cForm.category || !cForm.amount) return;
    const entry = { ...cForm, id: editingC || Date.now(), amount: +cForm.amount };
    setCharges(editingC ? charges.map(c => c.id === editingC ? entry : c) : [...charges, entry]);
    setEditingC(null);
    setCForm({ date: "", category: "", label: "", site: "Tous", amount: "", paid: false, notes: "" });
  };
  const editCharge = (c) => { setCForm({ ...c, amount: String(c.amount) }); setEditingC(c.id); setSubTab("charges"); };
  const delCharge = (id) => setCharges(charges.filter(c => c.id !== id));
  const togglePaidCharge = (id) => setCharges(charges.map(c => c.id === id ? { ...c, paid: !c.paid } : c));

  // ── Regroupement charges par catégorie
  const chargesByCategory = CHARGE_CATEGORIES.map(cat => ({
    cat,
    total: charges.filter(c => c.category === cat).reduce((s, c) => s + c.amount, 0),
    count: charges.filter(c => c.category === cat).length,
  })).filter(x => x.total > 0).sort((a, b) => b.total - a.total);

  const totalAllCharges = chargesByCategory.reduce((s, x) => s + x.total, 0) + staff.filter(s => s.status === "Actif").reduce((sum, s) => sum + s.salary, 0) * 12 + tempWork.reduce((s, t) => s + t.total, 0);

  const subTabs = [
    { id: "dashboard_rh", label: "📊 Tableau RH" },
    { id: "permanent", label: "👷 Permanents" },
    { id: "temp", label: "👥 Temporaires" },
    { id: "charges", label: "📋 Charges" },
    { id: "synthese", label: "💹 Synthèse coûts" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        <StatCard icon="👷" label="Masse salariale/mois" value={`${(monthlyPayroll/1000).toFixed(0)}K`} sub={`${staff.filter(s=>s.status==="Actif").length} permanents`} color="#DBEAFE" />
        <StatCard icon="👥" label="MO temp. ce mois" value={`${(monthlyTemp/1000).toFixed(0)}K`} sub="FCFA" color="#FEF9C3" />
        <StatCard icon="📋" label="Charges ce mois" value={`${(monthlyCharges/1000).toFixed(0)}K`} sub="hors salaires" color="#FCE7F3" />
        <StatCard icon="⚠️" label="Charges impayées" value={`${(unpaidCharges/1000).toFixed(0)}K`} sub="à régler" color="#FEE2E2" />
        <StatCard icon="💰" label="Charges 2024" value={`${(totalChargesYear/1000).toFixed(0)}K`} sub="total enregistré" color="#E0E7FF" />
      </div>

      {/* Sous-onglets */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", borderBottom: `2px solid ${COLORS.sand}` }}>
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            background: subTab === t.id ? COLORS.green : "transparent",
            color: subTab === t.id ? COLORS.white : COLORS.forest,
            border: "none", borderRadius: "8px 8px 0 0", padding: "8px 16px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ══ TABLEAU DE BORD RH ══ */}
      {subTab === "dashboard_rh" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>

          <Card>
            <h3 style={sectionTitle}>👷 Répartition masse salariale</h3>
            {SITES.map(site => {
              const siteSalary = staff.filter(s => s.site === site && s.status === "Actif").reduce((sum, s) => sum + s.salary, 0);
              const siteStaff = staff.filter(s => s.site === site && s.status === "Actif").length;
              return (
                <div key={site} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{site} <span style={{ color: COLORS.muted, fontWeight: 400 }}>({siteStaff} pers.)</span></span>
                    <span style={{ fontWeight: 700, color: COLORS.forest }}>{siteSalary.toLocaleString()} F/mois</span>
                  </div>
                  <div style={{ height: 8, background: COLORS.sand, borderRadius: 4 }}>
                    <div style={{ height: 8, width: `${monthlyPayroll > 0 ? (siteSalary/monthlyPayroll)*100 : 0}%`, background: COLORS.lime, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 12, padding: "10px 14px", background: COLORS.sand, borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, color: COLORS.forest }}>TOTAL MENSUEL</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.forest }}>{monthlyPayroll.toLocaleString()} FCFA</span>
            </div>
          </Card>

          <Card>
            <h3 style={sectionTitle}>📋 Top charges par catégorie</h3>
            {chargesByCategory.slice(0, 6).map(x => (
              <div key={x.cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${COLORS.sand}` }}>
                <span style={{ fontSize: 13 }}>{x.cat}</span>
                <span style={{ fontWeight: 700, color: COLORS.bark, fontSize: 13 }}>{x.total.toLocaleString()} F</span>
              </div>
            ))}
          </Card>

          <Card>
            <h3 style={sectionTitle}>👥 Dernières MO temporaires</h3>
            {[...tempWork].sort((a,b) => b.date.localeCompare(a.date)).slice(0,4).map(t => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.sand}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.task} — {t.site}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{t.date} · {t.nbWorkers} pers. × {t.nbDays}j × {t.dailyRate.toLocaleString()} F</div>
                </div>
                <span style={{ fontWeight: 700, color: COLORS.forest, fontSize: 13 }}>{t.total.toLocaleString()} F</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ══ PERMANENTS ══ */}
      {subTab === "permanent" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={sectionTitle}>{editingS ? "✏️ Modifier l'employé" : "➕ Ajouter un employé permanent"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              <Input label="Nom complet" value={sForm.name} onChange={v => setSForm({...sForm, name: v})} />
              <Input label="Poste / Rôle" value={sForm.role} onChange={v => setSForm({...sForm, role: v})} options={ROLES} />
              <Input label="Site affecté" value={sForm.site} onChange={v => setSForm({...sForm, site: v})} options={[...SITES, "Tous sites"]} />
              <Input label="Salaire mensuel (FCFA)" type="number" value={sForm.salary} onChange={v => setSForm({...sForm, salary: v})} />
              <Input label="Date d'embauche" type="date" value={sForm.startDate} onChange={v => setSForm({...sForm, startDate: v})} />
              <Input label="Téléphone" value={sForm.phone} onChange={v => setSForm({...sForm, phone: v})} />
              <Input label="Statut" value={sForm.status} onChange={v => setSForm({...sForm, status: v})} options={["Actif", "Congé", "Suspendu", "Parti"]} />
              <Input label="Notes" value={sForm.notes} onChange={v => setSForm({...sForm, notes: v})} />
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <Btn onClick={saveStaff}>{editingS ? "Enregistrer" : "Ajouter"}</Btn>
              {editingS && <Btn variant="secondary" onClick={() => { setEditingS(null); setSForm({ name: "", role: "", site: "", salary: "", startDate: "", status: "Actif", phone: "", notes: "" }); }}>Annuler</Btn>}
            </div>
          </Card>

          <ExportBar
            title="Personnel Permanent"
            headers={["Nom","Poste","Site","Salaire/mois (FCFA)","Date embauche","Téléphone","Statut","Notes"]}
            rows={staff.map(s=>[s.name,s.role,s.site,s.salary,s.startDate,s.phone||"—",s.status,s.notes||"—"])}
            extraInfo={[{label:"Masse salariale/mois",val:staff.filter(s=>s.status==="Actif").reduce((sum,s)=>sum+s.salary,0).toLocaleString()+" FCFA"}]}
            filename="personnel_permanent"
          />
          <Card>
            <h3 style={sectionTitle}>👷 Personnel permanent — Masse salariale : {monthlyPayroll.toLocaleString()} FCFA/mois</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: COLORS.sand }}>
                    {["Nom", "Poste", "Site", "Salaire/mois", "Embauche", "Tél.", "Statut", ""].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.forest, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s, i) => (
                    <tr key={s.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                      <td style={{ ...td, fontWeight: 700 }}>{s.name}</td>
                      <td style={td}><Badge color="amber">{s.role}</Badge></td>
                      <td style={td}>{s.site}</td>
                      <td style={{ ...td, fontWeight: 700, color: COLORS.forest }}>{s.salary.toLocaleString()} F</td>
                      <td style={td}>{s.startDate}</td>
                      <td style={{ ...td, color: COLORS.muted, fontSize: 12 }}>{s.phone || "—"}</td>
                      <td style={td}><Badge color={s.status === "Actif" ? "green" : "amber"}>{s.status}</Badge></td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn small variant="secondary" onClick={() => editStaff(s)}>✏️</Btn>
                          <Btn small variant="danger" onClick={() => delStaff(s.id)}>🗑️</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, padding: "12px 16px", background: COLORS.sand, borderRadius: 10, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 13 }}>📅 Masse salariale annuelle estimée : <strong>{(monthlyPayroll * 12).toLocaleString()} FCFA</strong></div>
              <div style={{ fontSize: 13 }}>👷 Actifs : <strong>{staff.filter(s => s.status === "Actif").length}</strong> / {staff.length} employés</div>
            </div>
          </Card>
        </div>
      )}

      {/* ══ TEMPORAIRES ══ */}
      {subTab === "temp" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={sectionTitle}>➕ Enregistrer une prestation temporaire</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              <Input label="Date" type="date" value={tForm.date} onChange={v => setTForm({...tForm, date: v})} />
              <Input label="Site" value={tForm.site} onChange={v => setTForm({...tForm, site: v})} options={SITES} />
              <Input label="Tâche effectuée" value={tForm.task} onChange={v => setTForm({...tForm, task: v})} options={TASKS_TEMP} />
              <Input label="Nb de personnes" type="number" value={tForm.nbWorkers} onChange={v => setTForm({...tForm, nbWorkers: v})} />
              <Input label="Nb de jours" type="number" value={tForm.nbDays} onChange={v => setTForm({...tForm, nbDays: v})} />
              <Input label="Taux journalier (FCFA)" type="number" value={tForm.dailyRate} onChange={v => setTForm({...tForm, dailyRate: v})} />
              <Input label="Notes" value={tForm.notes} onChange={v => setTForm({...tForm, notes: v})} />
            </div>
            {tForm.nbWorkers && tForm.nbDays && tForm.dailyRate && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#DBEAFE", borderRadius: 10, fontSize: 14, fontWeight: 700, color: "#1E40AF" }}>
                💡 Total calculé : {(+tForm.nbWorkers * +tForm.nbDays * +tForm.dailyRate).toLocaleString()} FCFA
              </div>
            )}
            <div style={{ marginTop: 14 }}><Btn onClick={saveTempWork}>Enregistrer</Btn></div>
          </Card>

          <ExportBar
            title="Main d'Oeuvre Temporaire"
            headers={["Date","Site","Tâche","Personnes","Jours","Taux/j (FCFA)","Total (FCFA)","Notes"]}
            rows={[...tempWork].sort((a,b)=>b.date.localeCompare(a.date)).map(t=>[t.date,t.site,t.task,t.nbWorkers,t.nbDays,t.dailyRate,t.total,t.notes||"—"])}
            extraInfo={[{label:"Total MO temporaire",val:tempWork.reduce((s,t)=>s+t.total,0).toLocaleString()+" FCFA"}]}
            filename="mo_temporaire"
          />
          <Card>
            <h3 style={sectionTitle}>👥 Historique main d'œuvre temporaire — Total : {tempWork.reduce((s, t) => s + t.total, 0).toLocaleString()} FCFA</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: COLORS.sand }}>
                    {["Date", "Site", "Tâche", "Personnes", "Jours", "Taux/j", "Total", "Notes", ""].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.forest, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...tempWork].sort((a, b) => b.date.localeCompare(a.date)).map((t, i) => (
                    <tr key={t.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                      <td style={td}>{t.date}</td>
                      <td style={td}>{t.site}</td>
                      <td style={td}><Badge color="amber">{t.task}</Badge></td>
                      <td style={{ ...td, textAlign: "center" }}>{t.nbWorkers}</td>
                      <td style={{ ...td, textAlign: "center" }}>{t.nbDays}</td>
                      <td style={td}>{t.dailyRate.toLocaleString()} F</td>
                      <td style={{ ...td, fontWeight: 700, color: COLORS.forest }}>{t.total.toLocaleString()} F</td>
                      <td style={{ ...td, color: COLORS.muted, fontSize: 12 }}>{t.notes || "—"}</td>
                      <td style={td}><Btn small variant="danger" onClick={() => delTempWork(t.id)}>🗑️</Btn></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ══ CHARGES ══ */}
      {subTab === "charges" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={sectionTitle}>{editingC ? "✏️ Modifier la charge" : "➕ Saisir une charge au fil de l'eau"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              <Input label="Date" type="date" value={cForm.date} onChange={v => setCForm({...cForm, date: v})} />
              <Input label="Catégorie" value={cForm.category} onChange={v => setCForm({...cForm, category: v})} options={CHARGE_CATEGORIES} />
              <Input label="Libellé / Description" value={cForm.label} onChange={v => setCForm({...cForm, label: v})} />
              <Input label="Site concerné" value={cForm.site} onChange={v => setCForm({...cForm, site: v})} options={[...SITES, "Tous"]} />
              <Input label="Montant (FCFA)" type="number" value={cForm.amount} onChange={v => setCForm({...cForm, amount: v})} />
              <Input label="Notes / Fournisseur" value={cForm.notes} onChange={v => setCForm({...cForm, notes: v})} />
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={cForm.paid} onChange={e => setCForm({...cForm, paid: e.target.checked})} />
                Déjà payé / décaissé
              </label>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <Btn onClick={saveCharge}>{editingC ? "Enregistrer" : "Ajouter"}</Btn>
              {editingC && <Btn variant="secondary" onClick={() => { setEditingC(null); setCForm({ date: "", category: "", label: "", site: "Tous", amount: "", paid: false, notes: "" }); }}>Annuler</Btn>}
            </div>
          </Card>

          <ExportBar
            title="Journal des Charges"
            headers={["Date","Catégorie","Libellé","Site","Montant (FCFA)","Statut","Notes"]}
            rows={[...charges].sort((a,b)=>b.date.localeCompare(a.date)).map(c=>[c.date,c.category,c.label,c.site,c.amount,c.paid?"Payé":"À payer",c.notes||"—"])}
            extraInfo={[{label:"Total charges",val:charges.reduce((s,c)=>s+c.amount,0).toLocaleString()+" FCFA"},{label:"Impayées",val:charges.filter(c=>!c.paid).reduce((s,c)=>s+c.amount,0).toLocaleString()+" FCFA"}]}
            filename="charges_exploitation"
          />
          <Card>
            <h3 style={sectionTitle}>📋 Journal des charges — Total : {charges.reduce((s, c) => s + c.amount, 0).toLocaleString()} FCFA</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: COLORS.sand }}>
                    {["Date", "Catégorie", "Libellé", "Site", "Montant", "Statut", "Notes", ""].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.forest, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...charges].sort((a, b) => b.date.localeCompare(a.date)).map((c, i) => (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                      <td style={td}>{c.date}</td>
                      <td style={td}><Badge color="amber">{c.category}</Badge></td>
                      <td style={{ ...td, fontWeight: 600 }}>{c.label}</td>
                      <td style={td}>{c.site}</td>
                      <td style={{ ...td, fontWeight: 700, color: COLORS.forest }}>{c.amount.toLocaleString()} F</td>
                      <td style={td}>
                        <span onClick={() => togglePaidCharge(c.id)} style={{ cursor: "pointer" }}>
                          <Badge color={c.paid ? "green" : "amber"}>{c.paid ? "✅ Payé" : "⏳ À payer"}</Badge>
                        </span>
                      </td>
                      <td style={{ ...td, color: COLORS.muted, fontSize: 12 }}>{c.notes || "—"}</td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <Btn small variant="secondary" onClick={() => editCharge(c)}>✏️</Btn>
                          <Btn small variant="danger" onClick={() => delCharge(c.id)}>🗑️</Btn>
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

      {/* ══ SYNTHÈSE COÛTS ══ */}
      {subTab === "synthese" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>

            <Card>
              <h3 style={sectionTitle}>💹 Structure des coûts annuels</h3>
              {[
                { label: "Salaires permanents (annuel)", amount: monthlyPayroll * 12, icon: "👷", color: "#3B82F6" },
                { label: "Main d'œuvre temporaire", amount: tempWork.reduce((s, t) => s + t.total, 0), icon: "👥", color: "#F59E0B" },
                { label: "Intrants agricoles", amount: charges.filter(c => c.category === "Intrants agricoles").reduce((s, c) => s + c.amount, 0), icon: "🌿", color: "#10B981" },
                { label: "Carburant & transport", amount: charges.filter(c => c.category === "Carburant & transport").reduce((s, c) => s + c.amount, 0), icon: "🚛", color: "#6B7280" },
                { label: "Matériel & équipements", amount: charges.filter(c => c.category === "Matériel & équipements").reduce((s, c) => s + c.amount, 0), icon: "🔧", color: "#8B5CF6" },
                { label: "Emballage & stockage", amount: charges.filter(c => c.category === "Emballage & stockage").reduce((s, c) => s + c.amount, 0), icon: "📦", color: "#EC4899" },
                { label: "Autres charges", amount: charges.filter(c => !["Intrants agricoles","Carburant & transport","Matériel & équipements","Emballage & stockage"].includes(c.category)).reduce((s, c) => s + c.amount, 0), icon: "📋", color: "#D97706" },
              ].map(row => {
                const pct = totalAllCharges > 0 ? Math.round((row.amount / totalAllCharges) * 100) : 0;
                return row.amount > 0 ? (
                  <div key={row.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span>{row.icon} {row.label}</span>
                      <span style={{ fontWeight: 700 }}>{row.amount.toLocaleString()} F <span style={{ color: COLORS.muted, fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 7, background: COLORS.sand, borderRadius: 4 }}>
                      <div style={{ height: 7, width: `${pct}%`, background: row.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ) : null;
              })}
              <div style={{ marginTop: 14, padding: "12px 16px", background: COLORS.forest, borderRadius: 10, color: COLORS.white, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>TOTAL CHARGES</span>
                <span style={{ fontWeight: 900, fontSize: 16 }}>{totalAllCharges.toLocaleString()} FCFA</span>
              </div>
            </Card>

            <Card>
              <h3 style={sectionTitle}>📅 Charges par mois</h3>
              {Array.from({ length: 6 }, (_, i) => {
                const d = new Date(); d.setMonth(d.getMonth() - 5 + i);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
                const amt = charges.filter(c => c.date.startsWith(key)).reduce((s, c) => s + c.amount, 0);
                const sal = tempWork.filter(t => t.date.startsWith(key)).reduce((s, t) => s + t.total, 0);
                const total = amt + sal + monthlyPayroll;
                const maxVal = 500000;
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 45, fontSize: 12, color: COLORS.muted, flexShrink: 0 }}>{label}</div>
                    <div style={{ flex: 1, height: 22, background: COLORS.sand, borderRadius: 6, overflow: "hidden", position: "relative" }}>
                      <div style={{ height: "100%", width: `${Math.min((total / maxVal) * 100, 100)}%`, background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.lime})`, borderRadius: 6 }} />
                      <div style={{ position: "absolute", top: 3, left: 8, fontSize: 11, fontWeight: 700, color: COLORS.white, mixBlendMode: "difference" }}>
                        {total > 0 ? `${(total/1000).toFixed(0)}K` : "0"}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 10, fontSize: 12, color: COLORS.muted, fontStyle: "italic" }}>
                * Inclut salaires permanents ({(monthlyPayroll/1000).toFixed(0)}K/mois), MO temporaire et charges diverses
              </div>
            </Card>
          </div>

          {/* Charges par site */}
          <Card>
            <h3 style={sectionTitle}>📍 Charges par site</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              {[...SITES, "Tous"].map(site => {
                const siteCharges = charges.filter(c => c.site === site).reduce((s, c) => s + c.amount, 0);
                const siteTemp = tempWork.filter(t => t.site === site).reduce((s, t) => s + t.total, 0);
                const siteSal = staff.filter(s => s.site === site && s.status === "Actif").reduce((sum, s) => sum + s.salary, 0);
                const siteTotal = siteCharges + siteTemp + siteSal * 12;
                return siteTotal > 0 ? (
                  <div key={site} style={{ padding: "14px", background: COLORS.sand, borderRadius: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.forest, marginBottom: 8 }}>{site}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 3 }}>💼 Salaires permanents : <strong>{(siteSal * 12).toLocaleString()} F/an</strong></div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 3 }}>👥 MO temporaire : <strong>{siteTemp.toLocaleString()} F</strong></div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>📋 Autres charges : <strong>{siteCharges.toLocaleString()} F</strong></div>
                    <div style={{ fontWeight: 800, color: COLORS.forest, fontSize: 14, borderTop: `1px solid ${COLORS.sand}`, paddingTop: 8 }}>
                      Total : {siteTotal.toLocaleString()} FCFA
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── MODULE : Gestion des Sites ──────────────────────────────────────────────
function SitesModule({ sitesList, setSitesList }) {
  const emptyForm = { code: "", name: "", latDec: "", lngDec: "", notes: "" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [gpsMode, setGpsMode] = useState("decimal"); // decimal | dms
  const [dmsLat, setDmsLat] = useState("");
  const [dmsLng, setDmsLng] = useState("");

  const convertDMS = () => {
    const lat = dmsToDec(dmsLat);
    const lng = dmsToDec(dmsLng);
    if (lat !== null && lng !== null) {
      setForm(f => ({ ...f, latDec: String(lat), lngDec: String(lng) }));
      alert(`Converti : ${lat}, ${lng}`);
    } else alert("Format DMS invalide. Exemple: 3°50'52.9\"N");
  };

  const save = () => {
    if (!form.code || !form.name) return;
    const entry = { ...form, latDec: parseFloat(form.latDec) || 0, lngDec: parseFloat(form.lngDec) || 0 };
    if (editing) {
      setSitesList(sitesList.map(s => s.code === editing ? entry : s));
      setEditing(null);
    } else {
      setSitesList([...sitesList, entry]);
    }
    setForm(emptyForm); setDmsLat(""); setDmsLng("");
  };

  const edit = (s) => { setForm({ ...s, latDec: String(s.latDec), lngDec: String(s.lngDec) }); setEditing(s.code); };
  const del = (code) => setSitesList(sitesList.filter(s => s.code !== code));

  // Export
  const exportHeaders = ["Code", "Nom du site", "Latitude (décimal)", "Longitude (décimal)", "GPS DMS", "Notes"];
  const exportRows = sitesList.map(s => [s.code, s.name, s.latDec, s.lngDec, formatDMS(s.latDec, s.lngDec), s.notes]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ExportBar title="Gestion des Sites" headers={exportHeaders} rows={exportRows} filename="sites" />

      <Card>
        <h3 style={sectionTitle}>{editing ? "✏️ Modifier le site" : "➕ Ajouter un site"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          <Input label="Code (ex: Site D)" value={form.code} onChange={v => setForm({ ...form, code: v })} />
          <Input label="Nom du site" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Input label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
        </div>

        {/* GPS */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.forest, alignSelf: "center" }}>📍 Coordonnées GPS :</span>
            {["decimal", "dms"].map(m => (
              <button key={m} onClick={() => setGpsMode(m)} style={{
                background: gpsMode === m ? COLORS.green : COLORS.sand,
                color: gpsMode === m ? COLORS.white : COLORS.forest,
                border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 12,
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>{m === "decimal" ? "Décimal" : "DMS (°′″)"}</button>
            ))}
          </div>

          {gpsMode === "decimal" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Latitude décimale (ex: 3.848033)" value={form.latDec} onChange={v => setForm({ ...form, latDec: v })} />
              <Input label="Longitude décimale (ex: 11.502075)" value={form.lngDec} onChange={v => setForm({ ...form, lngDec: v })} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
              <Input label='Latitude DMS (ex: 3°50\'52.9"N)' value={dmsLat} onChange={setDmsLat} />
              <Input label='Longitude DMS (ex: 11°30\'7.5"E)' value={dmsLng} onChange={setDmsLng} />
              <Btn onClick={convertDMS} variant="secondary">Convertir →</Btn>
            </div>
          )}

          {form.latDec && form.lngDec && (
            <div style={{ marginTop: 10, padding: "8px 14px", background: "#EFF6FF", borderRadius: 8, fontSize: 12 }}>
              <strong>Décimal :</strong> {formatGPS(+form.latDec, +form.lngDec)} &nbsp;|&nbsp;
              <strong>DMS :</strong> {formatDMS(+form.latDec, +form.lngDec)}
            </div>
          )}
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <Btn onClick={save}>{editing ? "Enregistrer" : "Ajouter"}</Btn>
          {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm(emptyForm); }}>Annuler</Btn>}
        </div>
      </Card>

      <Card>
        <h3 style={sectionTitle}>📍 Mes sites ({sitesList.length})</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {sitesList.map(s => (
            <div key={s.code} style={{ background: COLORS.sand, borderRadius: 14, padding: 16, borderLeft: `5px solid ${COLORS.green}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: COLORS.forest }}>{s.code}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginTop: 2 }}>{s.name}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn small variant="secondary" onClick={() => edit(s)}>✏️</Btn>
                  <Btn small variant="danger" onClick={() => del(s.code)}>🗑️</Btn>
                </div>
              </div>
              {s.latDec && s.lngDec && (
                <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.7 }}>
                  <div>📐 <strong>Décimal :</strong> {formatGPS(s.latDec, s.lngDec)}</div>
                  <div>🧭 <strong>DMS :</strong> {formatDMS(s.latDec, s.lngDec)}</div>
                  <a href={`https://maps.google.com/?q=${s.latDec},${s.lngDec}`} target="_blank" rel="noreferrer"
                    style={{ color: COLORS.green, fontWeight: 700, textDecoration: "none" }}>
                    🗺️ Voir sur Google Maps →
                  </a>
                </div>
              )}
              {s.notes && <div style={{ marginTop: 6, fontSize: 12, color: COLORS.muted, fontStyle: "italic" }}>{s.notes}</div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE : Avocatiers Sélectionnés ────────────────────────────────────────
const SELECTION_REASONS = [
  "Performance de récolte exceptionnelle",
  "Qualité du fruit (calibre, goût)",
  "Potentiel porte-greffe",
  "Résistance aux maladies",
  "Précocité / tardivité remarquable",
  "Port de l'arbre exceptionnel",
  "Autre raison",
];

function SelectedTreesModule({ selectedTrees, setSelectedTrees, sitesList }) {
  const emptyForm = { ref: "", site: "", variety: "", year: "", latDec: "", lngDec: "", reason: "", notes: "", status: "Actif" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [gpsMode, setGpsMode] = useState("decimal");
  const [dmsLat, setDmsLat] = useState(""); const [dmsLng, setDmsLng] = useState("");
  const [filterSite, setFilterSite] = useState("");
  const [filterVariety, setFilterVariety] = useState("");

  const siteOptions = sitesList.map(s => `${s.code} — ${s.name}`);

  const convertDMS = () => {
    const lat = dmsToDec(dmsLat); const lng = dmsToDec(dmsLng);
    if (lat !== null && lng !== null) { setForm(f => ({ ...f, latDec: String(lat), lngDec: String(lng) })); }
    else alert("Format DMS invalide. Exemple: 3°50'52.9\"N");
  };

  const save = () => {
    if (!form.ref || !form.site || !form.variety) return;
    const entry = { ...form, id: editing || Date.now(), latDec: parseFloat(form.latDec) || 0, lngDec: parseFloat(form.lngDec) || 0, year: +form.year };
    setSelectedTrees(editing ? selectedTrees.map(t => t.id === editing ? entry : t) : [...selectedTrees, entry]);
    setEditing(null); setForm(emptyForm); setDmsLat(""); setDmsLng("");
  };

  const edit = (t) => { setForm({ ...t, latDec: String(t.latDec), lngDec: String(t.lngDec), year: String(t.year) }); setEditing(t.id); };
  const del = (id) => setSelectedTrees(selectedTrees.filter(t => t.id !== id));

  const filtered = selectedTrees
    .filter(t => !filterSite || t.site === filterSite)
    .filter(t => !filterVariety || t.variety === filterVariety);

  // Export
  const exportHeaders = ["Référence", "Site", "Variété", "Année", "Latitude", "Longitude", "GPS DMS", "Motif sélection", "Statut", "Notes"];
  const exportRows = filtered.map(t => [t.ref, t.site, t.variety, t.year, t.latDec, t.lngDec, formatDMS(t.latDec, t.lngDec), t.reason, t.status, t.notes]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ExportBar title="Avocatiers Sélectionnés" headers={exportHeaders} rows={exportRows} filename="avocatiers_selectionnes" />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        <StatCard icon="⭐" label="Pieds sélectionnés" value={selectedTrees.length} sub="total référencés" color="#FEF9C3" />
        <StatCard icon="📍" label="Géolocalisés" value={selectedTrees.filter(t => t.latDec && t.lngDec).length} sub="avec GPS" color="#DBEAFE" />
        {SITES.map(s => (
          <StatCard key={s} icon="🌳" label={s} value={selectedTrees.filter(t => t.site === s).length} sub="pieds sélectionnés" color="#D1FAE5" />
        ))}
      </div>

      {/* Formulaire */}
      <Card>
        <h3 style={sectionTitle}>{editing ? "✏️ Modifier le pied" : "⭐ Référencer un avocatier sélectionné"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          <Input label="Référence unique (ex: AVO-A-004)" value={form.ref} onChange={v => setForm({ ...form, ref: v })} />
          <Input label="Site" value={form.site} onChange={v => setForm({ ...form, site: v })} options={sitesList.map(s => s.code)} />
          <Input label="Variété" value={form.variety} onChange={v => setForm({ ...form, variety: v })} options={VARIETIES} />
          <Input label="Année plantation" type="number" value={form.year} onChange={v => setForm({ ...form, year: v })} />
          <Input label="Motif de suivi / sélection (libre)" value={form.reason} onChange={v => setForm({ ...form, reason: v })} />
          <Input label="Statut" value={form.status} onChange={v => setForm({ ...form, status: v })} options={["Actif", "En observation", "Décédé", "Retiré"]} />
          <div style={{ gridColumn: "1 / -1" }}>
            <Input label="Notes / Observations" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
          </div>
        </div>

        {/* GPS */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.forest, alignSelf: "center" }}>📍 Position GPS du pied :</span>
            {["decimal", "dms"].map(m => (
              <button key={m} onClick={() => setGpsMode(m)} style={{
                background: gpsMode === m ? COLORS.green : COLORS.sand,
                color: gpsMode === m ? COLORS.white : COLORS.forest,
                border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 12,
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>{m === "decimal" ? "Décimal" : "DMS (°′″)"}</button>
            ))}
          </div>
          {gpsMode === "decimal" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Latitude décimale" value={form.latDec} onChange={v => setForm({ ...form, latDec: v })} />
              <Input label="Longitude décimale" value={form.lngDec} onChange={v => setForm({ ...form, lngDec: v })} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
              <Input label='Latitude DMS (ex: 3°50\'52.9"N)' value={dmsLat} onChange={setDmsLat} />
              <Input label='Longitude DMS (ex: 11°30\'7.5"E)' value={dmsLng} onChange={setDmsLng} />
              <Btn onClick={convertDMS} variant="secondary">Convertir →</Btn>
            </div>
          )}
          {form.latDec && form.lngDec && (
            <div style={{ marginTop: 10, padding: "8px 14px", background: "#EFF6FF", borderRadius: 8, fontSize: 12 }}>
              <strong>Décimal :</strong> {formatGPS(+form.latDec, +form.lngDec)} &nbsp;|&nbsp;
              <strong>DMS :</strong> {formatDMS(+form.latDec, +form.lngDec)}
            </div>
          )}
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <Btn onClick={save}>{editing ? "Enregistrer" : "Référencer"}</Btn>
          {editing && <Btn variant="secondary" onClick={() => { setEditing(null); setForm(emptyForm); }}>Annuler</Btn>}
        </div>
      </Card>

      {/* Filtres + Liste */}
      <Card>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
          <h3 style={{ ...sectionTitle, flex: 1, marginBottom: 0, borderBottom: "none" }}>⭐ Registre des pieds sélectionnés ({filtered.length})</h3>
          <select value={filterSite} onChange={e => setFilterSite(e.target.value)} style={{ ...inputStyle, width: 140 }}>
            <option value="">Tous les sites</option>
            {sitesList.map(s => <option key={s.code} value={s.code}>{s.code}</option>)}
          </select>
          <select value={filterVariety} onChange={e => setFilterVariety(e.target.value)} style={{ ...inputStyle, width: 130 }}>
            <option value="">Toutes variétés</option>
            {VARIETIES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: COLORS.sand }}>
                {["Référence", "Site", "Variété", "Année", "GPS Décimal", "GPS DMS", "Motif", "Statut", "Notes", ""].map(h => (
                  <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontWeight: 700, color: COLORS.forest, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ background: i % 2 === 0 ? COLORS.white : "#FAFAF5" }}>
                  <td style={{ ...td, fontWeight: 800, color: COLORS.forest }}>{t.ref}</td>
                  <td style={td}>{t.site}</td>
                  <td style={td}><Badge color="green">{t.variety}</Badge></td>
                  <td style={td}>{t.year}</td>
                  <td style={{ ...td, fontSize: 11, fontFamily: "monospace" }}>{formatGPS(t.latDec, t.lngDec)}</td>
                  <td style={{ ...td, fontSize: 11 }}>{formatDMS(t.latDec, t.lngDec)}</td>
                  <td style={{ ...td, fontSize: 11 }}>{t.reason}</td>
                  <td style={td}><Badge color={t.status === "Actif" ? "green" : "amber"}>{t.status}</Badge></td>
                  <td style={{ ...td, color: COLORS.muted, fontSize: 11 }}>{t.notes || "—"}</td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {t.latDec && t.lngDec && (
                        <a href={`https://maps.google.com/?q=${t.latDec},${t.lngDec}`} target="_blank" rel="noreferrer"
                          style={{ textDecoration: "none", fontSize: 16 }} title="Voir sur carte">🗺️</a>
                      )}
                      <Btn small variant="secondary" onClick={() => edit(t)}>✏️</Btn>
                      <Btn small variant="danger" onClick={() => del(t.id)}>🗑️</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Styles communs ──────────────────────────────────────────────────────────
const sectionTitle = {
  margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: COLORS.forest,
  paddingBottom: 10, borderBottom: `2px solid ${COLORS.sand}`,
};
const td = { padding: "10px 12px", verticalAlign: "middle" };
// ─── Helpers LocalStorage ────────────────────────────────────────────────────

// ─── Helpers LocalStorage ────────────────────────────────────────────────────
function loadLS(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── MODULE : Compte d'Exploitation ─────────────────────────────────────────
function PnLModule({ sales, harvests, staff, tempWork, charges }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [viewMode, setViewMode] = useState("annuel");

  const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

  const filterYear = (arr, dateKey) => arr.filter(x => x[dateKey] && x[dateKey].startsWith(year));

  const ySales    = filterYear(sales, "date");
  const yHarvests = filterYear(harvests, "date");
  const yTemp     = filterYear(tempWork, "date");
  const yCharges  = filterYear(charges, "date");

  const revenuVentes      = ySales.reduce((s, v) => s + v.qty * v.price, 0);
  const totalRecolte      = yHarvests.reduce((s, h) => s + h.qty, 0);
  const totalVenduKg      = ySales.reduce((s, v) => s + v.qty, 0);
  const prixMoyen         = ySales.length > 0 ? ySales.reduce((s, v) => s + v.price, 0) / ySales.length : 0;
  const stockNonVendu     = Math.max(0, totalRecolte - totalVenduKg);
  const valorisationStock = Math.round(stockNonVendu * prixMoyen);
  const totalProduits     = revenuVentes + valorisationStock;

  const masseSal         = staff.filter(s => s.status === "Actif").reduce((s, e) => s + e.salary, 0) * 12;
  const chargesMOTemp    = yTemp.reduce((s, t) => s + t.total, 0);
  const chargesIntrants  = yCharges.filter(c => c.category === "Intrants agricoles").reduce((s, c) => s + c.amount, 0);
  const chargesCarbu     = yCharges.filter(c => c.category === "Carburant & transport").reduce((s, c) => s + c.amount, 0);
  const chargesMat       = yCharges.filter(c => c.category === "Matériel & équipements").reduce((s, c) => s + c.amount, 0);
  const chargesEmb       = yCharges.filter(c => c.category === "Emballage & stockage").reduce((s, c) => s + c.amount, 0);
  const chargesIrrig     = yCharges.filter(c => c.category === "Irrigation & eau").reduce((s, c) => s + c.amount, 0);
  const chargesEnt       = yCharges.filter(c => c.category === "Entretien & réparations").reduce((s, c) => s + c.amount, 0);
  const chargesTaxes     = yCharges.filter(c => ["Impôts & taxes","Certification & normes"].includes(c.category)).reduce((s, c) => s + c.amount, 0);
  const chargesDivers    = yCharges.filter(c => ["Communication & divers","Frais vétérinaires / santé végétale","Amortissements"].includes(c.category)).reduce((s, c) => s + c.amount, 0);
  const totalCharges     = masseSal + chargesMOTemp + chargesIntrants + chargesCarbu + chargesMat + chargesEmb + chargesIrrig + chargesEnt + chargesTaxes + chargesDivers;

  const MBA           = totalProduits - chargesIntrants - chargesMOTemp - chargesCarbu - chargesEmb;
  const EBE           = totalProduits - totalCharges + chargesDivers;
  const resultatNet   = totalProduits - totalCharges;
  const margeNette    = totalProduits > 0 ? ((resultatNet / totalProduits) * 100).toFixed(1) : 0;
  const coutParKg     = totalRecolte > 0 ? Math.round(totalCharges / totalRecolte) : 0;
  const prixRevient   = totalVenduKg > 0 ? Math.round(totalCharges / totalVenduKg) : 0;

  const monthlyData = MONTHS.map((m, idx) => {
    const key = `${year}-${String(idx + 1).padStart(2, "0")}`;
    const rev = sales.filter(v => v.date && v.date.startsWith(key)).reduce((s, v) => s + v.qty * v.price, 0);
    const chg = charges.filter(c => c.date && c.date.startsWith(key)).reduce((s, c) => s + c.amount, 0);
    const tmp = tempWork.filter(t => t.date && t.date.startsWith(key)).reduce((s, t) => s + t.total, 0);
    const sal = staff.filter(s => s.status === "Actif").reduce((s, e) => s + e.salary, 0);
    return { m, rev, cout: chg + tmp + sal, result: rev - chg - tmp - sal };
  });

  const maxM = Math.max(...monthlyData.map(d => Math.max(d.rev, d.cout)), 1);
  const rc = resultatNet >= 0 ? "#065F46" : "#DC2626";
  const rb = resultatNet >= 0 ? "#D1FAE5" : "#FEE2E2";

  const Row = ({ label, amount, indent, bold, highlight, separator, positive }) => (
    separator
      ? <tr><td colSpan={3} style={{ padding: "4px 0" }}><div style={{ borderTop: `1px solid ${COLORS.sand}` }} /></td></tr>
      : <tr style={{ background: highlight ? rb : "transparent" }}>
          <td style={{ padding: "8px 12px", fontSize: indent ? 13 : 14, paddingLeft: indent ? 28 : 12, color: indent ? COLORS.muted : COLORS.text, fontWeight: bold ? 800 : 400 }}>{label}</td>
          <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 14, fontWeight: bold ? 800 : 600, color: highlight ? rc : positive ? "#065F46" : COLORS.text }}>
            {amount !== undefined ? `${amount < 0 ? "− " : ""}${Math.abs(amount).toLocaleString()} FCFA` : ""}
          </td>
          <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 12, color: COLORS.muted }}>
            {amount !== undefined && totalProduits > 0 ? `${((Math.abs(amount) / totalProduits) * 100).toFixed(1)}%` : ""}
          </td>
        </tr>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Contrôles */}
      <Card style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>Exercice</label>
          <select value={year} onChange={e => setYear(e.target.value)} style={{ ...inputStyle, width: 100 }}>
            {["2022","2023","2024","2025","2026"].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{id:"annuel",label:"📄 Annuel"},{id:"mensuel",label:"📅 Mensuel"}].map(v => (
            <button key={v.id} onClick={() => setViewMode(v.id)} style={{
              background: viewMode === v.id ? COLORS.green : COLORS.sand,
              color: viewMode === v.id ? COLORS.white : COLORS.forest,
              border: "none", borderRadius: 8, padding: "8px 16px",
              fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>{v.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Chiffre d'affaires", val: `${(totalProduits/1000).toFixed(0)}K FCFA`, bg: "#DBEAFE" },
            { label: "Résultat net", val: `${resultatNet >= 0 ? "+" : "−"}${(Math.abs(resultatNet)/1000).toFixed(0)}K FCFA`, bg: rb },
            { label: "Marge nette", val: `${margeNette}%`, bg: rb },
            { label: "Coût / kg récolté", val: `${coutParKg} FCFA`, bg: "#F3F4F6" },
          ].map(k => (
            <div key={k.label} style={{ background: k.bg, borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.forest }}>{k.val}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>{k.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {viewMode === "annuel" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {/* Compte d'exploitation */}
          <Card style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button onClick={() => exportPDF(
                `Compte d'Exploitation ${year}`,
                ["Libellé", "Montant (FCFA)", "% CA"],
                [
                  ["TOTAL PRODUITS", totalProduits, "100%"],
                  ["  Ventes d'avocats", revenuVentes, totalProduits>0?(revenuVentes/totalProduits*100).toFixed(1)+"%":""],
                  ["  Stock valorisé", valorisationStock, ""],
                  ["TOTAL CHARGES", totalCharges, totalProduits>0?(totalCharges/totalProduits*100).toFixed(1)+"%":""],
                  ["  Salaires permanents", masseSal, ""],
                  ["  MO temporaire", chargesMOTemp, ""],
                  ["  Intrants agricoles", chargesIntrants, ""],
                  ["  Carburant & transport", chargesCarbu, ""],
                  ["  Irrigation & eau", chargesIrrig, ""],
                  ["  Emballage & stockage", chargesEmb, ""],
                  ["  Entretien & réparations", chargesEnt, ""],
                  ["  Matériel & équipements", chargesMat, ""],
                  ["  Taxes & certifications", chargesTaxes, ""],
                  ["  Divers & amortissements", chargesDivers, ""],
                  ["Marge Brute Agricole", MBA, totalProduits>0?(MBA/totalProduits*100).toFixed(1)+"%":""],
                  ["Excédent Brut d'Exploitation", EBE, totalProduits>0?(EBE/totalProduits*100).toFixed(1)+"%":""],
                  [resultatNet>=0?"BÉNÉFICE NET":"DÉFICIT NET", resultatNet, margeNette+"%"],
                ],
                [
                  {label:"Exercice", val:year},
                  {label:"CA", val:totalProduits.toLocaleString()+" FCFA"},
                  {label:"Résultat", val:(resultatNet>=0?"+":"")+resultatNet.toLocaleString()+" FCFA"},
                  {label:"Marge nette", val:margeNette+"%"},
                  {label:"Coût/kg", val:coutParKg+" FCFA"},
                ]
              )} style={{
                background:"#DC2626",color:"white",border:"none",borderRadius:8,
                padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginRight:8
              }}>📄 Export PDF Compte Exploitation</button>
              <button onClick={() => exportCSV("compte_exploitation_"+year, ["Libellé","Montant (FCFA)","%CA"], [
                ["TOTAL PRODUITS",totalProduits,"100%"],
                ["Ventes",revenuVentes,""],["Stock valorisé",valorisationStock,""],
                ["TOTAL CHARGES",totalCharges,""],["Salaires",masseSal,""],
                ["MO temporaire",chargesMOTemp,""],["Intrants",chargesIntrants,""],
                ["Carburant",chargesCarbu,""],["Irrigation",chargesIrrig,""],
                ["Emballage",chargesEmb,""],["Entretien",chargesEnt,""],
                ["Matériel",chargesMat,""],["Taxes",chargesTaxes,""],["Divers",chargesDivers,""],
                ["MBA",MBA,""],["EBE",EBE,""],
                [resultatNet>=0?"BÉNÉFICE":"DÉFICIT",resultatNet,margeNette+"%"]
              ])} style={{
                background:"#065F46",color:"white",border:"none",borderRadius:8,
                padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"
              }}>📊 Export Excel/CSV</button>
            </div>
            <h3 style={sectionTitle}>📄 Compte d'Exploitation — Exercice {year}</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: COLORS.forest }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: COLORS.white, fontWeight: 700, fontSize: 13 }}>Libellé</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: COLORS.white, fontWeight: 700, fontSize: 13 }}>Montant (FCFA)</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: COLORS.lime, fontWeight: 700, fontSize: 13 }}>% CA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#EFF6FF" }}><td colSpan={3} style={{ padding: "8px 12px", fontWeight: 800, fontSize: 14, color: "#1D4ED8" }}>▶ PRODUITS D'EXPLOITATION</td></tr>
                  <Row label="Ventes d'avocats" amount={revenuVentes} indent />
                  <Row label={`Valorisation stock non vendu (${stockNonVendu} kg × ${Math.round(prixMoyen)} F/kg)`} amount={valorisationStock} indent />
                  <Row label="TOTAL PRODUITS" amount={totalProduits} bold positive />
                  <Row separator />
                  <tr style={{ background: "#FFF7ED" }}><td colSpan={3} style={{ padding: "8px 12px", fontWeight: 800, fontSize: 14, color: "#C2410C" }}>▶ CHARGES D'EXPLOITATION</td></tr>
                  <tr style={{ background: "#F9FAFB" }}><td colSpan={3} style={{ padding: "6px 12px 2px", fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase" }}>— Charges de personnel —</td></tr>
                  <Row label={`Salaires permanents (${staff.filter(s=>s.status==="Actif").length} employés × 12 mois)`} amount={masseSal} indent />
                  <Row label="Main d'œuvre temporaire" amount={chargesMOTemp} indent />
                  <Row separator />
                  <tr style={{ background: "#F9FAFB" }}><td colSpan={3} style={{ padding: "6px 12px 2px", fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase" }}>— Charges opérationnelles —</td></tr>
                  <Row label="Intrants agricoles (engrais, phytosanitaires)" amount={chargesIntrants} indent />
                  <Row label="Carburant & transport" amount={chargesCarbu} indent />
                  <Row label="Irrigation & eau" amount={chargesIrrig} indent />
                  <Row label="Emballage & stockage" amount={chargesEmb} indent />
                  <Row label="Entretien & réparations" amount={chargesEnt} indent />
                  <Row label="Matériel & équipements" amount={chargesMat} indent />
                  <Row separator />
                  <tr style={{ background: "#F9FAFB" }}><td colSpan={3} style={{ padding: "6px 12px 2px", fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase" }}>— Charges de structure —</td></tr>
                  <Row label="Impôts, taxes & certifications" amount={chargesTaxes} indent />
                  <Row label="Communication, amortissements & divers" amount={chargesDivers} indent />
                  <Row separator />
                  <Row label="TOTAL CHARGES" amount={totalCharges} bold />
                  <Row separator />
                  <tr style={{ background: "#F0FDF4" }}><td colSpan={3} style={{ padding: "8px 12px", fontWeight: 800, fontSize: 14, color: "#166534" }}>▶ SOLDES INTERMÉDIAIRES</td></tr>
                  <tr style={{ background: "#F0FDF4" }}>
                    <td style={{ padding: "8px 12px 4px", fontSize: 13, color: COLORS.muted, fontStyle: "italic" }}>Marge Brute Agricole (CA − intrants − MO temp − transport − emballage)</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, color: MBA >= 0 ? "#065F46" : "#DC2626" }}>{MBA.toLocaleString()} FCFA</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 12, color: COLORS.muted }}>{totalProduits > 0 ? `${((MBA/totalProduits)*100).toFixed(1)}%` : ""}</td>
                  </tr>
                  <tr style={{ background: "#F0FDF4" }}>
                    <td style={{ padding: "4px 12px 8px", fontSize: 13, color: COLORS.muted, fontStyle: "italic" }}>Excédent Brut d'Exploitation (avant amortissements)</td>
                    <td style={{ padding: "4px 12px", textAlign: "right", fontWeight: 700, color: EBE >= 0 ? "#065F46" : "#DC2626" }}>{EBE.toLocaleString()} FCFA</td>
                    <td style={{ padding: "4px 12px", textAlign: "right", fontSize: 12, color: COLORS.muted }}>{totalProduits > 0 ? `${((EBE/totalProduits)*100).toFixed(1)}%` : ""}</td>
                  </tr>
                  <Row separator />
                  <Row label={`RÉSULTAT NET ${year}  ${resultatNet >= 0 ? "✅ BÉNÉFICE" : "⚠️ DÉFICIT"}`} amount={resultatNet} bold highlight />
                </tbody>
              </table>
            </div>
          </Card>

          {/* Indicateurs */}
          <Card>
            <h3 style={sectionTitle}>📊 Indicateurs de performance</h3>
            {[
              { label: "Chiffre d'affaires", val: `${totalProduits.toLocaleString()} FCFA`, ok: true, icon: "💰" },
              { label: "Résultat net", val: `${resultatNet >= 0 ? "+" : ""}${resultatNet.toLocaleString()} FCFA`, ok: resultatNet >= 0, icon: resultatNet >= 0 ? "✅" : "⚠️" },
              { label: "Taux de marge nette", val: `${margeNette}%`, ok: +margeNette >= 15, icon: "📈" },
              { label: "Récolte totale", val: `${totalRecolte.toLocaleString()} kg`, ok: true, icon: "🧺" },
              { label: "Quantité vendue", val: `${totalVenduKg.toLocaleString()} kg (${totalRecolte > 0 ? Math.round(totalVenduKg/totalRecolte*100) : 0}%)`, ok: true, icon: "📦" },
              { label: "Prix de vente moyen", val: `${Math.round(prixMoyen).toLocaleString()} FCFA/kg`, ok: true, icon: "🏷️" },
              { label: "Coût de revient / kg", val: `${prixRevient.toLocaleString()} FCFA/kg`, ok: prixRevient < prixMoyen, icon: "⚙️" },
              { label: "Marge / kg vendu", val: `${(Math.round(prixMoyen) - prixRevient).toLocaleString()} FCFA/kg`, ok: prixMoyen > prixRevient, icon: "💹" },
            ].map(k => (
              <div key={k.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.sand}` }}>
                <span style={{ fontSize: 13 }}>{k.icon} {k.label}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: k.ok ? COLORS.forest : "#DC2626" }}>{k.val}</span>
              </div>
            ))}
          </Card>

          {/* Structure charges */}
          <Card>
            <h3 style={sectionTitle}>🥧 Structure des charges</h3>
            {[
              { label: "Personnel permanent", amount: masseSal, color: "#3B82F6" },
              { label: "MO temporaire", amount: chargesMOTemp, color: "#F59E0B" },
              { label: "Intrants agricoles", amount: chargesIntrants, color: "#10B981" },
              { label: "Transport & carburant", amount: chargesCarbu, color: "#6B7280" },
              { label: "Matériel & équipements", amount: chargesMat, color: "#8B5CF6" },
              { label: "Emballage & stockage", amount: chargesEmb, color: "#EC4899" },
              { label: "Irrigation & eau", amount: chargesIrrig, color: "#06B6D4" },
              { label: "Entretien", amount: chargesEnt, color: "#D97706" },
              { label: "Taxes & divers", amount: chargesTaxes + chargesDivers, color: "#9CA3AF" },
            ].filter(x => x.amount > 0).map(x => {
              const pct = totalCharges > 0 ? (x.amount / totalCharges) * 100 : 0;
              return (
                <div key={x.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span>{x.label}</span>
                    <span style={{ fontWeight: 700 }}>{x.amount.toLocaleString()} F <span style={{ color: COLORS.muted, fontWeight: 400 }}>({pct.toFixed(1)}%)</span></span>
                  </div>
                  <div style={{ height: 8, background: COLORS.sand, borderRadius: 4 }}>
                    <div style={{ height: 8, width: `${pct}%`, background: x.color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {viewMode === "mensuel" && (
        <Card>
          <h3 style={sectionTitle}>📅 Évolution mensuelle — {year}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4, textAlign: "center", fontSize: 11, fontWeight: 700, color: COLORS.muted }}>
              {MONTHS.map(m => <div key={m}>{m}</div>)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1D4ED8", margin: "6px 0 2px" }}>💰 Revenus</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4, alignItems: "flex-end", height: 60 }}>
              {monthlyData.map(d => (
                <div key={d.m} title={`${d.m}: ${d.rev.toLocaleString()} F`} style={{ height: `${Math.max((d.rev/maxM)*100, d.rev > 0 ? 5 : 0)}%`, background: "#3B82F6", borderRadius: "3px 3px 0 0" }} />
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#C2410C", margin: "8px 0 2px" }}>📋 Charges totales</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4, alignItems: "flex-end", height: 60 }}>
              {monthlyData.map(d => (
                <div key={d.m} title={`${d.m}: ${d.cout.toLocaleString()} F`} style={{ height: `${Math.max((d.cout/maxM)*100, 5)}%`, background: "#F97316", borderRadius: "3px 3px 0 0" }} />
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.forest, margin: "14px 0 6px" }}>📊 Résultat mensuel</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4 }}>
              {monthlyData.map(d => (
                <div key={d.m} style={{ textAlign: "center", padding: "4px 2px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: d.result >= 0 ? "#D1FAE5" : "#FEE2E2", color: d.result >= 0 ? "#065F46" : "#DC2626" }}>
                  {d.result >= 0 ? "+" : "−"}{Math.abs(d.result/1000).toFixed(0)}K
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4, textAlign: "center", fontSize: 11, color: COLORS.muted, marginTop: 2 }}>
              {MONTHS.map(m => <div key={m}>{m}</div>)}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}


// ─── Supabase Client ─────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ftlkhqwtlrxyolfwhdyq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bGtocXd0bHJ4eW9sZndoZHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjUwMTgsImV4cCI6MjA5NTQ0MTAxOH0.KUpVjPE9HhHjWwFfj0p-jsdFQgIKXxi_G3X9YathOaQ";

async function sb(table, method = "GET", body = null, filter = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filter}`;
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": method === "POST" ? "return=representation" : method === "PATCH" ? "return=representation" : "",
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${method} ${table}: ${err}`);
  }
  if (method === "DELETE" || res.status === 204) return [];
  return res.json();
}

// CRUD helpers
const DB = {
  list:   (t)          => sb(t, "GET", null, "?order=created_at.asc"),
  insert: (t, row)     => sb(t, "POST", row),
  update: (t, id, row) => sb(t, "PATCH", row, `?id=eq.${id}`),
  remove: (t, id)      => sb(t, "DELETE", null, `?id=eq.${id}`),
};

// Mapping JS camelCase <-> DB snake_case par table
const MAPS = {
  trees: {
    toDB: r => ({ site: r.site, variety: r.variety, count: r.count, year: r.year, status: r.status, notes: r.notes || "" }),
    fromDB: r => ({ id: r.id, site: r.site, variety: r.variety, count: r.count, year: r.year, status: r.status, notes: r.notes }),
  },
  harvests: {
    toDB: r => ({ date: r.date, site: r.site, variety: r.variety, qty: r.qty, unit: r.unit || "kg", notes: r.notes || "" }),
    fromDB: r => ({ id: r.id, date: r.date, site: r.site, variety: r.variety, qty: +r.qty, unit: r.unit, notes: r.notes }),
  },
  sales: {
    toDB: r => ({ date: r.date, buyer: r.buyer, variety: r.variety, qty: r.qty, unit: r.unit || "kg", price: r.price, paid: r.paid || false, notes: r.notes || "" }),
    fromDB: r => ({ id: r.id, date: r.date, buyer: r.buyer, variety: r.variety, qty: +r.qty, unit: r.unit, price: +r.price, paid: r.paid, notes: r.notes }),
  },
  treatments: {
    toDB: r => ({ date: r.date, site: r.site, type: r.type, product: r.product || "", qty: r.qty || 0, unit: r.unit || "", notes: r.notes || "" }),
    fromDB: r => ({ id: r.id, date: r.date, site: r.site, type: r.type, product: r.product, qty: +r.qty, unit: r.unit, notes: r.notes }),
  },
  nursery_batches: {
    toDB: r => ({ name: r.name, start_date: r.startDate, site: r.site, variety: r.variety, qty_seeds: r.qtySeeds, qty_alive: r.qtyAlive, stage: r.stage, notes: r.notes || "" }),
    fromDB: r => ({ id: r.id, name: r.name, startDate: r.start_date, site: r.site, variety: r.variety, qtySeeds: +r.qty_seeds, qtyAlive: +r.qty_alive, stage: r.stage, notes: r.notes }),
  },
  graftings: {
    toDB: r => ({ date: r.date, batch_id: null, batch_name: r.batchName || "", technique: r.technique, rootstock: r.rootstock, scion: r.scion, qty_grafted: r.qtyGrafted, qty_success: r.qtySuccess || 0, check_date: r.checkDate || null, status: r.status, destination: r.destination || "", notes: r.notes || "" }),
    fromDB: r => ({ id: r.id, date: r.date, batchId: r.batch_id, batchName: r.batch_name, technique: r.technique, rootstock: r.rootstock, scion: r.scion, qtyGrafted: +r.qty_grafted, qtySuccess: +r.qty_success, checkDate: r.check_date, status: r.status, destination: r.destination, notes: r.notes }),
  },
  staff: {
    toDB: r => ({ name: r.name, role: r.role, site: r.site, salary: r.salary, start_date: r.startDate, status: r.status, phone: r.phone || "", notes: r.notes || "" }),
    fromDB: r => ({ id: r.id, name: r.name, role: r.role, site: r.site, salary: +r.salary, startDate: r.start_date, status: r.status, phone: r.phone, notes: r.notes }),
  },
  temp_work: {
    toDB: r => ({ date: r.date, site: r.site, task: r.task, nb_workers: r.nbWorkers, nb_days: r.nbDays, daily_rate: r.dailyRate, total: r.total, notes: r.notes || "" }),
    fromDB: r => ({ id: r.id, date: r.date, site: r.site, task: r.task, nbWorkers: +r.nb_workers, nbDays: +r.nb_days, dailyRate: +r.daily_rate, total: +r.total, notes: r.notes }),
  },
  charges: {
    toDB: r => ({ date: r.date, category: r.category, label: r.label, site: r.site || "Tous", amount: r.amount, paid: r.paid || false, notes: r.notes || "" }),
    fromDB: r => ({ id: r.id, date: r.date, category: r.category, label: r.label, site: r.site, amount: +r.amount, paid: r.paid, notes: r.notes }),
  },
};

// ─── Hook générique Supabase ─────────────────────────────────────────────────
function useSupabaseTable(tableName, lsKey, initialData) {
  const [rows, setRows] = useState(() => loadLS(lsKey, initialData));
  const [synced, setSynced] = useState(false);
  const [loading, setLoading] = useState(true);
  const map = MAPS[tableName];

  // Chargement initial depuis Supabase
  useEffect(() => {
    DB.list(tableName)
      .then(data => {
        const converted = data.map(map.fromDB);
        setRows(converted);
        saveLS(lsKey, converted);
        setSynced(true);
        setLoading(false);
      })
      .catch(() => {
        // Fallback sur localStorage si pas de connexion
        setLoading(false);
      });
  }, []);

  const add = async (item) => {
    const dbRow = map.toDB(item);
    try {
      const [saved] = await DB.insert(tableName, dbRow);
      const newItem = map.fromDB(saved);
      setRows(prev => { const n = [...prev, newItem]; saveLS(lsKey, n); return n; });
      return newItem;
    } catch {
      // Mode hors-ligne : utilise un ID temporaire
      const tmp = { ...item, id: "tmp_" + Date.now() };
      setRows(prev => { const n = [...prev, tmp]; saveLS(lsKey, n); return n; });
      return tmp;
    }
  };

  const update = async (id, item) => {
    const dbRow = map.toDB(item);
    try {
      const [saved] = await DB.update(tableName, id, dbRow);
      const updated = map.fromDB(saved);
      setRows(prev => { const n = prev.map(r => r.id === id ? updated : r); saveLS(lsKey, n); return n; });
    } catch {
      setRows(prev => { const n = prev.map(r => r.id === id ? { ...item, id } : r); saveLS(lsKey, n); return n; });
    }
  };

  const remove = async (id) => {
    try { await DB.remove(tableName, id); } catch {}
    setRows(prev => { const n = prev.filter(r => r.id !== id); saveLS(lsKey, n); return n; });
  };

  const toggle = async (id, field) => {
    const row = rows.find(r => r.id === id);
    if (!row) return;
    await update(id, { ...row, [field]: !row[field] });
  };

  return { rows, add, update, remove, toggle, loading, synced };
}

// ─── APP PRINCIPALE ──────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard",      label: "Tableau de bord",    icon: "📊" },
  { id: "sites",          label: "Sites",              icon: "📍" },
  { id: "trees",          label: "Parcelles",          icon: "🌳" },
  { id: "selected_trees", label: "Pieds sélectionnés", icon: "⭐" },
  { id: "nursery",        label: "Pépinière",          icon: "🌱" },
  { id: "harvest",        label: "Récoltes",           icon: "🧺" },
  { id: "sales",          label: "Ventes",             icon: "💰" },
  { id: "treatments",     label: "Interventions",      icon: "🌿" },
  { id: "hr",             label: "RH & Charges",       icon: "👷" },
  { id: "pnl",            label: "Compte Exploit.",    icon: "📄" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");

  // ── Chaque table est un hook Supabase (avec fallback localStorage)
  const treesDB      = useSupabaseTable("trees",          "avo_trees",    initialTrees);
  const harvestsDB   = useSupabaseTable("harvests",       "avo_harvests", initialHarvests);
  const salesDB      = useSupabaseTable("sales",          "avo_sales",    initialSales);
  const treatsDB     = useSupabaseTable("treatments",     "avo_treats",   initialTreatments);
  const nurseryDB    = useSupabaseTable("nursery_batches","avo_nursery",  initialNurseryBatches);
  const graftingsDB  = useSupabaseTable("graftings",      "avo_grafts",   initialGraftings);
  const staffDB      = useSupabaseTable("staff",          "avo_staff",    initialPermanentStaff);
  const tempDB       = useSupabaseTable("temp_work",      "avo_temp",     initialTempWork);
  const chargesDB    = useSupabaseTable("charges",        "avo_charges",  initialCharges);

  // ── État local pour sites et pieds sélectionnés (localStorage uniquement)
  const [sitesList,      setSitesListRaw]   = useState(() => loadLS("avo_sites_list",    initialSitesList));
  const [selectedTrees,  setSelTreesRaw]    = useState(() => loadLS("avo_selected_trees", initialSelectedTrees));

  const setSitesList     = (v) => { setSitesListRaw(v);  saveLS("avo_sites_list", v); };
  const setSelectedTrees = (v) => { setSelTreesRaw(v);   saveLS("avo_selected_trees", v); };

  const allLoading = [treesDB, harvestsDB, salesDB, treatsDB, nurseryDB, graftingsDB, staffDB, tempDB, chargesDB].some(d => d.loading);
  const allSynced  = [treesDB, harvestsDB, salesDB, treatsDB, nurseryDB, graftingsDB, staffDB, tempDB, chargesDB].every(d => d.synced);

  // ── Adaptateurs pour les modules existants (add/remove/update -> setState style)
  const makeAdapter = (db) => ({
    rows:   db.rows,
    set:    (updater) => {}, // non utilisé directement
    add:    db.add,
    update: db.update,
    remove: db.remove,
    toggle: db.toggle,
  });

  // Wrappers compatibles avec les modules existants (qui utilisent setXxx(newArray))
  const wrapSet = (db) => async (valOrFn) => {
    // Les modules passent soit un tableau complet soit une fonction
    // On détecte ajout/suppression en comparant avec db.rows
    if (typeof valOrFn === "function") {
      const newArr = valOrFn(db.rows);
      // Trouver la différence
      const added   = newArr.filter(n => !db.rows.find(o => o.id === n.id));
      const removed = db.rows.filter(o => !newArr.find(n => n.id === o.id));
      const updated = newArr.filter(n => {
        const old = db.rows.find(o => o.id === n.id);
        return old && JSON.stringify(old) !== JSON.stringify(n);
      });
      for (const r of added)   await db.add(r);
      for (const r of removed) await db.remove(r.id);
      for (const r of updated) await db.update(r.id, r);
    } else {
      const newArr = valOrFn;
      const added   = newArr.filter(n => !db.rows.find(o => o.id === n.id));
      const removed = db.rows.filter(o => !newArr.find(n => n.id === o.id));
      const updated = newArr.filter(n => {
        const old = db.rows.find(o => o.id === n.id);
        return old && JSON.stringify(old) !== JSON.stringify(n);
      });
      for (const r of added)   await db.add(r);
      for (const r of removed) await db.remove(r.id);
      for (const r of updated) await db.update(r.id, r);
    }
  };

  const trees      = treesDB.rows;
  const harvests   = harvestsDB.rows;
  const sales      = salesDB.rows;
  const treatments = treatsDB.rows;
  const nurseryBatches = nurseryDB.rows;
  const graftings  = graftingsDB.rows;
  const staff      = staffDB.rows;
  const tempWork   = tempDB.rows;
  const charges    = chargesDB.rows;

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
    <div style={{ minHeight: "100vh", background: COLORS.cream, fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.forest} 0%, ${COLORS.green} 100%)`, padding: "18px 24px 0", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 36 }}>🥑</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, color: COLORS.white, fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>AvoManager Cameroun</h1>
              <p style={{ margin: 0, color: COLORS.lime, fontSize: 13 }}>Gestion de vos exploitations avocatières</p>
            </div>
            {/* Badge connexion Supabase */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <div style={{
                background: allSynced ? "#D1FAE5" : allLoading ? "rgba(255,255,255,0.2)" : "#FEF3C7",
                color: allSynced ? "#065F46" : allLoading ? "rgba(255,255,255,0.9)" : "#92400E",
                padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, transition: "all 0.4s",
              }}>
                {allLoading ? "⏳ Connexion Supabase..." : allSynced ? "☁️ Supabase connecté" : "⚠️ Mode hors-ligne"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textAlign: "right" }}>
                {allSynced ? "Données sauvegardées en ligne ✓" : "Sauvegarde locale active"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 3, overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: tab === t.id ? COLORS.cream : "transparent",
                color: tab === t.id ? COLORS.forest : "rgba(255,255,255,0.75)",
                border: "none", borderRadius: "10px 10px 0 0", padding: "9px 13px",
                fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
              }}>{t.icon} {t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        {allLoading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 40, color: COLORS.muted }}>
            <div style={{ fontSize: 32 }}>⏳</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Connexion à Supabase en cours…</div>
              <div style={{ fontSize: 13 }}>Chargement de vos données depuis le cloud</div>
            </div>
          </div>
        )}
        {!allLoading && <>
          {tab === "dashboard"  && <Dashboard    trees={trees} harvests={harvests} sales={sales} treatments={treatments} />}
          {tab === "trees"      && <TreesModule   trees={trees} setTrees={setTrees} />}
          {tab === "nursery"    && <NurseryModule batches={nurseryBatches} setBatches={setBatches} graftings={graftings} setGraftings={setGraftings} />}
          {tab === "harvest"    && <HarvestModule harvests={harvests} setHarvests={setHarvests} />}
          {tab === "sales"      && <SalesModule   sales={sales} setSales={setSales} />}
          {tab === "treatments" && <TreatmentsModule treatments={treatments} setTreatments={setTreatments} />}
          {tab === "hr"         && <HRChargesModule staff={staff} setStaff={setStaff} tempWork={tempWork} setTempWork={setTempWork} charges={charges} setCharges={setCharges} />}
          {tab === "sites"          && <SitesModule sitesList={sitesList} setSitesList={setSitesList} />}
          {tab === "selected_trees" && <SelectedTreesModule selectedTrees={selectedTrees} setSelectedTrees={setSelectedTrees} sitesList={sitesList} />}
          {tab === "pnl"            && <PnLModule sales={sales} harvests={harvests} staff={staff} tempWork={tempWork} charges={charges} />}
        </>}
      </div>
    </div>
  );
}
