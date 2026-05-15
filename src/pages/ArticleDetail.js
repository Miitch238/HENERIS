import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ClientLayout from '../components/ClientLayout';
import './ArticleDetail.css';

const MOCK_ARTICLES = {
  1: { id: 1, titre: 'Hermès Birkin 30 Noir', categorie: 'Maroquinerie', prix: 11500, statut: 'disponible', shopper: { nom: 'Sophie Marchand', specialite: 'Haute Couture · Paris', note: 4.9, image: null }, description: 'Birkin 30 en cuir togo noir, hardware plaqué or. Pièce en excellent état, livrée avec boîte, cadenas, clés et sangles d\'origine. Provenance garantie, certificat d\'authenticité inclus.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80' },
  2: { id: 2, titre: 'Rolex Datejust 36mm', categorie: 'Montres', prix: 8900, statut: 'disponible', shopper: { nom: 'Marc Laurent', specialite: 'Joaillerie & Montres · Genève', note: 4.8, image: null }, description: 'Rolex Datejust réf. 126234, cadran blanc rhodié index, bracelet jubilé. Boîte et papiers originaux 2022. Révisée par le service Rolex en mars 2025.', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80' },
  3: { id: 3, titre: 'Cartier Love Bracelet', categorie: 'Bijoux', prix: 7200, statut: 'réservé', shopper: { nom: 'Élise Dumont', specialite: 'Joaillerie & Bijoux · Paris', note: 5.0, image: null }, description: 'Bracelet Love Cartier en or jaune 18 carats, taille 17. Livré avec tournevis et certificat d\'authenticité. Gravure possible sur demande.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80' },
};

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const article = MOCK_ARTICLES[id];
  if (!article) return (
    <ClientLayout user={user}>
      <div style={{ padding: 80, textAlign: 'center', color: '#888' }}>
        Article introuvable. <Link to="/catalogue" style={{ color: '#C9A84C' }}>Retour au catalogue</Link>
      </div>
    </ClientLayout>
  );

  const commission = Math.round(article.prix * 0.1);
  const total = article.prix + commission;

  const handleCommander = () => {
    // TODO: initier le paiement Stripe escrow
    setOrdered(true);
  };

  return (
    <ClientLayout user={user}>
      <div className="ad-page">

        <Link to="/catalogue" className="ad-back">← Retour au catalogue</Link>

        <div className="ad-layout">

          {/* ── Image ── */}
          <div className="ad-image-col">
            <div className="ad-image-wrap">
              <img src={article.image} alt={article.titre} className="ad-image" />
              <span className={`ad-statut-badge ${article.statut === 'disponible' ? 'ad-ok' : 'ad-reserved'}`}>
                {article.statut}
              </span>
            </div>
          </div>

          {/* ── Infos ── */}
          <div className="ad-info-col">
            <p className="ad-categorie">{article.categorie}</p>
            <h1 className="ad-title">{article.titre}</h1>

            {/* Shopper */}
            <div className="ad-shopper">
              <div className="ad-shopper-avatar">
                {article.shopper.nom.charAt(0)}
              </div>
              <div>
                <p className="ad-shopper-name">{article.shopper.nom}</p>
                <p className="ad-shopper-spec">{article.shopper.specialite}</p>
              </div>
              <div className="ad-shopper-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#C9A84C" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {article.shopper.note}
              </div>
            </div>

            <p className="ad-description">{article.description}</p>

            {/* Prix */}
            <div className="ad-pricing">
              <div className="ad-pricing-row">
                <span>Prix de l'article</span>
                <span>{article.prix.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="ad-pricing-row ad-pricing-commission">
                <span>Commission Hénéris (10%)</span>
                <span>+ {commission.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="ad-pricing-row ad-pricing-total">
                <span>Total</span>
                <strong>{total.toLocaleString('fr-FR')} €</strong>
              </div>
            </div>

            {ordered ? (
              <div className="ad-ordered">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Commande initiée — votre paiement est sécurisé en escrow.
              </div>
            ) : (
              <button
                className="ad-commander-btn"
                onClick={handleCommander}
                disabled={article.statut !== 'disponible'}
              >
                {article.statut === 'disponible' ? 'Commander' : 'Non disponible'}
              </button>
            )}

            <p className="ad-escrow-note">
              Votre paiement est bloqué en escrow et n'est libéré au shopper qu'à la confirmation de livraison.
            </p>
          </div>

        </div>
      </div>
    </ClientLayout>
  );
}
