import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShopperLayout, { palette } from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";
const { cardBg, cardAlt, ink, inkSoft, hairline, gold } = palette;

/* ─────────────────────────────────────────────────────────────
   Schéma Supabase réel (vérifié) :
   profiles         : id, user_id, role, prenom, nom, email, created_at
   shopper_profiles : id, user_id, bio, specialites (ARRAY), marques (ARRAY),
                      commission_rate, is_certified, rating, nb_transactions, created_at
   demandes         : id, client_id, categorie, description, budget_min, budget_max,
                      delai (texte libre), statut, created_at, shopper_id
   Pas de colonnes titre/urgence/deadline/montant_final/updated_at/etape sur
   demandes — le pipeline par étape et les gains réels resteront à 0 tant que
   ces colonnes n'auront pas été ajoutées côté base. Tout le reste de cette
   page (clients, taux de réussite, clients récurrents) est calculé à partir
   des colonnes réelles existantes.
───────────────────────────────────────────────────────────── */

const PIPELINE_STAGES = [
  { key: 'sourcing',            label: 'Recherche' },
  { key: 'proposition_envoyee', label: 'Proposition' },
  { key: 'attente_validation',  label: 'Validation' },
];

const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const diffDays = Math.floor((new Date() - new Date(dateStr)) / 864e5);
  if (diffDays <= 0) return "aujourd'hui";
  if (diffDays === 1) return 'il y a 1 jour';
  return `il y a ${diffDays} jours`;
};

const KpiCard = ({ label, value, suffix, hero }) => (
  <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '22px 22px 20px', flex: 1, minWidth: '160px' }}>
    <p style={{ fontFamily: serif, fontSize: '2.3rem', fontWeight: 300, fontStyle: 'italic', color: hero ? gold : ink, lineHeight: 1, marginBottom: '10px' }}>
      {value}{suffix && <span style={{ fontFamily: sans, fontSize: '.8rem', fontStyle: 'normal', color: inkSoft, marginLeft: '4px' }}>{suffix}</span>}
    </p>
    <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft }}>{label}</p>
  </div>
);

