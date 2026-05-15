import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../styles/shopper.css';
import './DemandeDetail.css';

const MOCK = {
  d1: { id: 'd1', categorie: 'Maroquinerie', description: 'Je recherche un sac Hermès Birkin 30 en cuir togo noir, hardware plaqué or. La pièce doit être livrée avec sa boîte d\'origine, cadenas, clés et sangles. Provenance vérifiée exigée, certificat d\'authenticité indispensable. État excellent à parfait uniquement.', budget_min: 8000, budget_max: 12000, delai: '2 à 4 semaines', created_at: '2026-05-13', client: 'M. D.' },
  d2: { id: 'd2', categorie: 'Montres',      description: 'Rolex Datejust 36mm réf. 126234, cadran blanc rhodié index, bracelet jubilé. Boîte et papiers originaux exigés. État proche du neuf. Révision récente appréciée.', budget_min: 7000, budget_max: 9500,  delai: '1 à 2 semaines', created_at: '2026-05-12', client: 'Mme S.' },
  d3: { id: 'd3', categorie: 'Bijoux',       description: 'Collier Cartier Love en or jaune 18 carats, taille 38cm. Livré avec certificat d\'authenticité et écrin Cartier d\'origine.', budget_min: 3500, budget_max: 5000,  delai: 'Pas de délai précis', created_at: '2026-05-11', client: 'Mme A.' },
};

export default function DemandeDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ prix: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const demande = MOCK[id];
  if (!demande) return (
    <ShopperLayout user={user}>
      <div className="sp-page"><p style={{ color: '#888' }}>Demande introuvable. <Link to="/shopper/marche" style={{ color: '#C9A84C' }}>Retour au marché</Link></p></div>
    </ShopperLayout>
  );

  const commission = form.prix ? Math.round(+form.prix * 0.1) : null;

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: insert proposition dans Supabase
    setSent(true);
    setShowForm(false);
  };

  return (
    <ShopperLayout user={user}>
      <div className="sp-page">
        <Link to="/shopper/marche" className="dd-back">← Retour au marché</Link>

        <div className="dd-layout">
          {/* Détail */}
          <div className="dd-main">
            <p className="sp-eyebrow">{demande.categorie}</p>
            <h1 className="sp-title" style={{ fontSize: '1.8rem', marginBottom: 20 }}>Demande client</h1>

            <div className="dd-info-block">
              <p className="dd-label">Description</p>
              <p className="dd-text">{demande.description}</p>
            </div>

            <div className="dd-grid">
              <div className="dd-info-block">
                <p className="dd-label">Budget</p>
                <p className="dd-value">{demande.budget_min.toLocaleString('fr-FR')} € – {demande.budget_max.toLocaleString('fr-FR')} €</p>
              </div>
              <div className="dd-info-block">
                <p className="dd-label">Délai souhaité</p>
                <p className="dd-value">{demande.delai}</p>
              </div>
              <div className="dd-info-block">
                <p className="dd-label">Déposée le</p>
                <p className="dd-value">{new Date(demande.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="dd-info-block">
                <p className="dd-label">Client</p>
                <p className="dd-value">{demande.client}</p>
              </div>
            </div>
          </div>

          {/* Sidebar proposition */}
          <aside className="dd-sidebar">
            {sent ? (
              <div className="dd-sent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <p>Votre proposition a été envoyée au client.</p>
                <Link to="/shopper/marche" className="sp-cta" style={{ display: 'inline-block', marginTop: 12 }}>Retour au marché</Link>
              </div>
            ) : !showForm ? (
              <div className="dd-cta-block">
                <p className="dd-cta-title">Intéressé par cette demande ?</p>
                <p className="dd-cta-sub">Faites une proposition de prix et un message personnalisé au client.</p>
                <button className="sp-cta" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={() => setShowForm(true)}>
                  Faire une proposition
                </button>
              </div>
            ) : (
              <form className="dd-form" onSubmit={handleSubmit}>
                <p className="dd-form-title">Ma proposition</p>

                <div className="dd-field">
                  <label className="dd-form-label">Prix proposé (€)</label>
                  <input type="number" className="dd-input" min={demande.budget_min} max={demande.budget_max} placeholder={demande.budget_min} value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} required />
                  {commission && (
                    <p className="dd-commission">Commission Hénéris (10%) : {commission.toLocaleString('fr-FR')} € — vous recevrez {(+form.prix - commission).toLocaleString('fr-FR')} €</p>
                  )}
                </div>

                <div className="dd-field">
                  <label className="dd-form-label">Message au client</label>
                  <textarea className="dd-input dd-textarea" rows={4} placeholder="Présentez votre approche, vos sources, votre délai estimé…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                </div>

                <button type="submit" className="sp-cta" style={{ width: '100%', justifyContent: 'center' }}>Envoyer la proposition</button>
                <button type="button" className="dd-cancel" onClick={() => setShowForm(false)}>Annuler</button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </ShopperLayout>
  );
}
