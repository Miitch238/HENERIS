import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";

/* ─── Palette "Luxury minimal" — espace shopper ───
   Ivoire / noir / or doux / gris pierre. */
export const palette = {
  pageBg:    '#F6F2EC',
  cardBg:    '#FFFFFF',
  cardAlt:   '#F0EAE0',
  ink:       '#1B1A18',
  inkSoft:   '#6E675D',
  hairline:  '#E2DACB',
  gold:      '#C9A84C',
};
const { pageBg, cardBg, ink, inkSoft, hairline, gold } = palette;

const NAV_ITEMS = [
  { label: 'Tableau de bord', to: '/shopper/home' },
  { label: 'Vitrine',         to: '/shopper/vitrine' },
  { label: 'Demandes',        to: '/shopper/demandes' },
  { label: 'Clients',         to: '/shopper/clients' },
  { label: 'Commandes',       to: '/shopper/commandes' },
  { label: 'Gains',           to: '/shopper/gains' },
  { label: 'Messagerie',      to: '/shopper/messages' },
];

export default function ShopperLayout({ children, fullWidth }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [statut, setStatut] = useState('disponible');
  const profileRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/#/';
  };

  const toggleStatut = async () => {
    const next = statut === 'disponible' ? 'occupe' : 'disponible';
    setStatut(next);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await supabase.from('profiles').update({ statut_dispo: next }).eq('user_id', session.user.id);
    } catch (err) {
      console.error('Erreur mise à jour du statut :', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: sans }}>

      {/* ═══ TOP BAR ═══ */}
      <header style={{ height: '72px', background: cardBg, borderBottom: `1px solid ${hairline}`, position: 'sticky', top: 0, zIndex: 100, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 40px' }}>

        <Link to="/shopper/home" style={{ textDecoration: 'none', justifySelf: 'start' }}>
          <span translate="no" className="notranslate" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700, color: ink }}>
            HENERIS<span style={{ color: gold }}>.</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '4px' }}>
          {NAV_ITEMS.map(({ label, to }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}
                style={{
                  fontFamily: sans, fontSize: '11.5px', fontWeight: active ? 500 : 400, letterSpacing: '.02em',
                  color: active ? ink : inkSoft, textDecoration: 'none', padding: '10px 16px',
                  borderBottom: active ? `1.5px solid ${gold}` : '1.5px solid transparent',
                  transition: 'color .15s, border-color .15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = ink; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = inkSoft; }}
              >{label}</Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', justifySelf: 'end' }}>
          <button onClick={toggleStatut}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', fontFamily: sans, fontSize: '10.5px', letterSpacing: '.04em', color: ink, background: 'none', border: `1px solid ${hairline}`, padding: '7px 14px', cursor: 'pointer', borderRadius: '20px' }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: statut === 'disponible' ? '#5FA87A' : '#C2645A', display: 'inline-block' }} />
            {statut === 'disponible' ? 'Disponible' : 'Occupé'}
          </button>

          <Link to="/shopper/notifications" style={{ color: ink, display: 'flex' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          </Link>

          <div ref={profileRef} style={{ position: 'relative' }}>
            <button onClick={() => setProfileOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0EAE0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: inkSoft }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </span>
            </button>
            {profileOpen && (
              <div style={{ position: 'absolute', top: '44px', right: 0, width: '200px', background: cardBg, border: `1px solid ${hairline}`, boxShadow: '0 12px 32px rgba(0,0,0,.06)', zIndex: 200 }}>
                <Link to="/shopper/profil" onClick={() => setProfileOpen(false)}
                  style={{ display: 'block', padding: '13px 18px', fontFamily: sans, fontSize: '12px', color: ink, textDecoration: 'none', borderBottom: `1px solid ${hairline}` }}
                >Mon profil</Link>
                <button onClick={handleLogout}
                  style={{ display: 'block', width: '100%', padding: '13px 18px', fontFamily: sans, fontSize: '12px', color: inkSoft, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                >Se déconnecter</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══ CONTENU ═══ */}
      <main style={{ maxWidth: fullWidth ? 'none' : '1160px', margin: '0 auto', padding: '48px 40px 96px', boxSizing: 'border-box' }}>
        {children}
      </main>
    </div>
  );
}