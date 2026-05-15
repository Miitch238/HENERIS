import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';

const MOCK = [
  { id: 1, nom: 'Marie Dupont',     email: 'marie@ex.com',   demandes: 4, commandes: 3, depenses: 28400, statut: 'actif',    created_at: '2026-01-10' },
  { id: 2, nom: 'Alexandre Simon',  email: 'alex@ex.com',    demandes: 2, commandes: 2, depenses: 18700, statut: 'actif',    created_at: '2026-02-05' },
  { id: 3, nom: 'Isabelle Martin',  email: 'isa@ex.com',     demandes: 6, commandes: 5, depenses: 47200, statut: 'actif',    created_at: '2025-12-20' },
  { id: 4, nom: 'Thomas Bernard',   email: 'thomas@ex.com',  demandes: 1, commandes: 0, depenses: 0,     statut: 'inactif',  created_at: '2026-04-01' },
  { id: 5, nom: 'Aline Rousseau',   email: 'aline@ex.com',   demandes: 0, commandes: 0, depenses: 0,     statut: 'suspendu', created_at: '2026-05-10' },
];

const STATUT_CLASS = { actif: 'ap-badge--green', inactif: 'ap-badge--grey', suspendu: 'ap-badge--red' };
const COLS = 'minmax(160px,1fr) 180px 80px 90px 110px 90px 80px';

export default function AdminClients() {
  const [user, setUser]     = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const clients = MOCK.filter(c => c.nom.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout user={user}>
      <div className="ap-page">
        <div className="ap-header">
          <div><p className="ap-eyebrow">Administration</p><h1 className="ap-title">Clients</h1></div>
        </div>

        <div className="ap-stats">
          {[{ v: MOCK.length, l: 'Total' }, { v: MOCK.filter(c => c.statut === 'actif').length, l: 'Actifs' }, { v: MOCK.reduce((a, c) => a + c.commandes, 0), l: 'Commandes' }, { v: MOCK.reduce((a, c) => a + c.depenses, 0).toLocaleString('fr-FR') + ' €', l: 'Volume total' }].map(s => (
            <div className="ap-stat" key={s.l}><p className="ap-stat-value">{s.v}</p><p className="ap-stat-label">{s.l}</p></div>
          ))}
        </div>

        <div className="ap-filters">
          <input className="ap-search" placeholder="Rechercher un client…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="ap-table">
          <div className="ap-table-head" style={{ gridTemplateColumns: COLS }}>
            <span>Nom</span><span>Email</span><span>Demandes</span><span>Commandes</span><span>Dépenses</span><span>Statut</span><span>Actions</span>
          </div>
          {clients.map(c => (
            <div className="ap-table-row" style={{ gridTemplateColumns: COLS }} key={c.id}>
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{c.nom}</span>
              <span style={{ fontSize: '0.78rem', color: '#666' }}>{c.email}</span>
              <span>{c.demandes}</span>
              <span>{c.commandes}</span>
              <span style={{ fontWeight: 600 }}>{c.depenses ? c.depenses.toLocaleString('fr-FR') + ' €' : '—'}</span>
              <span><span className={`ap-badge ${STATUT_CLASS[c.statut]}`}>{c.statut}</span></span>
              <span style={{ display: 'flex', gap: 4 }}>
                <button className="ap-action-btn" title="Voir"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                <button className="ap-action-btn ap-action-btn--danger" title="Suspendre"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
