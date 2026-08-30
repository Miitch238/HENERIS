import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SearchOverlay from '../components/SearchOverlay';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import './Home.css';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";

const COLORS = {
  black: '#111111',
  ivory: '#F7F4EE',
  sand:  '#E8DFD2',
  gold:  '#B89A5D',
  stone: '#A8A093',
  white: '#FFFFFF',
};

const GRAIN_BG = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const Grain = ({ opacity = .045 }) => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity, mixBlendMode: 'overlay', backgroundImage: GRAIN_BG, zIndex: 2 }} />
);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

const Btn = ({ to, children, variant = 'gold', style: s = {} }) => {
  const base = { fontFamily: sans, fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', padding: '19px 52px', fontWeight: 500, transition: 'all .25s' };
  const v = {
    gold: { color: '#fff', background: COLORS.gold },
    dark: { color: '#fff', background: COLORS.black },
    ghost: { color: '#fff', background: 'transparent', border: '1.5px solid rgba(255,255,255,.5)', padding: '17.5px 44px' },
    outline: { color: COLORS.black, background: 'transparent', border: `1.5px solid ${COLORS.black}`, padding: '17.5px 44px' },
  };
  return (
    <Link to={to} style={{ ...base, ...v[variant], ...s }}
      onMouseEnter={e => { if (variant === 'gold') e.currentTarget.style.background = '#a3875a'; if (variant === 'dark') e.currentTarget.style.background = COLORS.gold; if (variant === 'ghost') e.currentTarget.style.background = 'rgba(255,255,255,.12)'; if (variant === 'outline') { e.currentTarget.style.background = COLORS.black; e.currentTarget.style.color = '#fff'; } }}
      onMouseLeave={e => { if (variant === 'gold') e.currentTarget.style.background = COLORS.gold; if (variant === 'dark') e.currentTarget.style.background = COLORS.black; if (variant === 'ghost') e.currentTarget.style.background = 'transparent'; if (variant === 'outline') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.black; } }}
    >{children}</Link>
  );
};

