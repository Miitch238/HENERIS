import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/legal-doc";

export const metadata: Metadata = {
  title: "Gestion des cookies",
  description: "Les cookies utilisés par Heneris et vos choix.",
};

export default function CookiesPage() {
  return (
    <LegalDoc title="Gestion des cookies" updated="30 août 2026">
      <p>
        Un cookie est un petit fichier déposé sur votre appareil lors de la
        visite d&apos;un site. Heneris en utilise le minimum.
      </p>

      <h2>Cookies strictement nécessaires</h2>
      <p>
        Ces cookies sont indispensables au fonctionnement du site et ne
        nécessitent pas votre consentement&nbsp;:
      </p>
      <ul>
        <li>
          <strong>Cookie de session</strong> (Supabase Auth)&nbsp;: vous maintient
          connecté d&apos;une page à l&apos;autre. Durée&nbsp;: la session, ou
          jusqu&apos;à déconnexion.
        </li>
      </ul>

      <h2>Mesure d&apos;audience et publicité</h2>
      <p>
        À ce jour, Heneris <strong>n&apos;utilise aucun outil de mesure
        d&apos;audience, de traçage publicitaire ou de réseau social</strong>.
        Aucun cookie non essentiel n&apos;est déposé.
      </p>
      <p>
        Si cela devait changer, un bandeau vous permettra d&apos;
        <strong>accepter ou de refuser</strong> ces cookies, le refus étant
        aussi simple que l&apos;acceptation, et aucun dépôt n&apos;aura lieu
        avant votre choix.
      </p>

      <h2>Stockage local</h2>
      <p>
        Le site peut mémoriser dans votre navigateur (<code>localStorage</code>)
        de petites préférences d&apos;affichage. Ces informations restent sur
        votre appareil et ne sont pas transmises à Heneris.
      </p>

      <h2>Vos choix</h2>
      <p>
        Vous pouvez à tout moment configurer votre navigateur pour bloquer ou
        supprimer les cookies. Le blocage du cookie de session vous empêchera de
        rester connecté.
      </p>
    </LegalDoc>
  );
}
