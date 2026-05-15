import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ClientLayout from '../components/ClientLayout';
import './Catalogue.css';

const CATEGORIES = ['Toutes', 'Maroquinerie', 'Montres', 'Bijoux', 'Vêtements'];

const MOCK_ARTICLES = [
  { id: 1, titre: 'Hermès Birkin 30 Noir', categorie: 'Maroquinerie', prix: 11500, statut: 'disponible', shopper: 'Sophie M.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
  { id: 2, titre: 'Rolex Datejust 36mm', categorie: 'Montres', prix: 8900, statut: 'disponible', shopper: 'Marc L.', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80' },
  { id: 3, titre: 'Cartier Love Bracelet', categorie: 'Bijoux', prix: 7200, statut: 'réservé', shopper: 'Élise D.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80' },
  { id: 4, titre: 'Chanel Classic Flap Medium', categorie: 'Maroquinerie', prix: 9400, statut: 'disponible', shopper: 'Sophie M.', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80' },
  { id: 5, titre: 'Veste Zegna Couture', categorie: 'Vêtements', prix: 4200, statut: 'disponible', shopper: 'Pierre V.', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f7d?w=600&q=80' },
  { id: 6, titre: 'Patek Philippe Calatrava', categorie: 'Montres', prix: 24000, statut: 'vendu', shopper: 'Marc L.', image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80' },
  { id: 7, titre: 'Van Cleef Alhambra', categorie: 'Bijoux', prix: 5600, statut: 'disponible', shopper: 'Élise D.', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80' },
  { id: 8, titre: 'Louis Vuitton Neverfull MM', categorie: 'Maroquinerie', prix: 2100, statut: 'disponible', shopper: 'Sophie M.', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
];

const STATUT_CLASS = { disponible: 'cat-badge--ok', réservé: 'cat-badge--reserved', vendu: 'cat-badge--sold' };

export default function Catalogue() {
  const [user, setUser] = useState(null);
  const [categorie, setCategorie] = useState('Toutes');
  const [prixMax, setPrixMax] = useState(30000);
  const [statut, setStatut] = useState('tous');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const articles = MOCK_ARTICLES.filter(a => {
    if (categorie !== 'Toutes' && a.categorie !== categorie) return false;
    if (a.prix > prixMax) return false;
    if (statut !== 'tous' && a.statut !== statut) return false;
    return true;
  });

  return (
    <ClientLayout user={user}>
      <div className="cat-page">

        <aside className="cat-sidebar">
          <h2 className="cat-sidebar-title">Filtres</h2>

          <div className="cat-filter-group">
            <p className="cat-filter-label">Catégorie</p>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`cat-filter-btn ${categorie === c ? 'active' : ''}`}
                onClick={() => setCategorie(c)}
              >{c}</button>
            ))}
          </div>

          <div className="cat-filter-group">
            <p className="cat-filter-label">Prix max : {prixMax.toLocaleString('fr-FR')} €</p>
            <input
              type="range"
              min={500}
              max={30000}
              step={500}
              value={prixMax}
              onChange={e => setPrixMax(Number(e.target.value))}
              className="cat-range"
            />
            <div className="cat-range-labels"><span>500 €</span><span>30 000 €</span></div>
          </div>

          <div className="cat-filter-group">
            <p className="cat-filter-label">Disponibilité</p>
            {['tous', 'disponible', 'réservé', 'vendu'].map(s => (
              <button
                key={s}
                className={`cat-filter-btn ${statut === s ? 'active' : ''}`}
                onClick={() => setStatut(s)}
              >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </aside>

        <div className="cat-content">
          <div className="cat-content-header">
            <h1 className="cat-title">Catalogue</h1>
            <p className="cat-count">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
          </div>

          {articles.length === 0 ? (
            <div className="cat-empty">Aucun article ne correspond à vos filtres.</div>
          ) : (
            <div className="cat-grid">
              {articles.map(a => (
                <Link to={`/article/${a.id}`} key={a.id} className="cat-card">
                  <div className="cat-card-img-wrap">
                    <img src={a.image} alt={a.titre} className="cat-card-img" />
                    <span className={`cat-badge ${STATUT_CLASS[a.statut]}`}>{a.statut}</span>
                  </div>
                  <div className="cat-card-body">
                    <p className="cat-card-cat">{a.categorie}</p>
                    <h3 className="cat-card-title">{a.titre}</h3>
                    <div className="cat-card-footer">
                      <span className="cat-card-price">{a.prix.toLocaleString('fr-FR')} €</span>
                      <span className="cat-card-shopper">par {a.shopper}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </ClientLayout>
  );
}
