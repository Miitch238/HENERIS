import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ClientLayout from '../components/ClientLayout';
import './Suivi.css';

const STATUS_LABEL = {
  en_attente: 'En attente',
  en_cours:   'En cours',
  livre:      'Livré',
  annule:     'Annulé',
};

const STATUS_CLASS = {
  en_attente: 'sv-badge--waiting',
  en_cours:   'sv-badge--progress',
  livre:      'sv-badge--done',
  annule:     'sv-badge--cancelled',
};

const STATUS_STEP = { en_attente: 1, en_cours: 2, livre: 3, annule: 0 };

const MOCK_COMMANDES = [
  {
    id: 'CMD-001',
    categorie: 'Maroquinerie',
    article: 'Hermès Birkin 30 Noir',
    shopper: 'Sophie Marchand',
    budget_min: 8000,
    budget_max: 12000,
    statut: 'en_cours',
    created_at: '2026-05-10',
    updated_at: '2026-05-13',
  },
  {
    id: 'CMD-002',
    categorie: 'Montres',
    article: 'Rolex Datejust 36mm',
    shopper: 'Marc Laurent',
    budget_min: 7000,
    budget_max: 9500,
    statut: 'en_attente',
    created_at: '2026-05-12',
    updated_at: '2026-05-12',
  },
  {
    id: 'CMD-003',
    categorie: 'Bijoux',
    article: 'Collier Cartier Love',
    shopper: 'Élise Dumont',
    budget_min: 3500,
    budget_max: 5000,
    statut: 'livre',
    created_at: '2026-04-20',
    updated_at: '2026-04-28',
  },
  {
    id: 'CMD-004',
    categorie: 'Vêtements',
    article: 'Veste Zegna Couture',
    shopper: 'Pierre Vasseur',
    budget_min: 2000,
    budget_max: 4000,
    statut: 'annule',
    created_at: '2026-04-10',
    updated_at: '2026-04-15',
  },
];

const STEPS = ['Demande déposée', 'Shopper assigné', 'Livré'];

export default function Suivi() {
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState(MOCK_COMMANDES[0]);
  const [filter, setFilter] = useState('tous');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const commandes = filter === 'tous'
    ? MOCK_COMMANDES
    : MOCK_COMMANDES.filter(c => c.statut === filter);

  return (
    <ClientLayout user={user}>
      <div className="sv-page">

        {/* ── Header ── */}
        <div className="sv-header">
          <div>
            <p className="sv-eyebrow">Mes commandes</p>
            <h1 className="sv-title">Suivi</h1>
          </div>
          <Link to="/deposer-demande" className="sv-cta">+ Nouvelle demande</Link>
        </div>

        {/* ── Filtres ── */}
        <div className="sv-filters">
          {['tous', 'en_attente', 'en_cours', 'livre', 'annule'].map(f => (
            <button
              key={f}
              className={`sv-filter-btn ${filter === f ? 'sv-filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'tous' ? 'Toutes' : STATUS_LABEL[f]}
            </button>
          ))}
        </div>

        <div className="sv-layout">

          {/* ── Liste ── */}
          <div className="sv-list">
            {commandes.length === 0 ? (
              <div className="sv-empty">Aucune commande pour ce filtre.</div>
            ) : commandes.map(c => (
              <button
                key={c.id}
                className={`sv-item ${selected?.id === c.id ? 'sv-item--active' : ''}`}
                onClick={() => setSelected(c)}
              >
                <div className="sv-item-top">
                  <span className="sv-item-cat">{c.categorie}</span>
                  <span className={`sv-badge ${STATUS_CLASS[c.statut]}`}>
                    {STATUS_LABEL[c.statut]}
                  </span>
                </div>
                <p className="sv-item-article">{c.article}</p>
                <div className="sv-item-bottom">
                  <span className="sv-item-id">{c.id}</span>
                  <span className="sv-item-date">
                    {new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* ── Détail ── */}
          {selected && (
            <div className="sv-detail">
              <div className="sv-detail-header">
                <div>
                  <p className="sv-detail-id">{selected.id}</p>
                  <h2 className="sv-detail-article">{selected.article}</h2>
                </div>
                <span className={`sv-badge sv-badge--lg ${STATUS_CLASS[selected.statut]}`}>
                  {STATUS_LABEL[selected.statut]}
                </span>
              </div>

              {/* Stepper */}
              {selected.statut !== 'annule' && (
                <div className="sv-stepper">
                  {STEPS.map((label, i) => {
                    const step = i + 1;
                    const current = STATUS_STEP[selected.statut];
                    const done = step < current;
                    const active = step === current;
                    return (
                      <div key={label} className="sv-step-wrap">
                        <div className={`sv-step ${done ? 'sv-step--done' : ''} ${active ? 'sv-step--active' : ''}`}>
                          <div className="sv-step-dot">
                            {done ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                              <span>{step}</span>
                            )}
                          </div>
                          <p className="sv-step-label">{label}</p>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`sv-step-line ${done ? 'sv-step-line--done' : ''}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {selected.statut === 'annule' && (
                <div className="sv-cancelled-note">Cette commande a été annulée.</div>
              )}

              {/* Infos */}
              <div className="sv-detail-grid">
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Catégorie</p>
                  <p className="sv-detail-value">{selected.categorie}</p>
                </div>
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Shopper</p>
                  <p className="sv-detail-value">{selected.shopper}</p>
                </div>
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Budget</p>
                  <p className="sv-detail-value">
                    {selected.budget_min.toLocaleString('fr-FR')} € – {selected.budget_max.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Déposée le</p>
                  <p className="sv-detail-value">
                    {new Date(selected.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Mise à jour</p>
                  <p className="sv-detail-value">
                    {new Date(selected.updated_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <Link to="/messages" className="sv-msg-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Contacter {selected.shopper.split(' ')[0]}
              </Link>
            </div>
          )}

        </div>
      </div>
    </ClientLayout>
  );
}
