import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home">

      {/* ── Nav ── */}
      <nav className="nav">
        <span className="nav-logo">Heneris</span>
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`menu-overlay ${menuOpen ? 'visible' : ''}`}>
          <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Fermer">✕</button>
          <nav className="menu-links">
            <Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
            <Link to="/shoppers" onClick={() => setMenuOpen(false)}>Nos Shoppers</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>À propos</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Se connecter</Link>
            <Link to="/register" className="menu-cta" onClick={() => setMenuOpen(false)}>Créer un compte</Link>
          </nav>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
        >
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Heneris</h1>
          <p className="hero-subtitle">L'art de trouver.</p>
        </div>
        <div className="hero-scroll">
          <span />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <Link to="/login" className="btn-outline-gold btn-outline-gold--lg">
            SE CONNECTER
          </Link>
        </div>
      </section>

      {/* ── À propos ── */}
      <section className="about-section">
        <div className="about-inner">
          <h2 className="about-title">L'excellence au service du rare.</h2>
          <p className="about-text">
            Heneris est une marketplace de personal shopping qui connecte des clients exigeants
            à des experts du luxe triés sur le volet. Chaque personal shopper est sélectionné
            pour sa connaissance approfondie des maisons de couture, son réseau exclusif et
            son sens aigu de l'esthétique.
          </p>
          <p className="about-text">
            Que vous recherchiez une pièce introuvable, un look sur-mesure pour un événement
            ou un accompagnement continu dans vos achats, Heneris met à votre disposition
            un service d'exception, alliant discrétion, expertise et résultats.
          </p>
          <blockquote className="about-quote">
            "Le luxe n'est pas une question de prix, mais de précision."
          </blockquote>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="how-section">
        <p className="section-eyebrow">Comment ça marche</p>
        <h2 className="section-title">Simple. Exclusif. Sans compromis.</h2>
        <div className="how-cards">
          <div className="how-card">
            <div className="how-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="how-card-title">Créez votre profil</h3>
            <p className="how-card-desc">
              Décrivez votre style, vos occasions et votre budget en quelques minutes.
              Votre profil guide chaque sélection.
            </p>
          </div>
          <div className="how-card">
            <div className="how-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <h3 className="how-card-title">Choisissez votre expert</h3>
            <p className="how-card-desc">
              Parcourez nos personal shoppers certifiés, leurs spécialités et leurs
              avis clients pour trouver votre match idéal.
            </p>
          </div>
          <div className="how-card">
            <div className="how-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </div>
            <h3 className="how-card-title">Recevez votre sélection</h3>
            <p className="how-card-desc">
              Votre shopper compose une sélection exclusive, négocie les meilleures
              conditions et organise la livraison à votre convenance.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-col">
            <p className="footer-col-title">Besoin d'aide</p>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Nous contacter</Link></li>
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/how-it-works">Comment ça marche</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Heneris</p>
            <ul>
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/shoppers">Nos shoppers</Link></li>
              <li><Link to="/careers">Carrières</Link></li>
              <li><Link to="/press">Presse</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Légal</p>
            <ul>
              <li><Link to="/terms">Conditions générales</Link></li>
              <li><Link to="/privacy">Politique de confidentialité</Link></li>
              <li><Link to="/cookies">Cookies</Link></li>
              <li><Link to="/legal">Mentions légales</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Nous suivre</p>
            <ul>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-newsletter">
          <p className="footer-newsletter-label">Restez informé des dernières tendances</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">S'inscrire</button>
          </form>
        </div>

        <div className="footer-bottom">
          <span className="footer-logo">Heneris</span>
          <p className="footer-copy">© 2026 Heneris. Tous droits réservés.</p>
        </div>
      </footer>

    </div>
  );
}
