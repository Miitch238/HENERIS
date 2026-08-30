import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../styles/shopper.css';
import './Marche.css';

const CATS = ['Toutes', 'Maroquinerie', 'Montres', 'Bijoux', 'Vêtements', 'Autre'];

export default function Marche() {
  const [user, setUser]           = useState(null);
  const [demandes, setDemandes]   = useState([]);
  const [cat, setCat]             = useState('Toutes');
  const [budgetMax, setBudgetMax] = useState(15000);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      await chargerDemandes();
    });
  }, []);

  async function chargerDemandes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('demandes')
      .select('*')
      .eq('statut', 'en_attente')
      .order('created_at', { ascending: false });

    if (!error) setDemandes(data || []);
    setLoading(false);
  }

  const demandesFiltrees = demandes.filter(d => {
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
            <p className="sp-subtitle">
              {demandesFiltrees.length} demande{demandesFiltrees.length > 1 ? 's' : ''} disponible{demandesFiltrees.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

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

        {loading ? (
          <div className="sp-empty">Chargement…</div>
        ) : demandesFiltrees.length === 0 ? (
          <div className="sp-empty">Aucune demande pour ces filtres.</div>
        ) : (
          <div className="ma-grid">
            {demandesFiltrees.map(d => (
              <div key={d.id} className="ma-card">
                <div className="ma-card-top">
                  <span className="ma-cat-tag">{d.categorie}</span>
                  <span className="ma-date">
                    {new Date(d.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <p className="ma-desc">{d.description}</p>
                <div className="ma-card-footer">
                  <div className="ma-budget-range">
                    <span>{d.budget_min?.toLocaleString('fr-FR')} €</span>
                    <span className="ma-budget-sep">–</span>
                    <span>{d.budget_max?.toLocaleString('fr-FR')} €</span>
                  </div>
                  <span className="ma-delai">{d.delai}</span>
                </div>
                <Link to={`/shopper/demande/${d.id}`} className="ma-voir-btn">Voir la demande →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ShopperLayout>
  );
}