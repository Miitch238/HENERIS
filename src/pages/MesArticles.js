import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../styles/shopper.css';
import './MesArticles.css';

const CATS = ['Maroquinerie', 'Montres', 'Bijoux', 'Vêtements', 'Art de vivre', 'Autre'];
const STATUTS = ['disponible', 'réservé', 'vendu'];

const INIT = { titre: '', categorie: '', prix: '', description: '' };

const MOCK_ARTICLES = [
  { id: 1, titre: 'Chanel Classic Flap Medium', categorie: 'Maroquinerie', prix: 9400, statut: 'disponible', created_at: '2026-05-01' },
  { id: 2, titre: 'Cartier Tank Solo',           categorie: 'Montres',      prix: 3200, statut: 'réservé',    created_at: '2026-04-20' },
  { id: 3, titre: 'Bracelet Pomellato Nudo',      categorie: 'Bijoux',       prix: 2800, statut: 'vendu',      created_at: '2026-04-10' },
];

const STATUT_CLASS = { disponible: 'sp-badge--done', réservé: 'sp-badge--waiting', vendu: 'sp-badge--cancelled' };

export default function MesArticles() {
  const [user, setUser]       = useState(null);
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]       = useState(INIT);
  const [saving, setSaving]   = useState(false);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    // TODO: insert dans Supabase
    const newArticle = { id: Date.now(), ...form, prix: +form.prix, statut: 'disponible', created_at: new Date().toISOString().split('T')[0] };
    setArticles(prev => [newArticle, ...prev]);
    setForm(INIT);
    setSaving(false);
    setShowModal(false);
  };

  const changeStatut = (id, statut) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, statut } : a));
    // TODO: update dans Supabase
  };

  const deleteArticle = id => {
    setArticles(prev => prev.filter(a => a.id !== id));
    // TODO: delete dans Supabase
  };

  return (
    <ShopperLayout user={user}>
      <div className="sp-page">
        <div className="sp-header">
          <div>
            <p className="sp-eyebrow">Shopper</p>
            <h1 className="sp-title">Mes articles</h1>
            <p className="sp-subtitle">{articles.length} article{articles.length > 1 ? 's' : ''} publié{articles.length > 1 ? 's' : ''}</p>
          </div>
          <button className="sp-cta" onClick={() => setShowModal(true)}>+ Publier un article</button>
        </div>

        {articles.length === 0 ? (
          <div className="sp-empty">Aucun article publié. Cliquez sur "+ Publier un article" pour commencer.</div>
        ) : (
          <div className="ma-table">
            <div className="ma-table-head">
              <span>Article</span><span>Catégorie</span><span>Prix</span><span>Statut</span><span>Date</span><span></span>
            </div>
            {articles.map(a => (
              <div className="ma-table-row" key={a.id}>
                <span className="ma-article-titre">{a.titre}</span>
                <span className="ma-article-cat">{a.categorie}</span>
                <span className="ma-article-prix">{(+a.prix).toLocaleString('fr-FR')} €</span>
                <span>
                  <select
                    className="ma-statut-select"
                    value={a.statut}
                    onChange={e => changeStatut(a.id, e.target.value)}
                  >
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </span>
                <span className="ma-article-date">{new Date(a.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                <span>
                  <button className="ma-delete-btn" onClick={() => deleteArticle(a.id)} title="Supprimer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Modal publication */}
        {showModal && (
          <div className="ma-modal-backdrop" onClick={() => setShowModal(false)}>
            <div className="ma-modal" onClick={e => e.stopPropagation()}>
              <div className="ma-modal-header">
                <h2 className="ma-modal-title">Publier un article</h2>
                <button className="ma-modal-close" onClick={() => setShowModal(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <form className="ma-modal-form" onSubmit={handleSubmit}>
                <div className="ma-field">
                  <label className="ma-label">Titre</label>
                  <input name="titre" className="ma-input" placeholder="Ex : Hermès Birkin 30 Noir" value={form.titre} onChange={handleChange} required />
                </div>
                <div className="ma-form-row">
                  <div className="ma-field">
                    <label className="ma-label">Catégorie</label>
                    <select name="categorie" className="ma-input ma-select" value={form.categorie} onChange={handleChange} required>
                      <option value="" disabled>Choisir…</option>
                      {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="ma-field">
                    <label className="ma-label">Prix (€)</label>
                    <input name="prix" type="number" min={0} className="ma-input" placeholder="9 400" value={form.prix} onChange={handleChange} required />
                  </div>
                </div>
                <div className="ma-field">
                  <label className="ma-label">Description</label>
                  <textarea name="description" className="ma-input ma-textarea" rows={3} placeholder="État, provenance, accessoires inclus…" value={form.description} onChange={handleChange} required />
                </div>
                <button type="submit" className="sp-cta" style={{ width: '100%', justifyContent: 'center' }} disabled={saving}>
                  {saving ? 'Publication…' : 'Publier l\'article'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ShopperLayout>
  );
}
