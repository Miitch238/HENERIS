import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const SUBJECTS = [
  'Question générale',
  'Problème avec une commande',
  'Litige ou remboursement',
  'Devenir Personal Shopper',
  'Signaler un contenu',
  'Autre',
];

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSent(true); setSending(false); }, 900);
  };

  return (
    <div className="ct-root">
      <header className="ct-header">
        <Link to="/" className="ct-logo">Heneris</Link>
        <Link to="/" className="ct-back">← Retour à l'accueil</Link>
      </header>

      <main className="ct-main">
        <div className="ct-container">

          {/* Left — info */}
          <aside className="ct-aside">
            <p className="ct-eyebrow">Nous contacter</p>
            <h1 className="ct-title">Comment pouvons-nous vous aider ?</h1>
            <p className="ct-lead">Notre équipe répond à toutes vos questions dans un délai de 24 heures ouvrées.</p>

            <div className="ct-info-list">
              <div className="ct-info-item">
                <div className="ct-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p className="ct-info-label">Email</p>
                  <a href="mailto:contact@heneris.com" className="ct-info-value">contact@heneris.com</a>
                </div>
              </div>

              <div className="ct-info-item">
                <div className="ct-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p className="ct-info-label">Délai de réponse</p>
                  <p className="ct-info-value">Sous 24 heures ouvrées</p>
                </div>
              </div>

              <div className="ct-info-item">
                <div className="ct-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="ct-info-label">Plateforme</p>
                  <p className="ct-info-value">100 % en ligne — UE</p>
                </div>
              </div>
            </div>

            <div className="ct-links">
              <Link to="/faq" className="ct-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Consulter la FAQ
              </Link>
              <Link to="/support" className="ct-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Page support
              </Link>
            </div>
          </aside>

          {/* Right — form */}
          <div className="ct-form-wrap">
            {sent ? (
              <div className="ct-success">
                <div className="ct-success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="ct-success-title">Message envoyé</h2>
                <p className="ct-success-sub">Nous vous répondrons à <strong>{form.email}</strong> sous 24 heures ouvrées.</p>
                <button className="ct-submit" onClick={() => { setSent(false); setForm({ nom: '', email: '', sujet: '', message: '' }); }}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form className="ct-form" onSubmit={submit}>
                <div className="ct-row">
                  <div className="ct-field">
                    <label className="ct-label">Nom complet</label>
                    <input name="nom" className="ct-input" placeholder="Marie Dupont" value={form.nom} onChange={handle} required />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Adresse email</label>
                    <input name="email" type="email" className="ct-input" placeholder="marie@exemple.com" value={form.email} onChange={handle} required />
                  </div>
                </div>

                <div className="ct-field">
                  <label className="ct-label">Sujet</label>
                  <select name="sujet" className="ct-input ct-select" value={form.sujet} onChange={handle} required>
                    <option value="" disabled>Choisissez un sujet…</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="ct-field">
                  <label className="ct-label">Message</label>
                  <textarea
                    name="message"
                    className="ct-input ct-textarea"
                    placeholder="Décrivez votre demande en détail…"
                    rows={6}
                    value={form.message}
                    onChange={handle}
                    required
                  />
                </div>

                <button type="submit" className="ct-submit" disabled={sending}>
                  {sending ? 'Envoi en cours…' : 'Envoyer le message'}
                </button>

                <p className="ct-privacy">
                  En soumettant ce formulaire, vous acceptez notre{' '}
                  <Link to="/confidentialite">politique de confidentialité</Link>.
                </p>
              </form>
            )}
          </div>

        </div>
      </main>

      <footer className="ct-footer">
        <span className="ct-footer-logo">Heneris</span>
        <nav className="ct-footer-nav">
          <Link to="/faq">FAQ</Link>
          <Link to="/support">Support</Link>
          <Link to="/cgu">CGU</Link>
          <Link to="/confidentialite">Confidentialité</Link>
        </nav>
        <span className="ct-footer-copy">© {new Date().getFullYear()} Hénéris</span>
      </footer>
    </div>
  );
}
