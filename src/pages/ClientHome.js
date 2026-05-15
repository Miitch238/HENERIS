import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ClientLayout from '../components/ClientLayout';
import './ClientHome.css';

const STATUS_LABEL = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  livre: 'Livré',
  annule: 'Annulé',
};

const STATUS_CLASS = {
  en_attente: 'badge--waiting',
  en_cours: 'badge--progress',
  livre: 'badge--done',
  annule: 'badge--cancelled',
};

const MOCK_DEMANDES = [
  { id: 1, categorie: 'Maroquinerie', description: 'Cherche un sac Hermès Birkin 30 en cuir togo noir, hardware gold.', budget_min: 8000, budget_max: 12000, statut: 'en_cours', created_at: '2026-05-10' },
  { id: 2, categorie: 'Montres', description: 'Rolex Datejust 36mm cadran blanc, bracelet jubilé.', budget_min: 7000, budget_max: 9500, statut: 'en_attente', created_at: '2026-05-12' },
  { id: 3, categorie: 'Bijoux', description: 'Collier Cartier Love en or jaune 18k, taille 38cm.', budget_min: 3500, budget_max: 5000, statut: 'livre', created_at: '2026-04-28' },
];

export default function ClientHome() {
  const [user, setUser] = useState(null);
  const [demandes] = useState(MOCK_DEMANDES);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const firstName = user?.user_metadata?.first_name || 'vous';
  const actives = demandes.filter(d => d.statut === 'en_attente' || d.statut === 'en_cours').length;

  return (
    <ClientLayout user={user}>
      <div className="ch-page">

        {/* ── Header ── */}
        <section className="ch-header">
          <div className="ch-header-text">
            <p className="ch-eyebrow">Tableau de bord</p>
            <h1 className="ch-title">Bonjour, {firstName}.</h1>
            <p className="ch-subtitle">Gérez vos demandes et découvrez les dernières pièces disponibles.</p>
          </div>
          <Link to="/deposer-demande" className="ch-cta-btn">
            + Déposer une demande
          </Link>
        </section>

        {/* ── Stats ── */}
        <section className="ch-stats">
          <div className="ch-stat">
            <span className="ch-stat-value">{actives}</span>
            <span className="ch-stat-label">Demandes actives</span>
          </div>
          <div className="ch-stat">
            <span className="ch-stat-value">{demandes.filter(d => d.statut === 'livre').length}</span>
            <span className="ch-stat-label">Commandes livrées</span>
          </div>
          <div className="ch-stat">
            <span className="ch-stat-value">—</span>
            <span className="ch-stat-label">Messages non lus</span>
          </div>
        </section>

        {/* ── Demandes ── */}
        <section className="ch-section">
          <div className="ch-section-header">
            <h2 className="ch-section-title">Mes demandes</h2>
            <Link to="/mes-demandes" className="ch-see-all">Voir tout →</Link>
          </div>

          {demandes.length === 0 ? (
            <div className="ch-empty">
              <p>Aucune demande pour le moment.</p>
              <Link to="/deposer-demande" className="ch-cta-btn" style={{ marginTop: 16 }}>
                Déposer ma première demande
              </Link>
            </div>
          ) : (
            <div className="ch-demandes">
              {demandes.map(d => (
                <div className="ch-demande-card" key={d.id}>
                  <div className="ch-demande-top">
                    <span className="ch-categorie">{d.categorie}</span>
                    <span className={`ch-badge ${STATUS_CLASS[d.statut]}`}>
                      {STATUS_LABEL[d.statut]}
                    </span>
                  </div>
                  <p className="ch-demande-desc">{d.description}</p>
                  <div className="ch-demande-bottom">
                    <span className="ch-budget">
                      Budget : {d.budget_min.toLocaleString('fr-FR')} € – {d.budget_max.toLocaleString('fr-FR')} €
                    </span>
                    <span className="ch-date">{new Date(d.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Raccourcis ── */}
        <section className="ch-section">
          <h2 className="ch-section-title">Accès rapide</h2>
          <div className="ch-shortcuts">
            <Link to="/catalogue" className="ch-shortcut">
              <span className="ch-shortcut-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </span>
              <span className="ch-shortcut-label">Catalogue</span>
            </Link>
            <Link to="/messages" className="ch-shortcut">
              <span className="ch-shortcut-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </span>
              <span className="ch-shortcut-label">Messages</span>
            </Link>
            <Link to="/mes-commandes" className="ch-shortcut">
              <span className="ch-shortcut-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </span>
              <span className="ch-shortcut-label">Commandes</span>
            </Link>
          </div>
        </section>

      </div>
    </ClientLayout>
  );
}
