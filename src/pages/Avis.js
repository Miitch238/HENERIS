import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import { serif, sans, COLORS } from '../theme';

const MENU_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Catégories', to: '/catalogue' },
  { label: 'Experts', to: '/personal-shoppers' },
  { label: 'Comment ça marche', to: '/how-it-works' },
  { label: 'Avis clients', to: '/avis' },
];

const TEMOIGNAGES = [
  {
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=90',
    nom: 'Thomas R.', ville: 'Paris', etoiles: 5,
    piece: 'Patek Philippe Nautilus 5711',
    expert: 'Alexandre D. — Genève',
    texte: "J'avais cherché cette Nautilus pendant 8 mois. Alexandre l'a trouvée avec box et papers complets en moins de 2 semaines. Prix cohérent avec le marché, état parfait. Je ne cherche plus ailleurs.",
  },
  {
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=90',
    nom: 'Marie-Claire B.', ville: 'Lyon', etoiles: 5,
    piece: 'Hermès Birkin 25 Ghillies',
    expert: 'Sophie M. — Paris',
    texte: "Sophie a trouvé mon Birkin 25 Ghillies en 4 jours depuis Paris. Elle m'a envoyé 23 photos avant validation. La pièce était exactement conforme à la description. Le processus d'escrow m'a rassurée dès le départ.",
  },
  {
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=90',
    nom: 'Julien M.', ville: 'Bordeaux', etoiles: 5,
    piece: 'Air Jordan 1 Chicago OG 2015',
    expert: 'Karim B. — Dubai',
    texte: "Jordan 1 Chicago en taille 44, deadstock, trouvée en 48h depuis Dubai. Karim a fourni le certificat d'authenticité et assuré le suivi jusqu'à livraison à Bordeaux. Exactement ce que je cherchais depuis des mois.",
  },
  {
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=90',
    nom: 'Camille V.', ville: 'Bordeaux', etoiles: 5,
    piece: 'Cartier Love Bracelet Or Rose',
    expert: 'Clara V. — Paris',
    texte: "Clara a sourcé mon bracelet Love en or rose en 5 jours. Certificat d'authenticité fourni, état neuf. La communication tout au long de la mission était claire et rassurante. Je recommande vivement.",
  },
  {
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=90',
    nom: 'Pierre-Antoine L.', ville: 'Monaco', etoiles: 5,
    piece: 'Rolex Daytona 116500LN',
    expert: 'Alexandre D. — Genève',
    texte: "La Daytona était introuvable depuis plusieurs mois dans les boutiques officielles. Alexandre l'a obtenue via son réseau suisse en moins de 2 semaines. Prix juste, état impeccable. Service d'un autre niveau.",
  },
  {
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=90',
    nom: 'Sarah K.', ville: 'Paris', etoiles: 5,
    piece: 'Hermès Kelly 28 Retourné',
    expert: 'Sophie M. — Paris',
    texte: "Après 6 mois d'attente en boutique, Sophie a trouvé ma Kelly 28 en cuir Swift noir en une semaine. Authentification vérifiée, photos détaillées, livraison sécurisée. Une expérience irréprochable.",
  },
];

const STATS = [
  { n: '540+', label: 'Pièces sourcées' },
  { n: '96%',  label: 'Satisfaction client' },
  { n: '81',   label: 'Experts certifiés' },
  { n: '42',   label: 'Pays couverts' },
];

