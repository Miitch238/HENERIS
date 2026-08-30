import { Link } from 'react-router-dom';
import './Support.css';

const CHANNELS = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    titre: 'Email',
    valeur: 'contact@heneris.com',
    href: 'mailto:contact@heneris.com',
    delai: 'Réponse sous 24 h ouvrées',
    desc: 'Pour toute question générale, problème de commande ou demande d\'information sur nos services.',
    cta: 'Envoyer un email',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    titre: 'Formulaire de contact',
    valeur: 'Via la page Contact',
    href: '/contact',
    delai: 'Réponse sous 24 h ouvrées',
    desc: 'Utilisez notre formulaire pour nous écrire directement avec votre sujet et votre message.',
    cta: 'Accéder au formulaire',
    internal: true,
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    titre: 'FAQ',
    valeur: 'Centre d\'aide',
    href: '/faq',
    delai: 'Réponse immédiate',
    desc: 'Parcourez nos questions fréquentes — comment ça marche, paiements, livraison, shoppers.',
    cta: 'Consulter la FAQ',
    internal: true,
  },
];

const TOPICS = [
  { icon: '📦', titre: 'Commande & livraison', desc: 'Suivi, délais, problème de réception, retours.', lien: '/faq' },
  { icon: '💳', titre: 'Paiement & facturation', desc: 'Escrow, remboursement, commission, factures.', lien: '/faq' },
  { icon: '🛍️', titre: 'Devenir Personal Shopper', desc: 'Certification, inscription, gains, Mangopay.', lien: '/faq' },
  { icon: '⚖️', titre: 'Litiges & signalements', desc: 'Contrefaçon, article non conforme, médiation.', lien: '/contact' },
  { icon: '🔒', titre: 'Compte & sécurité', desc: 'Mot de passe, données personnelles, suppression.', lien: '/contact' },
  { icon: '📄', titre: 'Documents légaux', desc: 'CGU, CGV, confidentialité, règles d\'utilisation.', lien: '/cgu' },
];

export default function Support() {
  return (
    <div className="sp2-root">
      <header className="sp2-header">
        <Link to="/" className="sp2-logo">Heneris</Link>
        <Link to="/" className="sp2-back">← Retour à l'accueil</Link>
      </header>

      {/* Hero */}
      <div className="sp2-hero">
        <p className="sp2-eyebrow">Assistance</p>
        <h1 className="sp2-title">Support Hénéris</h1>
        <p className="sp2-subtitle">Notre équipe est disponible pour vous accompagner à chaque étape.</p>
      </div>

      <main className="sp2-main">

        {/* Canaux de contact */}
        <section className="sp2-section">
          <h2 className="sp2-section-title">Nous contacter</h2>
          <div className="sp2-channels">
            {CHANNELS.map((c, i) => (
              <div key={i} className="sp2-channel">
                <div className="sp2-channel-icon">{c.icon}</div>
                <div className="sp2-channel-body">
                  <p className="sp2-channel-titre">{c.titre}</p>
                  <p className="sp2-channel-valeur">{c.valeur}</p>
                  <p className="sp2-channel-desc">{c.desc}</p>
                  <div className="sp2-channel-delai">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {c.delai}
                  </div>
                </div>
                {c.internal
                  ? <Link to={c.href} className="sp2-channel-btn">{c.cta}</Link>
                  : <a href={c.href} className="sp2-channel-btn">{c.cta}</a>
                }
              </div>
            ))}
          </div>
        </section>

        {/* Sujets fréquents */}
        <section className="sp2-section">
          <h2 className="sp2-section-title">Sujets fréquents</h2>
          <div className="sp2-topics">
            {TOPICS.map((t, i) => (
              <Link key={i} to={t.lien} className="sp2-topic">
                <span className="sp2-topic-icon">{t.icon}</span>
                <div>
                  <p className="sp2-topic-titre">{t.titre}</p>
                  <p className="sp2-topic-desc">{t.desc}</p>
                </div>
                <svg className="sp2-topic-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            ))}
          </div>
        </section>

        {/* SLA */}
        <section className="sp2-section">
          <h2 className="sp2-section-title">Délais de réponse</h2>
          <div className="sp2-sla">
            {[
              { priorite: 'Urgente', type: 'Litige ou fraude en cours', delai: '< 4 heures', cls: 'sp2-sla-red' },
              { priorite: 'Haute',   type: 'Problème de commande ou paiement', delai: '< 8 heures ouvrées', cls: 'sp2-sla-yellow' },
              { priorite: 'Normale', type: 'Question générale ou information', delai: '< 24 heures ouvrées', cls: 'sp2-sla-green' },
            ].map(s => (
              <div key={s.priorite} className="sp2-sla-row">
                <span className={`sp2-sla-badge ${s.cls}`}>{s.priorite}</span>
                <span className="sp2-sla-type">{s.type}</span>
                <span className="sp2-sla-delai">{s.delai}</span>
              </div>
            ))}
          </div>
          <p className="sp2-sla-note">Le support est disponible du lundi au vendredi, de 9 h à 18 h (heure de Paris). Les demandes reçues en dehors de ces horaires sont traitées le jour ouvré suivant.</p>
        </section>

        {/* Liens utiles */}
        <section className="sp2-section">
          <h2 className="sp2-section-title">Ressources utiles</h2>
          <div className="sp2-resources">
            {[
              { label: 'FAQ complète', to: '/faq', desc: '20 questions sur le fonctionnement d\'Hénéris' },
              { label: 'CGU', to: '/cgu', desc: 'Conditions d\'utilisation de la plateforme' },
              { label: 'CGV', to: '/cgv', desc: 'Conditions générales de vente' },
              { label: 'Règles d\'utilisation', to: '/regles', desc: 'Code de conduite Clients et Shoppers' },
              { label: 'Politique de confidentialité', to: '/confidentialite', desc: 'Traitement de vos données personnelles' },
            ].map(r => (
              <Link key={r.to} to={r.to} className="sp2-resource">
                <span className="sp2-resource-label">{r.label}</span>
                <span className="sp2-resource-desc">{r.desc}</span>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <footer className="sp2-footer">
        <span className="sp2-footer-logo">Heneris</span>
        <nav className="sp2-footer-nav">
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cgu">CGU</Link>
          <Link to="/confidentialite">Confidentialité</Link>
        </nav>
        <span className="sp2-footer-copy">© {new Date().getFullYear()} Hénéris</span>
      </footer>
    </div>
  );
}
