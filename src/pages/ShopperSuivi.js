import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../styles/shopper.css';
import './Suivi.css';

const STATUS_LABEL = { en_attente: 'En attente', en_cours: 'En cours', livre: 'Livré', annule: 'Annulé' };
const STATUS_CLASS  = { en_attente: 'sv-badge--waiting', en_cours: 'sv-badge--progress', livre: 'sv-badge--done', annule: 'sv-badge--cancelled' };
const STATUS_STEP   = { en_attente: 1, en_cours: 2, livre: 3 };
const STEPS = ['Proposition acceptée', 'Article trouvé', 'Livré'];

const MOCK = [
  { id: 'CMD-001', categorie: 'Maroquinerie', article: 'Hermès Birkin 30 Noir', client: 'Marie D.',      statut: 'en_cours',   budget_min: 8000, budget_max: 12000, created_at: '2026-05-10', updated_at: '2026-05-13', gains: 9450 },
  { id: 'CMD-003', categorie: 'Bijoux',       article: 'Collier Cartier Love',  client: 'Isabelle M.', statut: 'livre',      budget_min: 3500, budget_max: 5000,  created_at: '2026-04-20', updated_at: '2026-04-28', gains: 4230 },
  { id: 'CMD-005', categorie: 'Montres',      article: 'Omega Seamaster 300m',  client: 'Thomas B.',   statut: 'en_attente', budget_min: 1500, budget_max: 2500,  created_at: '2026-05-14', updated_at: '2026-05-14', gains: null },
];

export default function ShopperSuivi() {
  const [user, setUser]     = useState(null);
  const [selected, setSelected] = useState(MOCK[0]);
  const [filter, setFilter] = useState('tous');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const commandes = filter === 'tous' ? MOCK : MOCK.filter(c => c.statut === filter);

  return (
    <ShopperLayout user={user}>
      <div className="sv-page">
        <div className="sv-header">
          <div><p className="sv-eyebrow">Shopper</p><h1 className="sv-title">Suivi commandes</h1></div>
        </div>

        <div className="sv-filters">
          {['tous', 'en_attente', 'en_cours', 'livre'].map(f => (
            <button key={f} className={`sv-filter-btn ${filter === f ? 'sv-filter-btn--active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'tous' ? 'Toutes' : STATUS_LABEL[f]}
            </button>
          ))}
        </div>

        <div className="sv-layout">
          <div className="sv-list">
            {commandes.map(c => (
              <button key={c.id} className={`sv-item ${selected?.id === c.id ? 'sv-item--active' : ''}`} onClick={() => setSelected(c)}>
                <div className="sv-item-top">
                  <span className="sv-item-cat">{c.categorie}</span>
                  <span className={`sv-badge ${STATUS_CLASS[c.statut]}`}>{STATUS_LABEL[c.statut]}</span>
                </div>
                <p className="sv-item-article">{c.article}</p>
                <div className="sv-item-bottom">
                  <span className="sv-item-id">{c.id}</span>
                  <span className="sv-item-date">{new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="sv-detail">
              <div className="sv-detail-header">
                <div>
                  <p className="sv-detail-id">{selected.id}</p>
                  <h2 className="sv-detail-article">{selected.article}</h2>
                </div>
                <span className={`sv-badge sv-badge--lg ${STATUS_CLASS[selected.statut]}`}>{STATUS_LABEL[selected.statut]}</span>
              </div>

              {selected.statut !== 'annule' && (
                <div className="sv-stepper">
                  {STEPS.map((label, i) => {
                    const step = i + 1;
                    const cur  = STATUS_STEP[selected.statut] || 0;
                    const done = step < cur; const active = step === cur;
                    return (
                      <div key={label} className="sv-step-wrap">
                        <div className={`sv-step ${done ? 'sv-step--done' : ''} ${active ? 'sv-step--active' : ''}`}>
                          <div className="sv-step-dot">
                            {done ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : <span>{step}</span>}
                          </div>
                          <p className="sv-step-label">{label}</p>
                        </div>
                        {i < STEPS.length - 1 && <div className={`sv-step-line ${done ? 'sv-step-line--done' : ''}`} />}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="sv-detail-grid">
                <div className="sv-detail-field"><p className="sv-detail-label">Client</p><p className="sv-detail-value">{selected.client}</p></div>
                <div className="sv-detail-field"><p className="sv-detail-label">Catégorie</p><p className="sv-detail-value">{selected.categorie}</p></div>
                <div className="sv-detail-field"><p className="sv-detail-label">Budget client</p><p className="sv-detail-value">{selected.budget_min.toLocaleString('fr-FR')} € – {selected.budget_max.toLocaleString('fr-FR')} €</p></div>
                <div className="sv-detail-field"><p className="sv-detail-label">Vos gains (90%)</p><p className="sv-detail-value" style={{ color: '#2e7d32', fontWeight: 700 }}>{selected.gains ? `${selected.gains.toLocaleString('fr-FR')} €` : '—'}</p></div>
              </div>

              <Link to="/shopper/messages" className="sv-msg-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Contacter {selected.client}
              </Link>
            </div>
          )}
        </div>
      </div>
    </ShopperLayout>
  );
}
