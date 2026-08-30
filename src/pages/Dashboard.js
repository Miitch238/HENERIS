import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ClientLayout from '../components/ClientLayout';
import './Dashboard.css';

const STATUS_LABEL = {
  en_attente: 'En attente',
  en_cours:   'En cours',
  livre:      'Livré',
  annule:     'Annulé',
};

const STATUS_CLASS = {
  en_attente: 'ds-badge--waiting',
  en_cours:   'ds-badge--progress',
  livre:      'ds-badge--done',
  annule:     'ds-badge--cancelled',
};

const MOCK_DEMANDES = [
  { id: 1, categorie: 'Maroquinerie', description: 'Hermès Birkin 30 cuir togo noir, hardware doré.', budget_min: 8000, budget_max: 12000, statut: 'en_cours',   created_at: '2026-05-10' },
  { id: 2, categorie: 'Montres',      description: 'Rolex Datejust 36mm cadran blanc, bracelet jubilé.', budget_min: 7000, budget_max: 9500,  statut: 'en_attente', created_at: '2026-05-12' },
  { id: 3, categorie: 'Bijoux',       description: 'Collier Cartier Love en or jaune 18k, taille 38cm.', budget_min: 3500, budget_max: 5000,  statut: 'livre',      created_at: '2026-04-28' },
  { id: 4, categorie: 'Vêtements',    description: 'Veste Zegna Couture taille 50, coloris anthracite.', budget_min: 2000, budget_max: 4000,  statut: 'annule',     created_at: '2026-04-15' },
];

export default function Dashboard() {
  const [user, setUser]       = useState(null);
  const [demandes]            = useState(MOCK_DEMANDES);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const h = new Date().getHours();
    if (h < 12) setGreeting('Bonjour');
    else if (h < 18) setGreeting('Bonjour');
    else setGreeting('Bonsoir');
  }, []);

  const firstName   = user?.user_metadata?.first_name || '';
  const enCours     = demandes.filter(d => d.statut === 'en_cours').length;
  const enAttente   = demandes.filter(d => d.statut === 'en_attente').length;
  const livrees     = demandes.filter(d => d.statut === 'livre').length;
  const MESSAGES_NL = 3; // mock

  return (
    <ClientLayout user={user}>
      <div className="ds-page">

        {/* ── Hero header ── */}
        <section className="ds-hero">
          <div className="ds-hero-text">
            <p className="ds-eyebrow">Tableau de bord</p>
            <h1 className="ds-title">
              {greeting}{firstName ? `, ${firstName}` : ''}.
            </h1>
            <p className="ds-subtitle">
              Voici un aperçu de votre activité sur Heneris.
            </p>
          </div>
          <Link to="/deposer-demande" className="ds-cta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Déposer une demande
          </Link>
        </section>

        {/* ── Stats ── */}
        <section className="ds-stats">
          <div className="ds-stat">
            <div className="ds-stat-icon ds-stat-icon--gold">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <p className="ds-stat-value">{enAttente}</p>
              <p className="ds-stat-label">En attente</p>
            </div>
          </div>
          <div className="ds-stat">
            <div className="ds-stat-icon ds-stat-icon--blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </div>
            <div>
              <p className="ds-stat-value">{enCours}</p>
              <p className="ds-stat-label">En cours</p>
            </div>
          </div>
          <div className="ds-stat">
            <div className="ds-stat-icon ds-stat-icon--green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p className="ds-stat-value">{livrees}</p>
              <p className="ds-stat-label">Livrées</p>
            </div>
          </div>
          <div className="ds-stat ds-stat--highlight">
            <div className="ds-stat-icon ds-stat-icon--msg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <p className="ds-stat-value">{MESSAGES_NL}</p>
              <p className="ds-stat-label">Messages non lus</p>
            </div>
            <Link to="/messages" className="ds-stat-link">Voir →</Link>
          </div>
        </section>

        {/* ── Demandes ── */}
        <section className="ds-section">
          <div className="ds-section-head">
            <h2 className="ds-section-title">Mes dernières demandes</h2>
            <Link to="/deposer-demande" className="ds-section-action">+ Nouvelle demande</Link>
          </div>

          {demandes.length === 0 ? (
            <div className="ds-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p>Aucune demande pour le moment.</p>
              <Link to="/deposer-demande" className="ds-cta" style={{ marginTop: 16 }}>Déposer ma première demande</Link>
            </div>
          ) : (
            <div className="ds-table">
              <div className="ds-table-head">
                <span>Catégorie</span>
                <span>Description</span>
                <span>Budget</span>
                <span>Statut</span>
                <span>Date</span>
              </div>
              {demandes.map(d => (
                <div className="ds-table-row" key={d.id}>
                  <span className="ds-cat">{d.categorie}</span>
                  <span className="ds-desc">{d.description}</span>
                  <span className="ds-budget">
                    {d.budget_min.toLocaleString('fr-FR')} € – {d.budget_max.toLocaleString('fr-FR')} €
                  </span>
                  <span>
                    <span className={`ds-badge ${STATUS_CLASS[d.statut]}`}>
                      {STATUS_LABEL[d.statut]}
                    </span>
                  </span>
                  <span className="ds-date">
                    {new Date(d.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Raccourcis ── */}
        <section className="ds-section">
          <h2 className="ds-section-title" style={{ marginBottom: 16 }}>Accès rapide</h2>
          <div className="ds-shortcuts">
            <Link to="/catalogue" className="ds-shortcut">
              <div className="ds-shortcut-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </div>
              <p className="ds-shortcut-label">Catalogue</p>
              <p className="ds-shortcut-sub">Parcourir les articles disponibles</p>
            </Link>
            <Link to="/messages" className="ds-shortcut">
              <div className="ds-shortcut-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p className="ds-shortcut-label">Messages</p>
              <p className="ds-shortcut-sub">{MESSAGES_NL} message{MESSAGES_NL > 1 ? 's' : ''} non lu{MESSAGES_NL > 1 ? 's' : ''}</p>
            </Link>
            <Link to="/deposer-demande" className="ds-shortcut">
              <div className="ds-shortcut-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <p className="ds-shortcut-label">Nouvelle demande</p>
              <p className="ds-shortcut-sub">Décrire une pièce recherchée</p>
            </Link>
          </div>
        </section>

      </div>
    </ClientLayout>
  );
}