const ETAPES = [
  { n: '01', title: 'Exprimez votre besoin',         sub: 'Référence, budget, critères : décrivez la pièce en quelques minutes.', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=80' },
  { n: '02', title: 'Choisissez votre expert', sub: "Sélectionnez un shopper ou laissez Heneris trouver le meilleur profil pour votre demande.", img: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1000&q=80' },
  { n: '03', title: 'Votre shopper négocie et sécurise',  sub: "Vos fonds restent en escrow jusqu'à votre confirmation finale.", img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80' },
  { n: '04', title: 'Vous recevez votre pièce',      sub: "Le shopper n'est rémunéré qu'après votre validation.", img: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000&q=80' },
];

const SHOPPERS = [
  { name: 'Clara V.', city: 'Paris', spec: 'Joaillerie de luxe', exp: '12 ans', missions: 84, succes: '97%', bio: "Ancienne acheteuse pour une maison de joaillerie place Vendôme, Clara mobilise un carnet d'adresses que personne d'autre ne possède.", img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&q=90' },
  { name: 'Sophie M.', city: 'Paris', spec: 'Maroquinerie de luxe', exp: '9 ans', missions: 61, succes: '95%', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=90' },
  { name: 'Karim B.', city: 'Dubaï', spec: 'Éditions rares', exp: '7 ans', missions: 73, succes: '96%', img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800&q=90' },
  { name: 'Alexandre D.', city: 'Genève', spec: 'Horlogerie fine', exp: '15 ans', missions: 102, succes: '98%', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=90' },
];

const INVENTAIRE = [
  { marque: 'Hermès', nom: 'Birkin 30 Togo', prix: '16 500', ville: 'Paris', delai: '48h', img: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=1200&q=90' },
  { marque: 'Patek Philippe', nom: 'Nautilus 5711', prix: '72 000', ville: 'Genève', delai: '5 jours', img: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800&q=90' },
  { marque: 'Cartier', nom: 'Love Bracelet Diamants', prix: '8 200', ville: 'Milan', delai: '36h', img: 'https://images.unsplash.com/photo-1635767798595-a1d2c9deacb4?w=800&q=90' },
];

const CATEGORIES = [
  { label: 'Maroquinerie',      slug: 'maroquinerie', img: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=1600&q=90', sell: 'Les sacs les plus convoités au monde.' },
  { label: 'Horlogerie',        slug: 'horlogerie',    img: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=1200&q=90',   sell: 'Des garde-temps de collection.' },
  { label: 'Joaillerie',        slug: 'joaillerie',    img: 'https://images.unsplash.com/photo-1635767798595-a1d2c9deacb4?w=1000&q=90', sell: "Créations d'exception, sourcées en privé." },
  { label: 'Archive Fashion',   slug: 'mode',          img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=90', sell: "Des pièces qu'on ne retrouve plus en boutique." },
  { label: 'Streetwear',        slug: 'collection',    img: 'https://images.unsplash.com/photo-1575027773195-f6c7298430c8?w=1000&q=90', sell: "Ce que personne d'autre ne peut vous trouver." },
];

const TRUST = [
  { t: 'Shoppers vérifiés', s: "Chaque expert est entretenu, validé et suivi avant de rejoindre le réseau.", big: true },
  { t: 'Réseau premium', s: "Un accès à des sourcing hors marché public.", big: false },
  { t: 'Paiements sécurisés', s: "Fonds en escrow jusqu'à votre validation.", big: false },
  { t: 'Authentification', s: "Chaque pièce est contrôlée avant expédition.", big: false },
  { t: 'Confidentialité garantie', s: "Vos recherches et transactions restent strictement privées, du premier échange à la livraison.", big: true },
  { t: 'Accompagnement personnalisé', s: "Un interlocuteur unique, du besoin à la possession.", big: false },
];

const TEMOIGNAGES = [
  { quote: "Je cherchais une montre introuvable depuis plusieurs mois. Mon shopper l'a trouvée en moins d'une semaine.", auteur: 'Camille', ville: 'Paris', piece: 'Birkin 25', date: 'Mars 2026', montant: '18 500', featured: true },
  { quote: 'Une expérience fluide, privée et extrêmement efficace.', auteur: 'Julien', ville: 'Lyon', piece: 'Daytona Vintage', date: 'Janvier 2026', montant: '32 000' },
  { quote: 'Mon shopper a compris exactement ce que je cherchais, sans jamais avoir à me répéter.', auteur: 'Inès', ville: 'Genève', piece: 'Collier Cartier', date: 'Février 2026', montant: '9 800' },
];

const MENU_LINKS = [
  { label: 'Accueil',           to: '/' },
  { label: 'Univers',           to: '/catalogue' },
  { label: 'Vitrine Shoppers',  to: '/personal-shoppers' },
  { label: 'Comment ça marche', to: '/how-it-works' },
  { label: 'Avis clients',      to: '/avis' },
  { label: 'FAQ',               to: '/faq' },
];

const CATEGORIES_NAV = ['Maroquinerie', 'Horlogerie', 'Joaillerie', 'Mode', 'Trouvailles rares'];

const toSlug = (str) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'et').replace(/ /g, '-');

export default function Home() {
  const [searchOpen, setSearchOpen]   = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [role, setRole]               = useState(null);
  const [user, setUser]               = useState(null);
  const [activecat, setActivecat]     = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navVisible, setNavVisible]   = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const [genre, setGenre] = useState('femme');
  const profileRef = useRef(null);
  const lastScroll = useRef(0);
  const navigate   = useNavigate();
  const isMobile   = useIsMobile();

  useEffect(() => {
    const getRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);
      const metaRole = session.user.user_metadata?.role;
      if (metaRole) { setRole(metaRole); if (metaRole === 'shopper') navigate('/shopper/home', { replace: true }); return; }
      const { data: p } = await supabase.from('profiles').select('role').eq('user_id', session.user.id).single();
      if (p?.role) { setRole(p.role); if (p.role === 'shopper') navigate('/shopper/home', { replace: true }); }
    };
    getRole();
  }, [navigate]);

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

  const menuItems = role === 'shopper' ? [{ label: 'Mon profil', to: '/shopper/profil' }, { label: 'Mes gains', to: '/shopper/gains' }]
    : role === 'client' ? [{ label: 'Mon profil', to: '/client/profil' }, { label: 'Mes demandes', to: '/client/suivi' }] : [];

  const navTop  = navVisible ? '0px' : '-70px';
  const catsTop = navVisible ? '70px' : '0px';
  const featuredShopper = SHOPPERS[0];
  const otherShoppers = SHOPPERS.slice(1);
  const featuredQuote = TEMOIGNAGES.find(t => t.featured) || TEMOIGNAGES[0];
  const otherQuotes = TEMOIGNAGES.filter(t => t !== featuredQuote);

  return (
    <div style={{ background: '#fff', fontFamily: sans }}>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '340px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '32px 40px 28px', borderBottom: '.5px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Logo to={null} size="sm" />
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <nav style={{ flex: 1, padding: '16px 0' }}>
              {MENU_LINKS.map(({ label, to }) => (
                <Link key={label} to={to} onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', padding: '18px 40px', fontFamily: serif, fontSize: '2rem', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, textDecoration: 'none', borderBottom: '.5px solid #f8f8f8', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = COLORS.gold} onMouseLeave={e => e.currentTarget.style.color = COLORS.black}
                >{label}</Link>
              ))}
            </nav>
            <div style={{ padding: '28px 40px', borderTop: '.5px solid #f0f0f0' }}>
              <Link to={demandeTo} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', textAlign: 'center', fontFamily: sans, fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#fff', background: COLORS.gold, padding: '15px 0', textDecoration: 'none' }}
              >Déposer une demande</Link>
            </div>
          </div>
        </div>
      )}

      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 40px', height: '70px', background: '#fff', position: 'fixed', top: navTop, left: 0, right: 0, zIndex: 1000, borderBottom: '.5px solid #f0f0f0', transition: 'top .3s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => { setMenuOpen(true); setSearchOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: COLORS.black, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <span style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#999', fontWeight: 300 }}>Menu</span>
          </button>
        </div>
        <Logo to="/" size="md" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end' }}>
          <Btn to={demandeTo} style={{ padding: '10px 22px', fontSize: '9px' }}>Faire une demande</Btn>
          {role && (
            <>
              <a href="/#/messages" style={{ color: '#666', display: 'flex', textDecoration: 'none' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></a>
              <a href="/#/favoris" style={{ color: '#666', display: 'flex', textDecoration: 'none' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></a>
            </>
          )}
          <button onClick={() => { setSearchOpen(true); setMenuOpen(false); }}
            style={{ cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', background: 'none', border: 'none', transition: 'background .2s, color .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5f0e7'; e.currentTarget.style.color = COLORS.gold; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#666'; }}
          ><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button>
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button onClick={() => setProfileOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#666' }}>
              {initials
                ? <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: COLORS.black, color: COLORS.gold, fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials}</span>
                : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            </button>
            {profileOpen && (
              <div style={{ position: 'absolute', top: '48px', right: 0, width: '220px', background: '#fff', border: '.5px solid #ececec', boxShadow: '0 8px 32px rgba(0,0,0,.08)', zIndex: 200 }}>
                {initials ? (
                  <>
                    <div style={{ padding: '14px 18px', borderBottom: '.5px solid #ececec' }}>
                      <p style={{ fontFamily: sans, fontSize: '12px', fontWeight: 500, color: COLORS.black, marginBottom: '2px' }}>{firstName} {lastName}</p>
                      <p style={{ fontFamily: sans, fontSize: '10px', color: '#aaa' }}>{user?.email}</p>
                    </div>
                    <div style={{ padding: '6px 0' }}>
                      {menuItems.map(({ label, to }) => (
                        <a key={label} href={`/#${to}`} onClick={() => setProfileOpen(false)} style={{ display: 'block', padding: '10px 18px', fontFamily: sans, fontSize: '11px', fontWeight: 300, color: COLORS.black, textDecoration: 'none' }}>{label}</a>
                      ))}
                      <Link to={dashLink} onClick={() => setProfileOpen(false)} style={{ display: 'block', padding: '10px 18px', fontFamily: sans, fontSize: '11px', fontWeight: 300, color: COLORS.black, textDecoration: 'none' }}>Mon espace</Link>
                    </div>
                    <div style={{ borderTop: '.5px solid #ececec', padding: '6px 0' }}>
                      <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '10px 18px', fontFamily: sans, fontSize: '11px', fontWeight: 300, color: '#999', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Se déconnecter</button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '8px 0' }}>
                    {[['Se connecter', '/login', 400], ['Créer un compte client', '/register/client', 300], ['Devenir shopper', '/register/shopper', 300]].map(([l, t, w], i) => (
                      <Link key={l} to={t} onClick={() => setProfileOpen(false)} style={{ display: 'block', padding: '12px 18px', fontFamily: sans, fontSize: '11px', fontWeight: w, color: w === 400 ? COLORS.black : '#666', textDecoration: 'none', borderTop: i === 2 ? '.5px solid #f5f5f5' : 'none' }}>{l}</Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <nav style={{ position: 'fixed', top: catsTop, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fff', zIndex: 89, transition: 'top .3s cubic-bezier(.4,0,.2,1)', borderBottom: '.5px solid #f0f0f0' }}>
        {CATEGORIES_NAV.map(cat => (
          <button key={cat} onClick={() => { setActivecat(cat); navigate(`/catalogue/${toSlug(cat)}`); }}
            style={{ fontFamily: sans, fontSize: '10.5px', fontWeight: activecat === cat ? 400 : 300, letterSpacing: '.1em', textTransform: 'uppercase', color: activecat === cat ? COLORS.black : '#999', background: 'none', border: 'none', borderBottom: activecat === cat ? `1.5px solid ${COLORS.black}` : '1.5px solid transparent', padding: '15px 26px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => { if (activecat !== cat) { e.currentTarget.style.color = COLORS.black; e.currentTarget.style.borderBottomColor = COLORS.gold; } }}
            onMouseLeave={e => { if (activecat !== cat) { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderBottomColor = 'transparent'; } }}
          >{cat}</button>
        ))}
      </nav>

      {/* ═══ 1 · HERO ═══ */}
      <div style={{ position: 'relative', height: '100vh', minHeight: '680px', overflow: 'hidden', background: COLORS.black }}>
        {videoFailed ? (
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=90" alt="Heneris" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%', filter: 'brightness(.42)' }} />
        ) : (
          <video autoPlay muted loop playsInline onError={() => setVideoFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(.42)' }}>
            <source src="/videos/hero-heneris.mp4" type="video/mp4" />
          </video>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,7,.7), rgba(10,9,7,.15) 55%, rgba(10,9,7,.35))' }} />
        <Grain opacity={.05} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 32px' }}>
          <p style={{ fontFamily: sans, fontSize: '11px', letterSpacing: '.32em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '22px' }}>L'art de trouver</p>
          <h1 style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', color: '#fff', maxWidth: '760px', lineHeight: 1.3, marginBottom: '32px' }}>
            Connectez-vous à des personal shoppers spécialisés dans le luxe, le vintage et les pièces rares.
          </h1>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Btn to={demandeTo} variant="gold" style={{ fontSize: '10.5px', padding: '17px 40px' }}>Trouver un shopper</Btn>
            <Btn to="/register/shopper" variant="ghost" style={{ fontSize: '10.5px', padding: '15.5px 38px' }}>Devenir shopper</Btn>
          </div>
        </div>
      </div>

      {/* ═══ 2 · FEATURED SHOPPERS — un shopper vedette + 3 en colonne, composition asymétrique ═══ */}
      <div style={{ position: 'relative', background: COLORS.white, padding: 'clamp(64px, 9vw, 110px) clamp(32px, 6vw, 80px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontFamily: sans, fontSize: '12px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '14px' }}>Le réseau</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, marginBottom: '14px' }}>Shoppers à l'honneur.</h2>
          <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', color: COLORS.stone, fontWeight: 300, maxWidth: '460px', margin: '0 auto' }}>
            Vous n'achetez pas un catalogue. Vous accédez à un réseau, un goût, une expertise.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.7fr 1fr', gap: isMobile ? '16px' : '4px', maxWidth: '1300px', margin: '0 auto' }}>
          {/* Shopper vedette */}
          <div style={{ position: 'relative', height: isMobile ? '420px' : '620px', overflow: 'hidden' }}>
            <img src={featuredShopper.img} alt={featuredShopper.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.88), rgba(0,0,0,.15) 60%, transparent)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px, 3vw, 44px)' }}>
              <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.18em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '10px' }}>{featuredShopper.spec}</p>
              <p style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 2.6vw, 2.4rem)', fontStyle: 'italic', fontWeight: 300, color: '#fff', marginBottom: '10px' }}>{featuredShopper.name}</p>
              {featuredShopper.bio && (
                <p style={{ fontFamily: serif, fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,.85)', maxWidth: '440px', lineHeight: 1.5, marginBottom: '16px' }}>{featuredShopper.bio}</p>
              )}
              <p style={{ fontFamily: sans, fontSize: '10.5px', color: COLORS.gold, borderTop: '.5px solid rgba(255,255,255,.25)', paddingTop: '10px', display: 'inline-block' }}>{featuredShopper.city} · {featuredShopper.exp} · {featuredShopper.missions} missions · {featuredShopper.succes} succès</p>
            </div>
          </div>

          {/* Colonne des 3 autres shoppers */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '4px', height: isMobile ? 'auto' : '620px' }}>
            {otherShoppers.map(s => (
              <div key={s.name} style={{ position: 'relative', flex: 1, overflow: 'hidden', minHeight: isMobile ? '220px' : 0 }}>
                <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.15) 65%, transparent)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px' }}>
                  <p style={{ fontFamily: sans, fontSize: '8.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '4px' }}>{s.spec}</p>
                  <p style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 300, color: '#fff' }}>{s.name}</p>
                  <p style={{ fontFamily: sans, fontSize: '8.5px', color: 'rgba(255,255,255,.7)', marginTop: '3px' }}>{s.city} · {s.missions} missions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link to="/personal-shoppers" style={{ fontFamily: sans, fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: COLORS.black, borderBottom: `.5px solid ${COLORS.stone}`, paddingBottom: '2px', textDecoration: 'none' }}>
            Découvrir tout le réseau →
          </Link>
        </div>
      </div>

      {/* ═══ 3 · EXPLORER LES EXPERTISES — mosaïque avec chevauchement ═══ */}
      <div style={{ background: COLORS.ivory }}>
        <div style={{ padding: 'clamp(56px, 8vw, 90px) clamp(32px, 6vw, 80px) clamp(36px, 5vw, 48px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p style={{ fontFamily: sans, fontSize: '12px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '14px' }}>Explorer les expertises</p>
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black }}>Ce que nous savons dénicher.</h2>
            </div>
            <div style={{ display: 'inline-flex', border: `1px solid ${COLORS.stone}`, flexShrink: 0 }}>
              {['femme', 'homme'].map((g, i) => (
                <button key={g} onClick={() => { setGenre(g); navigate(`/catalogue?tab=${g}`); }}
                  style={{
                    fontFamily: sans, fontSize: '10.5px', letterSpacing: '.1em', textTransform: 'uppercase', padding: '10px 22px', cursor: 'pointer',
                    background: genre === g ? COLORS.black : 'transparent', color: genre === g ? '#fff' : COLORS.black,
                    border: 'none', borderLeft: i === 1 ? `1px solid ${COLORS.stone}` : 'none', transition: 'all .15s',
                  }}
                >{g === 'femme' ? 'Femme' : 'Homme'}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '4px', marginBottom: '4px' }}>
          <CategoryTile c={CATEGORIES[0]} height={isMobile ? '40vh' : '58vh'} gold={COLORS.gold} sans={sans} serif={serif} big />
          <CategoryTile c={CATEGORIES[1]} height={isMobile ? '40vh' : '58vh'} gold={COLORS.gold} sans={sans} serif={serif} />
          {!isMobile && (
            <div style={{ position: 'absolute', left: '66.6%', bottom: '32px', transform: 'translateX(-50%)', background: COLORS.black, color: '#fff', padding: '18px 26px', maxWidth: '220px', boxShadow: '0 20px 50px rgba(0,0,0,.25)' }}>
              <p style={{ fontFamily: serif, fontSize: '1.5rem', fontStyle: 'italic', color: COLORS.gold, marginBottom: '2px' }}>5</p>
              <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.08em', color: 'rgba(255,255,255,.75)' }}>univers d'expertise, un seul réseau</p>
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '4px', paddingBottom: '4px' }}>
          <CategoryTile c={CATEGORIES[2]} height={isMobile ? '34vh' : '36vh'} gold={COLORS.gold} sans={sans} serif={serif} />
          <CategoryTile c={CATEGORIES[3]} height={isMobile ? '34vh' : '36vh'} gold={COLORS.gold} sans={sans} serif={serif} />
          <CategoryTile c={CATEGORIES[4]} height={isMobile ? '34vh' : '36vh'} gold={COLORS.gold} sans={sans} serif={serif} />
        </div>
      </div>

      {/* ═══ 4 · ABOUT — texte court / visuel éditorial qui déborde ═══ */}
      <div style={{ background: COLORS.white, padding: 'clamp(64px, 9vw, 110px) clamp(32px, 6vw, 80px)', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.85fr 1.15fr', gap: isMobile ? '32px' : '0px', alignItems: 'center', maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ paddingRight: isMobile ? 0 : '48px', position: 'relative', zIndex: 2 }}>
            <p style={{ fontFamily: sans, fontSize: '12px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '18px' }}>Notre approche</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 3.6vw, 2.8rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, marginBottom: '22px', lineHeight: 1.25 }}>
              Une sélection, pas un catalogue.
            </h2>
            <p style={{ fontFamily: sans, fontSize: '14px', color: COLORS.stone, lineHeight: 1.7, marginBottom: '18px' }}>
              Heneris ne vend rien. Nous mettons en relation des clients exigeants avec des personal shoppers triés sur le volet — leur réseau, leur œil et leur discrétion font la différence.
            </p>
            <p style={{ fontFamily: sans, fontSize: '14px', color: COLORS.stone, lineHeight: 1.7, marginBottom: '28px' }}>
              Chaque profil est validé avant de rejoindre la plateforme. Chaque transaction reste protégée jusqu'à votre validation finale.
            </p>
            <p style={{ fontFamily: serif, fontSize: '1.15rem', fontStyle: 'italic', color: COLORS.gold }}>
              « Le luxe n'est pas une question de prix, mais de précision. »
            </p>
          </div>
          <div style={{ position: 'relative', height: isMobile ? '360px' : '520px', marginRight: isMobile ? 0 : 'clamp(-40px, -4vw, -20px)' }}>
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=90" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* ═══ 5 · PIÈCES RÉCEMMENT SOURCÉES — asymétrique : une pièce vedette + deux empilées ═══ */}
      <div style={{ padding: 'clamp(64px, 9vw, 110px) clamp(32px, 6vw, 80px)', background: COLORS.ivory, boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p style={{ fontFamily: sans, fontSize: '12px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '14px' }}>Pièces récemment sourcées</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, maxWidth: '700px', margin: '0 auto', lineHeight: 1.2 }}>
            Ce que nous venons de trouver pour nos clients.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: '4px', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <div style={{ height: isMobile ? '300px' : '520px', overflow: 'hidden' }}>
              <img src={INVENTAIRE[0].img} alt={INVENTAIRE[0].nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '20px 4px', background: COLORS.ivory }}>
              <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: COLORS.stone, marginBottom: '8px' }}>{INVENTAIRE[0].marque}</p>
              <p style={{ fontFamily: serif, fontSize: '1.5rem', fontStyle: 'italic', color: COLORS.black, marginBottom: '10px' }}>{INVENTAIRE[0].nom}</p>
              <p style={{ fontFamily: serif, fontSize: '13px', fontStyle: 'italic', color: COLORS.gold, marginBottom: '6px' }}>Trouvé à {INVENTAIRE[0].ville} en {INVENTAIRE[0].delai}</p>
              <p style={{ fontFamily: sans, fontSize: '13px', color: COLORS.stone }}>€ {INVENTAIRE[0].prix}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {INVENTAIRE.slice(1).map(p => (
              <div key={p.nom} style={{ display: 'flex', flex: 1, background: COLORS.white }}>
                <div style={{ width: '42%', overflow: 'hidden' }}>
                  <img src={p.img} alt={p.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ width: '58%', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.12em', textTransform: 'uppercase', color: COLORS.stone, marginBottom: '6px' }}>{p.marque}</p>
                  <p style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', color: COLORS.black, marginBottom: '6px' }}>{p.nom}</p>
                  <p style={{ fontFamily: serif, fontSize: '11px', fontStyle: 'italic', color: COLORS.gold, marginBottom: '4px' }}>Trouvé à {p.ville} en {p.delai}</p>
                  <p style={{ fontFamily: sans, fontSize: '11px', color: COLORS.stone }}>€ {p.prix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 6 · STATEMENT ═══ */}
      <div style={{ position: 'relative', height: '42vh', minHeight: '280px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.black }}>
        <img src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1800&q=90" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.3) saturate(.85)' }} />
        <Grain opacity={.06} />
        <p style={{ position: 'relative', zIndex: 3, fontFamily: serif, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontStyle: 'italic', fontWeight: 300, color: '#fff', textAlign: 'center', lineHeight: 1.3, maxWidth: '780px', padding: '0 32px' }}>
          Certaines pièces ne se trouvent pas.<br />Elles se méritent.
        </p>
      </div>

      {/* ═══ 7 · COMMENT ÇA MARCHE — alternance gauche/droite, chiffres géants ═══ */}
      <div style={{ padding: 'clamp(64px, 9vw, 110px) clamp(32px, 6vw, 80px)', background: COLORS.white, boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '64px', textAlign: 'center' }}>
          <p style={{ fontFamily: sans, fontSize: '12px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '14px' }}>Comment ça marche</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black }}>De la demande à la possession.</h2>
        </div>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: isMobile ? '48px' : '80px' }}>
          {ETAPES.map(({ n, title, sub, img }, i) => (
            <div key={n} style={{ position: 'relative', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '20px' : '48px', alignItems: 'center', direction: 'ltr' }}>
              <div style={{ order: isMobile ? 1 : (i % 2 === 0 ? 1 : 2), position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-38px', left: i % 2 === 0 ? '-8px' : 'auto', right: i % 2 === 0 ? 'auto' : '-8px', fontFamily: serif, fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.ivory, lineHeight: 1, zIndex: 0, WebkitTextStroke: `1px ${COLORS.sand}` }}>{n}</span>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ fontFamily: serif, fontSize: 'clamp(1.4rem, 2vw, 1.7rem)', fontStyle: 'italic', fontWeight: 300, color: COLORS.black, marginBottom: '10px' }}>{title}</p>
                  <p style={{ fontFamily: sans, fontSize: '13.5px', color: COLORS.stone, fontWeight: 300, lineHeight: 1.7, maxWidth: '420px' }}>{sub}</p>
                </div>
              </div>
              <div style={{ order: isMobile ? 2 : (i % 2 === 0 ? 2 : 1), height: isMobile ? '220px' : '280px', overflow: 'hidden' }}>
                <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 8 · TRUST — bento grid, tailles variées ═══ */}
      <div style={{ padding: 'clamp(64px, 9vw, 110px) clamp(32px, 6vw, 80px)', background: COLORS.ivory, boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontFamily: sans, fontSize: '12px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '14px' }}>Pourquoi Heneris</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black }}>La confiance avant tout.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gridAutoRows: isMobile ? 'auto' : '160px', gap: '4px', maxWidth: '1100px', margin: '0 auto' }}>
          {TRUST.map((item, i) => (
            <div key={item.t} style={{
              gridColumn: isMobile ? 'auto' : (item.big ? 'span 2' : 'span 1'),
              gridRow: isMobile ? 'auto' : (item.big ? 'span 2' : 'span 1'),
              background: i % 2 === 0 ? COLORS.white : COLORS.black,
              color: i % 2 === 0 ? COLORS.black : '#fff',
              padding: item.big ? '32px' : '22px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ width: '22px', height: '1px', background: COLORS.gold, marginBottom: '14px' }} />
              <p style={{ fontFamily: serif, fontSize: item.big ? '1.35rem' : '1.05rem', fontStyle: 'italic', marginBottom: '8px' }}>{item.t}</p>
              <p style={{ fontFamily: sans, fontSize: '12px', lineHeight: 1.6, color: i % 2 === 0 ? COLORS.stone : 'rgba(255,255,255,.65)' }}>{item.s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 9 · TÉMOIGNAGES — un vedette, deux secondaires ═══ */}
      <div style={{ padding: 'clamp(64px, 9vw, 110px) clamp(32px, 6vw, 80px)', background: COLORS.sand, boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontFamily: sans, fontSize: '12px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '14px' }}>Témoignages</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black }}>Ils nous font confiance.</h2>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto 4px', background: COLORS.white, padding: 'clamp(36px, 5vw, 56px)', textAlign: 'center' }}>
          <p style={{ fontFamily: serif, fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', fontStyle: 'italic', fontWeight: 300, color: COLORS.black, lineHeight: 1.5, marginBottom: '28px' }}>« {featuredQuote.quote} »</p>
          <div style={{ width: '30px', height: '1px', background: COLORS.gold, margin: '0 auto 16px' }} />
          <p style={{ fontFamily: sans, fontSize: '13px', letterSpacing: '.04em', color: COLORS.black, fontWeight: 500, marginBottom: '4px' }}>{featuredQuote.auteur} — {featuredQuote.ville}</p>
          <p style={{ fontFamily: sans, fontSize: '11.5px', color: COLORS.stone }}>{featuredQuote.piece} • {featuredQuote.date}</p>
          <p style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', color: COLORS.gold, marginTop: '6px' }}>€ {featuredQuote.montant}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '3px', maxWidth: '900px', margin: '0 auto' }}>
          {otherQuotes.map(({ quote, auteur, ville, piece, date, montant }) => (
            <div key={auteur} style={{ background: COLORS.white, padding: '32px 28px' }}>
              <p style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 300, color: COLORS.black, lineHeight: 1.5, marginBottom: '20px' }}>« {quote} »</p>
              <div style={{ width: '22px', height: '1px', background: COLORS.gold, marginBottom: '12px' }} />
              <p style={{ fontFamily: sans, fontSize: '11.5px', letterSpacing: '.04em', color: COLORS.black, fontWeight: 500, marginBottom: '3px' }}>{auteur} — {ville}</p>
              <p style={{ fontFamily: sans, fontSize: '10.5px', color: COLORS.stone }}>{piece} • {date}</p>
              <p style={{ fontFamily: serif, fontSize: '.95rem', fontStyle: 'italic', color: COLORS.gold, marginTop: '4px' }}>€ {montant}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 10 · CTA FINAL — visuel plein cadre, texte en surimpression ═══ */}
      {!role ? (
        <section style={{ position: 'relative', minHeight: '56vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: COLORS.black }}>
          <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1800&q=90" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.35)' }} />
          <Grain opacity={.05} />
          <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: 'clamp(48px, 8vw, 90px) 32px', maxWidth: '760px' }}>
            <p style={{ fontFamily: sans, fontSize: '11px', letterSpacing: '.24em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '20px' }}>Heneris</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontStyle: 'italic', fontWeight: 300, color: '#fff', lineHeight: 1.25, marginBottom: '20px' }}>
              Trouvez ce que les autres ne trouvent pas.
            </h2>
            <p style={{ fontFamily: sans, fontSize: '14px', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 36px' }}>
              Rejoignez Heneris et accédez à un réseau de personal shoppers sélectionnés pour leur expertise.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Btn to="/login" variant="gold" style={{ fontSize: '10.5px', padding: '17px 40px' }}>Commencer maintenant</Btn>
              <Btn to="/register/shopper" variant="ghost" style={{ fontSize: '10.5px', padding: '15.5px 38px' }}>Devenir shopper</Btn>
            </div>
          </div>
        </section>
      ) : (
        <div style={{ padding: '56px', background: COLORS.ivory, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <p style={{ fontFamily: serif, fontSize: '1.5rem', fontStyle: 'italic', color: COLORS.black, fontWeight: 300 }}>
            {role === 'client' ? 'Une nouvelle pièce à trouver ?' : 'De nouvelles missions vous attendent.'}
          </p>
          <Btn to={role === 'client' ? '/deposer-demande' : '/shopper/marche'} style={{ padding: '14px 36px', fontSize: '10px' }}>
            {role === 'client' ? 'Déposer une demande' : 'Voir le marché'}
          </Btn>
        </div>
      )}

      <Footer />
    </div>
  );
}

function CategoryTile({ c, height, gold, sans, serif, big }) {
  const [hover, setHover] = useState(false);
  return (
    <Link to={`/catalogue/${c.slug}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', position: 'relative', overflow: 'hidden', display: 'block', height, boxShadow: hover ? `inset 0 0 0 2px ${gold}` : 'none', transition: 'box-shadow .25s' }}>
      <img src={c.img} alt={c.label} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: hover ? 'brightness(.6)' : 'brightness(.5)', transform: hover ? 'scale(1.04)' : 'scale(1)', transition: 'transform .8s, filter .4s' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: big ? '30px' : '22px', background: 'linear-gradient(to top, rgba(0,0,0,.92), rgba(0,0,0,.35), transparent)' }}>
        <p style={{ fontFamily: serif, fontSize: big ? 'clamp(1.8rem, 3.5vw, 2.5rem)' : '1.35rem', fontWeight: 300, fontStyle: 'italic', color: '#fff', marginBottom: '8px' }}>{c.label}</p>
        <p style={{ fontFamily: sans, fontSize: '12.5px', color: 'rgba(255,255,255,.78)', fontStyle: 'italic' }}>{c.sell}</p>
      </div>
    </Link>
  );
}