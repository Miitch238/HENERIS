import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import { serif, sans, COLORS } from '../theme';

const CLIENT_STEPS = [
  { n: '01', titre: 'Créez votre compte Client', desc: "Inscription gratuite en quelques minutes. Renseignez vos informations, choisissez le rôle Client et accédez immédiatement à la plateforme." },
  { n: '02', titre: 'Déposez une demande ou explorez le catalogue', desc: "Décrivez précisément l'article que vous recherchez — marque, modèle, état, budget, délai — ou parcourez les articles déjà sourcés par nos Personal Shoppers certifiés." },
  { n: '03', titre: 'Recevez et acceptez une proposition', desc: "Un Personal Shopper expert répond à votre demande avec un prix, un délai et un message personnalisé. Échangez via la messagerie intégrée avant de valider." },
  { n: '04', titre: 'Payez en toute sécurité', desc: "Le montant est débité et placé en séquestre sécurisé. Ni le Shopper ni Hénéris n'y ont accès tant que vous n'avez pas confirmé la réception." },
  { n: '05', titre: 'Recevez votre article', desc: "Le Shopper source, authentifie et expédie votre pièce dans le délai convenu. Vous suivez chaque étape en temps réel depuis votre espace personnel." },
  { n: '06', titre: 'Confirmez la réception', desc: "À réception, inspectez l'article et confirmez sur la plateforme. Les fonds sont alors libérés au Shopper. En cas de problème, ouvrez un litige — vous êtes protégé." },
];

const SHOPPER_STEPS = [
  { n: '01', titre: 'Soumettez votre candidature', desc: "Renseignez votre dossier de certification : pièce d'identité, preuve de résidence en UE, expertise luxe, compte Instagram ou TikTok actif, coordonnées bancaires." },
  { n: '02', titre: 'Obtenez votre certification Hénéris', desc: "Hénéris examine chaque dossier manuellement sous 24 heures. Une fois certifié, vous accédez à l'espace Personal Shopper et pouvez commencer à proposer vos services." },
  { n: '03', titre: 'Répondez aux demandes ou publiez des articles', desc: "Parcourez le marché des demandes clients et faites des propositions sur les missions qui correspondent à votre expertise. Vous pouvez aussi publier des articles directement dans le catalogue." },
  { n: '04', titre: "Sourcez et authentifiez l'article", desc: "Une fois votre proposition acceptée et le paiement sécurisé, sourcez l'article auprès de vos réseaux. Vous êtes garant de son authenticité et de sa conformité à la description." },
  { n: '05', titre: 'Expédiez avec soin', desc: "Emballez l'article avec le soin que mérite une pièce de luxe. Fournissez un numéro de suivi dans les 24 heures suivant l'expédition. Assurez la pièce pour sa valeur totale." },
  { n: '06', titre: 'Recevez vos gains', desc: "Après confirmation de réception par le client, 90 % du montant de la transaction est viré sur votre compte sous 2 à 5 jours ouvrés. La commission Hénéris (10 %) est automatiquement déduite." },
];

const GUARANTEES = [
  { titre: 'Paiement sécurisé', desc: 'Fonds en séquestre — protégés jusqu\u2019à confirmation de livraison.' },
  { titre: 'Shoppers certifiés', desc: 'Chaque Personal Shopper est vérifié manuellement par Hénéris avant toute activation.' },
  { titre: 'Support dédié', desc: 'Une équipe disponible pour médier tout litige et vous accompagner à chaque étape.' },
  { titre: 'Commission transparente', desc: '10 % affiché avant validation — aucuns frais cachés, aucune surprise.' },
];

const MENU_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Catégories', to: '/catalogue' },
  { label: 'Experts', to: '/personal-shoppers' },
  { label: 'Comment ça marche', to: '/how-it-works' },
  { label: 'Avis clients', to: '/avis' },
];

