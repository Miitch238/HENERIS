import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../styles/shopper.css';
import './Marche.css';

const CATS = ['Toutes', 'Maroquinerie', 'Montres', 'Bijoux', 'Vêtements', 'Autre'];

const MOCK = [
  { id: 'd1', categorie: 'Maroquinerie', description: 'Hermès Birkin 30 cuir togo noir hardware doré. Livraison France, pièce avec boîte et papiers.', budget_min: 8000, budget_max: 12000, delai: '2 à 4 semaines', created_at: '2026-05-13' },
  { id: 'd2', categorie: 'Montres',      description: 'Rolex Datejust 36mm cadran blanc, bracelet jubilé. Boîte et papiers exigés.', budget_min: 7000, budget_max: 9500,  delai: '1 à 2 semaines', created_at: '2026-05-12' },
  { id: 'd3', categorie: 'Bijoux',       description: 'Collier Cartier Love en or jaune 18k taille 38cm. Certificat authenticité requis.', budget_min: 3500, budget_max: 5000,  delai: 'Pas de délai précis', created_at: '2026-05-11' },
  { id: 'd4', categorie: 'Vêtements',    description: 'Veste Zegna Couture taille 50 coloris anthracite. Neuf ou très bon état.', budget_min: 2000, budget_max: 4000,  delai: '1 à 2 mois', created_at: '2026-05-10' },
  { id: 'd5', categorie: 'Maroquinerie', description: 'Sac Louis Vuitton Neverfull MM Damier ébène, bon état général.', budget_min: 900,  budget_max: 1400,  delai: 'Moins d\'une semaine', created_at: '2026-05-09' },
  { id: 'd6', categorie: 'Montres',      description: 'Omega Seamaster 300m quartz cadran bleu, bracelet acier.', budget_min: 1500, budget_max: 2500,  delai: '2 à 4 semaines', created_at: '2026-05-08' },
];

export default function Marche() {
  const [user, setUser]       = useState(null);
  const [cat, setCat]         = useState('Toutes');
  const [budgetMax, setBudgetMax] = useState(15000);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const demandes = MOCK.filter(d => {
    if (cat !== 'Toutes' && d.categorie !== cat) return false;
    if (d.budget_max > budgetMax) return false;
    return true;
  });

  return (
    <ShopperLayout user={user}>
      <div className="sp-page">
        <div className="sp-header" style={{ marginBottom: 28 }}>
          <div>
            <p className="sp-eyebrow">Shopper</p>
            <h1 className="sp-title">Marché des demandes</h1>
            <p className="sp-subtitle">{demandes.length} demande{demandes.length > 1 ? 's' : ''} disponible{demandes.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="ma-filters">
          <div className="ma-filter-cats">
            {CATS.map(c => (
              <button key={c} className={`ma-cat-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="ma-filter-budget">
            <span className="ma-budget-label">Budget max : {budgetMax.toLocaleString('fr-FR')} €</span>
            <input type="range" min={500} max={15000} step={500} value={budgetMax} onChange={e => setBudgetMax(+e.target.value)} className="ma-range" />
          </div>
        </div>

        {demandes.length === 0
          ? <div className="sp-empty">Aucune demande pour ces filtres.</div>
          : (
            <div className="ma-grid">
              {demandes.map(d => (
                <div key={d.id} className="ma-card">
                  <div className="ma-card-top">
                    <span className="ma-cat-tag">{d.categorie}</span>
                    <span className="ma-date">{new Date(d.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                  </div>
                  <p className="ma-desc">{d.description}</p>
                  <div className="ma-card-footer">
                    <div className="ma-budget-range">
                      <span>{d.budget_min.toLocaleString('fr-FR')} €</span>
                      <span className="ma-budget-sep">–</span>
                      <span>{d.budget_max.toLocaleString('fr-FR')} €</span>
                    </div>
                    <span className="ma-delai">{d.delai}</span>
                  </div>
                  <Link to={`/shopper/demande/${d.id}`} className="ma-voir-btn">Voir la demande →</Link>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </ShopperLayout>
  );
}
