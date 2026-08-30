import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/legal-doc";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Les règles d'utilisation de la plateforme Heneris.",
};

export default function CguPage() {
  return (
    <LegalDoc title="Conditions générales d'utilisation" updated="30 août 2026">
      <h2>1. Objet</h2>
      <p>
        Heneris est une plateforme qui met en relation des <strong>clients</strong>
        {" "}à la recherche d&apos;un accompagnement pour leurs achats et des
        {" "}<strong>personal shoppers</strong> proposant leurs services. Heneris
        fournit l&apos;annuaire, les profils, la messagerie et le système
        d&apos;avis. Heneris n&apos;intervient pas dans les prestations
        elles-mêmes.
      </p>

      <h2>2. Compte</h2>
      <p>
        La création d&apos;un compte requiert une adresse e-mail valide et
        l&apos;acceptation des présentes CGU. Vous êtes responsable de la
        confidentialité de vos identifiants et de l&apos;exactitude des
        informations fournies. Un compte est strictement personnel.
      </p>

      <h2>3. Personal shoppers</h2>
      <p>
        Tout profil de personal shopper est <strong>relu par l&apos;équipe
        Heneris</strong> avant d&apos;être publié dans l&apos;annuaire. Heneris
        peut refuser, suspendre ou retirer un profil qui ne respecte pas les
        présentes règles, sans que cela ouvre droit à indemnité. Le personal
        shopper s&apos;engage à décrire son activité de façon honnête et à
        répondre aux demandes qu&apos;il accepte avec sérieux.
      </p>

      <h2>4. Comportement des utilisateurs</h2>
      <p>Il est notamment interdit&nbsp;:</p>
      <ul>
        <li>de publier des contenus illégaux, trompeurs, diffamatoires ou portant atteinte aux droits de tiers&nbsp;;</li>
        <li>d&apos;utiliser la messagerie à des fins de démarchage, de harcèlement ou de spam&nbsp;;</li>
        <li>de contourner la plateforme pour dissimuler une activité contraire aux présentes CGU&nbsp;;</li>
        <li>de publier de faux avis ou de manipuler la notation.</li>
      </ul>

      <h2>5. Avis</h2>
      <p>
        Un client peut publier <strong>un avis par personal shopper</strong>,
        après avoir entamé une conversation avec lui. Les avis doivent refléter
        une expérience réelle. Heneris peut retirer un avis manifestement
        abusif.
      </p>

      <h2>6. Modèle économique</h2>
      <p>
        À ce jour, l&apos;utilisation de la plateforme est <strong>gratuite</strong>
        {" "}pour les clients comme pour les personal shoppers. Heneris ne gère
        aucun paiement entre utilisateurs. Toute évolution (commission,
        abonnement, paiement intégré) fera l&apos;objet d&apos;une information
        préalable et, le cas échéant, d&apos;une mise à jour des présentes CGU.
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        Heneris met en œuvre les moyens raisonnables pour assurer la
        disponibilité et la sécurité du service, sans garantie
        d&apos;absence d&apos;interruption. Heneris n&apos;est pas responsable
        des prestations réalisées par les personal shoppers, des sommes
        échangées en dehors de la plateforme, ni des différends entre
        utilisateurs.
      </p>

      <h2>8. Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans la{" "}
        <a href="/legal/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>9. Résiliation</h2>
      <p>
        Vous pouvez fermer votre compte à tout moment. Heneris peut suspendre
        ou fermer un compte en cas de manquement aux présentes CGU.
      </p>

      <h2>10. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au droit français. À défaut de
        résolution amiable, tout litige relève des tribunaux compétents.
      </p>
    </LegalDoc>
  );
}
