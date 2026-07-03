import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout, { palette } from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";
const { cardBg, cardAlt, ink, inkSoft, hairline, gold } = palette;

// Icônes simples par type de notification — fallback générique si le type est inconnu.
const ICONS = {
  demande: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  paiement: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
  message: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>,
  validation: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M20 6 9 17l-5-5" /></svg>,
  defaut: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  const j = Math.floor(h / 24);
  if (j < 7) return `${j} j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function ShopperNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('toutes'); // 'toutes' | 'non_lues'

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setLoading(false); return; }
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        if (!error && data) setNotifications(data);
      } catch (err) {
        // Table probablement pas encore créée côté Supabase — état vide géré gracieusement.
        console.error('Notifications indisponibles :', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
    try {
      await supabase.from('notifications').update({ lu: true }).eq('id', id);
    } catch (err) {
      console.error('Erreur marquage lu :', err);
    }
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.lu).map(n => n.id);
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
    try {
      if (unreadIds.length) await supabase.from('notifications').update({ lu: true }).in('id', unreadIds);
    } catch (err) {
      console.error('Erreur marquage global :', err);
    }
  };

  const visibles = filter === 'non_lues' ? notifications.filter(n => !n.lu) : notifications;
  const nbNonLues = notifications.filter(n => !n.lu).length;

  return (
    <ShopperLayout>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontFamily: serif, fontSize: '2.1rem', fontStyle: 'italic', fontWeight: 300, color: ink, margin: 0 }}>Notifications</h1>
        {nbNonLues > 0 && (
          <button onClick={markAllRead}
            style={{ fontFamily: sans, fontSize: '11.5px', color: gold, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.02em' }}
          >Tout marquer comme lu</button>
        )}
      </div>
      <p style={{ fontFamily: sans, fontSize: '13px', color: inkSoft, marginBottom: '32px' }}>
        {nbNonLues > 0 ? `${nbNonLues} notification${nbNonLues > 1 ? 's' : ''} non lue${nbNonLues > 1 ? 's' : ''}.` : 'Vous êtes à jour.'}
      </p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
        {[['toutes', 'Toutes'], ['non_lues', 'Non lues']].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{
              fontFamily: sans, fontSize: '11.5px', letterSpacing: '.02em', padding: '8px 16px', cursor: 'pointer',
              background: filter === key ? ink : 'transparent', color: filter === key ? '#fff' : inkSoft,
              border: `1px solid ${filter === key ? ink : hairline}`, borderRadius: '20px', transition: 'all .15s',
            }}
          >{label}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ fontFamily: sans, fontSize: '13px', color: inkSoft }}>Chargement…</p>
      ) : visibles.length === 0 ? (
        <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '64px 32px', textAlign: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={hairline} strokeWidth="1.3" style={{ margin: '0 auto 18px' }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <p style={{ fontFamily: serif, fontSize: '1.15rem', fontStyle: 'italic', color: ink, marginBottom: '6px' }}>
            {filter === 'non_lues' ? 'Aucune notification non lue.' : 'Aucune notification pour l\u2019instant.'}
          </p>
          <p style={{ fontFamily: sans, fontSize: '12px', color: inkSoft }}>
            Vous serez prévenu ici pour chaque nouvelle demande, message ou paiement.
          </p>
        </div>
      ) : (
        <div style={{ background: cardBg, border: `1px solid ${hairline}` }}>
          {visibles.map((n, i) => {
            const Icon = ICONS[n.type] || ICONS.defaut;
            return (
              <div key={n.id} onClick={() => !n.lu && markAsRead(n.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px 24px',
                  borderBottom: i < visibles.length - 1 ? `1px solid ${hairline}` : 'none',
                  background: n.lu ? 'transparent' : cardAlt, cursor: n.lu ? 'default' : 'pointer', transition: 'background .15s',
                }}
              >
                <span style={{ width: '34px', height: '34px', borderRadius: '50%', background: n.lu ? '#F0EAE0' : '#fff', border: `1px solid ${hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {Icon(n.lu ? inkSoft : gold)}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: sans, fontSize: '13px', color: ink, fontWeight: n.lu ? 400 : 500, lineHeight: 1.5, marginBottom: '4px' }}>{n.message}</p>
                  <p style={{ fontFamily: sans, fontSize: '11px', color: inkSoft }}>{timeAgo(n.created_at)}</p>
                </div>
                {!n.lu && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: gold, flexShrink: 0, marginTop: '6px' }} />}
              </div>
            );
          })}
        </div>
      )}
    </ShopperLayout>
  );
}