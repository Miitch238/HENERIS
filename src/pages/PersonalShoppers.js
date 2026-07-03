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

const EXPERTS = [
  {
    name: 'Sophie M.',
    role: 'Experte en maroquinerie de luxe',
    spec: 'Hermès · Chanel · Louis Vuitton · Dior',
    city: 'Paris, France',
    note: '4.9', missions: '143',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&q=90',
    bio: 'Ancienne responsable de boutique Hermès Faubourg Saint-Honoré, Sophie dispose d\'un réseau unique dans la maroquinerie de luxe parisienne. Elle a sourcé plus de 140 pièces pour des clients du monde entier.',
    specialites: ['Birkin', 'Kelly', 'Constance', 'Classic Flap', 'Timeless CC'],
    langues: ['Français', 'Anglais', 'Italien'],
    delai: '3 à 5 jours en moyenne',
  },
  {
    name: 'Alexandre D.',
    role: "Spécialiste horlogerie d'exception",
    spec: 'Rolex · Patek Philippe · Audemars Piguet',
    city: 'Genève, Suisse',
    note: '4.8', missions: '89',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&q=90',
    bio: 'Basé à Genève, Alexandre travaille depuis 10 ans dans le marché secondaire horloger haut de gamme. Son réseau de collectionneurs et revendeurs certifiés lui permet d\'accéder à des pièces généralement introuvables.',
    specialites: ['Nautilus', 'Royal Oak', 'Submariner', 'Daytona', 'Sky-Dweller'],
    langues: ['Français', 'Anglais', 'Allemand'],
    delai: '5 à 14 jours en moyenne',
  },
  {
    name: 'Clara V.',
    role: 'Conseillère privée joaillerie',
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
  { titre: 'Paiement sécurisé',   texte: 'Les fonds sont conservés en escrow Stripe. Libérés automatiquement après confirmation du client. Zéro risque d\'impayé.' },
  { titre: 'Flexibilité totale',   texte: 'Choisissez les missions qui correspondent à votre expertise. Aucun engagement de volume ni de disponibilité.' },
  { titre: 'Support dédié',        texte: 'Notre équipe vous accompagne sur chaque mission : logistique, documentation, relation client et résolution de litiges.' },
  { titre: 'Réseau exclusif',      texte: 'Intégrez un réseau de conseillers triés sur le volet et accédez à des opportunités de collaboration inter-experts.' },
];

export default function PersonalShoppers() {
  const [role, setRole]             = useState(null);
  const [navVisible, setNavVisible] = useState(true);
  const lastScroll                  = useRef(0);

  useEffect(() => {
    const getRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const metaRole = session.user.user_metadata?.role;
      if (metaRole) { setRole(metaRole); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', session.user.id).single();
      if (profile?.role) setRole(profile.role);
    };
    getRole();
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

  const navLinkStyle = {
    fontFamily: sans, fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase',
    color: '#1a1a1a', textDecoration: 'none', fontWeight: 300,
    borderBottom: '1px solid transparent', transition: 'border-color .2s, color .2s',
  };

  return (
    <div style={{ background: '#fff', fontFamily: sans }}>

      {/* ── NAV ── */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: '70px', background: '#fff', position: 'fixed', top: navVisible ? '0' : '-70px', left: 0, right: 0, zIndex: 1000, borderBottom: '.5px solid #f0f0f0', transition: 'top .3s cubic-bezier(.4,0,.2,1)' }}>
        <Logo to="/" />
        <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {[
            { label: 'Accueil',           to: '/' },
            { label: 'Catégories',        to: '/catalogue' },
            { label: 'Personal Shoppers', to: '/personal-shoppers' },
            { label: 'Notre méthode',     to: '/how-it-works' },
          ].map(({ label, to }) => (
            <Link key={label} to={to}
              style={{ ...navLinkStyle, ...(to === '/personal-shoppers' ? { color: '#C9A84C', borderBottomColor: '#C9A84C' } : {}) }}
              onMouseEnter={e => { e.currentTarget.style.borderBottomColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C'; }}
              onMouseLeave={e => {
                if (to !== '/personal-shoppers') {
                  e.currentTarget.style.borderBottomColor = 'transparent';
                  e.currentTarget.style.color = '#1a1a1a';
                }
              }}
            >{label}</Link>
          ))}
        </nav>
        <Link to={role === 'client' ? '/deposer-demande' : '/login'}
          style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#fff', background: '#1a1a1a', padding: '10px 22px', textDecoration: 'none', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#C9A84C'}
          onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
        >Déposer une demande</Link>
      </header>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: '520px', overflow: 'hidden', marginTop: '70px' }}>
        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=90" alt="Personal Shoppers Heneris"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', filter: 'brightness(.42)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 60px' }}>
          <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.38em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
            Réseau d'experts certifiés
          </p>
      <h1>Notre vitrine de shoppers.</h1>
          <p style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,.65)', lineHeight: 1.9, maxWidth: '540px' }}>
            Chaque expert est sélectionné pour sa connaissance du marché, son réseau et son intégrité. Ils trouvent ce que vous ne pouvez pas trouver seul.
          </p>
        </div>
      </div>

      {/* ── INTRO ── */}
      <div style={{ padding: '64px 48px', borderBottom: '.5px solid #ececec', maxWidth: '800px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          <div>
            <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.28em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '14px' }}>Notre sélection</p>
            <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.9 }}>
              Heneris ne fait pas appel à des prestataires génériques. Chaque expert passe par un processus de sélection rigoureux : vérification de son réseau, de ses références et de ses connaissances.
            </p>
          </div>
          <div>
            <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.28em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '14px' }}>Notre engagement</p>
            <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.9 }}>
              Ils sont évalués après chaque mission par les clients. Leur note et leur historique sont visibles. Aucun expert ne reste dans le réseau sans maintenir un niveau d'excellence.
            </p>
          </div>
        </div>
      </div>

      {/* ── LISTE EXPERTS ── */}
      <div style={{ padding: '80px 48px', borderBottom: '.5px solid #ececec', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.32em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '14px' }}>L'équipe</p>
          <h2 style={{ fontFamily: serif, fontSize: '2.6rem', fontWeight: 300, fontStyle: 'italic', color: '#1a1a1a' }}>Rencontrez nos experts.</h2>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {EXPERTS.map(({ name, role: expertRole, spec, city, note, missions, img, bio, specialites, langues, delai }, i) => (
            <div key={name} style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '0', background: i % 2 === 0 ? '#fff' : '#fafaf8' }}>
              {/* Image */}
              <div style={{ height: '360px', overflow: 'hidden' }}>
                <img src={img} alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'grayscale(8%)', transition: 'transform .6s, filter .4s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.filter = 'grayscale(0%)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'grayscale(8%)'; }}
                />
              </div>
              {/* Contenu */}
              <div style={{ padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                <div>
                  <p style={{ fontFamily: sans, fontSize: '7.5px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '6px', fontWeight: 400 }}>{expertRole}</p>
                  <h3 style={{ fontFamily: serif, fontSize: '2rem', fontWeight: 300, color: '#1a1a1a', marginBottom: '4px' }}>{name}</h3>
                  <p style={{ fontFamily: sans, fontSize: '10px', color: '#bbb', fontWeight: 300 }}>{city} · ★ {note} · {missions} missions réalisées</p>
                </div>

                <p style={{ fontFamily: serif, fontSize: '1rem', fontStyle: 'italic', color: '#666', lineHeight: 1.9, fontWeight: 300 }}>{bio}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
                  <div>
                    <p style={{ fontFamily: sans, fontSize: '7.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '6px' }}>Spécialités</p>
                    <p style={{ fontFamily: sans, fontSize: '10px', color: '#555', fontWeight: 300, lineHeight: 1.7 }}>{specialites.join(' · ')}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: sans, fontSize: '7.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '6px' }}>Langues</p>
                    <p style={{ fontFamily: sans, fontSize: '10px', color: '#555', fontWeight: 300, lineHeight: 1.7 }}>{langues.join(', ')}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: sans, fontSize: '7.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '6px' }}>Délai moyen</p>
                    <p style={{ fontFamily: sans, fontSize: '10px', color: '#555', fontWeight: 300 }}>{delai}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: sans, fontSize: '7.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '6px' }}>Marques</p>
                    <p style={{ fontFamily: sans, fontSize: '10px', color: '#555', fontWeight: 300, lineHeight: 1.7 }}>{spec}</p>
                  </div>
                </div>

                <Link to={`/login`}
                  style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#1a1a1a', borderBottom: '.5px solid #1a1a1a', paddingBottom: '2px', textDecoration: 'none', alignSelf: 'flex-start', transition: 'color .2s, border-color .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderBottomColor = '#C9A84C'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.borderBottomColor = '#1a1a1a'; }}
                >Déposer une demande à {name.split(' ')[0]} →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── REJOINDRE ── */}
      <div style={{ padding: '80px 48px', background: '#1a1a1a', borderBottom: '.5px solid #2a2a2a', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.32em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '14px' }}>Vous êtes expert ?</p>
          <h2 style={{ fontFamily: serif, fontSize: '2.4rem', fontWeight: 300, fontStyle: 'italic', color: '#fff', marginBottom: '14px' }}>Rejoignez le réseau Heneris.</h2>
          <p style={{ fontFamily: serif, fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,.5)', fontWeight: 300, maxWidth: '520px', margin: '0 auto', lineHeight: 1.9 }}>
            Vous avez un réseau, une expertise et la capacité de sourcer des pièces de luxe ? Voici ce que nous vous offrons.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', maxWidth: '960px', margin: '0 auto 48px' }}>
          {AVANTAGES.map(({ titre, texte }) => (
            <div key={titre} style={{ padding: '32px 28px', background: '#222', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '28px', height: '1px', background: '#C9A84C' }} />
              <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', fontWeight: 400 }}>{titre}</p>
              <p style={{ fontFamily: serif, fontSize: '.95rem', fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,.43)', lineHeight: 1.9 }}>{texte}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/register/shopper"
            style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#1a1a1a', background: '#fff', padding: '16px 52px', textDecoration: 'none', display: 'inline-block', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1a1a1a'; }}
          >Postuler comme expert</Link>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '80px 48px', textAlign: 'center', boxSizing: 'border-box' }}>
        <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.32em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Prêt à commencer ?</p>
        <h2 style={{ fontFamily: serif, fontSize: '2.8rem', fontWeight: 300, fontStyle: 'italic', color: '#1a1a1a', marginBottom: '16px' }}>
          Confiez votre recherche à nos experts.
        </h2>
        <p style={{ fontFamily: serif, fontSize: '1rem', fontStyle: 'italic', color: '#aaa', fontWeight: 300, lineHeight: 1.9, maxWidth: '480px', margin: '0 auto 40px' }}>
          Déposez votre demande gratuitement. Nos experts vous répondent sous 48h.
        </p>
        <Link to={role === 'client' ? '/deposer-demande' : '/login'}
          style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#fff', background: '#1a1a1a', padding: '15px 48px', textDecoration: 'none', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#C9A84C'}
          onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
        >Déposer une demande</Link>
      </div>

      <Footer />
    </div>
  );
}