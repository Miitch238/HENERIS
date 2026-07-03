import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout, { palette } from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";
const { cardBg, ink, inkSoft, hairline, gold } = palette;

/* Schéma Supabase réel (vérifié) :
   demandes         : id, client_id, categorie, description, budget_min, budget_max,
                       delai (texte libre), statut, created_at, shopper_id
   shopper_profiles : user_id, specialites (ARRAY)
   Pas de colonnes titre / urgence / localisation sur demandes actuellement. */

const CATEGORIES = ['Maroquinerie', 'Horlogerie', 'Joaillerie', 'Mode', 'Chaussures', 'Accessoires', 'Vintage', 'Collection', 'Art de vivre'];
const toSlug = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'et').replace(/ /g, '-');

export default function ShopperDemandes() {
  const [loading, setLoading]     = useState(true);
  const [demandes, setDemandes]   = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [filtreCat, setFiltreCat] = useState('Tout');
  const [budgetMax, setBudgetMax] = useState('');
  const [proposingId, setProposingId] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      try {
        const { data: shopperProfile } = await supabase.from('shopper_profiles').select('specialites').eq('user_id', session.user.id).single();
        const specs = shopperProfile?.specialites || [];
        setSpecialites(specs);

        let query = supabase.from('demandes').select('*').eq('statut', 'ouverte').order('created_at', { ascending: false });
        if (specs.length) query = query.in('categorie', specs);
        const { data, error } = await query;
        if (error) throw error;
        setDemandes(data || []);
        if (data?.length) setSelected(data[0]);
      } catch (err) {
        console.error('Erreur chargement des demandes :', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProposer = async (demandeId) => {
    setProposingId(demandeId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase.from('demandes').update({ shopper_id: session.user.id, statut: 'en_cours' }).eq('id', demandeId).eq('statut', 'ouverte');
      if (error) throw error;
      setDemandes(prev => prev.filter(d => d.id !== demandeId));
      setSelected(null);
    } catch (err) {
      console.error('Erreur lors de la proposition :', err);
      alert("La demande n'est plus disponible ou une erreur est survenue.");
    } finally {
      setProposingId(null);
    }
  };

  const filtered = useMemo(() => demandes.filter(d => {
    if (filtreCat !== 'Tout' && d.categorie !== toSlug(filtreCat)) return false;
    if (budgetMax && Number(d.budget_min) > Number(budgetMax)) return false;
    return true;
  }), [demandes, filtreCat, budgetMax]);

  return (
    <ShopperLayout fullWidth>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ marginBottom: '8px' }}>
          <h1 style={{ fontFamily: serif, fontSize: '2.2rem', fontWeight: 300, fontStyle: 'italic', color: ink, marginBottom: '8px' }}>Demandes</h1>
          <p style={{ fontFamily: sans, fontSize: '13px', color: inkSoft }}>
            {specialites.length ? `Demandes dans vos spécialités : ${specialites.join(', ')}` : 'Toutes les demandes ouvertes'}
          </p>
        </div>
        <div style={{ width: '36px', height: '1px', background: gold, margin: '20px 0 28px' }} />

        {/* ─── Filtres ─── */}
        <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '18px 22px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, marginBottom: '6px' }}>Catégorie</label>
            <select value={filtreCat} onChange={e => setFiltreCat(e.target.value)}
              style={{ fontFamily: sans, fontSize: '11px', padding: '9px 12px', border: `1px solid ${hairline}`, minWidth: '160px', color: ink, background: '#FFFFFF' }}>
              <option>Tout</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, marginBottom: '6px' }}>Budget max (€)</label>
            <input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="Aucune limite"
              style={{ fontFamily: sans, fontSize: '11px', padding: '9px 12px', border: `1px solid ${hairline}`, width: '140px', color: ink }} />
          </div>
        </div>

        {/* ─── Liste + détail ─── */}
        {loading ? (
          <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Chargement…</p>
        ) : filtered.length === 0 ? (
          <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '48px', textAlign: 'center' }}>
            <p style={{ fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', color: inkSoft }}>Aucune demande ne correspond à ces critères pour le moment.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>
            {/* Liste */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '640px', overflowY: 'auto' }}>
              {filtered.map(d => {
                const active = selected?.id === d.id;
                return (
                  <div key={d.id} onClick={() => setSelected(d)}
                    style={{ background: active ? '#FBF8F3' : cardBg, border: `1px solid ${active ? gold : hairline}`, padding: '16px 18px', cursor: 'pointer' }}
                  >
                    <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: gold }}>{d.categorie}</span>
                    <p style={{ fontFamily: serif, fontSize: '1.05rem', color: ink, marginTop: '4px', marginBottom: '4px' }}>{d.description ? d.description.slice(0, 48) : 'Pièce recherchée'}</p>
                    <p style={{ fontFamily: sans, fontSize: '10px', color: inkSoft }}>{d.budget_min && d.budget_max ? `${d.budget_min}–${d.budget_max} €` : 'Budget flexible'}</p>
                  </div>
                );
              })}
            </div>

            {/* Détail */}
            <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '32px' }}>
              {!selected ? (
                <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Sélectionnez une demande pour voir le détail.</p>
              ) : (
                <>
                  <span style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: gold }}>{selected.categorie}</span>
                  <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontStyle: 'italic', color: ink, marginTop: '8px', marginBottom: '20px' }}>
                    {selected.description || 'Pièce recherchée'}
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px', borderTop: `1px solid ${hairline}`, paddingTop: '20px' }}>
                    <div>
                      <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '4px' }}>Budget</p>
                      <p style={{ fontFamily: serif, fontSize: '1.2rem', color: ink }}>{selected.budget_min && selected.budget_max ? `${selected.budget_min}–${selected.budget_max} €` : 'Flexible'}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '4px' }}>Délai souhaité</p>
                      <p style={{ fontFamily: serif, fontSize: '1.2rem', color: ink }}>{selected.delai || 'Non précisé'}</p>
                    </div>
                  </div>
                  <button onClick={() => handleProposer(selected.id)} disabled={proposingId === selected.id}
                    style={{ fontFamily: sans, fontSize: '10.5px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#FFFFFF', background: proposingId === selected.id ? '#CFC8BC' : ink, padding: '14px 32px', border: 'none', cursor: proposingId === selected.id ? 'default' : 'pointer' }}
                  >{proposingId === selected.id ? 'Envoi…' : 'Proposer mes services'}</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ShopperLayout>
  );
}