import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";

const Logo = ({ to }) => {
  const inner = (
    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>
      HENERIS<span style={{ color: '#C9A84C' }}>.</span>
    </span>
  );
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{inner}</Link> : <span>{inner}</span>;
};

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const MENU_LINKS = [
  { label: 'Accueil',           to: '/' },
  { label: 'Catégories',        to: '/catalogue' },
  { label: 'Vitrine Shoppers',  to: '/personal-shoppers' },
  { label: 'Comment ça marche', to: '/how-it-works' },
  { label: 'Avis clients',      to: '/avis' },
  { label: 'Confiance',         to: '/confiance' },
];

const VERIFICATION = [
  "Vérification d'identité officielle",
  "Examen de l'expertise dans le luxe",
  "Vérification des réseaux sociaux et du parcours",
  "Validation manuelle par l'équipe Heneris",
];

const AUTHENTICITE = [
  "Preuve d'achat exigée à chaque transaction",
  "Certificat d'authenticité quand disponible",
  "Vérification par l'équipe Heneris en cas de litige",
];

export default function Confiance() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [role, setRole]               = useState(null);
  const [user, setUser]               = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navVisible, setNavVisible]   = useState(true);
  const profileRef = useRef(null);
  const lastScroll = useRef(0);

  useEffect(() => {
    const getRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);
      const metaRole = session.user.user_metadata?.role;
      if (metaRole) { setRole(metaRole); return; }
      const { data: p } = await supabase.from('profiles').select('role').eq('user_id', session.user.id).single();
      if (p?.role) setRole(p.role);
    };
    getRole();
  }, []);

  useEffect(() => {
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const c = window.scrollY;
      if (c <= 10) setNavVisible(true);
      else if (c > lastScroll.current + 5) setNavVisible(false);
      else if (c < lastScroll.current - 5) setNavVisible(true);
      lastScroll.current = c;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setRole(null); setProfileOpen(false);
    window.location.href = '/#/';
  };

  const firstName = user?.user_metadata?.first_name || '';
  const lastName  = user?.user_metadata?.last_name  || '';
  const initials  = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() : null;
  const dashLink  = role === 'shopper' ? '/shopper/home' : role === 'client' ? '/client/home' : role === 'admin' ? '/admin/dashboard' : '/login';
  const demandeTo = role === 'client' ? '/deposer-demande' : '/login';

  const menuItems = role === 'shopper' ? [
    { label: 'Mon profil', to: '/shopper/profil' }, { label: 'Mes gains', to: '/shopper/gains' },
  ] : role === 'client' ? [
    { label: 'Mon profil', to: '/client/profil' }, { label: 'Mes demandes', to: '/client/suivi' },
  ] : [];

  return (
    <div style={{ background: '#fff', fontFamily: sans, minHeight: '100vh' }}>

      {/* ── DRAWER ── */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '340px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '32px 40px 28px', borderBottom: '.5px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Logo />
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <nav style={{ flex: 1, padding: '16px 0' }}>
              {MENU_LINKS.map(({ label, to }) => (
                <Link key={label} to={to} onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', padding: '18px 40px', fontFamily: serif, fontSize: '1.5rem', fontWeight: 300, fontStyle: 'italic', color: to === '/confiance' ? '#C9A84C' : '#1a1a1a', textDecoration: 'none', borderBottom: '.5px solid #f8f8f8' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = to === '/confiance' ? '#C9A84C' : '#1a1a1a'}
                >{label}</Link>
              ))}
            </nav>
            <div style={{ padding: '28px 40px', borderTop: '.5px solid #f0f0f0' }}>
              <Link to={demandeTo} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', textAlign: 'center', fontFamily: sans, fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#fff', background: '#C9A84C', padding: '15px 0', textDecoration: 'none' }}
              >Déposer une demande</Link>
            </div>
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 40px', height: '70px', background: '#fff', position: 'fixed', top: navVisible ? '0' : '-70px', left: 0, right: 0, zIndex: 1000, borderBottom: '.5px solid #f0f0f0', transition: 'top .3s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <span style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#999', fontWeight: 300 }}>Menu</span>
          </button>
        </div>
        <Logo to="/" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end' }}>
          <Link to={demandeTo}
            style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#fff', background: '#C9A84C', padding: '10px 22px', textDecoration: 'none', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#b8922e'}
            onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
          >Déposer une demande</Link>
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button onClick={() => setProfileOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#666' }}>
              {initials
                ? <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1a1a1a', color: '#C9A84C', fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials}</span>
                : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              }
            </button>
            {profileOpen && (
              <div style={{ position: 'absolute', top: '48px', right: 0, width: '220px', background: '#fff', border: '.5px solid #ececec', boxShadow: '0 8px 32px rgba(0,0,0,.08)', zIndex: 200 }}>
                {initials ? (
                  <>
                    <div style={{ padding: '14px 18px', borderBottom: '.5px solid #ececec' }}>
                      <p style={{ fontFamily: sans, fontSize: '12px', fontWeight: 500, color: '#1a1a1a', marginBottom: '2px' }}>{firstName} {lastName}</p>
                      <p style={{ fontFamily: sans, fontSize: '10px', color: '#aaa' }}>{user?.email}</p>
                    </div>
                    <div style={{ padding: '6px 0' }}>
                      {menuItems.map(({ label, to }) => (
                        <a key={label} href={`/#${to}`} onClick={() => setProfileOpen(false)}
                          style={{ display: 'block', padding: '10px 18px', fontFamily: sans, fontSize: '11px', fontWeight: 300, color: '#1a1a1a', textDecoration: 'none' }}
                        >{label}</a>
                      ))}
                      <Link to={dashLink} onClick={() => setProfileOpen(false)}
                        style={{ display: 'block', padding: '10px 18px', fontFamily: sans, fontSize: '11px', fontWeight: 300, color: '#1a1a1a', textDecoration: 'none' }}
                      >Mon espace</Link>
                    </div>
                    <div style={{ borderTop: '.5px solid #ececec', padding: '6px 0' }}>
                      <button onClick={handleLogout}
                        style={{ display: 'block', width: '100%', padding: '10px 18px', fontFamily: sans, fontSize: '11px', fontWeight: 300, color: '#999', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                      >Se déconnecter</button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '8px 0' }}>
                    {[['Se connecter', '/login', 400], ['Créer un compte client', '/register/client', 300], ['Devenir shopper', '/register/shopper', 300]].map(([l, t, w], i) => (
                      <Link key={l} to={t} onClick={() => setProfileOpen(false)}
                        style={{ display: 'block', padding: '12px 18px', fontFamily: sans, fontSize: '11px', fontWeight: w, color: w === 400 ? '#1a1a1a' : '#666', textDecoration: 'none', borderTop: i === 2 ? '.5px solid #f5f5f5' : 'none' }}
                      >{l}</Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div style={{ padding: '150px 48px 70px', borderBottom: '.5px solid #ececec', boxSizing: 'border-box' }}>
        <h1 style={{ fontFamily: serif, fontSize: '3.6rem', fontWeight: 300, fontStyle: 'italic', color: '#1a1a1a', marginBottom: '14px' }}>
          Notre modèle de confiance
        </h1>
        <p style={{ fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', color: '#aaa', fontWeight: 300 }}>
          Pourquoi Heneris est différent.
        </p>
      </div>

      {/* ── NOTRE MODÈLE ── */}
      <div style={{ padding: '70px 48px', borderBottom: '.5px solid #ececec', boxSizing: 'border-box', maxWidth: '760px' }}>
        <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>Notre modèle</p>
        <p style={{ fontFamily: serif, fontSize: '1.4rem', fontStyle: 'italic', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.7 }}>
          Heneris n'est pas un revendeur. Nous connectons des clients exigeants à des experts en sourcing indépendants et vérifiés.
        </p>
      </div>

      {/* ── VÉRIFICATION DES SHOPPERS ── */}
      <div style={{ padding: '70px 48px', background: '#fafaf8', borderBottom: '.5px solid #ececec', boxSizing: 'border-box' }}>
        <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>Vérification des shoppers</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px', maxWidth: '760px' }}>
          {VERIFICATION.map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Check />
              <p style={{ fontFamily: sans, fontSize: '13px', color: '#333', fontWeight: 300, lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── GARANTIE D'AUTHENTICITÉ ── */}
      <div style={{ padding: '70px 48px', borderBottom: '.5px solid #ececec', boxSizing: 'border-box' }}>
        <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>Garantie d'authenticité</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '600px' }}>
          {AUTHENTICITE.map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Check />
              <p style={{ fontFamily: sans, fontSize: '13px', color: '#333', fontWeight: 300, lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SÉCURITÉ DES PAIEMENTS ── */}
      <div style={{ padding: '70px 48px', background: '#fafaf8', borderBottom: '.5px solid #ececec', boxSizing: 'border-box', maxWidth: '760px' }}>
        <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>Sécurité des paiements</p>
        <p style={{ fontFamily: serif, fontSize: '1.15rem', fontStyle: 'italic', fontWeight: 300, color: '#444', lineHeight: 1.9 }}>
          Chaque paiement est sécurisé par un système d'escrow. Les fonds sont bloqués jusqu'à confirmation de réception de votre article, garantissant une protection totale de votre achat.
        </p>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '70px 48px', textAlign: 'center', boxSizing: 'border-box' }}>
        <Link to={demandeTo}
          style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#fff', background: '#C9A84C', padding: '16px 48px', textDecoration: 'none', display: 'inline-block', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#b8922e'}
          onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
        >Déposer une demande</Link>
      </div>

      <Footer />
    </div>
  );
}