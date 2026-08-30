import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      setError('Email ou mot de passe incorrect.');
      return;
    }

    // Détermine le rôle pour rediriger vers le bon espace plutôt que la home publique.
    let role = data.user?.user_metadata?.role;
    if (!role) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', data.user.id).single();
      role = profile?.role;
    }

    setLoading(false);

    const destination =
      role === 'shopper' ? '/shopper/home' :
      role === 'admin'   ? '/admin/dashboard' :
      '/';

    navigate(destination, { replace: true });
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/#/' },
    });
    // Note : la redirection post-OAuth atterrit sur la home publique, car le rôle
    // n'est connu qu'une fois la session établie après le retour de Google.
    // Home.js détecte ensuite le rôle normalement ; si on veut une redirection
    // immédiate vers /client/home ou /shopper/home même via Google, il faudrait
    // ajouter cette logique dans Home.js au montage (à voir si besoin).
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Montserrat', sans-serif", display: 'flex', flexDirection: 'column' }}>

      <header style={{ padding: '0 48px', height: '60px', borderBottom: '1px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Link to="/" translate="no" className="notranslate" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: '900', letterSpacing: '.05em', textDecoration: 'none', color: '#111' }}>
          HENERIS<span style={{ color: '#C9A84C' }}>.</span>
        </Link>
        <Link to="/" style={{ position: 'absolute', right: '48px', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>
          ← Retour
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          <p style={{ fontSize: '9px', letterSpacing: '.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px', textAlign: 'center' }}>
            Espace membre
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: '400', color: '#1a1a1a', textAlign: 'center', marginBottom: '8px' }}>
            Connexion
          </h1>
          <p style={{ fontSize: '11px', fontWeight: '300', color: '#aaa', textAlign: 'center', marginBottom: '40px', letterSpacing: '.04em' }}>
            Bienvenue. Entrez vos identifiants pour continuer.
          </p>

          <button
            onClick={handleGoogle}
            style={{ width: '100%', padding: '13px', background: '#fff', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#1a1a1a', cursor: 'pointer', marginBottom: '28px' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A84C'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continuer avec Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div style={{ flex: 1, height: '1px', background: '#ececec' }} />
            <span style={{ fontSize: '10px', color: '#ccc', letterSpacing: '.12em', textTransform: 'uppercase' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#ececec' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#555', marginBottom: '8px' }}>
                Adresse e-mail
              </label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="vous@exemple.com"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: '300', color: '#1a1a1a', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#555' }}>
                  Mot de passe
                </label>
                <Link to="/forgot-password" style={{ fontSize: '10px', color: '#888', textDecoration: 'none', borderBottom: '1px solid #e0e0e0', paddingBottom: '1px' }}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                name="password" type="password" value={form.password} onChange={handleChange} required
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: '300', color: '#1a1a1a', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '11px', color: '#c0392b', marginBottom: '16px', fontWeight: '300' }}>{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '.18em', textTransform: 'uppercase', cursor: 'pointer', marginTop: '24px' }}
            >
              {loading ? 'Connexion…' : "M'identifier"}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#ececec' }} />
            <span style={{ fontSize: '10px', color: '#ccc', letterSpacing: '.12em', textTransform: 'uppercase' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#ececec' }} />
          </div>

          <p style={{ fontSize: '9px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px', textAlign: 'center' }}>
            Nouveau client
          </p>
          <p style={{ fontSize: '11px', fontWeight: '300', color: '#aaa', textAlign: 'center', marginBottom: '20px' }}>
            Créez votre espace Heneris pour une expérience personnalisée.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/register/client" style={{ display: 'block', padding: '13px', border: '1px solid #1a1a1a', fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#1a1a1a', textDecoration: 'none', textAlign: 'center' }}>
              Créer mon compte client
            </Link>
            <Link to="/register/shopper" style={{ display: 'block', padding: '13px', border: '1px solid #e0e0e0', fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', textAlign: 'center' }}>
              Devenir Personal Shopper
            </Link>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 48px', borderTop: '1px solid #ececec', display: 'flex', justifyContent: 'center', gap: '32px' }}>
        <Link to="/cgu" style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>CGU</Link>
        <Link to="/confidentialite" style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>Confidentialité</Link>
        <Link to="/contact" style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>Contact</Link>
      </div>
    </div>
  );
}