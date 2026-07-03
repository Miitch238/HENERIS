import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout, { palette } from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";
const { cardBg, cardAlt, ink, inkSoft, hairline, gold } = palette;

/* ─────────────────────────────────────────────────────────────
   Schéma Supabase réel (vérifié) :
   profiles         : user_id, prenom, nom
   shopper_profiles : user_id, bio, specialites (ARRAY), rating, is_certified
   demandes         : statut, categorie, client_id (pour le calcul de réussite/fidélisation)
   articles         : id, shopper_id, categorie, prix, statut, created_at
                      (+ probablement titre/marque/description/photos)

   Interprétation pour cette page :
   - "Disponibilités" = articles.statut === 'disponible'
   - "Dernières trouvailles" = articles.statut === 'vendu' (une pièce vendue
     est la meilleure preuve visuelle d'un sourcing réussi et livré — c'est
     la seule donnée avec photo qui atteste d'une mission terminée)
   - "Sélections du moment" = regroupement automatique des disponibilités
     par catégorie (pas de table de collections dédiée pour l'instant)
   - Pas de colonne ville/localisation : la mention de ville dans le hero
     est omise plutôt qu'affichée vide, pour ne pas casser l'immersion.
   - shopper_profiles.nom_boutique (text) : nom de boutique affiché en
     titre principal du hero, distinct du nom personnel (prenom/nom).
   - shopper_profiles.nom_boutique_modifs (integer, défaut 0) : compteur de
     modifications du nom de boutique, limité à MAX_NOM_BOUTIQUE_MODIFS (2).
   - shopper_profiles.avatar_url (text) : photo de profil.
   - shopper_profiles.cover_url (text) : photo de couverture personnalisée
     pour le fond du hero (priorité sur les photos de pièces).
   Ces colonnes sont probablement à ajouter côté base.
   - editorial_articles : table probablement absente, section vide si c'est le cas. */

const STATUT_BADGE = { vendu: 'Livré' };

// Nombre de fois où le nom de boutique peut être changé après sa création initiale.
const MAX_NOM_BOUTIQUE_MODIFS = 2;

const Img = ({ src, alt, ratio = '1' }) => (
  <div style={{ position: 'relative', width: '100%', paddingTop: `${100 / ratio}%`, overflow: 'hidden', background: cardAlt }}>
    {src && (
      <img src={src} alt={alt}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s cubic-bezier(.2,.8,.2,1)' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
    )}
  </div>
);

