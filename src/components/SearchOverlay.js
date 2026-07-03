import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchOverlay.css';

const POPULAR = ['Birkin', 'Kelly', 'Rolex', 'Chanel', 'Cartier', 'Dior', 'Patek', 'Van Cleef'];
const CATEGORIES = ['Maroquinerie', 'Montres', 'Bijoux', 'Vêtements', 'Art de vivre'];

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (term) => {
    navigate(`/?q=${encodeURIComponent(term)}`);
    onClose();
  };

  return (
    <>
      <div className="so-backdrop" onClick={onClose} />
      <div className="so-panel">
        <div className="so-header">
          <span className="so-logo">HENERIS<span className="so-dot">.</span></span>
          <button className="so-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="so-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="so-input"
            placeholder="Rechercher une pièce…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && query && handleSearch(query)}
            autoFocus
          />
          {query && (
            <button className="so-input-clear" onClick={() => setQuery('')}>
              X
            </button>
          )}
        </div>

        <div className="so-section">
          <p className="so-section-title">Recherches populaires</p>
          <div className="so-tags">
            {POPULAR.map(tag => (
              <button key={tag} className="so-tag" onClick={() => handleSearch(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="so-section">
          <p className="so-section-title">Catégories</p>
          <div className="so-cats">
            {CATEGORIES.map(cat => (
              <button key={cat} className="so-cat" onClick={() => handleSearch(cat)}>
                <span>{cat}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}