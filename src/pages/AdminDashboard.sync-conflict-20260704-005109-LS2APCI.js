import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AdminDashboard.css';

const SECTIONS = [
  {
    group: 'Espace Client',
    color: '#C9A84C',
    links: [
      { to: '/client/home',      label: 'Accueil client',       desc: 'Dashboard client connecté' },
      { to: '/catalogue',        label: 'Catalogue',            desc: 'Grille articles luxe' },
      { to: '/deposer-demande',  label: 'Déposer une demande',  desc: 'Formulaire de demande' },
      { to: '/messages',         label: 'Messages',             desc: 'Chat client ↔ shopper' },
      { to: '/client/suivi',     label: 'Suivi commandes',      desc: 'Stepper statuts' },
      { to: '/client/profil',    label: 'Profil client',        desc: 'Infos & déconnexion' },
    ],
  },
  {
    group: 'Espace Shopper',
    color: '#7C9A7E',
    links: [
      { to: '/shopper/home',     label: 'Accueil shopper',      desc: 'Dashboard shopper connecté' },
      { to: '/shopper/marche',   label: 'Marché des demandes',  desc: 'Demandes clients ouvertes' },
      { to: '/shopper/articles', label: 'Mes articles',         desc: 'Publier & gérer des articles' },
      { to: '/shopper/gains',    label: 'Gains',                desc: 'Paiements Stripe Connect' },
    ],
  },
  {
    group: 'Administration',
    color: '#1a1a1a',
    links: [
      { to: '/admin/utilisateurs', label: 'Utilisateurs',       desc: 'Clients, shoppers, admins' },
      { to: '/admin/demandes',     label: 'Toutes les demandes', desc: 'Vue globale des demandes' },
      { to: '/admin/commandes',    label: 'Commandes',          desc: 'Paiements & escrow Stripe' },
      { to: '/admin/parametres',   label: 'Paramètres',         desc: 'Config plateforme' },
    ],
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="ad-root">

      {/* ── Nav ── */}
      <header className="ad-nav">
        <span className="ad-logo">Heneris</span>
        <div className="ad-nav-right">
          <span className="ad-admin-badge">Admin</span>
          <button className="ad-logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="ad-page">

        {/* ── Header ── */}
        <div className="ad-header">
          <p className="ad-eyebrow">Administration</p>
          <h1 className="ad-title">Tableau de bord</h1>
          <p className="ad-subtitle">
            Accès global à toutes les sections de la plateforme Heneris.
          </p>
        </div>

        {/* ── Stats rapides ── */}
        <div className="ad-stats">
          {[
            { label: 'Utilisateurs', value: '—', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
            { label: 'Demandes actives', value: '—', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
            { label: 'Commandes en cours', value: '—', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> },
            { label: 'Volume Stripe', value: '—', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
          ].map(s => (
            <div className="ad-stat" key={s.label}>
              <div className="ad-stat-icon">{s.icon}</div>
              <div>
                <p className="ad-stat-value">{s.value}</p>
                <p className="ad-stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Sections ── */}
        {SECTIONS.map(section => (
          <div className="ad-section" key={section.group}>
            <div className="ad-section-head">
              <span className="ad-section-dot" style={{ background: section.color }} />
              <h2 className="ad-section-title">{section.group}</h2>
            </div>
            <div className="ad-grid">
              {section.links.map(link => (
                <Link to={link.to} key={link.to} className="ad-card">
                  <div className="ad-card-accent" style={{ background: section.color }} />
                  <div className="ad-card-body">
                    <p className="ad-card-label">{link.label}</p>
                    <p className="ad-card-desc">{link.desc}</p>
                  </div>
                  <svg className="ad-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
