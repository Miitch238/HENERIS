import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/legal-doc";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Heneris collecte, utilise et protège vos données personnelles, conformément au RGPD.",
};

export default function ConfidentialitePage() {
  return (
    <LegalDoc title="Politique de confidentialité" updated="30 août 2026">
      <p>
        Cette politique explique quelles données personnelles Heneris traite,
        pourquoi, combien de temps, et quels sont vos droits. Elle s&apos;applique
        au site heneris.com et à ses services.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        [À COMPLÉTER — raison sociale], éditeur de heneris.com. Contact&nbsp;:
        confidentialite@heneris.com.
      </p>

      <h2>Données collectées</h2>
      <h3>Lors de la création d&apos;un compte</h3>
      <ul>
        <li>Prénom, nom, adresse e-mail, mot de passe (stocké sous forme chiffrée).</li>
        <li>Rôle choisi (client ou personal shopper).</li>
      </ul>
      <h3>Pour les personal shoppers</h3>
      <ul>
        <li>Titre, biographie, spécialités, styles, fourchette de prix, ville, disponibilité.</li>
        <li>Photo de profil et images de portfolio.</li>
      </ul>
      <h3>Lors de l&apos;utilisation de la messagerie</h3>
      <ul>
        <li>Contenu des messages échangés, date et statut de lecture.</li>
        <li>Éléments du « besoin » (catégorie, budget, délai, description) que vous choisissez de renseigner.</li>
      </ul>
      <h3>Avis</h3>
      <ul>
        <li>Note et commentaire que vous publiez, associés à votre prénom et à l&apos;initiale de votre nom.</li>
      </ul>
      <h3>Données techniques</h3>
      <ul>
        <li>Cookie de session nécessaire à votre connexion.</li>
        <li>Journaux serveur (adresse IP, date, page consultée) conservés à des fins de sécurité.</li>
      </ul>

      <h2>Finalités et bases légales</h2>
      <ul>
        <li><strong>Fournir le service</strong> (compte, annuaire, messagerie, avis)&nbsp;: exécution du contrat.</li>
        <li><strong>Sécurité et prévention des abus</strong>&nbsp;: intérêt légitime.</li>
        <li><strong>Modération des profils</strong> avant publication&nbsp;: intérêt légitime et exécution du contrat.</li>
        <li><strong>Réponse à vos demandes</strong> via le formulaire de contact&nbsp;: intérêt légitime.</li>
      </ul>
      <p>
        Heneris n&apos;utilise pas vos données à des fins publicitaires et ne les
        vend pas.
      </p>

      <h2>Destinataires</h2>
      <p>Vos données sont accessibles&nbsp;:</p>
      <ul>
        <li>à vous-même et à votre interlocuteur pour ce qui relève de vos échanges&nbsp;;</li>
        <li>au public pour les informations que les personal shoppers choisissent de publier (profil, portfolio, avis reçus)&nbsp;;</li>
        <li>à l&apos;équipe Heneris pour la modération et le support&nbsp;;</li>
        <li>à nos sous-traitants techniques&nbsp;: <strong>Supabase</strong> (base de données, authentification, stockage — hébergement UE) et <strong>Vercel</strong> (hébergement du site).</li>
      </ul>

      <h2>Durées de conservation</h2>
      <ul>
        <li>Compte et profil&nbsp;: tant que le compte est actif, puis suppression sous 30&nbsp;jours après demande de fermeture.</li>
        <li>Messages&nbsp;: pendant la durée de vie du compte des participants.</li>
        <li>Avis&nbsp;: tant que le profil concerné existe.</li>
        <li>Journaux techniques&nbsp;: 12&nbsp;mois maximum.</li>
      </ul>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
        rectification, d&apos;effacement, de limitation, d&apos;opposition et de
        portabilité. Vous pouvez retirer votre consentement à tout moment
        lorsqu&apos;il constitue la base du traitement.
      </p>
      <p>
        Pour exercer ces droits&nbsp;: confidentialite@heneris.com. Vous pouvez
        aussi introduire une réclamation auprès de la <strong>CNIL</strong>
        (<a href="https://www.cnil.fr">cnil.fr</a>).
      </p>

      <h2>Sécurité</h2>
      <p>
        Les échanges avec le site sont chiffrés (HTTPS). L&apos;accès aux
        données est restreint par des règles de sécurité au niveau de la base
        (Row Level Security) et par authentification.
      </p>

      <h2>Modifications</h2>
      <p>
        Cette politique peut évoluer. La date de dernière mise à jour figure en
        haut de page&nbsp;; les changements importants vous seront notifiés.
      </p>
    </LegalDoc>
  );
}
