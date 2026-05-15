import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError('Une erreur est survenue. Vérifiez l\'adresse e-mail saisie.');
    } else {
      setSent(true);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-logo">Heneris</Link>

      <div className="auth-card">
        <h1 className="auth-title">Mot de passe oublié</h1>
        <p className="auth-subtitle">
          Saisissez votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {sent ? (
          <div className="form-success">
            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
            Vérifiez votre boîte de réception (et vos spams).
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="vous@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Envoi en cours…' : 'Envoyer le lien'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          <Link to="/login">← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
