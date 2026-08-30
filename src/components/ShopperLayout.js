import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './ShopperLayout.css';

const NAV_LINKS = [
  { to: '/shopper/marche',   label: 'Marché' },
  { to: '/shopper/articles', label: 'Mes articles' },
  { to: '/shopper/messages', label: 'Messages' },
  { to: '/shopper/suivi',    label: 'Suivi' },
  { to: '/shopper/gains',    label: 'Gains' },
];

export default function ShopperLayout({ children, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const firstName = user?.user_metadata?.first_name || '';
  const lastName  = user?.user_metadata?.last_name  || '';
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';
  const close     = () => setMenuOpen(false);

  return (
    <div className="sl-root">
      <header className="sl-nav">
        <Link to="/shopper/home" className="sl-logo">Heneris</Link>
        <div className="sl-right">
          <button
            className="sl-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <line x1="0" y1="1"  x2="22" y2="1"  stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="8"  x2="22" y2="8"  stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="15" x2="22" y2="15" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <Link to="/shopper/profil" className="sl-avatar" aria-label="Mon profil">
            {initials}
          </Link>
        </div>
      </header>

      <div className={`sl-backdrop ${menuOpen ? 'sl-backdrop--visible' : ''}`} onClick={close} />

      <nav className={`sl-drawer ${menuOpen ? 'sl-drawer--open' : ''}`}>
        <div className="sl-drawer-header">
          <span className="sl-drawer-logo">Heneris</span>
          <button className="sl-drawer-close" onClick={close} aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="sl-drawer-badge">Espace Shopper</div>
        <div className="sl-drawer-links">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sl-drawer-link ${isActive ? 'sl-drawer-link--active' : ''}`}
              onClick={close}
            >{label}</NavLink>
          ))}
        </div>
        <div className="sl-drawer-footer">
          <Link to="/shopper/profil" className="sl-drawer-profil" onClick={close}>
            <span className="sl-drawer-avatar">{initials}</span>
            <span>{firstName || 'Mon profil'}</span>
          </Link>
        </div>
      </nav>

      <main className="sl-main">{children}</main>
    </div>
  );
}
