import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";

/* Hypothèses Supabase (à valider avec Mitch) :
   demandes : id, categorie, titre, client_id, statut ('en_cours' | 'terminee'),
              deadline, photos_preuve (text[]), montant_final
   Storage  : bucket "mission-photos" (public), chemin {demande_id}/{filename} */

const STATUTS = {
  en_cours: { label: 'En cours', color: '#b8922e', bg: '#fff8ec' },
  terminee: { label: 'Terminée', color: '#3a8a5c', bg: '#eef7f0' },
};

export default function ShopperMissions() {
  const [loading, setLoading]   = useState(true);
  const [missions, setMissions] = useState([]);
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
        .order('deadline', { ascending: true });
      if (error) throw error;
      setMissions(data || []);
    } catch (err) {
      console.error('Erreur chargement missions :', err);
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

      const mission = missions.find(m => m.id === demandeId);
      const photos = [...(mission?.photos_preuve || []), urlData.publicUrl];
      const { error: updateError } = await supabase.from('demandes').update({ photos_preuve: photos }).eq('id', demandeId);
      if (updateError) throw updateError;

      setMissions(prev => prev.map(m => m.id === demandeId ? { ...m, photos_preuve: photos } : m));
    } catch (err) {
      console.error('Erreur upload photo :', err);
      alert("L'envoi de la photo a échoué. Réessayez.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleMarquerTrouve = async (demandeId) => {
    try {
      const { error } = await supabase.from('demandes').update({ statut: 'terminee' }).eq('id', demandeId);
      if (error) throw error;
      setMissions(prev => prev.map(m => m.id === demandeId ? { ...m, statut: 'terminee' } : m));
    } catch (err) {
      console.error('Erreur mise à jour statut :', err);
      alert("Impossible de mettre à jour le statut pour l'instant.");
    }
  };

  return (
    <ShopperLayout title="Mes missions" subtitle="Suivi de vos missions acceptées, de la recherche à la livraison.">
      {loading ? (
        <p style={{ fontFamily: serif, fontStyle: 'italic', color: '#bbb' }}>Chargement…</p>
      ) : missions.length === 0 ? (
        <div style={{ background: '#fff', border: '.5px solid #ececec', padding: '48px', textAlign: 'center' }}>
          <p style={{ fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', color: '#aaa', marginBottom: '16px' }}>Vous n'avez aucune mission en cours.</p>
          <a href="/#/shopper/marche" style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#1a1a1a', borderBottom: '.5px solid #1a1a1a', paddingBottom: '2px', textDecoration: 'none' }}>
            Aller au marché des demandes →
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {missions.map(m => {
            const st = STATUTS[m.statut] || STATUTS.en_cours;
            const deadlinePassee = m.deadline && new Date(m.deadline) < new Date() && m.statut === 'en_cours';
            return (
              <div key={m.id} style={{ background: '#fff', border: '.5px solid #ececec', padding: '24px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#C9A84C' }}>{m.categorie}</span>
                    <p style={{ fontFamily: serif, fontSize: '1.3rem', color: '#1a1a1a', marginTop: '4px' }}>{m.titre || 'Mission'}</p>
                  </div>
                  <span style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: st.color, background: st.bg, padding: '6px 14px', whiteSpace: 'nowrap' }}>
                    {st.label}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontFamily: sans, fontSize: '11px', color: '#888', marginBottom: '18px' }}>
                  {m.deadline && (
                    <span style={{ color: deadlinePassee ? '#b8453a' : '#888' }}>
                      Échéance : {new Date(m.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      {deadlinePassee && ' (dépassée)'}
                    </span>
                  )}
                  {m.montant_final && <span>Montant : {m.montant_final} €</span>}
                </div>

                {/* Photos preuve */}
                <div style={{ marginBottom: '18px' }}>
                  <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '10px' }}>Photos de la pièce trouvée</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(m.photos_preuve || []).map((url, i) => (
                      <img key={i} src={url} alt={`Preuve ${i + 1}`} style={{ width: '64px', height: '64px', objectFit: 'cover', border: '.5px solid #ececec' }} />
                    ))}
                    {m.statut === 'en_cours' && (
                      <>
                        <input
                          ref={el => fileInputs.current[m.id] = el}
                          type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={e => handleUpload(m.id, e.target.files[0])}
                        />
                        <button onClick={() => fileInputs.current[m.id]?.click()} disabled={uploadingId === m.id}
                          style={{ width: '64px', height: '64px', border: '1.5px dashed #ddd', background: 'none', cursor: 'pointer', color: '#bbb', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {uploadingId === m.id ? '…' : '+'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a href={`/#/messages?client=${m.client_id || ''}`}
                    style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#1a1a1a', background: 'transparent', border: '1px solid #1a1a1a', padding: '11px 22px', textDecoration: 'none' }}
                  >Contacter le client</a>
                  {m.statut === 'en_cours' && (
                    <button onClick={() => handleMarquerTrouve(m.id)} disabled={!(m.photos_preuve || []).length}
                      title={!(m.photos_preuve || []).length ? 'Ajoutez au moins une photo avant de valider' : ''}
                      style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff', background: (m.photos_preuve || []).length ? '#1a1a1a' : '#ddd', border: 'none', padding: '12px 22px', cursor: (m.photos_preuve || []).length ? 'pointer' : 'not-allowed' }}
                    >Marquer comme trouvé</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ShopperLayout>
  );
}