export default function Avis() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [role, setRole]               = useState(null);
  const [navVisible, setNavVisible]   = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser]               = useState(null);
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
    setUser(null); setRole(null);
    window.location.href = '/#/';
  };

  const firstName = user?.user_metadata?.first_name || '';
  const lastName  = user?.user_metadata?.last_name  || '';
  const initials  = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() : null;
  const demandeTo = role === 'client' ? '/deposer-demande' : '/login';

  const menuItems = role === 'shopper' ? [
    { label: 'Mon profil', to: '/shopper/profil' }, { label: 'Mes gains', to: '/shopper/gains' },
  ] : role === 'client' ? [
    { label: 'Mon profil', to: '/client/profil' }, { label: 'Mes demandes', to: '/client/suivi' },
  ] : [];

  const dashLink = role === 'shopper' ? '/shopper/home' : role === 'client' ? '/client/home' : '/login';

  return (
    <div style={{ background: '#fff', fontFamily: sans, minHeight: '100vh' }}>

      {/* ── DRAWER ── */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '340px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '32px 40px 28px', borderBottom: '.5px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Logo to={null} color="dark" size="sm" />
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <nav style={{ flex: 1, padding: '16px 0' }}>
              {MENU_LINKS.map(({ label, to }) => (
                <Link key={label} to={to} onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', padding: '18px 40px', fontFamily: serif, fontSize: '2rem', fontWeight: 300, fontStyle: 'italic', color: to === '/avis' ? COLORS.gold : COLORS.black, textDecoration: 'none', borderBottom: '.5px solid #f8f8f8', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = COLORS.gold}
                  onMouseLeave={e => e.currentTarget.style.color = to === '/avis' ? COLORS.gold : COLORS.black}
                >{label}</Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 40px', height: '70px', background: '#fff', position: 'fixed', top: navVisible ? '0' : '-70px', left: 0, right: 0, zIndex: 1000, borderBottom: '.5px solid #f0f0f0', transition: 'top .3s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: COLORS.black, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <span style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#999', fontWeight: 300 }}>Menu</span>
          </button>
        </div>
        <Logo to="/" color="dark" size="md" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end' }}>
          <Link to={demandeTo}
            style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#fff', background: COLORS.gold, padding: '10px 22px', textDecoration: 'none', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.black}
            onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}
          >Déposer une demande</Link>
          {role && (
            <>
              <a href="/#/messages" style={{ color: '#666', display: 'flex', textDecoration: 'none' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></a>
              <a href="/#/notifications" style={{ color: '#666', display: 'flex', textDecoration: 'none' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></a>
              <a href="/#/favoris" style={{ color: '#666', display: 'flex', textDecoration: 'none' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></a>
            </>
          )}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button onClick={() => setProfileOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#666' }}>
              {initials
                ? <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: COLORS.black, color: COLORS.gold, fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials}</span>
                : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              }
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
                        <a key={label} href={`/#${to}`} onClick={() => setProfileOpen(false)}
                          style={{ display: 'block', padding: '10px 18px', fontFamily: sans, fontSize: '11px', fontWeight: 300, color: COLORS.black, textDecoration: 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >{label}</a>
                      ))}
                      <Link to={dashLink} onClick={() => setProfileOpen(false)}
                        style={{ display: 'block', padding: '10px 18px', fontFamily: sans, fontSize: '11px', fontWeight: 300, color: COLORS.black, textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >Mon espace</Link>
                    </div>
                    <div style={{ borderTop: '.5px solid #ececec', padding: '6px 0' }}>
                      <button onClick={handleLogout}
                        style={{ display: 'block', width: '100%', padding: '10px 18px', fontFamily: sans, fontSize: '11px', fontWeight: 300, color: '#999', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >Se déconnecter</button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '8px 0' }}>
                    {[['Se connecter', '/login', 400], ['Créer un compte client', '/register/client', 300], ['Devenir shopper', '/register/shopper', 300]].map(([l, t, w], i) => (
                      <Link key={l} to={t} onClick={() => setProfileOpen(false)}
                        style={{ display: 'block', padding: '12px 18px', fontFamily: sans, fontSize: '11px', fontWeight: w, color: w === 400 ? COLORS.black : '#666', textDecoration: 'none', borderTop: i === 2 ? '.5px solid #f5f5f5' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
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
      <div style={{ padding: '140px 48px 64px', borderBottom: '.5px solid #ececec', boxSizing: 'border-box' }}>
        <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.28em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '12px' }}>540+ clients satisfaits</p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.6rem, 5vw, 4rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, marginBottom: '14px', lineHeight: 1.1 }}>
          Ce que nos clients disent.
        </h1>
        <p style={{ fontFamily: serif, fontSize: '1.15rem', fontStyle: 'italic', color: COLORS.stone, fontWeight: 300, maxWidth: '520px' }}>
          Chaque avis correspond à une mission réelle, vérifiée et livrée par l'un de nos experts.
        </p>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: COLORS.ivory, padding: '0 48px' }}>
        <div style={{ display: 'flex', maxWidth: '960px', margin: '0 auto' }}>
          {STATS.map(({ n, label }, i) => (
            <div key={label} style={{ flex: 1, padding: '28px 24px', borderRight: i < 3 ? `.5px solid ${COLORS.sand}` : 'none', borderTop: `2px solid ${COLORS.gold}`, textAlign: 'left' }}>
              <p style={{ fontFamily: serif, fontSize: '2rem', fontWeight: 300, fontStyle: 'italic', color: COLORS.gold, lineHeight: 1, marginBottom: '4px' }}>{n}</p>
              <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: COLORS.stone }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── AVIS ── */}
      <div style={{ padding: '80px 48px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4px', maxWidth: '1100px', margin: '0 auto' }}>
          {TEMOIGNAGES.map(({ photo, texte, nom, ville, piece, expert }) => (
            <div key={nom} style={{ padding: '32px 28px', background: '#fff', borderTop: `2px solid ${COLORS.gold}`, display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: COLORS.gold, fontSize: '13px' }}>★</span>)}
              </div>

              <p style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 300, color: '#333', lineHeight: 1.8, flex: 1 }}>« {texte} »</p>

              <div style={{ background: COLORS.ivory, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontFamily: sans, fontSize: '9px', color: '#555', letterSpacing: '.08em', fontWeight: 400 }}>{piece}</span>
                </div>
                <span style={{ fontFamily: sans, fontSize: '9px', color: COLORS.stone, paddingLeft: '16px' }}>Expert : {expert}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '.5px solid #ececec', paddingTop: '16px' }}>
                <img src={photo} alt={nom} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }} />
                <div>
                  <p style={{ fontFamily: sans, fontSize: '11px', fontWeight: 500, color: COLORS.black, marginBottom: '2px' }}>{nom}</p>
                  <p style={{ fontFamily: sans, fontSize: '10px', color: COLORS.stone }}>{ville}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '64px 48px', background: COLORS.sand, borderTop: '.5px solid #ececec', boxSizing: 'border-box' }}>
        <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.28em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '14px' }}>Prêt à vous lancer ?</p>
        <h2 style={{ fontFamily: serif, fontSize: '2.4rem', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, marginBottom: '14px' }}>
          Déposez votre demande gratuitement.
        </h2>
        <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', color: COLORS.stone, fontWeight: 300, maxWidth: '440px', lineHeight: 1.8, marginBottom: '32px' }}>
          Nos experts vous répondent sous 48h avec une proposition sur mesure.
        </p>
        <Link to={demandeTo}
          style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#fff', background: COLORS.gold, padding: '16px 48px', textDecoration: 'none', display: 'inline-block', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.black}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}
        >Déposer une demande</Link>
      </div>

      <Footer />
    </div>
  );
}