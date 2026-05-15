import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';

const MOCK = [
  { id: 'TRX-001', client: 'Marie D.',     shopper: 'Sophie M.', article: 'Birkin 30 Noir',    montant: 11500, commission: 1150, shopper_net: 10350, statut: 'libéré',    date: '2026-04-28' },
  { id: 'TRX-002', client: 'Alexandre S.', shopper: 'Marc L.',   article: 'Datejust 36mm',     montant: 8900,  commission: 890,  shopper_net: 8010,  statut: 'escrow',    date: '2026-05-10' },
  { id: 'TRX-003', client: 'Isabelle M.',  shopper: 'Élise D.',  article: 'Cartier Love',      montant: 5000,  commission: 500,  shopper_net: 4500,  statut: 'escrow',    date: '2026-05-12' },
  { id: 'TRX-004', client: 'Thomas B.',    shopper: 'Pierre V.', article: 'Zegna Couture',     montant: 3200,  commission: 320,  shopper_net: 2880,  statut: 'remboursé', date: '2026-04-15' },
  { id: 'TRX-005', client: 'Aline R.',     shopper: 'Sophie M.', article: 'Chanel Classic',    montant: 9400,  commission: 940,  shopper_net: 8460,  statut: 'libéré',    date: '2026-04-01' },
];

const ST = { 'libéré': 'ap-badge--green', 'escrow': 'ap-badge--blue', 'remboursé': 'ap-badge--yellow' };
const COLS = '100px minmax(120px,1fr) minmax(120px,1fr) 180px 100px 90px 100px 90px';

export default function AdminTransactions() {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('tous');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const txs = filter === 'tous' ? MOCK : MOCK.filter(t => t.statut === filter);
  const total = MOCK.reduce((a, t) => a + t.commission, 0);

  return (
    <AdminLayout user={user}>
      <div className="ap-page">
        <div className="ap-header">
          <div><p className="ap-eyebrow">Administration</p><h1 className="ap-title">Transactions</h1></div>
        </div>

        <div className="ap-stats">
          {[{ v: MOCK.length, l: 'Transactions' }, { v: MOCK.filter(t => t.statut === 'escrow').length, l: 'En escrow' }, { v: MOCK.reduce((a, t) => a + t.montant, 0).toLocaleString('fr-FR') + ' €', l: 'Volume total' }, { v: total.toLocaleString('fr-FR') + ' €', l: 'Commissions Hénéris' }].map(s => (
            <div className="ap-stat" key={s.l}><p className="ap-stat-value">{s.v}</p><p className="ap-stat-label">{s.l}</p></div>
          ))}
        </div>

        <div className="ap-filters">
          {['tous', 'escrow', 'libéré', 'remboursé'].map(f => (
            <button key={f} className={`ap-action-btn`} style={{ padding: '6px 14px', border: '1px solid', borderColor: filter === f ? '#C9A84C' : '#e0e0e0', borderRadius: 99, fontSize: '0.78rem', color: filter === f ? '#C9A84C' : '#888', background: filter === f ? 'rgba(201,168,76,0.06)' : 'none' }} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="ap-table">
          <div className="ap-table-head" style={{ gridTemplateColumns: COLS }}>
            <span>ID</span><span>Client</span><span>Shopper</span><span>Article</span><span>Montant</span><span>Commission</span><span>Statut</span><span>Date</span>
          </div>
          {txs.map(t => (
            <div className="ap-table-row" style={{ gridTemplateColumns: COLS }} key={t.id}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#aaa' }}>{t.id}</span>
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{t.client}</span>
              <span>{t.shopper}</span>
              <span style={{ fontSize: '0.82rem' }}>{t.article}</span>
              <span style={{ fontWeight: 700 }}>{t.montant.toLocaleString('fr-FR')} €</span>
              <span style={{ color: '#2e7d32', fontWeight: 600 }}>+{t.commission.toLocaleString('fr-FR')} €</span>
              <span><span className={`ap-badge ${ST[t.statut]}`}>{t.statut}</span></span>
              <span style={{ fontSize: '0.75rem', color: '#bbb' }}>{new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
