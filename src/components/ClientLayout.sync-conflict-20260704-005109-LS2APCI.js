import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Logo from './Logo';
import SearchOverlay from './SearchOverlay';
import './ClientLayout.css';

const NAV_LINKS = [
  { to: '/catalogue',    label: 'Catalogue' },
  { to: '/messages',     label: 'Messages' },
  { to: '/client/suivi', label: 'Suivi' },
];

export default function ClientLayout({ children, user }) {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.first_name || '';
  const lastName  = user?.user_metadata?.last_name  || '';
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';
  const close     = () => setMenuOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {/* ── NAVBAR ── */}
      <header style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 32px',
        height: '60px',
        background: '#fff',
        borderBottom: '0.5px solid #ececec',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
      }}>

        {/* GAUCHE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'block', width: '18px', height: '1px', background: '#1a1a1a' }} />
              <span style={{ display: 'block', width: '18px', height: '1px', background: '#1a1a1a' }} />
              <span style={{ display: 'block', width: '18px', height: '1px', background: '#1a1a1a' }} />
            </div>
            <span style={{ fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#1a1a1a', fontFamily: "'Montserrat', sans-serif" }}>Menu</span>
          </button>
          <div
            onClick={() => setSearchOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', border: '1px solid #e0e0e0', minWidth: '180px', cursor: 'text' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span style={{ fontSize: '10px', color: '#bbb', letterSpacing: '.04em', fontFamily: "'Montserrat', sans-serif" }}>Rechercher une pièce…</span>
          </div>
        </div>

        {/* CENTRE */}
        <Logo to="/" color="dark" size="md" />

        {/* DROITE */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>

          {/* BOUTON FAIRE UNE DEMANDE */}
          <Link
            to="/deposer-demande"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '9px',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: '#fff',
              background: '#1a1a1a',
              padding: '9px 18px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              border: '.5px solid #1a1a1a',
              transition: 'background .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#C9A84C';
              e.currentTarget.style.borderColor = '#C9A84C';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.borderColor = '#1a1a1a';
            }}
          >
            Faire une demande
          </Link>

          <a href="/#/notifications" style={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', padding: '4px', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </a>
          <a href="/#/favoris" style={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', padding: '4px', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </a>
          <Link
            to="/client/profil"
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#C9A84C', color: '#fff', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif" }}
          >
            {initials}
          </Link>
        </div>
      </header>

      {/* ── DRAWER ── */}
      {menuOpen && (
        <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 1099 }} />
      )}
      <nav style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: '320px',
        background: '#fff', zIndex: 1100,
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .4s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '8px 0 40px rgba(0,0,0,.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: '60px', borderBottom: '1px solid #f0f0f0' }}>
          <Logo to={null} color="dark" size="sm" />
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* BOUTON DANS LE DRAWER AUSSI */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #f0f0f0' }}>
          <Link
            to="/deposer-demande"
            onClick={close}
            style={{
              display: 'block', textAlign: 'center',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase',
              color: '#fff', background: '#1a1a1a',
              padding: '12px', textDecoration: 'none',
            }}
          >
            + Faire une demande
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 0', flex: 1 }}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              style={({ isActive }) => ({
                display: 'block', padding: '14px 32px',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.5rem', fontWeight: 300,
                color: isActive ? '#C9A84C' : '#1a1a1a',
                textDecoration: 'none',
                borderBottom: '1px solid #f5f5f5',
                borderLeft: isActive ? '3px solid #C9A84C' : '3px solid transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/client/profil" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#1a1a1a' }}>
            <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#C9A84C', color: '#fff', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initials}
            </span>
            <span style={{ fontSize: '.875rem', fontWeight: 500, color: '#555' }}>{firstName || 'Mon profil'}</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', background: 'none', border: '1px solid #e0e0e0', color: '#888', fontFamily: "'Montserrat', sans-serif", fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Se déconnecter
          </button>
        </div>
      </nav>

      <main style={{ paddingTop: '60px' }}>{children}</main>
    </div>
  );
}