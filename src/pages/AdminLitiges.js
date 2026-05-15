import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';

const MOCK = [
  { id: 'LIT-001', client: 'Marie Dupont',    shopper: 'Sophie M.', motif: 'Article non conforme à la description', montant: 11500, statut: 'ouvert',   date: '2026-05-08' },
  { id: 'LIT-002', client: 'Thomas Bernard',  shopper: 'Pierre V.', motif: 'Livraison non reçue après 3 semaines',  montant: 3200,  statut: 'en cours',  date: '2026-04-20' },
  { id: 'LIT-003', client: 'Alexandre Simon', shopper: 'Marc L.',   motif: "Doutes sur l'authenticité de la pièce", montant: 8900,  statut: 'résolu',   date: '2026-03-15' },
  { id: 'LIT-004', client: 'Isabelle Martin', shopper: 'Élise D.',  motif: 'Retard de livraison non justifié',       montant: 5000,  statut: 'ouvert',   date: '2026-05-13' },
  { id: 'LIT-005', client: 'Aline Rousseau',  shopper: 'Sophie M.', motif: 'Article endommagé à la livraison',       montant: 9400,  statut: 'en cours',  date: '2026-05-01' },
];

const ST = { ouvert: 'ap-badge--red', 'en cours': 'ap-badge--yellow', résolu: 'ap-badge--green' };
const COLS = '90px minmax(130px,1fr) minmax(130px,1fr) minmax(200px,2fr) 110px 90px 90px';

export default function AdminLitiges() {
  const [user, setUser]     = useState(null);
  const [filter, setFilter] = useState('tous');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const litiges = filter === 'tous' ? MOCK : MOCK.filter(l => l.statut === filter);

  return (
    <AdminLayout user={user}>
      <div className="ap-page">
        <div className="ap-header">
          <div><p className="ap-eyebrow">Administration</p><h1 className="ap-title">Litiges</h1></div>
        </div>

        <div className="ap-stats">
          {[
            { v: MOCK.length,                                         l: 'Total' },
            { v: MOCK.filter(l => l.statut === 'ouvert').length,      l: 'Ouverts' },
            { v: MOCK.filter(l => l.statut === 'en cours').length,    l: 'En cours' },
            { v: MOCK.filter(l => l.statut === 'résolu').length,      l: 'Résolus' },
          ].map(s => (
            <div className="ap-stat" key={s.l}>
              <p className="ap-stat-value">{s.v}</p>
              <p className="ap-stat-label">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="ap-filters">
          {['tous', 'ouvert', 'en cours', 'résolu'].map(f => (
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
            <span>ID</span>
            <span>Client</span>
            <span>Shopper</span>
            <span>Motif</span>
            <span>Montant bloqué</span>
            <span>Statut</span>
            <span>Date</span>
          </div>
          {litiges.map(l => (
            <div className="ap-table-row" style={{ gridTemplateColumns: COLS }} key={l.id}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#aaa' }}>{l.id}</span>
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{l.client}</span>
              <span style={{ fontSize: '0.82rem', color: '#555' }}>{l.shopper}</span>
              <span style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.4 }}>{l.motif}</span>
              <span style={{ fontWeight: 700 }}>{l.montant.toLocaleString('fr-FR')} €</span>
              <span><span className={`ap-badge ${ST[l.statut]}`}>{l.statut}</span></span>
              <span style={{ fontSize: '0.75rem', color: '#bbb' }}>
                {new Date(l.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          ))}
          {litiges.length === 0 && <div className="ap-empty">Aucun litige pour ce filtre.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
