import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ClientLayout.css';

const NAV_LINKS = [
  { to: '/catalogue',      label: 'Catalogue' },
  { to: '/messages',       label: 'Messages' },
  { to: '/client/suivi',   label: 'Suivi' },
];

export default function ClientLayout({ children, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.first_name || '';
  const lastName  = user?.user_metadata?.last_name  || '';
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';

  const close = () => setMenuOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="cl-root">

      {/* ── Navbar ── */}
      <header className="cl-nav">
        <Link to="/" className="cl-logo">Heneris</Link>

        <div className="cl-right">
          <button
            className="cl-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="1"  x2="22" y2="1"  stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="8"  x2="22" y2="8"  stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="15" x2="22" y2="15" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          <Link to="/client/profil" className="cl-avatar" aria-label="Mon profil">
            {initials}
          </Link>
        </div>
      </header>

      {/* ── Menu drawer ── */}
      <div className={`cl-drawer-backdrop ${menuOpen ? 'cl-drawer-backdrop--visible' : ''}`} onClick={close} />
      <nav className={`cl-drawer ${menuOpen ? 'cl-drawer--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="cl-drawer-header">
          <span className="cl-drawer-logo">Heneris</span>
          <button className="cl-drawer-close" onClick={close} aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cl-drawer-links">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `cl-drawer-link ${isActive ? 'cl-drawer-link--active' : ''}`}
              onClick={close}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="cl-drawer-footer">
          <Link to="/client/profil" className="cl-drawer-profil" onClick={close}>
            <span className="cl-drawer-avatar">{initials}</span>
            <span>{firstName || 'Mon profil'}</span>
          </Link>
          <button className="cl-drawer-logout" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </nav>

      <main className="cl-main">{children}</main>
    </div>
  );
}