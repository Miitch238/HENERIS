import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';

const MOCK = [
  { id: 'DEM-001', client: 'Marie Dupont',    categorie: 'Maroquinerie', description: 'Hermès Birkin 30 cuir togo noir, boîte et papiers.', budget_min: 8000,  budget_max: 12000, statut: 'ouverte',  shopper: null,           created_at: '2026-05-13' },
  { id: 'DEM-002', client: 'Alexandre Simon', categorie: 'Montres',      description: 'Rolex Datejust 36mm cadran blanc, bracelet jubilé.', budget_min: 7000,  budget_max: 9500,  statut: 'en cours', shopper: 'Marc L.',      created_at: '2026-05-12' },
  { id: 'DEM-003', client: 'Isabelle Martin', categorie: 'Bijoux',       description: 'Collier Cartier Love or jaune 18k taille 38cm.',     budget_min: 3500,  budget_max: 5000,  statut: 'livrée',   shopper: 'Sophie M.',    created_at: '2026-04-20' },
  { id: 'DEM-004', client: 'Thomas Bernard',  categorie: 'Vêtements',    description: 'Veste Zegna Couture taille 50, anthracite.',          budget_min: 2000,  budget_max: 4000,  statut: 'annulée',  shopper: null,           created_at: '2026-04-10' },
  { id: 'DEM-005', client: 'Aline Rousseau',  categorie: 'Maroquinerie', description: 'Chanel Classic Flap Medium, beige, état excellent.',  budget_min: 7000,  budget_max: 10000, statut: 'ouverte',  shopper: null,           created_at: '2026-05-14' },
  { id: 'DEM-006', client: 'Marie Dupont',    categorie: 'Montres',      description: 'Omega Seamaster 300m, bracelet acier, cadran bleu.',  budget_min: 1500,  budget_max: 2500,  statut: 'en cours', shopper: 'Pierre V.',    created_at: '2026-05-08' },
];

const ST = { ouverte: 'ap-badge--blue', 'en cours': 'ap-badge--yellow', livrée: 'ap-badge--green', annulée: 'ap-badge--grey' };
const COLS = '90px minmax(120px,1fr) 110px minmax(180px,2fr) 130px 90px 100px';

export default function AdminDemandes() {
  const [user, setUser]     = useState(null);
  const [filter, setFilter] = useState('tous');
  const [search, setSearch] = useState('');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const demandes = MOCK
    .filter(d => filter === 'tous' || d.statut === filter)
    .filter(d => d.client.toLowerCase().includes(search.toLowerCase()) || d.categorie.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout user={user}>
      <div className="ap-page">
        <div className="ap-header">
          <div><p className="ap-eyebrow">Administration</p><h1 className="ap-title">Demandes</h1></div>
        </div>

        <div className="ap-stats">
          {[
            { v: MOCK.length,                                          l: 'Total' },
            { v: MOCK.filter(d => d.statut === 'ouverte').length,      l: 'Ouvertes' },
            { v: MOCK.filter(d => d.statut === 'en cours').length,     l: 'En cours' },
            { v: MOCK.filter(d => d.statut === 'livrée').length,       l: 'Livrées' },
          ].map(s => (
            <div className="ap-stat" key={s.l}><p className="ap-stat-value">{s.v}</p><p className="ap-stat-label">{s.l}</p></div>
          ))}
        </div>

        <div className="ap-filters">
          <input className="ap-search" placeholder="Rechercher client, catégorie…" value={search} onChange={e => setSearch(e.target.value)} />
          {['tous', 'ouverte', 'en cours', 'livrée', 'annulée'].map(f => (
            <button
              key={f}
              className="ap-action-btn"
              style={{ padding: '6px 14px', border: '1px solid', borderColor: filter === f ? '#C9A84C' : '#e0e0e0', borderRadius: 99, fontSize: '0.78rem', color: filter === f ? '#C9A84C' : '#888', background: filter === f ? 'rgba(201,168,76,0.06)' : 'none' }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="ap-table">
          <div className="ap-table-head" style={{ gridTemplateColumns: COLS }}>
            <span>ID</span><span>Client</span><span>Catégorie</span><span>Description</span><span>Budget</span><span>Statut</span><span>Shopper</span>
          </div>
          {demandes.map(d => (
            <div className="ap-table-row" style={{ gridTemplateColumns: COLS }} key={d.id}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#aaa' }}>{d.id}</span>
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{d.client}<br /><span style={{ fontWeight: 400, fontSize: '0.72rem', color: '#bbb' }}>{new Date(d.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span></span>
              <span style={{ fontSize: '0.78rem' }}>{d.categorie}</span>
              <span style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.4 }}>{d.description.length > 80 ? d.description.slice(0, 80) + '…' : d.description}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{d.budget_min.toLocaleString('fr-FR')} – {d.budget_max.toLocaleString('fr-FR')} €</span>
              <span><span className={`ap-badge ${ST[d.statut]}`}>{d.statut}</span></span>
              <span style={{ fontSize: '0.78rem', color: d.shopper ? '#1a1a1a' : '#bbb' }}>{d.shopper ?? '—'}</span>
            </div>
          ))}
          {demandes.length === 0 && <div className="ap-empty">Aucune demande trouvée.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
