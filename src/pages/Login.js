import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', data.user.id)   // ← user_id, pas id
      .single();

    setLoading(false);

    // Fallback sur user_metadata si la table profiles n'est pas encore prête
    const role = profile?.role ?? data.user.user_metadata?.role;
    console.log('[Login] role résolu :', role);

    if (role === 'client') navigate('/client/home');
    else if (role === 'shopper') navigate('/shopper/home');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-logo">Heneris</Link>

      <div className="auth-card">
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-subtitle">Bienvenue. Entrez vos identifiants pour continuer.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="vous@exemple.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <div className="auth-link-row">
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <Link to="/forgot-password" className="auth-link">Mot de passe oublié ?</Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-divider" style={{ marginTop: 24 }}>
          <span>Pas encore de compte ?</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          <Link to="/register/client" className="btn-submit" style={{ textAlign: 'center', background: 'transparent', border: '1.5px solid #C9A84C', color: '#1a1a1a', textDecoration: 'none', display: 'block', padding: '13px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', borderRadius: 2, transition: 'background 0.2s' }}>
            Créer un compte client
          </Link>
          <Link to="/register/shopper" className="btn-submit" style={{ textAlign: 'center', background: 'transparent', border: '1.5px solid #C9A84C', color: '#1a1a1a', textDecoration: 'none', display: 'block', padding: '13px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', borderRadius: 2, transition: 'background 0.2s' }}>
            Créer un compte shopper
          </Link>
        </div>
      </div>
    </div>
  );
}
