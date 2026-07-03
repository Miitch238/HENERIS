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
const STEPS = ['Demande déposée', 'Shopper assigné', 'Livré'];

export default function Suivi() {
  const [user, setUser]         = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState('tous');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      setUser(u);
      if (!u) return;

      const { data: dem } = await supabase
        .from('demandes')
        .select('*')
        .eq('client_id', u.id)
        .order('created_at', { ascending: false });

      setDemandes(dem || []);
      if (dem?.length > 0) setSelected(dem[0]);
      setLoading(false);
    });
  }, []);

  const demandesFiltrees = filter === 'tous'
    ? demandes
    : demandes.filter(d => d.statut === filter);

  return (
    <ClientLayout user={user}>
      <div className="sv-page">

        <div className="sv-header">
          <div>
            <p className="sv-eyebrow">Mes commandes</p>
            <h1 className="sv-title">Suivi</h1>
          </div>
          <Link to="/deposer-demande" className="sv-cta">+ Nouvelle demande</Link>
        </div>

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
          <div className="sv-list">
            {loading ? (
              <div className="sv-empty">Chargement…</div>
            ) : demandesFiltrees.length === 0 ? (
              <div className="sv-empty">Aucune commande pour ce filtre.</div>
            ) : demandesFiltrees.map(d => (
              <button
                key={d.id}
                className={`sv-item ${selected?.id === d.id ? 'sv-item--active' : ''}`}
                onClick={() => setSelected(d)}
              >
                <div className="sv-item-top">
                  <span className="sv-item-cat">{d.categorie}</span>
                  <span className={`sv-badge ${STATUS_CLASS[d.statut]}`}>
                    {STATUS_LABEL[d.statut]}
                  </span>
                </div>
                <p className="sv-item-article">{d.description?.slice(0, 50)}…</p>
                <div className="sv-item-bottom">
                  <span className="sv-item-id">{d.id.slice(0, 8).toUpperCase()}</span>
                  <span className="sv-item-date">
                    {new Date(d.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="sv-detail">
              <div className="sv-detail-header">
                <div>
                  <p className="sv-detail-id">{selected.id.slice(0, 8).toUpperCase()}</p>
                  <h2 className="sv-detail-article">{selected.categorie}</h2>
                </div>
                <span className={`sv-badge sv-badge--lg ${STATUS_CLASS[selected.statut]}`}>
                  {STATUS_LABEL[selected.statut]}
                </span>
              </div>

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

              <div className="sv-detail-grid">
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Catégorie</p>
                  <p className="sv-detail-value">{selected.categorie}</p>
                </div>
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Description</p>
                  <p className="sv-detail-value">{selected.description}</p>
                </div>
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Budget</p>
                  <p className="sv-detail-value">
                    {selected.budget_min?.toLocaleString('fr-FR')} € – {selected.budget_max?.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Délai souhaité</p>
                  <p className="sv-detail-value">{selected.delai || '—'}</p>
                </div>
                <div className="sv-detail-field">
                  <p className="sv-detail-label">Déposée le</p>
                  <p className="sv-detail-value">
                    {new Date(selected.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <Link to="/messages" className="sv-msg-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Contacter mon shopper
              </Link>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}