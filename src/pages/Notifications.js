import Logo from '../components/Logo';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const sans  = "'Montserrat', sans-serif";
const serif = "'Cormorant Garamond', Georgia, serif";

export default function Notifications() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
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
      <div style={{ flex: 1, maxWidth: '720px', margin: '0 auto', width: '100%', padding: '64px 24px' }}>
        <p style={{ fontSize: '9px', letterSpacing: '.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px', fontFamily: sans }}>
          Mes notifications
        </p>
        <h1 style={{ fontFamily: serif, fontSize: '2rem', fontWeight: '400', color: '#1a1a1a', marginBottom: '48px' }}>
          Centre de notifications
        </h1>

        {!session ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ color: '#C9A84C', marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p style={{ fontFamily: serif, fontSize: '1.3rem', fontStyle: 'italic', color: '#1a1a1a', marginBottom: '12px' }}>
              Aucune notification pour le moment.
            </p>
            <p style={{ fontSize: '11px', fontWeight: '300', color: '#aaa', lineHeight: 1.8, marginBottom: '40px', fontFamily: sans }}>
              Connectez-vous pour suivre vos demandes, offres et messages en temps réel.
            </p>
            <Link to="/login" style={{ display: 'inline-block', background: '#1a1a1a', color: '#fff', fontSize: '9px', fontWeight: '400', letterSpacing: '.18em', textTransform: 'uppercase', padding: '13px 40px', textDecoration: 'none', fontFamily: sans }}>
              Se connecter
            </Link>
            <p style={{ fontSize: '10px', color: '#bbb', marginTop: '20px', fontFamily: sans }}>
              Pas encore de compte ?{' '}
              <Link to="/register/client" style={{ color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Créer un compte</Link>
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ color: '#C9A84C', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p style={{ fontFamily: serif, fontSize: '1.3rem', fontStyle: 'italic', color: '#aaa' }}>
              Aucune notification pour le moment.
            </p>
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