const SectionTitle = ({ children, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px' }}>
    <h2 style={{ fontFamily: serif, fontSize: '1.3rem', fontWeight: 400, fontStyle: 'italic', color: ink }}>{children}</h2>
    {action}
  </div>
);

const QuickAction = ({ to, children }) => (
  <Link to={to} style={{
    fontFamily: sans, fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: ink,
    background: cardBg, border: `1px solid ${hairline}`, padding: '12px 20px', textDecoration: 'none',
    display: 'flex', alignItems: 'center', gap: '8px',
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = gold; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = hairline; }}
  >{children}</Link>
);

export default function ShopperHome() {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [kpis, setKpis] = useState({ clients: 0, pending: 0, revenue: 0, conversion: 0 });
  const [priority, setPriority] = useState([]);
  const [pipeline, setPipeline] = useState({});
  const [enCoursTotal, setEnCoursTotal] = useState(0);
  const [clients, setClients] = useState([]);
  const [activity, setActivity] = useState([]);
  const [earnings, setEarnings] = useState({ weekly: [0, 0, 0, 0, 0, 0, 0], pending: 0, available: 0, lifetime: 0 });
  const [reputation, setReputation] = useState({ rating: null, certified: false, transactions: 0, successRate: 0, repeatClients: 0 });

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const user = session.user;
      setFirstName(user.user_metadata?.first_name || '');

      try {
        const { data: profile } = await supabase.from('profiles').select('prenom, nom').eq('user_id', user.id).single();
        const { data: shopperProfile } = await supabase.from('shopper_profiles').select('*').eq('user_id', user.id).single();
        const specialites = shopperProfile?.specialites || [];
        if (profile?.prenom) setFirstName(profile.prenom);

        const [{ data: ouvertes }, { data: enCours }, { data: terminees }] = await Promise.all([
          specialites.length
            ? supabase.from('demandes').select('*').eq('statut', 'ouverte').in('categorie', specialites)
            : Promise.resolve({ data: [] }),
          supabase.from('demandes').select('*').eq('shopper_id', user.id).eq('statut', 'en_cours'),
          supabase.from('demandes').select('*').eq('shopper_id', user.id).eq('statut', 'terminee'),
        ]);

        const now = new Date();
        const revenueMonth = (terminees || []).filter(d => {
          const dt = d.created_at ? new Date(d.created_at) : null;
          return dt && dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
        }).reduce((s, d) => s + (Number(d.montant_final) || 0), 0);

        const allMissions = [...(enCours || []), ...(terminees || [])];
        const uniqueClients = [...new Set(allMissions.map(d => d.client_id).filter(Boolean))];
        const conversion = allMissions.length ? Math.round(((terminees || []).length / allMissions.length) * 100) : 0;

        setKpis({
          clients: uniqueClients.length,
          pending: (ouvertes || []).length,
          revenue: revenueMonth,
          conversion,
        });
        setEnCoursTotal((enCours || []).length);

        // Demandes prioritaires : les plus récentes (pas de colonne urgence/deadline en base actuellement)
        setPriority((ouvertes || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4));

        // Pipeline des missions actives (en attente de la colonne "etape" côté base)
        const stages = {};
        PIPELINE_STAGES.forEach(s => { stages[s.key] = 0; });
        (enCours || []).forEach(d => { if (stages[d.etape] !== undefined) stages[d.etape]++; });
        setPipeline(stages);

        // Carnet clients : agrégation à partir des missions réelles
        if (uniqueClients.length) {
          const { data: clientProfiles } = await supabase.from('profiles').select('user_id, prenom, nom').in('user_id', uniqueClients);
          const book = uniqueClients.slice(0, 4).map(clientId => {
            const cp = (clientProfiles || []).find(c => c.user_id === clientId);
            const clientMissions = allMissions.filter(d => d.client_id === clientId);
            const avgBudget = clientMissions.length
              ? clientMissions.reduce((s, d) => s + ((Number(d.budget_min) + Number(d.budget_max)) / 2 || 0), 0) / clientMissions.length
              : 0;
            const last = clientMissions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
            return {
              id: clientId,
              name: cp ? `${cp.prenom || ''} ${cp.nom || ''}`.trim() : 'Client',
              brands: [],
              avgBudget,
              missionsCount: clientMissions.length,
              lastDate: last?.created_at,
            };
          });
          setClients(book);

          const repeatClients = uniqueClients.filter(id => allMissions.filter(d => d.client_id === id).length > 1).length;
          setReputation(prev => ({ ...prev, successRate: conversion, repeatClients }));
        }

        // Activité récente
        const { data: feed } = await supabase.from('activity_log').select('*').eq('shopper_id', user.id).order('created_at', { ascending: false }).limit(5);
        setActivity(feed || []);

        // Gains (en attente du suivi financier côté base)
        const lifetime = (terminees || []).reduce((s, d) => s + (Number(d.montant_final) || 0), 0);
        const pending = (terminees || []).filter(d => !d.date_versement).reduce((s, d) => s + (Number(d.montant_final) || 0), 0);
        setEarnings({ weekly: [0, 0, 0, 0, 0, 0, 0], pending, available: lifetime - pending, lifetime });

        setReputation(prev => ({
          ...prev,
          rating: shopperProfile?.rating ?? null,
          certified: shopperProfile?.is_certified ?? false,
          transactions: shopperProfile?.nb_transactions ?? (terminees || []).length,
        }));
      } catch (err) {
        console.error('Erreur chargement dashboard shopper :', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <ShopperLayout>

      {/* ─── 1. Bienvenue + résumé vivant ─── */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: serif, fontSize: '2.3rem', fontWeight: 300, fontStyle: 'italic', color: ink, marginBottom: '14px' }}>
          {firstName ? `Bonjour, ${firstName}. Votre bureau privé est actif.` : 'Votre bureau privé est actif.'}
        </h1>
        {!loading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', fontFamily: sans, fontSize: '12.5px', color: inkSoft }}>
            <span><strong style={{ color: ink, fontWeight: 600 }}>{kpis.clients}</strong> client{kpis.clients === 1 ? '' : 's'} actif{kpis.clients === 1 ? '' : 's'}</span>
            <span style={{ color: hairline }}>·</span>
            <span><strong style={{ color: ink, fontWeight: 600 }}>{kpis.pending}</strong> demande{kpis.pending === 1 ? '' : 's'} à traiter</span>
            <span style={{ color: hairline }}>·</span>
            <span><strong style={{ color: ink, fontWeight: 600 }}>{enCoursTotal}</strong> mission{enCoursTotal === 1 ? '' : 's'} en cours</span>
          </div>
        )}
      </div>

      {/* ─── Quick actions ─── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '44px' }}>
        <QuickAction to="/shopper/demandes">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          Nouvelle recherche
        </QuickAction>
        <QuickAction to="/shopper/clients">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75" /></svg>
          Ajouter un client
        </QuickAction>
        <QuickAction to="/shopper/profil">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
          Disponibilité
        </QuickAction>
        <QuickAction to="/shopper/vitrine">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9" /><path d="M2 15h20l-2 5H4z" /></svg>
          Publier un article
        </QuickAction>
      </div>

      {/* ─── 2. KPIs (chiffre en premier) ─── */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '48px' }}>
        <KpiCard label="Clients actifs" value={loading ? '—' : kpis.clients} />
        <KpiCard label="Demandes en attente" value={loading ? '—' : kpis.pending} />
        <KpiCard label="Chiffre d'affaires du mois" value={loading ? '—' : kpis.revenue.toLocaleString('fr-FR')} suffix="€" hero />
        <KpiCard label="Taux de conversion" value={loading ? '—' : kpis.conversion} suffix="%" />
      </div>

      {/* ─── 3. Demandes prioritaires ─── */}
      <div style={{ marginBottom: '48px' }}>
        <SectionTitle action={<Link to="/shopper/demandes" style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, textDecoration: 'none', borderBottom: `1px solid ${hairline}` }}>Tout voir →</Link>}>
          Demandes clients urgentes
        </SectionTitle>
        {loading ? (
          <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Chargement…</p>
        ) : priority.length === 0 ? (
          <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.6"><path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
            <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft, fontSize: '.95rem' }}>Aucune demande urgente. Votre bureau est libre.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {priority.map(d => (
              <div key={d.id} style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: gold }}>{d.categorie}</span>
                  <span style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#FFFFFF', background: ink, padding: '3px 8px' }}>NOUVEAU</span>
                </div>
                <p style={{ fontFamily: serif, fontSize: '1.1rem', color: ink, marginBottom: '12px' }}>{d.description ? d.description.slice(0, 60) : 'Pièce recherchée'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: sans, fontSize: '10.5px', color: inkSoft, marginBottom: '14px' }}>
                  <span>Budget : {d.budget_max ? `€${d.budget_max}` : 'Flexible'}</span>
                  {d.delai && <span>Délai : {d.delai}</span>}
                </div>
                <Link to={`/shopper/demande/${d.id}`}
                  style={{ display: 'block', textAlign: 'center', fontFamily: sans, fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: ink, border: `1px solid ${ink}`, padding: '10px 0', textDecoration: 'none' }}
                >Ouvrir</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 4. Missions en cours (pipeline compact, cliquable) ─── */}
      <div style={{ marginBottom: '48px' }}>
        <SectionTitle>{enCoursTotal} mission{enCoursTotal === 1 ? '' : 's'} active{enCoursTotal === 1 ? '' : 's'}</SectionTitle>
        <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {PIPELINE_STAGES.map(s => (
            <Link key={s.key} to="/shopper/commandes"
              style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '16px 12px', textDecoration: 'none', background: pipeline[s.key] > 0 ? '#FBF8F3' : 'transparent', transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FBF8F3'}
              onMouseLeave={e => e.currentTarget.style.background = pipeline[s.key] > 0 ? '#FBF8F3' : 'transparent'}
            >
              <p style={{ fontFamily: sans, fontSize: '11px', color: ink }}>
                {s.label} <span style={{ color: gold, fontWeight: 600 }}>({loading ? '—' : pipeline[s.key]})</span>
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px', marginBottom: '48px' }}>

        {/* ─── 5. Carnet clients enrichi ─── */}
        <div>
          <SectionTitle action={<Link to="/shopper/clients" style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, textDecoration: 'none', borderBottom: `1px solid ${hairline}` }}>Tout voir →</Link>}>
            Vos clients
          </SectionTitle>
          {loading ? (
            <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Chargement…</p>
          ) : clients.length === 0 ? (
            <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '28px', textAlign: 'center' }}>
              <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Votre carnet clients se remplira au fil de vos missions.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {clients.map(c => (
                <div key={c.id} style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '16px 20px' }}>
                  <p style={{ fontFamily: serif, fontSize: '1.05rem', color: ink, marginBottom: '4px' }}>{c.name}</p>
                  <p style={{ fontFamily: sans, fontSize: '10px', color: inkSoft }}>
                    {c.brands.length ? `Préfère ${c.brands.join(' / ')}` : 'Préférences à renseigner'}
                    {' · '}Budget moyen : €{Math.round(c.avgBudget).toLocaleString('fr-FR')}
                    {' · '}Dernière demande : {timeAgo(c.lastDate)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── 6. Activité récente ─── */}
        <div>
          <SectionTitle>Activité récente</SectionTitle>
          {loading ? (
            <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Chargement…</p>
          ) : activity.length === 0 ? (
            <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '28px', textAlign: 'center' }}>
              <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft, fontSize: '.95rem' }}>Rien pour l'instant — votre activité apparaîtra ici.</p>
            </div>
          ) : (
            <div style={{ background: cardBg, border: `1px solid ${hairline}` }}>
              {activity.map((item, i) => (
                <div key={item.id} style={{ padding: '14px 18px', borderBottom: i < activity.length - 1 ? `1px solid ${hairline}` : 'none' }}>
                  <p style={{ fontFamily: sans, fontSize: '12px', color: ink, marginBottom: '2px' }}>{item.message}</p>
                  <p style={{ fontFamily: sans, fontSize: '9.5px', color: inkSoft }}>{new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px' }}>

        {/* ─── 7. Aperçu des gains ─── */}
        <div>
          <SectionTitle action={<Link to="/shopper/gains" style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, textDecoration: 'none', borderBottom: `1px solid ${hairline}` }}>Détail complet →</Link>}>
            Aperçu des gains
          </SectionTitle>
          <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '64px', marginBottom: '20px' }}>
              {earnings.weekly.map((v, i) => {
                const max = Math.max(...earnings.weekly, 1);
                return <div key={i} style={{ flex: 1, height: `${Math.max(4, (v / max) * 100)}%`, background: i === earnings.weekly.length - 1 ? gold : '#EDE6D8' }} />;
              })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', borderTop: `1px solid ${hairline}`, paddingTop: '16px' }}>
              <div>
                <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '4px' }}>En attente</p>
                <p style={{ fontFamily: serif, fontSize: '1.1rem', color: ink }}>€{loading ? '—' : earnings.pending.toLocaleString('fr-FR')}</p>
              </div>
              <div>
                <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '4px' }}>Disponible</p>
                <p style={{ fontFamily: serif, fontSize: '1.1rem', color: ink }}>€{loading ? '—' : earnings.available.toLocaleString('fr-FR')}</p>
              </div>
              <div>
                <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '4px' }}>Cumulés</p>
                <p style={{ fontFamily: serif, fontSize: '1.1rem', color: gold }}>€{loading ? '—' : earnings.lifetime.toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 8. Réputation ─── */}
        <div>
          <SectionTitle>Réputation</SectionTitle>
          <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '24px 26px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '6px' }}>Note moyenne</p>
              <p style={{ fontFamily: serif, fontSize: '1.4rem', fontStyle: 'italic', color: gold }}>{reputation.rating ? `★ ${reputation.rating.toFixed(1)}` : '—'}</p>
            </div>
            <div>
              <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '6px' }}>Taux de réussite</p>
              <p style={{ fontFamily: serif, fontSize: '1.4rem', fontStyle: 'italic', color: ink }}>{reputation.successRate}%</p>
            </div>
            <div>
              <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '6px' }}>Clients récurrents</p>
              <p style={{ fontFamily: serif, fontSize: '1.4rem', fontStyle: 'italic', color: ink }}>{reputation.repeatClients}</p>
            </div>
            <div>
              <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft, marginBottom: '6px' }}>Statut</p>
              <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', color: reputation.certified ? gold : inkSoft }}>{reputation.certified ? 'Certifié' : 'En attente'}</p>
            </div>
          </div>
        </div>
      </div>
    </ShopperLayout>
  );
}