import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../styles/shopper.css';
import './DemandeDetail.css';

export default function DemandeDetail() {
  const { id } = useParams();
  const [user, setUser]       = useState(null);
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ prix: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);

      const { data: dem } = await supabase
        .from('demandes')
        .select('*')
        .eq('id', id)
        .single();

      setDemande(dem || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <ShopperLayout user={user}>
      <div className="sp-page"><p>Chargement…</p></div>
    </ShopperLayout>
  );

  if (!demande) return (
    <ShopperLayout user={user}>
      <div className="sp-page">
        <p style={{ color: '#888' }}>
          Demande introuvable.{' '}
          <Link to="/shopper/marche" style={{ color: '#C9A84C' }}>Retour au marché</Link>
        </p>
      </div>
    </ShopperLayout>
  );

  const taux = +form.prix >= 1000 ? 0.05 : 0.10;
const commission = form.prix ? Math.round(+form.prix * taux) : null;

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Créer une conversation + envoyer le message
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert({
        client_id: demande.client_id,
        shopper_id: user.id,
        demande_id: demande.id,
      })
      .select()
      .single();

    if (convError) { setError('Erreur lors de l\'envoi.'); return; }

    await supabase.from('messages').insert({
      conversation_id: conv.id,
      sender_id: user.id,
      contenu: `💼 Proposition : ${(+form.prix).toLocaleString('fr-FR')} €\n\n${form.message}`,
    });

    // Mettre la demande en cours
    await supabase.from('demandes').update({ statut: 'en_cours', shopper_id: user.id })
      .eq('id', demande.id);

    setSent(true);
    setShowForm(false);
  };

  return (
    <ShopperLayout user={user}>
      <div className="sp-page">
        <Link to="/shopper/marche" className="dd-back">← Retour au marché</Link>

        <div className="dd-layout">
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
                <p className="dd-value">
                  {demande.budget_min?.toLocaleString('fr-FR')} € – {demande.budget_max?.toLocaleString('fr-FR')} €
                </p>
              </div>
              <div className="dd-info-block">
                <p className="dd-label">Délai souhaité</p>
                <p className="dd-value">{demande.delai || '—'}</p>
              </div>
              <div className="dd-info-block">
                <p className="dd-label">Déposée le</p>
                <p className="dd-value">
                  {new Date(demande.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="dd-info-block">
                <p className="dd-label">Statut</p>
                <p className="dd-value">{demande.statut}</p>
              </div>
            </div>
          </div>

          <aside className="dd-sidebar">
            {sent ? (
              <div className="dd-sent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <p>Votre proposition a été envoyée au client.</p>
                <Link to="/shopper/marche" className="sp-cta" style={{ display: 'inline-block', marginTop: 12 }}>
                  Retour au marché
                </Link>
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
                  <input
                    type="number"
                    className="dd-input"
                    min={demande.budget_min}
                    max={demande.budget_max}
                    placeholder={demande.budget_min}
                    value={form.prix}
                    onChange={e => setForm({ ...form, prix: e.target.value })}
                    required
                  />
                  {commission && (
                    <p className="dd-commission">Protection acheteur ({taux * 100}%) : {commission.toLocaleString('fr-FR')} € — vous recevrez {(+form.prix - commission).toLocaleString('fr-FR')} €</p>

                  )}
                </div>

                <div className="dd-field">
                  <label className="dd-form-label">Message au client</label>
                  <textarea
                    className="dd-input dd-textarea"
                    rows={4}
                    placeholder="Présentez votre approche, vos sources, votre délai estimé…"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

                <button type="submit" className="sp-cta" style={{ width: '100%', justifyContent: 'center' }}>
                  Envoyer la proposition
                </button>
                <button type="button" className="dd-cancel" onClick={() => setShowForm(false)}>Annuler</button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </ShopperLayout>
  );
}