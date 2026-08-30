# Marque Heneris — assets

Reconstruction vectorielle du wordmark **HENERIS.** — voir [[heneris-mvp-decisions]] point 8.

## Fichiers

| Fichier | Usage |
|---|---|
| `logo.svg` | Wordmark principal — texte noir `#111111` + point or `#C9A84B`. Fonds clairs. |
| `logo-mono.svg` | Wordmark en `currentColor` + point or. Pour fonds sombres : définir `color` en CSS (ex. ivoire `#F1EBDC`). |
| `logo-regular.svg` | Variante moins grasse (Playfair Display 700 au lieu de 900). Alternative si le 900 paraît trop lourd. |
| `favicon.svg` | Lockup court « H. » (H + point or), cadrage carré. Identique à `app/icon.svg` (favicon Next) ; sert aussi d'icône PWA et d'avatar. |

Tous les chemins sont dans `public/` → survivent au passage à Next.js.

## Ce que c'est / ce que ce n'est pas

- **Reconstruction**, pas le logo d'origine. Lettres tracées depuis **Playfair Display** (700 / 900), converties en tracés vectoriels (`<path>`) — donc redimensionnable à l'infini et indépendant de toute police installée.
- La police d'origine du logo n'était **pas** Playfair Display (serif plus sobre, moins contrasté). Choix assumé : le brief demande Playfair Display.
- Proportions calées sur le JPEG source (`WhatsApp Image 2026-05-16 at 02.52.36.jpeg`) : rapport largeur/hauteur ≈ 6,55 ; diamètre du point ≈ 0,26 × hauteur de capitale ; point posé sur la ligne de base, légèrement en débord.
- Le point or est un vrai cercle (`<circle>`), couleur exacte **`#C9A84B`**.

Pour un logo custom définitif (fait par un designer), ces fichiers restent le repère de proportions et de couleur.

## Recolorer

- `logo.svg` : changer les attributs `fill` (`#111111` pour le texte, `#C9A84B` pour le point).
- `logo-mono.svg` : le texte suit `currentColor` (hérité du CSS) ; seul le point est fixé en or.

## Régénérer

Script de génération : `scratchpad/logo-build/` (opentype.js + Playfair Display 700/900 en WOFF). Non versionné.
