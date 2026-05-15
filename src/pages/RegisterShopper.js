import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

const SPECIALITES = [
  'Haute Couture',
  'Prêt-à-porter luxe',
  'Accessoires & Maroquinerie',
  'Joaillerie & Montres',
  'Mode homme',
  'Mode femme',
  'Streetwear & Sneakers',
  'Vintage & Archives',
  'Art de vivre & Décoration',
];

export default function RegisterShopper() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    specialite: '',
    city: '',
  });
  const [stripeVerified, setStripeVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleStripeVerify = () => {
    // Stripe Identity — à connecter avec l'API Stripe Connect
    setStripeVerified(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (!stripeVerified) {
      setError('La vérification d\'identité est requise pour devenir shopper.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          role: 'shopper',
          specialite: form.specialite,
          city: form.city,
        },
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-logo">Heneris</Link>

      <div className="auth-card auth-card-wide">
        <h1 className="auth-title">Devenir Shopper</h1>
        <p className="auth-subtitle">Rejoignez notre réseau d'experts et proposez vos services à une clientèle exigeante.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label" htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="form-input"
                placeholder="Sophie"
                value={form.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="form-input"
                placeholder="Marchand"
                value={form.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>
          </div>

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

          <div className="form-row">
            <div className="form-field">
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="confirm">Confirmation</label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
          <span className="form-hint" style={{ marginTop: -10 }}>Minimum 8 caractères</span>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label" htmlFor="specialite">Spécialité</label>
              <select
                id="specialite"
                name="specialite"
                className="form-input form-select"
                value={form.specialite}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Choisir…</option>
                {SPECIALITES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="city">Ville</label>
              <input
                id="city"
                name="city"
                type="text"
                className="form-input"
                placeholder="Paris"
                value={form.city}
                onChange={handleChange}
                required
                autoComplete="address-level2"
              />
            </div>
          </div>

          {/* Stripe Identity */}
          <div className="form-field">
            <label className="form-label">Vérification d'identité</label>
            <div className="stripe-block">
              <div className="stripe-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="stripe-text">
                <p>
                  <strong>Requis pour être shopper.</strong> Nous utilisons Stripe Identity pour
                  vérifier votre identité de manière sécurisée. Vos données ne sont pas partagées.
                </p>
                {!stripeVerified ? (
                  <button type="button" className="btn-stripe" onClick={handleStripeVerify}>
                    Vérifier mon identité
                  </button>
                ) : (
                  <p className="stripe-verified">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Identité vérifiée
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Création en cours…' : 'Créer mon compte shopper'}
          </button>
        </form>

        <p className="auth-footer">
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
          {' · '}
          <Link to="/register/client">Inscription client</Link>
        </p>
      </div>
    </div>
  );
}
