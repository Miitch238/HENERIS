import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SearchOverlay from '../components/SearchOverlay';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";

const CATEGORIES_BAR = [
  'Tout', 'Maroquinerie', 'Horlogerie', 'Joaillerie', 'Mode', 'Chaussures', 'Accessoires', 'Vintage', 'Collection', 'Art de vivre',
];
const FEMME = [
  { label: 'Sacs & Maroquinerie',    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=90' },
  { label: 'Bijoux & Montres',       img: 'https://images.unsplash.com/photo-1635767798595-a1d2c9deacb4?w=600&q=90' },
  { label: 'Prêt-à-porter',          img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=90' },
  { label: 'Parfums & Beauté',       img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=90' },
  { label: 'Chaussures',             img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&q=90' },
  { label: 'Soie & Accessoires',     img: 'https://images.unsplash.com/photo-1677478863154-55ecce8c7536?w=600&q=90' },
  { label: 'Art de vivre',           img: 'https://images.unsplash.com/photo-1575027773195-f6c7298430c8?w=600&q=90' },
  { label: 'Cadeaux Femme',          img: 'https://images.unsplash.com/photo-1625552186152-668cd2f0b707?w=600&q=90' },
];

const HOMME = [
  { label: 'Costumes & Tenues',      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=90' },
  { label: 'Montres & Bijoux',       img: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&q=90' },
  { label: 'Chaussures Homme',       img: 'https://images.unsplash.com/photo-1552422554-0d5af0c79fc6?w=600&q=90' },
  { label: 'Maroquinerie Homme',     img: 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=600&q=90' },
  { label: 'Cravates & Accessoires', img: 'https://images.unsplash.com/photo-1603484255049-ea4d0fe04fd3?w=600&q=90' },
  { label: 'Parfums Homme',          img: 'https://images.unsplash.com/photo-1644958292401-c095b23440b7?w=600&q=90' },
  { label: 'Sneakers & Sport',       img: 'https://images.unsplash.com/photo-1571601035754-5c927f2d7edc?w=600&q=90' },
  { label: 'Cadeaux Homme',          img: 'https://images.unsplash.com/photo-1674620213535-9b2a2553ef40?w=600&q=90' },
];

const TRUST = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Shoppers vérifiés',
    sub: 'Chaque shopper est certifié par notre équipe avant toute mission.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: 'Paiement sécurisé',
    sub: "Fonds conservés en escrow jusqu'à réception et validation de votre pièce.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    title: 'Recherche sur mesure',
    sub: 'Décrivez la pièce. Nos experts sourcent pour vous dans le monde entier.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    title: 'Support premium',
    sub: 'Une équipe dédiée disponible pour accompagner chaque transaction.',
  },
];

const toSlug = (str) =>
  str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'et')
    .replace(/ /g, '-');

export default function Catalogue() {
  const location = useLocation();
  const initialTab = new URLSearchParams(location.search).get('tab');
  const [tab, setTab]                 = useState(initialTab === 'homme' ? 'homme' : 'femme');
  const [activecat, setActivecat]     = useState('Tout');
  const [role, setRole]               = useState(null);
  const [user, setUser]               = useState(null);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navVisible, setNavVisible]   = useState(true);
  const profileRef = useRef(null);
  const lastScroll = useRef(0);
  const navigate   = useNavigate();

  useEffect(() => {
    const getRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);
      const metaRole = session.user.user_metadata?.role;
      if (metaRole) { setRole(metaRole); return; }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('user_id', session.user.id).single();
      if (profile?.role) setRole(profile.role);
    };
    getRole();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current <= 10) setNavVisible(true);
      else if (current > lastScroll.current + 5) setNavVisible(false);
      else if (current < lastScroll.current - 5) setNavVisible(true);
      lastScroll.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setRole(null); setProfileOpen(false);
    window.location.href = '/#/';
  };

  const handleCategoryClick = () => {
    if (role === 'client') navigate('/deposer-demande');
    else navigate('/login');
  };

  /* Lien "Demander un article similaire" — redirige vers l'inscription client si non connecté */
  const handleSimilarClick = (e) => {
    e.stopPropagation();
    if (role === 'client') navigate('/deposer-demande');
    else navigate('/register/client');
  };

  const dashLink =
    role === 'shopper' ? '/shopper/home' :
    role === 'client'  ? '/client/home'  :
    role === 'admin'   ? '/admin/dashboard' : '/login';

  const firstName = user?.user_metadata?.first_name || '';
  const lastName  = user?.user_metadata?.last_name  || '';
  const initials  = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() : null;

  const menuItems = role === 'client' ? [
    { label: 'Mon profil',   to: '/client/profil' },
    { label: 'Mes demandes', to: '/client/suivi' },
    { label: 'Paramètres',   to: '/client/profil' },
  ] : role === 'shopper' ? [
    { label: 'Mon profil',   to: '/shopper/profil' },
    { label: 'Mes gains',    to: '/shopper/gains' },
    { label: 'Mes articles', to: '/shopper/articles' },
    { label: 'Suivi',        to: '/shopper/suivi' },
  ] : [];

  const cats    = tab === 'femme' ? FEMME : HOMME;
  const navTop  = navVisible ? '0px' : '-60px';
  const catsTop = navVisible ? '60px' : '0px';

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: sans }}>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {/* ── NAV ── */}
      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 32px', height: '60px', background: '#fff', position: 'fixed', top: navTop, left: 0, right: 0, zIndex: 1000, transition: 'top .3s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button onClick={() => { setMenuOpen(true); setSearchOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'block', width: '18px', height: '1px', background: '#1a1a1a' }} />
              <span style={{ display: 'block', width: '18px', height: '1px', background: '#1a1a1a' }} />
              <span style={{ display: 'block', width: '18px', height: '1px', background: '#1a1a1a' }} />
            </div>
            <span style={{ fontSize: '8px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#1a1a1a', fontFamily: sans }}>Menu</span>
          </button>
          <nav style={{ display: 'flex', gap: '22px' }}>
            {[['Catalogue', '/catalogue'], ['Shoppers', '/personal-shoppers'], ['Comment ça marche', '/how-it-works'], ['Avis', '/avis']].map(([label, to]) => (
              <Link key={label} to={to} style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.06em', textTransform: 'uppercase', color: '#666', textDecoration: 'none', whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.color = '#1a1a1a'}
                onMouseLeave={e => e.currentTarget.style.color = '#666'}
              >{label}</Link>
            ))}
          </nav>
        </div>

        <Logo to="/" color="dark" size="md" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
          <button onClick={() => { setSearchOpen(true); setMenuOpen(false); }}
            style={{ cursor: 'pointer', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'none', border: 'none', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f7f0de'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </button>
          <a href="/#/messages" style={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', padding: '4px', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </a>
          <a href="/#/notifications" style={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', padding: '4px', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          </a>
          <a href="/#/favoris" style={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', padding: '4px', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </a>
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button onClick={() => initials ? setProfileOpen(v => !v) : window.location.href = '/#/login'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#1a1a1a' }}>
              {initials ? (
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1a1a1a', color: '#C9A84C', fontSize: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans }}>{initials}</span>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              )}
            </button>
            {profileOpen && initials && (
              <div style={{ position: 'absolute', top: '48px', right: 0, width: '240px', background: '#fff', border: '.5px solid #ececec', boxShadow: '0 8px 32px rgba(0,0,0,.08)', zIndex: 200 }}>
                <div style={{ padding: '16px 20px', borderBottom: '.5px solid #ececec' }}>
                  <p style={{ fontFamily: sans, fontSize: '12px', fontWeight: '500', color: '#1a1a1a', marginBottom: '2px' }}>{firstName} {lastName}</p>
                  <p style={{ fontFamily: sans, fontSize: '10px', color: '#aaa', fontWeight: '300' }}>{user?.email}</p>
                </div>
                <div style={{ padding: '8px 0' }}>
                  {menuItems.map(({ label, to }) => (
                    <a key={label} href={`/#${to}`} onClick={() => setProfileOpen(false)}
                      style={{ display: 'block', padding: '11px 20px', fontFamily: sans, fontSize: '12px', fontWeight: '300', color: '#1a1a1a', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{label}</a>
                  ))}
                </div>
                <div style={{ borderTop: '.5px solid #ececec', padding: '8px 0' }}>
                  <button onClick={handleLogout}
                    style={{ display: 'block', width: '100%', padding: '11px 20px', fontFamily: sans, fontSize: '12px', fontWeight: '300', color: '#888', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >Se déconnecter</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MENU OVERLAY ── */}
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 299, background: 'rgba(0,0,0,.3)' }} />}
      <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 300, width: '360px', background: '#fff', transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .4s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: '60px', borderBottom: '1px solid #ececec' }}>
          <Logo to={null} color="dark" size="md" />
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <nav style={{ padding: '28px 40px', display: 'flex', flexDirection: 'column' }}>
          {[
            { label: 'Accueil',           to: '/' },
            { label: 'Catalogue',         to: '/catalogue' },
            { label: 'Comment ça marche', to: '/how-it-works' },
            { label: 'FAQ',               to: '/faq' },
            { label: 'Contact',           to: '/contact' },
            { label: role ? 'Mon espace' : 'Se connecter', to: dashLink },
          ].map(({ label, to }) => (
            <Link key={label} to={to} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: serif, fontSize: '2rem', fontWeight: 300, color: '#1a1a1a', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── CATÉGORIES ── */}
      <nav style={{ position: 'fixed', top: catsTop, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', zIndex: 89, overflowX: 'hidden', transition: 'top .3s cubic-bezier(.4,0,.2,1)' }}>
        {CATEGORIES_BAR.map((cat) => (
          <button key={cat}
            onClick={() => { setActivecat(cat); if (cat === 'Tout') navigate('/catalogue'); else navigate(`/catalogue/${toSlug(cat)}`); }}
            style={{ fontFamily: sans, fontSize: '11px', fontWeight: activecat === cat ? '400' : '300', letterSpacing: '.04em', color: activecat === cat ? '#1a1a1a' : '#888', background: 'none', border: 'none', borderBottom: activecat === cat ? '1.5px solid #1a1a1a' : '1.5px solid transparent', padding: '14px 18px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .2s, border-color .2s' }}
            onMouseEnter={e => { if (activecat !== cat) { e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.borderBottomColor = '#C9A84C'; } }}
            onMouseLeave={e => { if (activecat !== cat) { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderBottomColor = 'transparent'; } }}
          >{cat}</button>
        ))}
      </nav>

      {/* ── EN-TÊTE GALERIE (nouveau) ── */}
      <div style={{ marginTop: '110px', padding: '48px 48px 0', boxSizing: 'border-box' }}>
        <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '14px' }}>Galerie</p>
        <h1 style={{ fontFamily: serif, fontSize: '2.2rem', fontWeight: 300, fontStyle: 'italic', color: '#1a1a1a', maxWidth: '600px', lineHeight: 1.3 }}>
          Pièces de luxe sélectionnées par notre réseau d'experts.
        </h1>
      </div>

      {/* ── SECTION CONFIANCE ── */}
      <div style={{ padding: '40px 48px', borderBottom: '.5px solid #ececec', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
          {TRUST.map(({ icon, title, sub }) => (
            <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
              <div style={{ color: '#C9A84C' }}>{icon}</div>
              <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#1a1a1a', fontWeight: '400' }}>{title}</p>
              <p style={{ fontFamily: serif, fontSize: '.9rem', fontStyle: 'italic', fontWeight: 300, color: '#aaa', lineHeight: 1.7 }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{ height: '520px', overflow: 'hidden', width: '100%', position: 'relative' }}>
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=90" alt="Catalogue"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block', filter: 'brightness(.55)' }} />
        <div style={{ position: 'absolute', bottom: '56px', left: '56px' }}>
          <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>
            Heneris · Catalogue
          </p>
          <h1 style={{ fontFamily: serif, fontSize: '3rem', fontWeight: 300, fontStyle: 'italic', color: '#fff', lineHeight: 1.1, maxWidth: '500px' }}>
            L'exception,<br />à portée de main.
          </h1>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 48px', background: '#fff' }}>
        {['femme', 'homme'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ fontFamily: sans, fontSize: '10px', fontWeight: 300, letterSpacing: '.08em', color: tab === t ? '#1a1a1a' : '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 3px 20px', textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationColor: tab === t ? '#1a1a1a' : 'transparent', transition: 'all .2s' }}
          >{t === 'femme' ? 'Femme' : 'Homme'}</button>
        ))}
      </div>

      {/* ── GRILLE ── */}
      <div style={{ padding: '0 48px 80px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
          {cats.map(({ label, img }) => (
            <div key={label} onClick={handleCategoryClick} style={{ cursor: 'pointer', background: '#f7f5f2' }}>
              <div style={{ height: '260px', overflow: 'hidden' }}>
                <img src={img} alt={label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .8s cubic-bezier(.4,0,.2,1)', filter: 'brightness(.9)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.filter = 'brightness(1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(.9)'; }}
                />
              </div>
              <div style={{ padding: '14px 16px 18px', background: '#fff' }}>
                <p style={{ fontFamily: sans, fontSize: '7px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#1a1a1a', fontWeight: 400, marginBottom: '8px' }}>{label}</p>
                <span
                  onClick={handleSimilarClick}
                  style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.08em', color: '#C9A84C', textDecoration: 'underline', textUnderlineOffset: '2px', cursor: 'pointer', display: 'inline-block' }}
                >
                  Demander un article similaire
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BLOC RECHERCHE ── */}
      <div style={{ margin: '0 48px 80px', border: '.5px solid #ececec', padding: '64px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div>
          <p style={{ fontSize: '8px', letterSpacing: '.28em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px', fontFamily: sans }}>Recherche personnalisée</p>
          <h2 style={{ fontFamily: serif, fontSize: '1.8rem', fontWeight: 300, fontStyle: 'italic', color: '#1a1a1a', marginBottom: '12px', lineHeight: 1.3 }}>
            Vous ne trouvez pas<br />votre pièce ?
          </h2>
          <p style={{ fontFamily: serif, fontSize: '1rem', fontStyle: 'italic', fontWeight: 300, color: '#aaa', lineHeight: 1.8, maxWidth: '420px' }}>
            Notre réseau de shoppers certifiés effectue une recherche entièrement personnalisée pour vous.
          </p>
        </div>
        <Link to={role === 'client' ? '/deposer-demande' : '/login'}
          style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', background: '#1a1a1a', padding: '14px 40px', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#C9A84C'}
          onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
        >
          Faire une demande
        </Link>
      </div>

      <Footer />
    </div>
  );
}