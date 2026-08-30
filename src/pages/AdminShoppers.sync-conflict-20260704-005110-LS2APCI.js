import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';

const MOCK = [
  { id: 1, nom: 'Sophie Marchand', email: 'sophie@ex.com', specialite: 'Haute Couture', city: 'Paris',  note: 4.9, commandes: 42, statut: 'actif',    stripe: 'vérifié',    created_at: '2025-11-01' },
  { id: 2, nom: 'Marc Laurent',    email: 'marc@ex.com',   specialite: 'Montres',       city: 'Genève', note: 4.8, commandes: 28, statut: 'actif',    stripe: 'vérifié',    created_at: '2025-12-15' },
  { id: 3, nom: 'Élise Dumont',    email: 'elise@ex.com',  specialite: 'Bijoux',        city: 'Paris',  note: 5.0, commandes: 17, statut: 'actif',    stripe: 'vérifié',    created_at: '2026-01-20' },
  { id: 4, nom: 'Pierre Vasseur',  email: 'pierre@ex.com', specialite: 'Vêtements',     city: 'Lyon',   note: 4.6, commandes: 9,  statut: 'en attente', stripe: 'en cours', created_at: '2026-04-10' },
  { id: 5, nom: 'Camille Roche',   email: 'camillea@ex.com',specialite: 'Maroquinerie', city: 'Bordeaux', note: null, commandes: 0, statut: 'suspendu', stripe: 'rejeté', created_at: '2026-05-01' },
];

const STRIPE_CLASS = { 'vérifié': 'ap-badge--green', 'en cours': 'ap-badge--yellow', 'rejeté': 'ap-badge--red' };
const STATUT_CLASS = { actif: 'ap-badge--green', 'en attente': 'ap-badge--yellow', suspendu: 'ap-badge--red' };
const COLS = 'minmax(160px,1fr) 180px 130px 70px 90px 100px 90px 80px';

export default function AdminShoppers() {
  const [user, setUser]   = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const shoppers = MOCK.filter(s => s.nom.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout user={user}>
      <div className="ap-page">
        <div className="ap-header">
          <div><p className="ap-eyebrow">Administration</p><h1 className="ap-title">Shoppers</h1></div>
        </div>

        <div className="ap-stats">
          {[{ v: MOCK.length, l: 'Total' }, { v: MOCK.filter(s => s.statut === 'actif').length, l: 'Actifs' }, { v: MOCK.filter(s => s.stripe === 'en cours').length, l: 'En vérification' }, { v: MOCK.filter(s => s.statut === 'suspendu').length, l: 'Suspendus' }].map(s => (
            <div className="ap-stat" key={s.l}><p className="ap-stat-value">{s.v}</p><p className="ap-stat-label">{s.l}</p></div>
          ))}
        </div>

        <div className="ap-filters">
          <input className="ap-search" placeholder="Rechercher un shopper…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="ap-table">
          <div className="ap-table-head" style={{ gridTemplateColumns: COLS }}>
            <span>Nom</span><span>Email</span><span>Spécialité</span><span>Note</span><span>Commandes</span><span>Stripe</span><span>Statut</span><span>Actions</span>
          </div>
          {shoppers.map(s => (
            <div className="ap-table-row" style={{ gridTemplateColumns: COLS }} key={s.id}>
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{s.nom}<br /><span style={{ fontWeight: 400, fontSize: '0.72rem', color: '#aaa' }}>{s.city}</span></span>
              <span style={{ fontSize: '0.78rem', color: '#666' }}>{s.email}</span>
              <span style={{ fontSize: '0.78rem' }}>{s.specialite}</span>
              <span style={{ fontWeight: 600 }}>{s.note ?? '—'}</span>
              <span>{s.commandes}</span>
              <span><span className={`ap-badge ${STRIPE_CLASS[s.stripe]}`}>{s.stripe}</span></span>
              <span><span className={`ap-badge ${STATUT_CLASS[s.statut]}`}>{s.statut}</span></span>
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
