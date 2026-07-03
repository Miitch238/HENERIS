import { Link } from 'react-router-dom';
import './GuestBlock.css';

export default function GuestBlock({ icon, title, subtitle }) {
  return (
    <div className="guest-wrapper">
      <div className="guest-block">
        <div className="guest-icon">{icon}</div>
        <h2 className="guest-title">{title}</h2>
        <p className="guest-sub">{subtitle}</p>
        <Link to="/login" className="guest-btn">Se connecter</Link>
        <p className="guest-register">
          Pas encore de compte ?{' '}
          <Link to="/register/client" className="guest-register-link">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}