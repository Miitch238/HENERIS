import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';

const MOCK = [
  { id: 1, nom: 'Marie Dupont',     email: 'marie@ex.com',   role: 'client',  statut: 'actif',    created_at: '2026-01-10' },
  { id: 2, nom: 'Sophie Marchand',  email: 'sophie@ex.com',  role: 'shopper', statut: 'actif',    created_at: '2025-11-01' },
  { id: 3, nom: 'Alexandre Simon',  email: 'alex@ex.com',    role: 'client',  statut: 'actif',    created_at: '2026-02-05' },
  { id: 4, nom: 'Marc Laurent',     email: 'marc@ex.com',    role: 'shopper', statut: 'actif',    created_at: '2025-12-15' },
  { id: 5, nom: 'Isabelle Martin',  email: 'isa@ex.com',     role: 'client',  statut: 'actif',    created_at: '2025-12-20' },
  { id: 6, nom: 'Pierre Vasseur',   email: 'pierre@ex.com',  role: 'shopper', statut: 'en attente', created_at: '2026-04-10' },
  { id: 7, nom: 'Thomas Bernard',   email: 'thomas@ex.com',  role: 'client',  statut: 'inactif',  created_at: '2026-04-01' },
  { id: 8, nom: 'Camille Roche',    email: 'camille@ex.com', role: 'shopper', statut: 'suspendu', created_at: '2026-05-01' },
  { id: 9, nom: 'Aline Rousseau',   email: 'aline@ex.com',   role: 'client',  statut: 'actif',    created_at: '2026-03-18' },
  { id: 10, nom: 'Admin Hénéris',   email: 'admin@heneris.com', role: 'admin', statut: 'actif',   created_at: '2025-10-01' },
];

const ROLE_CLASS   = { client: 'ap-badge--blue', shopper: 'ap-badge--green', admin: 'ap-badge--yellow' };
const STATUT_CLASS = { actif: 'ap-badge--green', inactif: 'ap-badge--grey', suspendu: 'ap-badge--red', 'en attente': 'ap-badge--yellow' };
const COLS = 'minmax(160px,1fr) 200px 90px 100px 110px 80px';

export default function AdminUtilisateurs() {
  const [user, setUser]     = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('tous');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const list = MOCK
    .filter(u => roleFilter === 'tous' || u.role === roleFilter)
    .filter(u => u.nom.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout user={user}>
      <div className="ap-page">
        <div className="ap-header">
          <div><p className="ap-eyebrow">Administration</p><h1 className="ap-title">Utilisateurs</h1></div>
        </div>

        <div className="ap-stats">
          {[
            { v: MOCK.length,                                         l: 'Total' },
            { v: MOCK.filter(u => u.role === 'client').length,        l: 'Clients' },
            { v: MOCK.filter(u => u.role === 'shopper').length,       l: 'Shoppers' },
            { v: MOCK.filter(u => u.statut === 'suspendu').length,    l: 'Suspendus' },
          ].map(s => (
            <div className="ap-stat" key={s.l}><p className="ap-stat-value">{s.v}</p><p className="ap-stat-label">{s.l}</p></div>
          ))}
        </div>

        <div className="ap-filters">
          <input className="ap-search" placeholder="Rechercher un utilisateur…" value={search} onChange={e => setSearch(e.target.value)} />
          <select className="ap-filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="tous">Tous les rôles</option>
            <option value="client">Clients</option>
            <option value="shopper">Shoppers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="ap-table">
          <div className="ap-table-head" style={{ gridTemplateColumns: COLS }}>
            <span>Nom</span><span>Email</span><span>Rôle</span><span>Statut</span><span>Inscrit le</span><span>Actions</span>
          </div>
          {list.map(u => (
            <div className="ap-table-row" style={{ gridTemplateColumns: COLS }} key={u.id}>
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{u.nom}</span>
              <span style={{ fontSize: '0.78rem', color: '#666' }}>{u.email}</span>
              <span><span className={`ap-badge ${ROLE_CLASS[u.role]}`}>{u.role}</span></span>
              <span><span className={`ap-badge ${STATUT_CLASS[u.statut]}`}>{u.statut}</span></span>
              <span style={{ fontSize: '0.75rem', color: '#bbb' }}>
                {new Date(u.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span style={{ display: 'flex', gap: 4 }}>
                <button className="ap-action-btn" title="Voir">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button className="ap-action-btn ap-action-btn--danger" title="Suspendre">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                </button>
              </span>
            </div>
          ))}
          {list.length === 0 && <div className="ap-empty">Aucun utilisateur trouvé.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
