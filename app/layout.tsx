import type { Metadata } from "next";
import { Playfair_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/**
 * Trois familles, trois rôles (voir public/brand/README.md) :
 *  - Playfair Display : titres et accroches, registre éditorial / mode
 *  - Inter            : interface et texte courant
 *  - IBM Plex Mono    : sur-titres, métadonnées, chiffres
 */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://heneris.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Heneris — Trouvez votre personal shopper",
    template: "%s · Heneris",
  },
  description:
    "Heneris met en relation des personal shoppers avec des clients, quel que soit votre budget. Trouvez la bonne personne, échangez, décidez.",
  applicationName: "Heneris",
  keywords: [
    "personal shopper",
    "personal shopper France",
    "conseil en achat",
    "conseil en style",
    "shopping accompagné",
    "marketplace personal shopper",
  ],
  authors: [{ name: "Heneris" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Heneris",
    url: SITE_URL,
    title: "Heneris — Trouvez votre personal shopper",
    description:
      "La marketplace qui met en relation personal shoppers et clients, tous budgets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heneris — Trouvez votre personal shopper",
    description:
      "La marketplace qui met en relation personal shoppers et clients, tous budgets.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-ground text-ink">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-[0.85rem] focus:text-ground"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
