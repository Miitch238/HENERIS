import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/legal-doc";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales relatives à Heneris et à l'éditeur du site heneris.com.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalDoc title="Mentions légales" updated="30 août 2026">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>heneris.com</strong> est édité par&nbsp;:
      </p>
      <ul>
        <li>Raison sociale&nbsp;: [À COMPLÉTER]</li>
        <li>Forme juridique et capital social&nbsp;: [À COMPLÉTER]</li>
        <li>Siège social&nbsp;: [À COMPLÉTER]</li>
        <li>SIREN / SIRET&nbsp;: [À COMPLÉTER]</li>
        <li>Numéro de TVA intracommunautaire&nbsp;: [À COMPLÉTER]</li>
        <li>Adresse e-mail&nbsp;: contact@heneris.com</li>
        <li>Directeur de la publication&nbsp;: [À COMPLÉTER]</li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave
        #4133, Walnut, CA 91789, États-Unis — <a href="https://vercel.com">vercel.com</a>.
      </p>
      <p>
        Les données de la plateforme (comptes, profils, messages) sont stockées
        par <strong>Supabase</strong> sur une infrastructure située dans
        l&apos;Union européenne.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        La marque Heneris, le logo, la charte graphique et l&apos;ensemble des
        contenus produits par l&apos;éditeur sont protégés. Toute reproduction
        sans autorisation est interdite. Les contenus publiés par les
        utilisateurs (photos de portfolio, textes de profil, messages) restent
        la propriété de leurs auteurs, qui concèdent à Heneris une licence
        d&apos;affichage sur la plateforme.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Heneris est un service de mise en relation. L&apos;éditeur n&apos;est
        pas partie aux échanges ni aux éventuelles transactions conclues entre
        clients et personal shoppers, et ne saurait être tenu responsable de
        leur exécution.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question&nbsp;: <a href="/contact">page contact</a> ou
        contact@heneris.com.
      </p>
    </LegalDoc>
  );
}
