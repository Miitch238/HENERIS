import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout, { palette } from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";
const { cardBg, cardAlt, ink, inkSoft, hairline, gold } = palette;

/* Schéma Supabase réel (vérifié) :
   demandes : id, categorie, description, client_id, budget_min, budget_max,
              delai, statut, created_at
   profiles : user_id, prenom, nom
   Pas de colonnes titre/montant_final/updated_at sur demandes, ni
   marques_preferees/budget_moyen sur profiles — le total dépensé est donc
   estimé à partir du budget moyen indiqué par le client sur chaque demande. */

export default function ShopperClients() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      try {
        const { data: missions } = await supabase
          .from('demandes')
          .select('*')
          .eq('shopper_id', session.user.id)
          .in('statut', ['en_cours', 'terminee']);

        const uniqueIds = [...new Set((missions || []).map(d => d.client_id).filter(Boolean))];
        if (!uniqueIds.length) { setClients([]); setLoading(false); return; }

        const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', uniqueIds);

        const book = uniqueIds.map(id => {
          const cp = (profiles || []).find(p => p.user_id === id);
          const clientMissions = (missions || []).filter(d => d.client_id === id);
          const totalSpent = clientMissions.reduce((s, d) => s + ((Number(d.budget_min) + Number(d.budget_max)) / 2 || 0), 0);
          const last = clientMissions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
          return {
            id,
            name: cp ? `${cp.prenom || ''} ${cp.nom || ''}`.trim() : 'Client',
            brands: [],
            totalSpent,
            missionsCount: clientMissions.length,
            lastRequest: last?.description?.slice(0, 40) || '—',
          };
        }).sort((a, b) => b.totalSpent - a.totalSpent);

        setClients(book);
      } catch (err) {
        console.error('Erreur chargement carnet clients :', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <ShopperLayout fullWidth>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: serif, fontSize: '2.2rem', fontWeight: 300, fontStyle: 'italic', color: ink, marginBottom: '8px' }}>Vos clients</h1>
        <p style={{ fontFamily: sans, fontSize: '13px', color: inkSoft }}>Votre carnet privé — préférences, historique et budgets de chaque client.</p>
        <div style={{ width: '36px', height: '1px', background: gold, margin: '20px 0 28px' }} />

        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client…"
          style={{ fontFamily: sans, fontSize: '12px', padding: '12px 16px', border: `1px solid ${hairline}`, width: '280px', marginBottom: '28px', background: cardBg, color: ink }}
        />

        {loading ? (
          <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Chargement…</p>
        ) : filtered.length === 0 ? (
          <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '48px', textAlign: 'center' }}>
            <p style={{ fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', color: inkSoft }}>
              {clients.length === 0 ? 'Votre carnet clients se remplira au fil de vos missions.' : 'Aucun client ne correspond à cette recherche.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filtered.map(c => (
              <div key={c.id} style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '24px 26px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <span style={{ width: '44px', height: '44px', borderRadius: '50%', background: cardAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', color: inkSoft, flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  <div>
                    <p style={{ fontFamily: serif, fontSize: '1.2rem', color: ink }}>{c.name}</p>
                    <p style={{ fontFamily: sans, fontSize: '10px', color: inkSoft }}>{c.missionsCount} mission{c.missionsCount === 1 ? '' : 's'}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.12em', textTransform: 'uppercase', color: inkSoft, marginBottom: '6px' }}>Marques préférées</p>
                  {c.brands.length ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {c.brands.map(b => (
                        <span key={b} style={{ fontFamily: sans, fontSize: '9.5px', color: ink, border: `1px solid ${hairline}`, padding: '4px 10px' }}>{b}</span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '.9rem', color: inkSoft }}>Aucune préférence renseignée</p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: `1px solid ${hairline}`, paddingTop: '16px' }}>
                  <div>
                    <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '4px' }}>Budget estimé</p>
                    <p style={{ fontFamily: serif, fontSize: '1.15rem', color: gold }}>€{c.totalSpent.toLocaleString('fr-FR')}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '4px' }}>Dernière demande</p>
                    <p style={{ fontFamily: sans, fontSize: '11.5px', color: ink }}>{c.lastRequest}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ShopperLayout>
  );
}