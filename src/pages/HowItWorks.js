import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.css';

const CLIENT_STEPS = [
  {
    n: '01',
    titre: 'Créez votre compte Client',
    desc: 'Inscription gratuite en quelques minutes. Renseignez vos informations, choisissez le rôle Client et accédez immédiatement à la plateforme.',
  },
  {
    n: '02',
    titre: 'Déposez une demande ou explorez le catalogue',
    desc: 'Décrivez précisément l\'article que vous recherchez — marque, modèle, état, budget, délai — ou parcourez les articles déjà sourcés par nos Personal Shoppers certifiés.',
  },
  {
    n: '03',
    titre: 'Recevez et acceptez une proposition',
    desc: 'Un Personal Shopper expert répond à votre demande avec un prix, un délai et un message personnalisé. Échangez via la messagerie intégrée avant de valider.',
  },
  {
    n: '04',
    titre: 'Payez en toute sécurité',
    desc: 'Le montant est débité et placé en séquestre sécurisé via Mangopay. Ni le Shopper ni Hénéris n\'y ont accès tant que vous n\'avez pas confirmé la réception.',
  },
  {
    n: '05',
    titre: 'Recevez votre article',
    desc: 'Le Shopper source, authentifie et expédie votre pièce dans le délai convenu. Vous suivez chaque étape en temps réel depuis votre espace personnel.',
  },
  {
    n: '06',
    titre: 'Confirmez la réception',
    desc: 'À réception, inspectez l\'article et confirmez sur la plateforme. Les fonds sont alors libérés au Shopper. En cas de problème, ouvrez un litige — vous êtes protégé.',
  },
];

const SHOPPER_STEPS = [
  {
    n: '01',
    titre: 'Soumettez votre candidature',
    desc: 'Renseignez votre dossier de certification : pièce d\'identité, preuve de résidence en UE, expertise luxe, compte Instagram ou TikTok actif, coordonnées bancaires (IBAN).',
  },
  {
    n: '02',
    titre: 'Obtenez votre certification Hénéris',
    desc: 'Hénéris examine chaque dossier manuellement sous 24 heures. Une fois certifié, vous accédez à l\'espace Personal Shopper et pouvez commencer à proposer vos services.',
  },
  {
    n: '03',
    titre: 'Répondez aux demandes ou publiez des articles',
    desc: 'Parcourez le marché des demandes clients et faites des propositions sur les missions qui correspondent à votre expertise. Vous pouvez aussi publier des articles directement dans le catalogue.',
  },
  {
    n: '04',
    titre: 'Sourcez et authentifiez l\'article',
    desc: 'Une fois votre proposition acceptée et le paiement sécurisé, sourcez l\'article auprès de vos réseaux. Vous êtes garant de son authenticité et de sa conformité à la description.',
  },
  {
    n: '05',
    titre: 'Expédiez avec soin',
    desc: 'Emballez l\'article avec le soin que mérite une pièce de luxe. Fournissez un numéro de suivi dans les 24 heures suivant l\'expédition. Assurez la pièce pour sa valeur totale.',
  },
  {
    n: '06',
    titre: 'Recevez vos gains',
    desc: 'Après confirmation de réception par le client, 90 % du montant de la transaction est viré sur votre compte bancaire via Mangopay sous 2 à 5 jours ouvrés. La commission Hénéris (10 %) est automatiquement déduite.',
  },
];

const GUARANTEES = [
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, titre: 'Paiement sécurisé', desc: 'Séquestre Mangopay — vos fonds sont protégés jusqu\'à confirmation de livraison.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>, titre: 'Shoppers certifiés', desc: 'Chaque Personal Shopper est vérifié manuellement par Hénéris avant toute activation.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, titre: 'Support dédié', desc: 'Une équipe disponible pour médier tout litige et vous accompagner à chaque étape.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, titre: 'Commission transparente', desc: '10 % affiché avant validation — aucuns frais cachés, aucune surprise.' },
];

