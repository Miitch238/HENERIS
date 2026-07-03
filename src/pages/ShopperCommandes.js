import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout, { palette } from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";
const { cardBg, ink, inkSoft, hairline, gold } = palette;

/* Schéma Supabase réel (vérifié) :
   demandes : id, categorie, description, client_id, statut ('en_cours' | 'terminee'),
              delai (texte), budget_min, budget_max, created_at, shopper_id
   Storage  : bucket "mission-photos" (à créer si absent), chemin {demande_id}/{filename}
   Pas de colonnes titre/deadline/montant_final/photos_preuve actuellement —
   l'upload de photos nécessite que Mitch ajoute une colonne photos_preuve (text[]). */

const STATUTS = {
  en_cours: { label: 'En cours', color: '#B58A2E', bg: '#FBF3E2' },
  terminee: { label: 'Livrée',   color: '#3E7A56', bg: '#EAF3EC' },
};

export default function ShopperCommandes() {
  const [loading, setLoading]     = useState(true);
  const [commandes, setCommandes] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputs = useRef({});

  const load = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .eq('shopper_id', session.user.id)
        .in('statut', ['en_cours', 'terminee'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      setCommandes(data || []);
    } catch (err) {
      console.error('Erreur chargement des commandes :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (demandeId, file) => {
    if (!file) return;
    setUploadingId(demandeId);
    try {
      const path = `${demandeId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('mission-photos').upload(path, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('mission-photos').getPublicUrl(path);

      const commande = commandes.find(c => c.id === demandeId);
      const photos = [...(commande?.photos_preuve || []), urlData.publicUrl];
      const { error: updateError } = await supabase.from('demandes').update({ photos_preuve: photos }).eq('id', demandeId);
      if (updateError) throw updateError;

      setCommandes(prev => prev.map(c => c.id === demandeId ? { ...c, photos_preuve: photos } : c));
    } catch (err) {
      console.error('Erreur upload photo :', err);
      alert("L'envoi de la photo a échoué. Réessayez.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleMarquerLivre = async (demandeId) => {
    try {
      const { error } = await supabase.from('demandes').update({ statut: 'terminee' }).eq('id', demandeId);
      if (error) throw error;
      setCommandes(prev => prev.map(c => c.id === demandeId ? { ...c, statut: 'terminee' } : c));
    } catch (err) {
      console.error('Erreur mise à jour statut :', err);
      alert("Impossible de mettre à jour le statut pour l'instant.");
    }
  };

  return (
    <ShopperLayout fullWidth>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: serif, fontSize: '2.2rem', fontWeight: 300, fontStyle: 'italic', color: ink, marginBottom: '8px' }}>Commandes</h1>
        <p style={{ fontFamily: sans, fontSize: '13px', color: inkSoft }}>Suivi de vos missions acceptées, de la recherche à la livraison.</p>
        <div style={{ width: '36px', height: '1px', background: gold, margin: '20px 0 28px' }} />

        {loading ? (
          <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Chargement…</p>
        ) : commandes.length === 0 ? (
          <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '48px', textAlign: 'center' }}>
            <p style={{ fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', color: inkSoft, marginBottom: '16px' }}>Vous n'avez aucune commande en cours.</p>
            <a href="/#/shopper/demandes" style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: gold, borderBottom: `1px solid ${gold}`, paddingBottom: '2px', textDecoration: 'none' }}>
              Voir les demandes disponibles →
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {commandes.map(c => {
              const st = STATUTS[c.statut] || STATUTS.en_cours;
              return (
                <div key={c.id} style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '24px 28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.16em', textTransform: 'uppercase', color: gold }}>{c.categorie}</span>
                      <p style={{ fontFamily: serif, fontSize: '1.3rem', color: ink, marginTop: '4px' }}>{c.description ? c.description.slice(0, 60) : 'Commande'}</p>
                    </div>
                    <span style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: st.color, background: st.bg, padding: '6px 14px', whiteSpace: 'nowrap' }}>{st.label}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontFamily: sans, fontSize: '11px', color: inkSoft, marginBottom: '18px' }}>
                    {c.delai && <span>Délai souhaité : {c.delai}</span>}
                    {c.budget_min && c.budget_max && <span>Budget : {c.budget_min}–{c.budget_max} €</span>}
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, marginBottom: '10px' }}>Photos de la pièce trouvée</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(c.photos_preuve || []).map((url, i) => (
                        <img key={i} src={url} alt={`Preuve ${i + 1}`} style={{ width: '64px', height: '64px', objectFit: 'cover', border: `1px solid ${hairline}` }} />
                      ))}
                      {c.statut === 'en_cours' && (
                        <>
                          <input ref={el => fileInputs.current[c.id] = el} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(c.id, e.target.files[0])} />
                          <button onClick={() => fileInputs.current[c.id]?.click()} disabled={uploadingId === c.id}
                            style={{ width: '64px', height: '64px', border: `1.5px dashed ${hairline}`, background: 'none', cursor: 'pointer', color: inkSoft, fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {uploadingId === c.id ? '…' : '+'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a href={`/#/shopper/messages?client=${c.client_id || ''}`}
                      style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: ink, background: 'transparent', border: `1px solid ${hairline}`, padding: '11px 22px', textDecoration: 'none' }}
                    >Contacter le client</a>
                    {c.statut === 'en_cours' && (
                      <button onClick={() => handleMarquerLivre(c.id)} disabled={!(c.photos_preuve || []).length}
                        title={!(c.photos_preuve || []).length ? 'Ajoutez au moins une photo avant de valider' : ''}
                        style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#FFFFFF', background: (c.photos_preuve || []).length ? ink : '#D8D2C6', border: 'none', padding: '12px 22px', cursor: (c.photos_preuve || []).length ? 'pointer' : 'not-allowed' }}
                      >Marquer comme livrée</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ShopperLayout>
  );
}