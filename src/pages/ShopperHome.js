import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../styles/shopper.css';
import './ShopperHome.css';

const MOCK_DEMANDES = [
  { id: 'd1', categorie: 'Maroquinerie', description: 'Hermès Birkin 30 cuir togo noir hardware doré.', budget_max: 12000, created_at: '2026-05-13' },
  { id: 'd2', categorie: 'Montres',      description: 'Rolex Datejust 36mm cadran blanc bracelet jubilé.', budget_max: 9500,  created_at: '2026-05-12' },
  { id: 'd3', categorie: 'Bijoux',       description: 'Collier Cartier Love or jaune 18k taille 38cm.', budget_max: 5000,  created_at: '2026-05-11' },
];

const MOCK_ARTICLES = [
  { id: 1, titre: 'Chanel Classic Flap', categorie: 'Maroquinerie', prix: 9400, statut: 'disponible' },
  { id: 2, titre: 'Cartier Tank Solo',   categorie: 'Montres',      prix: 3200, statut: 'réservé'    },
];

export default function ShopperHome() {
  const [user, setUser] = useState(null);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const firstName = user?.user_metadata?.first_name || '';

  return (
    <ShopperLayout user={user}>
      <div className="sp-page">
        <div className="sp-header">
          <div>
            <p className="sp-eyebrow">Espace Shopper</p>
            <h1 className="sp-title">Bonjour{firstName ? `, ${firstName}` : ''}.</h1>
            <p className="sp-subtitle">Voici les nouvelles demandes et l'état de vos articles.</p>
          </div>
          <Link to="/shopper/articles" className="sp-cta">+ Publier un article</Link>
        </div>

        {/* Stats */}
        <div className="sh-stats">
          {[
            { value: '12', label: 'Nouvelles demandes', color: '#C9A84C' },
            { value: '5',  label: 'Articles publiés',   color: '#1a1a1a' },
            { value: '4.9',label: 'Note moyenne',       color: '#2e7d32' },
            { value: '8 400 €', label: 'Gains ce mois', color: '#1565c0' },
          ].map(s => (
            <div className="sh-stat" key={s.label}>
              <p className="sh-stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="sh-stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nouvelles demandes */}
        <div className="sp-section">
          <div className="sp-section-head">
            <h2 className="sp-section-title">Nouvelles demandes du marché</h2>
            <Link to="/shopper/marche" className="sp-see-all">Voir toutes →</Link>
          </div>
          <div className="sh-demandes">
            {MOCK_DEMANDES.map(d => (
              <Link to={`/shopper/demande/${d.id}`} key={d.id} className="sh-demande-card">
                <div className="sh-demande-top">
                  <span className="sh-cat">{d.categorie}</span>
                  <span className="sh-budget">≤ {d.budget_max.toLocaleString('fr-FR')} €</span>
                </div>
                <p className="sh-demande-desc">{d.description}</p>
                <p className="sh-demande-date">{new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Mes articles récents */}
        <div className="sp-section">
          <div className="sp-section-head">
            <h2 className="sp-section-title">Mes articles récents</h2>
            <Link to="/shopper/articles" className="sp-see-all">Gérer →</Link>
          </div>
          <div className="sh-articles">
            {MOCK_ARTICLES.map(a => (
              <div key={a.id} className="sh-article-row">
                <div>
                  <p className="sh-article-title">{a.titre}</p>
                  <p className="sh-article-cat">{a.categorie}</p>
                </div>
                <div className="sh-article-right">
                  <span className={`sp-badge ${a.statut === 'disponible' ? 'sp-badge--done' : 'sp-badge--waiting'}`}>{a.statut}</span>
                  <span className="sh-article-price">{a.prix.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShopperLayout>
  );
}