export default function ShopperVitrine() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [shopperProfile, setShopperProfile] = useState(null);
  const [reputation, setReputation] = useState({ successRate: 0, repeatClients: 0 });
  const [disponibles, setDisponibles] = useState([]);
  const [trouvailles, setTrouvailles] = useState([]);
  const [editorial, setEditorial] = useState([]);
  const [hovered, setHovered] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ titre: '', marque: '', categorie: 'Maroquinerie', prix: '', description: '' });
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ nom_boutique: '', bio: '', specialites: [] });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const avatarFileRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const user = session.user;

      try {
        const [{ data: p }, { data: sp }, { data: arts }] = await Promise.all([
          supabase.from('profiles').select('prenom, nom').eq('user_id', user.id).single(),
          supabase.from('shopper_profiles').select('*').eq('user_id', user.id).single(),
          supabase.from('articles').select('*').eq('shopper_id', user.id).order('created_at', { ascending: false }),
        ]);
        setProfile(p);
        setShopperProfile(sp);
        setProfileForm({ nom_boutique: sp?.nom_boutique || '', bio: sp?.bio || '', specialites: sp?.specialites || [] });

        const all = arts || [];
        setDisponibles(all.filter(a => a.statut === 'disponible'));
        setTrouvailles(all.filter(a => a.statut === 'vendu'));

        const { data: missions } = await supabase.from('demandes').select('client_id, statut').eq('shopper_id', user.id).in('statut', ['en_cours', 'terminee']);
        const counts = {};
        (missions || []).forEach(d => { if (d.client_id) counts[d.client_id] = (counts[d.client_id] || 0) + 1; });
        const repeatClients = Object.values(counts).filter(n => n > 1).length;
        const terminees = (missions || []).filter(d => d.statut === 'terminee').length;
        const successRate = (missions || []).length ? Math.round((terminees / missions.length) * 100) : 0;
        setReputation({ successRate, repeatClients });

        const { data: ed } = await supabase.from('editorial_articles').select('*').eq('shopper_id', user.id).order('created_at', { ascending: false }).limit(3);
        setEditorial(ed || []);
      } catch (err) {
        console.error('Erreur chargement de la vitrine :', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titre) return;
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const photoUrls = [];
      for (const file of photos) {
        const ext = (file.name.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '');
        const path = `${session.user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('article-photos').upload(path, file);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from('article-photos').getPublicUrl(path);
        photoUrls.push(urlData.publicUrl);
      }
      const { data, error } = await supabase.from('articles').insert({
        shopper_id: session.user.id, titre: form.titre, marque: form.marque, categorie: form.categorie,
        prix: Number(form.prix) || null, description: form.description, photos: photoUrls, statut: 'disponible',
      }).select().single();
      if (error) throw error;
      setDisponibles(prev => [data, ...prev]);
      setForm({ titre: '', marque: '', categorie: 'Maroquinerie', prix: '', description: '' });
      setPhotos([]);
      setFormOpen(false);
    } catch (err) {
      console.error(err);
      alert('La publication a échoué.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let avatarUrl = shopperProfile?.avatar_url || null;
      if (avatarFile) {
        const ext = (avatarFile.name.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '');
        const path = `${session.user.id}/avatar-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, avatarFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }

      let coverUrl = shopperProfile?.cover_url || null;
      if (coverFile) {
        const ext = (coverFile.name.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '');
        const path = `${session.user.id}/cover-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, coverFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
        coverUrl = urlData.publicUrl;
      }

      const nomBoutiqueModifs = shopperProfile?.nom_boutique_modifs || 0;
      const nomBoutiqueChanged = profileForm.nom_boutique !== (shopperProfile?.nom_boutique || '');
      if (nomBoutiqueChanged && nomBoutiqueModifs >= MAX_NOM_BOUTIQUE_MODIFS) {
        alert(`Vous avez déjà utilisé vos ${MAX_NOM_BOUTIQUE_MODIFS} modifications possibles du nom de boutique. Contactez le support pour un changement exceptionnel.`);
        setSavingProfile(false);
        return;
      }

      const { error } = await supabase.from('shopper_profiles').update({
        nom_boutique: profileForm.nom_boutique,
        nom_boutique_modifs: nomBoutiqueChanged ? nomBoutiqueModifs + 1 : nomBoutiqueModifs,
        bio: profileForm.bio,
        specialites: profileForm.specialites,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
      }).eq('user_id', session.user.id);
      if (error) throw error;

      setShopperProfile(prev => ({
        ...prev,
        nom_boutique: profileForm.nom_boutique,
        nom_boutique_modifs: nomBoutiqueChanged ? nomBoutiqueModifs + 1 : nomBoutiqueModifs,
        bio: profileForm.bio,
        specialites: profileForm.specialites,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
      }));
      setAvatarFile(null);
      setCoverFile(null);
      setProfileEditOpen(false);
    } catch (err) {
      console.error('Erreur sauvegarde du profil :', err);
      alert("L'enregistrement a échoué. Si le problème persiste, la colonne avatar_url n'existe peut-être pas encore côté base.");
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleSpecialite = (cat) => {
    setProfileForm(prev => ({
      ...prev,
      specialites: prev.specialites.includes(cat) ? prev.specialites.filter(s => s !== cat) : [...prev.specialites, cat],
    }));
  };

  const fullName = profile ? `${profile.prenom || ''} ${profile.nom || ''}`.trim() : '';
  const specialites = shopperProfile?.specialites || [];
  const heroImg = shopperProfile?.cover_url || disponibles[0]?.photos?.[0] || trouvailles[0]?.photos?.[0] || null;

  // Sélections du moment : regroupement des disponibilités par catégorie (≥2 pièces)
  const collections = Object.values(
    disponibles.reduce((acc, a) => {
      if (!a.categorie) return acc;
      acc[a.categorie] = acc[a.categorie] || { categorie: a.categorie, items: [] };
      acc[a.categorie].items.push(a);
      return acc;
    }, {})
  ).filter(c => c.items.length >= 1);

  return (
    <ShopperLayout fullWidth>

      {/* ─── 1. Hero visuel ─── */}
      <div style={{ position: 'relative', height: '480px', marginLeft: '-40px', marginRight: '-40px', marginTop: '-48px', overflow: 'hidden', background: ink }}>
        {heroImg && (
          <img src={heroImg} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .55 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,26,24,.92), rgba(27,26,24,.25) 55%, rgba(27,26,24,.1))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 64px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '14px' }}>
            <span style={{ width: '72px', height: '72px', borderRadius: '50%', background: cardAlt, border: '2px solid rgba(255,255,255,.4)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {shopperProfile?.avatar_url
                ? <img src={shopperProfile.avatar_url} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={inkSoft} strokeWidth="1.3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              }
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ fontFamily: serif, fontSize: '2.6rem', fontWeight: 300, fontStyle: 'italic', color: '#FFFFFF' }}>
                  {shopperProfile?.nom_boutique || 'Votre vitrine'}
                </h1>
                {shopperProfile?.is_certified && (
                  <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.12em', textTransform: 'uppercase', color: gold, border: `1px solid ${gold}`, padding: '4px 10px' }}>Certifié</span>
                )}
              </div>
              {fullName && (
                <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.06em', color: 'rgba(255,255,255,.55)', marginTop: '4px' }}>par {fullName}</p>
              )}
              {specialites.length > 0 && (
                <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: gold, marginTop: '8px' }}>{specialites.join(' · ')}</p>
              )}
            </div>
          </div>
          {shopperProfile?.bio ? (
            <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(255,255,255,.85)', maxWidth: '560px', lineHeight: 1.7, marginBottom: '24px' }}>{shopperProfile.bio}</p>
          ) : (
            <p style={{ fontFamily: serif, fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,.5)', maxWidth: '560px', marginBottom: '24px' }}>
              Présentez-vous en quelques mots à vos futurs clients — cliquez sur "Modifier mon profil".
            </p>
          )}
          <div style={{ display: 'flex', gap: '36px' }}>
            <div>
              <p style={{ fontFamily: serif, fontSize: '1.3rem', fontStyle: 'italic', color: gold }}>{shopperProfile?.rating ? `★ ${shopperProfile.rating.toFixed(1)}` : '—'}</p>
              <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginTop: '4px' }}>Note moyenne</p>
            </div>
            <div>
              <p style={{ fontFamily: serif, fontSize: '1.3rem', fontStyle: 'italic', color: '#FFFFFF' }}>{loading ? '—' : `${reputation.successRate}%`}</p>
              <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginTop: '4px' }}>Taux de réussite</p>
            </div>
            <div>
              <p style={{ fontFamily: serif, fontSize: '1.3rem', fontStyle: 'italic', color: '#FFFFFF' }}>{loading ? '—' : reputation.repeatClients}</p>
              <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginTop: '4px' }}>Clients récurrents</p>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '24px', right: '40px', display: 'flex', gap: '10px' }}>
          <button onClick={() => { setProfileEditOpen(v => !v); setFormOpen(false); }}
            style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#FFFFFF', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.4)', padding: '11px 22px', cursor: 'pointer' }}
          >{profileEditOpen ? 'Fermer' : 'Modifier mon profil'}</button>
          <button onClick={() => { setFormOpen(v => !v); setProfileEditOpen(false); }}
            style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: ink, background: '#FFFFFF', border: 'none', padding: '12px 22px', cursor: 'pointer' }}
          >{formOpen ? 'Fermer' : '+ Ajouter une pièce'}</button>
        </div>
      </div>


      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px 0' }}>

        {profileEditOpen && (
          <form onSubmit={handleSaveProfile} style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '32px 36px', marginBottom: '56px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <p style={{ fontFamily: serif, fontSize: '1.3rem', fontStyle: 'italic', color: ink }}>Modifier mon profil</p>

            <div>
              <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, marginBottom: '8px' }}>Nom de votre boutique</label>
              {(() => {
                const modifs = shopperProfile?.nom_boutique_modifs || 0;
                const locked = modifs >= MAX_NOM_BOUTIQUE_MODIFS;
                const restantes = MAX_NOM_BOUTIQUE_MODIFS - modifs;
                return (
                  <>
                    <input value={profileForm.nom_boutique} onChange={e => setProfileForm({ ...profileForm, nom_boutique: e.target.value })}
                      placeholder="Ex. L'Atelier Privé, Maison Antonio…" disabled={locked}
                      style={{ fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', padding: '10px 14px', border: `1px solid ${hairline}`, width: '100%', boxSizing: 'border-box', background: locked ? '#F5F1EA' : '#FFFFFF', color: locked ? inkSoft : ink }} />
                    <p style={{ fontFamily: sans, fontSize: '9.5px', color: inkSoft, marginTop: '6px' }}>
                      {locked
                        ? "Vous avez utilisé toutes vos modifications possibles pour ce nom. Contactez le support pour un changement exceptionnel."
                        : `C'est le nom affiché en grand sur votre vitrine — distinct de votre nom personnel. ${restantes} modification${restantes === 1 ? '' : 's'} restante${restantes === 1 ? '' : 's'} après celle-ci si vous le changez.`}
                    </p>
                  </>
                );
              })()}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ width: '64px', height: '64px', borderRadius: '50%', background: cardAlt, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {avatarFile
                  ? <img src={URL.createObjectURL(avatarFile)} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : shopperProfile?.avatar_url
                    ? <img src={shopperProfile.avatar_url} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={inkSoft} strokeWidth="1.3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                }
              </span>
              <div>
                <input ref={avatarFileRef} type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} style={{ fontFamily: sans, fontSize: '11px' }} />
                <p style={{ fontFamily: sans, fontSize: '9.5px', color: inkSoft, marginTop: '6px' }}>Photo de profil — visible en haut de votre vitrine.</p>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, marginBottom: '10px' }}>Photo de couverture</label>
              <div style={{ width: '100%', height: '120px', background: cardAlt, marginBottom: '10px', overflow: 'hidden' }}>
                {coverFile
                  ? <img src={URL.createObjectURL(coverFile)} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : shopperProfile?.cover_url
                    ? <img src={shopperProfile.cover_url} alt="Couverture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : null}
              </div>
              <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} style={{ fontFamily: sans, fontSize: '11px' }} />
              <p style={{ fontFamily: sans, fontSize: '9.5px', color: inkSoft, marginTop: '6px' }}>L'image en grand format derrière votre nom de boutique. Sans photo personnalisée, une photo de vos pièces est utilisée par défaut.</p>
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, marginBottom: '8px' }}>Biographie</label>
              <textarea value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} rows={3}
                placeholder="Ex. Spécialisé dans le sourcing de pièces rares Hermès, Chanel vintage et horlogerie haut de gamme à travers l'Europe."
                style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '13px', padding: '12px 14px', border: `1px solid ${hairline}`, width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, marginBottom: '10px' }}>Spécialités</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Maroquinerie', 'Horlogerie', 'Joaillerie', 'Mode', 'Chaussures', 'Accessoires', 'Vintage', 'Collection', 'Art de vivre'].map(cat => {
                  const active = profileForm.specialites.includes(cat);
                  return (
                    <button key={cat} type="button" onClick={() => toggleSpecialite(cat)}
                      style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.04em', padding: '8px 16px', border: `1px solid ${active ? gold : hairline}`, background: active ? '#FBF3E2' : 'transparent', color: active ? ink : inkSoft, cursor: 'pointer' }}
                    >{cat}</button>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={savingProfile}
              style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#FFFFFF', background: savingProfile ? '#CFC8BC' : ink, border: 'none', padding: '14px 0', cursor: 'pointer', alignSelf: 'flex-start', minWidth: '200px' }}
            >{savingProfile ? 'Enregistrement…' : 'Enregistrer'}</button>
          </form>
        )}

        {formOpen && (
          <form onSubmit={handleSubmit} style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '28px 30px', marginBottom: '56px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input required value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} placeholder="Nom de la pièce"
                style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: `1px solid ${hairline}` }} />
              <input value={form.marque} onChange={e => setForm({ ...form, marque: e.target.value })} placeholder="Marque"
                style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: `1px solid ${hairline}` }} />
              <select value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}
                style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: `1px solid ${hairline}` }}>
                {['Maroquinerie', 'Horlogerie', 'Joaillerie', 'Mode', 'Chaussures', 'Accessoires', 'Vintage', 'Collection', 'Art de vivre'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} placeholder="Prix (€)"
                style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: `1px solid ${hairline}` }} />
            </div>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Description courte"
              style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: `1px solid ${hairline}`, resize: 'vertical' }} />
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => setPhotos(Array.from(e.target.files))} style={{ fontFamily: sans, fontSize: '11px' }} />
            <button type="submit" disabled={submitting}
              style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#FFFFFF', background: submitting ? '#CFC8BC' : ink, border: 'none', padding: '14px 0', cursor: 'pointer', alignSelf: 'flex-start', minWidth: '200px' }}
            >{submitting ? 'Publication…' : 'Publier'}</button>
          </form>
        )}

        {/* ─── 2. Galerie principale ─── */}
        <div style={{ marginBottom: '72px' }}>
          <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 400, fontStyle: 'italic', color: ink, marginBottom: '8px' }}>Pièces disponibles maintenant</h2>
          <p style={{ fontFamily: sans, fontSize: '11.5px', color: inkSoft, marginBottom: '28px' }}>Ce que vous pouvez proposer à un client dès aujourd'hui — votre stock actif.</p>
          {loading ? (
            <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Chargement…</p>
          ) : disponibles.length === 0 ? (
            <div style={{ border: `1px dashed ${hairline}`, padding: '56px', textAlign: 'center' }}>
              <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Aucune pièce disponible pour l'instant — ajoutez-en une pour commencer à recevoir des demandes.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '4px' }}>
              {disponibles.map(a => (
                <div key={a.id} onMouseEnter={() => setHovered(a.id)} onMouseLeave={() => setHovered(null)} style={{ position: 'relative' }}>
                  <Img src={a.photos?.[0]} alt={a.titre} ratio="0.8" />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px',
                    background: 'linear-gradient(to top, rgba(27,26,24,.85), transparent)',
                    opacity: hovered === a.id ? 1 : 0.92, transition: 'opacity .25s',
                  }}>
                    <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: gold, display: 'block', marginBottom: '4px' }}>
                      {a.marque || a.categorie}
                    </span>
                    <p style={{ fontFamily: serif, fontSize: '1.15rem', color: '#FFFFFF', marginBottom: hovered === a.id ? '6px' : 0 }}>{a.titre}</p>
                    {hovered === a.id && a.prix && (
                      <p style={{ fontFamily: sans, fontSize: '10.5px', color: 'rgba(255,255,255,.85)' }}>Estimation : €{Number(a.prix).toLocaleString('fr-FR')}</p>
                    )}
                  </div>
                  <span style={{ position: 'absolute', top: '14px', left: '14px', fontFamily: sans, fontSize: '7.5px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#FFFFFF', background: 'rgba(27,26,24,.7)', padding: '4px 9px' }}>
                    Disponible actuellement
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── 3. Dernières trouvailles ─── */}
        <div style={{ marginBottom: '72px' }}>
          <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 400, fontStyle: 'italic', color: ink, marginBottom: '8px' }}>Pièces déjà trouvées et livrées</h2>
          <p style={{ fontFamily: sans, fontSize: '11.5px', color: inkSoft, marginBottom: '28px' }}>Votre historique de missions réussies — la preuve de votre expérience, pas du stock à vendre.</p>
          {loading ? (
            <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Chargement…</p>
          ) : trouvailles.length === 0 ? (
            <div style={{ border: `1px dashed ${hairline}`, padding: '40px', textAlign: 'center' }}>
              <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Votre historique de réussites s'écrira ici, à mesure que vous livrez vos clients.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {trouvailles.map(a => (
                <div key={a.id} style={{ minWidth: '220px', flexShrink: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <Img src={a.photos?.[0]} alt={a.titre} ratio="1" />
                    <span style={{ position: 'absolute', top: '12px', right: '12px', fontFamily: sans, fontSize: '7.5px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#FFFFFF', background: gold, padding: '4px 9px' }}>
                      {STATUT_BADGE.vendu}
                    </span>
                  </div>
                  <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.12em', textTransform: 'uppercase', color: gold, marginTop: '12px' }}>{a.marque || a.categorie}</p>
                  <p style={{ fontFamily: serif, fontSize: '1rem', color: ink, marginBottom: '4px' }}>{a.titre}</p>
                  <p style={{ fontFamily: sans, fontSize: '9.5px', color: inkSoft }}>{new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── 4. Sélections du moment ─── */}
        {collections.length > 0 && (
          <div style={{ marginBottom: '72px' }}>
            <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 400, fontStyle: 'italic', color: ink, marginBottom: '28px' }}>Sélections</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '4px' }}>
              {collections.map(c => (
                <div key={c.categorie} style={{ position: 'relative' }}>
                  <Img src={c.items[0]?.photos?.[0]} alt={c.categorie} ratio="1.4" />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(27,26,24,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <p style={{ fontFamily: serif, fontSize: '1.6rem', fontStyle: 'italic', color: '#FFFFFF', marginBottom: '6px' }}>{c.categorie}</p>
                    <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)' }}>{c.items.length} pièce{c.items.length === 1 ? '' : 's'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── 5. Articles ─── */}
        <div style={{ marginBottom: '64px', maxWidth: '900px' }}>
          <h2 style={{ fontFamily: serif, fontSize: '1.3rem', fontWeight: 400, fontStyle: 'italic', color: ink, marginBottom: '8px' }}>Mes conseils d'expert</h2>
          <p style={{ fontFamily: sans, fontSize: '11.5px', color: inkSoft, marginBottom: '22px' }}>Du contenu écrit, pas des pièces — vos analyses pour démontrer votre expertise.</p>
          {editorial.length === 0 ? (
            <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft, fontSize: '.95rem' }}>Aucun article publié pour l'instant — partagez une première analyse pour affirmer votre expertise.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {editorial.map(a => (
                <div key={a.id} style={{ borderTop: `2px solid ${gold}`, paddingTop: '14px' }}>
                  <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', color: ink, marginBottom: '8px' }}>{a.titre}</p>
                  {a.extrait && <p style={{ fontFamily: sans, fontSize: '11.5px', color: inkSoft, lineHeight: 1.6 }}>{a.extrait}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ShopperLayout>
  );
}