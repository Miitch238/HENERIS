import { Link } from 'react-router-dom';
import './LegalLayout.css';

export default function LegalLayout({ title, lastUpdate, children }) {
  return (
    <div className="ll-root">
      <header className="ll-header">
        <Link to="/" className="ll-logo">Heneris</Link>
        <Link to="/" className="ll-back">← Retour à l'accueil</Link>
      </header>

      <main className="ll-main">
        <div className="ll-container">
          <div className="ll-intro">
            <p className="ll-eyebrow">Hénéris — Documents légaux</p>
            <h1 className="ll-title">{title}</h1>
            {lastUpdate && <p className="ll-date">Dernière mise à jour : {lastUpdate}</p>}
          </div>
          <div className="ll-body">{children}</div>
        </div>
      </main>

      <footer className="ll-footer">
        <div className="ll-footer-inner">
          <span className="ll-footer-logo">Heneris</span>
          <nav className="ll-footer-nav">
            <Link to="/cgu">CGU</Link>
            <Link to="/cgv">CGV</Link>
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/confidentialite">Confidentialité</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/regles">Règles</Link>
            <Link to="/suspension">Suspension</Link>
          </nav>
          <span className="ll-footer-copy">© {new Date().getFullYear()} Hénéris</span>
        </div>
      </footer>
    </div>
  );
}
