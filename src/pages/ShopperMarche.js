import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";

const surface = '#171614';
const border  = '#2A2825';
const textHi  = '#F2EFE9';
const textLo  = '#8C8880';
const gold    = '#C9A84C';
const redBg   = '#241313';
const redText = '#C2645A';

const CATEGORIES = ['Maroquinerie', 'Horlogerie', 'Joaillerie', 'Mode', 'Chaussures', 'Accessoires', 'Vintage', 'Collection', 'Art de vivre'];
const toSlug = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'et').replace(/ /g, '-');

export default function ShopperMarche() {
  const [loading, setLoading]     = useState(true);
  const [demandes, setDemandes]   = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [filtreCat, setFiltreCat] = useState('Tout');
  const [budgetMax, setBudgetMax] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [localisation, setLocalisation] = useState('');
  const [proposingId, setProposingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      try {
        const { data: profile } = await supabase.from('profiles').select('specialites').eq('user_id', session.user.id).single();
        const specs = profile?.specialites || [];
        setSpecialites(specs);

        let query = supabase.from('demandes').select('*').eq('statut', 'ouverte').order('created_at', { ascending: false });
        if (specs.length) query = query.in('categorie', specs);
        const { data, error } = await query;
        if (error) throw error;
        setDemandes(data || []);
      } catch (err) {
        console.error('Erreur chargement marché des demandes :', err);
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
    } catch (err) {
      console.error('Erreur lors de la proposition :', err);
      alert("La demande n'est plus disponible ou une erreur est survenue.");
    } finally {
      setProposingId(null);
    }
  };

  const filtered = useMemo(() => {
    return demandes.filter(d => {
      if (filtreCat !== 'Tout' && d.categorie !== toSlug(filtreCat)) return false;
      if (budgetMax && Number(d.budget_min) > Number(budgetMax)) return false;
      if (urgentOnly && !d.urgence) return false;
      if (localisation && !(d.localisation || '').toLowerCase().includes(localisation.toLowerCase())) return false;
      return true;
    });
  }, [demandes, filtreCat, budgetMax, urgentOnly, localisation]);

  return (
    <ShopperLayout
      title="Marché des demandes"
      subtitle={specialites.length ? `Demandes dans vos spécialités : ${specialites.join(', ')}` : 'Toutes les demandes ouvertes'}
    >
      {/* ─── Filtres ─── */}
      <div style={{ background: surface, border: `.5px solid ${border}`, padding: '20px 24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: textLo, marginBottom: '6px' }}>Catégorie</label>
          <select value={filtreCat} onChange={e => setFiltreCat(e.target.value)}
            style={{ fontFamily: sans, fontSize: '11px', padding: '9px 12px', border: `.5px solid ${border}`, minWidth: '160px', color: textHi, background: '#0E0E0D' }}>
            <option>Tout</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: textLo, marginBottom: '6px' }}>Budget max (€)</label>
          <input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="Aucune limite"
            style={{ fontFamily: sans, fontSize: '11px', padding: '9px 12px', border: `.5px solid ${border}`, width: '140px', color: textHi, background: '#0E0E0D' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: textLo, marginBottom: '6px' }}>Localisation</label>
          <input type="text" value={localisation} onChange={e => setLocalisation(e.target.value)} placeholder="Ville, pays…"
            style={{ fontFamily: sans, fontSize: '11px', padding: '9px 12px', border: `.5px solid ${border}`, width: '160px', color: textHi, background: '#0E0E0D' }} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: sans, fontSize: '11px', color: textHi, cursor: 'pointer', paddingBottom: '9px' }}>
          <input type="checkbox" checked={urgentOnly} onChange={e => setUrgentOnly(e.target.checked)} />
          Urgentes uniquement
        </label>
      </div>

      {/* ─── Liste des demandes ─── */}
      {loading ? (
        <p style={{ fontFamily: serif, fontStyle: 'italic', color: textLo }}>Chargement des demandes…</p>
      ) : filtered.length === 0 ? (
        <div style={{ background: surface, border: `.5px solid ${border}`, padding: '48px', textAlign: 'center' }}>
          <p style={{ fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', color: textLo }}>Aucune demande ne correspond à ces critères pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(d => (
            <div key={d.id} style={{ background: surface, border: `.5px solid ${border}`, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.16em', textTransform: 'uppercase', color: gold }}>{d.categorie}</span>
                {d.urgence && (
                  <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: redText, background: redBg, padding: '3px 8px' }}>Urgent</span>
                )}
              </div>
              <p style={{ fontFamily: serif, fontSize: '1.2rem', fontWeight: 400, color: textHi }}>{d.titre || 'Pièce recherchée'}</p>
              {d.description && (
                <p style={{ fontFamily: sans, fontSize: '11px', color: textLo, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.description}</p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: sans, fontSize: '10px', color: textLo, paddingTop: '4px', borderTop: `.5px solid ${border}` }}>
                <span>{d.budget_min && d.budget_max ? `${d.budget_min}–${d.budget_max} €` : 'Budget flexible'}</span>
                <span>{d.localisation || 'Localisation libre'}</span>
              </div>
              <button onClick={() => handleProposer(d.id)} disabled={proposingId === d.id}
                style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#0E0E0D', background: proposingId === d.id ? '#444' : gold, padding: '12px 0', border: 'none', cursor: proposingId === d.id ? 'default' : 'pointer', marginTop: '6px', transition: 'background .2s' }}
                onMouseEnter={e => { if (proposingId !== d.id) e.currentTarget.style.background = '#E8C96A'; }}
                onMouseLeave={e => { if (proposingId !== d.id) e.currentTarget.style.background = gold; }}
              >{proposingId === d.id ? 'Envoi…' : 'Proposer'}</button>
            </div>
          ))}
        </div>
      )}
    </ShopperLayout>
  );
}