export default function HowItWorks() {
  const [tab, setTab] = useState('client');
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const profileRef = useRef(null);
  const lastScroll = useRef(0);
  const navigate = useNavigate();

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
  const STEPS = tab === 'client' ? CLIENT_STEPS : SHOPPER_STEPS;

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
          >Faire une demande</Link>
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

      {/* HERO */}
      <div style={{ marginTop: '70px', background: COLORS.ivory, padding: 'clamp(72px, 10vw, 120px) clamp(32px, 6vw, 80px) clamp(56px, 8vw, 90px)', textAlign: 'center' }}>
        <p style={{ fontFamily: sans, fontSize: '12px', letterSpacing: '.3em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '18px' }}>La plateforme</p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, marginBottom: '20px' }}>Comment ça marche</h1>
        <p style={{ fontFamily: sans, fontSize: '15px', color: COLORS.stone, lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 32px' }}>
          Hénéris connecte les amateurs de luxe avec des experts certifiés qui sourcent, authentifient et livrent les pièces les plus rares.
        </p>
        <Link to="/register/client"
          style={{ fontFamily: sans, fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#fff', background: COLORS.gold, padding: '17px 40px', textDecoration: 'none', display: 'inline-block', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.black}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}
        >Commencer — c'est gratuit</Link>
      </div>

      {/* GARANTIES */}
      <div style={{ padding: 'clamp(48px, 7vw, 72px) clamp(32px, 6vw, 80px)', background: COLORS.white, borderBottom: '.5px solid #f0f0f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
          {GUARANTEES.map((g, i) => (
            <div key={i} style={{ textAlign: 'center', borderTop: `2px solid ${COLORS.gold}`, paddingTop: '20px' }}>
              <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', color: COLORS.black, marginBottom: '8px' }}>{g.titre}</p>
              <p style={{ fontFamily: sans, fontSize: '12.5px', color: COLORS.stone, lineHeight: 1.6 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ONGLETS + ÉTAPES */}
      <div style={{ padding: 'clamp(64px, 9vw, 100px) clamp(32px, 6vw, 80px)', background: COLORS.white }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '56px' }}>
          {[['client', 'Je suis Client'], ['shopper', 'Je suis Personal Shopper']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                fontFamily: sans, fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', padding: '14px 30px', cursor: 'pointer',
                background: 'none', border: 'none',
                color: tab === key ? COLORS.black : '#999', fontWeight: tab === key ? 400 : 300,
                borderBottom: tab === key ? `1.5px solid ${COLORS.black}` : '1.5px solid transparent',
                transition: 'all .2s',
              }}
              onMouseEnter={e => { if (tab !== key) { e.currentTarget.style.color = COLORS.black; e.currentTarget.style.borderBottomColor = COLORS.gold; } }}
              onMouseLeave={e => { if (tab !== key) { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderBottomColor = 'transparent'; } }}
            >{label}</button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 3.6vw, 2.6rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, marginBottom: '12px' }}>
            {tab === 'client' ? 'Le parcours Client' : 'Le parcours Personal Shopper'}
          </h2>
          <p style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', color: COLORS.stone }}>
            {tab === 'client' ? 'De la demande à la livraison — sécurisé, transparent, garanti.' : 'Monétisez votre expertise du luxe et percevez 90 % de chaque transaction.'}
          </p>
        </div>

        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', gap: '28px', paddingBottom: i < STEPS.length - 1 ? '28px' : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: serif, fontSize: '1.8rem', fontStyle: 'italic', fontWeight: 300, color: COLORS.gold, lineHeight: 1 }}>{s.n}</span>
                {i < STEPS.length - 1 && <div style={{ width: '1px', flex: 1, background: COLORS.sand, marginTop: '10px' }} />}
              </div>
              <div style={{ paddingBottom: i < STEPS.length - 1 ? '20px' : 0 }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 300, color: COLORS.black, marginBottom: '8px' }}>{s.titre}</h3>
                <p style={{ fontFamily: sans, fontSize: '13.5px', color: COLORS.stone, lineHeight: 1.7, maxWidth: '520px' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '52px' }}>
          <Link to={tab === 'client' ? '/register/client' : '/register/shopper'}
            style={{ fontFamily: sans, fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', background: COLORS.gold, padding: '17px 38px', textDecoration: 'none', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.black}
            onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}
          >{tab === 'client' ? 'Créer un compte Client' : 'Devenir Personal Shopper'}</Link>
          <Link to="/faq"
            style={{ fontFamily: sans, fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: COLORS.black, background: 'transparent', border: `1.5px solid ${COLORS.black}`, padding: '15.5px 36px', textDecoration: 'none', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = COLORS.black; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.black; }}
          >Voir la FAQ</Link>
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ padding: 'clamp(64px, 9vw, 100px) clamp(32px, 6vw, 80px)', background: COLORS.sand, textAlign: 'center' }}>
        <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 300, fontStyle: 'italic', color: COLORS.black, marginBottom: '14px' }}>Prêt à commencer ?</h2>
        <p style={{ fontFamily: sans, fontSize: '14px', color: COLORS.stone, marginBottom: '32px' }}>Rejoignez la première plateforme européenne de personal shopping luxe.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register/client"
            style={{ fontFamily: sans, fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', background: COLORS.black, padding: '17px 38px', textDecoration: 'none', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.gold}
            onMouseLeave={e => e.currentTarget.style.background = COLORS.black}
          >Je suis Client</Link>
          <Link to="/register/shopper"
            style={{ fontFamily: sans, fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', background: COLORS.gold, padding: '17px 38px', textDecoration: 'none', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.black}
            onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}
          >Je suis Personal Shopper</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
