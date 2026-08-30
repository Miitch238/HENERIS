import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQ.css';

const SECTIONS = [
  {
    titre: 'Comment ça marche',
    questions: [
      {
        q: "Qu'est-ce qu'Hénéris ?",
        a: "Hénéris est une plateforme européenne de personal shopping luxe. Elle met en relation des clients souhaitant acquérir des articles de luxe authentiques avec des Personal Shoppers certifiés — des experts indépendants qui sourcent, authentifient et livrent ces pièces pour vous.",
      },
      {
        q: "Comment se déroule une transaction sur Hénéris ?",
        a: "En 4 étapes : (1) le Client dépose une demande ou choisit un article dans le catalogue, (2) un Personal Shopper certifié fait une proposition, (3) le Client valide et paie — le montant est placé en séquestre sécurisé, (4) à la réception confirmée, les fonds sont libérés au Shopper. Hénéris garantit la sécurité de chaque étape.",
      },
      {
        q: "Hénéris vend-il lui-même des articles ?",
        a: "Non. Hénéris est un intermédiaire technique. Les articles sont sourcés et vendus exclusivement par les Personal Shoppers certifiés. Hénéris ne détient aucun stock et n'est pas partie à la transaction entre le Client et le Shopper.",
      },
      {
        q: "Dans quels pays Hénéris est-il disponible ?",
        a: "La plateforme est accessible depuis tous les pays de l'Union Européenne. Les Personal Shoppers doivent être résidents en UE. Les livraisons peuvent être effectuées selon les conditions définies par chaque Shopper.",
      },
    ],
  },
  {
    titre: 'Devenir Personal Shopper',
    questions: [
      {
        q: "Comment devenir Personal Shopper sur Hénéris ?",
        a: "Créez un compte Shopper et soumettez votre dossier de certification. Celui-ci comprend : une pièce d'identité + selfie, la preuve de votre résidence en UE, votre expertise dans le luxe, un compte Instagram ou TikTok actif dans cet univers, et vos coordonnées bancaires (IBAN). Hénéris examine chaque dossier manuellement sous 24 heures.",
      },
      {
        q: "La certification Hénéris est-elle payante ?",
        a: "Non. La certification et l'inscription sont entièrement gratuites. Hénéris se rémunère uniquement par une commission de 10 % prélevée sur chaque transaction réalisée.",
      },
      {
        q: "Combien puis-je gagner en tant que Personal Shopper ?",
        a: "Vous percevez 90 % du montant de chaque transaction. Les fonds sont virés sur votre compte bancaire via Mangopay après confirmation de livraison par le client, dans un délai de 2 à 5 jours ouvrés.",
      },
      {
        q: "Ma certification peut-elle être révoquée ?",
        a: "Oui. Hénéris peut suspendre ou révoquer la certification en cas de vente d'articles contrefaits, de fraude avérée, de manquements répétés aux CGU ou d'atteinte à la réputation de la plateforme. Consultez les Règles d'utilisation pour le détail des sanctions.",
      },
    ],
  },
  {
    titre: 'Paiement et sécurité',
    questions: [
      {
        q: "Quels moyens de paiement sont acceptés ?",
        a: "Hénéris accepte les cartes bancaires Visa, Mastercard et American Express. Les paiements sont traités par Mangopay, prestataire de services de paiement agréé, basé au Luxembourg. Aucune donnée de carte n'est conservée par Hénéris.",
      },
      {
        q: "Comment fonctionne le système d'escrow (séquestre) ?",
        a: "Dès la confirmation de votre commande, le montant total est débité et placé sur un compte séquestre sécurisé géré par Mangopay — ni le Shopper ni Hénéris n'y ont accès. Les fonds ne sont libérés au Shopper qu'après que vous ayez confirmé la réception de l'article sur la plateforme, ou au terme d'un délai maximal de 72 heures sans contestation de votre part.",
      },
      {
        q: "Mes paiements sont-ils sécurisés ?",
        a: "Oui. Toutes les transactions sont chiffrées en TLS. Mangopay est régulé par la Banque centrale du Luxembourg et opère sous passeport européen. Hénéris ne stocke aucune donnée bancaire.",
      },
      {
        q: "Quelle est la commission d'Hénéris ?",
        a: "Hénéris prélève 10 % du montant de la transaction, à la charge du Client. Cette commission est affichée de façon transparente avant toute validation de commande. Le Shopper perçoit les 90 % restants.",
      },
    ],
  },
  {
    titre: 'Suivi de commande',
    questions: [
      {
        q: "Comment suivre ma commande ?",
        a: "Connectez-vous à votre espace Client et rendez-vous dans la section « Suivi ». Vous y retrouvez l'état de chaque commande (proposition acceptée, article trouvé, expédié, livré) ainsi que le numéro de suivi fourni par le Shopper.",
      },
      {
        q: "Dans quel délai vais-je recevoir mon article ?",
        a: "Le délai est défini lors de la proposition du Shopper et accepté par vous avant paiement. Il varie selon la nature de l'article, sa disponibilité et le pays de livraison. En cas de retard non justifié, contactez le support Hénéris depuis votre espace client.",
      },
      {
        q: "Que faire si mon article n'arrive pas ?",
        a: "Si vous n'avez pas reçu votre article dans le délai convenu, ouvrez un litige depuis votre espace client. Hénéris intervient en tant que médiateur. Tant que la livraison n'est pas confirmée, les fonds restent bloqués en séquestre — vous êtes protégé.",
      },
      {
        q: "Comment confirmer la réception de mon article ?",
        a: "Après réception, rendez-vous dans « Suivi », sélectionnez la commande concernée et cliquez sur « Confirmer la réception ». Vous disposez de 72 heures après la livraison pour signaler un problème. Passé ce délai sans contestation, les fonds sont automatiquement libérés au Shopper.",
      },
    ],
  },
  {
    titre: 'Remboursements et litiges',
    questions: [
      {
        q: "Puis-je me rétracter après une commande ?",
        a: "Oui. Conformément à l'article L.221-18 du Code de la consommation, vous disposez d'un délai de 14 jours à compter de la réception pour exercer votre droit de rétractation, sous réserve que l'article soit retourné dans son état d'origine avec tous ses accessoires.",
      },
      {
        q: "L'article reçu ne correspond pas à la description — que faire ?",
        a: "Ouvrez un litige depuis votre espace client dans les 72 heures suivant la réception. Fournissez des photos et une description précise du problème. Hénéris examine le dossier et peut décider d'un remboursement total ou partiel, ou d'une médiation entre les parties.",
      },
      {
        q: "Comment signaler un article potentiellement contrefait ?",
        a: "Signalez-le immédiatement via le bouton « Signaler » disponible sur la commande ou par email à support@heneris.com. Ne confirmez pas la réception si vous avez un doute fondé sur l'authenticité. Les fonds resteront bloqués jusqu'à résolution du litige.",
      },
      {
        q: "Qui prend en charge les frais de retour ?",
        a: "Les frais de retour sont à la charge du Client en cas d'exercice du droit de rétractation (article conforme à la description). Si l'article est non conforme ou potentiellement contrefait, les frais de retour sont pris en charge par Hénéris.",
      },
    ],
  },
];

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(v => !v)}>
        <span>{q}</span>
        <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="faq-answer"><p>{a}</p></div>}
    </div>
  );
}