export default function HowItWorks() {
  const [tab, setTab] = useState('client');

  return (
    <div className="hiw-root">
      <header className="hiw-header">
        <Link to="/" className="hiw-logo">Heneris</Link>
        <div className="hiw-header-right">
          <Link to="/faq" className="hiw-back">FAQ</Link>
          <Link to="/contact" className="hiw-back">Contact</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="hiw-hero">
        <p className="hiw-eyebrow">La plateforme</p>
        <h1 className="hiw-title">Comment ça marche</h1>
        <p className="hiw-subtitle">Hénéris connecte les amateurs de luxe avec des experts certifiés qui sourcent, authentifient et livrent les pièces les plus rares.</p>
        <Link to="/register/client" className="hiw-hero-cta">Commencer — c'est gratuit</Link>
      </div>

      {/* Garanties */}
      <div className="hiw-guarantees">
        {GUARANTEES.map((g, i) => (
          <div key={i} className="hiw-guarantee">
            <div className="hiw-guarantee-icon">{g.icon}</div>
            <p className="hiw-guarantee-titre">{g.titre}</p>
            <p className="hiw-guarantee-desc">{g.desc}</p>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <main className="hiw-main">
        <div className="hiw-tabs">
          <button
            className={`hiw-tab ${tab === 'client' ? 'hiw-tab--active' : ''}`}
            onClick={() => setTab('client')}
          >
            Je suis Client
          </button>
          <button
            className={`hiw-tab ${tab === 'shopper' ? 'hiw-tab--active' : ''}`}
            onClick={() => setTab('shopper')}
          >
            Je suis Personal Shopper
          </button>
        </div>

        {tab === 'client' && (
          <div className="hiw-steps">
            <div className="hiw-steps-intro">
              <h2 className="hiw-steps-title">Le parcours Client</h2>
              <p className="hiw-steps-sub">De la demande à la livraison — sécurisé, transparent, garanti.</p>
            </div>
            <div className="hiw-steps-list">
              {CLIENT_STEPS.map((s, i) => (
                <div key={i} className="hiw-step">
                  <div className="hiw-step-left">
                    <span className="hiw-step-number">{s.n}</span>
                    {i < CLIENT_STEPS.length - 1 && <div className="hiw-step-line" />}
                  </div>
                  <div className="hiw-step-body">
                    <h3 className="hiw-step-titre">{s.titre}</h3>
                    <p className="hiw-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hiw-steps-cta">
              <Link to="/register/client" className="hiw-cta-btn hiw-cta-btn--primary">Créer un compte Client</Link>
              <Link to="/faq" className="hiw-cta-btn hiw-cta-btn--outline">Voir la FAQ</Link>
            </div>
          </div>
        )}

        {tab === 'shopper' && (
          <div className="hiw-steps">
            <div className="hiw-steps-intro">
              <h2 className="hiw-steps-title">Le parcours Personal Shopper</h2>
              <p className="hiw-steps-sub">Monétisez votre expertise du luxe et percevez 90 % de chaque transaction.</p>
            </div>
            <div className="hiw-steps-list">
              {SHOPPER_STEPS.map((s, i) => (
                <div key={i} className="hiw-step">
                  <div className="hiw-step-left">
                    <span className="hiw-step-number">{s.n}</span>
                    {i < SHOPPER_STEPS.length - 1 && <div className="hiw-step-line" />}
                  </div>
                  <div className="hiw-step-body">
                    <h3 className="hiw-step-titre">{s.titre}</h3>
                    <p className="hiw-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hiw-steps-cta">
              <Link to="/register/shopper" className="hiw-cta-btn hiw-cta-btn--primary">Devenir Personal Shopper</Link>
              <Link to="/faq" className="hiw-cta-btn hiw-cta-btn--outline">En savoir plus</Link>
            </div>
          </div>
        )}
      </main>

      {/* CTA final */}
      <div className="hiw-final">
        <h2 className="hiw-final-title">Prêt à commencer ?</h2>
        <p className="hiw-final-sub">Rejoignez la première plateforme européenne de personal shopping luxe.</p>
        <div className="hiw-final-btns">
          <Link to="/register/client" className="hiw-cta-btn hiw-cta-btn--primary">Je suis Client</Link>
          <Link to="/register/shopper" className="hiw-cta-btn hiw-cta-btn--gold">Je suis Personal Shopper</Link>
        </div>
      </div>

      <footer className="hiw-footer">
        <span className="hiw-footer-logo">Heneris</span>
        <nav className="hiw-footer-nav">
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cgu">CGU</Link>
          <Link to="/confidentialite">Confidentialité</Link>
        </nav>
        <span className="hiw-footer-copy">© {new Date().getFullYear()} Hénéris</span>
      </footer>
    </div>
  );
}
