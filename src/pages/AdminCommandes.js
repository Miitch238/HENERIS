import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';

const MOCK = [
  { id: 'CMD-001', client: 'Marie Dupont',    shopper: 'Sophie M.', article: 'Hermès Birkin 30 Noir',  montant: 11500, commission: 1150, shopper_net: 10350, statut: 'livré',    stripe: 'libéré',    date: '2026-04-28' },
  { id: 'CMD-002', client: 'Alexandre Simon', shopper: 'Marc L.',   article: 'Rolex Datejust 36mm',    montant: 8900,  commission: 890,  shopper_net: 8010,  statut: 'en cours', stripe: 'escrow',    date: '2026-05-10' },
  { id: 'CMD-003', client: 'Isabelle Martin', shopper: 'Élise D.',  article: 'Collier Cartier Love',   montant: 5000,  commission: 500,  shopper_net: 4500,  statut: 'en cours', stripe: 'escrow',    date: '2026-05-12' },
  { id: 'CMD-004', client: 'Thomas Bernard',  shopper: 'Pierre V.', article: 'Zegna Couture Veste',    montant: 3200,  commission: 320,  shopper_net: 2880,  statut: 'annulé',  stripe: 'remboursé', date: '2026-04-15' },
  { id: 'CMD-005', client: 'Aline Rousseau',  shopper: 'Sophie M.', article: 'Chanel Classic Flap',   montant: 9400,  commission: 940,  shopper_net: 8460,  statut: 'livré',    stripe: 'libéré',    date: '2026-04-01' },
];

const ST_COMMANDE = { livré: 'ap-badge--green', 'en cours': 'ap-badge--yellow', annulé: 'ap-badge--red' };
const ST_STRIPE   = { libéré: 'ap-badge--green', escrow: 'ap-badge--blue', remboursé: 'ap-badge--grey' };
const COLS = '90px minmax(110px,1fr) minmax(110px,1fr) 150px 90px 100px 90px 90px 90px';

export default function AdminCommandes() {
  const [user, setUser]     = useState(null);
  const [filter, setFilter] = useState('tous');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const commandes = filter === 'tous' ? MOCK : MOCK.filter(c => c.statut === filter);
  const volumeTotal     = MOCK.reduce((a, c) => a + c.montant, 0);
  const commissionsTotal = MOCK.reduce((a, c) => a + c.commission, 0);

  return (
    <AdminLayout user={user}>
      <div className="ap-page">
        <div className="ap-header">
          <div><p className="ap-eyebrow">Administration</p><h1 className="ap-title">Commandes</h1></div>
        </div>

        <div className="ap-stats">
          {[
            { v: MOCK.length,                                          l: 'Total' },
            { v: MOCK.filter(c => c.stripe === 'escrow').length,       l: 'En escrow' },
            { v: volumeTotal.toLocaleString('fr-FR') + ' €',          l: 'Volume total' },
            { v: commissionsTotal.toLocaleString('fr-FR') + ' €',     l: 'Commissions Hénéris' },
          ].map(s => (
            <div className="ap-stat" key={s.l}><p className="ap-stat-value">{s.v}</p><p className="ap-stat-label">{s.l}</p></div>
          ))}
        </div>

        <div className="ap-filters">
          {['tous', 'en cours', 'livré', 'annulé'].map(f => (
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
            <span>ID</span><span>Client</span><span>Shopper</span><span>Article</span><span>Montant</span><span>Commission</span><span>Net shopper</span><span>Commande</span><span>Stripe</span>
          </div>
          {commandes.map(c => (
            <div className="ap-table-row" style={{ gridTemplateColumns: COLS }} key={c.id}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#aaa' }}>{c.id}</span>
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{c.client}</span>
              <span style={{ fontSize: '0.82rem', color: '#555' }}>{c.shopper}</span>
              <span style={{ fontSize: '0.78rem' }}>{c.article}</span>
              <span style={{ fontWeight: 700 }}>{c.montant.toLocaleString('fr-FR')} €</span>
              <span style={{ color: '#2e7d32', fontWeight: 600 }}>+{c.commission.toLocaleString('fr-FR')} €</span>
              <span style={{ fontSize: '0.82rem' }}>{c.shopper_net.toLocaleString('fr-FR')} €</span>
              <span><span className={`ap-badge ${ST_COMMANDE[c.statut]}`}>{c.statut}</span></span>
              <span><span className={`ap-badge ${ST_STRIPE[c.stripe]}`}>{c.stripe}</span></span>
            </div>
          ))}
          {commandes.length === 0 && <div className="ap-empty">Aucune commande trouvée.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
