import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#fff', color: '#1a1a1a', padding: '56px 48px 0', fontFamily: "'Montserrat', sans-serif", borderTop: '0.5px solid #ececec' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr', gap: '48px', borderBottom: '0.5px solid #ececec', paddingBottom: '48px' }}>

        {/* AIDE */}
        <div>
          <p style={{ fontSize: '8px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '18px', fontWeight: '400' }}>Aide</p>
          {[['FAQ', '/faq'], ['Contact', '/contact'], ['Support', '/support'], ['Comment ça marche', '/how-it-works'], ['Paiement sécurisé', '/cgu']].map(([label, to]) => (
            <Link key={to} to={to} style={{ display: 'block', fontSize: '11px', fontWeight: '300', color: '#888', textDecoration: 'none', marginBottom: '10px', letterSpacing: '0.03em' }}>
              {label}
            </Link>
          ))}
        </div>

        {/* SERVICES */}
        <div>
          <p style={{ fontSize: '8px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '18px', fontWeight: '400' }}>Services</p>
          {[['Personal Shopping', '/how-it-works'], ['Certification Shoppers', '/register/shopper'], ['Escrow & Protection', '/cgu'], ['Recherche sur mesure', '/deposer-demande']].map(([label, to]) => (
            <Link key={label} to={to} style={{ display: 'block', fontSize: '11px', fontWeight: '300', color: '#888', textDecoration: 'none', marginBottom: '10px', letterSpacing: '0.03em' }}>
              {label}
            </Link>
          ))}
        </div>

        {/* À PROPOS */}
        <div>
          <p style={{ fontSize: '8px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '18px', fontWeight: '400' }}>À propos</p>
          {[['Notre mission', '/how-it-works'], ['Notre modèle de confiance', '/confiance'], ['Carrière', '/contact'], ['Presse', '/contact'], ['Partenaires', '/contact']].map(([label, to]) => (
            <Link key={label} to={to} style={{ display: 'block', fontSize: '11px', fontWeight: '300', color: '#888', textDecoration: 'none', marginBottom: '10px', letterSpacing: '0.03em' }}>
              {label}
            </Link>
          ))}
        </div>

        {/* SUIVEZ-NOUS */}
        <div>
          <p style={{ fontSize: '8px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '18px', fontWeight: '400' }}>Suivez-nous</p>
          <p style={{ fontSize: '11px', fontWeight: '300', color: '#888', lineHeight: '1.7', letterSpacing: '0.02em', marginBottom: '16px' }}>
            <span style={{ color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer' }}>Souscrivez à la Newsletter</span> pour recevoir en exclusivité les dernières actualités d'Hénéris, les nouvelles pièces disponibles et les lancements exclusifs.
          </p>
          <p style={{ fontSize: '8px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#bbb', marginBottom: '14px', fontWeight: '400' }}>Réseaux sociaux</p>
          <div style={{ display: 'flex', gap: '14px' }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ width: '28px', height: '28px', border: '0.5px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#888">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" style={{ width: '28px', height: '28px', border: '0.5px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#888">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ width: '28px', height: '28px', border: '0.5px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#888">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── BARRE DU BAS ── */}
      <div style={{ padding: '20px 0', borderBottom: '0.5px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {[['CGU', '/cgu'], ['CGV', '/cgv'], ['Confidentialité', '/confidentialite'], ['Mentions légales', '/mentions-legales'], ['Cookies', '/cookies']].map(([label, to]) => (
            <Link key={to} to={to} style={{ fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>
        <span style={{ fontSize: '8px', color: '#ccc', letterSpacing: '0.06em' }}>
          © 2026 Hénéris — Paris, France
        </span>
      </div>

      {/* ── LOGO BAS ── */}
      <div style={{ padding: '28px 0 36px', textAlign: 'center' }}>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: '900', color: 'rgba(26,26,26,0.06)', letterSpacing: '0.06em' }}>
          HENERIS<span style={{ color: 'rgba(201,168,76,0.25)' }}>.</span>
        </span>
      </div>

    </footer>
  );
}