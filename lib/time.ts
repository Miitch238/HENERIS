/**
 * `Date.now()` isolé hors d'un composant : appelé dans le rendu d'un Server
 * Component (page `/contact`, rendue en dynamique) pour horodater le formulaire,
 * ce que la règle `react-hooks/purity` interdit d'écrire directement dans le JSX.
 */
export const nowMs = (): number => Date.now();
