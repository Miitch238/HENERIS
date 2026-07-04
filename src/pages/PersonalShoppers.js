import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import { serif, sans, COLORS } from '../theme';

const FILTRES = [
  { label: 'Tous', slug: 'tous' },
  { label: 'Maroquinerie', slug: 'maroquinerie' },
  { label: 'Horlogerie', slug: 'horlogerie' },
  { label: 'Joaillerie', slug: 'joaillerie' },
  { label: 'Sneakers', slug: 'sneakers' },
];

const EXPERTS = [
  {
    name: 'Sophie M.',
    role: 'Experte en maroquinerie de luxe',
    categorie: 'maroquinerie',
    spec: 'Hermès · Chanel · Louis Vuitton · Dior',
    city: 'Paris, France',
    note: '4.9', missions: '143',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&q=90',
    bio: "Ancienne responsable de boutique Hermès Faubourg Saint-Honoré, Sophie dispose d'un réseau unique dans la maroquinerie de luxe parisienne. Elle a sourcé plus de 140 pièces pour des clients du monde entier.",
    specialites: ['Birkin', 'Kelly', 'Constance', 'Classic Flap', 'Timeless CC'],
    langues: ['Français', 'Anglais', 'Italien'],
    delai: '3 à 5 jours en moyenne',
  },
  {
    name: 'Alexandre D.',
    role: "Spécialiste horlogerie d'exception",
    categorie: 'horlogerie',
    spec: 'Rolex · Patek Philippe · Audemars Piguet',
    city: 'Genève, Suisse',
    note: '4.8', missions: '89',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&q=90',
    bio: "Basé à Genève, Alexandre travaille depuis 10 ans dans le marché secondaire horloger haut de gamme. Son réseau de collectionneurs et revendeurs certifiés lui permet d'accéder à des pièces généralement introuvables.",
    specialites: ['Nautilus', 'Royal Oak', 'Submariner', 'Daytona', 'Sky-Dweller'],
    langues: ['Français', 'Anglais', 'Allemand'],
    delai: '5 à 14 jours en moyenne',
  },
  {
    name: 'Clara V.',
    role: 'Conseillère privée joaillerie',
    categorie: 'joaillerie',
    spec: 'Cartier · Van Cleef & Arpels · Bulgari',
    city: 'Paris, France',
    note: '5.0', missions: '211',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=700&q=90',
    bio: 'Gemmologue certifiée et ancienne consultante pour des maisons de ventes aux enchères, Clara expertise chaque pièce avec rigueur. Elle accompagne ses clients dans leurs acquisitions les plus précieuses.',
    specialites: ['Bague Love', 'Alhambra', 'Solitaires', 'Parures vintage', 'Pierres rares'],
    langues: ['Français', 'Anglais'],
    delai: '3 à 7 jours en moyenne',
  },
  {
    name: 'Karim B.',
    role: 'Expert sneakers & streetwear premium',
    categorie: 'sneakers',
    spec: 'Air Jordan · Yeezy · Off-White · New Balance',
    city: 'Dubai, Émirats Arabes Unis',
    note: '4.9', missions: '178',
    img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=700&q=90',
    bio: 'Depuis Dubai, Karim accède aux marchés asiatiques et américains des sneakers rares avec une rapidité inégalée. Il authentifie chaque paire et fournit des certificats vérifiés par des services reconnus.',
    specialites: ['Jordan 1 OG', 'Yeezy 350 V2', 'Dunk SB', 'Off-White Nike', 'Travis Scott'],
    langues: ['Français', 'Anglais', 'Arabe'],
    delai: '24h à 5 jours en moyenne',
  },
];

const AVANTAGES = [
  { titre: 'Missions qualifiées',  texte: 'Chaque demande est filtrée par notre équipe avant transmission. Vous travaillez uniquement sur des projets sérieux avec des clients vérifiés.' },
  { titre: 'Fixez vos honoraires', texte: 'Vous proposez librement votre rémunération. Heneris prélève une commission uniquement sur les transactions validées.' },
  { titre: 'Paiement sécurisé',    texte: "Les fonds sont conservés en séquestre. Libérés automatiquement après confirmation du client. Zéro risque d'impayé." },
  { titre: 'Flexibilité totale',   texte: "Choisissez les missions qui correspondent à votre expertise. Aucun engagement de volume ni de disponibilité." },
  { titre: 'Support dédié',        texte: 'Notre équipe vous accompagne sur chaque mission : logistique, documentation, relation client et résolution de litiges.' },
  { titre: 'Réseau exclusif',      texte: 'Intégrez un réseau de conseillers triés sur le volet et accédez à des opportunités de collaboration inter-experts.' },
];

