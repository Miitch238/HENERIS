import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../styles/shopper.css';
import './ShopperGains.css';

const MOCK_PAIEMENTS = [
  { id: 'PAY-001', article: 'Hermès Birkin 30 Noir',   client: 'Marie D.',     montant: 10350, statut: 'versé',    date: '2026-04-28' },
  { id: 'PAY-002', article: 'Chanel Classic Flap',      client: 'Aline R.',     montant: 8460,  statut: 'versé',    date: '2026-04-01' },
  { id: 'PAY-003', article: 'Collier Cartier Love',     client: 'Isabelle M.',  montant: 4230,  statut: 'en escrow', date: '2026-05-12' },
  { id: 'PAY-004', article: 'Rolex Datejust 36mm',      client: 'Alexandre S.', montant: 8010,  statut: 'en escrow', date: '2026-05-10' },
  { id: 'PAY-005', article: 'Zegna Couture Veste',      client: 'Thomas B.',    montant: 2880,  statut: 'remboursé', date: '2026-04-15' },
];

const ST = {
  'versé':     { cls: 'sg-badge--green',  label: 'Versé' },
  'en escrow': { cls: 'sg-badge--blue',   label: 'En escrow' },
  'remboursé': { cls: 'sg-badge--grey',   label: 'Remboursé' },
};

export default function ShopperGains() {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('tous');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const paiements = filter === 'tous' ? MOCK_PAIEMENTS : MOCK_PAIEMENTS.filter(p => p.statut === filter);
  const totalVersé  = MOCK_PAIEMENTS.filter(p => p.statut === 'versé').reduce((a, p) => a + p.montant, 0);
  const totalEscrow = MOCK_PAIEMENTS.filter(p => p.statut === 'en escrow').reduce((a, p) => a + p.montant, 0);
  const totalBrut   = MOCK_PAIEMENTS.reduce((a, p) => a + p.montant, 0);

  return (
    <ShopperLayout user={user}>
      <div className="sp-page">
        <div className="sp-header">
          <div>
            <p className="sp-eyebrow">Shopper</p>
            <h1 className="sp-title">Mes gains</h1>
            <p className="sp-subtitle">Paiements Stripe Connect — commission Hénéris déjà déduite (10%)</p>
          </div>
        </div>

        {/* Cartes récap */}
        <div className="sg-cards">
          <div className="sg-card">
            <p className="sg-card-label">Total versé</p>
            <p className="sg-card-value sg-card-value--green">{totalVersé.toLocaleString('fr-FR')} €</p>
            <p className="sg-card-sub">Sur votre compte Stripe</p>
          </div>
          <div className="sg-card">
            <p className="sg-card-label">En escrow</p>
            <p className="sg-card-value sg-card-value--blue">{totalEscrow.toLocaleString('fr-FR')} €</p>
            <p className="sg-card-sub">En attente de confirmation</p>
          </div>
          <div className="sg-card">
            <p className="sg-card-label">Volume total (net)</p>
            <p className="sg-card-value">{totalBrut.toLocaleString('fr-FR')} €</p>
            <p className="sg-card-sub">Hors remboursements</p>
          </div>
        </div>

        {/* Infos Stripe */}
        <div className="sg-stripe-block">
          <div className="sg-stripe-left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <div>
              <p className="sg-stripe-title">Compte Stripe Connect</p>
              <p className="sg-stripe-sub">Les virements sont effectués automatiquement après confirmation de livraison par le client.</p>
            </div>
          </div>
          <button className="sg-stripe-btn">Voir mon tableau Stripe →</button>
        </div>

        {/* Filtres */}
        <div className="sg-filters">
          {['tous', 'versé', 'en escrow', 'remboursé'].map(f => (
            <button
              key={f}
              className={`sg-filter-btn ${filter === f ? 'sg-filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tableau */}
        {paiements.length === 0 ? (
          <div className="sp-empty">Aucun paiement pour ce filtre.</div>
        ) : (
          <div className="sg-table">
            <div className="sg-table-head">
              <span>ID</span>
              <span>Article</span>
              <span>Client</span>
              <span>Montant net</span>
              <span>Statut</span>
              <span>Date</span>
            </div>
            {paiements.map(p => (
              <div className="sg-table-row" key={p.id}>
                <span className="sg-id">{p.id}</span>
                <span className="sg-article">{p.article}</span>
                <span className="sg-client">{p.client}</span>
                <span className="sg-montant">{p.montant.toLocaleString('fr-FR')} €</span>
                <span>
                  <span className={`sg-badge ${ST[p.statut].cls}`}>{ST[p.statut].label}</span>
                </span>
                <span className="sg-date">
                  {new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ShopperLayout>
  );
}
