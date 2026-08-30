import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const sans  = "'Montserrat', sans-serif";
const serif = "'Cormorant Garamond', Georgia, serif";

export default function RegisterClient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (form.password.length < 8) { setError('Minimum 8 caractères requis.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { first_name: form.firstName, last_name: form.lastName, role: 'client' } },
    });
    setLoading(false);
    if (error) { setError(error.message); } else { navigate('/', { replace: true }); }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0',
    fontFamily: sans, fontSize: '13px', fontWeight: '300', color: '#1a1a1a',
    outline: 'none', background: '#fff', boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', fontSize: '9px', letterSpacing: '.16em',
    textTransform: 'uppercase', color: '#555', marginBottom: '8px', fontFamily: sans,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: sans, display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <header style={{ padding: '0 48px', height: '60px', borderBottom: '1px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: '900', letterSpacing: '.05em', textDecoration: 'none', color: '#111' }}>
          HENERIS<span style={{ color: '#C9A84C' }}>.</span>
        </Link>
        <Link to="/" style={{ position: 'absolute', right: '48px', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>
          ← Retour
        </Link>
      </header>

      {/* CONTENT */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* ── NOUVELLE INTRO ── */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: serif, fontSize: '2.4rem', fontWeight: 300, fontStyle: 'italic', color: '#1a1a1a', marginBottom: '12px' }}>
              Rejoignez Heneris
            </h2>
            <p style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 300, color: '#aaa', lineHeight: 1.7 }}>
              Accédez au réseau privé du sourcing de luxe en Europe.
            </p>
            <div style={{ width: '48px', height: '1px', background: '#C9A84C', margin: '24px auto 0' }} />
          </div>

          <p style={{ fontSize: '9px', letterSpacing: '.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px', textAlign: 'center', fontFamily: sans }}>
            Espace client
          </p>
          <h1 style={{ fontFamily: serif, fontSize: '2rem', fontWeight: '400', color: '#1a1a1a', textAlign: 'center', marginBottom: '8px' }}>
            Créer un compte
          </h1>
          <p style={{ fontSize: '11px', fontWeight: '300', color: '#aaa', textAlign: 'center', marginBottom: '40px', letterSpacing: '.04em', fontFamily: sans }}>
            Rejoignez Heneris et accédez à des personal shoppers d'exception.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Prénom</label>
                <input name="firstName" type="text" value={form.firstName} onChange={handleChange} required placeholder="Sophie" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nom</label>
                <input name="lastName" type="text" value={form.lastName} onChange={handleChange} required placeholder="Dupont" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Adresse e-mail</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="vous@exemple.com" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Mot de passe</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
              <p style={{ fontSize: '10px', color: '#bbb', marginTop: '6px', fontFamily: sans }}>Minimum 8 caractères</p>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
            </div>

            {error && <p style={{ fontSize: '11px', color: '#c0392b', margin: '12px 0', fontWeight: '300', fontFamily: sans }}>{error}</p>}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none', fontFamily: sans, fontSize: '10px', letterSpacing: '.18em', textTransform: 'uppercase', cursor: 'pointer', marginTop: '24px' }}>
              {loading ? 'Création en cours…' : 'Créer mon compte client'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0 20px' }}>
            <div style={{ flex: 1, height: '1px', background: '#ececec' }} />
            <span style={{ fontSize: '10px', color: '#ccc', letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: sans }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#ececec' }} />
          </div>

          <Link to="/login" style={{ display: 'block', padding: '13px', border: '1px solid #e0e0e0', fontFamily: sans, fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', textAlign: 'center', marginBottom: '10px' }}>
            J'ai déjà un compte
          </Link>
          <Link to="/register/shopper" style={{ display: 'block', padding: '13px', border: '1px solid #e0e0e0', fontFamily: sans, fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', textAlign: 'center' }}>
            Devenir Personal Shopper
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: '20px 48px', borderTop: '1px solid #ececec', display: 'flex', justifyContent: 'center', gap: '32px' }}>
        <Link to="/cgu" style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none', fontFamily: sans }}>CGU</Link>
        <Link to="/confidentialite" style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none', fontFamily: sans }}>Confidentialité</Link>
        <Link to="/contact" style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none', fontFamily: sans }}>Contact</Link>
      </div>
    </div>
  );
}