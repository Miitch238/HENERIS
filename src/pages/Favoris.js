import Logo from '../components/Logo';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const sans  = "'Montserrat', sans-serif";
const serif = "'Cormorant Garamond', Georgia, serif";

export default function Favoris() {
  const [session, setSession] = useState(null);
  const [favoris, setFavoris] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        const stored = JSON.parse(localStorage.getItem('heneris_favoris') || '[]');
        setFavoris(stored);
      }
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: sans, display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
    <header style={{ padding: '0 48px', height: '60px', borderBottom: '.5px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: '#fff' }}>
  <Logo to="/" color="dark" size="md" />
  <button onClick={() => navigate(-1)} style={{ position: 'absolute', right: '48px', background: 'none', border: 'none', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#888', cursor: 'pointer', fontFamily: sans }}>
    ← Retour
  </button>
</header>

      {/* CONTENT */}
      <div style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '64px 48px' }}>
        <p style={{ fontSize: '9px', letterSpacing: '.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px', fontFamily: sans }}>
          Mes favoris
        </p>
        <h1 style={{ fontFamily: serif, fontSize: '2rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '48px' }}>
          Pièces sauvegardées
        </h1>

        {!session ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ color: '#C9A84C', marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p style={{ fontFamily: serif, fontSize: '1.3rem', fontStyle: 'italic', color: '#1a1a1a', marginBottom: '12px' }}>
              Votre liste de favoris est vide.
            </p>
            <p style={{ fontSize: '11px', fontWeight: '300', color: '#aaa', lineHeight: 1.8, maxWidth: '400px', margin: '0 auto 40px', fontFamily: sans }}>
              Connectez-vous pour retrouver vos pièces favorites et ne manquer aucune opportunité.
            </p>
            <Link to="/login" style={{ display: 'inline-block', background: '#1a1a1a', color: '#fff', fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', padding: '13px 40px', textDecoration: 'none', fontFamily: sans }}>
              Se connecter
            </Link>
          </div>
        ) : favoris.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ color: '#C9A84C', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p style={{ fontFamily: serif, fontSize: '1.3rem', fontStyle: 'italic', color: '#aaa', marginBottom: '24px' }}>
              Aucune pièce sauvegardée pour le moment.
            </p>
            <Link to="/" style={{ fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#1a1a1a', borderBottom: '.5px solid #1a1a1a', paddingBottom: '2px', textDecoration: 'none', fontFamily: sans }}>
              Retour à l'accueil →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {favoris.map(item => (
              <div key={item.id} style={{ border: '.5px solid #ececec' }}>
                {item.image && (
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '16px' }}>
                  <p style={{ fontFamily: serif, fontSize: '1.1rem', fontWeight: 300, marginBottom: '8px', color: '#1a1a1a' }}>{item.titre}</p>
                  <p style={{ fontSize: '11px', fontWeight: '400', color: '#1a1a1a', fontFamily: sans }}>{item.prix?.toLocaleString('fr-FR')} €</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ padding: '20px 48px', borderTop: '.5px solid #ececec', display: 'flex', justifyContent: 'center', gap: '32px' }}>
        <Link to="/cgu" style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none', fontFamily: sans }}>CGU</Link>
        <Link to="/confidentialite" style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none', fontFamily: sans }}>Confidentialité</Link>
        <Link to="/contact" style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none', fontFamily: sans }}>Contact</Link>
      </div>
    </div>
  );
}