import { Link } from 'react-router-dom';
import './Logo.css';

export default function Logo({ to = '/', color = 'dark', size = 'md', onClick }) {
  const inner = (
    <span className={`hn-logo hn-logo--${color} hn-logo--${size}`}>
      HENERIS<span className="hn-logo-dot">.</span>
    </span>
  );

  if (to === null) return inner;

  return (
    <Link to={to} className="hn-logo-link" onClick={onClick}>
      {inner}
    </Link>
  );
}