const MENU_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Catégories', to: '/catalogue' },
  { label: 'Experts', to: '/personal-shoppers' },
  { label: 'Comment ça marche', to: '/how-it-works' },
  { label: 'Avis clients', to: '/avis' },
];

const PAGE_SIZE = 6;

export default function PersonalShoppers() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState('tous');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const profileRef = useRef(null);
  const lastScroll = useRef(0);

  useEffect(() => {
    const getRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);
      const metaRole = session.user.user_metadata?.role;
      if (metaRole) { setRole(metaRole); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', session.user.id).single();
      if (profile?.role) setRole(profile.role);
    };
    getRole();
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
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

  const demandeTo = role === 'client' ? '/deposer-demande' : '/login';
  const dashLink = role === 'shopper' ? '/shopper/home' : role === 'client' ? '/client/home' : role === 'admin' ? '/admin/dashboard' : '/login';
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const initials = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() : null;
  const menuItems = role === 'shopper' ? [{ label: 'Mon profil', to: '/shopper/profil' }, { label: 'Mes gains', to: '/shopper/gains' }]
    : role === 'client' ? [{ label: 'Mon profil', to: '/client/profil' }, { label: 'Mes demandes', to: '/client/suivi' }] : [];

  const navTop = navVisible ? '0px' : '-70px';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EXPERTS.filter(e => {
      const matchCat = filtre === 'tous' || e.categorie === filtre;
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.spec.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, filtre]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div style={{ background: '#fff', fontFamily: sans }}>

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
                  style={{ display: 'block', padding: '18px 40px', fontFamily: serif, fontSize: '2rem', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, textDecoration: 'none', borderBottom: '.5px solid #f8f8f8', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = COLORS.gold} onMouseLeave={e => e.currentTarget.style.color = COLORS.black}
                >{label}</Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 40px', height: '70px', background: '#fff', position: 'fixed', top: navTop, left: 0, right: 0, zIndex: 1000, borderBottom: '.5px solid #f0f0f0', transition: 'top .3s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: COLORS.black, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <span style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#999', fontWeight: 300 }}>Menu</span>
          </button>
        </div>
        <Logo to="/" color="dark" size="md" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end' }}>
          <Link to={demandeTo}
            style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#fff', background: COLORS.gold, padding: '10px 22px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
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
            <button onClick={() => initials ? setProfileOpen(v => !v) : window.location.href = '/#/login'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#666' }}>
              {initials
                ? <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: COLORS.black, color: COLORS.gold, fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials}</span>
                : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            </button>
            {profileOpen && initials && (
              <div style={{ position: 'absolute', top: '48px', right: 0, width: '220px', background: '#fff', border: '.5px solid #ececec', boxShadow: '0 8px 32px rgba(0,0,0,.08)', zIndex: 200 }}>
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
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══ RÉPERTOIRE — recherche + filtres + grille ═══ */}
      <div style={{ marginTop: '70px', padding: 'clamp(56px, 8vw, 80px) clamp(32px, 6vw, 48px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontFamily: sans, fontSize: '12px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '14px' }}>L'équipe</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black }}>Rencontrez nos experts.</h2>
        </div>

        {/* Centre de recherche */}
        <div style={{ maxWidth: '640px', margin: '0 auto 48px', background: COLORS.ivory, border: `1px solid ${COLORS.sand}`, padding: '24px 28px' }}>
          <div style={{ position: 'relative', marginBottom: '18px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.stone} strokeWidth="1.8"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              placeholder="Rechercher un shopper, une ville, une marque..."
              style={{ width: '100%', boxSizing: 'border-box', fontFamily: sans, fontSize: '13.5px', color: COLORS.black, padding: '14px 40px 14px 40px', border: `1px solid ${COLORS.sand}`, outline: 'none', background: '#fff', transition: 'border-color .2s' }}
              onFocus={e => e.currentTarget.style.borderColor = COLORS.gold}
              onBlur={e => e.currentTarget.style.borderColor = COLORS.sand}
            />
            {search && (
              <button onClick={() => { setSearch(''); setVisibleCount(PAGE_SIZE); }}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.stone, display: 'flex', padding: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {FILTRES.map(f => (
              <button key={f.slug} onClick={() => { setFiltre(f.slug); setVisibleCount(PAGE_SIZE); }}
                style={{
                  fontFamily: sans, fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer',
                  background: filtre === f.slug ? COLORS.black : 'transparent', color: filtre === f.slug ? '#fff' : COLORS.stone,
                  border: `1px solid ${filtre === f.slug ? COLORS.black : COLORS.sand}`, transition: 'all .2s',
                }}
              >{f.label}</button>
            ))}
          </div>
          <p style={{ fontFamily: sans, fontSize: '10.5px', color: COLORS.stone, textAlign: 'center', marginTop: '16px' }}>
            {filtered.length} expert{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          </p>
        </div>

        {visible.length === 0 ? (
          <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', color: COLORS.stone, textAlign: 'center', padding: '48px 0' }}>
            Aucun shopper ne correspond à votre recherche pour le moment.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '4px', maxWidth: '1200px', margin: '0 auto' }}>
            {visible.map(({ name, role: expertRole, city, note, missions, img }) => (
              <div key={name} style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
                <img src={img} alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform .6s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.1) 60%, transparent)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '22px' }}>
                  <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '6px' }}>{expertRole}</p>
                  <p style={{ fontFamily: serif, fontSize: '1.3rem', fontWeight: 300, fontStyle: 'italic', color: '#fff', marginBottom: '5px' }}>{name}</p>
                  <p style={{ fontFamily: sans, fontSize: '10px', color: 'rgba(255,255,255,.75)', marginBottom: '12px' }}>{city} · ★ {note} · {missions} missions</p>
                  <Link to="/login"
                    style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff', borderBottom: '.5px solid rgba(255,255,255,.6)', paddingBottom: '2px', textDecoration: 'none' }}
                  >Voir le profil →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charger plus */}
        {visibleCount < filtered.length && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
              style={{ fontFamily: sans, fontSize: '10.5px', letterSpacing: '.16em', textTransform: 'uppercase', color: COLORS.black, background: 'transparent', border: `1.5px solid ${COLORS.black}`, padding: '15px 40px', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.black; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.black; }}
            >Charger plus de shoppers</button>
          </div>
        )}
      </div>

      {/* ── REJOINDRE ── */}
      <div style={{ padding: 'clamp(56px, 8vw, 80px) clamp(32px, 6vw, 48px)', background: COLORS.sand, boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontFamily: sans, fontSize: '11px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '14px' }}>Vous êtes expert ?</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.9rem, 3.6vw, 2.4rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, marginBottom: '14px' }}>Rejoignez le réseau Heneris.</h2>
          <p style={{ fontFamily: sans, fontSize: '13.5px', color: COLORS.stone, maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Vous avez un réseau, une expertise et la capacité de sourcer des pièces de luxe ? Voici ce que nous vous offrons.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3px', maxWidth: '980px', margin: '0 auto 40px' }}>
          {AVANTAGES.map(({ titre, texte }) => (
            <div key={titre} style={{ padding: '28px 24px', background: COLORS.white, display: 'flex', flexDirection: 'column', gap: '10px', borderTop: `2px solid ${COLORS.gold}` }}>
              <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: COLORS.black, fontWeight: 500 }}>{titre}</p>
              <p style={{ fontFamily: sans, fontSize: '12px', color: COLORS.stone, lineHeight: 1.6 }}>{texte}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/register/shopper"
            style={{ fontFamily: sans, fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', background: COLORS.gold, padding: '16px 46px', textDecoration: 'none', display: 'inline-block', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.black}
            onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}
          >Postuler comme expert</Link>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: 'clamp(56px, 8vw, 80px) clamp(32px, 6vw, 48px)', textAlign: 'center', boxSizing: 'border-box' }}>
        <p style={{ fontFamily: sans, fontSize: '11px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '16px' }}>Prêt à commencer ?</p>
        <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, marginBottom: '16px' }}>
          Confiez votre recherche à nos experts.
        </h2>
        <p style={{ fontFamily: sans, fontSize: '13.5px', color: COLORS.stone, lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 32px' }}>
          Déposez votre demande gratuitement. Nos experts vous répondent sous 48h.
        </p>
        <Link to={demandeTo}
          style={{ fontFamily: sans, fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', background: COLORS.gold, padding: '16px 44px', textDecoration: 'none', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.black}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}
        >Déposer une demande</Link>
      </div>

      <Footer />
    </div>
  );
}
