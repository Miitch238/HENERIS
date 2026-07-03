import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";

/* Hypothèses Supabase (à valider avec Mitch) :
   articles : id, shopper_id, titre, marque, categorie, prix, description,
              photos (text[]), statut ('disponible' | 'vendu' | 'expire'), created_at
   Storage  : bucket "article-photos" (public) */

const CATEGORIES = ['Maroquinerie', 'Horlogerie', 'Joaillerie', 'Mode', 'Chaussures', 'Accessoires', 'Vintage', 'Collection', 'Art de vivre'];

const STATUTS = {
  disponible: { label: 'Disponible', color: '#3a8a5c', bg: '#eef7f0' },
  vendu:      { label: 'Vendu',      color: '#888',    bg: '#f2f2f2' },
  expire:     { label: 'Expiré',     color: '#b8453a', bg: '#fbeceb' },
};

const emptyForm = { titre: '', marque: '', categorie: CATEGORIES[0], prix: '', description: '' };

export default function ShopperArticles() {
  const [loading, setLoading]   = useState(true);
  const [articles, setArticles] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('shopper_id', session.user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.error('Erreur chargement articles :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titre || !form.prix) return;
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const photoUrls = [];
      for (const file of photoFiles) {
        const path = `${session.user.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from('article-photos').upload(path, file);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from('article-photos').getPublicUrl(path);
        photoUrls.push(urlData.publicUrl);
      }

      const { data, error } = await supabase.from('articles').insert({
        shopper_id: session.user.id,
        titre: form.titre,
        marque: form.marque,
        categorie: form.categorie,
        prix: Number(form.prix),
        description: form.description,
        photos: photoUrls,
        statut: 'disponible',
      }).select().single();
      if (error) throw error;

      setArticles(prev => [data, ...prev]);
      setForm(emptyForm);
      setPhotoFiles([]);
      setFormOpen(false);
    } catch (err) {
      console.error('Erreur publication article :', err);
      alert("La publication a échoué. Vérifiez les champs et réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatutChange = async (id, statut) => {
    try {
      const { error } = await supabase.from('articles').update({ statut }).eq('id', id);
      if (error) throw error;
      setArticles(prev => prev.map(a => a.id === id ? { ...a, statut } : a));
    } catch (err) {
      console.error('Erreur changement de statut :', err);
    }
  };

  return (
    <ShopperLayout
      title="Mes articles"
      subtitle="Les pièces que vous avez repérées et souhaitez mettre en avant."
      action={
        <button onClick={() => setFormOpen(v => !v)}
          style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', background: '#1a1a1a', border: 'none', padding: '13px 26px', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = '#C9A84C'}
          onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
        >{formOpen ? 'Fermer' : 'Publier un article'}</button>
      }
    >
      {/* ─── Formulaire de publication ─── */}
      {formOpen && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '.5px solid #ececec', padding: '28px 30px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '6px' }}>Titre de la pièce</label>
              <input required value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} placeholder="Ex. Birkin 30 Togo Étoupe"
                style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: '.5px solid #ddd', width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '6px' }}>Marque</label>
              <input value={form.marque} onChange={e => setForm({ ...form, marque: e.target.value })} placeholder="Ex. Hermès"
                style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: '.5px solid #ddd', width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '6px' }}>Catégorie</label>
              <select value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}
                style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: '.5px solid #ddd', width: '100%' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '6px' }}>Prix (€)</label>
              <input required type="number" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} placeholder="Ex. 8500"
                style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: '.5px solid #ddd', width: '100%', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '6px' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="État, provenance, particularités…"
              style={{ fontFamily: sans, fontSize: '12px', padding: '10px 12px', border: '.5px solid #ddd', width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px' }}>Photos</label>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={e => setPhotoFiles(Array.from(e.target.files))} style={{ fontFamily: sans, fontSize: '11px' }} />
            {photoFiles.length > 0 && <p style={{ fontFamily: sans, fontSize: '10px', color: '#aaa', marginTop: '6px' }}>{photoFiles.length} photo(s) sélectionnée(s)</p>}
          </div>
          <button type="submit" disabled={submitting}
            style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', background: submitting ? '#ccc' : '#C9A84C', border: 'none', padding: '14px 0', cursor: submitting ? 'default' : 'pointer', alignSelf: 'flex-start', minWidth: '220px' }}
          >{submitting ? 'Publication…' : 'Publier l\'article'}</button>
        </form>
      )}

      {/* ─── Liste des articles ─── */}
      {loading ? (
        <p style={{ fontFamily: serif, fontStyle: 'italic', color: '#bbb' }}>Chargement…</p>
      ) : articles.length === 0 ? (
        <div style={{ background: '#fff', border: '.5px solid #ececec', padding: '48px', textAlign: 'center' }}>
          <p style={{ fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', color: '#aaa' }}>Vous n'avez pas encore publié d'article.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {articles.map(a => {
            const st = STATUTS[a.statut] || STATUTS.disponible;
            return (
              <div key={a.id} style={{ background: '#fff', border: '.5px solid #ececec' }}>
                <div style={{ height: '180px', background: '#f7f5f2', overflow: 'hidden' }}>
                  {a.photos?.[0] && <img src={a.photos[0]} alt={a.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#C9A84C' }}>{a.marque || a.categorie}</span>
                    <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: st.color, background: st.bg, padding: '3px 8px' }}>{st.label}</span>
                  </div>
                  <p style={{ fontFamily: serif, fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '6px' }}>{a.titre}</p>
                  <p style={{ fontFamily: sans, fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '12px' }}>{a.prix?.toLocaleString('fr-FR')} €</p>
                  {a.statut === 'disponible' && (
                    <button onClick={() => handleStatutChange(a.id, 'vendu')}
                      style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#1a1a1a', background: 'none', border: '.5px solid #1a1a1a', padding: '8px 0', width: '100%', cursor: 'pointer' }}
                    >Marquer comme vendu</button>
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
