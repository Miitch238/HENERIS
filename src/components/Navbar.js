import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Logo from './Logo';
import SearchOverlay from './SearchOverlay';
import './Navbar.css';

export default function Navbar({ transparentOnTop = false }) {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [role, setRole]             = useState(null);
  const [scrolled, setScrolled]     = useState(!transparentOnTop);

  useEffect(() => {
    const getRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const metaRole = session.user.user_metadata?.role;
      if (metaRole) { setRole(metaRole); return; }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('user_id', session.user.id).single();
      if (profile?.role) setRole(profile.role);
    };
    getRole();
  }, []);

  useEffect(() => {
    if (!transparentOnTop) return;
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparentOnTop]);

  const dashLink =
    role === 'shopper' ? '/shopper/home' :
    role === 'client'  ? '/client/home'  :
    role === 'admin'   ? '/admin/dashboard' : '/login';

  return (
    <>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      <header className={`nb-nav ${scrolled ? 'nb-nav--scrolled' : ''}`}>
        <div className="nb-left">
          <button className="nb-hamburger" onClick={() => setMenuOpen(true)}>
            <div className="nb-ham-lines"><span /><span /><span /></div>
            <span className="nb-ham-txt">Menu</span>
          </button>
          <div className="nb-search-bar" onClick={() => setSearchOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span className="nb-search-ph">Rechercher une pièce…</span>
          </div>
        </div>

        <Logo to="/" color={scrolled ? 'dark' : 'light'} size="md" />

        <div className="nb-right">
          <a href="/#/notifications" className="nb-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </a>
          <a href="/#/favoris" className="nb-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </a>
          <a href={`/#${dashLink}`} className="nb-icon-btn nb-user-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {!role && <span className="nb-user-tooltip">Se connecter →</span>}
          </a>
        </div>
      </header>

      {menuOpen && <div className="nb-overlay-bg" onClick={() => setMenuOpen(false)} />}
      <div className={`nb-overlay ${menuOpen ? 'open' : ''}`}>
        <div className="nb-overlay-header">
          <Logo to={null} color="dark" size="md" />
          <button className="nb-overlay-close" onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="nb-overlay-links">
          <Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>Comment ça marche</Link>
          <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to={dashLink} onClick={() => setMenuOpen(false)}>
            {role ? 'Mon espace' : 'Se connecter'}
          </Link>
          {!role && (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Devenir Personal Shopper
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}