export default function FAQ() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="faq-root">
      {/* Header */}
      <header className="faq-header">
        <Link to="/" className="faq-logo">Heneris</Link>
        <Link to="/" className="faq-back">← Retour à l'accueil</Link>
      </header>

      {/* Hero */}
      <div className="faq-hero">
        <p className="faq-eyebrow">Centre d'aide</p>
        <h1 className="faq-title">Questions fréquentes</h1>
        <p className="faq-subtitle">Tout ce que vous devez savoir sur la plateforme Hénéris.</p>
      </div>

      {/* Navigation sections */}
      <div className="faq-nav">
        {SECTIONS.map((s, i) => (
          <button
            key={i}
            className={`faq-nav-btn ${activeSection === i ? 'faq-nav-btn--active' : ''}`}
            onClick={() => setActiveSection(activeSection === i ? null : i)}
          >
            {s.titre}
          </button>
        ))}
      </div>

      {/* Questions */}
      <main className="faq-main">
        {SECTIONS.map((section, si) => (
          <section
            key={si}
            className="faq-section"
            style={{ display: activeSection === null || activeSection === si ? 'block' : 'none' }}
          >
            <h2 className="faq-section-title">{section.titre}</h2>
            <div className="faq-list">
              {section.questions.map((item, qi) => (
                <AccordionItem key={qi} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* CTA */}
      <div className="faq-cta-block">
        <p className="faq-cta-text">Vous n'avez pas trouvé votre réponse ?</p>
        <a href="mailto:support@heneris.com" className="faq-cta-btn">Contacter le support</a>
      </div>

      {/* Footer */}
      <footer className="faq-footer">
        <span className="faq-footer-logo">Heneris</span>
        <nav className="faq-footer-nav">
          <Link to="/cgu">CGU</Link>
          <Link to="/cgv">CGV</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/confidentialite">Confidentialité</Link>
          <Link to="/cookies">Cookies</Link>
        </nav>
        <span className="faq-footer-copy">© {new Date().getFullYear()} Hénéris</span>
      </footer>
    </div>
  );
}
